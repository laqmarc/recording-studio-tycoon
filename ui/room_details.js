import { state, installedIds, installToRoom, uninstallItemFromRoom, getRoomEffective, getRoomSlotCapacity } from '../state.js';
import { euro, xpToNext, invQty, invRemove, invAdd, log, showNotification } from '../helpers.js';
import { clearChildren, createArt, formatStatKey, getItemArt, getRoomArt, getTopStats } from './shared.js';
import { renderSignalFlowOverlay } from './room_visuals.js';
import { calcRoomRepairCost, repairRoomItems } from './room_maintenance.js';

const dragState = { itemId: null, source: null, category: null, index: null };
let audioCtx = null;

function ensureRoomLayout(roomIndex, category, maxSlots, bagIds) {
  state.ui = state.ui || {};
  state.ui.roomLayout = state.ui.roomLayout || {};
  const roomLayout = state.ui.roomLayout[roomIndex] || (state.ui.roomLayout[roomIndex] = {});
  let layout = roomLayout[category];
  if (!Array.isArray(layout) || layout.length !== maxSlots) {
    layout = Array.from({ length: maxSlots }, () => null);
  }
  const counts = new Map();
  for (const id of bagIds) counts.set(id, (counts.get(id) || 0) + 1);
  layout = layout.map(id => {
    const c = counts.get(id) || 0;
    if (id && c > 0) {
      counts.set(id, c - 1);
      return id;
    }
    return null;
  });
  for (const id of bagIds) {
    const c = counts.get(id) || 0;
    if (c > 0) {
      const emptyIdx = layout.findIndex(x => !x);
      if (emptyIdx !== -1) {
        layout[emptyIdx] = id;
        counts.set(id, c - 1);
      }
    }
  }
  roomLayout[category] = layout;
  state.ui.roomLayout[roomIndex] = roomLayout;
  return layout;
}

function setLayoutItem(roomIndex, category, itemId, targetIndex) {
  const room = state.db.rooms[roomIndex];
  const maxSlots = Number((room && room.slots && room.slots[category]) || 0);
  const bagIds = installedIds(roomIndex, category);
  const layout = ensureRoomLayout(roomIndex, category, maxSlots, bagIds);
  const currentIdx = layout.indexOf(itemId);
  if (currentIdx !== -1) layout[currentIdx] = null;
  if (targetIndex != null && targetIndex >= 0 && targetIndex < layout.length) {
    if (!layout[targetIndex]) {
      layout[targetIndex] = itemId;
    } else {
      const other = layout[targetIndex];
      layout[targetIndex] = itemId;
      if (currentIdx !== -1) layout[currentIdx] = other;
    }
  } else {
    const emptyIdx = layout.findIndex(x => !x);
    if (emptyIdx !== -1) layout[emptyIdx] = itemId;
  }
  state.ui.roomLayout[roomIndex][category] = layout;
}

function removeLayoutItem(roomIndex, category, itemId, index) {
  const room = state.db.rooms[roomIndex];
  const maxSlots = Number((room && room.slots && room.slots[category]) || 0);
  const bagIds = installedIds(roomIndex, category).filter(id => id !== itemId);
  const layout = ensureRoomLayout(roomIndex, category, maxSlots, bagIds);
  let idx = typeof index === 'number' ? index : layout.indexOf(itemId);
  if (idx !== -1 && layout[idx] === itemId) layout[idx] = null;
  state.ui.roomLayout[roomIndex][category] = layout;
}

function getDraggedItemId(e) {
  if (dragState.itemId) return dragState.itemId;
  if (e && e.dataTransfer) return e.dataTransfer.getData('text/plain');
  return null;
}

function setDragState(itemId, source, category) {
  dragState.itemId = itemId;
  dragState.source = source || null;
  dragState.category = category || null;
  dragState.index = null;
}

function clearDragState() {
  dragState.itemId = null;
  dragState.source = null;
  dragState.category = null;
  dragState.index = null;
}

function playSnapSound() {
  try {
    if (typeof window !== 'undefined' && typeof window.playClick === 'function') {
      window.playClick(0.02);
    }
    if (typeof window === 'undefined') return;
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) { /* ignore audio errors */ }
}

function triggerSnap(el) {
  if (!el) return;
  el.classList.add('snap');
  setTimeout(() => { el.classList.remove('snap'); }, 260);
}

function canDropItem(roomIndex, category, itemId) {
  const eff = getRoomEffective(roomIndex);
  const room = eff.room;
  const item = state.itemsById.get(itemId);
  if (!room) return { ok: false, reason: 'Sala no trobada' };
  if (!item) return { ok: false, reason: 'Item no trobat' };
  const itemCat = item.category || 'misc';
  if (itemCat !== category) return { ok: false, reason: `Slot ${category} requerit` };
  if (invQty(itemId) <= 0) return { ok: false, reason: 'No tens aquest item' };
  const max = getRoomSlotCapacity(roomIndex, category);
  const used = installedIds(roomIndex, category).length;
  if (used >= max) return { ok: false, reason: `No hi ha slots de ${category}` };
  return { ok: true, item, used, max };
}

function installItemToRoom(roomIndex, itemId, targetIndex, renderAll) {
  const item = state.itemsById.get(itemId);
  if (!item) return { ok: false, reason: 'Item no trobat' };
  const category = item.category || 'misc';
  const res = installToRoom(roomIndex, category, itemId);
  if (!res.ok) return { ok: false, reason: res.reason || 'No es pot instal·lar' };
  const removed = invRemove(itemId, 1);
  if (!removed) return { ok: false, reason: 'Inventari insuficient' };
  setLayoutItem(roomIndex, category, itemId, targetIndex);
  const room = state.db.rooms[roomIndex];
  log(`🧩 Instal·lat a ${room.name}: ${item.name} (${category})`);
  showNotification(`🧩 Instal·lat: ${item.name}`);
  if (typeof renderAll === 'function') renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return { ok: true };
}

function uninstallItemToInventory(roomIndex, category, itemId, renderAll) {
  const room = state.db.rooms[roomIndex];
  const res = uninstallItemFromRoom(roomIndex, category, itemId);
  if (!res.ok) return { ok: false, reason: res.reason || 'No es pot desinstal·lar' };
  removeLayoutItem(roomIndex, category, itemId, dragState.index);
  invAdd(itemId, 1);
  const item = state.itemsById.get(itemId);
  log(`↩️ Desinstal·lat de ${room.name}: ${item ? item.name : itemId} (${category})`);
  showNotification(`↩️ Desinstal·lat: ${item ? item.name : itemId}`);
  if (typeof renderAll === 'function') renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return { ok: true };
}

function getCompatibility(roomIndex, item) {
  if (!item) return { label: 'N/A', status: 'bad' };
  if (item.category === 'consumable') return { label: 'Consumible', status: 'ok' };
  const max = getRoomSlotCapacity(roomIndex, item.category);
  if (!max) return { label: 'Sense slot', status: 'bad' };
  const used = installedIds(roomIndex, item.category).length;
  if (used >= max) return { label: `Ple ${used}/${max}`, status: 'warn' };
  return { label: `OK ${used}/${max}`, status: 'ok' };
}

export function renderRoomDetails(options = {}) {
  const { renderRight, renderAll } = options;

  const effRoom = getRoomEffective(state.selected.roomIndex);
  const room = effRoom.room;
  const rightMeta = document.getElementById('rightMeta'); if (rightMeta) rightMeta.textContent = room ? room.name : '';

  const details = document.getElementById('roomDetails');
  clearChildren(details);
  if (!room) { const nm = document.createElement('div'); nm.className = 'muted'; nm.textContent = 'No hi ha sala.'; details.appendChild(nm); return; }

  const slots = effRoom.slots || {};
  const bag = state.roomsInstalled[state.selected.roomIndex] || {};
  const hero = document.createElement('div'); hero.className = 'room-hero';
  const heroImg = document.createElement('img'); heroImg.src = getRoomArt(room); heroImg.alt = `${room.name} art`;
  hero.appendChild(heroImg);
  const row = document.createElement('div'); row.className = 'row';
  const title = document.createElement('b'); title.style.fontSize = '16px'; title.textContent = room.name;
  const p = document.createElement('span'); p.className = 'pill'; p.textContent = room.type;
  row.appendChild(title); row.appendChild(p);

  const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
  meta.textContent = `${room.size_m2} m² · noise ${effRoom.noise_floor_db} dB · base acoustic ${effRoom.base_acoustic}`;

  const canvas = document.createElement('div'); canvas.className = 'room-canvas';
  const canvasHead = document.createElement('div'); canvasHead.className = 'room-canvas-head';
  const headLeft = document.createElement('div'); headLeft.className = 'room-canvas-meta';
  const infoBlock = document.createElement('div');
  infoBlock.appendChild(row); infoBlock.appendChild(meta);
  headLeft.appendChild(hero); headLeft.appendChild(infoBlock);
  canvasHead.appendChild(headLeft);
  const headActions = document.createElement('div'); headActions.className = 'room-canvas-actions';
  const flowBtn = document.createElement('button'); flowBtn.className = 'btn2 btnSmall';
  flowBtn.textContent = (state.ui && state.ui.showSignalFlow) ? 'Flow: ON' : 'Flow: OFF';
  flowBtn.addEventListener('click', () => {
    state.ui.showSignalFlow = !state.ui.showSignalFlow;
    flowBtn.textContent = state.ui.showSignalFlow ? 'Flow: ON' : 'Flow: OFF';
    if (typeof renderRight === 'function') renderRight();
    if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  });
  headActions.appendChild(flowBtn);
  canvasHead.appendChild(headActions);
  canvas.appendChild(canvasHead);

  const floorplan = document.createElement('div'); floorplan.className = 'floorplan';
  Object.keys(slots).sort().forEach(cat => {
    const max = Number(slots[cat] || 0);
    const bagIds = (bag[cat] || []);
    const occupancy = bagIds.length >= max ? 'full' : bagIds.length ? 'partial' : 'empty';
    const layout = ensureRoomLayout(state.selected.roomIndex, cat, max, bagIds);

    const zone = document.createElement('div'); zone.className = 'floor-zone';
    zone.dataset.category = cat;
    zone.dataset.occupancy = occupancy;

    const zoneHead = document.createElement('div'); zoneHead.className = 'floor-zone-head';
    const zb = document.createElement('b'); zb.textContent = cat;
    const zm = document.createElement('div'); zm.className = 'muted'; zm.textContent = `${bagIds.length}/${max}`;
    zoneHead.appendChild(zb); zoneHead.appendChild(zm);

    const meter = document.createElement('div'); meter.className = 'slot-meter';
    const meterFill = document.createElement('span'); meterFill.style.width = max ? `${Math.min(100, Math.round((bagIds.length / max) * 100))}%` : '0%';
    meter.appendChild(meterFill);

    const nodes = document.createElement('div'); nodes.className = 'floor-nodes';
    for (let i = 0; i < max; i++) {
      const node = document.createElement('div'); node.className = 'floor-node';
      node.dataset.category = cat;
      node.dataset.index = String(i);
      const isFilled = Boolean(layout[i]);
      node.dataset.filled = isFilled ? '1' : '0';
      if (isFilled) node.classList.add('filled');
      if (!isFilled) node.classList.add('empty');

      if (isFilled) {
        const id = layout[i];
        const it = state.itemsById.get(id);
        const token = document.createElement('div'); token.className = 'floor-token';
        token.setAttribute('draggable', 'true');
        const tokenImg = document.createElement('img'); tokenImg.src = getItemArt(it); tokenImg.alt = it ? it.name : id;
        const tokenName = document.createElement('div'); tokenName.className = 'floor-token-name';
        tokenName.textContent = it ? it.name : id;
        token.appendChild(tokenImg);
        token.appendChild(tokenName);
        token.addEventListener('dragstart', (e) => {
          setDragState(id, 'installed', cat);
          dragState.index = Number(node.dataset.index || 0);
          token.classList.add('dragging');
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', id);
            e.dataTransfer.effectAllowed = 'move';
          }
        });
        token.addEventListener('dragend', () => {
          token.classList.remove('dragging');
          clearDragState();
          document.querySelectorAll('.floor-node.drag-over').forEach(el => el.classList.remove('drag-over'));
          const drop = document.querySelector('.inventory-grid.drag-over');
          if (drop) drop.classList.remove('drag-over');
        });
        node.appendChild(token);
      } else {
        const hint = document.createElement('div'); hint.className = 'floor-node-hint'; hint.textContent = 'Drop';
        node.appendChild(hint);
      }

      node.addEventListener('dragover', (e) => {
        if (!dragState.source) return;
        if (dragState.source === 'installed' && dragState.category !== cat) return;
        const itemId = getDraggedItemId(e);
        if (!itemId) return;
        if (dragState.source === 'inventory') {
          if (node.dataset.filled === '1') return;
          const res = canDropItem(state.selected.roomIndex, cat, itemId);
          if (!res.ok) return;
          node.dataset.dropLabel = res.item ? res.item.name : itemId;
        } else {
          const item = state.itemsById.get(itemId);
          const label = node.dataset.filled === '1' ? 'Swap' : 'Moure';
          node.dataset.dropLabel = `${label} ${item ? item.name : ''}`.trim();
        }
        e.preventDefault();
        node.classList.add('drag-over');
      });
      node.addEventListener('dragleave', () => {
        node.classList.remove('drag-over');
        if (node.dataset && node.dataset.dropLabel) delete node.dataset.dropLabel;
      });
      node.addEventListener('drop', (e) => {
        e.preventDefault();
        node.classList.remove('drag-over');
        if (node.dataset && node.dataset.dropLabel) delete node.dataset.dropLabel;
        if (!dragState.source) return;
        const itemId = getDraggedItemId(e);
        if (!itemId) return;
        const targetIndex = Number(node.dataset.index || 0);
        if (dragState.source === 'inventory') {
          const res = canDropItem(state.selected.roomIndex, cat, itemId);
          if (!res.ok) {
            log(`❌ ${res.reason}`);
            return;
          }
          const ok = installItemToRoom(state.selected.roomIndex, itemId, targetIndex, renderAll);
          if (ok && ok.ok) { triggerSnap(node); playSnapSound(); }
        } else if (dragState.source === 'installed') {
          if (dragState.category !== cat) return;
          const fromIndex = Number(dragState.index || 0);
          const room = state.db.rooms[state.selected.roomIndex];
          const maxSlots = Number((room && room.slots && room.slots[cat]) || 0);
          const bagIds = installedIds(state.selected.roomIndex, cat);
          const layout = ensureRoomLayout(state.selected.roomIndex, cat, maxSlots, bagIds);
          if (fromIndex === targetIndex) return;
          const fromId = layout[fromIndex];
          const toId = layout[targetIndex];
          layout[fromIndex] = toId || null;
          layout[targetIndex] = fromId;
          state.ui.roomLayout[state.selected.roomIndex][cat] = layout;
          if (typeof renderAll === 'function') renderAll();
          triggerSnap(node);
          playSnapSound();
        }
      });

      nodes.appendChild(node);
    }

    zone.appendChild(zoneHead);
    zone.appendChild(meter);
    zone.appendChild(nodes);
    floorplan.appendChild(zone);
  });

  canvas.appendChild(floorplan);
  details.appendChild(canvas);
  requestAnimationFrame(() => renderSignalFlowOverlay(canvas, floorplan));

  const selCat = document.getElementById('selInvCategory');
  if (selCat && selCat.parentElement) selCat.parentElement.style.display = 'none';

  const owned = Array.from(state.inventory.keys()).map(id => state.itemsById.get(id)).filter(Boolean);

  const invList = document.getElementById('inventoryList');
  if (invList) {
    clearChildren(invList);
    if (!owned.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Inventari buit.';
      invList.appendChild(empty);
    } else {
      for (const it of owned) {
        const qty = invQty(it.id);
        const card = document.createElement('div');
        card.className = 'card inventory-card';
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
          setDragState(it.id, 'inventory', it.category);
          card.classList.add('dragging');
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', it.id);
            e.dataTransfer.effectAllowed = 'move';
          }
        });
        card.addEventListener('dragend', () => {
          clearDragState();
          card.classList.remove('dragging');
          document.querySelectorAll('.floor-node').forEach(el => {
            el.classList.remove('drag-over');
            if (el.dataset && el.dataset.dropLabel) delete el.dataset.dropLabel;
          });
        });

        const layout = document.createElement('div');
        layout.className = 'card-grid';
        const art = createArt(getItemArt(it), `${it.name} art`);
        const body = document.createElement('div');
        body.className = 'card-body';

        const row = document.createElement('div'); row.className = 'row';
        const b = document.createElement('b'); b.textContent = it.name;
        const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = `x${qty}`;
        row.appendChild(b); row.appendChild(pill);

        const row2 = document.createElement('div'); row2.className = 'row muted'; row2.style.marginTop = '6px';
        const catSpan = document.createElement('span'); catSpan.textContent = it.category;
        const compat = getCompatibility(state.selected.roomIndex, it);
        const compatSpan = document.createElement('span'); compatSpan.className = `compat-pill ${compat.status}`; compatSpan.textContent = compat.label;
        row2.appendChild(catSpan); row2.appendChild(compatSpan);

        const notes = document.createElement('div'); notes.className = 'tiny'; notes.style.marginTop = '6px';
        notes.textContent = it.notes ? it.notes : '';
        const priceLine = document.createElement('div'); priceLine.className = 'tiny'; priceLine.textContent = `Preu: ${euro(it.price || 0)}`;

        const statsWrap = document.createElement('div'); statsWrap.className = 'inventory-stats';
        const stats = getTopStats(it, 3);
        for (const st of stats) {
          const chip = document.createElement('div'); chip.className = 'stat-chip';
          chip.textContent = `${formatStatKey(st.key)} ${st.value}`;
          statsWrap.appendChild(chip);
        }

        body.appendChild(row); body.appendChild(row2);
        if (notes.textContent) body.appendChild(notes);
        body.appendChild(priceLine);
        if (statsWrap.childNodes.length) body.appendChild(statsWrap);
        layout.appendChild(art); layout.appendChild(body);
        card.appendChild(layout);
        invList.appendChild(card);
      }
    }
    if (invList.dataset.bound !== '1') {
      invList.addEventListener('dragover', (e) => {
        if (dragState.source !== 'installed') return;
        e.preventDefault();
        invList.classList.add('drag-over');
      });
      invList.addEventListener('dragleave', () => invList.classList.remove('drag-over'));
      invList.addEventListener('drop', (e) => {
        e.preventDefault();
        invList.classList.remove('drag-over');
        if (dragState.source !== 'installed') return;
        const itemId = getDraggedItemId(e);
        const category = dragState.category;
        if (!itemId || !category) return;
        const res = uninstallItemToInventory(state.selected.roomIndex, category, itemId, renderAll);
        if (!res.ok) log(`❌ ${res.reason}`);
        if (res.ok) { triggerSnap(invList); playSnapSound(); }
        clearDragState();
      });
      invList.dataset.bound = '1';
    }
  }

  const inventorySection = invList && invList.parentElement ? invList.parentElement : null;
  if (inventorySection) {
    const existing = inventorySection.querySelector('.inventory-maintenance');
    if (existing) existing.remove();
    const maintenanceCard = document.createElement('div'); maintenanceCard.className = 'ops-card inventory-maintenance';
    const maintenanceTitle = document.createElement('div'); maintenanceTitle.className = 'ops-title'; maintenanceTitle.textContent = 'Manteniment';
    const maintenanceBody = document.createElement('div'); maintenanceBody.className = 'ops-body';
    let avgCondition = 100;
    try {
      const ids = [].concat(...Object.values(bag));
      if (ids.length && state.itemCondition) {
        const total = ids.reduce((sum, id) => sum + Number(state.itemCondition.get(id) || 100), 0);
        avgCondition = Math.round(total / ids.length);
      }
    } catch (e) {}
    const maintLine = document.createElement('div'); maintLine.className = 'ops-row';
    maintLine.textContent = `Estat mig equips: ${avgCondition}%`;
    const repairCost = calcRoomRepairCost(state.selected.roomIndex);
    const repairLine = document.createElement('div'); repairLine.className = 'ops-row muted';
    repairLine.textContent = repairCost > 0 ? `Cost reparacio: ${euro(repairCost)}` : 'Tot OK';
    const repairActions = document.createElement('div'); repairActions.className = 'ops-actions';
    const btnRepair = document.createElement('button'); btnRepair.className = 'btn2 btnSpecial';
    btnRepair.textContent = repairCost > 0 ? `Reparar (${euro(repairCost)})` : 'Reparar';
    btnRepair.disabled = repairCost <= 0;
    btnRepair.addEventListener('click', () => repairRoomItems(state.selected.roomIndex));
    repairActions.appendChild(btnRepair);
    maintenanceBody.appendChild(maintLine); maintenanceBody.appendChild(repairLine);
    maintenanceCard.appendChild(maintenanceTitle); maintenanceCard.appendChild(maintenanceBody); maintenanceCard.appendChild(repairActions);
    inventorySection.appendChild(maintenanceCard);
  }

  const k = document.getElementById('kpis');
  const mobileKpis = document.getElementById('mobileKpis');
  if (k) clearChildren(k);
  if (mobileKpis) clearChildren(mobileKpis);
  const xpNext = xpToNext(state.player.level || 1);
  const makeBox = (label, value, meter, variant) => {
    const box = document.createElement('div'); box.className = 'box';
    const m = document.createElement('div'); m.className = 'muted'; m.textContent = label;
    const v = document.createElement('div'); v.className = 'v'; v.textContent = value;
    box.appendChild(m); box.appendChild(v);
    if (typeof meter === 'number') {
      const meterWrap = document.createElement('div'); meterWrap.className = `kpi-meter${variant ? ` ${variant}` : ''}`;
      const meterFill = document.createElement('span');
      meterFill.style.width = `${Math.max(6, Math.min(100, Math.round(meter)))}%`;
      meterWrap.appendChild(meterFill);
      box.appendChild(meterWrap);
    }
    return box;
  };
  let currentRecurring = 0;
  if (state.db && Array.isArray(state.db.rooms) && Array.isArray(state.roomsInstalled)) {
    for (let i = 0; i < state.db.rooms.length; i++) {
      const r = state.db.rooms[i];
      const bag = state.roomsInstalled[i] || {};
      const hasInstalled = Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
      if (hasInstalled) currentRecurring += Number(r.price_per_week || 0);
    }
  }
  const engLevel = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
  const prodLevel = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
  const staffWeekly = engLevel * 120 + prodLevel * 100;
  currentRecurring += staffWeekly;
  const weeklyAccum = (state.finance && state.finance.weeklyExpenses) ? Math.round(state.finance.weeklyExpenses) : 0;
  const usedSlotCount = Object.values(bag).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const totalSlotCount = Object.values(slots).reduce((sum, v) => sum + Number(v || 0), 0);
  const workHours = Number(state.time.workHoursPerDay || 8);
  const repOverall = state.reputation ? Number(state.reputation.overall || 0) : 0;
  const repByGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const topGenre = Object.entries(repByGenre).sort((a,b)=>Number(b[1])-Number(a[1]))[0];
  const topGenreText = topGenre ? `${topGenre[0]} ${topGenre[1]}` : '-';
  const kpiData = [
    { label: 'Cash', value: euro(Math.round(state.cash)), meter: (state.cash / 5000) * 100 },
    { label: 'Inventari', value: `${state.inventory.size}`, meter: (state.inventory.size / 50) * 100 },
    { label: 'Sala slots', value: `${usedSlotCount}/${totalSlotCount}`, meter: totalSlotCount ? (usedSlotCount / totalSlotCount) * 100 : 0 },
    { label: 'Temps', value: `Dia ${state.time.day} - Hora ${state.time.hour}/${state.time.workHoursPerDay}`, meter: (Number(state.time.hour || 0) / workHours) * 100, variant: 'kpi-meter--amber' },
    { label: 'Nivell', value: `${state.player.level} - XP ${state.player.xp}/${xpNext}`, meter: (state.player.xp / xpNext) * 100 },
    { label: 'Fatiga', value: `${state.player.fatigue.toFixed(1)}h`, meter: (state.player.fatigue / 20) * 100, variant: 'kpi-meter--amber' },
    { label: 'Reputacio', value: `${repOverall}`, meter: (repOverall / 50) * 100 },
    { label: 'Rep genere', value: topGenreText, meter: topGenre ? (Number(topGenre[1]) / 20) * 100 : 0 },
    { label: 'Despesa setmanal', value: euro(currentRecurring), meter: (currentRecurring / 5000) * 100, variant: 'kpi-meter--amber' },
    { label: 'Total facturat', value: euro(weeklyAccum), meter: (weeklyAccum / 10000) * 100 }
  ];
  const hiddenHeader = new Set(['Inventari', 'Sala slots', 'Rep genere', 'Total facturat']);
  if (k) {
    for (const item of kpiData) {
      if (hiddenHeader.has(item.label)) continue;
      k.appendChild(makeBox(item.label, item.value, item.meter, item.variant));
    }
  }
  if (mobileKpis) {
    const allowed = new Set(['Cash', 'Temps', 'Nivell', 'Fatiga', 'Reputacio']);
    for (const item of kpiData) {
      if (allowed.has(item.label)) mobileKpis.appendChild(makeBox(item.label, item.value, item.meter, item.variant));
    }
  }
  const fatThreshold = 8;
  const fatMultiplier = 1.2;
  const fatCap = 30;
  const short = Number(state.player.fatigueShort || 0);
  const chronic = Number(state.player.fatigueChronic || 0);
  const estPenalty = Math.min(fatCap, Math.max(0, short - fatThreshold) * fatMultiplier + 0.5 * chronic);
  if (short > fatThreshold && k) {
    const warn = document.createElement('div'); warn.className = 'muted fatigamessage'; warn.style.color = '#b71c1c'; warn.style.marginTop = '6px';
    warn.textContent = `?s???? Fatiga alta: p??rdua estimada de qualitat ~${estPenalty.toFixed(1)} pts`;
    k.appendChild(warn);
  }
}

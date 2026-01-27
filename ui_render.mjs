// ui_render.mjs - ES module renderer (moved from ui_render.js)
import { state, installedIds, installToRoom, uninstallItemFromRoom } from './state.js';
import { euro, xpToNext, invQty, invRemove, invAdd, log, showNotification } from './helpers.js';
import { getContractETA as getContractETA_impl, workOnContract as workOnContract_impl } from './actions.js';

let micTypeListenerAdded = false;
let contractRoomListenerAdded = false;
let inventoryDropListenerAdded = false;
const dragState = { itemId: null, source: null, category: null, index: null };
let audioCtx = null;
const ROOM_ART = {
  control_room: 'assets/rooms/control_room.svg',
  live_room: 'assets/rooms/live_room.svg',
  vocal_booth: 'assets/rooms/vocal_booth.svg',
  mastering_suite: 'assets/rooms/mastering_suite.svg',
  streaming_room: 'assets/rooms/streaming_room.svg'
};
const ITEM_ART = {
  mic: 'assets/items/mic.svg',
  preamp: 'assets/items/preamp.svg',
  preamp_multi: 'assets/items/preamp.svg',
  console_analog: 'assets/items/console.svg',
  console_digital: 'assets/items/console.svg',
  monitor: 'assets/items/monitor.svg',
  headphones: 'assets/items/headphones.svg',
  headphone_amp: 'assets/items/headphone_amp.svg',
  cable: 'assets/items/cable.svg',
  multicore: 'assets/items/multicore.svg',
  mic_stand: 'assets/items/mic_stand.svg',
  mic_accessory: 'assets/items/mic_accessory.svg',
  pop_filter: 'assets/items/pop_filter.svg',
  shock_mount: 'assets/items/shock_mount.svg',
  interface: 'assets/items/interface.svg',
  acoustic_treatment: 'assets/items/acoustic_treatment.svg',
  desk: 'assets/items/desk.svg',
  rack: 'assets/items/rack.svg',
  patchbay: 'assets/items/patchbay.svg',
  effects: 'assets/items/effects.svg',
  instruments: 'assets/items/instrument.svg',
  chair: 'assets/items/chair.svg',
  consumable: 'assets/items/consumable.svg',
  midi_controller: 'assets/items/midi_controller.svg',
  software_daw: 'assets/items/software_daw.svg',
  software_fx: 'assets/items/software_fx.svg',
  monitor_stand: 'assets/items/monitor_stand.svg',
  accessory_cabling: 'assets/items/accessory_cabling.svg',
  software: 'assets/items/software.svg',
  software_vst: 'assets/items/software.svg',
  software_mix_master: 'assets/items/software.svg'
};
const DEFAULT_ROOM_ART = 'assets/rooms/control_room.svg';
const DEFAULT_ITEM_ART = 'assets/items/console.svg';
const STAT_LABELS = {
  mic_quality: 'Mic',
  preamp_quality: 'Pre',
  conversion_quality: 'Conv',
  monitor_accuracy: 'Mon',
  hp_accuracy: 'HP',
  daw_quality: 'DAW',
  production_bonus: 'Prod',
  instrument_quality: 'Instr',
  room_acoustic_add: 'Acoust',
  latency_score: 'Lat',
  inputs: 'IN',
  outputs: 'OUT'
};
const PRIMARY_STATS_BY_CATEGORY = {
  mic: 'mic_quality',
  preamp: 'preamp_quality',
  preamp_multi: 'preamp_quality',
  interface: 'conversion_quality',
  monitor: 'monitor_accuracy',
  headphones: 'hp_accuracy',
  software: 'daw_quality',
  software_vst: 'production_bonus',
  software_mix_master: 'daw_quality',
  instruments: 'instrument_quality',
  acoustic_treatment: 'room_acoustic_add'
};

// If tests (or other legacy code) provided a global `state`, merge it into the imported module state
if (typeof globalThis !== 'undefined' && globalThis.state && typeof state === 'object') {
  try { Object.assign(state, globalThis.state); } catch (e) { /* ignore */ }
}

function clearChildren(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

function createTextDiv(text, color) {
  const d = document.createElement('div');
  if (color) d.style.color = color;
  d.textContent = text;
  return d;
}

function getRoomArt(room) {
  if (!room) return DEFAULT_ROOM_ART;
  return ROOM_ART[room.type] || DEFAULT_ROOM_ART;
}

function getItemArt(item) {
  if (!item) return DEFAULT_ITEM_ART;
  const cat = item.category || 'misc';
  return ITEM_ART[cat] || DEFAULT_ITEM_ART;
}

function createArt(src, alt) {
  const wrap = document.createElement('div');
  wrap.className = 'card-art';
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  wrap.appendChild(img);
  return wrap;
}

function formatStatKey(key) {
  if (!key) return '';
  if (STAT_LABELS[key]) return STAT_LABELS[key];
  return key.replace(/_/g, ' ').slice(0, 12);
}

function getPrimaryStat(item) {
  if (!item || !item.stats) return null;
  const preferred = PRIMARY_STATS_BY_CATEGORY[item.category];
  if (preferred && item.stats[preferred] != null) {
    return { key: preferred, value: item.stats[preferred] };
  }
  const entries = Object.entries(item.stats).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  return { key: entries[0][0], value: entries[0][1] };
}

function getTopStats(item, limit = 3) {
  if (!item || !item.stats) return [];
  const entries = Object.entries(item.stats)
    .filter(([, v]) => typeof v === 'number')
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, limit);
  return entries.map(([key, value]) => ({ key, value }));
}

function createBadge(text, variant, extraClass) {
  const badge = document.createElement('span');
  badge.className = `badge ${variant || ''}`.trim();
  if (extraClass) badge.classList.add(extraClass);
  badge.textContent = text;
  return badge;
}

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
      // if occupied, swap
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

function getRiskLevel(contract) {
  const target = Number(contract.target_quality || 0);
  const duration = Number(contract.duration_hours || 0);
  const score = target + duration * 0.6;
  if (score >= 85) return { level: 'high', label: 'Risc alt' };
  if (score >= 70) return { level: 'mid', label: 'Risc mitja' };
  return { level: 'low', label: 'Risc baix' };
}

function setPage(page) {
  const normalized = (page === 'contracts' || page === 'shop' || page === 'rooms') ? page : 'rooms';
  state.ui = state.ui || { page: 'rooms' };
  state.ui.page = normalized;
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-page', normalized);
    document.querySelectorAll('[data-page-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-page-tab') === normalized);
    });
  }
}

function initPageNav() {
  const tabs = document.querySelectorAll('[data-page-tab]');
  if (!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => setPage(btn.getAttribute('data-page-tab')));
  });
  setPage((state.ui && state.ui.page) ? state.ui.page : 'rooms');
}

export function getRequirementsElement(contract, roomIndex) {
  const req = contract.requirements || {};
  const container = document.createElement('div');
  container.className = 'tiny';
  container.style.marginTop = '6px';
  container.style.lineHeight = '1.4';
  let has = false;

  if (req.room_type) {
    const room = state.db.rooms[roomIndex];
    const hasRoom = room && room.type === req.room_type;
    container.appendChild(createTextDiv(`Sala: ${req.room_type}`, hasRoom ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const installed = installedIds(roomIndex, cat).length;
      const hasEnough = installed >= Number(min);
      container.appendChild(createTextDiv(`${cat}: ${installed}/${min}`, hasEnough ? '#4CAF50' : '#f44336'));
      has = true;
    }
  }

  if (req.mic_types && Array.isArray(req.mic_types)) {
    const installedMicIds = installedIds(roomIndex, 'mic');
    const coveredTypes = new Set();
    for (const micId of installedMicIds) {
      const mic = state.itemsById.get(micId);
      if (mic && mic.type && Array.isArray(mic.type)) {
        const coveredType = mic.type.find(t => req.mic_types.includes(t) && !coveredTypes.has(t));
        if (coveredType) coveredTypes.add(coveredType);
      }
    }
    for (const requiredType of req.mic_types) {
      const hasType = coveredTypes.has(requiredType);
      container.appendChild(createTextDiv(`Mic ${requiredType}`, hasType ? '#4CAF50' : '#f44336'));
      has = true;
    }
  }

  const micCount = installedIds(roomIndex, 'mic').length;
  if (micCount > 0) {
    const standCount = installedIds(roomIndex, 'mic_stand').length;
    const hasEnough = standCount >= micCount;
    container.appendChild(createTextDiv(`Mic stands: ${standCount}/${micCount}`, hasEnough ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (req.min_interface_inputs) {
    const interfaces = installedIds(roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean);
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    const hasEnough = maxIns >= Number(req.min_interface_inputs);
    container.appendChild(createTextDiv(`Entrades interface: ${maxIns}/${req.min_interface_inputs}`, hasEnough ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (contract.deadline_days) {
    const start = contract.start_day || state.time.day;
    const deadline = start + contract.deadline_days;
    const isLate = state.time.day > deadline;
    const daysLeft = deadline - state.time.day;
    container.appendChild(createTextDiv(`Deadline: ${daysLeft} dies restants`, isLate ? '#f44336' : '#4CAF50'));
    has = true;
  }

  return has ? container : null;
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
  const room = state.db.rooms[roomIndex];
  const item = state.itemsById.get(itemId);
  if (!room) return { ok: false, reason: 'Sala no trobada' };
  if (!item) return { ok: false, reason: 'Item no trobat' };
  const itemCat = item.category || 'misc';
  if (itemCat !== category) return { ok: false, reason: `Slot ${category} requerit` };
  if (invQty(itemId) <= 0) return { ok: false, reason: 'No tens aquest item' };
  const slots = room.slots || {};
  const max = Number(slots[category] || 0);
  const used = installedIds(roomIndex, category).length;
  if (used >= max) return { ok: false, reason: `No hi ha slots de ${category}` };
  return { ok: true, item, used, max };
}

function installItemToRoom(roomIndex, itemId, targetIndex) {
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
  renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return { ok: true };
}

function uninstallItemToInventory(roomIndex, category, itemId) {
  const room = state.db.rooms[roomIndex];
  const res = uninstallItemFromRoom(roomIndex, category, itemId);
  if (!res.ok) return { ok: false, reason: res.reason || 'No es pot desinstal·lar' };
  removeLayoutItem(roomIndex, category, itemId, dragState.index);
  invAdd(itemId, 1);
  const item = state.itemsById.get(itemId);
  log(`↩️ Desinstal·lat de ${room.name}: ${item ? item.name : itemId} (${category})`);
  showNotification(`↩️ Desinstal·lat: ${item ? item.name : itemId}`);
  renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return { ok: true };
}

function getCompatibility(roomIndex, item) {
  if (!item) return { label: 'N/A', status: 'bad' };
  if (item.category === 'consumable') return { label: 'Consumible', status: 'ok' };
  const room = state.db.rooms[roomIndex];
  const slots = room && room.slots ? room.slots : {};
  const max = Number(slots[item.category] || 0);
  if (!max) return { label: 'Sense slot', status: 'bad' };
  const used = installedIds(roomIndex, item.category).length;
  if (used >= max) return { label: `Ple ${used}/${max}`, status: 'warn' };
  return { label: `OK ${used}/${max}`, status: 'ok' };
}

export function renderAll() {
  const moneyEl = document.getElementById('money');
  if (moneyEl) moneyEl.textContent = `Cash: ${Math.round(state.cash)}€`;
  renderRooms();
  renderShop();
  renderRight();
}

export function renderRooms() {
  const el = document.getElementById("roomList");
  clearChildren(el);
  const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx })).filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
  const roomsMeta = document.getElementById('roomsMeta'); if (roomsMeta) roomsMeta.textContent = `${visibleRooms.length} sales`;

  const visibleIndices = visibleRooms.map(v => v.idx);
  if (visibleIndices.length > 0 && !visibleIndices.includes(state.selected.roomIndex)) {
    state.selected.roomIndex = visibleIndices[0];
  }

  const contractRoomSelect = document.getElementById('selContractRoom');
  if (contractRoomSelect) {
    contractRoomSelect.options.length = 0;
    visibleRooms.forEach(({ r, idx }) => contractRoomSelect.add(new Option(r.name, String(idx))));
    if (visibleIndices.includes(state.selected.roomIndex)) {
      contractRoomSelect.value = String(state.selected.roomIndex);
    } else if (visibleRooms.length) {
      contractRoomSelect.value = String(visibleRooms[0].idx);
    }
    if (!contractRoomListenerAdded) {
      contractRoomSelect.addEventListener('change', () => {
        state.selected.roomIndex = Number(contractRoomSelect.value);
        renderAll();
      });
      contractRoomListenerAdded = true;
    }
  }

  visibleRooms.forEach(({ r, idx }) => {
    const div = document.createElement("div");
    div.className = "card" + (idx===state.selected.roomIndex ? " active":"");
    div.onclick = () => { state.selected.roomIndex = idx; renderAll(); };
    const layout = document.createElement('div');
    layout.className = 'card-grid';
    const art = createArt(getRoomArt(r), `${r.name} art`);
    const body = document.createElement('div');
    body.className = 'card-body';

    const slots = r.slots || {};
    const types = Object.keys(slots).slice(0,4).join(", ");

    const row1 = document.createElement('div');
    row1.className = 'row';
    const b = document.createElement('b'); b.textContent = r.name;
    const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = r.type;
    row1.appendChild(b); row1.appendChild(pill);

    const row2 = document.createElement('div'); row2.className = 'row muted'; row2.style.marginTop = '6px';
    const s1 = document.createElement('span'); s1.textContent = `${r.size_m2} m² · noise ${r.noise_floor_db} dB`;
    const s2 = document.createElement('span'); s2.textContent = `${Object.keys(slots).length} slots`;
    row2.appendChild(s1); row2.appendChild(s2);

    const tiny = document.createElement('div'); tiny.className = 'tiny'; tiny.style.marginTop = '6px';
    tiny.textContent = `Slots: ${types}${Object.keys(slots).length>4?"…":""}`;

    body.appendChild(row1); body.appendChild(row2); body.appendChild(tiny);
    layout.appendChild(art); layout.appendChild(body);
    div.appendChild(layout);
    el.appendChild(div);
  });

  const leftContracts = document.getElementById("leftContracts");
  if (leftContracts) {
    const room = state.db.rooms[state.selected.roomIndex];
    const wh = state.time.workHoursPerDay || 8;
    const applicable = state.db.contracts.filter(c => {
      const req = c.requirements || {};
      const playerLevel = Number(state.player.level || 1);
      const unlockLevel = Number(c.unlock_level || 1);
      return unlockLevel <= playerLevel && (!req.room_type || req.room_type === (room && room.type));
    });
    const contractsMeta = document.getElementById('contractsMeta'); if (contractsMeta) contractsMeta.textContent = `${applicable.length} contractes`;
    clearChildren(leftContracts);
    if (!applicable.length) {
      const m = document.createElement('div'); m.className = 'muted'; m.textContent = 'No hi ha contractes compatibles per aquesta sala.';
      leftContracts.appendChild(m);
    } else {
      for (const c of applicable) {
        const worked = Number(c.worked_hours || 0);
        const total = Number(c.duration_hours || 0);
        const remaining = Math.max(0, total - worked);
        const pct = total ? Math.round((worked/total)*100) : 0;
        const eta = getContractETA_impl(c);
        const etaText = remaining === 0 ? 'Ready' : (eta.days ? `${eta.days}d ${eta.hours}h` : `${eta.hours}h`);
        const isDone = Boolean(c.completed);

        const card = document.createElement('div');
        card.className = 'card contract-card';
        if (isDone) card.style.opacity = '.6', card.style.filter = 'grayscale(.4)';
        if (isDone) {
          card.classList.add('is-complete');
          card.setAttribute('data-stamp', 'DONE');
        }

        const row = document.createElement('div'); row.className = 'row';
        const bt = document.createElement('b'); bt.textContent = c.name;
        const typ = document.createElement('span'); typ.className = 'pill'; typ.textContent = c.type;
        row.appendChild(bt); row.appendChild(typ);

        const badges = document.createElement('div'); badges.className = 'badge-row';
        if (c.genre && c.genre !== 'any') badges.appendChild(createBadge(c.genre, 'badge--genre'));
        const risk = getRiskLevel(c);
        badges.appendChild(createBadge(risk.label, 'badge--risk', risk.level));
        if (c.target_quality != null) badges.appendChild(createBadge(`Qualitat ${c.target_quality}`, 'badge--quality'));
        if (c.deadline_days) {
          const startDay = (c.start_day != null) ? c.start_day : state.time.day;
          const dueDay = startDay + Number(c.deadline_days || 0);
          const remainingDays = dueDay - state.time.day;
          const deadlineText = remainingDays < 0 ? `Tard ${Math.abs(remainingDays)}d` : `D-${remainingDays}d`;
          const deadlineBadge = createBadge(`Deadline ${deadlineText}`, remainingDays < 0 ? 'badge--late' : 'badge--deadline');
          badges.appendChild(deadlineBadge);
        }

        const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
        meta.textContent = `${c.duration_hours}h · ${euro(c.base_pay)}`;
        if (isDone) {
          const pillDone = document.createElement('span'); pillDone.className = 'pill'; pillDone.textContent = 'Complet';
          meta.appendChild(document.createTextNode(' ')); meta.appendChild(pillDone);
        }

        card.appendChild(row); card.appendChild(badges); card.appendChild(meta);

        const reqEl = getRequirementsElement(c, state.selected.roomIndex);
        if (reqEl) card.appendChild(reqEl);

        const progWrap = document.createElement('div'); progWrap.style.marginTop = '8px';
        const progText = document.createElement('div'); progText.className = 'row tiny';
        const progLeft = document.createElement('span'); progLeft.textContent = `Progrés: ${worked}/${total}h`;
        const etaSpan = document.createElement('span'); etaSpan.className = 'eta-pill'; etaSpan.textContent = `ETA ${etaText}`;
        progText.appendChild(progLeft); progText.appendChild(etaSpan);
        const progress = document.createElement('div'); progress.className = 'progress'; progress.style.marginTop = '6px';
        const progressInner = document.createElement('div'); progressInner.className = 'progress-inner'; progressInner.style.width = `${pct}%`;
        if (isDone) progressInner.style.opacity = '0.6';
        progress.appendChild(progressInner);
        progWrap.appendChild(progText); progWrap.appendChild(progress);
        card.appendChild(progWrap);

        const actionsDiv = document.createElement('div'); actionsDiv.style.marginTop = '8px'; actionsDiv.style.display = 'flex'; actionsDiv.style.gap = '6px';
        const btn1 = document.createElement('button'); btn1.className = 'btn2'; btn1.textContent = isDone ? 'Reiniciar' : 'Treballar 1h'; btn1.addEventListener('click', () => workOnContract_impl(c.id, 1));
        const btn2 = document.createElement('button'); btn2.className = 'btn2'; btn2.textContent = isDone ? 'Reiniciar dia' : `Treballar ${wh}h`; btn2.addEventListener('click', () => workOnContract_impl(c.id, wh));
        const btn3 = document.createElement('button'); btn3.className = 'btn2 btnOk'; btn3.textContent = isDone ? 'Reiniciar i finalitzar' : 'Finalitzar'; btn3.addEventListener('click', () => workOnContract_impl(c.id, 9999));
        actionsDiv.appendChild(btn1); actionsDiv.appendChild(btn2); actionsDiv.appendChild(btn3);
        card.appendChild(actionsDiv);

        leftContracts.appendChild(card);
      }
    }
  }
}

export function renderShop() {
  const cats = Array.from(state.itemsByCategory.keys()).sort();
  const sel = document.getElementById("selCategory");
  if (!sel.options.length) {
    // populate options safely
    for (const c of cats) sel.add(new Option(c, c));
  }
  if (!cats.includes(sel.value) && cats.length) sel.value = cats[0];

  const q = document.getElementById("txtSearch").value.trim().toLowerCase();
  const cat = sel.value;
  const micTypeSelect = document.getElementById("selMicType");
  
  // Handle mic type filter
  const micTypeDiv = document.getElementById("micTypeFilter");
  if (cat === 'mic') {
    micTypeDiv.style.display = 'block';
    // Add event listener if not already added
    if (!micTypeListenerAdded) {
      const updateMicFilter = () => {
        const newValue = micTypeSelect.value;
        renderShop();
      };
      micTypeSelect.addEventListener("change", updateMicFilter);
      micTypeSelect.addEventListener("input", updateMicFilter);
      micTypeListenerAdded = true;
    }
  } else {
    micTypeDiv.style.display = 'none';
    micTypeSelect.value = ""; // Reset filter when not in mic category
  }
  
  const micTypeFilter = micTypeSelect.value;

  let items = (state.itemsByCategory.get(cat) || []).filter(it => {
    const unlocked = Number(it.unlock_level || 1) <= Number(state.player.level || 1);
    const matchesSearch = !q || String(it.name||"").toLowerCase().includes(q);
    const matchesMicType = !micTypeFilter || (Array.isArray(it.type) && it.type.includes(micTypeFilter));
    const passes = unlocked && matchesSearch && matchesMicType;
    return passes;
  });

  // If selected item is not in current filtered list, select the first one
  if (!items.some(it => it.id === state.selected.shopItemId)) {
    state.selected.shopItemId = items.length ? items[0].id : null;
  }

  const shopMeta = document.getElementById('shopMeta'); if (shopMeta) shopMeta.textContent = `${items.length} items`;

  const list = document.getElementById("shopList");
  clearChildren(list);
  if (list) {
    list.classList.remove('list');
    if (!list.classList.contains('shop-grid')) list.classList.add('shop-grid');
  }
  for (const it of items.slice(0, 200)) {
    const div = document.createElement("div");
    div.className = "card shop-card" + (it.id === state.selected.shopItemId ? " active" : "");
    div.style.cursor = "pointer";
    div.addEventListener('click', () => { 
      state.selected.shopItemId = it.id; 
      renderShop(); 
      renderRight(); 
    });
    const layout = document.createElement('div');
    layout.className = 'card-grid';
    const art = createArt(getItemArt(it), `${it.name} art`);
    const body = document.createElement('div');
    body.className = 'card-body';
    const tier = it.tier || "mid";
    const tierPill = tier === "pro" ? "ok" : tier === "low" ? "bad" : "";

    const row = document.createElement('div'); row.className = 'row';
    const b = document.createElement('b'); b.textContent = it.name;
    const pill = document.createElement('span'); pill.className = `pill ${tierPill}`; pill.textContent = tier;
    row.appendChild(b); row.appendChild(pill);

    const row2 = document.createElement('div'); row2.className = 'shop-sub';
    const catSpan = document.createElement('span'); catSpan.className = 'shop-cat'; catSpan.textContent = it.category;
    const priceSpan = document.createElement('span'); priceSpan.className = 'shop-price'; priceSpan.textContent = euro(it.price || 0);
    row2.appendChild(catSpan); row2.appendChild(priceSpan);

    const notes = document.createElement('div'); notes.className = 'shop-notes'; notes.textContent = it.notes ? it.notes : '';

    const statWrap = document.createElement('div'); statWrap.className = 'inventory-stats';
    const topStats = getTopStats(it, 3);
    for (const st of topStats) {
      const chip = document.createElement('div'); chip.className = 'stat-chip';
      chip.textContent = `${formatStatKey(st.key)} ${st.value}`;
      statWrap.appendChild(chip);
    }

    const selected = state.itemsById.get(state.selected.shopItemId);
    let compareRow = null;
    if (selected && selected.id !== it.id && selected.category === it.category) {
      compareRow = document.createElement('div'); compareRow.className = 'compare-row';
      const primary = getPrimaryStat(it);
      const primarySel = getPrimaryStat(selected);
      const chunks = [];
      if (primary && primarySel && primary.key === primarySel.key) {
        const diff = Number(primary.value) - Number(primarySel.value);
        if (diff !== 0) chunks.push({
          text: `${formatStatKey(primary.key)} ${diff > 0 ? `+${diff}` : diff}`,
          cls: diff > 0 ? 'compare-up' : 'compare-down'
        });
      }
      const priceDiff = Number(it.price || 0) - Number(selected.price || 0);
      if (priceDiff !== 0) chunks.push({
        text: `€ ${priceDiff > 0 ? `+${priceDiff}` : priceDiff}`,
        cls: priceDiff > 0 ? 'compare-down' : 'compare-up'
      });
      if (chunks.length) {
        compareRow.appendChild(document.createTextNode('Comparacio: '));
        chunks.forEach((chunk, idx) => {
          const span = document.createElement('span'); span.className = chunk.cls; span.textContent = chunk.text;
          compareRow.appendChild(span);
          if (idx < chunks.length - 1) compareRow.appendChild(document.createTextNode(' · '));
        });
      } else {
        compareRow = null;
      }
    }

    body.appendChild(row); body.appendChild(row2);
    if (notes.textContent) body.appendChild(notes);
    if (statWrap.childNodes.length) body.appendChild(statWrap);
    layout.appendChild(art); layout.appendChild(body);
    div.appendChild(layout);
    if (compareRow) div.appendChild(compareRow);

    if (it.category === 'mic' && it.type && it.type.length) {
      const micTypes = document.createElement('div'); micTypes.className = 'tiny'; micTypes.style.marginTop = '4px'; micTypes.textContent = `Tipus: ${it.type.join(', ')}`;
      div.appendChild(micTypes);
    }

    const quickBtn = document.createElement('button');
    quickBtn.className = 'btn2 btnOk btn-quick';
    quickBtn.textContent = 'Compra rapida';
    quickBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selected.shopItemId = it.id;
      if (typeof window !== 'undefined' && typeof window.buySelected === 'function') window.buySelected();
      renderShop();
      renderRight();
    });
    const actions = document.createElement('div'); actions.className = 'shop-actions-row';
    actions.appendChild(quickBtn);
    div.appendChild(actions);

    list.appendChild(div);
  }
}

export function renderRight() {
  const room = state.db.rooms[state.selected.roomIndex];
  const rightMeta = document.getElementById('rightMeta'); if (rightMeta) rightMeta.textContent = room ? room.name : "";

  const details = document.getElementById("roomDetails");
  clearChildren(details);
  if (!room) { const nm = document.createElement('div'); nm.className = 'muted'; nm.textContent = 'No hi ha sala.'; details.appendChild(nm); return; }

  const slots = room.slots || {};
  const bag = state.roomsInstalled[state.selected.roomIndex] || {};
  // Build details content safely
  const hero = document.createElement('div'); hero.className = 'room-hero';
  const heroImg = document.createElement('img'); heroImg.src = getRoomArt(room); heroImg.alt = `${room.name} art`;
  hero.appendChild(heroImg);
  const row = document.createElement('div'); row.className = 'row';
  const title = document.createElement('b'); title.style.fontSize = '16px'; title.textContent = room.name;
  const p = document.createElement('span'); p.className = 'pill'; p.textContent = room.type;
  row.appendChild(title); row.appendChild(p);

  const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
  meta.textContent = `${room.size_m2} m² · noise ${room.noise_floor_db} dB · base acoustic ${room.base_acoustic}`;

  const canvas = document.createElement('div'); canvas.className = 'room-canvas';
  const canvasHead = document.createElement('div'); canvasHead.className = 'room-canvas-head';
  const headLeft = document.createElement('div'); headLeft.className = 'room-canvas-meta';
  const infoBlock = document.createElement('div');
  infoBlock.appendChild(row); infoBlock.appendChild(meta);
  headLeft.appendChild(hero); headLeft.appendChild(infoBlock);
  canvasHead.appendChild(headLeft);
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
          const ok = installItemToRoom(state.selected.roomIndex, itemId, targetIndex);
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
          renderAll();
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

  // (Per-room billing history removed from room details)

  const invCats = Array.from(state.itemsByCategory.keys()).sort();
  const selCat = document.getElementById("selInvCategory");
  const prevSelCat = selCat.value;
  // repopulate select
  selCat.options.length = 0;
  for (const c of invCats) selCat.add(new Option(c, c));
  if (prevSelCat && invCats.includes(prevSelCat)) selCat.value = prevSelCat;
  else if (invCats.length) selCat.value = invCats[0];

  const cat = selCat.value;
  const owned = (state.itemsByCategory.get(cat) || []).filter(it => invQty(it.id) > 0);

  const selItem = document.getElementById("selInvItem");
  const prevSelItem = selItem.value;
  selItem.options.length = 0;
  for (const it of owned) selItem.add(new Option(`${it.name} (x${invQty(it.id)})`, it.id));
  if (prevSelItem && owned.find(o=>o.id === prevSelItem)) selItem.value = prevSelItem;
  else if (!selItem.value && owned.length) selItem.value = owned[0].id;

  const invList = document.getElementById('inventoryList');
  if (invList) {
    clearChildren(invList);
    if (!owned.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Inventari buit en aquesta categoria.';
      invList.appendChild(empty);
    } else {
      for (const it of owned) {
        const qty = invQty(it.id);
        const card = document.createElement('div');
        const isSelected = selItem && selItem.value === it.id;
        card.className = `card inventory-card${isSelected ? ' active' : ''}`;
        card.setAttribute('draggable', 'true');
        card.addEventListener('click', () => {
          if (selItem) selItem.value = it.id;
          renderRight();
        });
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
    if (!inventoryDropListenerAdded) {
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
        const res = uninstallItemToInventory(state.selected.roomIndex, category, itemId);
        if (!res.ok) log(`❌ ${res.reason}`);
        if (res.ok) { triggerSnap(invList); playSnapSound(); }
        clearDragState();
      });
      inventoryDropListenerAdded = true;
    }
  }

  const k = document.getElementById("kpis");
  const mobileKpis = document.getElementById("mobileKpis");
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
  // Weekly expenses: current recurring weekly cost (sum of price_per_week for active rooms)
  let currentRecurring = 0;
  if (state.db && Array.isArray(state.db.rooms) && Array.isArray(state.roomsInstalled)) {
    for (let i = 0; i < state.db.rooms.length; i++) {
      const r = state.db.rooms[i];
      const bag = state.roomsInstalled[i] || {};
      const hasInstalled = Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
      if (hasInstalled) currentRecurring += Number(r.price_per_week || 0);
    }
  }
  const weeklyAccum = (state.finance && state.finance.weeklyExpenses) ? Math.round(state.finance.weeklyExpenses) : 0;
  const usedSlotCount = Object.values(bag).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const totalSlotCount = Object.values(slots).reduce((sum, v) => sum + Number(v || 0), 0);
  const workHours = Number(state.time.workHoursPerDay || 8);
  const kpiData = [
    { label: 'Cash', value: euro(Math.round(state.cash)), meter: (state.cash / 5000) * 100 },
    { label: 'Inventari', value: `${state.inventory.size}`, meter: (state.inventory.size / 50) * 100 },
    { label: 'Sala slots', value: `${usedSlotCount}/${totalSlotCount}`, meter: totalSlotCount ? (usedSlotCount / totalSlotCount) * 100 : 0 },
    { label: 'Temps', value: `Dia ${state.time.day} - Hora ${state.time.hour}/${state.time.workHoursPerDay}`, meter: (Number(state.time.hour || 0) / workHours) * 100, variant: 'kpi-meter--amber' },
    { label: 'Nivell', value: `${state.player.level} - XP ${state.player.xp}/${xpNext}`, meter: (state.player.xp / xpNext) * 100 },
    { label: 'Fatiga', value: `${state.player.fatigue.toFixed(1)}h`, meter: (state.player.fatigue / 20) * 100, variant: 'kpi-meter--amber' },
    { label: 'Despesa setmanal', value: euro(currentRecurring), meter: (currentRecurring / 5000) * 100, variant: 'kpi-meter--amber' },
    { label: 'Total facturat', value: euro(weeklyAccum), meter: (weeklyAccum / 10000) * 100 }
  ];
  if (k) {
    for (const item of kpiData) k.appendChild(makeBox(item.label, item.value, item.meter, item.variant));
  }
  if (mobileKpis) {
    const allowed = new Set(['Cash', 'Temps', 'Nivell', 'Fatiga', 'Despesa setmanal']);
    for (const item of kpiData) {
      if (allowed.has(item.label)) mobileKpis.appendChild(makeBox(item.label, item.value, item.meter, item.variant));
    }
  }
  // Show fatigue warning if short-term fatigue exceeds threshold
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

// Attach to window for legacy code
if (typeof window !== 'undefined') {
  window.renderAll = window.renderAll || renderAll;
  window.renderRooms = window.renderRooms || renderRooms;
  window.renderShop = window.renderShop || renderShop;
  window.renderRight = window.renderRight || renderRight;
  window.getRequirementsElement = window.getRequirementsElement || getRequirementsElement;
  window.clearChildren = window.clearChildren || clearChildren;
  window.setPage = window.setPage || setPage;
  // ensure action bindings point to module impl when available
  window.getContractETA = window.getContractETA || getContractETA_impl;
  window.workOnContract = window.workOnContract || workOnContract_impl;
}

if (typeof document !== 'undefined') {
  initPageNav();
}

// If data was loaded before this module initialized (DEMO loaded and persistence.loadFromObject ran), render now
if (typeof window !== 'undefined' && typeof window.renderAll === 'function' && window.state && window.state.db && ((window.state.db.items && window.state.db.items.length) || (window.state.db.contracts && window.state.db.contracts.length))) {
  try { window.renderAll(); } catch (e) { /* ignore render errors at load time */ }
}

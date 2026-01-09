// ui_render.mjs - ES module renderer (moved from ui_render.js)
import { state, installedIds } from './state.js';
import { euro, xpToNext, invQty } from './helpers.js';
import { getContractETA as getContractETA_impl, workOnContract as workOnContract_impl } from './actions.js';

let micTypeListenerAdded = false;

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

  visibleRooms.forEach(({ r, idx }) => {
    const div = document.createElement("div");
    div.className = "card" + (idx===state.selected.roomIndex ? " active":"");
    div.onclick = () => { state.selected.roomIndex = idx; renderAll(); };

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

    div.appendChild(row1); div.appendChild(row2); div.appendChild(tiny);
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
        card.className = 'card';
        if (isDone) card.style.opacity = '.6', card.style.filter = 'grayscale(.4)';

        const row = document.createElement('div'); row.className = 'row';
        const bt = document.createElement('b'); bt.textContent = c.name;
        const typ = document.createElement('span'); typ.className = 'pill'; typ.textContent = c.type;
        row.appendChild(bt); row.appendChild(typ);

        const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
        meta.textContent = `${c.duration_hours}h · ${euro(c.base_pay)}`;
        if (isDone) {
          const pillDone = document.createElement('span'); pillDone.className = 'pill'; pillDone.textContent = 'Complet';
          meta.appendChild(document.createTextNode(' ')); meta.appendChild(pillDone);
        }

        card.appendChild(row); card.appendChild(meta);

        const reqEl = getRequirementsElement(c, state.selected.roomIndex);
        if (reqEl) card.appendChild(reqEl);

        const progWrap = document.createElement('div'); progWrap.style.marginTop = '8px';
        const progText = document.createElement('div'); progText.className = 'tiny';
        const etaSpan = document.createElement('span'); etaSpan.style.float = 'right'; etaSpan.textContent = `ETA: ${etaText}`;
        progText.textContent = `Progrés: ${worked}/${total}h `; progText.appendChild(etaSpan);
        const progress = document.createElement('div'); progress.className = 'progress'; progress.style.height = '8px'; progress.style.background = '#eee'; progress.style.borderRadius = '4px'; progress.style.overflow = 'hidden'; progress.style.marginTop = '6px';
        const progressInner = document.createElement('div'); progressInner.style.width = `${pct}%`; progressInner.style.height = '8px'; progressInner.style.background = isDone? '#999' : '#6bb'; progressInner.style.borderRadius = '4px';
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
  for (const it of items.slice(0, 200)) {
    const div = document.createElement("div");
    div.className = "card" + (it.id === state.selected.shopItemId ? " active" : "");
    div.style.cursor = "pointer";
    div.addEventListener('click', () => { 
      state.selected.shopItemId = it.id; 
      renderShop(); 
      renderRight(); 
    });
    const tier = it.tier || "mid";
    const tierPill = tier === "pro" ? "ok" : tier === "low" ? "bad" : "";

    const row = document.createElement('div'); row.className = 'row';
    const b = document.createElement('b'); b.textContent = it.name;
    const pill = document.createElement('span'); pill.className = `pill ${tierPill}`; pill.textContent = tier;
    row.appendChild(b); row.appendChild(pill);

    const row2 = document.createElement('div'); row2.className = 'row muted'; row2.style.marginTop = '6px';
    const catSpan = document.createElement('span'); catSpan.textContent = it.category;
    const priceSpan = document.createElement('span'); priceSpan.textContent = euro(it.price || 0);
    row2.appendChild(catSpan); row2.appendChild(priceSpan);

    const notes = document.createElement('div'); notes.className = 'tiny'; notes.style.marginTop = '6px'; notes.textContent = it.notes ? it.notes : '';

    div.appendChild(row); div.appendChild(row2); div.appendChild(notes);

    if (it.category === 'mic' && it.type && it.type.length) {
      const micTypes = document.createElement('div'); micTypes.className = 'tiny'; micTypes.style.marginTop = '4px'; micTypes.style.color = '#666'; micTypes.textContent = `Tipus: ${it.type.join(', ')}`;
      div.appendChild(micTypes);
    }

    if (it.stats && Object.keys(it.stats).length) {
      const statsWrap = document.createElement('div'); statsWrap.style.marginTop = '8px';
      for (const [k,v] of Object.entries(it.stats)) {
        const s = document.createElement('div'); s.className = 'tiny'; s.textContent = `${k.replace(/_/g,' ')}: ${v}`;
        statsWrap.appendChild(s);
      }
      div.appendChild(statsWrap);
    }

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
  const row = document.createElement('div'); row.className = 'row';
  const title = document.createElement('b'); title.style.fontSize = '16px'; title.textContent = room.name;
  const p = document.createElement('span'); p.className = 'pill'; p.textContent = room.type;
  row.appendChild(title); row.appendChild(p);

  const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
  meta.textContent = `${room.size_m2} m² · noise ${room.noise_floor_db} dB · base acoustic ${room.base_acoustic}`;

  const slotline = document.createElement('div'); slotline.className = 'slotline';
  Object.keys(slots).sort().forEach(cat => {
    const max = slots[cat];
    const used = (bag[cat] || []).length;
    const s = document.createElement('div'); s.className = 'slot';
    const sb = document.createElement('b'); sb.textContent = cat;
    const sm = document.createElement('div'); sm.className = 'muted'; sm.textContent = `${used}/${max}`;
    s.appendChild(sb); s.appendChild(sm); slotline.appendChild(s);
  });

  details.appendChild(row); details.appendChild(meta); details.appendChild(slotline);

  // Billing history for this room
  const billingInfo = (state.roomBilling && state.roomBilling[state.selected.roomIndex]) || { weeksBilled: 0, totalCharged: 0 };
  const billingWrap = document.createElement('div'); billingWrap.style.marginTop = '8px';
  const bw1 = document.createElement('div'); bw1.className = 'tiny'; bw1.textContent = `Setmanes facturades: ${billingInfo.weeksBilled || 0}`;
  const bw2 = document.createElement('div'); bw2.className = 'tiny'; bw2.textContent = `Total cobrat sala: ${euro(billingInfo.totalCharged || 0)}`;
  details.appendChild(billingWrap);
  billingWrap.appendChild(bw1);
  billingWrap.appendChild(bw2);

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

  const k = document.getElementById("kpis");
  clearChildren(k);
  const xpNext = xpToNext(state.player.level || 1);
  const makeBox = (label, value) => {
    const box = document.createElement('div'); box.className = 'box';
    const m = document.createElement('div'); m.className = 'muted'; m.textContent = label;
    const v = document.createElement('div'); v.className = 'v'; v.textContent = value;
    box.appendChild(m); box.appendChild(v); return box;
  };
  k.appendChild(makeBox('Cash', `${Math.round(state.cash)}€`));
  k.appendChild(makeBox('Inventari', `${state.inventory.size}`));
  k.appendChild(makeBox('Sala slots', `${Object.keys(slots).length}`));
  k.appendChild(makeBox('Temps', `Dia ${state.time.day} · Hora ${state.time.hour}/${state.time.workHoursPerDay}`));
  k.appendChild(makeBox('Nivell', `${state.player.level} · XP ${state.player.xp}/${xpNext}`));
  k.appendChild(makeBox('Fatiga', `${state.player.fatigue.toFixed(1)}h`));
    // Weekly expenses: show accumulated weekly charges (billed per week when rooms are active)
    // current recurring weekly cost (sum of price_per_week for active rooms)
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
    k.appendChild(makeBox('Despesa setmanal', `${currentRecurring}€`));
    k.appendChild(makeBox('Total facturat', `${weeklyAccum}€`));
  // Show fatigue warning if short-term fatigue exceeds threshold
  const fatThreshold = 8;
  const fatMultiplier = 1.2;
  const fatCap = 30;
  const short = Number(state.player.fatigueShort || 0);
  const chronic = Number(state.player.fatigueChronic || 0);
  const estPenalty = Math.min(fatCap, Math.max(0, short - fatThreshold) * fatMultiplier + 0.5 * chronic);
  if (short > fatThreshold) {
    const warn = document.createElement('div'); warn.className = 'muted'; warn.style.color = '#b71c1c'; warn.style.marginTop = '6px';
    warn.textContent = `⚠️ Fatiga alta: pèrdua estimada de qualitat ~${estPenalty.toFixed(1)} pts`;
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
  // ensure action bindings point to module impl when available
  window.getContractETA = window.getContractETA || getContractETA_impl;
  window.workOnContract = window.workOnContract || workOnContract_impl;
}

// If data was loaded before this module initialized (DEMO loaded and persistence.loadFromObject ran), render now
if (typeof window !== 'undefined' && typeof window.renderAll === 'function' && window.state && window.state.db && ((window.state.db.items && window.state.db.items.length) || (window.state.db.contracts && window.state.db.contracts.length))) {
  try { window.renderAll(); } catch (e) { /* ignore render errors at load time */ }
}

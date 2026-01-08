/** ---------------------------
 *  DATA MODEL (state)
 * --------------------------*/
const state = {
  cash: 10000000,
  db: { items: [], rooms: [], contracts: [] },
  itemsById: new Map(),
  itemsByCategory: new Map(),
  inventory: new Map(), // id -> qty
  selected: { roomIndex: 0, shopItemId: null },
  roomsInstalled: [], // per room: { category -> [itemId,...] }
  player: { level: 1, xp: 0 }
};

// Demo dataset (petit) si no carregues items_master.json
const DEMO = {
  items: [
    {id:"mic_shure_sm58", name:"Shure SM58", category:"mic", tier:"mid", price:109, stats:{mic_quality:55}, unlock_level:1},
    {id:"mic_shure_sm57", name:"Shure SM57", category:"mic", tier:"mid", price:109, stats:{mic_quality:55}, unlock_level:1},
    {id:"preamp_focusrite_isa_one", name:"Focusrite ISA One", category:"preamp", tier:"pro", price:549, stats:{preamp_quality:78}, unlock_level:4},
    {id:"interface_focusrite_8i6", name:"Focusrite Scarlett 8i6", category:"interface", tier:"mid", price:259, stats:{conversion_quality:62, latency_score:62}, io:{inputs_total:8}, unlock_level:2},
    {id:"monitor_yamaha_hs7", name:"Yamaha HS7 (pair)", category:"monitor", tier:"mid", price:399, stats:{monitor_accuracy:70}, unlock_level:2},
    {id:"headphones_beyerdynamic_dt770", name:"Beyerdynamic DT 770 Pro", category:"headphones", tier:"mid", price:149, stats:{hp_accuracy:70}, unlock_level:1},
    {id:"headphone_amp_behringer_ha400", name:"Behringer HA400", category:"headphone_amp", tier:"low", price:29, stats:{hp_amp_quality:45}, unlock_level:1},
    {id:"acoustic_panels_basic", name:"Panells acústics (pack)", category:"acoustic_treatment", tier:"low", price:99, stats:{room_acoustic_add:4}, unlock_level:1},
  ],
  rooms: [
    {id:"room_control_1", name:"Control Room (Petit)", type:"control_room", size_m2:14, max_people:2, noise_floor_db:-65, isolation:45, base_acoustic:45, unlock_level:1,
      slots:{monitor:2, interface:1, headphones:2, headphone_amp:1, mic:4, preamp:1, acoustic_treatment:6}
    },
    {id:"room_vocal_1", name:"Cabina Vocal", type:"vocal_booth", size_m2:6, max_people:1, noise_floor_db:-60, isolation:55, base_acoustic:50, unlock_level:1,
      slots:{mic:1, preamp:1, interface:1, headphones:1, headphone_amp:1, acoustic_treatment:8}
    },
    {id:"room_live_1", name:"Live Room (Mitjà)", type:"live_room", size_m2:28, max_people:6, noise_floor_db:-55, isolation:40, base_acoustic:40, unlock_level:3,
      slots:{acoustic_treatment:10, cable:20, headphone_amp:1, headphones:6, interface:1, mic:12, mic_accessory:6, mic_stand:10, multicore:1, patchbay:1, preamp_multi:1}
    }
  ],
  contracts: [
    {id:"contract_podcast_duo", name:"Podcast 2 veus", type:"recording", duration_hours:2, base_pay:180, target_quality:50,
      requirements:{room_type:"control_room", min_interface_inputs:2, min_items:{mic:2, headphones:2, headphone_amp:1}}
    },
    {id:"contract_mix_single", name:"Mescla 1 tema", type:"mix", duration_hours:4, base_pay:300, target_quality:60,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_master_single", name:"Master: 1 tema", type:"master", duration_hours:2, base_pay:220, target_quality:70,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_live_session", name:"Live Session (banda)", type:"recording", duration_hours:3, base_pay:240, target_quality:55,
      requirements:{room_type:"control_room", min_items:{mic:4}}
    },
    {id:"contract_jingle", name:"Commercial Jingle", type:"mix", duration_hours:1, base_pay:140, target_quality:65,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_remote_mix", name:"Remote Mix (client files)", type:"mix", duration_hours:5, base_pay:320, target_quality:62,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_acoustic_set", name:"Acoustic Set (2 veus)", type:"recording", duration_hours:2, base_pay:160, target_quality:52,
      requirements:{room_type:"control_room", min_items:{mic:2, acoustic_treatment:2}}
    },
    {id:"contract_full_band_record", name:"Record: Full Band", type:"recording", duration_hours:6, base_pay:480, target_quality:68,
      requirements:{room_type:"control_room", min_items:{mic:8, preamp_multi:1, interface:1}}
    },
    {id:"contract_voiceover", name:"Voiceover Session", type:"recording", duration_hours:1, base_pay:110, target_quality:58,
      requirements:{room_type:"vocal_booth", min_items:{mic:1, headphones:1}}
    },
    {id:"contract_audiobook", name:"Audiobook (capítol)", type:"recording", duration_hours:3, base_pay:260, target_quality:65,
      requirements:{room_type:"vocal_booth", min_items:{mic:1, headphones:1}}
    },
    {id:"contract_adr", name:"ADR Session", type:"recording", duration_hours:4, base_pay:300, target_quality:66,
      requirements:{room_type:"control_room", min_items:{mic:2, headphones:2}}
    },
    {id:"contract_master_ep", name:"Mastering: EP", type:"master", duration_hours:6, base_pay:600, target_quality:80,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_sound_design", name:"Sound Design / FX", type:"mix", duration_hours:5, base_pay:350, target_quality:64,
      requirements:{room_type:"control_room", min_items:{monitor:2}}
    },
    {id:"contract_live_stream", name:"Live Stream (banda)", type:"recording", duration_hours:2, base_pay:200, target_quality:56,
      requirements:{room_type:"control_room", min_interface_inputs:2, min_items:{mic:2}}
    },
    {id:"contract_session_jam", name:"Session: Jam Band", type:"recording", duration_hours:3, base_pay:220, target_quality:54,
      requirements:{room_type:"control_room", min_items:{mic:4}}
    }
  ]
};

/** ---------------------------
 *  HELPERS
 * --------------------------*/
function log(msg) {
  const el = document.getElementById("log");
  el.textContent = (msg + "\n" + el.textContent).slice(0, 6000);
}
function euro(n) { return `${Math.round(n)}€`; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function avgStat(items, key) {
  if (!items.length) return 0;
  let s=0, n=0;
  for (const it of items) {
    const stats = it.stats || {};
    if (stats[key] != null) { s += Number(stats[key]); n++; }
  }
  return n ? s/n : 0;
}
// Leveling helpers
function xpToNext(level){
  // tuned curve: larger requirements to slow progression
  // formula: 200 * level^1.4
  return Math.max(200, Math.round(200 * Math.pow(level, 1.4)));
}
function addXp(amount){
  if(!amount || amount<=0) return;
  state.player.xp += Number(amount);
  log(`⭐ Guanyes ${amount} XP`);
  // check level up
  while(state.player.xp >= xpToNext(state.player.level)){
    state.player.xp -= xpToNext(state.player.level);
    state.player.level += 1;
    log(`⬆️ Level up! Ara ets nivell ${state.player.level}`);
  }
}
function sumStat(items, key) {
  let s=0;
  for (const it of items) {
    const stats = it.stats || {};
    s += Number(stats[key] || 0);
  }
  return s;
}
function rebuildIndexes() {
  state.itemsById.clear();
  state.itemsByCategory.clear();
  for (const it of state.db.items) {
    state.itemsById.set(it.id, it);
    const cat = it.category || "misc";
    if (!state.itemsByCategory.has(cat)) state.itemsByCategory.set(cat, []);
    state.itemsByCategory.get(cat).push(it);
  }
  // sort by price
  for (const [cat, arr] of state.itemsByCategory.entries()) {
    arr.sort((a,b)=>(Number(a.price||0)-Number(b.price||0)));
  }
}
function ensureRoomsInstalled() {
  state.roomsInstalled = state.db.rooms.map(()=> ({}));
}
function installedIds(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex] || {};
  return bag[category] || [];
}
function installToRoom(roomIndex, category, itemId) {
  const room = state.db.rooms[roomIndex];
  const slots = room.slots || {};
  const max = Number(slots[category] || 0);
  const bag = state.roomsInstalled[roomIndex];
  bag[category] = bag[category] || [];
  if (bag[category].length >= max) return { ok:false, reason:`No hi ha slots de ${category} (max ${max})` };
  bag[category].push(itemId);
  return { ok:true };
}
function uninstallFromRoom(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex];
  if (!bag[category] || !bag[category].length) return { ok:false, reason:"No hi ha res instal·lat" };
  const removed = bag[category].pop();
  return { ok:true, removed };
}
function invQty(id) { return Number(state.inventory.get(id) || 0); }
function invAdd(id, qty=1){ state.inventory.set(id, invQty(id)+qty); }
function invRemove(id, qty=1){
  const cur = invQty(id);
  if (cur < qty) return false;
  const next = cur-qty;
  if (next<=0) state.inventory.delete(id); else state.inventory.set(id,next);
  return true;
}

/** ---------------------------
 *  SIMULATION
 * --------------------------*/
function simulateRecording(roomIndex, contract) {
  const room = state.db.rooms[roomIndex];

  const mics = installedIds(roomIndex, "mic").map(id=>state.itemsById.get(id)).filter(Boolean);
  const preamps = [
    ...installedIds(roomIndex, "preamp").map(id=>state.itemsById.get(id)).filter(Boolean),
    ...installedIds(roomIndex, "preamp_multi").map(id=>state.itemsById.get(id)).filter(Boolean),
  ];
  const interfaces = installedIds(roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean);
  const acoustic = installedIds(roomIndex, "acoustic_treatment").map(id=>state.itemsById.get(id)).filter(Boolean);
  const monitors = installedIds(roomIndex, "monitor").map(id=>state.itemsById.get(id)).filter(Boolean);
  const headphones = installedIds(roomIndex, "headphones").map(id=>state.itemsById.get(id)).filter(Boolean);

  const type = contract.type;

  // base stats
  const mic_q = avgStat(mics, "mic_quality");
  const pre_q = avgStat(preamps, "preamp_quality");
  const if_q  = avgStat(interfaces, "conversion_quality");
  const mon_q = avgStat(monitors, "monitor_accuracy");
  const hp_q  = avgStat(headphones, "hp_accuracy");

  let room_acoustic = Number(room.base_acoustic||0) + sumStat(acoustic, "room_acoustic_add");
  room_acoustic = clamp(room_acoustic, 0, 100);

  const engineer = 60; // demo fixed (després ho fem personal)

  // latency proxy
  const lat_score = avgStat(interfaces, "latency_score");
  const latency_ms = clamp(20 - (lat_score/6), 2, 25);

  let quality = 0;

  if (type === "recording") {
    quality =
      mic_q * 0.35 +
      pre_q * 0.20 +
      if_q  * 0.10 +
      room_acoustic * 0.20 +
      engineer * 0.15;
  } else if (type === "mix") {
    quality =
      mon_q * 0.40 +
      room_acoustic * 0.20 +
      if_q * 0.10 +
      engineer * 0.30;
  } else { // master
    quality =
      mon_q * 0.45 +
      room_acoustic * 0.30 +
      engineer * 0.25;
  }

  // noise penalty
  const noise_floor = Number(room.noise_floor_db || -60);
  const noise_penalty = clamp((noise_floor - (-70)) * 1.2, 0, 25);
  const final_quality = clamp(quality - noise_penalty, 0, 100);

  const target = Number(contract.target_quality || 55);
  let happiness = 50 + (final_quality - target) * 0.8 - Math.max(0, latency_ms - 8) * 0.6;
  happiness = clamp(happiness, 0, 100);

  const base_pay = Number(contract.base_pay || 100);
  const payout = Math.round(base_pay * (0.6 + happiness/100)); // 0.6x..1.6x

  return { final_quality, latency_ms, happiness, payout, room_acoustic, noise_penalty, mic_q, pre_q, if_q, mon_q, hp_q };
}

/** ---------------------------
 *  UI RENDER
 * --------------------------*/
function renderAll() {
  document.getElementById("money").textContent = `Cash: ${Math.round(state.cash)}€`;
  renderRooms();
  renderShop();
  renderRight();
}

function renderRooms() {
  const el = document.getElementById("roomList");
  el.innerHTML = "";
  // determine visible rooms based on player level
  const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx })).filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
  document.getElementById("roomsMeta").textContent = `${visibleRooms.length} sales`;

  // ensure selected room is visible; if not, pick first visible
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
    div.innerHTML = `
      <div class="row">
        <b>${r.name}</b>
        <span class="pill">${r.type}</span>
      </div>
      <div class="row muted" style="margin-top:6px">
        <span>${r.size_m2} m² · noise ${r.noise_floor_db} dB</span>
        <span>${Object.keys(slots).length} slots</span>
      </div>
      <div class="tiny" style="margin-top:6px">Slots: ${types}${Object.keys(slots).length>4?"…":""}</div>
    `;
    el.appendChild(div);
  });

  // populate left contracts list (contracts applicable to selected room appear enabled)
  const leftContracts = document.getElementById("leftContracts");
  if (leftContracts) {
    const room = state.db.rooms[state.selected.roomIndex];
    leftContracts.innerHTML = state.db.contracts.map(c => {
      const req = c.requirements || {};
      const ok = !req.room_type || req.room_type === (room && room.type);
      return `
        <div class="card" style="${ok ? '' : 'opacity:.45'}">
          <div class="row"><b>${c.name}</b><span class="pill">${c.type}</span></div>
          <div class="muted" style="margin-top:6px">${c.duration_hours}h · ${euro(c.base_pay)}</div>
          <div style="margin-top:8px"><button class="btn2" ${ok ? `onclick="simulateContract('${c.id}')"` : 'disabled'}>${ok ? 'Simular' : 'No compatible'}</button></div>
        </div>
      `;
    }).join('');
  }
}

function renderShop() {
  const cats = Array.from(state.itemsByCategory.keys()).sort();
  const sel = document.getElementById("selCategory");
  if (!sel.options.length) {
    sel.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join("");
  }
  // keep if current not present
  if (!cats.includes(sel.value) && cats.length) sel.value = cats[0];

  const q = document.getElementById("txtSearch").value.trim().toLowerCase();
  const cat = sel.value;
  // hide items that require a higher level than the player
  const items = (state.itemsByCategory.get(cat) || []).filter(it => {
    const unlocked = Number(it.unlock_level || 1) <= Number(state.player.level || 1);
    return unlocked && (!q || String(it.name||"").toLowerCase().includes(q));
  });

  document.getElementById("shopMeta").textContent = `${items.length} items`;

  const list = document.getElementById("shopList");
  list.innerHTML = "";

  for (const it of items.slice(0, 80)) {
    const div = document.createElement("div");
    div.className = "card" + (it.id === state.selected.shopItemId ? " active":"");
    div.onclick = () => { state.selected.shopItemId = it.id; renderShop(); renderRight(); };
    const tier = it.tier || "mid";
    const tierPill = tier === "pro" ? "ok" : tier === "low" ? "bad" : "";
    const statsHtml = (it.stats && Object.keys(it.stats).length)
      ? `<div style="margin-top:8px">${Object.entries(it.stats).map(([k,v])=>`<div class=\"tiny\">${k.replace(/_/g,' ')}: ${v}</div>`).join('')}</div>`
      : '';
    div.innerHTML = `
      <div class="row">
        <b>${it.name}</b>
        <span class="pill ${tierPill}">${tier}</span>
      </div>
      <div class="row muted" style="margin-top:6px">
        <span>${it.category}</span>
        <span>${euro(it.price || 0)}</span>
      </div>
      <div class="tiny" style="margin-top:6px">${it.notes ? it.notes : ""}</div>
      ${statsHtml}
    `;
    list.appendChild(div);
  }
}

function renderRight() {
  const room = state.db.rooms[state.selected.roomIndex];
  document.getElementById("rightMeta").textContent = room ? room.name : "";

  // Room details + installed
  const details = document.getElementById("roomDetails");
  if (!room) { details.innerHTML = "<div class='muted'>No hi ha sala.</div>"; return; }

  const slots = room.slots || {};
  const bag = state.roomsInstalled[state.selected.roomIndex] || {};
  const slotHtml = Object.keys(slots).sort().map(cat => {
    const max = slots[cat];
    const used = (bag[cat] || []).length;
    return `<div class="slot"><b>${cat}</b><div class="muted">${used}/${max}</div></div>`;
  }).join("");

  details.innerHTML = `
    <div class="row">
      <b style="font-size:16px">${room.name}</b>
      <span class="pill">${room.type}</span>
    </div>
    <div class="muted" style="margin-top:6px">
      ${room.size_m2} m² · noise ${room.noise_floor_db} dB · base acoustic ${room.base_acoustic}
    </div>
    <div class="slotline">${slotHtml}</div>
  `;

  // Inventory category select
  const invCats = Array.from(state.itemsByCategory.keys()).sort();
  const selCat = document.getElementById("selInvCategory");
  // preserve previous selection if possible to avoid jumping back to first option
  const prevSelCat = selCat.value;
  selCat.innerHTML = invCats.map(c=>`<option value="${c}">${c}</option>`).join("");
  if (prevSelCat && invCats.includes(prevSelCat)) {
    selCat.value = prevSelCat;
  } else if (invCats.length) {
    selCat.value = invCats[0];
  }

  // Inventory items select (only owned qty>0)
  const cat = selCat.value;
  const owned = (state.itemsByCategory.get(cat) || []).filter(it => invQty(it.id) > 0);

  const selItem = document.getElementById("selInvItem");
  // preserve previous item selection if still valid
  const prevSelItem = selItem.value;
  selItem.innerHTML = owned.map(it => `<option value="${it.id}">${it.name} (x${invQty(it.id)})</option>`).join("");
  if (prevSelItem && owned.find(o=>o.id === prevSelItem)) {
    selItem.value = prevSelItem;
  } else if (!selItem.value && owned.length) {
    selItem.value = owned[0].id;
  }

  // KPIs
  const k = document.getElementById("kpis");
  const xpNext = xpToNext(state.player.level || 1);
  k.innerHTML = `
    <div class="box"><div class="muted">Cash</div><div class="v">${Math.round(state.cash)}€</div></div>
    <div class="box"><div class="muted">Inventari</div><div class="v">${state.inventory.size}</div></div>
    <div class="box"><div class="muted">Sala slots</div><div class="v">${Object.keys(slots).length}</div></div>
    <div class="box"><div class="muted">Nivell</div><div class="v">${state.player.level} · XP ${state.player.xp}/${xpNext}</div></div>
  `;

  // (contract form removed) no room-type select population
  // right-side contracts intentionally removed
}

/** ---------------------------
 *  ACTIONS
 * --------------------------*/
function buySelected() {
  const id = state.selected.shopItemId;
  if (!id) return log("Selecciona un item del Shop.");
  const it = state.itemsById.get(id);
  if (!it) return log("Item no trobat.");

  const qty = clamp(Number(document.getElementById("qtyBuy").value || 1), 1, 99);
  const cost = Number(it.price || 0) * qty;

  if (state.cash < cost) return log(`No tens prou diners. Necessites ${euro(cost)}.`);
  state.cash -= cost;
  invAdd(id, qty);
  // prepare install view (sets category + item) after buying
  renderAll();
  try { prepareInstallFromShop(); } catch (e) { /* ignore */ }
  log(`✅ Comprat: ${it.name} x${qty} per ${euro(cost)}.`);
}

function prepareInstallFromShop() {
  const id = state.selected.shopItemId;
  if (!id) return log("Selecciona un item del Shop.");
  const it = state.itemsById.get(id);
  const selInvCat = document.getElementById("selInvCategory");
  const selInvItem = document.getElementById("selInvItem");
  selInvCat.value = it.category;
  renderRight();
  // try set item if owned
  if (invQty(id) > 0) selInvItem.value = id;
  log("→ Preparat per instal·lar (si el tens a inventari).");
}

function installSelected() {
  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];

  const itemId = document.getElementById("selInvItem").value;
  if (!itemId) return log("No tens cap item a inventari en aquesta categoria.");
  if (invQty(itemId) <= 0) return log("No en tens a inventari.");

  const it = state.itemsById.get(itemId);
  if (!it) return log("Item no trobat.");

  const category = it.category || "misc";
  const res = installToRoom(roomIndex, category, itemId);
  if (!res.ok) return log(`❌ No es pot instal·lar: ${res.reason}`);

  // remove 1 from inventory
  invRemove(itemId, 1);
  log(`🧩 Instal·lat a ${room.name}: ${it.name} (${category})`);
  renderAll();
}

function uninstallLast() {
  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];

  // pick category currently selected in inventory filter (or any with something)
  const cat = document.getElementById("selInvCategory").value;
  const res = uninstallFromRoom(roomIndex, cat);
  if (!res.ok) return log(`❌ ${res.reason} (${cat})`);

  const it = state.itemsById.get(res.removed);
  invAdd(res.removed, 1);
  log(`↩️ Desinstal·lat de ${room.name}: ${it ? it.name : res.removed} (${cat})`);
  renderAll();
}

function simulateContract(contractId) {
  const contract = state.db.contracts.find(c => c.id === contractId);
  if (!contract) return log("Contracte no trobat.");

  const room = state.db.rooms[state.selected.roomIndex];
  // basic room type check
  const req = contract.requirements || {};
  if (req.room_type && req.room_type !== room.type) {
    log(`❌ Aquest contracte demana sala tipus "${req.room_type}". Ara estàs a "${room.type}".`);
    return;
  }

  // requirements: min_items counts
  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const used = installedIds(state.selected.roomIndex, cat).length;
      if (used < Number(min)) {
        log(`❌ Falta equip: ${cat} (${used}/${min})`);
        return;
      }
    }
  }

  // additional sanity check: if there are mics installed, ensure there are enough mic stands
  // (one stand per mic is required for live/band sessions)
  const micCount = installedIds(state.selected.roomIndex, 'mic').length;
  if (micCount > 0) {
    const standCount = installedIds(state.selected.roomIndex, 'mic_stand').length;
    if (standCount < micCount) {
      log(`❌ Falta equip: mic_stand (${standCount}/${micCount}) — cal un peu per cada micròfon.`);
      return;
    }
  }

  // min interface inputs if required
  if (req.min_interface_inputs) {
    const interfaces = installedIds(state.selected.roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean);
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    if (maxIns < Number(req.min_interface_inputs)) {
      log(`❌ Cal una interface amb mínim ${req.min_interface_inputs} entrades (ara max: ${maxIns}).`);
      return;
    }
  }

  const res = simulateRecording(state.selected.roomIndex, contract);
  state.cash += res.payout;
  // award XP based on payout and quality (reduced to slow progression)
  const xpAward = Math.max(0, Math.round(res.payout/20 + res.final_quality/10));
  addXp(xpAward);

  log(`🎬 Sessió: ${contract.name}
- Qualitat: ${res.final_quality.toFixed(1)}
- Latència: ${res.latency_ms.toFixed(1)} ms
- Happiness: ${res.happiness.toFixed(1)}
- Payout: ${euro(res.payout)}
- XP: ${xpAward}
`);

  renderAll();
}

// contract creation helpers removed

/** ---------------------------
 *  LOAD DATA
 * --------------------------*/
function loadFromObject(obj) {
  // Accept either {items, rooms, contracts} or full master {items, rooms, contracts, meta}
  const items = obj.items || [];
  const rooms = obj.rooms || [];
  const contracts = obj.contracts || [];

  state.db = { items, rooms, contracts };
  rebuildIndexes();
  ensureRoomsInstalled();
  state.selected.roomIndex = 0;
  state.selected.shopItemId = items.length ? items[0].id : null;
  log(`📦 Dades carregades: items=${items.length}, rooms=${rooms.length}, contracts=${contracts.length}`);
  // reset selects
  document.getElementById("selCategory").innerHTML = "";
  renderAll();
}

function resetGame() {
  state.cash = 1000;
  state.inventory.clear();
  ensureRoomsInstalled();
  state.selected.shopItemId = state.db.items.length ? state.db.items[0].id : null;
  log("🔄 Reset: cash=1000, inventari buit, instal·lacions buides.");
  renderAll();
}

/** ---------------------------
 *  EVENTS
 * --------------------------*/
document.getElementById("btnLoadDemo").addEventListener("click", () => loadFromObject(DEMO));
document.getElementById("btnReset").addEventListener("click", resetGame);

document.getElementById("btnBuy").addEventListener("click", buySelected);
document.getElementById("btnAddToInstall").addEventListener("click", prepareInstallFromShop);

document.getElementById("btnInstall").addEventListener("click", installSelected);
document.getElementById("btnUninstall").addEventListener("click", uninstallLast);

document.getElementById("btnSimPodcast").addEventListener("click", () => simulateContract("contract_podcast_duo"));
document.getElementById("btnSimMix").addEventListener("click", () => simulateContract("contract_mix_single"));

document.getElementById("selCategory").addEventListener("change", renderShop);
document.getElementById("txtSearch").addEventListener("input", renderShop);

document.getElementById("selInvCategory").addEventListener("change", renderRight);

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const txt = await file.text();
  try {
    const obj = JSON.parse(txt);
    // Your items_master.json is { meta, items, rooms, contracts }
    loadFromObject(obj);
  } catch (err) {
    log("❌ JSON invàlid: " + err.message);
  }
});

// boot demo by default
loadFromObject(DEMO);

// contract form buttons
// contract form event listeners removed
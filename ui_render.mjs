// ui_render.mjs - ES module renderer (moved from ui_render.js)
import { state, installedIds, installToRoom, uninstallItemFromRoom, getRoomEffective, getRoomSlotCapacity } from './state.js';
import { euro, xpToNext, invQty, invRemove, invAdd, log, showNotification, avgStat } from './helpers.js';
import { getContractETA as getContractETA_impl, workOnContract as workOnContract_impl } from './actions.js';

let micTypeListenerAdded = false;
let contractRoomListenerAdded = false;
let inventoryDropListenerAdded = false;
let clientFetchListenerAdded = false;
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

function getStaffLevels() {
  const engineer = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
  const producer = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
  return { engineer, producer };
}

function getStaffCosts(role) {
  const levels = getStaffLevels();
  const level = role === 'producer' ? levels.producer : levels.engineer;
  const base = role === 'producer' ? 280 : 320;
  const cost = Math.round(base * Math.pow(level, 1.35));
  return { level, cost };
}

function trainStaff(role) {
  const { level, cost } = getStaffCosts(role);
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
  state.cash -= cost;
  state.staff = state.staff || { engineer: { level: 1 }, producer: { level: 1 } };
  if (role === 'producer') state.staff.producer.level = level + 1;
  else state.staff.engineer.level = level + 1;
  log(`🎛️ Staff: ${role} nivell ${level + 1}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  renderAll();
}

function getUpgradeMeta(roomIndex) {
  const upgrades = state.roomUpgrades && state.roomUpgrades[roomIndex] ? state.roomUpgrades[roomIndex] : { acoustic: 0, isolation: 0, slots: 0 };
  return {
    limits: { acoustic: 5, isolation: 5, slots: 3 },
    upgrades
  };
}

function getPeopleByIdMap() {
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const map = new Map();
  for (const p of people) map.set(p.id, p);
  const selfRoles = ['engineer', 'producer', 'editor', 'mastering', 'technician'];
  for (const role of selfRoles) {
    const self = getSelfPerson(role);
    map.set(self.id, self);
  }
  return map;
}

function matchesGenre(person, genre) {
  const genres = person.genres || [];
  if (!genre || genre === 'any') return true;
  if (genres.includes('any')) return true;
  return genres.includes(genre);
}

function matchesInstrument(person, instrument) {
  if (!instrument) return true;
  const instruments = person.instruments || [];
  return instruments.includes(instrument);
}

function buildRoleDefs(contract) {
  const req = contract.requirements || {};
  const genre = contract.genre || 'any';
  const defs = [];
  if (contract.type === 'recording' || contract.type === 'streaming' || contract.type === 'production') {
    const types = Array.isArray(req.mic_types) && req.mic_types.length ? req.mic_types.slice(0, 2) : [guessInstrumentForGenre(genre)];
    for (const t of types) defs.push({ role: 'musician', instrument: t, label: `Musica (${t})` });
  }
  if (contract.type === 'production') defs.push({ role: 'producer', label: 'Producer' });
  if (contract.type === 'mix') {
    defs.push({ role: 'engineer', label: 'Engineer' });
  }
  if (contract.type === 'master') defs.push({ role: 'mastering', label: 'Mastering' });
  if (contract.type === 'mix_master') {
    defs.push({ role: 'engineer', label: 'Engineer' });
    defs.push({ role: 'mastering', label: 'Mastering' });
  }
  if (contract.type === 'streaming' || genre === 'live') defs.push({ role: 'technician', label: 'Technician' });
  return defs;
}

function pickPerson(role, genre, instrument, used) {
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const filtered = people.filter(p => p.role === role && !used.has(p.id));
  const ranked = (list) => list.sort((a, b) => Number(b.skill || 0) - Number(a.skill || 0) || Number(b.reliability || 0) - Number(a.reliability || 0));
  let list = filtered.filter(p => matchesGenre(p, genre) && matchesInstrument(p, instrument));
  if (!list.length) list = filtered.filter(p => matchesGenre(p, genre));
  if (!list.length) list = filtered;
  list = ranked(list);
  return list[0] || null;
}

function getPeopleOptions(role, genre, instrument) {
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const filtered = people.filter(p => p.role === role && matchesGenre(p, genre) && matchesInstrument(p, instrument));
  const fallback = people.filter(p => p.role === role && matchesGenre(p, genre));
  const list = filtered.length ? filtered : fallback.length ? fallback : people.filter(p => p.role === role);
  const sorted = list.sort((a,b)=>Number(b.skill||0)-Number(a.skill||0));
  if (role !== 'musician') {
    const self = getSelfPerson(role);
    return [self, ...sorted];
  }
  return sorted;
}

function getSelfPerson(role) {
  const levels = getStaffLevels();
  let skill = 55;
  if (role === 'engineer') skill = 55 + levels.engineer * 5;
  else if (role === 'producer') skill = 55 + levels.producer * 5;
  else if (role === 'editor') skill = 50 + levels.engineer * 4;
  else if (role === 'mastering') skill = 55 + levels.engineer * 4;
  else if (role === 'technician') skill = 50 + levels.engineer * 3;
  return {
    id: `self_${role}`,
    name: 'Jo',
    role,
    skill,
    reliability: 85,
    fee_per_hour: 0,
    genres: ['any']
  };
}

function guessInstrumentForGenre(genre) {
  const map = {
    rap: 'vocals',
    hiphop: 'vocals',
    podcast: 'vocals',
    pop: 'vocals',
    rock: 'guitarra',
    live: 'vocals',
    film_score: 'instruments'
  };
  return map[genre] || 'vocals';
}

function assignContractPeople(contract) {
  if (!contract || !state.db || !Array.isArray(state.db.people)) return [];
  const roleDefs = buildRoleDefs(contract);
  const peopleMap = getPeopleByIdMap();
  let existing = Array.isArray(contract.assigned_people_map) ? contract.assigned_people_map : [];
  const existingList = Array.isArray(contract.assigned_people) ? contract.assigned_people.slice() : [];
  if (!existing.length && existingList.length) {
    existing = roleDefs.map(def => ({ role: def.role, instrument: def.instrument || '', id: existingList.shift() || null }));
  }
  const used = new Set();
  const assignedMap = [];
  const genre = contract.genre || 'any';

  for (const def of roleDefs) {
    let entry = existing.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
    if (entry && entry.id && peopleMap.has(entry.id) && !used.has(entry.id)) {
      assignedMap.push({ role: def.role, instrument: def.instrument || '', id: entry.id });
      used.add(entry.id);
      continue;
    }
    if (def.role !== 'musician') {
      const self = getSelfPerson(def.role);
      assignedMap.push({ role: def.role, instrument: def.instrument || '', id: self.id });
      used.add(self.id);
      continue;
    }
    const pick = pickPerson(def.role, genre, def.instrument, used);
    if (pick) {
      assignedMap.push({ role: def.role, instrument: def.instrument || '', id: pick.id });
      used.add(pick.id);
    } else {
      assignedMap.push({ role: def.role, instrument: def.instrument || '', id: null });
    }
  }

  contract.assigned_people_map = assignedMap;
  contract.assigned_people = assignedMap.filter(p => p.id).map(p => p.id);
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  return contract.assigned_people;
}

function getUpgradeCost(type, level) {
  const base = type === 'acoustic' ? 350 : type === 'isolation' ? 420 : 600;
  return Math.round(base * Math.pow(level + 1, 1.25));
}

function applyRoomUpgrade(roomIndex, type) {
  const meta = getUpgradeMeta(roomIndex);
  const current = Number(meta.upgrades[type] || 0);
  const limit = meta.limits[type];
  if (current >= limit) return;
  const cost = getUpgradeCost(type, current);
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
  state.cash -= cost;
  state.roomUpgrades = state.roomUpgrades || {};
  state.roomUpgrades[roomIndex] = state.roomUpgrades[roomIndex] || { acoustic: 0, isolation: 0, slots: 0 };
  state.roomUpgrades[roomIndex][type] = current + 1;
  log(`🔧 Upgrade ${type}: nivell ${current + 1}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  renderAll();
}

function calcRoomRepairCost(roomIndex) {
  const bag = state.roomsInstalled[roomIndex] || {};
  let cost = 0;
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) {
      const item = state.itemsById.get(id);
      const price = Number(item && item.price || 0);
      const condition = state.itemCondition ? Number(state.itemCondition.get(id) || 100) : 100;
      if (condition < 100) cost += price * (1 - condition / 100) * 0.25;
    }
  }
  return Math.round(cost);
}

function repairRoomItems(roomIndex) {
  const cost = calcRoomRepairCost(roomIndex);
  if (cost <= 0) return;
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
  state.cash -= cost;
  state.itemCondition = state.itemCondition || new Map();
  const bag = state.roomsInstalled[roomIndex] || {};
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) state.itemCondition.set(id, 100);
  }
  log(`🧰 Reparat equip per ${euro(cost)}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  renderAll();
}

function getUnlockedItems(cat) {
  return (state.itemsByCategory.get(cat) || []).filter(it => Number(it.unlock_level || 1) <= Number(state.player.level || 1));
}

function pickBestItem(cat, statKey) {
  const items = getUnlockedItems(cat);
  if (!items.length) return null;
  if (statKey) {
    const scored = items.map(it => ({ it, val: Number((it.stats && it.stats[statKey]) || 0) }));
    scored.sort((a, b) => b.val - a.val || Number(a.it.price || 0) - Number(b.it.price || 0));
    return scored[0].it;
  }
  items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  return items[0];
}

function buildBundles(roomIndex) {
  const bundles = [];
  const room = state.db.rooms[roomIndex];
  const roomType = room ? room.type : 'control_room';

  const defs = {
    vocal_booth: [
      { name: 'Vocal Booth Kit', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'cable' },
        { cat: 'mic_stand' }
      ]}
    ],
    live_room: [
      { name: 'Live Tracking Pack', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp_multi', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphone_amp' },
        { cat: 'cable' }
      ]}
    ],
    mastering_suite: [
      { name: 'Mastering Suite', items: [
        { cat: 'monitor', stat: 'monitor_accuracy' },
        { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
        { cat: 'software_mix_master', stat: 'daw_quality' },
        { cat: 'effects' }
      ]}
    ],
    streaming_room: [
      { name: 'Streaming Rig', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'software', stat: 'daw_quality' }
      ]}
    ],
    control_room: [
      { name: 'Mix Suite', items: [
        { cat: 'monitor', stat: 'monitor_accuracy' },
        { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
        { cat: 'software_mix_master', stat: 'daw_quality' }
      ]},
      { name: 'Production Pack', items: [
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'software', stat: 'daw_quality' },
        { cat: 'midi_controller' },
        { cat: 'instruments', stat: 'instrument_quality' }
      ]}
    ]
  };

  const genreBundles = [];
  const genres = state.reputation && state.reputation.byGenre ? Object.keys(state.reputation.byGenre) : [];
  if (genres.includes('rap') || genres.includes('hiphop')) {
    genreBundles.push({ name: 'HipHop Chain', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'software', stat: 'daw_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }
  if (genres.includes('rock')) {
    genreBundles.push({ name: 'Rock Tracking', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp_multi', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphone_amp' }
    ]});
  }
  if (genres.includes('podcast')) {
    genreBundles.push({ name: 'Podcast Duo', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }

  const bundleDefs = [...(defs[roomType] || defs.control_room), ...genreBundles];

  for (const def of bundleDefs) {
    const picks = [];
    for (const entry of def.items) {
      const pick = pickBestItem(entry.cat, entry.stat);
      if (pick) picks.push(pick);
    }
    if (picks.length) {
      const total = picks.reduce((sum, it) => sum + Number(it.price || 0), 0);
      bundles.push({ name: def.name, items: picks, total });
    }
  }
  return bundles;
}

function buildUpgradePlan(roomIndex) {
  const plan = [];
  const categories = [
    { cat: 'mic', stat: 'mic_quality' },
    { cat: 'preamp', stat: 'preamp_quality' },
    { cat: 'interface', stat: 'conversion_quality' },
    { cat: 'monitor', stat: 'monitor_accuracy' },
    { cat: 'headphones', stat: 'hp_accuracy' },
    { cat: 'software', stat: 'daw_quality' }
  ];
  for (const entry of categories) {
    const installed = installedIds(roomIndex, entry.cat).map(id => state.itemsById.get(id)).filter(Boolean);
    const current = avgStat(installed, entry.stat);
    const candidates = getUnlockedItems(entry.cat)
      .map(it => ({ it, val: Number((it.stats && it.stats[entry.stat]) || 0) }))
      .filter(row => row.val > current)
      .sort((a, b) => a.it.price - b.it.price || b.val - a.val);
    if (candidates.length) {
      plan.push({
        cat: entry.cat,
        item: candidates[0].it,
        diff: Math.round((candidates[0].val - current) * 10) / 10
      });
    }
  }
  return plan;
}

function buyBundle(items) {
  const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0);
  if (state.cash < total) { log(`❌ No tens prou diners (${euro(total)})`); return; }
  state.cash -= total;
  for (const it of items) invAdd(it.id, 1);
  log(`🧺 Bundle comprat per ${euro(total)}`);
  showNotification(`🧺 Bundle comprat`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  renderAll();
}

function ensureContractBase(contract) {
  if (!contract._base_terms) {
    contract._base_terms = {
      base_pay: Number(contract.base_pay || 0),
      target_quality: Number(contract.target_quality || 0),
      deadline_days: contract.deadline_days != null ? Number(contract.deadline_days) : null
    };
  }
}

function applyNegotiation(contract, mode) {
  ensureContractBase(contract);
  const base = contract._base_terms;
  if (mode === 'reset') {
    contract.base_pay = base.base_pay;
    contract.target_quality = base.target_quality;
    contract.deadline_days = base.deadline_days;
    contract.negotiated = null;
    return;
  }
  if (mode === 'flex') {
    contract.base_pay = Math.round(base.base_pay * 0.9);
    contract.deadline_days = (base.deadline_days == null) ? 3 : base.deadline_days + 2;
    contract.target_quality = base.target_quality;
    contract.negotiated = 'flex';
    return;
  }
  if (mode === 'premium') {
    contract.base_pay = Math.round(base.base_pay * 1.15);
    contract.target_quality = base.target_quality + 5;
    contract.deadline_days = base.deadline_days;
    contract.negotiated = 'premium';
    return;
  }
  if (mode === 'rush') {
    contract.base_pay = Math.round(base.base_pay * 1.25);
    contract.target_quality = base.target_quality + 3;
    contract.deadline_days = (base.deadline_days == null) ? 1 : Math.max(1, base.deadline_days - 2);
    contract.negotiated = 'rush';
  }
}

function renderSignalFlowOverlay(canvas, floorplan) {
  if (!canvas || !floorplan) return;
  const old = canvas.querySelector('.signal-flow');
  if (old) old.remove();
  if (!state.ui || !state.ui.showSignalFlow) return;

  const zones = {};
  floorplan.querySelectorAll('.floor-zone').forEach(zone => {
    const cat = zone.dataset.category;
    zones[cat] = zone;
  });

  const pairs = [
    ['mic', 'preamp'],
    ['mic', 'preamp_multi'],
    ['preamp', 'interface'],
    ['preamp_multi', 'interface'],
    ['interface', 'software'],
    ['interface', 'software_mix_master'],
    ['interface', 'software_vst']
  ];

  const rect = floorplan.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('signal-flow');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const lines = [];
  for (const [from, to] of pairs) {
    const a = zones[from];
    const b = zones[to];
    if (!a || !b) continue;
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    const x1 = (aRect.left - rect.left) + aRect.width / 2;
    const y1 = (aRect.top - rect.top) + aRect.height / 2;
    const x2 = (bRect.left - rect.left) + bRect.width / 2;
    const y2 = (bRect.top - rect.top) + bRect.height / 2;
    lines.push({ x1, y1, x2, y2 });
  }

  for (const line of lines) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (line.x1 + line.x2) / 2;
    const d = `M ${line.x1} ${line.y1} Q ${midX} ${line.y1 - 18} ${line.x2} ${line.y2}`;
    path.setAttribute('d', d);
    path.setAttribute('class', 'flow-line');
    svg.appendChild(path);

    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'flow-line glow');
    svg.appendChild(glow);
  }

  canvas.appendChild(svg);
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
  const max = getRoomSlotCapacity(roomIndex, item.category);
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

  if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') {
    const day = Number(state.time.day || 1);
    if (!state.market || state.market.lastDayGenerated !== day) {
      window.generateDailyOffers(true);
    }
  }

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

  const btnFetch = document.getElementById('btnFetchClients');
  if (btnFetch && !clientFetchListenerAdded) {
    btnFetch.addEventListener('click', () => {
      if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') window.generateDailyOffers(true);
      renderAll();
    });
    clientFetchListenerAdded = true;
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

    const eff = getRoomEffective(idx);
    const slots = eff.slots || {};
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
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'contract', contractId: c.id }));
          }
        });
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
        if (c.genre) {
          const rep = state.reputation && state.reputation.byGenre ? (state.reputation.byGenre[c.genre] || 0) : 0;
          badges.appendChild(createBadge(`Rep ${rep}`, 'badge--genre'));
        }
        if (c.negotiated) badges.appendChild(createBadge(`Negociat: ${c.negotiated}`, 'badge--deadline'));
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

        const assignedIds = assignContractPeople(c);
        const peopleMap = getPeopleByIdMap();
        const talent = assignedIds.map(id => peopleMap.get(id)).filter(Boolean);
        const talentWrap = document.createElement('div'); talentWrap.className = 'talent-row';
        if (talent.length) {
          for (const p of talent) {
            const label = p.role === 'musician' ? `${p.name} (${(p.instruments || []).join(', ')})` : `${p.name} (${p.role})`;
            const chip = document.createElement('span'); chip.className = 'badge'; chip.textContent = label;
            talentWrap.appendChild(chip);
          }
        } else {
          const empty = document.createElement('div'); empty.className = 'tiny muted'; empty.textContent = 'Sense talent assignat';
          talentWrap.appendChild(empty);
        }

        card.appendChild(row); card.appendChild(badges); card.appendChild(meta); card.appendChild(talentWrap);

        const manualWrap = document.createElement('div'); manualWrap.className = 'talent-manual';
        const manualTitle = document.createElement('div'); manualTitle.className = 'tiny'; manualTitle.textContent = 'Talent manual:';
        manualWrap.appendChild(manualTitle);
        const selects = document.createElement('div'); selects.className = 'talent-selects';

        const genre = c.genre || 'any';
        const roleDefs = buildRoleDefs(c);
        const assignedMap = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];

        roleDefs.forEach((def, idx) => {
          const selectWrap = document.createElement('div'); selectWrap.className = 'talent-select-wrap';
          const label = document.createElement('label'); label.textContent = def.label;
          const select = document.createElement('select');
          select.dataset.role = def.role;
          select.dataset.instrument = def.instrument || '';
          select.add(new Option('Auto', ''));
          const options = getPeopleOptions(def.role, genre, def.instrument);
          options.forEach(p => select.add(new Option(`${p.name} (${p.skill})`, p.id)));

          const entry = assignedMap.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
          const currentId = entry && entry.id ? entry.id : '';
          if (currentId && peopleMap.has(currentId)) {
            const exists = Array.from(select.options).some(o => o.value === currentId);
            if (!exists) {
              const p = peopleMap.get(currentId);
              select.add(new Option(`${p.name} (${p.skill})`, p.id));
            }
            select.value = currentId;
          } else if (!currentId) {
            // fallback: auto-assign best option into selection
            const fallbackId = select.options.length > 1 ? select.options[1].value : '';
            if (fallbackId) {
              select.value = fallbackId;
              const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
              let target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
              if (!target) {
                target = { role: def.role, instrument: def.instrument || '', id: fallbackId };
                map.push(target);
              } else {
                target.id = fallbackId;
              }
              const seen = new Set();
              c.assigned_people = map.filter(p => p && p.id && !seen.has(p.id) && seen.add(p.id)).map(p => p.id);
              c.assigned_people_map = map;
            }
          }

          select.addEventListener('change', () => {
            const id = select.value;
            if (!id) {
              const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
              const target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
              if (target) target.id = null;
              assignContractPeople(c);
              renderAll();
              if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
              return;
            }
            const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
            let target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
            if (!target) {
              target = { role: def.role, instrument: def.instrument || '', id };
              map.push(target);
            }
            target.id = id;
            const seen = new Set();
            c.assigned_people = map.filter(p => p && p.id && !seen.has(p.id) && seen.add(p.id)).map(p => p.id);
            c.assigned_people_map = map;
            renderAll();
            if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
          });

          selectWrap.appendChild(label);
          selectWrap.appendChild(select);
          selects.appendChild(selectWrap);
        });

        if (roleDefs.length) {
          manualWrap.appendChild(selects);
          card.appendChild(manualWrap);
        }

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

        const negWrap = document.createElement('div'); negWrap.className = 'negotiation-row';
        const negTitle = document.createElement('div'); negTitle.className = 'tiny'; negTitle.textContent = 'Negociacio:';
        const negActions = document.createElement('div'); negActions.className = 'negotiation-actions';
        const btnFlex = document.createElement('button'); btnFlex.className = 'btn2'; btnFlex.textContent = 'Flexible'; btnFlex.addEventListener('click', () => { applyNegotiation(c, 'flex'); renderAll(); if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); });
        const btnPremium = document.createElement('button'); btnPremium.className = 'btn2'; btnPremium.textContent = 'Premium'; btnPremium.addEventListener('click', () => { applyNegotiation(c, 'premium'); renderAll(); if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); });
        const btnRush = document.createElement('button'); btnRush.className = 'btn2 btnSpecial'; btnRush.textContent = 'Rush'; btnRush.addEventListener('click', () => { applyNegotiation(c, 'rush'); renderAll(); if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); });
        const btnReset = document.createElement('button'); btnReset.className = 'btn2'; btnReset.textContent = 'Reset'; btnReset.addEventListener('click', () => { applyNegotiation(c, 'reset'); renderAll(); if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); });
        negActions.appendChild(btnFlex); negActions.appendChild(btnPremium); negActions.appendChild(btnRush); negActions.appendChild(btnReset);
        negWrap.appendChild(negTitle); negWrap.appendChild(negActions);
        card.appendChild(negWrap);

        leftContracts.appendChild(card);
      }
    }
  }

  const repPanel = document.getElementById('repPanel');
  if (repPanel) {
    clearChildren(repPanel);
    repPanel.appendChild(document.createElement('div'));
    const repHeader = document.createElement('div'); repHeader.className = 'rep-header';
    const repTitle = document.createElement('div'); repTitle.className = 'rep-title'; repTitle.textContent = 'Reputacio per genere';
    const repValue = document.createElement('div'); repValue.className = 'rep-total';
    const overall = state.reputation ? Number(state.reputation.overall || 0) : 0;
    repValue.textContent = `Total ${overall}`;
    repHeader.appendChild(repTitle); repHeader.appendChild(repValue);
    repPanel.appendChild(repHeader);

    const repBars = document.createElement('div'); repBars.className = 'rep-bars';
    const byGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
    const entries = Object.entries(byGenre).sort((a,b)=>Number(b[1])-Number(a[1]));
    if (!entries.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Encara no tens reputacio per genere.';
      repPanel.appendChild(empty);
    } else {
      const max = Math.max(1, ...entries.map(e => Number(e[1]) || 0));
      for (const [genre, value] of entries) {
        const row = document.createElement('div'); row.className = 'rep-row';
        const label = document.createElement('div'); label.className = 'rep-label'; label.textContent = genre;
        const bar = document.createElement('div'); bar.className = 'rep-bar';
        const fill = document.createElement('div'); fill.className = 'rep-bar-fill';
        fill.style.width = `${Math.min(100, Math.round((Number(value) / max) * 100))}%`;
        const val = document.createElement('div'); val.className = 'rep-val'; val.textContent = String(value);
        bar.appendChild(fill);
        row.appendChild(label); row.appendChild(bar); row.appendChild(val);
        repBars.appendChild(row);
      }
      repPanel.appendChild(repBars);
    }
  }

  const repPanelRooms = document.getElementById('repPanelRooms');
  if (repPanelRooms) {
    clearChildren(repPanelRooms);
    const repHeader = document.createElement('div'); repHeader.className = 'rep-header';
    const repTitle = document.createElement('div'); repTitle.className = 'rep-title'; repTitle.textContent = 'Reputacio per genere';
    const repValue = document.createElement('div'); repValue.className = 'rep-total';
    const overall = state.reputation ? Number(state.reputation.overall || 0) : 0;
    repValue.textContent = `Total ${overall}`;
    repHeader.appendChild(repTitle); repHeader.appendChild(repValue);
    repPanelRooms.appendChild(repHeader);

    const repBars = document.createElement('div'); repBars.className = 'rep-bars';
    const byGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
    const entries = Object.entries(byGenre).sort((a,b)=>Number(b[1])-Number(a[1]));
    if (!entries.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Encara no tens reputacio per genere.';
      repPanelRooms.appendChild(empty);
    } else {
      const max = Math.max(1, ...entries.map(e => Number(e[1]) || 0));
      for (const [genre, value] of entries) {
        const row = document.createElement('div'); row.className = 'rep-row';
        const label = document.createElement('div'); label.className = 'rep-label'; label.textContent = genre;
        const bar = document.createElement('div'); bar.className = 'rep-bar';
        const fill = document.createElement('div'); fill.className = 'rep-bar-fill';
        fill.style.width = `${Math.min(100, Math.round((Number(value) / max) * 100))}%`;
        const val = document.createElement('div'); val.className = 'rep-val'; val.textContent = String(value);
        bar.appendChild(fill);
        row.appendChild(label); row.appendChild(bar); row.appendChild(val);
        repBars.appendChild(row);
      }
      repPanelRooms.appendChild(repBars);
    }
  }

  const offersEl = document.getElementById('clientOffers');
  if (offersEl) {
    clearChildren(offersEl);
    const offers = (state.market && Array.isArray(state.market.offers)) ? state.market.offers : [];
    if (!offers.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'No hi ha ofertes avui.';
      offersEl.appendChild(empty);
    } else {
      for (const offer of offers) {
        const card = document.createElement('div'); card.className = 'offer-card';
        const row = document.createElement('div'); row.className = 'offer-row';
        const name = document.createElement('b'); name.textContent = offer.name;
        const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = offer.type;
        row.appendChild(name); row.appendChild(pill);
        const meta = document.createElement('div'); meta.className = 'offer-meta';
        meta.textContent = `${offer.duration_hours}h · ${euro(offer.base_pay)} · Qualitat ${offer.target_quality} · Deadline ${offer.deadline_days}d`;
        const actions = document.createElement('div'); actions.className = 'offer-actions';
        const btnAccept = document.createElement('button'); btnAccept.className = 'btn2 btnOk'; btnAccept.textContent = 'Acceptar';
        btnAccept.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.acceptOffer === 'function') window.acceptOffer(offer.id); });
        const btnDecline = document.createElement('button'); btnDecline.className = 'btn2'; btnDecline.textContent = 'Declinar';
        btnDecline.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.declineOffer === 'function') window.declineOffer(offer.id); });
        actions.appendChild(btnAccept); actions.appendChild(btnDecline);
        card.appendChild(row); card.appendChild(meta); card.appendChild(actions);
        offersEl.appendChild(card);
      }
    }
  }

  const scheduleBoard = document.getElementById('scheduleBoard');
  if (scheduleBoard) {
    clearChildren(scheduleBoard);
    const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx }))
      .filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
    const days = 7;
    const startDay = Number(state.time.day || 1);
    const schedule = Array.isArray(state.schedule) ? state.schedule : [];
    const grid = document.createElement('div'); grid.className = 'schedule-grid';
    const head = document.createElement('div'); head.className = 'schedule-head';
    const blank = document.createElement('div'); blank.textContent = 'Sala'; head.appendChild(blank);
    for (let i = 0; i < days; i++) {
      const d = document.createElement('div'); d.textContent = `Dia ${startDay + i}`; head.appendChild(d);
    }
    grid.appendChild(head);

    for (const { r, idx } of visibleRooms) {
      const row = document.createElement('div'); row.className = 'schedule-row';
      const roomCell = document.createElement('div'); roomCell.className = 'schedule-room'; roomCell.textContent = r.name;
      row.appendChild(roomCell);
      for (let i = 0; i < days; i++) {
        const day = startDay + i;
        const cell = document.createElement('div'); cell.className = 'schedule-cell';
        cell.dataset.roomIndex = String(idx);
        cell.dataset.day = String(day);

        const items = schedule.filter(s => s.roomIndex === idx && s.day === day);
        for (const s of items) {
          const c = state.db.contracts.find(x => x.id === s.contractId);
          if (!c) continue;
          const chip = document.createElement('div'); chip.className = 'schedule-item';
          chip.textContent = `${c.name} (${c.duration_hours}h)`;
          chip.setAttribute('draggable', 'true');
          chip.addEventListener('dragstart', (e) => {
            if (e.dataTransfer) {
              e.dataTransfer.setData('text/plain', JSON.stringify({
                type: 'scheduled',
                contractId: s.contractId,
                roomIndex: s.roomIndex,
                day: s.day
              }));
            }
          });
          cell.appendChild(chip);
        }

        cell.addEventListener('dragover', (e) => {
          if (!e.dataTransfer) return;
          const raw = e.dataTransfer.getData('text/plain');
          if (!raw) return;
          e.preventDefault();
          cell.classList.add('drag-over');
        });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', (e) => {
          e.preventDefault();
          cell.classList.remove('drag-over');
          const raw = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
          if (!raw) return;
          let payload = null;
          try { payload = JSON.parse(raw); } catch (err) { payload = { type: 'contract', contractId: raw }; }
          const contractId = payload.contractId || payload.id;
          const contract = state.db.contracts.find(x => x.id === contractId);
          if (!contract) return;
          const roomIndex = Number(cell.dataset.roomIndex || 0);
          const dayNum = Number(cell.dataset.day || startDay);
          if (contract.requirements && contract.requirements.room_type) {
            const room = state.db.rooms[roomIndex];
            if (room && room.type !== contract.requirements.room_type) {
              log('❌ Sala incompatible');
              return;
            }
          }
          state.schedule = Array.isArray(state.schedule) ? state.schedule : [];
          state.schedule = state.schedule.filter(s => s.contractId !== contractId);
          state.schedule.push({ contractId, roomIndex, day: dayNum });
          if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
          renderAll();
        });

        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
    scheduleBoard.appendChild(grid);
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

  const bundleWrap = document.getElementById('shopBundles');
  if (bundleWrap) {
    clearChildren(bundleWrap);
    const bundles = buildBundles(state.selected.roomIndex);
    const plan = buildUpgradePlan(state.selected.roomIndex);
    if (bundles.length || plan.length) {
      const bundleTitle = document.createElement('div'); bundleTitle.className = 'bundle-title'; bundleTitle.textContent = 'Bundles i plans';
      bundleWrap.appendChild(bundleTitle);
    }
    const bundleGrid = document.createElement('div'); bundleGrid.className = 'bundle-grid';
    for (const b of bundles) {
      const card = document.createElement('div'); card.className = 'bundle-card';
      const name = document.createElement('div'); name.className = 'bundle-name'; name.textContent = b.name;
      const list = document.createElement('div'); list.className = 'bundle-items';
      b.items.forEach(it => {
        const row = document.createElement('div'); row.className = 'bundle-item';
        row.textContent = `${it.name} · ${euro(it.price || 0)}`;
        list.appendChild(row);
      });
      const total = document.createElement('div'); total.className = 'bundle-total'; total.textContent = `Total ${euro(b.total)}`;
      const btn = document.createElement('button'); btn.className = 'btn2 btnOk'; btn.textContent = 'Comprar bundle';
      btn.addEventListener('click', () => buyBundle(b.items));
      card.appendChild(name); card.appendChild(list); card.appendChild(total); card.appendChild(btn);
      bundleGrid.appendChild(card);
    }
    if (plan.length) {
      const planCard = document.createElement('div'); planCard.className = 'bundle-card';
      const title = document.createElement('div'); title.className = 'bundle-name'; title.textContent = 'Upgrade Plan';
      const list = document.createElement('div'); list.className = 'bundle-items';
      plan.slice(0, 4).forEach(p => {
        const row = document.createElement('div'); row.className = 'bundle-item';
        row.textContent = `${p.cat}: ${p.item.name} (+${p.diff}) · ${euro(p.item.price || 0)}`;
        list.appendChild(row);
      });
      planCard.appendChild(title); planCard.appendChild(list);
      bundleGrid.appendChild(planCard);
    }
    bundleWrap.appendChild(bundleGrid);
  }

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
    let compareStats = null;
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

      const aStats = it.stats || {};
      const bStats = selected.stats || {};
      const keys = Array.from(new Set([...Object.keys(aStats), ...Object.keys(bStats)]))
        .filter(k => typeof aStats[k] === 'number' || typeof bStats[k] === 'number');
      const diffs = keys.map(k => ({
        key: k,
        diff: Number(aStats[k] || 0) - Number(bStats[k] || 0)
      })).filter(d => d.diff !== 0);
      diffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
      if (diffs.length) {
        compareStats = document.createElement('div');
        compareStats.className = 'compare-stats';
        diffs.slice(0, 4).forEach(d => {
          const row = document.createElement('div'); row.className = 'compare-stat';
          const label = document.createElement('span'); label.textContent = formatStatKey(d.key);
          const val = document.createElement('span');
          val.className = d.diff > 0 ? 'compare-up' : 'compare-down';
          val.textContent = d.diff > 0 ? `+${d.diff}` : `${d.diff}`;
          row.appendChild(label); row.appendChild(val);
          compareStats.appendChild(row);
        });
      }
    }

    body.appendChild(row); body.appendChild(row2);
    if (notes.textContent) body.appendChild(notes);
    if (statWrap.childNodes.length) body.appendChild(statWrap);
    layout.appendChild(art); layout.appendChild(body);
    div.appendChild(layout);
    if (compareRow) div.appendChild(compareRow);
    if (compareStats) div.appendChild(compareStats);

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
  const effRoom = getRoomEffective(state.selected.roomIndex);
  const room = effRoom.room;
  const rightMeta = document.getElementById('rightMeta'); if (rightMeta) rightMeta.textContent = room ? room.name : "";

  const details = document.getElementById("roomDetails");
  clearChildren(details);
  if (!room) { const nm = document.createElement('div'); nm.className = 'muted'; nm.textContent = 'No hi ha sala.'; details.appendChild(nm); return; }

  const slots = effRoom.slots || {};
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
    renderRight();
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
  requestAnimationFrame(() => renderSignalFlowOverlay(canvas, floorplan));

  const opsGrid = document.createElement('div'); opsGrid.className = 'room-ops-grid';

  // Staff panel
  const staffCard = document.createElement('div'); staffCard.className = 'ops-card';
  const staffTitle = document.createElement('div'); staffTitle.className = 'ops-title'; staffTitle.textContent = 'Personal';
  const staffBody = document.createElement('div'); staffBody.className = 'ops-body';
  const levels = getStaffLevels();
  const engSkill = 55 + levels.engineer * 5;
  const prodSpeed = Math.min(40, Math.round(levels.producer * 3));
  const engFatigue = Math.min(40, Math.round(levels.engineer * 3));
  const engLine = document.createElement('div'); engLine.className = 'ops-row';
  engLine.textContent = `Engineer lvl ${levels.engineer} · Qualitat +${engSkill}`;
  const prodLine = document.createElement('div'); prodLine.className = 'ops-row';
  prodLine.textContent = `Producer lvl ${levels.producer} · Velocitat +${prodSpeed}%`;
  const fatLine = document.createElement('div'); fatLine.className = 'ops-row muted';
  fatLine.textContent = `Fatiga -${engFatigue}%`;
  const staffActions = document.createElement('div'); staffActions.className = 'ops-actions';
  const engCost = getStaffCosts('engineer');
  const prodCost = getStaffCosts('producer');
  const btnEng = document.createElement('button'); btnEng.className = 'btn2 btnOk'; btnEng.textContent = `Entrenar Engineer (${euro(engCost.cost)})`;
  btnEng.addEventListener('click', () => trainStaff('engineer'));
  const btnProd = document.createElement('button'); btnProd.className = 'btn2'; btnProd.textContent = `Entrenar Producer (${euro(prodCost.cost)})`;
  btnProd.addEventListener('click', () => trainStaff('producer'));
  staffActions.appendChild(btnEng); staffActions.appendChild(btnProd);
  staffBody.appendChild(engLine); staffBody.appendChild(prodLine); staffBody.appendChild(fatLine);
  staffCard.appendChild(staffTitle); staffCard.appendChild(staffBody); staffCard.appendChild(staffActions);

  // Upgrades panel
  const upgradeCard = document.createElement('div'); upgradeCard.className = 'ops-card';
  const upgradeTitle = document.createElement('div'); upgradeTitle.className = 'ops-title'; upgradeTitle.textContent = 'Upgrades sala';
  const upgradeBody = document.createElement('div'); upgradeBody.className = 'ops-body';
  const metaUp = getUpgradeMeta(state.selected.roomIndex);
  const up = metaUp.upgrades;
  const acousticNext = effRoom.base_acoustic + 5;
  const noiseNext = effRoom.noise_floor_db - 2;
  const slotBonus = Number(up.slots || 0);
  const acousticLine = document.createElement('div'); acousticLine.className = 'ops-row';
  acousticLine.textContent = `Acustica: ${effRoom.base_acoustic} -> ${acousticNext}`;
  const noiseLine = document.createElement('div'); noiseLine.className = 'ops-row';
  noiseLine.textContent = `Insonor: ${effRoom.noise_floor_db} dB -> ${noiseNext} dB`;
  const slotsLine = document.createElement('div'); slotsLine.className = 'ops-row';
  slotsLine.textContent = `Racks: +${slotBonus} per categoria`;
  const upgradeActions = document.createElement('div'); upgradeActions.className = 'ops-actions';
  const btnAc = document.createElement('button'); btnAc.className = 'btn2';
  btnAc.textContent = up.acoustic >= metaUp.limits.acoustic ? 'Acustica MAX' : `Acustica (${euro(getUpgradeCost('acoustic', up.acoustic))})`;
  btnAc.disabled = up.acoustic >= metaUp.limits.acoustic;
  btnAc.addEventListener('click', () => applyRoomUpgrade(state.selected.roomIndex, 'acoustic'));
  const btnIso = document.createElement('button'); btnIso.className = 'btn2';
  btnIso.textContent = up.isolation >= metaUp.limits.isolation ? 'Insonor MAX' : `Insonor (${euro(getUpgradeCost('isolation', up.isolation))})`;
  btnIso.disabled = up.isolation >= metaUp.limits.isolation;
  btnIso.addEventListener('click', () => applyRoomUpgrade(state.selected.roomIndex, 'isolation'));
  const btnSlots = document.createElement('button'); btnSlots.className = 'btn2 btnOk';
  btnSlots.textContent = up.slots >= metaUp.limits.slots ? 'Racks MAX' : `Racks (${euro(getUpgradeCost('slots', up.slots))})`;
  btnSlots.disabled = up.slots >= metaUp.limits.slots;
  btnSlots.addEventListener('click', () => applyRoomUpgrade(state.selected.roomIndex, 'slots'));
  upgradeActions.appendChild(btnAc); upgradeActions.appendChild(btnIso); upgradeActions.appendChild(btnSlots);
  upgradeBody.appendChild(acousticLine); upgradeBody.appendChild(noiseLine); upgradeBody.appendChild(slotsLine);
  upgradeCard.appendChild(upgradeTitle); upgradeCard.appendChild(upgradeBody); upgradeCard.appendChild(upgradeActions);

  // Maintenance panel
  const maintenanceCard = document.createElement('div'); maintenanceCard.className = 'ops-card';
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

  opsGrid.appendChild(staffCard);
  opsGrid.appendChild(upgradeCard);
  opsGrid.appendChild(maintenanceCard);
  details.appendChild(opsGrid);

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
  if (k) {
    for (const item of kpiData) k.appendChild(makeBox(item.label, item.value, item.meter, item.variant));
  }
  if (mobileKpis) {
    const allowed = new Set(['Cash', 'Temps', 'Nivell', 'Fatiga', 'Reputacio']);
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
  window.assignContractPeople = window.assignContractPeople || assignContractPeople;
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

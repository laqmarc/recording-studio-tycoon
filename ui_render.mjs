// ui_render.mjs - ES module renderer (moved from ui_render.js)
import { state, installedIds } from './state.js';
import { PEOPLE_FALLBACK } from './people_data.js';
import { euro, log } from './helpers.js';
import { getContractETA as getContractETA_impl, workOnContract as workOnContract_impl } from './actions.js';
import { renderOffers } from './ui/offers.js';
import { renderPersonnelPanel } from './ui/people.js';
import { renderScheduleBoard } from './ui/schedule.js';
import { renderReputationPanels } from './ui/reputation.js';
import { renderShop as renderShopImpl } from './ui/shop.js';
import { renderRooms as renderRoomsImpl } from './ui/rooms.js';
import { renderRoomDetails } from './ui/room_details.js';

if (state.db && (!Array.isArray(state.db.people) || !state.db.people.length)) {
  state.db.people = PEOPLE_FALLBACK;
  if (typeof window !== 'undefined') window.PEOPLE = state.db.people;
}

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

function getRiskLevel(contract) {
  const target = Number(contract.target_quality || 0);
  const duration = Number(contract.duration_hours || 0);
  const score = target + duration * 0.6;
  if (score >= 85) return { level: 'high', label: 'Risc alt' };
  if (score >= 70) return { level: 'mid', label: 'Risc mitja' };
  return { level: 'low', label: 'Risc baix' };
}

function formatEta(eta) {
  const days = Number(eta.days || 0);
  const hoursRaw = Number(eta.hours || 0);
  const hours = Math.round(hoursRaw * 10) / 10;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
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

function ensurePeopleData() {
  if (!state.db) return;
  if (Array.isArray(state.db.people) && state.db.people.length) return;
  let source = null;
  if (typeof window !== 'undefined' && Array.isArray(window.PEOPLE) && window.PEOPLE.length) source = window.PEOPLE;
  else source = PEOPLE_FALLBACK;
  state.db.people = Array.isArray(source) ? source : [];
  if (typeof window !== 'undefined') window.PEOPLE = state.db.people;
}

function getPeopleByIdMap() {
  ensurePeopleData();
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

function isHired(id) {
  return Array.isArray(state.hiredPeople) && state.hiredPeople.includes(id);
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
  ensurePeopleData();
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const filtered = people.filter(p => p.role === role && isHired(p.id) && !used.has(p.id));
  const ranked = (list) => list.sort((a, b) => Number(b.skill || 0) - Number(a.skill || 0) || Number(b.reliability || 0) - Number(a.reliability || 0));
  let list = filtered.filter(p => matchesGenre(p, genre) && matchesInstrument(p, instrument));
  if (!list.length) list = filtered.filter(p => matchesGenre(p, genre));
  if (!list.length) list = filtered;
  list = ranked(list);
  if (list[0]) return list[0];
  if (role !== 'musician') return getSelfPerson(role);
  return null;
}

function getPeopleOptions(role, genre, instrument) {
  ensurePeopleData();
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const hired = people.filter(p => isHired(p.id));
  const filtered = hired.filter(p => p.role === role && matchesGenre(p, genre) && matchesInstrument(p, instrument));
  const fallback = hired.filter(p => p.role === role && matchesGenre(p, genre));
  const list = filtered.length ? filtered : fallback.length ? fallback : hired.filter(p => p.role === role);
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
  if (!contract || !state.db) return [];
  ensurePeopleData();
  if (!Array.isArray(state.db.people)) return [];
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
  const normalized = (page === 'contracts' || page === 'shop' || page === 'rooms' || page === 'people') ? page : 'rooms';
  state.ui = state.ui || { page: 'rooms' };
  state.ui.page = normalized;
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-page', normalized);
    document.querySelectorAll('[data-page-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-page-tab') === normalized);
    });
  }
  try { console.log('[page]', normalized); } catch (e) {}
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

export function renderAll() {
  ensurePeopleData();
  const moneyEl = document.getElementById('money');
  if (moneyEl) moneyEl.textContent = `Cash: ${Math.round(state.cash)}€`;
  renderRooms();
  renderShop();
  renderRight();
}

export function renderRooms() {
  renderRoomsImpl({
    createArt,
    getRoomArt,
    getContractETA: getContractETA_impl,
    formatEta,
    getRiskLevel,
    createBadge,
    assignContractPeople,
    getPeopleByIdMap,
    buildRoleDefs,
    getPeopleOptions,
    getRequirementsElement,
    renderAll
  });
  renderReputationPanels();
  renderOffers({ getRequirementsElement });
  renderPersonnelPanel({ ensurePeopleData, renderAll });
  renderScheduleBoard({ renderAll });
}

export function renderShop() {
  renderShopImpl({
    createArt,
    getItemArt,
    formatStatKey,
    getTopStats,
    getPrimaryStat,
    renderRight,
    renderAll
  });
}

export function renderRight() {
  renderRoomDetails({
    renderRight,
    renderAll,
    getRoomArt,
    getItemArt,
    createArt,
    renderSignalFlowOverlay,
    getStaffLevels,
    getStaffCosts,
    trainStaff,
    getUpgradeMeta,
    getUpgradeCost,
    applyRoomUpgrade,
    calcRoomRepairCost,
    repairRoomItems,
    getTopStats,
    formatStatKey
  });
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

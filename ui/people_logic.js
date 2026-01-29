import { state } from '../state.js';
import { PEOPLE_FALLBACK } from '../people_data.js';
import { getStaffLevels } from './staff.js';

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

export function ensurePeopleData() {
  if (!state.db) return;
  if (Array.isArray(state.db.people) && state.db.people.length) return;
  let source = null;
  if (typeof window !== 'undefined' && Array.isArray(window.PEOPLE) && window.PEOPLE.length) source = window.PEOPLE;
  else source = PEOPLE_FALLBACK;
  state.db.people = Array.isArray(source) ? source : [];
  if (typeof window !== 'undefined') window.PEOPLE = state.db.people;
}

export function getPeopleByIdMap() {
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

export function buildRoleDefs(contract) {
  const req = contract.requirements || {};
  const genre = contract.genre || 'any';
  const talentMode = contract.talent_mode || 'studio_musicians';
  const defs = [];
  const allowMusicians = talentMode !== 'client_band' && talentMode !== 'client_podcast';
  if (allowMusicians && (contract.type === 'recording' || contract.type === 'streaming' || contract.type === 'production')) {
    const types = Array.isArray(req.mic_types) && req.mic_types.length ? req.mic_types.slice() : [guessInstrumentForGenre(genre)];
    const grouped = groupInstruments(types);
    for (const g of grouped) defs.push({ role: 'musician', instrument: g.representative, label: `Music (${g.label})` });
  }
  if (contract.type === 'production') defs.push({ role: 'producer', label: 'Productor' });
  if (contract.type === 'mix') {
    defs.push({ role: 'engineer', label: 'Enginyer' });
  }
  if (contract.type === 'edit') {
    defs.push({ role: 'editor', label: 'Editor' });
  }
  if (contract.type === 'master') defs.push({ role: 'mastering', label: 'Mastering' });
  if (contract.type === 'mix_master') {
    defs.push({ role: 'engineer', label: 'Enginyer' });
    defs.push({ role: 'mastering', label: 'Mastering' });
  }
  if (contract.type === 'streaming' || genre === 'live') defs.push({ role: 'technician', label: 'Tecnic' });
  if (!allowMusicians && (contract.type === 'recording' || contract.type === 'streaming')) {
    defs.unshift({ role: 'engineer', label: 'Enginyer' });
  }
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

export function getPeopleOptions(role, genre, instrument) {
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

export function getSelfPerson(role) {
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
    film_score: 'instruments',
    commercial: 'vocals'
  };
  return map[genre] || 'vocals';
}

function groupInstruments(types) {
  const grouped = new Map();
  for (const t of types) {
    const normalized = normalizeInstrument(t);
    if (!grouped.has(normalized.key)) grouped.set(normalized.key, normalized);
  }
  return Array.from(grouped.values());
}

function normalizeInstrument(type) {
  const drumSet = new Set(['bombo', 'caixa', 'hh', 'oh', 'tomb', 'tom', 'ride', 'crash']);
  if (drumSet.has(type)) {
    return { key: 'drums', representative: 'bombo', label: 'Bateria' };
  }
  const label = type.replace(/_/g, ' ');
  const title = label.replace(/\b\w/g, (char) => char.toUpperCase());
  return { key: type, representative: type, label: title };
}

export function assignContractPeople(contract) {
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

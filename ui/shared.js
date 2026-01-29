export const ROOM_ART = {
  control_room: 'assets/rooms/control_room.svg',
  live_room: 'assets/rooms/live_room.svg',
  vocal_booth: 'assets/rooms/vocal_booth.svg',
  mastering_suite: 'assets/rooms/mastering_suite.svg',
  streaming_room: 'assets/rooms/streaming_room.svg',
  podcast_studio: 'assets/rooms/streaming_room.svg',
  foley_room: 'assets/rooms/live_room.svg',
  edit_room: 'assets/rooms/control_room.svg'
};

export const ITEM_ART = {
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

const CATEGORY_LABELS = {
  console_digital: 'Console Digital',
  console_analog: 'Console Analog',
  mic_stand: 'Mic Stand',
  mic_accessory: 'Mic Accessory',
  pop_filter: 'Pop Filter',
  shock_mount: 'Shock Mount',
  acoustic_treatment: 'Acoustic Treatment',
  headphone_amp: 'Headphone Amp',
  software_daw: 'Software DAW',
  software_fx: 'Software FX',
  software_mix_master: 'Software Mix/Master',
  midi_controller: 'MIDI Controller',
  monitor_stand: 'Monitor Stand',
  preamp_multi: 'Preamp Multi'
};

const ROOM_LABELS = {
  control_room: 'Sala de Control',
  live_room: 'Sala en directe',
  vocal_booth: 'Cabina de veu',
  mastering_suite: 'Suite de Mastering',
  streaming_room: 'Sala de Streaming',
  podcast_studio: 'Estudi de Podcast',
  foley_room: 'Sala Foley',
  edit_room: "Sala d'Edicio"
};

const CONTRACT_TYPE_LABELS = {
  recording: 'Gravacio',
  streaming: 'Streaming',
  mix: 'Mescla',
  master: 'Mastering',
  mix_master: 'Mescla + Mastering',
  production: 'Produccio',
  edit: 'Edicio'
};

const GENRE_LABELS = {
  pop: 'Pop',
  rap: 'Rap',
  hiphop: 'Hip-Hop',
  rock: 'Rock',
  podcast: 'Podcast',
  live: 'Live',
  film_score: 'Film Score',
  commercial: 'Commercial',
  any: 'Qualsevol'
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

export function clearChildren(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

export function createTextDiv(text, color) {
  const d = document.createElement('div');
  if (color) d.style.color = color;
  d.textContent = text;
  return d;
}

export function getRoomArt(room) {
  if (!room) return DEFAULT_ROOM_ART;
  return ROOM_ART[room.type] || DEFAULT_ROOM_ART;
}

export function getItemArt(item) {
  if (!item) return DEFAULT_ITEM_ART;
  const cat = item.category || 'misc';
  return ITEM_ART[cat] || DEFAULT_ITEM_ART;
}

export function createArt(src, alt) {
  const wrap = document.createElement('div');
  wrap.className = 'card-art';
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  wrap.appendChild(img);
  return wrap;
}

export function formatStatKey(key) {
  if (!key) return '';
  if (STAT_LABELS[key]) return STAT_LABELS[key];
  return key.replace(/_/g, ' ').slice(0, 12);
}

export function formatCategoryLabel(category) {
  if (!category) return '';
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
  const label = category.replace(/_/g, ' ');
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatRoomLabel(roomType) {
  if (!roomType) return '';
  if (ROOM_LABELS[roomType]) return ROOM_LABELS[roomType];
  const label = roomType.replace(/_/g, ' ');
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatContractTypeLabel(type) {
  if (!type) return '';
  if (CONTRACT_TYPE_LABELS[type]) return CONTRACT_TYPE_LABELS[type];
  const label = type.replace(/_/g, ' ');
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatGenreLabel(genre) {
  if (!genre) return '';
  if (GENRE_LABELS[genre]) return GENRE_LABELS[genre];
  const label = genre.replace(/_/g, ' ');
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPrimaryStat(item) {
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

export function getTopStats(item, limit = 3) {
  if (!item || !item.stats) return [];
  const entries = Object.entries(item.stats)
    .filter(([, v]) => typeof v === 'number')
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, limit);
  return entries.map(([key, value]) => ({ key, value }));
}

export function createBadge(text, variant, extraClass) {
  const badge = document.createElement('span');
  badge.className = `badge ${variant || ''}`.trim();
  if (extraClass) badge.classList.add(extraClass);
  badge.textContent = text;
  return badge;
}

export function getRiskLevel(contract) {
  const target = Number(contract.target_quality || 0);
  const duration = Number(contract.duration_hours || 0);
  const score = target + duration * 0.6;
  if (score >= 85) return { level: 'high', label: 'Risc alt' };
  if (score >= 70) return { level: 'mid', label: 'Risc mitja' };
  return { level: 'low', label: 'Risc baix' };
}

export function formatEta(eta) {
  const days = Number(eta.days || 0);
  const hoursRaw = Number(eta.hours || 0);
  const hours = Math.round(hoursRaw * 10) / 10;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

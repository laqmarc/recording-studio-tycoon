import { state } from './state.js';
import { log, showNotification, euro } from './helpers.js';

const GENRES = ['pop', 'rap', 'hiphop', 'rock', 'podcast', 'live', 'film_score'];
const TEMPLATE_POOL = [
  {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [120, 260],
    target_quality: [55, 72],
    duration: [3, 6],
    deadline: [2, 5],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1 }
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 3,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [140, 280],
    target_quality: [58, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 4,
    allowed_genres: ['rock', 'live'],
    base_pay: [220, 420],
    target_quality: [60, 78],
    duration: [4, 7],
    deadline: [2, 5],
    min_items: { mic: 4, preamp_multi: 1, interface: 1, headphones: 2, cable: 6, mic_stand: 4 },
    mic_types: ['guitarra', 'caixa', 'oh']
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['any'],
    base_pay: [150, 300],
    target_quality: [60, 75],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 2 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['any'],
    base_pay: [120, 220],
    target_quality: [55, 70],
    duration: [2, 4],
    deadline: [2, 4],
    min_items: { monitor: 2, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 2,
    allowed_genres: ['any'],
    base_pay: [180, 320],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [220, 420],
    target_quality: [65, 82],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 4, software_daw: 1 }
  },
  {
    type: 'master',
    room_type: 'control_room',
    unlock_level: 4,
    allowed_genres: ['any'],
    base_pay: [180, 360],
    target_quality: [62, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 4 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [240, 460],
    target_quality: [66, 86],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 6, software_daw: 1 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    unlock_level: 6,
    allowed_genres: ['hiphop', 'pop', 'film_score'],
    base_pay: [280, 620],
    target_quality: [60, 78],
    duration: [4, 8],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['live', 'podcast'],
    base_pay: [120, 240],
    target_quality: [55, 70],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1 }
  },
  {
    type: 'streaming',
    room_type: 'control_room',
    unlock_level: 3,
    allowed_genres: ['podcast'],
    base_pay: [130, 260],
    target_quality: [56, 72],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1 }
  }
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[0];
}

function pickGenreWithTemplates(templates) {
  const rep = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const allowed = new Set();
  for (const t of templates) {
    const list = t.allowed_genres || ['any'];
    if (list.includes('any')) {
      for (const g of GENRES) allowed.add(g);
    } else {
      for (const g of list) allowed.add(g);
    }
  }
  const genres = GENRES.filter(g => allowed.has(g));
  if (!genres.length) return 'pop';
  const weights = genres.map(g => 1 + Number(rep[g] || 0));
  return pickWeighted(genres, weights);
}

function pickTemplate(templates, genre) {
  const playerLevel = Number((state.player && state.player.level) || 1);
  const pool = templates.filter(t => {
    if (t.unlock_level && playerLevel < t.unlock_level) return false;
    const allowed = t.allowed_genres || ['any'];
    if (!allowed.includes('any') && !allowed.includes(genre)) return false;
    return true;
  });
  if (!pool.length) return templates[randInt(0, templates.length - 1)];
  return pool[randInt(0, pool.length - 1)];
}

function getEligibleTemplates(repOverall) {
  const playerLevel = Number((state.player && state.player.level) || 1);
  const unlockedTypes = getUnlockedRoomTypes();
  return TEMPLATE_POOL.filter(t => {
    if (t.unlock_level && playerLevel < t.unlock_level) return false;
    if (t.room_type && !unlockedTypes.has(t.room_type)) return false;
    if (repOverall < 5) return t.type === 'recording' || t.type === 'mix';
    if (repOverall < 10) return t.type === 'recording' || t.type === 'mix' || t.type === 'master';
    if (repOverall < 20) return t.type !== 'production';
    return true;
  });
}

function getUnlockedRoomTypes() {
  const types = new Set();
  const rooms = state.db && Array.isArray(state.db.rooms) ? state.db.rooms : [];
  const level = Number((state.player && state.player.level) || 1);
  for (const r of rooms) {
    if (Number(r.unlock_level || 1) <= level) types.add(r.type);
  }
  return types;
}

function pickMicTypes(genre, type) {
  const map = {
    rap: ['vocals'],
    hiphop: ['vocals'],
    pop: ['vocals'],
    podcast: ['vocals'],
    rock: ['guitarra'],
    live: ['vocals'],
    film_score: ['instruments']
  };
  const types = map[genre] || ['vocals'];
  if (type === 'recording' || type === 'streaming') return types;
  return [];
}

function buildOffer(day, index, templates) {
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const genre = pickGenreWithTemplates(templates);
  const template = pickTemplate(templates, genre);
  const pay = randInt(template.base_pay[0], template.base_pay[1]);
  const target = randInt(template.target_quality[0], template.target_quality[1]);
  const duration = randInt(template.duration[0], template.duration[1]);
  const deadline = randInt(template.deadline[0], template.deadline[1]);
  const repBoost = 1 + repOverall * 0.01;
  const genreRep = (state.reputation && state.reputation.byGenre) ? Number(state.reputation.byGenre[genre] || 0) : 0;
  const genreBoost = 1 + genreRep * 0.015;
  const base_pay = Math.round(pay * repBoost * genreBoost);
  const target_quality = Math.min(90, Math.round(target + repOverall * 0.2));

  return {
    id: `offer_${day}_${index}_${Math.floor(Math.random() * 9999)}`,
    name: `${template.type} · ${genre}`,
    type: template.type,
    genre,
    duration_hours: duration,
    base_pay,
    target_quality,
    deadline_days: deadline,
    start_day: day,
    requirements: (() => {
      const req = {
        room_type: template.room_type,
        min_items: template.min_items
      };
      const micTypes = Array.isArray(template.mic_types) && template.mic_types.length
        ? template.mic_types
        : pickMicTypes(genre, template.type);
      if (micTypes.length) {
        req.mic_types = micTypes;
        req.min_interface_inputs = micTypes.length;
      }
      return req;
    })(),
    reputation_gain: { success: Math.max(1, Math.round(genreRep * 0.3) + 2), fail: 1 },
    source: 'market'
  };
}

export function generateDailyOffers(force = false) {
  state.market = state.market || { offers: [], lastDayGenerated: 0 };
  const day = state.time ? Number(state.time.day || 1) : 1;
  if (!force && state.market.lastDayGenerated === day && state.market.offers && state.market.offers.length) return state.market.offers;
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const eligibleTemplates = getEligibleTemplates(repOverall);
  const templates = eligibleTemplates.length
    ? eligibleTemplates
    : TEMPLATE_POOL.filter(t => t.room_type === 'control_room');
  const poolSize = templates.length || TEMPLATE_POOL.length;
  const count = Math.min(8, Math.max(2, Math.min(poolSize, 2 + Math.floor(repOverall / 5))));
  const offers = [];
  for (let i = 0; i < count; i++) offers.push(buildOffer(day, i + 1, templates));
  state.market.offers = offers;
  state.market.lastDayGenerated = day;
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof showNotification === 'function') showNotification(`📬 ${offers.length} ofertes noves`);
  return offers;
}

export function acceptOffer(offerId) {
  const offers = (state.market && Array.isArray(state.market.offers)) ? state.market.offers : [];
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;
  const contract = { ...offer };
  contract.id = `contract_${offer.id}`;
  contract.worked_hours = 0;
  contract.completed = false;
  contract.completed_at = null;
  contract.assigned_people = [];
  contract.assigned_people_map = [];
  state.db.contracts.push(contract);
  state.market.offers = offers.filter(o => o.id !== offerId);
  if (typeof log === 'function') log(`📩 Acceptat: ${offer.name} (${euro(offer.base_pay)})`);
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function declineOffer(offerId) {
  const offers = (state.market && Array.isArray(state.market.offers)) ? state.market.offers : [];
  state.market.offers = offers.filter(o => o.id !== offerId);
  if (typeof log === 'function') log('📪 Oferta declinada');
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

if (typeof window !== 'undefined') {
  window.generateDailyOffers = window.generateDailyOffers || generateDailyOffers;
  window.acceptOffer = window.acceptOffer || acceptOffer;
  window.declineOffer = window.declineOffer || declineOffer;
}

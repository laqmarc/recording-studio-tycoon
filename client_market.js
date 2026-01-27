import { state } from './state.js';
import { log, showNotification, euro } from './helpers.js';

const GENRES = ['pop', 'rap', 'hiphop', 'rock', 'podcast', 'live', 'film_score'];
const TEMPLATE_POOL = [
  {
    type: 'recording',
    room_type: 'control_room',
    base_pay: [120, 260],
    target_quality: [55, 72],
    duration: [3, 6],
    deadline: [2, 5],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
    base_pay: [150, 300],
    target_quality: [60, 75],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 2 }
  },
  {
    type: 'master',
    room_type: 'control_room',
    base_pay: [180, 360],
    target_quality: [62, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 4 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    base_pay: [280, 620],
    target_quality: [60, 78],
    duration: [4, 8],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    base_pay: [120, 240],
    target_quality: [55, 70],
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

function pickGenre() {
  const rep = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const genres = GENRES.slice();
  const weights = genres.map(g => 1 + Number(rep[g] || 0));
  return pickWeighted(genres, weights);
}

function pickTemplate(repOverall) {
  const pool = TEMPLATE_POOL.filter(t => {
    if (repOverall < 5) return t.type === 'recording';
    if (repOverall < 10) return t.type === 'recording' || t.type === 'mix';
    if (repOverall < 20) return t.type !== 'production';
    return true;
  });
  return pool[randInt(0, pool.length - 1)];
}

function buildOffer(day, index) {
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const genre = pickGenre();
  const template = pickTemplate(repOverall);
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
    requirements: {
      room_type: template.room_type,
      min_items: template.min_items
    },
    reputation_gain: { success: Math.max(1, Math.round(genreRep * 0.3) + 2), fail: 1 },
    source: 'market'
  };
}

export function generateDailyOffers(force = false) {
  state.market = state.market || { offers: [], lastDayGenerated: 0 };
  const day = state.time ? Number(state.time.day || 1) : 1;
  if (!force && state.market.lastDayGenerated === day) return state.market.offers;
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const count = Math.min(5, 1 + Math.floor(repOverall / 6));
  const offers = [];
  for (let i = 0; i < count; i++) offers.push(buildOffer(day, i + 1));
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

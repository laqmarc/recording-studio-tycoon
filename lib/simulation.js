// lib/simulation.js - testable simulation that doesn't rely on globals (ESM)
import { clamp, avgStat, sumStat } from './helpers.js';

function buildItemsById(db) {
  if (!db || !Array.isArray(db.items)) return new Map();
  const m = new Map();
  for (const it of db.items) m.set(it.id, it);
  return m;
}

export function simulateRecording(state, roomIndex, contract) {
  const db = state.db || { items: [], rooms: [], contracts: [] };
  const itemsById = state.itemsById instanceof Map ? state.itemsById : buildItemsById(db);
  const room = (db.rooms || [])[roomIndex] || {};

  const mics = (installedIds(state, roomIndex, 'mic') || []).map(id=>itemsById.get(id)).filter(Boolean);
  const preamps = [ ...(installedIds(state, roomIndex, 'preamp') || []).map(id=>itemsById.get(id)).filter(Boolean), ...(installedIds(state, roomIndex, 'preamp_multi') || []).map(id=>itemsById.get(id)).filter(Boolean) ];
  const interfaces = (installedIds(state, roomIndex, 'interface') || []).map(id=>itemsById.get(id)).filter(Boolean);
  const acoustic = (installedIds(state, roomIndex, 'acoustic_treatment') || []).map(id=>itemsById.get(id)).filter(Boolean);
  const monitors = (installedIds(state, roomIndex, 'monitor') || []).map(id=>itemsById.get(id)).filter(Boolean);
  const headphones = (installedIds(state, roomIndex, 'headphones') || []).map(id=>itemsById.get(id)).filter(Boolean);
  const software = [
    ...(installedIds(state, roomIndex, 'software') || []).map(id=>itemsById.get(id)).filter(Boolean),
    ...(installedIds(state, roomIndex, 'software_vst') || []).map(id=>itemsById.get(id)).filter(Boolean),
    ...(installedIds(state, roomIndex, 'software_mix_master') || []).map(id=>itemsById.get(id)).filter(Boolean)
  ];
  const instruments = (installedIds(state, roomIndex, 'instruments') || []).map(id=>itemsById.get(id)).filter(Boolean);

  const type = contract.type;
  const mic_q = avgStat(mics, 'mic_quality');
  const pre_q = avgStat(preamps, 'preamp_quality');
  const if_q  = avgStat(interfaces, 'conversion_quality');
  const mon_q = avgStat(monitors, 'monitor_accuracy');
  const hp_q  = avgStat(headphones, 'hp_accuracy');
  const daw_q = avgStat(software, 'daw_quality');
  const prod_bonus = avgStat(software, 'production_bonus');
  const instrument_q = avgStat(instruments, 'instrument_quality');

  let room_acoustic = Number(room.base_acoustic||0) + sumStat(acoustic, 'room_acoustic_add');
  room_acoustic = clamp(room_acoustic, 0, 100);

  const engineer = 60;
  const lat_score = avgStat(interfaces, 'latency_score');
  const latency_ms = clamp(20 - (lat_score/6), 2, 25);

  let quality = 0;
  if (type === 'recording') {
    quality = mic_q * 0.35 + pre_q * 0.20 + if_q * 0.10 + room_acoustic * 0.20 + engineer * 0.15;
  } else if (type === 'mix') {
    quality = mon_q * 0.40 + room_acoustic * 0.20 + if_q * 0.10 + engineer * 0.30;
  } else if (type === 'streaming') {
    quality = if_q * 0.40 + mic_q * 0.25 + room_acoustic * 0.15 + engineer * 0.20;
  } else if (type === 'production') {
    quality = mon_q * 0.25 + if_q * 0.10 + room_acoustic * 0.10 + engineer * 0.20 + daw_q * 0.25 + instrument_q * 0.10 + prod_bonus * 4;
  } else if (type === 'mix_master') {
    const mixQuality = mon_q * 0.40 + room_acoustic * 0.20 + if_q * 0.10 + engineer * 0.30;
    const masterQuality = mon_q * 0.45 + room_acoustic * 0.30 + engineer * 0.25;
    quality = (mixQuality + masterQuality) / 2;
  } else {
    quality = mon_q * 0.45 + room_acoustic * 0.30 + engineer * 0.25;
  }

  let synergy_bonus = 0;
  if (pre_q > 70 && if_q > 70) synergy_bonus += 5;
  if (mic_q > 70 && pre_q > 70) synergy_bonus += 3;
  quality += synergy_bonus;

  const noise_floor = Number(room.noise_floor_db || -60);
  const noise_penalty = clamp((noise_floor - (-70)) * 1.2, 0, 25);
  // Fatigue penalty: milder multiplier, lower threshold, and a cap to avoid impossible results
  const fatigueValue = (state.player && state.player.fatigue) || 0;
  const fatigueThreshold = 8; // hours before penalty starts
  const fatigueMultiplier = 1.2; // weaker per-hour penalty
  const fatigueCap = 30; // maximum penalty applied to quality
  const fatigue_penalty = Math.min(fatigueCap, Math.max(0, fatigueValue - fatigueThreshold) * fatigueMultiplier);
  const final_quality = clamp(quality - noise_penalty - fatigue_penalty, 0, 100);

  const target = Number(contract.target_quality || 55);
  let happiness = 50 + (final_quality - target) * 0.8 - Math.max(0, latency_ms - 8) * 0.6;
  happiness = clamp(happiness, 0, 100);

  const base_pay = Number(contract.base_pay || 100);
  const payout = Math.round(base_pay * (0.6 + happiness/100));

  return { final_quality, latency_ms, happiness, payout, room_acoustic, noise_penalty, fatigue_penalty, synergy_bonus, mic_q, pre_q, if_q, mon_q, hp_q };
}

export function installedIds(state, roomIndex, category) {
  if (state && Array.isArray(state.roomsInstalled) && state.roomsInstalled[roomIndex]) {
    const bag = state.roomsInstalled[roomIndex];
    return bag[category] || [];
  }
  return [];
}


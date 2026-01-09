// simulation.js - contract/recording simulation (ES module + legacy window shim)
import { clamp, avgStat, sumStat, addXp, euro, log, checkContractRequirements } from './helpers.js';
import { state, installedIds } from './state.js';

export function simulateRecording(roomIndex, contract) {
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
  const software = [
    ...installedIds(roomIndex, "software").map(id=>state.itemsById.get(id)).filter(Boolean),
    ...installedIds(roomIndex, "software_vst").map(id=>state.itemsById.get(id)).filter(Boolean),
    ...installedIds(roomIndex, "software_mix_master").map(id=>state.itemsById.get(id)).filter(Boolean)
  ];
  const instruments = installedIds(roomIndex, "instruments").map(id=>state.itemsById.get(id)).filter(Boolean);

  const type = contract.type;

  // base stats
  const mic_q = avgStat(mics, "mic_quality");
  const pre_q = avgStat(preamps, "preamp_quality");
  const if_q  = avgStat(interfaces, "conversion_quality");
  const mon_q = avgStat(monitors, "monitor_accuracy");
  const hp_q  = avgStat(headphones, "hp_accuracy");
  const daw_q = avgStat(software, "daw_quality");
  const prod_bonus = avgStat(software, "production_bonus");
  const instrument_q = avgStat(instruments, "instrument_quality");

  let room_acoustic = Number(room.base_acoustic||0) + sumStat(acoustic, "room_acoustic_add");
  room_acoustic = clamp(room_acoustic, 0, 100);

  const engineer = 60; // demo fixed

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
  } else if (type === "streaming") {
    quality =
      if_q * 0.40 +
      mic_q * 0.25 +
      room_acoustic * 0.15 +
      engineer * 0.20;
  } else if (type === "production") {
    quality =
      mon_q * 0.25 +
      if_q * 0.10 +
      room_acoustic * 0.10 +
      engineer * 0.20 +
      daw_q * 0.25 +
      instrument_q * 0.10 +
      prod_bonus * 4;
  } else if (type === "mix_master") {
    const mixQuality =
      mon_q * 0.40 +
      room_acoustic * 0.20 +
      if_q * 0.10 +
      engineer * 0.30;
    const masterQuality =
      mon_q * 0.45 +
      room_acoustic * 0.30 +
      engineer * 0.25;
    quality = (mixQuality + masterQuality) / 2;
  } else { // master
    quality =
      mon_q * 0.45 +
      room_acoustic * 0.30 +
      engineer * 0.25;
  }

  // Synergy bonuses
  let synergy_bonus = 0;
  if (pre_q > 70 && if_q > 70) synergy_bonus += 5; // Good preamp + interface
  if (mic_q > 70 && pre_q > 70) synergy_bonus += 3; // Good mic + preamp
  quality += synergy_bonus;

  const noise_floor = Number(room.noise_floor_db || -60);
  const noise_penalty = clamp((noise_floor - (-70)) * 1.2, 0, 25);
  // Fatigue penalty: milder multiplier, lower threshold, and a cap
  const fatigueValue = state.player && state.player.fatigue || 0;
  const fatigueThreshold = 8;
  const fatigueMultiplier = 1.2;
  const fatigueCap = 30;
  const fatigue_penalty = Math.min(fatigueCap, Math.max(0, fatigueValue - fatigueThreshold) * fatigueMultiplier);
  const final_quality = clamp(quality - noise_penalty - fatigue_penalty, 0, 100);

  const target = Number(contract.target_quality || 55);
  let happiness = 50 + (final_quality - target) * 0.8 - Math.max(0, latency_ms - 8) * 0.6;
  happiness = clamp(happiness, 0, 100);

  const base_pay = Number(contract.base_pay || 100);
  const payout = Math.round(base_pay * (0.6 + happiness/100));

  return { final_quality, latency_ms, happiness, payout, room_acoustic, noise_penalty, fatigue_penalty, synergy_bonus, mic_q, pre_q, if_q, mon_q, hp_q };
}

export function simulateContract(contractId) {
  const contract = state.db.contracts.find(c => c.id === contractId);
  if (!contract) { log("Contracte no trobat."); return false; }

  if (!checkContractRequirements(contract, state.selected.roomIndex)) {
    log("❌ No compleixes els requisits del contracte.");
    return false;
  }

  const res = simulateRecording(state.selected.roomIndex, contract);
  let payout = res.payout;
  if (contract.deadline_days && state.time.day > (contract.start_day || 0) + contract.deadline_days) {
    payout = Math.round(payout * (contract.late_penalty || 0.5));
    log(`⏰ Contracte entregat tard! Penalització aplicada. Payout reduït.`);
  }
  state.cash += payout;
  const xpAward = Math.max(0, Math.round(payout/20 + res.final_quality/10));
  addXp(xpAward);

  log(`🎬 Sessió: ${contract.name}\n- Qualitat: ${res.final_quality.toFixed(1)}\n- Latència: ${res.latency_ms.toFixed(1)} ms\n- Happiness: ${res.happiness.toFixed(1)}\n- Payout: ${euro(payout)}\n- XP: ${xpAward}\n- Penalitzacions: Soroll ${res.noise_penalty.toFixed(1)}, Fatiga ${res.fatigue_penalty.toFixed(1)}\n- Bonus: Sinergia ${res.synergy_bonus.toFixed(1)}\n`);

  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return true;
}

// Expose for legacy scripts
if (typeof window !== 'undefined') {
  window.simulateRecording = window.simulateRecording || simulateRecording;
  window.simulateContract = window.simulateContract || simulateContract;
}

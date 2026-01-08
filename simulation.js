// simulation.js - contract/recording simulation
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
  } else { // master
    quality =
      mon_q * 0.45 +
      room_acoustic * 0.30 +
      engineer * 0.25;
  }

  const noise_floor = Number(room.noise_floor_db || -60);
  const noise_penalty = clamp((noise_floor - (-70)) * 1.2, 0, 25);
  const final_quality = clamp(quality - noise_penalty, 0, 100);

  const target = Number(contract.target_quality || 55);
  let happiness = 50 + (final_quality - target) * 0.8 - Math.max(0, latency_ms - 8) * 0.6;
  happiness = clamp(happiness, 0, 100);

  const base_pay = Number(contract.base_pay || 100);
  const payout = Math.round(base_pay * (0.6 + happiness/100));

  return { final_quality, latency_ms, happiness, payout, room_acoustic, noise_penalty, mic_q, pre_q, if_q, mon_q, hp_q };
}

function simulateContract(contractId) {
  const contract = state.db.contracts.find(c => c.id === contractId);
  if (!contract) { log("Contracte no trobat."); return false; }

  if (!checkContractRequirements(contract, state.selected.roomIndex)) {
    log("❌ No compleixes els requisits del contracte.");
    return false;
  }

  const res = simulateRecording(state.selected.roomIndex, contract);
  state.cash += res.payout;
  const xpAward = Math.max(0, Math.round(res.payout/20 + res.final_quality/10));
  addXp(xpAward);

  log(`🎬 Sessió: ${contract.name}\n- Qualitat: ${res.final_quality.toFixed(1)}\n- Latència: ${res.latency_ms.toFixed(1)} ms\n- Happiness: ${res.happiness.toFixed(1)}\n- Payout: ${euro(res.payout)}\n- XP: ${xpAward}\n`);

  renderAll();
  saveState();
  return true;
}

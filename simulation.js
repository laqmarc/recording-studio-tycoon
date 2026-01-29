// simulation.js - contract/recording simulation (ES module + legacy window shim)
import { clamp, avgStat, sumStat, addXp, euro, log, checkContractRequirements } from './helpers.js';
import { state, installedIds, getRoomEffective } from './state.js';

export function simulateRecording(roomIndex, contract) {
  const effRoom = getRoomEffective(roomIndex);
  const room = effRoom.room || state.db.rooms[roomIndex];

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

  let room_acoustic = Number((effRoom.base_acoustic != null ? effRoom.base_acoustic : room.base_acoustic) || 0) + sumStat(acoustic, "room_acoustic_add");
  room_acoustic = clamp(room_acoustic, 0, 100);

  const engineerLevel = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
  const engineer = 55 + engineerLevel * 5;

  const lat_score = avgStat(interfaces, "latency_score");
  const latency_ms = clamp(20 - (lat_score/6), 2, 25);

  let quality = 0;

  const resolvePerson = (id) => {
    if (!id) return null;
    if (String(id).startsWith('self_')) {
      const role = String(id).replace('self_', '');
      const eng = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
      const prod = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
      let skill = 55;
      if (role === 'engineer') skill = 55 + eng * 5;
      else if (role === 'producer') skill = 55 + prod * 5;
      else if (role === 'editor') skill = 50 + eng * 4;
      else if (role === 'mastering') skill = 55 + eng * 4;
      else if (role === 'technician') skill = 50 + eng * 3;
      return { id, role, skill, fee_per_hour: 0 };
    }
    if (state.db && Array.isArray(state.db.people)) return state.db.people.find(p => p.id === id) || null;
    return null;
  };
  const assigned = Array.isArray(contract.assigned_people)
    ? contract.assigned_people.map(id => resolvePerson(id)).filter(Boolean)
    : [];
  const avgRole = (role) => {
    const group = assigned.filter(p => p.role === role);
    if (!group.length) return 50;
    return group.reduce((s, p) => s + Number(p.skill || 0), 0) / group.length;
  };
  const musicianSkill = avgRole('musician');
  const producerSkill = avgRole('producer');
  const editorSkill = avgRole('editor');
  const masteringSkill = avgRole('mastering');
  const engineerSkill = avgRole('engineer');
  let talent_bonus = 0;

  if (type === "recording") {
    quality =
      mic_q * 0.35 +
      pre_q * 0.20 +
      if_q  * 0.10 +
      room_acoustic * 0.20 +
      engineer * 0.15;
    talent_bonus += (musicianSkill - 50) * 0.2;
  } else if (type === "mix") {
    quality =
      mon_q * 0.40 +
      room_acoustic * 0.20 +
      if_q * 0.10 +
      engineer * 0.30;
    talent_bonus += (editorSkill - 50) * 0.2 + (engineerSkill - 50) * 0.1;
  } else if (type === "streaming") {
    quality =
      if_q * 0.40 +
      mic_q * 0.25 +
      room_acoustic * 0.15 +
      engineer * 0.20;
    talent_bonus += (musicianSkill - 50) * 0.15;
  } else if (type === "production") {
    quality =
      mon_q * 0.25 +
      if_q * 0.10 +
      room_acoustic * 0.10 +
      engineer * 0.20 +
      daw_q * 0.25 +
      instrument_q * 0.10 +
      prod_bonus * 4;
    talent_bonus += (producerSkill - 50) * 0.2 + (musicianSkill - 50) * 0.1;
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
    talent_bonus += (masteringSkill - 50) * 0.2 + (engineerSkill - 50) * 0.1;
  } else { // master
    quality =
      mon_q * 0.45 +
      room_acoustic * 0.30 +
      engineer * 0.25;
    talent_bonus += (masteringSkill - 50) * 0.25;
  }

  quality += talent_bonus;

  // Synergy bonuses
  let synergy_bonus = 0;
  if (pre_q > 70 && if_q > 70) synergy_bonus += 5; // Good preamp + interface
  if (mic_q > 70 && pre_q > 70) synergy_bonus += 3; // Good mic + preamp
  quality += synergy_bonus;

  const noise_floor = Number((effRoom.noise_floor_db != null ? effRoom.noise_floor_db : room.noise_floor_db) || -60);
  const noise_penalty = clamp((noise_floor - (-70)) * 1.2, 0, 25);
  // Fatigue penalty: milder multiplier, lower threshold, and a cap
  const fatigueValue = state.player && state.player.fatigue || 0;
  const fatigueThreshold = 8;
  const fatigueMultiplier = 1.2;
  const fatigueCap = 30;
  const fatigue_penalty = Math.min(fatigueCap, Math.max(0, fatigueValue - fatigueThreshold) * fatigueMultiplier);
  const gearCondition = (() => {
    const ids = [
      ...installedIds(roomIndex, "mic"),
      ...installedIds(roomIndex, "preamp"),
      ...installedIds(roomIndex, "preamp_multi"),
      ...installedIds(roomIndex, "interface"),
      ...installedIds(roomIndex, "monitor"),
      ...installedIds(roomIndex, "headphones"),
      ...installedIds(roomIndex, "software"),
      ...installedIds(roomIndex, "software_vst"),
      ...installedIds(roomIndex, "software_mix_master")
    ];
    if (!ids.length || !state.itemCondition) return 100;
    let total = 0;
    for (const id of ids) total += Number(state.itemCondition.get(id) || 100);
    return total / ids.length;
  })();
  const condition_penalty = clamp((100 - gearCondition) * 0.15, 0, 20);
  const qa_bonus = Number(contract.qa_bonus || 0);
  const final_quality = clamp(quality - noise_penalty - fatigue_penalty - condition_penalty + qa_bonus, 0, 100);

  const target = Number(contract.target_quality || 55);
  let happiness = 50 + (final_quality - target) * 0.8 - Math.max(0, latency_ms - 8) * 0.6;
  happiness = clamp(happiness, 0, 100);

  const base_pay = Number(contract.base_pay || 100);
  const payout = Math.round(base_pay * (0.6 + happiness/100));

  return { final_quality, latency_ms, happiness, payout, room_acoustic, noise_penalty, fatigue_penalty, condition_penalty, talent_bonus, synergy_bonus, mic_q, pre_q, if_q, mon_q, hp_q };
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
  // Talent fees
  const resolvePerson = (id) => {
    if (!id) return null;
    if (String(id).startsWith('self_')) {
      const role = String(id).replace('self_', '');
      const eng = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
      const prod = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
      let skill = 55;
      if (role === 'engineer') skill = 55 + eng * 5;
      else if (role === 'producer') skill = 55 + prod * 5;
      else if (role === 'editor') skill = 50 + eng * 4;
      else if (role === 'mastering') skill = 55 + eng * 4;
      else if (role === 'technician') skill = 50 + eng * 3;
      return { id, role, name: 'Jo', skill, fee_per_hour: 0 };
    }
    if (state.db && Array.isArray(state.db.people)) return state.db.people.find(p => p.id === id) || null;
    return null;
  };

  let talent_cost = 0;
  const feeLines = [];
  const duration = Number(contract.duration_hours || 0);
  try {
    const entries = Array.isArray(contract.assigned_people_map) && contract.assigned_people_map.length
      ? contract.assigned_people_map
      : (Array.isArray(contract.assigned_people) ? contract.assigned_people.map(id => ({ id })) : []);
    for (const entry of entries) {
      if (!entry || !entry.id) continue;
      const p = resolvePerson(entry.id);
      if (!p) continue;
      const fee = Number(p.fee_per_hour || 0);
      const cost = fee * duration;
      talent_cost += cost;
      const roleLabel = entry.role || p.role || 'talent';
      const inst = entry.instrument ? ` (${entry.instrument})` : '';
      feeLines.push(`${roleLabel}: ${p.name || entry.id}${inst} · ${euro(fee)}/h · ${euro(cost)}`);
    }
  } catch (e) {}
  payout = Math.max(0, Math.round(payout - talent_cost));
  try {
    const day = Number(state.time && state.time.day || 1);
    state.analytics = state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    state.analytics.revenueByDay = state.analytics.revenueByDay || {};
    state.analytics.revenueByDay[day] = Number(state.analytics.revenueByDay[day] || 0) + Number(payout || 0);
    state.analytics.sessions = Array.isArray(state.analytics.sessions) ? state.analytics.sessions : [];
    state.analytics.sessions.unshift({
      day,
      name: contract.name,
      type: contract.type,
      payout,
      quality: Number(res.final_quality || 0),
      fees: Number(talent_cost || 0)
    });
    if (state.analytics.sessions.length > 50) state.analytics.sessions.pop();
  } catch (e) {}
  state.cash += payout;
  const xpAward = Math.max(0, Math.round(payout/20 + res.final_quality/10));
  addXp(xpAward);

  // Reputation gain by genre
  try {
    state.reputation = state.reputation || { overall: 0, byGenre: {} };
    const genreKey = contract.genre || 'any';
    const repGain = (contract.reputation_gain && contract.reputation_gain.success) ? Number(contract.reputation_gain.success) : 1;
    const qaRep = Number(contract.qa_rep_bonus || 0);
    state.reputation.overall += repGain + qaRep;
    state.reputation.byGenre[genreKey] = (state.reputation.byGenre[genreKey] || 0) + repGain + qaRep;
    
    // Check campaign objectives for reputation
    try {
      if (state.campaign && state.campaign.active) {
        import('./campaign.js').then(module => {
          module.checkObjectiveProgress('reputation', state.reputation.overall);
          module.checkObjectiveProgress('genre_reputation', state.reputation.byGenre[genreKey]);
          
          // Check total revenue objectives
          const totalRevenue = Object.values(state.analytics.revenueByDay)
            .reduce((sum, daily) => sum + Number(daily), 0);
          module.checkObjectiveProgress('revenue_total', totalRevenue);
        }).catch(e => console.log('Campaign reputation check error:', e));
      }
    } catch (e) {}
  } catch (e) {}

  const qaBonusText = contract.qa_bonus ? `, QA +${Number(contract.qa_bonus || 0)}` : '';
  const feeBlock = feeLines.length ? `\n- Talent:\n  - ${feeLines.join('\n  - ')}` : '\n- Talent: (Auto/Jo)';
  log(`🎬 Sessió: ${contract.name}\n- Qualitat: ${res.final_quality.toFixed(1)}\n- Latència: ${res.latency_ms.toFixed(1)} ms\n- Happiness: ${res.happiness.toFixed(1)}\n- Payout: ${euro(payout)}\n- XP: ${xpAward}\n- Penalitzacions: Soroll ${res.noise_penalty.toFixed(1)}, Fatiga ${res.fatigue_penalty.toFixed(1)}, Estat equips ${res.condition_penalty.toFixed(1)}\n- Bonus: Talent ${res.talent_bonus.toFixed(1)}, Sinergia ${res.synergy_bonus.toFixed(1)}${qaBonusText}${feeBlock}\n- Fees talent: ${euro(talent_cost)}\n`);

  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  return true;
}

// Expose for legacy scripts
if (typeof window !== 'undefined') {
  window.simulateRecording = window.simulateRecording || simulateRecording;
  window.simulateContract = window.simulateContract || simulateContract;
}

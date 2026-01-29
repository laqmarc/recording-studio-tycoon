// esm/actions.mjs — ES module implementation with graceful fallbacks
import { clamp } from './helpers.mjs';

function getState() { return typeof window !== 'undefined' ? window.state : undefined; }

function installedIds(roomIndex, category) {
  const s = getState();
  if (!s) return [];
  const bag = (s.roomsInstalled && s.roomsInstalled[roomIndex]) || {};
  return bag[category] || [];
}

function getMicTypeCounts(req) {
  const counts = {};
  let types = [];
  const micTotal = Number((req.min_items && req.min_items.mic) || 0);
  if (req.mic_type_counts && typeof req.mic_type_counts === 'object') {
    for (const [type, count] of Object.entries(req.mic_type_counts)) {
      const n = Number(count) || 0;
      if (n > 0) {
        counts[type] = n;
        types.push(type);
      }
    }
    return { types, counts };
  }
  if (Array.isArray(req.mic_types) && req.mic_types.length) {
    types = req.mic_types.slice();
    if (micTotal > 0 && types.length <= micTotal) {
      const base = Math.floor(micTotal / types.length);
      const extra = micTotal % types.length;
      types.forEach((type, idx) => {
        counts[type] = base + (idx < extra ? 1 : 0);
      });
    } else {
      types.forEach(type => { counts[type] = 1; });
    }
  }
  return { types, counts };
}

function resolveMicTypeCoverage(installedMicIds, counts, itemsById) {
  const remaining = {};
  for (const [type, count] of Object.entries(counts)) {
    remaining[type] = Number(count) || 0;
  }
  const mics = installedMicIds.map(id => itemsById.get(id)).filter(Boolean);
  for (const mic of mics) {
    const micTypes = Array.isArray(mic.type) ? mic.type : [];
    const candidates = micTypes.filter(type => remaining[type] > 0);
    if (!candidates.length) continue;
    candidates.sort((a, b) => remaining[b] - remaining[a]);
    const chosen = candidates[0];
    remaining[chosen] -= 1;
  }
  return { remaining };
}

export function getContractETA(c) {
  const state = getState();
  if (!state) return { days:0, hours:0, finishDay:0, finishHour:0 };
  const producerLevel = (state.staff && state.staff.producer && state.staff.producer.level != null)
    ? Number(state.staff.producer.level)
    : 0;
  const speedBonus = Math.min(0.4, producerLevel * 0.03);
  const worked = Number(c.worked_hours || 0);
  const total = Number(c.duration_hours || 0);
  const remaining = Math.max(0, total - worked);
  if (remaining === 0) return { days:0, hours:0, finishDay: state.time.day, finishHour: state.time.hour };
  const effectiveRemaining = remaining / (1 + speedBonus);
  const hoursLeftToday = state.time.workHoursPerDay - state.time.hour;
  if (effectiveRemaining <= hoursLeftToday) {
    return { days:0, hours:effectiveRemaining, finishDay: state.time.day, finishHour: state.time.hour + effectiveRemaining };
  }
  let rem = effectiveRemaining - hoursLeftToday;
  const fullDays = Math.floor(rem / state.time.workHoursPerDay);
  const finalHours = rem % state.time.workHoursPerDay;
  const finishDay = state.time.day + 1 + fullDays;
  const finishHour = finalHours === 0 ? 0 : finalHours;
  return { days: fullDays + 1, hours: finalHours, finishDay, finishHour };
}

// Full implementations (ported from legacy `actions.js`) to avoid
// recursion between module and legacy shim.
function getWin(name) { return (typeof window !== 'undefined') ? window[name] : undefined; }

export function workOnContract(contractId, hours) {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const simulateContract = getWin('simulateContract');
  const advanceTime = getWin('advanceTime');
  const renderAll = getWin('renderAll');
  const showNotification = getWin('showNotification') || (()=>{});
  const saveState = getWin('saveState') || (()=>{});
  const assignContractPeople = getWin('assignContractPeople');
  const applyItemWear = getWin('applyItemWear');

  const c = state.db.contracts.find(x => x.id === contractId);
  if (!c) return log('Contracte no trobat.');
  if (c.completed) return log('ℹ️ Aquesta feina ja esta completada.');
  if (Array.isArray(state.schedule) && !state.schedule.some(s => s.contractId === c.id && s.day === state.time.day)) {
    return log('ℹ️ Aquesta feina nomes avanca des del calendari.');
  }
  if (assignContractPeople) assignContractPeople(c);
  if (c.start_day == null) c.start_day = state.time.day;
  const room = state.db.rooms[state.selected.roomIndex];
  const req = c.requirements || {};
  if (req.room_type && req.room_type !== room.type) { log(`❌ Aquest contracte demana sala tipus "${req.room_type}". Ara estàs a "${room.type}".`); return; }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const used = getWin('installedIds')(state.selected.roomIndex, cat).length;
      if (used < Number(min)) { log(`❌ Falta equip: ${cat} (${used}/${min})`); return; }
    }
  }

  const micCount = getWin('installedIds')(state.selected.roomIndex, 'mic').length;
  if (micCount > 0) {
    const standCount = getWin('installedIds')(state.selected.roomIndex, 'mic_stand').length;
    if (standCount < micCount) { log(`❌ Falta equip: mic_stand (${standCount}/${micCount}) — cal un peu per cada micròfon.`); return; }
  }

  if (req.min_interface_inputs) {
    const interfaces = getWin('installedIds')(state.selected.roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean);
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    if (maxIns < Number(req.min_interface_inputs)) { log(`❌ Cal una interface amb mínim ${req.min_interface_inputs} entrades (ara max: ${maxIns}).`); return; }
  }

  const micTypeInfo = getMicTypeCounts(req);
  if (Object.keys(micTypeInfo.counts).length) {
    const installedFn = getWin('installedIds') || installedIds;
    const micIds = installedFn(state.selected.roomIndex, "mic");
    const coverage = resolveMicTypeCoverage(micIds, micTypeInfo.counts, state.itemsById || new Map());
    const missing = Object.entries(coverage.remaining).find(([, count]) => count > 0);
    if (missing) { log(`❌ Falta micròfon per: ${missing[0]}`); return; }
  }

  const remaining = (c.duration_hours || 0) - (c.worked_hours || 0);
  const actual_hours = Math.min(Number(hours || 0), remaining);
  const producerLevel = (state.staff && state.staff.producer && state.staff.producer.level != null)
    ? Number(state.staff.producer.level)
    : 0;
  const engineerLevel = (state.staff && state.staff.engineer && state.staff.engineer.level != null)
    ? Number(state.staff.engineer.level)
    : 0;
  const speedBonus = Math.min(0.4, producerLevel * 0.03);
  const fatigueReduction = Math.min(0.4, engineerLevel * 0.03);
  const progressHours = Math.min(remaining, actual_hours * (1 + speedBonus));
  c.worked_hours = Number(c.worked_hours || 0) + progressHours;
  try {
    const updateMilestones = getWin('updateContractMilestones');
    if (updateMilestones) updateMilestones(c);
  } catch (e) {}
  if (c.worked_hours >= (c.duration_hours || 0)) {
    c.worked_hours = c.duration_hours || c.worked_hours;
    log(`✅ Contracte completat: ${c.name} (treballats ${c.worked_hours}h/${c.duration_hours}h)`);
    const ok = simulateContract && simulateContract(c.id);
    if (ok) {
      c.completed = true; c.completed_at = { day: state.time.day, hour: state.time.hour };

      // QA automàtic si està activat
      if (state.ui && state.ui.autoQa && !c.qa_done) {
        c.qa_done = true;
        c.qa_bonus = Math.max(4, Number(c.qa_bonus || 0));
        c.qa_rep_bonus = Math.max(1, Number(c.qa_rep_bonus || 0));
        log(`🤖 QA automàtic aplicat: ${c.name} (+qualitat)`);
      }

      log(`📥 Contracte marcat com a complet (no s'elimina).`);
      showNotification(`🎉 Contracte "${c.name}" completat!`);
      
      // Check campaign objectives
      try {
        const totalCompleted = state.db.contracts.filter(c => c.completed).length;
        const scheduleCompleted = state.schedule.filter(c => c.completed).length;
        console.log('🔍 Contract completion check:', { 
          totalCompleted, 
          scheduleCompleted, 
          campaignActive: state.campaign?.active,
          allContracts: state.db.contracts.length,
          allSchedule: state.schedule.length
        });
        if (state.campaign && state.campaign.active) {
          const specialCompleted = state.db.contracts.filter(c => c.completed && c.special).length;
          import('../campaign.js').then(module => {
            console.log('📞 Calling checkObjectiveProgress for contracts...');
            const result = module.checkObjectiveProgress('contract_complete', totalCompleted);
            module.checkObjectiveProgress('special_contract_complete', specialCompleted);
            console.log('📋 Check result:', result);
          }).catch(e => console.log('Campaign check error:', e));
        }
      } catch (e) {
        console.log('Campaign try-catch error:', e);
      }
      
      saveState();
    }
  } else {
    const speedPct = Math.round(speedBonus * 100);
    const speedText = speedPct ? ` (+${speedPct}%)` : '';
    log(`🛠️ Treballat ${actual_hours}h${speedText} sobre ${c.name} — ${c.worked_hours}/${c.duration_hours}h`);
  }

  // Accumulate fatigue: reduced by engineer skill
  const fatigueGain = actual_hours * (1 - fatigueReduction);
  state.player.fatigueShort = (state.player.fatigueShort || 0) + fatigueGain;
  state.player.fatigueChronic = (state.player.fatigueChronic || 0) + fatigueGain * 0.05; // 5% of hours become chronic
  if (typeof window !== 'undefined' && typeof window.updateFatigueDerived === 'function') window.updateFatigueDerived();
  if (applyItemWear) applyItemWear(state.selected.roomIndex, actual_hours, 1);
  if (advanceTime) advanceTime(actual_hours);
  if (renderAll) renderAll();
}

export function applyScheduledWork(contractId, hours, roomIndex, day) {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const simulateContract = getWin('simulateContract');
  const renderAll = getWin('renderAll');
  const showNotification = getWin('showNotification') || (()=>{});
  const saveState = getWin('saveState') || (()=>{});
  const assignContractPeople = getWin('assignContractPeople');
  const applyItemWear = getWin('applyItemWear');
  const checkContractRequirements = getWin('checkContractRequirements');
  const installedIds = getWin('installedIds');

  const c = state.db.contracts.find(x => x.id === contractId);
  if (!c || c.completed) return { completed: false };
  if (assignContractPeople) assignContractPeople(c);
  if (c.start_day == null) c.start_day = day || state.time.day;

  if (checkContractRequirements && !checkContractRequirements(c, roomIndex)) {
    log(`⚠️ Requisits incomplets: ${c.name}`);
    return { completed: false };
  }

  const remaining = (c.duration_hours || 0) - (c.worked_hours || 0);
  const actual_hours = Math.min(Number(hours || 0), remaining);
  const producerLevel = (state.staff && state.staff.producer && state.staff.producer.level != null)
    ? Number(state.staff.producer.level)
    : 0;
  const engineerLevel = (state.staff && state.staff.engineer && state.staff.engineer.level != null)
    ? Number(state.staff.engineer.level)
    : 0;
  const speedBonus = Math.min(0.4, producerLevel * 0.03);
  const fatigueReduction = Math.min(0.4, engineerLevel * 0.03);
  const progressHours = Math.min(remaining, actual_hours * (1 + speedBonus));
  c.worked_hours = Number(c.worked_hours || 0) + progressHours;
  try {
    const updateMilestones = getWin('updateContractMilestones');
    if (updateMilestones) updateMilestones(c);
  } catch (e) {}

  if (c.worked_hours >= (c.duration_hours || 0)) {
    c.worked_hours = c.duration_hours || c.worked_hours;
    const prevRoom = state.selected.roomIndex;
    state.selected.roomIndex = roomIndex;
    const ok = simulateContract && simulateContract(c.id);
    state.selected.roomIndex = prevRoom;
    if (ok) {
      c.completed = true; c.completed_at = { day: state.time.day, hour: state.time.hour };
      log(`✅ Feina completada: ${c.name}`);
      showNotification(`🎉 Feina "${c.name}" completada!`);
      
      // Check campaign objectives
      try {
        const totalCompleted = state.db.contracts.filter(c => c.completed).length;
        const scheduleCompleted = state.schedule.filter(c => c.completed).length;
        console.log('🔍 Contract completion check (applyScheduledWork):', { 
          totalCompleted, 
          scheduleCompleted, 
          campaignActive: state.campaign?.active,
          allContracts: state.db.contracts.length,
          allSchedule: state.schedule.length
        });
        if (state.campaign && state.campaign.active) {
          const specialCompleted = state.db.contracts.filter(c => c.completed && c.special).length;
          import('../campaign.js').then(module => {
            console.log('📞 Calling checkObjectiveProgress for contracts...');
            const result = module.checkObjectiveProgress('contract_complete', totalCompleted);
            module.checkObjectiveProgress('special_contract_complete', specialCompleted);
            console.log('📋 Check result:', result);
          }).catch(e => console.log('Campaign check error:', e));
        }
      } catch (e) {
        console.log('Campaign try-catch error:', e);
      }
      
      if (renderAll) renderAll();
      saveState();
      return { completed: true, id: c.id };
    }
  } else {
    log(`🗓️ Calendari: ${c.name} ${c.worked_hours}/${c.duration_hours}h`);
  }

  const fatigueGain = actual_hours * (1 - fatigueReduction);
  state.player.fatigueShort = (state.player.fatigueShort || 0) + fatigueGain;
  state.player.fatigueChronic = (state.player.fatigueChronic || 0) + fatigueGain * 0.05;
  if (typeof window !== 'undefined' && typeof window.updateFatigueDerived === 'function') window.updateFatigueDerived();
  if (applyItemWear) applyItemWear(roomIndex, actual_hours, 1);
  if (renderAll) renderAll();
  saveState();
  return { completed: false };
}

export function buySelected() {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const euro = getWin('euro') || ((n)=>`${n}€`);
  const invAdd = getWin('invAdd');
  const invQty = getWin('invQty');
  const canSpend = getWin('canSpend');
  const renderAll = getWin('renderAll');
  const prepareInstallFromShop = getWin('prepareInstallFromShop');
  const saveState = getWin('saveState') || (()=>{});
  const showNotification = getWin('showNotification') || (()=>{});

  let id = state.selected.shopItemId;
  if (!id) {
    const cat = document.getElementById("selCategory").value;
    const items = (state.itemsByCategory.get(cat) || []).filter(it => Number(it.unlock_level || 1) <= Number(state.player.level || 1));
    if (items.length) { id = items[0].id; state.selected.shopItemId = id; log("Seleccionat automàticament el primer item: " + state.itemsById.get(id).name); }
    else return log("No hi ha items disponibles en aquesta categoria.");
  }
  const it = state.itemsById.get(id);
  if (!it) return log("Item no trobat.");

  const qty = clamp(Number(document.getElementById("qtyBuy").value || 1), 1, 99);
  const cost = Number(it.price || 0) * qty;
  if (canSpend) {
    if (!canSpend(cost)) return log(`❌ Límite de cashflow: cal ${euro(cost)}.`);
  } else if (state.cash < cost) {
    return log(`No tens prou diners. Necessites ${euro(cost)}.`);
  }
  state.cash -= cost;
  if (invAdd) invAdd(id, qty);
  if (renderAll) renderAll();
  try { if (prepareInstallFromShop) prepareInstallFromShop(); } catch (e) {}
  log(`✅ Comprat: ${it.name} x${qty} per ${euro(cost)}.`); showNotification(`🛒 Comprat: ${it.name} x${qty}`); saveState();
}

export function leaseSelected() {
  // Leasing functionality disabled
  return;
}

export function prepareInstallFromShop() {
  // Prepare install functionality disabled - use direct installation from item cards
  return;
}

export function installSelected() {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const invRemove = getWin('invRemove');
  const installToRoom = getWin('installToRoom');
  const renderAll = getWin('renderAll');
  const saveState = getWin('saveState') || (()=>{});

  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];
  const itemId = document.getElementById('selInvItem').value;
  if (!itemId) return log('No tens cap item a inventari en aquesta categoria.');
  const invQty = getWin('invQty');
  if (invQty && invQty(itemId) <= 0) return log('No en tens a inventari.');
  const it = state.itemsById.get(itemId);
  if (!it) return log('Item no trobat.');
  const category = it.category || 'misc';
  const res = installToRoom ? installToRoom(roomIndex, category, itemId) : { ok:false, reason:'installToRoom no disponible' };
  if (!res.ok) return log(`❌ No es pot instal·lar: ${res.reason}`);
  if (invRemove) invRemove(itemId, 1);
  log(`🧩 Instal·lat a ${room.name}: ${it.name} (${category})`);
  if (renderAll) renderAll();
  saveState();
}

export function uninstallLast() {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const uninstallFromRoom = getWin('uninstallFromRoom');
  const invAdd = getWin('invAdd');
  const renderAll = getWin('renderAll');
  const saveState = getWin('saveState') || (()=>{});

  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];
  const cat = document.getElementById('selInvCategory').value;
  const res = uninstallFromRoom ? uninstallFromRoom(roomIndex, cat) : { ok:false, reason:'uninstallFromRoom not available' };
  if (!res.ok) return log(`❌ ${res.reason} (${cat})`);
  const it = state.itemsById.get(res.removed);
  if (invAdd) invAdd(res.removed, 1);
  log(`↩️ Desinstal·lat de ${room.name}: ${it ? it.name : res.removed} (${cat})`);
  if (renderAll) renderAll();
  saveState();
}

// Expose module on window for progressive migration
if (typeof window !== 'undefined') {
  window.ESActions = { getContractETA, workOnContract, buySelected, prepareInstallFromShop, installSelected, uninstallLast };
  // also provide legacy-friendly direct name for rendering code
  window.getContractETA = window.getContractETA || getContractETA;
}

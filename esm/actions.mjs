// esm/actions.mjs — ES module implementation with graceful fallbacks
import { clamp } from './helpers.mjs';

function getState() { return typeof window !== 'undefined' ? window.state : undefined; }

function installedIds(roomIndex, category) {
  const s = getState();
  if (!s) return [];
  const bag = (s.roomsInstalled && s.roomsInstalled[roomIndex]) || {};
  return bag[category] || [];
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

  if (req.mic_types && Array.isArray(req.mic_types)) {
    const mics = getWin('installedIds')(state.selected.roomIndex, "mic").map(id=>state.itemsById.get(id)).filter(Boolean);
    const coveredTypes = new Set();
    for (const mic of mics) {
      if (mic.type && Array.isArray(mic.type)) {
        const coveredType = mic.type.find(t => req.mic_types.includes(t) && !coveredTypes.has(t));
        if (coveredType) { coveredTypes.add(coveredType); }
      }
    }
    for (const requiredType of req.mic_types) {
      if (!coveredTypes.has(requiredType)) { log(`❌ Falta micròfon per: ${requiredType}`); return; }
    }
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
  if (c.worked_hours >= (c.duration_hours || 0)) {
    c.worked_hours = c.duration_hours || c.worked_hours;
    log(`✅ Contracte completat: ${c.name} (treballats ${c.worked_hours}h/${c.duration_hours}h)`);
    const ok = simulateContract && simulateContract(c.id);
    if (ok) {
      c.completed = true; c.completed_at = { day: state.time.day, hour: state.time.hour };
      log(`📥 Contracte marcat com a complet (no s'elimina).`);
      showNotification(`🎉 Contracte "${c.name}" completat!`);
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
  if (state.cash < cost) return log(`No tens prou diners. Necessites ${euro(cost)}.`);
  state.cash -= cost;
  if (invAdd) invAdd(id, qty);
  if (renderAll) renderAll();
  try { if (prepareInstallFromShop) prepareInstallFromShop(); } catch (e) {}
  log(`✅ Comprat: ${it.name} x${qty} per ${euro(cost)}.`); showNotification(`🛒 Comprat: ${it.name} x${qty}`); saveState();
}

export function prepareInstallFromShop() {
  const state = getState();
  const log = getWin('log') || ((m)=>console.log(m));
  const invQty = getWin('invQty');
  const renderRight = getWin('renderRight');
  const selInvCat = document.getElementById('selInvCategory');
  const selInvItem = document.getElementById('selInvItem');
  const it = state.itemsById.get(state.selected.shopItemId);
  if (!it) return log('Selecciona un item del Shop.');
  selInvCat.value = it.category;
  if (renderRight) renderRight();
  if (invQty && invQty(it.id) > 0) selInvItem.value = it.id;
  log('→ Preparat per instal·lar (si el tens a inventari).');
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

// helpers.js - browser-friendly ES module wrapper
// Export useful helpers and keep backwards compatibility by attaching
// them to `window` so non-module scripts continue to work.
export function log(msg) {
  const el = document.getElementById("log");
  if (!el) return;
  el.textContent = (msg + "\n" + el.textContent).slice(0, 6000);
}
export function euro(n) { return `${Math.round(n)} EUR`; }
export function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
export function avgStat(items, key) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  let s=0, n=0;
  for (const it of items) {
    const stats = it && it.stats ? it.stats : {};
    if (stats[key] != null) { s += Number(stats[key]); n++; }
  }
  return n ? s/n : 0;
}
export function sumStat(items, key) {
  let s=0;
  for (const it of (items || [])) {
    const stats = it && it.stats ? it.stats : {};
    s += Number(stats[key] || 0);
  }
  return s;
}
// Leveling helpers
export function xpToNext(level){
  return Math.max(200, Math.round(200 * Math.pow(level, 1.4)));
}
export function addXp(amount){
  if(!amount || amount<=0) return;
  if (typeof state === 'undefined' || !state.player) return;
  state.player.xp += Number(amount);
  log(`⭐ Guanyes ${amount} XP`);
  while(state.player.xp >= xpToNext(state.player.level)){
    state.player.xp -= xpToNext(state.player.level);
    state.player.level += 1;
    log(`⬆️ Level up! Ara ets nivell ${state.player.level}`);
  }
}

// Inventory helpers
export function invQty(id) { return (typeof state !== 'undefined' && state.inventory) ? Number(state.inventory.get(id) || 0) : 0; }
export function invAdd(id, qty=1){ if (typeof state !== 'undefined' && state.inventory) state.inventory.set(id, invQty(id)+qty); }
export function invRemove(id, qty=1){
  if (typeof state === 'undefined' || !state.inventory) return false;
  const cur = invQty(id);
  if (cur < qty) return false;
  const next = cur-qty;
  if (next<=0) state.inventory.delete(id); else state.inventory.set(id,next);
  return true;
}

// Gear condition and maintenance
export function getItemCondition(id) {
  if (typeof state === 'undefined') return 100;
  state.itemCondition = state.itemCondition || new Map();
  const cur = Number(state.itemCondition.get(id));
  return Number.isFinite(cur) ? cur : 100;
}

export function setItemCondition(id, value) {
  if (typeof state === 'undefined') return;
  state.itemCondition = state.itemCondition || new Map();
  const v = clamp(Number(value), 0, 100);
  state.itemCondition.set(id, v);
}

export function applyItemWear(roomIndex, hours = 1, multiplier = 1) {
  if (!state || !state.roomsInstalled || !state.itemsById) return;
  state.itemCondition = state.itemCondition || new Map();
  const bag = state.roomsInstalled[roomIndex] || {};
  const counts = new Map();
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) counts.set(id, (counts.get(id) || 0) + 1);
  }
  for (const [id] of counts.entries()) {
    const item = state.itemsById.get(id);
    const reliability = Number((item && item.stats && item.stats.reliability) || 80);
    const wearRate = clamp((100 - reliability) / 600, 0.02, 0.5);
    const wear = wearRate * Number(hours || 0) * Number(multiplier || 1);
    const next = clamp(getItemCondition(id) - wear, 5, 100);
    state.itemCondition.set(id, next);
  }
}

export function calcRoomMaintenanceDaily(roomIndex) {
  if (!state || !state.roomsInstalled || !state.itemsById) return 0;
  const bag = state.roomsInstalled[roomIndex] || {};
  let total = 0;
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) {
      const item = state.itemsById.get(id);
      const weekly = Number((item && item.stats && item.stats.maintenance_weekly) || 0);
      total += weekly / 7;
    }
  }
  return total;
}

// Contract requirement checker
export function checkContractRequirements(contract, roomIndex) {
  const req = contract.requirements || {};
  const room = state && state.db && state.db.rooms ? state.db.rooms[roomIndex] : undefined;
  if (!room) return false;
  
  if (req.room_type && req.room_type !== room.type) {
    return false;
  }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const used = (typeof installedIds === 'function') ? installedIds(roomIndex, cat).length : 0;
      if (used < Number(min)) {
        return false;
      }
    }
  }

  if (req.mic_types) {
    const installedMicIds = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic') : [];
    const installedMicTypes = new Set();
    for (const micId of installedMicIds) {
      const mic = state && state.itemsById ? state.itemsById.get(micId) : null;
      if (mic && mic.type) {
        mic.type.forEach(t => installedMicTypes.add(t));
      }
    }
    for (const requiredType of req.mic_types) {
      if (!installedMicTypes.has(requiredType)) {
        return false;
      }
    }
  }

  if (req.min_interface_inputs) {
    const interfaces = (typeof installedIds === 'function') ? installedIds(roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean) : [];
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    if (maxIns < Number(req.min_interface_inputs)) {
      return false;
    }
  }

  const micCount = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic').length : 0;
  if (micCount > 0) {
    const standCount = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic_stand').length : 0;
    if (standCount < micCount) {
      return false;
    }
  }

  return true;
}

// Time management
export function advanceTime(hours) {
  if (typeof state === 'undefined' || !state.time) return;
  state.time.hour += hours;
  while (state.time.hour >= state.time.workHoursPerDay) {
    state.time.hour -= state.time.workHoursPerDay;
    state.time.day += 1;
    // Recover fatigue when day changes: reduce short-term fatigue by base + rest bonus,
    // and decay chronic fatigue slowly.
    if (state.player) {
      // Percentage-based recovery: recover a fraction of short-term fatigue each night
      const recoveryRate = 0.5; // recover 50% of short fatigue per day
      const bonus = Number(state.player.restBonus || 0);
      const prevShort = Number(state.player.fatigueShort || 0);
      const recovered = prevShort * recoveryRate + bonus;
      state.player.fatigueShort = Math.max(0, prevShort - recovered);
      // chronic recovers very slowly
      state.player.fatigueChronic = Math.max(0, (state.player.fatigueChronic || 0) - 0.5);
      // reset one-day rest bonus
      state.player.restBonus = 0;
      if (typeof updateFatigueDerived === 'function') updateFatigueDerived();
      // Monthly reset: if this is the first day of a new 30-day month (and not initial day 1), reset monthlyExpenses
      try {
        if (state.finance && state.time && state.time.day !== 1 && state.time.day % 30 === 1) {
          state.finance.monthlyExpenses = 0;
        }
      } catch (e) {}
      // apply daily room running costs and log them
      try {
        const daily = applyDailyRoomCosts();
        if (daily && typeof log === 'function') log(`💸 Costos diaris sales: ${euro(daily)} · Despesa setmanal acumulada: ${Math.round((state.finance && state.finance.weeklyExpenses) || 0)}€`);
      } catch (e) {}
      log(`🌅 Nou dia! Fatiga curta: ${state.player.fatigueShort.toFixed(1)}h · Fatiga crònica: ${state.player.fatigueChronic.toFixed(2)}`);
      try { if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') window.generateDailyOffers(); } catch (e) {}
    }
  }
}

// Apply daily room running costs: called indirectly from advanceTime loop
export function applyDailyRoomCosts() {
  if (!state || !state.db || !Array.isArray(state.db.rooms)) return 0;
  let charged = 0;
  // Staff payroll (daily)
  try {
    const engLevel = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
    const prodLevel = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
    const staffWeekly = engLevel * 120 + prodLevel * 100;
    const staffDaily = staffWeekly / 7;
    if (staffWeekly > 0) {
      state.cash = Number(state.cash || 0) - staffDaily;
      state.finance = state.finance || {};
      state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + staffDaily;
      charged += staffDaily;
      state.finance.staffWeekly = staffWeekly;
    }
  } catch (e) {}
  // Ensure roomBilling array exists
  state.roomBilling = state.roomBilling || state.db.rooms.map(()=>({ lastBilledDay: null }));
  for (let i = 0; i < state.db.rooms.length; i++) {
    const r = state.db.rooms[i];
    const perWeek = Number(r.price_per_week || 0);
    const bag = (Array.isArray(state.roomsInstalled) && state.roomsInstalled[i]) ? state.roomsInstalled[i] : {};
    const hasInstalled = Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
    if (!hasInstalled) continue;

    // Maintenance daily cost for installed items
    try {
      const maintenanceDaily = calcRoomMaintenanceDaily(i);
      if (maintenanceDaily > 0) {
        state.cash = Number(state.cash || 0) - maintenanceDaily;
        state.finance = state.finance || {};
        state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + maintenanceDaily;
        charged += maintenanceDaily;
      }
    } catch (e) {}

    const billing = state.roomBilling[i] = state.roomBilling[i] || { lastBilledDay: null };
    // If room was just installed, bill full week immediately and set lastBilledDay
    if (billing.justInstalled) {
      state.cash = Number(state.cash || 0) - perWeek;
      state.finance = state.finance || {};
      state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + perWeek;
      charged += perWeek;
      billing.lastBilledDay = (state.time && state.time.day) ? state.time.day : 1;
      billing.weeksBilled = (billing.weeksBilled || 0) + 1;
      billing.totalCharged = (billing.totalCharged || 0) + perWeek;
      billing.justInstalled = false;
      try {
        if (typeof showNotification === 'function') showNotification(`💳 Cobrat ${euro(perWeek)} per "${r.name}" (instal·lació)`);
      } catch (e) {}
      continue;
    }

    // Regular weekly billing: if >=7 days since last billed, bill full week for each 7-day period
    if (billing.lastBilledDay == null) {
      // If no last billed day recorded, set it to today (avoid retroactive billing)
      billing.lastBilledDay = (state.time && state.time.day) ? state.time.day : 1;
      continue;
    }
    let daysSince = (state.time && state.time.day ? state.time.day : 1) - billing.lastBilledDay;
    while (daysSince >= 7) {
      state.cash = Number(state.cash || 0) - perWeek;
      state.finance = state.finance || {};
      state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + perWeek;
      charged += perWeek;
      billing.weeksBilled = (billing.weeksBilled || 0) + 1;
      billing.totalCharged = (billing.totalCharged || 0) + perWeek;
      billing.lastBilledDay += 7;
      daysSince -= 7;
      try {
        if (typeof showNotification === 'function') showNotification(`💳 Cobrat ${euro(perWeek)} per "${r.name}" (setmana ${billing.weeksBilled})`);
      } catch (e) {}
    }
  }
  return charged;
}

// Consumable items: immediate effects like coffee or improving sleep recovery
export function useConsumable(itemId) {
  if (typeof state === 'undefined' || !state.player) return false;
  if (typeof invQty === 'function' && invQty(itemId) <= 0) return false;
  // define simple consumable effects by id
  if (itemId === 'coffee') {
    // immediate short-term reduction
    state.player.fatigueShort = Math.max(0, (state.player.fatigueShort || 0) - 2);
    if (typeof invRemove === 'function') invRemove(itemId, 1);
    if (typeof updateFatigueDerived === 'function') updateFatigueDerived();
    return true;
  }
  if (itemId === 'good_bed') {
    // increases next-day recovery
    state.player.restBonus = (state.player.restBonus || 0) + 4;
    if (typeof invRemove === 'function') invRemove(itemId, 1);
    return true;
  }
  return false;
}

// Notifications
export function showNotification(message, duration = 3000) {
  const container = document.getElementById('notifications');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'notification';
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => {
    div.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => div.remove(), 500);
  }, duration);
}

// Attach to window for backward compatibility with non-module scripts
if (typeof window !== 'undefined') {
  window.Helpers = Object.assign(window.Helpers || {}, { log, euro, clamp, avgStat, sumStat, xpToNext, addXp, invQty, invAdd, invRemove, checkContractRequirements, advanceTime, showNotification, getItemCondition, setItemCondition, applyItemWear, calcRoomMaintenanceDaily });
  // Overwrite any temporary shim wrappers so the real implementations are used
  window.log = log;
  window.euro = euro;
  window.clamp = clamp;
  window.avgStat = avgStat;
  window.sumStat = sumStat;
  window.xpToNext = xpToNext;
  window.addXp = addXp;
  window.invQty = invQty;
  window.invAdd = invAdd;
  window.invRemove = invRemove;
  window.getItemCondition = getItemCondition;
  window.setItemCondition = setItemCondition;
  window.applyItemWear = applyItemWear;
  window.useConsumable = useConsumable;
  // Expose advanceTime and requirement checker as direct globals for legacy callers
  window.advanceTime = advanceTime;
  window.checkContractRequirements = checkContractRequirements;
}

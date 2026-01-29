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
    
    // Check campaign objectives for level
    try {
      if (state.campaign && state.campaign.active) {
        import('./campaign.js').then(module => {
          module.checkObjectiveProgress('level', state.player.level);
        }).catch(e => console.log('Campaign level check error:', e));
      }
    } catch (e) {}
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

export function countInstalledItem(itemId) {
  if (!state || !Array.isArray(state.roomsInstalled)) return 0;
  let total = 0;
  for (const bag of state.roomsInstalled) {
    for (const ids of Object.values(bag || {})) {
      for (const id of (ids || [])) if (id === itemId) total += 1;
    }
  }
  return total;
}

function ensureFinanceState() {
  state.finance = state.finance || {};
  if (!Array.isArray(state.finance.loans)) state.finance.loans = [];
  if (!Array.isArray(state.finance.leases)) state.finance.leases = [];
  if (!state.finance.creditLine || typeof state.finance.creditLine !== 'object') state.finance.creditLine = { limit: 0, dailyFee: 0 };
  if (typeof state.finance.cashflowLimit !== 'number') state.finance.cashflowLimit = 0;
  if (typeof state.finance.weeklyExpenses !== 'number') state.finance.weeklyExpenses = 0;
  if (typeof state.finance.monthlyExpenses !== 'number') state.finance.monthlyExpenses = 0;
  if (typeof state.finance.arrears !== 'number') state.finance.arrears = 0;
}

export function getCashflowLimit() {
  if (typeof state === 'undefined') return 0;
  ensureFinanceState();
  return Number(state.finance.cashflowLimit || 0);
}

export function canSpend(cost) {
  if (typeof state === 'undefined') return false;
  const limit = getCashflowLimit();
  return (Number(state.cash || 0) - Number(cost || 0)) >= -limit;
}

export function takeLoan({ name, principal, weeks, rate }) {
  if (!state) return null;
  ensureFinanceState();
  const totalPayable = Math.max(1, Math.round(Number(principal || 0) * (1 + Number(rate || 0) * Number(weeks || 0))));
  const totalDays = Math.max(1, Number(weeks || 1) * 7);
  const dailyPayment = Math.max(1, Math.round(totalPayable / totalDays));
  const weeklyPayment = dailyPayment * 7;
  const id = `loan_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
  const loan = {
    id,
    name: name || 'Prestec',
    principal: Number(principal || 0),
    rate: Number(rate || 0),
    weeks: Number(weeks || 1),
    balance: totalPayable,
    dailyPayment,
    weeklyPayment,
    startDay: state.time ? Number(state.time.day || 1) : 1,
    paid: 0
  };
  state.finance.loans.push(loan);
  state.cash = Number(state.cash || 0) + Number(principal || 0);
  log(`💳 Nou préstec: ${loan.name} (+${euro(principal)}) · quota ${euro(weeklyPayment)}/setmana`);
  if (typeof showNotification === 'function') showNotification('💳 Préstec aprovat');
  return loan;
}

export function repayLoan(loanId) {
  if (!state) return false;
  ensureFinanceState();
  const loan = state.finance.loans.find(l => l.id === loanId);
  if (!loan) return false;
  const balance = Number(loan.balance || 0);
  if (balance <= 0) return false;
  if (!canSpend(balance)) { log(`❌ Límite de cashflow: cal ${euro(balance)}`); return false; }
  state.cash = Number(state.cash || 0) - balance;
  loan.balance = 0;
  loan.closed = true;
  state.finance.loans = state.finance.loans.filter(l => l.id !== loanId);
  log(`✅ Préstec tancat: ${loan.name}`);
  return true;
}

export function openCreditLine(limit) {
  if (!state) return false;
  ensureFinanceState();
  const max = Math.max(0, Number(limit || 0));
  if (max <= 0) {
    state.finance.creditLine = { limit: 0, dailyFee: 0, paid: 0 };
    state.finance.cashflowLimit = 0;
    log('💤 Linia de crèdit tancada');
    return true;
  }
  const dailyFee = Math.max(1, Math.round(max * 0.002));
  state.finance.creditLine = { limit: max, dailyFee, paid: 0, openedDay: state.time ? Number(state.time.day || 1) : 1 };
  state.finance.cashflowLimit = max;
  log(`🏦 Linia de crèdit: límit ${euro(max)} · cost diari ${euro(dailyFee)}`);
  return true;
}

export function addLease(itemId, qty = 1, dailyRate = 0.015) {
  // Leasing functionality disabled
  return null;
}

export function returnLease(leaseId) {
  if (!state) return false;
  ensureFinanceState();
  const lease = state.finance.leases.find(l => l.id === leaseId);
  if (!lease) return false;
  const installed = countInstalledItem(lease.itemId);
  const available = invQty(lease.itemId) - installed;
  if (available < Number(lease.qty || 0)) { log('❌ No pots retornar: equips instal·lats'); return false; }
  invRemove(lease.itemId, lease.qty);
  state.finance.leases = state.finance.leases.filter(l => l.id !== leaseId);
  log('↩️ Lease retornat');
  return true;
}

function applyCashflowClamp() {
  if (!state) return 0;
  const limit = getCashflowLimit();
  if (limit <= 0) return 0;
  if (Number(state.cash || 0) >= -limit) return 0;
  const deficit = Math.abs(Number(state.cash || 0) + limit);
  ensureFinanceState();
  state.finance.arrears = (state.finance.arrears || 0) + deficit;
  state.cash = -limit;
  try {
    state.reputation = state.reputation || { overall: 0, byGenre: {} };
    state.reputation.overall = Math.max(0, Number(state.reputation.overall || 0) - 1);
  } catch (e) {}
  return deficit;
}

function applyFinanceCharges() {
  if (!state) return 0;
  ensureFinanceState();
  let charged = 0;
  const loans = Array.isArray(state.finance.loans) ? state.finance.loans : [];
  for (const loan of loans) {
    const daily = Number(loan.dailyPayment || 0);
    if (loan.balance == null) loan.balance = Number(loan.remaining || loan.principal || 0);
    if (daily > 0) {
      state.cash = Number(state.cash || 0) - daily;
      loan.balance = Math.max(0, Number(loan.balance || 0) - daily);
      loan.paid = Number(loan.paid || 0) + daily;
      charged += daily;
    }
    if (Number(loan.balance || 0) <= 0) loan.closed = true;
  }
  state.finance.loans = loans.filter(l => !l.closed);
  const leases = Array.isArray(state.finance.leases) ? state.finance.leases : [];
  for (const lease of leases) {
    const cost = Number(lease.dailyCost || 0) * Number(lease.qty || 0);
    if (cost > 0) {
      state.cash = Number(state.cash || 0) - cost;
      lease.paid = Number(lease.paid || 0) + cost;
      charged += cost;
    }
  }
  const credit = state.finance.creditLine || { limit: 0, dailyFee: 0 };
  if (Number(credit.limit || 0) > 0 && Number(credit.dailyFee || 0) > 0) {
    const fee = Number(credit.dailyFee || 0);
    state.cash = Number(state.cash || 0) - fee;
    charged += fee;
    credit.paid = Number(credit.paid || 0) + fee;
    state.finance.creditLine = credit;
  }
  if (charged > 0) {
    state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + charged;
    state.finance.monthlyExpenses = (state.finance.monthlyExpenses || 0) + charged;
  }
  return charged;
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
  const maintenance = state.roomMaintenance && state.roomMaintenance[roomIndex] ? state.roomMaintenance[roomIndex] : null;
  const day = state.time ? Number(state.time.day || 1) : 1;
  const inspectionBoost = (maintenance && Number(maintenance.inspectionUntilDay || 0) >= day) ? 0.7 : 1;
  const counts = new Map();
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) counts.set(id, (counts.get(id) || 0) + 1);
  }
  for (const [id] of counts.entries()) {
    const item = state.itemsById.get(id);
    const reliability = Number((item && item.stats && item.stats.reliability) || 80);
    const wearRate = clamp((100 - reliability) / 600, 0.02, 0.5);
    const wear = wearRate * Number(hours || 0) * Number(multiplier || 1) * inspectionBoost;
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

function canCoverMicTypeCounts(installedMicIds, counts, itemsById) {
  const remaining = {};
  for (const [type, count] of Object.entries(counts)) {
    remaining[type] = Number(count) || 0;
  }
  if (!Object.keys(remaining).length) return true;
  const mics = installedMicIds.map(id => itemsById.get(id)).filter(Boolean);
  for (const mic of mics) {
    const micTypes = Array.isArray(mic.type) ? mic.type : [];
    const candidates = micTypes.filter(type => remaining[type] > 0);
    if (!candidates.length) continue;
    candidates.sort((a, b) => remaining[b] - remaining[a]);
    const chosen = candidates[0];
    remaining[chosen] -= 1;
  }
  return Object.values(remaining).every(v => v <= 0);
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

  const micTypeInfo = getMicTypeCounts(req);
  if (Object.keys(micTypeInfo.counts).length) {
    const installedMicIds = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic') : [];
    const ok = canCoverMicTypeCounts(installedMicIds, micTypeInfo.counts, state.itemsById || new Map());
    if (!ok) {
      return false;
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
    const completedDay = state.time.day;
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
      // store daily analytics snapshot
      try {
        state.analytics = state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
        state.analytics.daily = Array.isArray(state.analytics.daily) ? state.analytics.daily : [];
        state.analytics.daily.push({
          day: completedDay,
          cash: Number(state.cash || 0),
          fatigueShort: Number(state.player.fatigueShort || 0),
          fatigueChronic: Number(state.player.fatigueChronic || 0),
          reputation: Number(state.reputation && state.reputation.overall || 0)
        });
        if (state.analytics.daily.length > 120) state.analytics.daily.shift();
      } catch (e) {}
      log(`🌅 Nou dia! Fatiga curta: ${state.player.fatigueShort.toFixed(1)}h · Fatiga crònica: ${state.player.fatigueChronic.toFixed(2)}`);
      try { if (typeof window !== 'undefined' && typeof window.processScheduledDay === 'function') window.processScheduledDay(completedDay); } catch (e) {}
      try { if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') window.generateDailyOffers(); } catch (e) {}
    }
  }
}

export function processScheduledDay(day) {
  if (!state || !Array.isArray(state.schedule)) return;
  const scheduled = state.schedule.filter(s => s.day === day);
  if (!scheduled.length) return;
  const completedIds = new Set();
  for (const entry of scheduled) {
    try {
      if (typeof window !== 'undefined' && typeof window.applyScheduledWork === 'function') {
        const res = window.applyScheduledWork(entry.contractId, entry.hours, entry.roomIndex, day);
        if (res && res.completed && res.id) completedIds.add(res.id);
      }
    } catch (e) {}
  }
  // remove finished day entries
  state.schedule = state.schedule.filter(s => s.day !== day);
  // remove any future entries for completed contracts
  try {
    const completed = new Set((state.db && Array.isArray(state.db.contracts)) ? state.db.contracts.filter(c => c.completed).map(c => c.id) : []);
    for (const id of completedIds) completed.add(id);
    if (completed.size) state.schedule = state.schedule.filter(s => !completed.has(s.contractId));
    if (state.db && Array.isArray(state.db.contracts) && completed.size) {
      state.db.contracts = state.db.contracts.filter(c => !completed.has(c.id));
    }
  } catch (e) {}
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
}

// Apply daily room running costs: called indirectly from advanceTime loop
export function applyDailyRoomCosts() {
  if (!state || !state.db || !Array.isArray(state.db.rooms)) return 0;
  let charged = 0;
  ensureFinanceState();
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
      state.finance.monthlyExpenses = (state.finance.monthlyExpenses || 0) + staffDaily;
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
        state.finance.monthlyExpenses = (state.finance.monthlyExpenses || 0) + maintenanceDaily;
        charged += maintenanceDaily;
      }
    } catch (e) {}

    const billing = state.roomBilling[i] = state.roomBilling[i] || { lastBilledDay: null };
    // If room was just installed, bill full week immediately and set lastBilledDay
    if (billing.justInstalled) {
      state.cash = Number(state.cash || 0) - perWeek;
      state.finance = state.finance || {};
      state.finance.weeklyExpenses = (state.finance.weeklyExpenses || 0) + perWeek;
      state.finance.monthlyExpenses = (state.finance.monthlyExpenses || 0) + perWeek;
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
      state.finance.monthlyExpenses = (state.finance.monthlyExpenses || 0) + perWeek;
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
  try {
    charged += applyFinanceCharges();
    const deficit = applyCashflowClamp();
    if (deficit > 0 && typeof log === 'function') log(`⚠️ Cashflow al límit: ${euro(deficit)} pendent`);
  } catch (e) {}
  try {
    const day = Number(state.time && state.time.day || 1);
    state.analytics = state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    state.analytics.expenseByDay = state.analytics.expenseByDay || {};
    state.analytics.expenseByDay[day] = Number(state.analytics.expenseByDay[day] || 0) + Number(charged || 0);
  } catch (e) {}
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
  window.Helpers = Object.assign(window.Helpers || {}, { log, euro, clamp, avgStat, sumStat, xpToNext, addXp, invQty, invAdd, invRemove, countInstalledItem, getCashflowLimit, canSpend, takeLoan, repayLoan, openCreditLine, addLease, returnLease, checkContractRequirements, advanceTime, showNotification, getItemCondition, setItemCondition, applyItemWear, calcRoomMaintenanceDaily, processScheduledDay });
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
  window.countInstalledItem = countInstalledItem;
  window.getCashflowLimit = getCashflowLimit;
  window.canSpend = canSpend;
  window.takeLoan = takeLoan;
  window.repayLoan = repayLoan;
  window.openCreditLine = openCreditLine;
  window.addLease = addLease;
  window.returnLease = returnLease;
  window.getItemCondition = getItemCondition;
  window.setItemCondition = setItemCondition;
  window.applyItemWear = applyItemWear;
  window.processScheduledDay = processScheduledDay;
  window.useConsumable = useConsumable;
  // Expose advanceTime and requirement checker as direct globals for legacy callers
  window.advanceTime = advanceTime;
  window.checkContractRequirements = checkContractRequirements;
}

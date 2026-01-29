// persistence.js - save/load functions (ES module)
import { state, rebuildIndexes, ensureRoomsInstalled } from './state.js';
import { PEOPLE_FALLBACK } from './people_data.js';
import { log } from './helpers.js';

export function saveState() {
  try {
    const payload = {
      player: state.player,
      time: state.time,
      cash: state.cash,
      finance: {
        weeklyExpenses: Number((state.finance && state.finance.weeklyExpenses) || 0),
        monthlyExpenses: Number((state.finance && state.finance.monthlyExpenses) || 0),
        loans: Array.isArray(state.finance && state.finance.loans) ? state.finance.loans : [],
        leases: Array.isArray(state.finance && state.finance.leases) ? state.finance.leases : [],
        creditLine: state.finance && state.finance.creditLine ? state.finance.creditLine : { limit: 0, dailyFee: 0 },
        cashflowLimit: Number((state.finance && state.finance.cashflowLimit) || 0),
        arrears: Number((state.finance && state.finance.arrears) || 0)
      },
      ui: {
        page: state.ui && state.ui.page || 'rooms',
        roomLayout: state.ui && state.ui.roomLayout ? state.ui.roomLayout : {},
        ambient: state.ui && state.ui.ambient ? state.ui.ambient : { enabled: false, volume: 0.2 },
        statsRange: (state.ui && state.ui.statsRange) ? Number(state.ui.statsRange) : 7,
        autoQa: Boolean(state.ui && state.ui.autoQa)
      },
      staff: state.staff || { engineer: { level: 1 }, producer: { level: 1 } },
      reputation: state.reputation || { overall: 0, byGenre: {} },
      roomUpgrades: state.roomUpgrades || {},
      itemCondition: state.itemCondition ? Array.from(state.itemCondition.entries()) : [],
      market: state.market || { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 },
      schedule: Array.isArray(state.schedule) ? state.schedule : [],
      hiredPeople: Array.isArray(state.hiredPeople) ? state.hiredPeople : [],
      inventory: Array.from(state.inventory.entries()),
      roomsInstalled: state.roomsInstalled,
      roomBilling: state.roomBilling,
      roomMaintenance: Array.isArray(state.roomMaintenance) ? state.roomMaintenance : [],
      contractsProgress: state.db.contracts.map(c => ({ id: c.id, worked_hours: c.worked_hours || 0, completed: !!c.completed, completed_at: c.completed_at || null })),
      contractsMeta: state.db.contracts.map(c => ({
        id: c.id,
        base_pay: c.base_pay,
        target_quality: c.target_quality,
        deadline_days: c.deadline_days,
        negotiated: c.negotiated || null,
        base_terms: c._base_terms || null,
        assigned_people: Array.isArray(c.assigned_people) ? c.assigned_people : [],
        assigned_people_map: Array.isArray(c.assigned_people_map) ? c.assigned_people_map : []
      })),
      analytics: state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] },
      campaign: state.campaign || { active: false, currentChapter: 0, currentObjective: 0, completedObjectives: [], unlockedFeatures: [], storylineProgress: {}, milestones: [], achievements: [] }
    };
    localStorage.setItem('studio_tycoon_state_v1', JSON.stringify(payload));
    log('💾 Estat guardat');
  } catch (e) {
    log('❌ Error guardant estat: ' + e.message);
  }
}

function ensurePlayerDefaults() {
  if (!state.player) state.player = { level:1, xp:0, fatigue:0 };
  if (typeof state.player.fatigue !== 'number') state.player.fatigue = 0;
  if (typeof state.player.level !== 'number') state.player.level = 1;
  if (typeof state.player.xp !== 'number') state.player.xp = 0;
}

export function loadStateFromStorage() {
  try {
    const txt = localStorage.getItem('studio_tycoon_state_v1');
    if (!txt) return false;
    const p = JSON.parse(txt);
    if (p.player) {
      state.player = p.player;
    }
    ensurePlayerDefaults();
    if (p.time) state.time = p.time;
    if (typeof p.cash === 'number') state.cash = p.cash;
    if (Array.isArray(p.inventory)) {
      state.inventory.clear();
      for (const [id, qty] of p.inventory) state.inventory.set(id, qty);
    }
    if (Array.isArray(p.roomsInstalled) && p.roomsInstalled.length === state.db.rooms.length) {
      state.roomsInstalled = p.roomsInstalled;
    }
    if (!state.roomUpgrades || typeof state.roomUpgrades !== 'object') state.roomUpgrades = {};
    if (state.db && Array.isArray(state.db.rooms)) {
      state.db.rooms.forEach((r, idx) => {
        state.roomUpgrades[idx] = state.roomUpgrades[idx] || { acoustic: 0, isolation: 0, slots: 0 };
      });
    }
    state.finance = state.finance || {};
    if (p.finance && typeof p.finance === 'object') {
      if (typeof p.finance.weeklyExpenses === 'number') state.finance.weeklyExpenses = p.finance.weeklyExpenses;
      if (typeof p.finance.monthlyExpenses === 'number') state.finance.monthlyExpenses = p.finance.monthlyExpenses;
      if (Array.isArray(p.finance.loans)) state.finance.loans = p.finance.loans;
      if (Array.isArray(p.finance.leases)) state.finance.leases = p.finance.leases;
      if (p.finance.creditLine && typeof p.finance.creditLine === 'object') state.finance.creditLine = p.finance.creditLine;
      if (typeof p.finance.cashflowLimit === 'number') state.finance.cashflowLimit = p.finance.cashflowLimit;
      if (typeof p.finance.arrears === 'number') state.finance.arrears = p.finance.arrears;
    }
    if (p.ui && typeof p.ui === 'object') {
      state.ui = state.ui || { page: 'rooms', roomLayout: {}, ambient: { enabled: false, volume: 0.2 }, statsRange: 7 };
      if (typeof p.ui.page === 'string') state.ui.page = p.ui.page;
      if (p.ui.roomLayout && typeof p.ui.roomLayout === 'object') state.ui.roomLayout = p.ui.roomLayout;
      if (p.ui.ambient && typeof p.ui.ambient === 'object') state.ui.ambient = p.ui.ambient;
      if (typeof p.ui.statsRange === 'number') state.ui.statsRange = p.ui.statsRange;
      if (typeof p.ui.autoQa === 'boolean') state.ui.autoQa = p.ui.autoQa;
    }
    if (p.staff && typeof p.staff === 'object') state.staff = p.staff;
    if (p.reputation && typeof p.reputation === 'object') state.reputation = p.reputation;
    if (p.roomUpgrades && typeof p.roomUpgrades === 'object') state.roomUpgrades = p.roomUpgrades;
    if (Array.isArray(p.itemCondition)) {
      state.itemCondition = new Map();
      for (const [id, value] of p.itemCondition) state.itemCondition.set(id, Number(value));
    }
    if (p.market && typeof p.market === 'object') state.market = p.market;
    if (Array.isArray(p.schedule)) state.schedule = p.schedule;
    if (Array.isArray(p.hiredPeople)) state.hiredPeople = p.hiredPeople;
    if (p.analytics && typeof p.analytics === 'object') {
      state.analytics = p.analytics;
    } else if (!state.analytics) {
      state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    }
    if (p.campaign && typeof p.campaign === 'object') {
      state.campaign = p.campaign;
    } else if (!state.campaign) {
      state.campaign = { active: false, currentChapter: 0, currentObjective: 0, completedObjectives: [], unlockedFeatures: [], storylineProgress: {}, milestones: [], achievements: [] };
    }
    if (!state.finance || typeof state.finance !== 'object') state.finance = { weeklyExpenses: 0, monthlyExpenses: 0 };
    if (!Array.isArray(state.finance.loans)) state.finance.loans = [];
    if (!Array.isArray(state.finance.leases)) state.finance.leases = [];
    if (!state.finance.creditLine || typeof state.finance.creditLine !== 'object') state.finance.creditLine = { limit: 0, dailyFee: 0 };
    if (typeof state.finance.cashflowLimit !== 'number') state.finance.cashflowLimit = 0;
    if (typeof state.finance.arrears !== 'number') state.finance.arrears = 0;
    if (!state.market || typeof state.market !== 'object') state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
    if (!Array.isArray(state.market.specials)) state.market.specials = [];
    if (typeof state.market.lastSpecialDay !== 'number') state.market.lastSpecialDay = 0;
    if (typeof state.finance.weeklyExpenses !== 'number') state.finance.weeklyExpenses = 0;
    if (typeof state.finance.monthlyExpenses !== 'number') state.finance.monthlyExpenses = 0;
    if (Array.isArray(p.roomBilling) && p.roomBilling.length === state.db.rooms.length) {
      state.roomBilling = p.roomBilling.map(b => ({
        lastBilledDay: (b && b.lastBilledDay != null) ? b.lastBilledDay : null,
        weeksBilled: Number((b && b.weeksBilled) || 0),
        totalCharged: Number((b && b.totalCharged) || 0),
        justInstalled: Boolean(b && b.justInstalled)
      }));
    } else if (!Array.isArray(state.roomBilling) || state.roomBilling.length !== state.db.rooms.length) {
      state.roomBilling = state.db.rooms.map(()=> ({ lastBilledDay: null, weeksBilled: 0, totalCharged: 0, justInstalled: false }));
    }
    if (Array.isArray(p.contractsProgress)) {
      for (const cp of p.contractsProgress) {
        const c = state.db.contracts.find(x => x.id === cp.id);
        if (c) {
          c.worked_hours = cp.worked_hours || 0;
          c.completed = !!cp.completed;
          c.completed_at = cp.completed_at || null;
        }
      }
    }
    if (Array.isArray(p.roomMaintenance) && p.roomMaintenance.length === state.db.rooms.length) {
      state.roomMaintenance = p.roomMaintenance.map(m => ({
        lastInspectionDay: (m && m.lastInspectionDay != null) ? m.lastInspectionDay : null,
        inspectionUntilDay: Number((m && m.inspectionUntilDay) || 0)
      }));
    } else if (!Array.isArray(state.roomMaintenance) || state.roomMaintenance.length !== state.db.rooms.length) {
      state.roomMaintenance = state.db.rooms.map(()=> ({ lastInspectionDay: null, inspectionUntilDay: 0 }));
    }
    if (Array.isArray(p.contractsMeta)) {
      for (const cm of p.contractsMeta) {
        const c = state.db.contracts.find(x => x.id === cm.id);
        if (c) {
          if (cm.base_pay != null) c.base_pay = cm.base_pay;
          if (cm.target_quality != null) c.target_quality = cm.target_quality;
          if (cm.deadline_days != null) c.deadline_days = cm.deadline_days;
          c.negotiated = cm.negotiated || null;
          if (cm.base_terms) c._base_terms = cm.base_terms;
          if (Array.isArray(cm.assigned_people)) c.assigned_people = cm.assigned_people;
          if (Array.isArray(cm.assigned_people_map)) c.assigned_people_map = cm.assigned_people_map;
        }
      }
    }
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    log('📥 Estat carregat des de localStorage');
    return true;
  } catch (e) {
    log('❌ Error carregant estat: ' + e.message);
    return false;
  }
}

export function clearPersistenceAndReset() {
  try {
    localStorage.removeItem('studio_tycoon_state_v1');
    state.player = { level: 1, xp: 0, fatigue: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: state.time.workHoursPerDay || 8 };
    state.cash = 1000;
    state.inventory.clear();
    state.ui = { page: 'rooms', roomLayout: {}, ambient: { enabled: false, volume: 0.2 }, statsRange: 7, autoQa: true };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.reputation = { overall: 0, byGenre: {} };
    state.roomUpgrades = {};
    state.itemCondition = new Map();
    state.market = { offers: [], lastDayGenerated: 0 };
    state.schedule = [];
    state.hiredPeople = [];
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    state.campaign = { active: false, currentChapter: 0, currentObjective: 0, completedObjectives: [], unlockedFeatures: [], storylineProgress: {}, milestones: [], achievements: [] };
    state.roomsInstalled = [];
    state.roomBilling = [];
    state.roomMaintenance = [];
    ensureRoomsInstalled();
    state.finance = { weeklyExpenses: 0, monthlyExpenses: 0 };
    for (const c of state.db.contracts) {
      c.worked_hours = 0;
      c.completed = false;
      c.completed_at = null;
    }
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    log('♻️ Persistència esborrada i progrés reiniciat.');
  } catch (e) {
    log('❌ Error esborrant persistència: ' + e.message);
  }
}

export function loadFromObject(obj) {
  const items = obj.items || [];
  const rooms = obj.rooms || [];
  const contracts = obj.contracts || [];
  const people = obj.people || (typeof window !== 'undefined' ? window.PEOPLE : null) || PEOPLE_FALLBACK || [];

  state.db = { items, rooms, contracts, people };
  rebuildIndexes();
  for (const c of state.db.contracts) {
    if (c.worked_hours == null) c.worked_hours = 0;
    if (c.completed == null) c.completed = false;
  }
  ensureRoomsInstalled();
  state.selected.roomIndex = 0;
  state.selected.shopItemId = items.length ? items[0].id : null;
  state.ui = state.ui || { page: 'rooms', roomLayout: {}, ambient: { enabled: false, volume: 0.2 }, statsRange: 7, autoQa: true };
  state.staff = state.staff || { engineer: { level: 1 }, producer: { level: 1 } };
  state.reputation = state.reputation || { overall: 0, byGenre: {} };
  state.roomUpgrades = state.roomUpgrades || {};
  state.itemCondition = state.itemCondition || new Map();
  state.market = state.market || { offers: [], lastDayGenerated: 0 };
  state.analytics = state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
  state.schedule = Array.isArray(state.schedule) ? state.schedule : [];
  state.hiredPeople = Array.isArray(state.hiredPeople) ? state.hiredPeople : [];
  // Ensure finance tracking exists after loading demo data
  state.finance = state.finance || { monthlyExpenses: 0 };
  // Start with zero accumulated weekly expenses by default; rooms only incur
  // costs once something is installed in them (billing starts later via daily updater).
  if (!obj.finance || typeof obj.finance.weeklyExpenses !== 'number') {
    state.finance.weeklyExpenses = 0;
  }
  // Initialize roomBilling array alongside rooms
  state.roomBilling = state.roomBilling || state.db.rooms.map(()=> ({ lastBilledDay: null, weeksBilled: 0, totalCharged: 0, justInstalled: false }));
  const selCat = document.getElementById("selCategory");
  if (selCat) selCat.options.length = 0;
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  try { if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') window.generateDailyOffers(true); } catch (e) {}
  try {
    const offersCount = state.market && Array.isArray(state.market.offers) ? state.market.offers.length : 0;
    const feinesCount = (state.db.contracts ? state.db.contracts.length : 0);
    const total = feinesCount + offersCount;
    log(`📦 Dades carregades: items=${items.length}, rooms=${rooms.length}, feines=${feinesCount}, ofertes=${offersCount}, total=${total}`);
  } catch (e) {
    log(`📦 Dades carregades: items=${items.length}, rooms=${rooms.length}, feines=${contracts.length}`);
  }
}

export function resetGame() {
  state.cash = 1000;
  state.inventory.clear();
  ensureRoomsInstalled();
  state.finance = { weeklyExpenses: 0, monthlyExpenses: 0 };
  state.selected.shopItemId = state.db.items.length ? state.db.items[0].id : null;
  state.ui = { page: 'rooms', roomLayout: {}, ambient: { enabled: false, volume: 0.2 }, statsRange: 7, autoQa: true };
  state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
  state.reputation = { overall: 0, byGenre: {} };
  state.roomUpgrades = {};
  state.itemCondition = new Map();
  state.market = { offers: [], lastDayGenerated: 0 };
  state.schedule = [];
  state.hiredPeople = [];
  state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
  log("🔄 Reset: cash=1000, inventari buit, instal·lacions buides.");
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  localStorage.removeItem('studio_tycoon_state_v1');
}

// Expose for legacy scripts
if (typeof window !== 'undefined') {
  window.saveState = saveState;
  window.loadStateFromStorage = loadStateFromStorage;
  window.clearPersistenceAndReset = clearPersistenceAndReset;
  window.loadFromObject = loadFromObject;
  window.resetGame = resetGame;
}

import { state } from '../state.js';
import { euro, calcRoomMaintenanceDaily, xpToNext, takeLoan, repayLoan, openCreditLine, returnLease } from '../helpers.js';
import { clearChildren, formatContractTypeLabel, formatGenreLabel, formatRoomLabel } from './shared.js';
import { CAMPAIGN_CHAPTERS } from '../campaign.js';

function makeStat(label, value, hint) {
  const item = document.createElement('div');
  item.className = 'stat-item';
  const name = document.createElement('div'); name.className = 'stat-label'; name.textContent = label;
  const val = document.createElement('div'); val.className = 'stat-value'; val.textContent = value;
  item.appendChild(name); item.appendChild(val);
  if (hint) {
    const small = document.createElement('div'); small.className = 'stat-hint'; small.textContent = hint;
    item.appendChild(small);
  }
  return item;
}

function makeBarRow(label, value, max, suffix = '') {
  const row = document.createElement('div'); row.className = 'stat-bar-row';
  const left = document.createElement('div'); left.className = 'stat-bar-label'; left.textContent = label;
  const bar = document.createElement('div'); bar.className = 'stat-bar';
  const fill = document.createElement('div'); fill.className = 'stat-bar-fill';
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  fill.style.width = `${pct}%`;
  const right = document.createElement('div'); right.className = 'stat-bar-value';
  right.textContent = `${value}${suffix}`;
  bar.appendChild(fill);
  row.appendChild(left); row.appendChild(bar); row.appendChild(right);
  return row;
}

function sumInventoryQty() {
  let total = 0;
  for (const qty of state.inventory.values()) total += Number(qty || 0);
  return total;
}

function sumInventoryValue() {
  let total = 0;
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    total += Number(it && it.price || 0) * Number(qty || 0);
  }
  return total;
}

function sumInventoryValueByCategory() {
  const totals = {};
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    const cat = it && it.category ? it.category : 'unknown';
    totals[cat] = (totals[cat] || 0) + Number(it && it.price || 0) * Number(qty || 0);
  }
  return totals;
}

function sumInstalledByCategory() {
  const totals = {};
  if (!Array.isArray(state.roomsInstalled)) return totals;
  for (const bag of state.roomsInstalled) {
    for (const [cat, arr] of Object.entries(bag || {})) {
      totals[cat] = (totals[cat] || 0) + (Array.isArray(arr) ? arr.length : 0);
    }
  }
  return totals;
}

function getInstalledStats() {
  let used = 0;
  let total = 0;
  let avgCondition = 100;
  const conditions = [];
  if (Array.isArray(state.db.rooms)) {
    state.db.rooms.forEach((room, idx) => {
      const slots = room.slots || {};
      total += Object.values(slots).reduce((s, v) => s + Number(v || 0), 0);
      const bag = state.roomsInstalled[idx] || {};
      used += Object.values(bag).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
      if (state.itemCondition) {
        for (const ids of Object.values(bag)) {
          for (const id of (ids || [])) conditions.push(Number(state.itemCondition.get(id) || 100));
        }
      }
    });
  }
  if (conditions.length) {
    avgCondition = Math.round(conditions.reduce((s, v) => s + v, 0) / conditions.length);
  }
  return { used, total, avgCondition };
}

function countActiveRooms() {
  if (!Array.isArray(state.roomsInstalled)) return 0;
  return state.roomsInstalled.filter(bag => Object.values(bag || {}).some(arr => Array.isArray(arr) && arr.length > 0)).length;
}

function sumMaintenanceDaily() {
  if (!Array.isArray(state.db.rooms)) return 0;
  let total = 0;
  for (let i = 0; i < state.db.rooms.length; i++) total += Number(calcRoomMaintenanceDaily(i) || 0);
  return total;
}

function sumScheduledHours(daysAhead = 7) {
  if (!Array.isArray(state.schedule)) return 0;
  const start = Number(state.time.day || 1);
  const end = start + daysAhead - 1;
  return state.schedule
    .filter(s => s.day >= start && s.day <= end)
    .reduce((sum, s) => sum + Number(s.hours || 0), 0);
}

function scheduleHoursByRoom(daysAhead = 7) {
  const start = Number(state.time.day || 1);
  const end = start + daysAhead - 1;
  const totals = {};
  if (!Array.isArray(state.schedule)) return totals;
  for (const entry of state.schedule) {
    if (entry.day < start || entry.day > end) continue;
    const room = state.db.rooms[entry.roomIndex];
    const label = room ? room.name : `Sala ${entry.roomIndex + 1}`;
    totals[label] = (totals[label] || 0) + Number(entry.hours || 0);
  }
  return totals;
}

function countContractsByType() {
  const totals = {};
  const contracts = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  for (const c of contracts) {
    if (c.completed) continue;
    const type = c.type || 'unknown';
    totals[type] = (totals[type] || 0) + 1;
  }
  return totals;
}

function countOffersByRoomType() {
  const totals = {};
  const offers = state.market && Array.isArray(state.market.offers) ? state.market.offers : [];
  for (const o of offers) {
    const roomType = (o.requirements && o.requirements.room_type) ? o.requirements.room_type : 'any';
    totals[roomType] = (totals[roomType] || 0) + 1;
  }
  return totals;
}

function backlogByContract(limit = 6) {
  const contracts = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  const rows = contracts
    .filter(c => !c.completed)
    .map(c => ({
      label: c.name,
      value: Math.max(0, Number(c.duration_hours || 0) - Number(c.worked_hours || 0))
    }))
    .filter(row => row.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
  return rows;
}

function buildRepBars() {
  const wrap = document.createElement('div'); wrap.className = 'stat-bars';
  const byGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const entries = Object.entries(byGenre).sort((a,b)=>Number(b[1])-Number(a[1]));
  if (!entries.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Encara no tens reputacio per genere.';
    wrap.appendChild(empty);
    return wrap;
  }
  const max = Math.max(1, ...entries.map(e => Number(e[1]) || 0));
  for (const [genre, value] of entries) {
    wrap.appendChild(makeBarRow(formatGenreLabel(genre), Number(value || 0), max));
  }
  return wrap;
}

function getObjectiveProgress(obj) {
  const contracts = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  const sessions = state.analytics && Array.isArray(state.analytics.sessions) ? state.analytics.sessions : [];
  const revenueByDay = state.analytics && state.analytics.revenueByDay ? state.analytics.revenueByDay : {};
  const repByGenre = state.reputation && state.reputation.byGenre ? state.reputation.byGenre : {};
  const roomInstalled = (roomType) => {
    const rooms = Array.isArray(state.db.rooms) ? state.db.rooms : [];
    const installs = Array.isArray(state.roomsInstalled) ? state.roomsInstalled : [];
    return rooms.some((room, idx) => {
      if (!room || room.type !== roomType) return false;
      const bag = installs[idx] || {};
      return Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
    });
  };

  switch (obj.type) {
    case 'contract_complete': {
      const current = Number(state.analytics && state.analytics.completedContracts || contracts.filter(c => c.completed).length);
      return { current, target: obj.target, done: current >= obj.target, label: `${current}/${obj.target}` };
    }
    case 'special_contract_complete': {
      const current = Number(state.analytics && state.analytics.completedSpecialContracts || contracts.filter(c => c.completed && c.special).length);
      return { current, target: obj.target, done: current >= obj.target, label: `${current}/${obj.target}` };
    }
    case 'revenue_total': {
      const current = Object.values(revenueByDay).reduce((sum, v) => sum + Number(v || 0), 0);
      return { current, target: obj.target, done: current >= obj.target, label: `${euro(current)} / ${euro(obj.target)}` };
    }
    case 'level': {
      const current = Number(state.player && state.player.level || 1);
      return { current, target: obj.target, done: current >= obj.target, label: `${current}/${obj.target}` };
    }
    case 'room_built': {
      const done = roomInstalled(obj.target);
      return { current: done ? 1 : 0, target: 1, done, label: done ? 'Fet' : `Pend. ${formatRoomLabel(obj.target)}` };
    }
    case 'reputation': {
      const current = Number(state.reputation && state.reputation.overall || 0);
      return { current, target: obj.target, done: current >= obj.target, label: `${current}/${obj.target}` };
    }
    case 'genre_reputation': {
      const values = Object.values(repByGenre).map(v => Number(v || 0));
      const current = values.length ? Math.max(...values) : 0;
      return { current, target: obj.target, done: current >= obj.target, label: `${current}/${obj.target}` };
    }
    case 'quality_single': {
      const maxQuality = sessions.length ? Math.max(...sessions.map(s => Number(s.quality || 0))) : 0;
      return { current: maxQuality, target: obj.target, done: maxQuality >= obj.target, label: `${maxQuality.toFixed(1)}/${obj.target}` };
    }
    default:
      return { current: 0, target: obj.target, done: false, label: '—' };
  }
}

function buildCampaignPanel() {
  const panel = createPanel('🧭 Campanya');
  const wrap = document.createElement('div'); wrap.className = 'campaign-list';

  const active = state.campaign && state.campaign.active;
  const currentChapter = active ? Number(state.campaign.currentChapter || 0) : 0;
  const currentObjective = active ? Number(state.campaign.currentObjective || 0) : 0;
  const completed = active && Array.isArray(state.campaign.completedObjectives) ? state.campaign.completedObjectives : [];

  if (!active) {
    const note = document.createElement('div'); note.className = 'muted';
    note.textContent = 'Campanya desactivada. Activa-la amb el botó "Campanya".';
    panel.content.appendChild(note);
  }

  CAMPAIGN_CHAPTERS.forEach((chapter, chIndex) => {
    const chapterEl = document.createElement('div'); chapterEl.className = 'campaign-chapter';
    const title = document.createElement('div'); title.className = 'campaign-chapter-title';
    title.textContent = `${chIndex + 1}. ${chapter.title}`;
    const desc = document.createElement('div'); desc.className = 'tiny muted'; desc.textContent = chapter.description;
    chapterEl.appendChild(title); chapterEl.appendChild(desc);

    chapter.objectives.forEach((obj, objIndex) => {
      const progress = getObjectiveProgress(obj);
      const isCurrent = active && chIndex === currentChapter && objIndex === currentObjective;
      const isDone = progress.done || completed.includes(obj.id);

      const row = document.createElement('div'); row.className = 'campaign-objective';
      if (isCurrent) row.classList.add('current');
      if (isDone) row.classList.add('done');

      const left = document.createElement('div'); left.className = 'campaign-left';
      const label = document.createElement('div'); label.className = 'campaign-title'; label.textContent = obj.title;
      const sub = document.createElement('div'); sub.className = 'tiny muted'; sub.textContent = obj.description;
      left.appendChild(label); left.appendChild(sub);

      const right = document.createElement('div'); right.className = 'campaign-progress';
      right.textContent = progress.label;

      row.appendChild(left); row.appendChild(right);
      chapterEl.appendChild(row);
    });

    wrap.appendChild(chapterEl);
  });

  panel.content.appendChild(wrap);
  return panel;
}

export function renderStatsPage() {
  const page = document.getElementById('statsPage');
  if (!page) return;
  clearChildren(page);

  const contractsList = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  const activeContracts = contractsList.filter(c => !c.completed).length;
  const completedContracts = contractsList.filter(c => c.completed).length;
  const offersCount = state.market && Array.isArray(state.market.offers) ? state.market.offers.length : 0;
  const totalBilled = Array.isArray(state.roomBilling)
    ? state.roomBilling.reduce((sum, b) => sum + Number((b && b.totalCharged) || 0), 0)
    : 0;

  const invQty = sumInventoryQty();
  const invValue = sumInventoryValue();
  const invValueByCat = sumInventoryValueByCategory();
  const installedByCat = sumInstalledByCategory();
  const { used, total, avgCondition } = getInstalledStats();
  const activeRooms = countActiveRooms();
  const maintenanceDaily = sumMaintenanceDaily();
  const statsRange = state.ui && Number(state.ui.statsRange || 7) || 7;
  const scheduledNext = sumScheduledHours(statsRange);
  const scheduleByRoom = scheduleHoursByRoom(statsRange);
  const repOverall = state.reputation ? Number(state.reputation.overall || 0) : 0;
  const contractTypes = countContractsByType();
  const offersByRoom = countOffersByRoomType();
  const backlog = backlogByContract();
  const xpGoal = xpToNext(Number(state.player && state.player.level || 1));
  const staffWeekly = (() => {
    const eng = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
    const prod = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
    return eng * 120 + prod * 100;
  })();

  const grid = document.createElement('div'); grid.className = 'stats-grid';

  const summary = createPanel('📊 Resum');
  const summaryGrid = document.createElement('div'); summaryGrid.className = 'stat-grid';
  summaryGrid.appendChild(makeStat('Cash', euro(Math.round(state.cash || 0))));
  summaryGrid.appendChild(makeStat('Inventari', `${invQty} items`, euro(invValue)));
  summaryGrid.appendChild(makeStat('Sales actives', `${activeRooms}/${state.db.rooms.length || 0}`));
  summaryGrid.appendChild(makeStat('Sala slots', `${used}/${total}`));
  summaryGrid.appendChild(makeStat('Reputacio', String(repOverall)));
  summaryGrid.appendChild(makeStat('Rep genere', state.reputation && state.reputation.byGenre ? `${Object.keys(state.reputation.byGenre).length} generes` : '0 generes'));
  summaryGrid.appendChild(makeStat('Feines actives', String(activeContracts)));
  const totalCompleted = Number(state.analytics && state.analytics.completedContracts || completedContracts);
  const totalSpecialCompleted = Number(state.analytics && state.analytics.completedSpecialContracts || 0);
  summaryGrid.appendChild(makeStat('Feines completades', String(completedContracts)));
  summaryGrid.appendChild(makeStat('Ofertes avui', String(offersCount)));
  summaryGrid.appendChild(makeStat('Total facturat', euro(totalBilled)));
  summary.content.appendChild(summaryGrid);

  const historyPanel = createPanel('📜 Històric de feines');
  const historyGrid = document.createElement('div'); historyGrid.className = 'stat-grid';
  historyGrid.appendChild(makeStat('Totals completades', String(totalCompleted)));
  historyGrid.appendChild(makeStat('Especials completades', String(totalSpecialCompleted)));
  historyPanel.content.appendChild(historyGrid);

  const historyTypes = createPanel('🧩 Històric per tipus');
  const typeList = document.createElement('div'); typeList.className = 'stat-list';
  const typeEntries = Object.entries(contractTypes).sort((a, b) => Number(b[1]) - Number(a[1]));
  if (!typeEntries.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense dades de tipus.';
    typeList.appendChild(empty);
  } else {
    const maxType = Math.max(1, ...typeEntries.map(e => Number(e[1]) || 0));
    for (const [type, value] of typeEntries) {
      typeList.appendChild(makeBarRow(formatContractTypeLabel(type), Number(value || 0), maxType));
    }
  }
  historyTypes.content.appendChild(typeList);

  const reputation = createPanel('🎯 Reputacio per genere');
  reputation.content.appendChild(buildRepBars());

  const campaignPanel = buildCampaignPanel();

  const rooms = createPanel('🏗️ Sales i equips');
  const roomList = document.createElement('div'); roomList.className = 'stat-list';
  roomList.appendChild(makeBarRow('Slots ocupats', used, Math.max(1, total)));
  roomList.appendChild(makeBarRow('Estat equips', avgCondition, 100, '%'));
  roomList.appendChild(makeBarRow('Manteniment diari', Math.round(maintenanceDaily), Math.max(1, Math.round(maintenanceDaily)), ' EUR'));
  rooms.content.appendChild(roomList);

  const finance = createPanel('💸 Economia');
  const finGrid = document.createElement('div'); finGrid.className = 'stat-grid';
  finGrid.appendChild(makeStat('Despesa setmanal', euro(Math.round((state.finance && state.finance.weeklyExpenses) || 0))));
  finGrid.appendChild(makeStat('Despesa mensual', euro(Math.round((state.finance && state.finance.monthlyExpenses) || 0))));
  finGrid.appendChild(makeStat('Cost staff/setmana', euro(Math.round(staffWeekly))));
  finGrid.appendChild(makeStat('Manteniment diari', euro(Math.round(maintenanceDaily))));
  finance.content.appendChild(finGrid);

  const creditPanel = createPanel('🏦 Crèdit i leasing');
  const creditGrid = document.createElement('div'); creditGrid.className = 'stat-grid';
  const creditLine = state.finance && state.finance.creditLine ? state.finance.creditLine : { limit: 0, dailyFee: 0 };
  const cashflowLimit = Number(state.finance && state.finance.cashflowLimit || 0);
  const arrears = Number(state.finance && state.finance.arrears || 0);
  const loans = state.finance && Array.isArray(state.finance.loans) ? state.finance.loans : [];
  const leases = state.finance && Array.isArray(state.finance.leases) ? state.finance.leases : [];
  const loansBalance = loans.reduce((sum, l) => sum + Number(l.balance || 0), 0);
  const leaseDaily = leases.reduce((sum, l) => sum + Number(l.dailyCost || 0) * Number(l.qty || 0), 0);
  creditGrid.appendChild(makeStat('Límit cashflow', euro(Math.round(cashflowLimit))));
  creditGrid.appendChild(makeStat('Arrears', euro(Math.round(arrears))));
  creditGrid.appendChild(makeStat('Deute préstecs', euro(Math.round(loansBalance))));
  creditGrid.appendChild(makeStat('Leasing/dia', euro(Math.round(leaseDaily))));
  creditPanel.content.appendChild(creditGrid);

  const loanActions = document.createElement('div'); loanActions.className = 'stat-list';
  const loanTitle = document.createElement('div'); loanTitle.className = 'stat-label'; loanTitle.textContent = 'Préstecs ràpids';
  loanActions.appendChild(loanTitle);
  const loanOpts = [
    { name: 'Curt', principal: 4000, weeks: 8, rate: 0.05 },
    { name: 'Mitja', principal: 12000, weeks: 12, rate: 0.04 },
    { name: 'Gran', principal: 25000, weeks: 16, rate: 0.035 }
  ];
  const loanBtnRow = document.createElement('div'); loanBtnRow.className = 'btn-row';
  loanOpts.forEach(opt => {
    const btn = document.createElement('button'); btn.className = 'btn2 btnSmall';
    btn.textContent = `+${euro(opt.principal)} (${opt.name})`;
    btn.addEventListener('click', () => {
      takeLoan(opt);
      try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
      if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    });
    loanBtnRow.appendChild(btn);
  });
  loanActions.appendChild(loanBtnRow);

  if (loans.length) {
    const activeTitle = document.createElement('div'); activeTitle.className = 'stat-label'; activeTitle.textContent = 'Préstecs actius';
    loanActions.appendChild(activeTitle);
    loans.forEach(loan => {
      const row = document.createElement('div'); row.className = 'stat-row';
      const left = document.createElement('div'); left.className = 'stat-bar-label';
      left.textContent = `${loan.name} · ${euro(Math.round(loan.balance || 0))}`;
      const btn = document.createElement('button'); btn.className = 'btn2 btnSmall'; btn.textContent = 'Pagar tot';
      btn.addEventListener('click', () => {
        repayLoan(loan.id);
        try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
        if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
      });
      row.appendChild(left); row.appendChild(btn);
      loanActions.appendChild(row);
    });
  }

  const creditTitle = document.createElement('div'); creditTitle.className = 'stat-label'; creditTitle.textContent = 'Linia de crèdit';
  loanActions.appendChild(creditTitle);
  const creditRow = document.createElement('div'); creditRow.className = 'btn-row';
  [2000, 5000, 10000].forEach(limit => {
    const btn = document.createElement('button'); btn.className = 'btn2 btnSmall';
    btn.textContent = `Límit ${euro(limit)}`;
    btn.addEventListener('click', () => {
      openCreditLine(limit);
      try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
      if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    });
    creditRow.appendChild(btn);
  });
  const btnClose = document.createElement('button'); btnClose.className = 'btn2 btnSmall'; btnClose.textContent = 'Tancar';
  btnClose.addEventListener('click', () => {
    openCreditLine(0);
    try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  });
  creditRow.appendChild(btnClose);
  loanActions.appendChild(creditRow);

  if (leases.length) {
    const leaseTitle = document.createElement('div'); leaseTitle.className = 'stat-label'; leaseTitle.textContent = 'Leasing actiu';
    loanActions.appendChild(leaseTitle);
    leases.forEach(lease => {
      const item = state.itemsById.get(lease.itemId);
      const row = document.createElement('div'); row.className = 'stat-row';
      const left = document.createElement('div'); left.className = 'stat-bar-label';
      left.textContent = `${item ? item.name : lease.itemId} x${lease.qty} · ${euro(Math.round(Number(lease.dailyCost || 0) * Number(lease.qty || 0)))}/dia`;
      const btn = document.createElement('button'); btn.className = 'btn2 btnSmall'; btn.textContent = 'Retornar';
      btn.addEventListener('click', () => {
        returnLease(lease.id);
        try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
        if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
      });
      row.appendChild(left); row.appendChild(btn);
      loanActions.appendChild(row);
    });
  }
  creditPanel.content.appendChild(loanActions);

  const controls = createPanel('⚙️ Filtres', 'rang de dies', true);
  const rangeWrap = document.createElement('div'); rangeWrap.className = 'stat-grid';
  const rangeSelect = document.createElement('select');
  [7, 14, 30, 60].forEach(val => {
    const opt = document.createElement('option');
    opt.value = String(val);
    opt.textContent = `${val} dies`;
    if (val === statsRange) opt.selected = true;
    rangeSelect.appendChild(opt);
  });
  rangeSelect.addEventListener('change', () => {
    state.ui = state.ui || {};
    state.ui.statsRange = Number(rangeSelect.value || 7);
    try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
    renderStatsPage();
  });
  rangeWrap.appendChild(makeStat('Rang', `${statsRange} dies`));
  const rangeControl = document.createElement('div'); rangeControl.className = 'stat-item';
  const label = document.createElement('div'); label.className = 'stat-label'; label.textContent = 'Selecciona rang';
  rangeControl.appendChild(label);
  rangeControl.appendChild(rangeSelect);
  rangeWrap.appendChild(rangeControl);
  controls.content.appendChild(rangeWrap);

  const planning = createPanel('🗓️ Planificacio', null, true);
  const planGrid = document.createElement('div'); planGrid.className = 'stat-grid';
  planGrid.appendChild(makeStat(`Hores programades (${statsRange} dies)`, `${scheduledNext}h`));
  planGrid.appendChild(makeStat('Feines actives', String(activeContracts)));
  planGrid.appendChild(makeStat('Ofertes pendents', String(offersCount)));
  planGrid.appendChild(makeStat('Backlog hores', `${backlog.reduce((s, r) => s + r.value, 0)}h`));
  planGrid.appendChild(makeStat('XP', `${state.player && state.player.xp || 0} / ${xpGoal}`));
  planning.content.appendChild(planGrid);

  const schedule = createPanel(`📈 Carrega d’hores (${statsRange} dies)`);
  const scheduleValues = (() => {
    const start = Number(state.time.day || 1);
    const values = [];
    for (let i = 0; i < statsRange; i++) {
      const day = start + i;
      const hours = Array.isArray(state.schedule)
        ? state.schedule.filter(s => s.day === day).reduce((sum, s) => sum + Number(s.hours || 0), 0)
        : 0;
      values.push(hours);
    }
    return values;
  })();
  schedule.content.appendChild(buildLineChart(scheduleValues));

  const cashflow = createPanel(`💰 Cashflow (${statsRange} dies)`);
  const analytics = state.analytics || { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
  const rev = [];
  const exp = [];
  const net = [];
  const startDay = Math.max(1, Number(state.time.day || 1) - statsRange + 1);
  const endDay = Number(state.time.day || 1);
  for (let d = startDay; d <= endDay; d++) {
    const r = Number(analytics.revenueByDay && analytics.revenueByDay[d] || 0);
    const e = Number(analytics.expenseByDay && analytics.expenseByDay[d] || 0);
    rev.push(r);
    exp.push(e);
    net.push(r - e);
  }
  const cashGrid = document.createElement('div'); cashGrid.className = 'stat-grid';
  const revenueBlock = document.createElement('div'); revenueBlock.className = 'stat-item';
  revenueBlock.appendChild(makeStat('Ingressos', euro(Math.round(rev.reduce((s, v) => s + v, 0)))));
  revenueBlock.appendChild(buildLineChart(rev, '#42c9ff'));
  const expenseBlock = document.createElement('div'); expenseBlock.className = 'stat-item';
  expenseBlock.appendChild(makeStat('Despeses', euro(Math.round(exp.reduce((s, v) => s + v, 0)))));
  expenseBlock.appendChild(buildLineChart(exp, '#ff6b6b'));
  const netBlock = document.createElement('div'); netBlock.className = 'stat-item';
  netBlock.appendChild(makeStat('Net', euro(Math.round(net.reduce((s, v) => s + v, 0)))));
  netBlock.appendChild(buildLineChart(net, '#9ee37d'));
  cashGrid.appendChild(revenueBlock);
  cashGrid.appendChild(expenseBlock);
  cashGrid.appendChild(netBlock);
  cashflow.content.appendChild(cashGrid);

  const completedPanel = createPanel(`✅ Completades (${statsRange} dies)`);
  const completionValues = [];
  const completionStart = Math.max(1, Number(state.time.day || 1) - statsRange + 1);
  const completionEnd = Number(state.time.day || 1);
  const completionSessions = Array.isArray(analytics.sessions) ? analytics.sessions : [];
  for (let d = completionStart; d <= completionEnd; d++) {
    const count = completionSessions.filter(s => Number(s.day || 0) === d).length;
    completionValues.push(count);
  }
  const completionTotal = completionValues.reduce((sum, v) => sum + v, 0);
  completedPanel.content.appendChild(makeStat('Completades', String(completionTotal)));
  completedPanel.content.appendChild(buildLineChart(completionValues, '#7f8cff'));

  const offers = createPanel('📬 Ofertes per tipus');
  const offerCounts = {};
  if (state.market && Array.isArray(state.market.offers)) {
    for (const offer of state.market.offers) {
      offerCounts[offer.type] = (offerCounts[offer.type] || 0) + 1;
    }
  }
  offers.content.appendChild(buildBars(Object.entries(offerCounts).map(([label, value]) => ({ label, value }))));

  const offersRoom = createPanel('🏠 Ofertes per tipus de sala');
  offersRoom.content.appendChild(buildBars(Object.entries(offersByRoom).map(([label, value]) => ({ label, value }))));

  const inventory = createPanel('🎒 Inventari per categoria');
  const byCategory = {};
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    const cat = it && it.category ? it.category : 'unknown';
    byCategory[cat] = (byCategory[cat] || 0) + Number(qty || 0);
  }
  inventory.content.appendChild(buildBars(Object.entries(byCategory).map(([label, value]) => ({ label, value }))));

  const inventoryValue = createPanel('💼 Valor inventari per categoria');
  inventoryValue.content.appendChild(buildBars(Object.entries(invValueByCat).map(([label, value]) => ({ label, value: Math.round(value) })), null, ' EUR'));

  const installed = createPanel('🎚️ Equip instal·lat per categoria');
  installed.content.appendChild(buildBars(Object.entries(installedByCat).map(([label, value]) => ({ label, value }))));

  const contractsPanel = createPanel('✅ Proces de feines');
  const contractStats = [
    { label: 'Actives', value: activeContracts },
    { label: 'Completades', value: completedContracts }
  ];
  contractsPanel.content.appendChild(buildBars(contractStats));

  const contractTypesPanel = createPanel('🧩 Feines per tipus');
  contractTypesPanel.content.appendChild(buildBars(Object.entries(contractTypes).map(([label, value]) => ({ label: formatContractTypeLabel(label), value }))));

  const backlogPanel = createPanel('⏳ Hores pendents per feina');
  backlogPanel.content.appendChild(buildBars(backlog.map(row => ({ label: row.label, value: row.value })), null, 'h'));

  const conditions = createPanel('🧰 Estat equips (distribucio)');
  const buckets = [
    { label: '0-40', value: 0 },
    { label: '40-70', value: 0 },
    { label: '70-90', value: 0 },
    { label: '90-100', value: 0 }
  ];
  if (state.itemCondition) {
    for (const value of state.itemCondition.values()) {
      const v = Number(value || 0);
      if (v < 40) buckets[0].value += 1;
      else if (v < 70) buckets[1].value += 1;
      else if (v < 90) buckets[2].value += 1;
      else buckets[3].value += 1;
    }
  }
  conditions.content.appendChild(buildBars(buckets));

  const roomsByType = createPanel('🏢 Ocupacio per sala');
  const roomEntries = [];
  if (Array.isArray(state.db.rooms)) {
    state.db.rooms.forEach((room, idx) => {
      const slots = room.slots || {};
      const totalSlots = Object.values(slots).reduce((s, v) => s + Number(v || 0), 0);
      const bag = state.roomsInstalled[idx] || {};
      const usedSlots = Object.values(bag).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
      roomEntries.push({ label: room.name || `Sala ${idx + 1}`, value: totalSlots ? Math.round((usedSlots / totalSlots) * 100) : 0 });
    });
  }
  roomsByType.content.appendChild(buildBars(roomEntries, 100, '%'));

  const scheduleByRoomPanel = createPanel('📅 Hores programades per sala');
  scheduleByRoomPanel.content.appendChild(buildBars(Object.entries(scheduleByRoom).map(([label, value]) => ({ label, value })), null, 'h'));

  const fatiguePanel = createPanel('😵 Fatiga');
  const fatigueStats = [
    { label: 'Curta', value: Number(state.player && state.player.fatigueShort || 0) },
    { label: 'Cronica', value: Number(state.player && state.player.fatigueChronic || 0) }
  ];
  fatiguePanel.content.appendChild(buildBars(fatigueStats, Math.max(10, ...fatigueStats.map(s => s.value))));

  const trends = createPanel(`📉 Tendencies (${statsRange} dies)`);
  const daily = Array.isArray(analytics.daily) ? analytics.daily : [];
  const rangeDaily = daily.filter(row => row.day >= startDay && row.day <= endDay);
  const cashSeries = rangeDaily.map(r => Number(r.cash || 0));
  const fatigueSeries = rangeDaily.map(r => Number(r.fatigueShort || 0));
  const repSeries = rangeDaily.map(r => Number(r.reputation || 0));
  const trendGrid = document.createElement('div'); trendGrid.className = 'stat-grid';
  const cashBlock = document.createElement('div'); cashBlock.className = 'stat-item';
  cashBlock.appendChild(makeStat('Cash (tendencia)', euro(Math.round(cashSeries.slice(-1)[0] || state.cash || 0))));
  cashBlock.appendChild(buildLineChart(cashSeries, '#f2c14e'));
  const fatigueBlock = document.createElement('div'); fatigueBlock.className = 'stat-item';
  fatigueBlock.appendChild(makeStat('Fatiga curta', `${(fatigueSeries.slice(-1)[0] || 0).toFixed(1)}h`));
  fatigueBlock.appendChild(buildLineChart(fatigueSeries, '#ff9f43'));
  const repBlock = document.createElement('div'); repBlock.className = 'stat-item';
  repBlock.appendChild(makeStat('Reputacio', String(repSeries.slice(-1)[0] || repOverall)));
  repBlock.appendChild(buildLineChart(repSeries, '#7f8cff'));
  trendGrid.appendChild(cashBlock);
  trendGrid.appendChild(fatigueBlock);
  trendGrid.appendChild(repBlock);
  trends.content.appendChild(trendGrid);

  const sessionsPanel = createPanel(`🎬 Historial sessions (${statsRange} dies)`);
  const sessions = Array.isArray(analytics.sessions) ? analytics.sessions : [];
  const sessionRows = sessions.filter(s => s.day >= startDay && s.day <= endDay).slice(0, 12);
  const table = document.createElement('div'); table.className = 'stat-table';
  if (!sessionRows.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense sessions en aquest rang.';
    table.appendChild(empty);
  } else {
    sessionRows.forEach(s => {
      const row = document.createElement('div'); row.className = 'stat-table-row';
      const left = document.createElement('div'); left.className = 'stat-table-main';
      left.textContent = `Dia ${s.day} · ${s.name} (${s.type})`;
      const right = document.createElement('div'); right.className = 'stat-table-meta';
      right.textContent = `${euro(Math.round(s.payout || 0))} · Qualitat ${Number(s.quality || 0).toFixed(1)} · Fees ${euro(Math.round(s.fees || 0))}`;
      row.appendChild(left); row.appendChild(right);
      table.appendChild(row);
    });
  }
  sessionsPanel.content.appendChild(table);

  grid.appendChild(controls.panel);
  grid.appendChild(summary.panel);
  grid.appendChild(reputation.panel);
  grid.appendChild(historyPanel.panel);
  grid.appendChild(historyTypes.panel);
  grid.appendChild(campaignPanel.panel);
  grid.appendChild(rooms.panel);
  grid.appendChild(finance.panel);
  grid.appendChild(creditPanel.panel);
  grid.appendChild(planning.panel);
  grid.appendChild(schedule.panel);
  grid.appendChild(cashflow.panel);
  grid.appendChild(completedPanel.panel);
  grid.appendChild(offers.panel);
  grid.appendChild(offersRoom.panel);
  grid.appendChild(inventory.panel);
  grid.appendChild(inventoryValue.panel);
  grid.appendChild(installed.panel);
  grid.appendChild(contractsPanel.panel);
  grid.appendChild(contractTypesPanel.panel);
  grid.appendChild(backlogPanel.panel);
  grid.appendChild(conditions.panel);
  grid.appendChild(roomsByType.panel);
  grid.appendChild(scheduleByRoomPanel.panel);
  grid.appendChild(fatiguePanel.panel);
  grid.appendChild(trends.panel);
  grid.appendChild(sessionsPanel.panel);

  page.appendChild(grid);
}
function createPanel(title, subtitle, full = false) {
  const panel = document.createElement('section');
  panel.className = full ? 'panel full' : 'panel';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  if (subtitle) {
    const small = document.createElement('small');
    small.textContent = subtitle;
    h2.appendChild(small);
  }
  const content = document.createElement('div');
  content.className = 'content';
  panel.appendChild(h2);
  panel.appendChild(content);
  return { panel, content };
}

function buildLineChart(values, color) {
  const wrap = document.createElement('div'); wrap.className = 'chart chart-line';
  if (!values.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense dades';
    wrap.appendChild(empty);
    return wrap;
  }
  const max = Math.max(1, ...values);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 40');
  svg.classList.add('chart-line-svg');
  const points = values.map((v, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 100;
    const y = 40 - (v / max) * 34 - 3;
    return `${x},${y}`;
  }).join(' ');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', points);
  line.setAttribute('class', 'chart-line-path');
  if (color) line.style.stroke = color;
  svg.appendChild(line);
  wrap.appendChild(svg);
  return wrap;
}

function buildBars(entries, max, suffix = '') {
  const wrap = document.createElement('div'); wrap.className = 'chart chart-bars';
  if (!entries.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense dades';
    wrap.appendChild(empty);
    return wrap;
  }
  const maxVal = max || Math.max(1, ...entries.map(e => Number(e.value || 0)));
  for (const entry of entries) {
    const row = document.createElement('div'); row.className = 'chart-bar-row';
    const label = document.createElement('div'); label.className = 'chart-bar-label'; label.textContent = entry.label;
    const bar = document.createElement('div'); bar.className = 'chart-bar';
    const fill = document.createElement('div'); fill.className = 'chart-bar-fill';
    const pct = maxVal > 0 ? Math.min(100, Math.round((entry.value / maxVal) * 100)) : 0;
    fill.style.width = `${pct}%`;
    const value = document.createElement('div'); value.className = 'chart-bar-value';
    value.textContent = `${entry.value}${suffix}`;
    bar.appendChild(fill);
    row.appendChild(label); row.appendChild(bar); row.appendChild(value);
    wrap.appendChild(row);
  }
  return wrap;
}

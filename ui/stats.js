import { state } from '../state.js';
import { euro, xpToNext } from '../helpers.js';
import { clearChildren, formatContractTypeLabel } from './shared.js';
import {
  createPanel,
  createPanelWithBars,
  createPanelWithGrid,
  buildLineChart,
  makeStat,
  makeBarRow
} from './stats/dom.js';
import {
  sumInventoryQty,
  sumInventoryValue,
  sumInventoryValueByCategory,
  sumInstalledByCategory,
  getInstalledStats,
  countActiveRooms,
  sumMaintenanceDaily,
  sumScheduledHours,
  scheduleHoursByRoom,
  countContractsByType,
  countOffersByRoomType,
  backlogByContract
} from './stats/metrics.js';
import { buildCampaignPanel, buildRepBars } from './stats/panels.js';

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
  const endDay = Number(state.time && state.time.day || 1);
  const startDay = Math.max(1, endDay - statsRange + 1);
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

  const totalCompleted = Number(state.analytics && state.analytics.completedContracts || completedContracts);
  const totalSpecialCompleted = Number(state.analytics && state.analytics.completedSpecialContracts || 0);

  const summary = createPanelWithGrid('📊 Resum', [
    { label: 'Cash', value: euro(Math.round(state.cash || 0)) },
    { label: 'Inventari', value: `${invQty} items`, hint: euro(invValue) },
    { label: 'Sales actives', value: `${activeRooms}/${state.db.rooms.length || 0}` },
    { label: 'Sala slots', value: `${used}/${total}` },
    { label: 'Reputacio', value: String(repOverall) },
    { label: 'Rep genere', value: state.reputation && state.reputation.byGenre ? `${Object.keys(state.reputation.byGenre).length} generes` : '0 generes' },
    { label: 'Feines actives', value: String(activeContracts) },
    { label: 'Feines completades', value: String(completedContracts) },
    { label: 'Ofertes avui', value: String(offersCount) },
    { label: 'Total facturat', value: euro(totalBilled) }
  ]);

  const historyPanel = createPanelWithGrid('📜 Històric de feines', [
    { label: 'Totals completades', value: String(totalCompleted) },
    { label: 'Especials completades', value: String(totalSpecialCompleted) }
  ]);

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

  const finance = createPanelWithGrid('💸 Economia', [
    { label: 'Despesa setmanal', value: euro(Math.round((state.finance && state.finance.weeklyExpenses) || 0)) },
    { label: 'Despesa mensual', value: euro(Math.round((state.finance && state.finance.monthlyExpenses) || 0)) },
    { label: 'Cost staff/setmana', value: euro(Math.round(staffWeekly)) },
    { label: 'Manteniment diari', value: euro(Math.round(maintenanceDaily)) }
  ]);

  const planning = createPanelWithGrid('🗓️ Planificacio', [
    { label: `Hores programades (${statsRange} dies)`, value: `${scheduledNext}h` },
    { label: 'Feines actives', value: String(activeContracts) },
    { label: 'Ofertes pendents', value: String(offersCount) },
    { label: 'Backlog hores', value: `${backlog.reduce((s, r) => s + r.value, 0)}h` },
    { label: 'XP', value: `${state.player && state.player.xp || 0} / ${xpGoal}` }
  ], true);

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
  const analytics = state.analytics || {
    revenueByDay: {},
    expenseByDay: {},
    sessions: [],
    daily: [],
    offersByDay: {},
    offersAcceptedByDay: {},
    completedByDay: {},
    qualityByDay: {},
    deliveryByDay: {}
  };
  const rev = [];
  const exp = [];
  const net = [];
  const offersByDay = analytics.offersByDay || {};
  const acceptedByDay = analytics.offersAcceptedByDay || {};
  const completedByDay = analytics.completedByDay || {};
  const deliveryByDay = analytics.deliveryByDay || {};
  const qualityByDay = analytics.qualityByDay || {};
  const sumByDay = (obj) => {
    let total = 0;
    for (let d = startDay; d <= endDay; d++) total += Number(obj[d] || 0);
    return total;
  };
  const offersTotal = sumByDay(offersByDay);
  const acceptedTotal = sumByDay(acceptedByDay);
  const completedTotal = sumByDay(completedByDay);
  let onTimeTotal = 0;
  let lateTotal = 0;
  const qualitySeries = [];
  for (let d = startDay; d <= endDay; d++) {
    const delivery = deliveryByDay[d];
    if (delivery) {
      onTimeTotal += Number(delivery.onTime || 0);
      lateTotal += Number(delivery.late || 0);
    }
    const quality = qualityByDay[d];
    const avg = (quality && quality.count) ? (Number(quality.total || 0) / Number(quality.count || 1)) : 0;
    qualitySeries.push(Number(avg.toFixed(1)));
  }
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
  const completionSessions = Array.isArray(analytics.sessions) ? analytics.sessions : [];
  for (let d = startDay; d <= endDay; d++) {
    const count = completionSessions.filter(s => Number(s.day || 0) === d).length;
    completionValues.push(count);
  }
  const completionTotal = completionValues.reduce((sum, v) => sum + v, 0);
  completedPanel.content.appendChild(makeStat('Completades', String(completionTotal)));
  completedPanel.content.appendChild(buildLineChart(completionValues, '#7f8cff'));

  const conversionPanel = createPanelWithBars('🧭 Conversio d’ofertes', [
    { label: 'Ofertes', value: offersTotal },
    { label: 'Acceptades', value: acceptedTotal },
    { label: 'Completades', value: completedTotal }
  ]);

  const deliveryPanel = createPanelWithBars('⏱️ Entregues a temps', [
    { label: 'A temps', value: onTimeTotal },
    { label: 'Tard', value: lateTotal }
  ]);

  const qualityPanel = createPanel(`⭐ Qualitat mitjana (${statsRange} dies)`);
  qualityPanel.content.appendChild(buildLineChart(qualitySeries, '#6fcf97'));

  const offerCounts = {};
  if (state.market && Array.isArray(state.market.offers)) {
    for (const offer of state.market.offers) {
      offerCounts[offer.type] = (offerCounts[offer.type] || 0) + 1;
    }
  }
  const offers = createPanelWithBars('📬 Ofertes per tipus', Object.entries(offerCounts).map(([label, value]) => ({ label, value })));

  const offersRoom = createPanelWithBars('🏠 Ofertes per tipus de sala', Object.entries(offersByRoom).map(([label, value]) => ({ label, value })));

  const inventory = createPanelWithBars('🎒 Inventari per categoria', Object.entries((() => {
  const byCategory = {};
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    const cat = it && it.category ? it.category : 'unknown';
    byCategory[cat] = (byCategory[cat] || 0) + Number(qty || 0);
  }
  return byCategory;
})()).map(([label, value]) => ({ label, value })));

  const inventoryValue = createPanelWithBars('💼 Valor inventari per categoria', Object.entries(invValueByCat).map(([label, value]) => ({ label, value: Math.round(value) })), null, ' EUR');

  const installed = createPanelWithBars('🎚️ Equip instal·lat per categoria', Object.entries(installedByCat).map(([label, value]) => ({ label, value })));

  const contractStats = [
    { label: 'Actives', value: activeContracts },
    { label: 'Completades', value: completedContracts }
  ];
  const contractsPanel = createPanelWithBars('✅ Proces de feines', contractStats);

  const contractTypesPanel = createPanelWithBars('🧩 Feines per tipus', Object.entries(contractTypes).map(([label, value]) => ({ label: formatContractTypeLabel(label), value })));

  const backlogPanel = createPanelWithBars('⏳ Hores pendents per feina', backlog.map(row => ({ label: row.label, value: row.value })), null, 'h');

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
  const conditions = createPanelWithBars('🧰 Estat equips (distribucio)', buckets);

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
  const roomsByType = createPanelWithBars('🏢 Ocupacio per sala', roomEntries, 100, '%');

  const scheduleByRoomPanel = createPanelWithBars('📅 Hores programades per sala', Object.entries(scheduleByRoom).map(([label, value]) => ({ label, value })), null, 'h');

  const fatigueStats = [
    { label: 'Curta', value: Number(state.player && state.player.fatigueShort || 0) },
    { label: 'Cronica', value: Number(state.player && state.player.fatigueChronic || 0) }
  ];
  const fatiguePanel = createPanelWithBars('😵 Fatiga', fatigueStats, Math.max(10, ...fatigueStats.map(s => s.value)));

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
  const costEntries = (() => {
    const entries = [];
    const totals = new Map();
    for (const session of sessions) {
      const sessionDay = Number(session.day || 0);
      if (sessionDay < startDay || sessionDay > endDay) continue;
      const key = session.contract_id || session.name || `sessio_${session.day}`;
      const label = session.name || key;
      const cost = Number((session.cost_total != null ? session.cost_total : session.fees) || 0);
      const row = totals.get(key) || { label, value: 0 };
      row.value += cost;
      totals.set(key, row);
    }
    for (const row of totals.values()) {
      entries.push({ label: row.label, value: Math.round(row.value || 0) });
    }
    return entries.sort((a, b) => b.value - a.value).slice(0, 6);
  })();
  const costPanel = createPanelWithBars('💼 Cost per contracte', costEntries, null, ' EUR');
  const sessionRows = sessions.filter(s => {
    const d = Number(s.day || 0);
    return d >= startDay && d <= endDay;
  }).slice(0, 12);
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
      const costTotal = (s.cost_total != null) ? Number(s.cost_total || 0) : Number(s.fees || 0);
      const costs = s.costs;
      const costText = costs
        ? ` · Cost ${euro(Math.round(costTotal))} (T ${euro(Math.round(costs.talent || 0))}, S ${euro(Math.round(costs.staff || 0))}, R ${euro(Math.round(costs.room || 0))})`
        : ` · Cost ${euro(Math.round(costTotal))}`;
      right.textContent = `${euro(Math.round(s.payout || 0))} · Qualitat ${Number(s.quality || 0).toFixed(1)} · Fees ${euro(Math.round(s.fees || 0))}${costText}`;
      row.appendChild(left); row.appendChild(right);
      table.appendChild(row);
    });
  }
  sessionsPanel.content.appendChild(table);

  const tabDefs = [
    {
      id: 'resum',
      label: 'Resum',
      panels: [summary.panel, reputation.panel, campaignPanel.panel]
    },
    {
      id: 'operacions',
      label: 'Operacions',
      panels: [rooms.panel, inventory.panel, inventoryValue.panel, installed.panel, conditions.panel, roomsByType.panel]
    },
    {
      id: 'planificacio',
      label: 'Planificacio',
      panels: [planning.panel, schedule.panel, scheduleByRoomPanel.panel, backlogPanel.panel, fatiguePanel.panel]
    },
    {
      id: 'contractes',
      label: 'Contractes',
      panels: [historyPanel.panel, historyTypes.panel, conversionPanel.panel, deliveryPanel.panel, offers.panel, offersRoom.panel, contractsPanel.panel, contractTypesPanel.panel, completedPanel.panel, qualityPanel.panel, costPanel.panel, sessionsPanel.panel]
    },
    {
      id: 'finances',
      label: 'Finances',
      panels: [finance.panel, cashflow.panel, trends.panel]
    }
  ];

  const defaultTab = tabDefs[0].id;
  const storedTab = state.ui && state.ui.statsTab ? String(state.ui.statsTab) : defaultTab;
  const activeTab = tabDefs.some(tab => tab.id === storedTab) ? storedTab : defaultTab;

  const tabsNav = document.createElement('div');
  tabsNav.className = 'tabs stats-tabs';
  tabDefs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    if (tab.id === activeTab) btn.classList.add('active');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      state.ui = state.ui || {};
      state.ui.statsTab = tab.id;
      renderStatsPage();
    });
    tabsNav.appendChild(btn);
  });

  page.appendChild(tabsNav);

  tabDefs.forEach(tab => {
    const tabGrid = document.createElement('div');
    tabGrid.className = `stats-grid stats-tab${tab.id === activeTab ? ' active' : ''}`;
    tab.panels.forEach(panel => tabGrid.appendChild(panel));
    page.appendChild(tabGrid);
  });
}

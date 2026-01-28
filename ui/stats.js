import { state } from '../state.js';
import { euro, calcRoomMaintenanceDaily } from '../helpers.js';
import { clearChildren } from './shared.js';

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
    wrap.appendChild(makeBarRow(genre, Number(value || 0), max));
  }
  return wrap;
}

export function renderStatsPage() {
  const page = document.getElementById('statsPage');
  if (!page) return;
  clearChildren(page);

  const contracts = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  const activeContracts = contracts.filter(c => !c.completed).length;
  const completedContracts = contracts.filter(c => c.completed).length;
  const offersCount = state.market && Array.isArray(state.market.offers) ? state.market.offers.length : 0;
  const totalBilled = Array.isArray(state.roomBilling)
    ? state.roomBilling.reduce((sum, b) => sum + Number((b && b.totalCharged) || 0), 0)
    : 0;

  const invQty = sumInventoryQty();
  const invValue = sumInventoryValue();
  const { used, total, avgCondition } = getInstalledStats();
  const activeRooms = countActiveRooms();
  const maintenanceDaily = sumMaintenanceDaily();
  const scheduledNext7 = sumScheduledHours(7);
  const repOverall = state.reputation ? Number(state.reputation.overall || 0) : 0;
  const staffWeekly = (() => {
    const eng = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
    const prod = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
    return eng * 120 + prod * 100;
  })();

  const grid = document.createElement('div'); grid.className = 'stats-grid';

  const summary = document.createElement('section'); summary.className = 'panel';
  summary.innerHTML = '<h2>📊 Resum</h2>';
  const summaryBody = document.createElement('div'); summaryBody.className = 'content';
  const summaryGrid = document.createElement('div'); summaryGrid.className = 'stat-grid';
  summaryGrid.appendChild(makeStat('Cash', euro(Math.round(state.cash || 0))));
  summaryGrid.appendChild(makeStat('Inventari', `${invQty} items`, euro(invValue)));
  summaryGrid.appendChild(makeStat('Sales actives', `${activeRooms}/${state.db.rooms.length || 0}`));
  summaryGrid.appendChild(makeStat('Sala slots', `${used}/${total}`));
  summaryGrid.appendChild(makeStat('Reputacio', String(repOverall)));
  summaryGrid.appendChild(makeStat('Rep genere', state.reputation && state.reputation.byGenre ? `${Object.keys(state.reputation.byGenre).length} generes` : '0 generes'));
  summaryGrid.appendChild(makeStat('Feines actives', String(activeContracts)));
  summaryGrid.appendChild(makeStat('Feines completades', String(completedContracts)));
  summaryGrid.appendChild(makeStat('Ofertes avui', String(offersCount)));
  summaryGrid.appendChild(makeStat('Total facturat', euro(totalBilled)));
  summaryBody.appendChild(summaryGrid);
  summary.appendChild(summaryBody);

  const reputation = document.createElement('section'); reputation.className = 'panel';
  reputation.innerHTML = '<h2>🎯 Reputacio per genere</h2>';
  const repBody = document.createElement('div'); repBody.className = 'content';
  repBody.appendChild(buildRepBars());
  reputation.appendChild(repBody);

  const rooms = document.createElement('section'); rooms.className = 'panel';
  rooms.innerHTML = '<h2>🏗️ Sales i equips</h2>';
  const roomsBody = document.createElement('div'); roomsBody.className = 'content';
  const roomList = document.createElement('div'); roomList.className = 'stat-list';
  roomList.appendChild(makeBarRow('Slots ocupats', used, Math.max(1, total)));
  roomList.appendChild(makeBarRow('Estat equips', avgCondition, 100, '%'));
  roomList.appendChild(makeBarRow('Manteniment diari', Math.round(maintenanceDaily), Math.max(1, Math.round(maintenanceDaily)), ' EUR'));
  roomsBody.appendChild(roomList);
  rooms.appendChild(roomsBody);

  const finance = document.createElement('section'); finance.className = 'panel';
  finance.innerHTML = '<h2>💸 Economia</h2>';
  const finBody = document.createElement('div'); finBody.className = 'content';
  const finGrid = document.createElement('div'); finGrid.className = 'stat-grid';
  finGrid.appendChild(makeStat('Despesa setmanal', euro(Math.round((state.finance && state.finance.weeklyExpenses) || 0))));
  finGrid.appendChild(makeStat('Despesa mensual', euro(Math.round((state.finance && state.finance.monthlyExpenses) || 0))));
  finGrid.appendChild(makeStat('Cost staff/setmana', euro(Math.round(staffWeekly))));
  finGrid.appendChild(makeStat('Manteniment diari', euro(Math.round(maintenanceDaily))));
  finBody.appendChild(finGrid);
  finance.appendChild(finBody);

  const planning = document.createElement('section'); planning.className = 'panel full';
  planning.innerHTML = '<h2>🗓️ Planificacio</h2>';
  const planBody = document.createElement('div'); planBody.className = 'content';
  const planGrid = document.createElement('div'); planGrid.className = 'stat-grid';
  planGrid.appendChild(makeStat('Hores programades (7 dies)', `${scheduledNext7}h`));
  planGrid.appendChild(makeStat('Feines actives', String(activeContracts)));
  planGrid.appendChild(makeStat('Ofertes pendents', String(offersCount)));
  planBody.appendChild(planGrid);
  planning.appendChild(planBody);

  grid.appendChild(summary);
  grid.appendChild(reputation);
  grid.appendChild(rooms);
  grid.appendChild(finance);
  grid.appendChild(planning);

  page.appendChild(grid);
}

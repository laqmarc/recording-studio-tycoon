import { euro, calcRoomMaintenanceDaily } from '../../helpers.js';
import { formatRoomLabel } from '../shared.js';
import { state } from '../../state.js';

export function sumInventoryQty() {
  let total = 0;
  for (const qty of state.inventory.values()) total += Number(qty || 0);
  return total;
}

export function sumInventoryValue() {
  let total = 0;
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    total += Number(it && it.price || 0) * Number(qty || 0);
  }
  return total;
}

export function sumInventoryValueByCategory() {
  const totals = {};
  for (const [id, qty] of state.inventory.entries()) {
    const it = state.itemsById.get(id);
    const cat = it && it.category ? it.category : 'unknown';
    totals[cat] = (totals[cat] || 0) + Number(it && it.price || 0) * Number(qty || 0);
  }
  return totals;
}

export function sumInstalledByCategory() {
  const totals = {};
  if (!Array.isArray(state.roomsInstalled)) return totals;
  for (const bag of state.roomsInstalled) {
    for (const [cat, arr] of Object.entries(bag || {})) {
      totals[cat] = (totals[cat] || 0) + (Array.isArray(arr) ? arr.length : 0);
    }
  }
  return totals;
}

export function getInstalledStats() {
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

export function countActiveRooms() {
  if (!Array.isArray(state.roomsInstalled)) return 0;
  return state.roomsInstalled.filter(bag => Object.values(bag || {}).some(arr => Array.isArray(arr) && arr.length > 0)).length;
}

export function sumMaintenanceDaily() {
  if (!Array.isArray(state.db.rooms)) return 0;
  let total = 0;
  for (let i = 0; i < state.db.rooms.length; i++) total += Number(calcRoomMaintenanceDaily(i) || 0);
  return total;
}

export function sumScheduledHours(daysAhead = 7) {
  if (!Array.isArray(state.schedule)) return 0;
  const start = Number(state.time.day || 1);
  const end = start + daysAhead - 1;
  return state.schedule
    .filter(s => s.day >= start && s.day <= end)
    .reduce((sum, s) => sum + Number(s.hours || 0), 0);
}

export function scheduleHoursByRoom(daysAhead = 7) {
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

export function countContractsByType() {
  const totals = {};
  const contracts = Array.isArray(state.db.contracts) ? state.db.contracts : [];
  for (const c of contracts) {
    if (c.completed) continue;
    const type = c.type || 'unknown';
    totals[type] = (totals[type] || 0) + 1;
  }
  return totals;
}

export function countOffersByRoomType() {
  const totals = {};
  const offers = state.market && Array.isArray(state.market.offers) ? state.market.offers : [];
  for (const o of offers) {
    const roomType = (o.requirements && o.requirements.room_type) ? o.requirements.room_type : 'any';
    totals[roomType] = (totals[roomType] || 0) + 1;
  }
  return totals;
}

export function backlogByContract(limit = 6) {
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

export function getObjectiveProgress(obj) {
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

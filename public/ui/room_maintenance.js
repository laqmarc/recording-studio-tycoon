import { state } from '../state.js';
import { euro, log, canSpend } from '../helpers.js';

export function calcRoomRepairCost(roomIndex) {
  const bag = state.roomsInstalled[roomIndex] || {};
  let cost = 0;
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) {
      const item = state.itemsById.get(id);
      const price = Number(item && item.price || 0);
      const condition = state.itemCondition ? Number(state.itemCondition.get(id) || 100) : 100;
      if (condition < 100) cost += price * (1 - condition / 100) * 0.25;
    }
  }
  return Math.round(cost);
}

export function calcRoomInspectionCost(roomIndex) {
  const bag = state.roomsInstalled[roomIndex] || {};
  let count = 0;
  let value = 0;
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) {
      const item = state.itemsById.get(id);
      count += 1;
      value += Number(item && item.price || 0);
    }
  }
  if (!count) return 0;
  return Math.max(20, Math.round(count * 6 + value * 0.01));
}

export function inspectRoom(roomIndex) {
  const cost = calcRoomInspectionCost(roomIndex);
  if (cost <= 0) return;
  if (!canSpend(cost)) { log(`❌ Límite de cashflow: cal ${euro(cost)}`); return; }
  state.cash -= cost;
  state.roomMaintenance = state.roomMaintenance || [];
  const day = state.time ? Number(state.time.day || 1) : 1;
  const entry = state.roomMaintenance[roomIndex] || { lastInspectionDay: null, inspectionUntilDay: 0 };
  entry.lastInspectionDay = day;
  entry.inspectionUntilDay = day + 3;
  state.roomMaintenance[roomIndex] = entry;
  log(`🧰 Inspecció feta: bonus de manteniment 3 dies`);
  if (typeof window !== 'undefined' && typeof window.showNotification === 'function') window.showNotification('🧰 Inspecció completada (3 dies)');
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function repairRoomItems(roomIndex) {
  const cost = calcRoomRepairCost(roomIndex);
  if (cost <= 0) return;
  if (!canSpend(cost)) { log(`❌ Límite de cashflow: cal ${euro(cost)}`); return; }
  state.cash -= cost;
  state.itemCondition = state.itemCondition || new Map();
  const bag = state.roomsInstalled[roomIndex] || {};
  for (const ids of Object.values(bag)) {
    for (const id of (ids || [])) state.itemCondition.set(id, 100);
  }
  log(`🧰 Reparat equip per ${euro(cost)}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

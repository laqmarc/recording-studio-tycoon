import { state } from '../state.js';
import { euro, log } from '../helpers.js';

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

export function repairRoomItems(roomIndex) {
  const cost = calcRoomRepairCost(roomIndex);
  if (cost <= 0) return;
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
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

import { state } from '../state.js';
import { euro, log } from '../helpers.js';

export function getUpgradeMeta(roomIndex) {
  const upgrades = state.roomUpgrades && state.roomUpgrades[roomIndex] ? state.roomUpgrades[roomIndex] : { acoustic: 0, isolation: 0, slots: 0 };
  return {
    limits: { acoustic: 5, isolation: 5, slots: 3 },
    upgrades
  };
}

export function getUpgradeCost(type, level) {
  const base = type === 'acoustic' ? 350 : type === 'isolation' ? 420 : 600;
  return Math.round(base * Math.pow(level + 1, 1.25));
}

export function applyRoomUpgrade(roomIndex, type) {
  const meta = getUpgradeMeta(roomIndex);
  const current = Number(meta.upgrades[type] || 0);
  const limit = meta.limits[type];
  if (current >= limit) return;
  const cost = getUpgradeCost(type, current);
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
  state.cash -= cost;
  state.roomUpgrades = state.roomUpgrades || {};
  state.roomUpgrades[roomIndex] = state.roomUpgrades[roomIndex] || { acoustic: 0, isolation: 0, slots: 0 };
  state.roomUpgrades[roomIndex][type] = current + 1;
  log(`🔧 Upgrade ${type}: nivell ${current + 1}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

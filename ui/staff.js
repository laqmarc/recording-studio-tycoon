import { state } from '../state.js';
import { euro, log } from '../helpers.js';

export function getStaffLevels() {
  const engineer = (state.staff && state.staff.engineer && state.staff.engineer.level) ? Number(state.staff.engineer.level) : 1;
  const producer = (state.staff && state.staff.producer && state.staff.producer.level) ? Number(state.staff.producer.level) : 1;
  return { engineer, producer };
}

export function getStaffCosts(role) {
  const levels = getStaffLevels();
  const level = role === 'producer' ? levels.producer : levels.engineer;
  const base = role === 'producer' ? 280 : 320;
  const cost = Math.round(base * Math.pow(level, 1.35));
  return { level, cost };
}

export function trainStaff(role) {
  const { level, cost } = getStaffCosts(role);
  if (state.cash < cost) { log(`❌ No tens prou diners (${euro(cost)})`); return; }
  state.cash -= cost;
  state.staff = state.staff || { engineer: { level: 1 }, producer: { level: 1 } };
  if (role === 'producer') state.staff.producer.level = level + 1;
  else state.staff.engineer.level = level + 1;
  log(`🎛️ Staff: ${role} nivell ${level + 1}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

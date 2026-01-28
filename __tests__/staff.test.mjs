import { getStaffLevels, getStaffCosts, trainStaff } from '../ui/staff.js';

describe('ui/staff', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.staff = null;
    state.cash = 1000;
    window.saveState = () => { window.__saved = true; };
    window.renderAll = () => { window.__rendered = true; };
    window.__saved = false;
    window.__rendered = false;
    window.log = () => {};
  });

  test('getStaffLevels defaults to level 1', () => {
    const levels = getStaffLevels();
    expect(levels.engineer).toBe(1);
    expect(levels.producer).toBe(1);
  });

  test('getStaffCosts uses role base costs', () => {
    state.staff = { engineer: { level: 2 }, producer: { level: 3 } };
    const eng = getStaffCosts('engineer');
    const prod = getStaffCosts('producer');
    expect(eng.cost).toBeGreaterThan(0);
    expect(prod.cost).toBeGreaterThan(0);
    expect(prod.cost).not.toBe(eng.cost);
  });

  test('trainStaff increases level and reduces cash', () => {
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    const before = state.cash;
    trainStaff('engineer');
    expect(state.staff.engineer.level).toBe(2);
    expect(state.cash).toBeLessThan(before);
    expect(window.__saved).toBe(true);
    expect(window.__rendered).toBe(true);
  });

  test('trainStaff does nothing without cash', () => {
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.cash = 0;
    trainStaff('producer');
    expect(state.staff.producer.level).toBe(1);
  });
});

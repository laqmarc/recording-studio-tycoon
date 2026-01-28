import { applyItemWear, calcRoomMaintenanceDaily, applyDailyRoomCosts } from '../helpers.js';

describe('helpers maintenance and wear', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.itemsById = new Map([
      ['i1', { id: 'i1', stats: { reliability: 100, maintenance_weekly: 14 }, price: 100 }]
    ]);
    state.roomsInstalled = [{ misc: ['i1'] }];
    state.itemCondition = new Map();
    state.cash = 100;
    state.db.rooms = [{ id: 'r1', name: 'Room', price_per_week: 0 }];
    state.roomBilling = [{ lastBilledDay: 1 }];
    state.finance = { weeklyExpenses: 0 };
    state.staff = { engineer: { level: 0 }, producer: { level: 0 } };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
  });

  test('applyItemWear reduces condition based on reliability', () => {
    applyItemWear(0, 1, 1);
    const cond = state.itemCondition.get('i1');
    expect(cond).toBeLessThan(100);
    expect(cond).toBeGreaterThan(99.9);
  });

  test('calcRoomMaintenanceDaily sums maintenance_weekly / 7', () => {
    const daily = calcRoomMaintenanceDaily(0);
    expect(daily).toBeCloseTo(2, 5);
  });

  test('applyDailyRoomCosts charges maintenance daily', () => {
    const charged = applyDailyRoomCosts();
    const engLevel = state.staff.engineer.level || 1;
    const prodLevel = state.staff.producer.level || 1;
    const staffDaily = (engLevel * 120 + prodLevel * 100) / 7;
    const expected = staffDaily + 2;
    expect(charged).toBeCloseTo(expected, 5);
    expect(state.cash).toBeCloseTo(100 - expected, 5);
    expect(state.finance.weeklyExpenses).toBeCloseTo(expected, 5);
  });
});

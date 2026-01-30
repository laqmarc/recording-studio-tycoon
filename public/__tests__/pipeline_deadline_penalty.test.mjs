import { state } from '../state.js';
import { simulateContract } from '../simulation.js';

describe('pipeline deadline penalty', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'control_room', base_acoustic: 10, noise_floor_db: -60 }];
    state.itemsById = new Map([
      ['m1', { id: 'm1', category: 'monitor', stats: { monitor_accuracy: 80 } }]
    ]);
    state.roomsInstalled = [{ monitor: ['m1'] }];
    state.selected = { roomIndex: 0 };
    state.player = { fatigue: 0 };
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    state.time = { day: 10, hour: 0, workHoursPerDay: 8 };
  });

  test('late delivery reduces payout', () => {
    const contract = {
      id: 'c1',
      name: 'Late Mix',
      type: 'mix',
      base_pay: 200,
      target_quality: 60,
      duration_hours: 2,
      worked_hours: 2,
      start_day: 1,
      deadline_days: 2,
      requirements: { room_type: 'control_room' }
    };
    state.db.contracts = [contract];

    const ok = simulateContract('c1');
    expect(ok).toBe(true);
    const session = state.analytics.sessions[0];
    expect(session.payout).toBeLessThan(200);
  });
});

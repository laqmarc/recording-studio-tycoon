import { simulateContract } from '../simulation.js';
import { state } from '../state.js';

describe('sessions overflow', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', name: 'Room A', type: 'control_room', base_acoustic: 10, noise_floor_db: -60 }];
    state.db.contracts = [{ id: 'c1', name: 'Mix', type: 'mix', base_pay: 100, target_quality: 50, duration_hours: 1 }];
    state.itemsById = new Map();
    state.roomsInstalled = [{}];
    state.selected = { roomIndex: 0 };
    state.player = { fatigue: 0 };
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };

    // Pre-fill 50 sessions
    for (let i = 0; i < 50; i++) {
      state.analytics.sessions.push({ id: `s${i}` });
    }
  });

  test('keeps sessions capped at 50', () => {
    const lastId = state.analytics.sessions[49].id;
    const ok = simulateContract('c1');
    expect(ok).toBe(true);
    expect(state.analytics.sessions.length).toBe(50);
    expect(state.analytics.sessions[0].name).toBe('Mix');
    expect(state.analytics.sessions.some(s => s.id === lastId)).toBe(false);
  });
});

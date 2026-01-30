import { state } from '../state.js';
import { simulateContract } from '../simulation.js';

describe('pipeline stage rewards', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', name: 'Sala A', type: 'control_room', base_acoustic: 10, noise_floor_db: -60 }
    ];
    state.itemsById = new Map([
      ['m1', { id: 'm1', stats: { monitor_accuracy: 80 } }],
      ['i1', { id: 'i1', stats: { conversion_quality: 80, latency_score: 80 } }],
      ['a1', { id: 'a1', stats: { room_acoustic_add: 10 } }]
    ]);
    state.roomsInstalled = [{ monitor: ['m1'], interface: ['i1'], acoustic_treatment: ['a1'] }];
    state.player = { fatigue: 0 };
    state.staff = { engineer: { level: 2 }, producer: { level: 2 } };
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };
  });

  test('simulateContract records session quality and payout', () => {
    const contract = {
      id: 'c1',
      type: 'mix',
      base_pay: 200,
      target_quality: 60,
      worked_hours: 4,
      duration_hours: 4,
      requirements: { room_type: 'control_room' }
    };
    state.db.contracts = [contract];
    const ok = simulateContract('c1');
    expect(ok).toBe(true);
    expect(state.analytics.sessions.length).toBeGreaterThan(0);
    const session = state.analytics.sessions[0];
    expect(session.quality).toBeGreaterThan(0);
    expect(session.payout).toBeGreaterThan(0);
  });
});

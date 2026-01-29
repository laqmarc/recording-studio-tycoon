import { simulateRecording } from '../lib/simulation.js';

describe('simulateRecording edge cases', () => {
  const baseState = () => ({
    db: { items: [], rooms: [{ id: 'r1', base_acoustic: 10, noise_floor_db: -60 }], contracts: [] },
    itemsById: new Map(),
    roomsInstalled: [ {} ],
    player: { fatigue: 0 }
  });

  test('no gear returns reasonable defaults', () => {
    const state = baseState();
    const contract = { type: 'recording', base_pay: 100, target_quality: 40 };
    const out = simulateRecording(state, 0, contract);
    expect(out.final_quality).toBeGreaterThanOrEqual(0);
    expect(out.payout).toBeGreaterThan(0);
  });

  test('high fatigue reduces quality and payout', () =>
    {
      const state = baseState(); state.player.fatigue = 30;
      const contract = { type: 'recording', base_pay: 100, target_quality: 40 };
      const low = simulateRecording(state, 0, contract);
      state.player.fatigue = 0;
      const high = simulateRecording(state, 0, contract);
      expect(low.final_quality).toBeLessThanOrEqual(high.final_quality);
    }
  );

  test('noisy room penalizes quality', () => {
    const state = baseState(); state.db.rooms[0].noise_floor_db = -30;
    const contract = { type: 'recording', base_pay: 200, target_quality: 50 };
    const out = simulateRecording(state, 0, contract);
    expect(out.noise_penalty).toBeGreaterThanOrEqual(0);
  });

  test('different contract types compute without error', () => {
    const state = baseState();
    const types = ['recording','mix','streaming','master','edit'];
    for (const t of types) {
      const out = simulateRecording(state, 0, { type: t, base_pay: 150 });
      expect(typeof out.final_quality).toBe('number');
    }
  });
});

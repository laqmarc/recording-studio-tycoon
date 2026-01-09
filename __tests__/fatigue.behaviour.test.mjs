/** @jest-environment jsdom */

import { simulateRecording } from '../lib/simulation.js';

describe('fatigue behaviour effects', () => {
  const baseState = () => ({
    db: { items: [], rooms: [{ id: 'r1', base_acoustic: 10, noise_floor_db: -60 }], contracts: [] },
    itemsById: new Map(),
    roomsInstalled: [ {} ],
    player: { fatigue: 0 }
  });

  test('higher fatigue reduces final_quality and payout', () => {
    const contract = { type: 'recording', base_pay: 200, target_quality: 50 };
    const s0 = baseState(); s0.player.fatigue = 0;
    const s10 = baseState(); s10.player.fatigue = 10;
    const s20 = baseState(); s20.player.fatigue = 20;

    const r0 = simulateRecording(s0, 0, contract);
    const r10 = simulateRecording(s10, 0, contract);
    const r20 = simulateRecording(s20, 0, contract);

    expect(r0.final_quality).toBeGreaterThanOrEqual(r10.final_quality);
    expect(r10.final_quality).toBeGreaterThanOrEqual(r20.final_quality);

    expect(r0.payout).toBeGreaterThanOrEqual(r10.payout);
    expect(r10.payout).toBeGreaterThanOrEqual(r20.payout);
  });
});

/** @jest-environment jsdom */

import { simulateRecording } from '../simulation.js';

describe('simulation penalties', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db.rooms = [{ id: 'r1', name: 'Room', type: 'control_room', base_acoustic: 40, noise_floor_db: -50 }];
    state.roomsInstalled = [{
      mic: ['m1'],
      preamp: ['p1'],
      interface: ['i1'],
      monitor: ['mon1'],
      headphones: ['h1'],
      acoustic_treatment: ['a1']
    }];
    state.itemsById = new Map([
      ['m1', { id: 'm1', stats: { mic_quality: 60 } }],
      ['p1', { id: 'p1', stats: { preamp_quality: 60 } }],
      ['i1', { id: 'i1', stats: { conversion_quality: 60, latency_score: 10 } }],
      ['mon1', { id: 'mon1', stats: { monitor_accuracy: 60 } }],
      ['h1', { id: 'h1', stats: { hp_accuracy: 60 } }],
      ['a1', { id: 'a1', stats: { room_acoustic_add: 10 } }]
    ]);
    state.itemCondition = new Map([['m1', 50], ['p1', 50], ['i1', 50], ['mon1', 50], ['h1', 50]]);
    state.player = { level: 1, fatigue: 20, fatigueShort: 0, fatigueChronic: 0 };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
  });

  test('applies noise, fatigue, and condition penalties', () => {
    const contract = { type: 'recording', duration_hours: 2, target_quality: 55 };
    const res = simulateRecording(0, contract);
    expect(res.noise_penalty).toBeGreaterThan(0);
    expect(res.fatigue_penalty).toBeGreaterThan(0);
    expect(res.condition_penalty).toBeGreaterThan(0);
  });

  test('no noise penalty at -70 dB', () => {
    state.db.rooms[0].noise_floor_db = -70;
    state.player.fatigue = 0;
    state.itemCondition = new Map([['m1', 100]]);
    const contract = { type: 'recording', duration_hours: 2, target_quality: 55 };
    const res = simulateRecording(0, contract);
    expect(res.noise_penalty).toBe(0);
  });
});

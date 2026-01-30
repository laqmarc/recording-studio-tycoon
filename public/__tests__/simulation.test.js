import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { simulateRecording } = require('../lib/simulation');

test('simulateRecording basic recording scenario', () => {
  const state = {
    db: {
      items: [
        { id: 'mic1', stats: { mic_quality: 80 } },
        { id: 'int1', stats: { conversion_quality: 80, latency_score: 80 } },
        { id: 'ac1', stats: { room_acoustic_add: 10 } }
      ],
      rooms: [ { name: 'Room A', base_acoustic: 10, noise_floor_db: -65 } ]
    },
    roomsInstalled: [ { mic: ['mic1'], interface: ['int1'], acoustic_treatment: ['ac1'] } ],
    player: { fatigue: 2 }
  };

  const contract = { type: 'recording', base_pay: 200, target_quality: 50 };
  const res = simulateRecording(state, 0, contract);

  expect(res).toHaveProperty('final_quality');
  expect(res).toHaveProperty('payout');
  expect(res.final_quality).toBeGreaterThan(0);
  expect(res.payout).toBeGreaterThan(0);
});

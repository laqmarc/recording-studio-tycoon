import { buildStages } from '../client_market.js';

describe('pipeline genre duration overrides', () => {
  test('uses genre-specific duration_pct when provided', () => {
    const template = {
      stages: [
        { type: 'recording', room_type: 'live_room', duration_pct: 0.4, duration_pct_by_genre: { live: 0.6 }, min_items: { mic: 1 } },
        { type: 'mix', room_type: 'control_room', duration_pct: 0.3, min_items: { monitor: 1 } },
        { type: 'master', room_type: 'mastering_suite', duration_pct: 0.3, min_items: { monitor: 1 } }
      ]
    };
    const stages = buildStages(template, 'live', 10);
    expect(stages[0].duration_hours).toBe(6);
  });
});

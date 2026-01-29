import { buildStages } from '../client_market.js';

describe('pipeline stage labels', () => {
  test('defaults to Catalan stage labels', () => {
    const template = {
      stages: [
        { type: 'recording', room_type: 'live_room', duration_pct: 0.5, min_items: { mic: 1 } },
        { type: 'edit', room_type: 'edit_room', duration_pct: 0.3, min_items: { monitor: 1 } },
        { type: 'mix', room_type: 'control_room', duration_pct: 0.2, min_items: { monitor: 1 } }
      ]
    };
    const stages = buildStages(template, 'rock', 10);
    expect(stages[0].label).toBe('Gravacio');
    expect(stages[1].label).toBe('Edicio');
    expect(stages[2].label).toBe('Mescla');
  });
});

import { buildStages } from '../client_market.js';

describe('pipeline duration varies by genre', () => {
  test('different genres yield different stage hours', () => {
    const template = {
      stages: [
        { type: 'recording', room_type: 'live_room', duration_pct: 0.4, duration_pct_by_genre: { pop: 0.5, rap: 0.6 }, min_items: { mic: 1 } },
        { type: 'edit', room_type: 'edit_room', duration_pct: 0.3, min_items: { monitor: 1 } },
        { type: 'mix', room_type: 'control_room', duration_pct: 0.3, min_items: { monitor: 1 } }
      ]
    };
    const popStages = buildStages(template, 'pop', 10);
    const rapStages = buildStages(template, 'rap', 10);
    expect(popStages[0].duration_hours).toBe(5);
    expect(rapStages[0].duration_hours).toBe(6);
  });
});

import { generateDailyOffers } from '../client_market.js';
import { state } from '../state.js';

describe('pipeline gating', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', type: 'podcast_studio', unlock_level: 1 },
      { id: 'r2', type: 'control_room', unlock_level: 1 },
      { id: 'r3', type: 'live_room', unlock_level: 1 },
      { id: 'r4', type: 'mastering_suite', unlock_level: 1 },
      { id: 'r5', type: 'foley_room', unlock_level: 1 },
      { id: 'r6', type: 'edit_room', unlock_level: 1 }
    ];
    state.roomsInstalled = [
      { mic: ['i1'] },
      { monitor: ['i1'] },
      { mic: ['i1'] },
      {},
      { mic: ['i1'] },
      {}
    ];
    state.player = { level: 10 };
    state.reputation = {
      overall: 50,
      byGenre: { pop: 50, rap: 50, hiphop: 50, rock: 50, podcast: 50, live: 50, film_score: 50, commercial: 50 }
    };
    state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
    state.time = { day: 10, hour: 0, workHoursPerDay: 8 };
  });

  test('no pipeline offers when required rooms are inactive', () => {
    const offers = generateDailyOffers(true);
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.every(o => !o.pipeline)).toBe(true);
  });
});

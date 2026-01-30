import { getEligibleTemplates } from '../client_market.js';
import { state } from '../state.js';

describe('pipeline offers with active rooms', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', type: 'podcast_studio', unlock_level: 1 },
      { id: 'r2', type: 'edit_room', unlock_level: 1 },
      { id: 'r3', type: 'control_room', unlock_level: 1 },
      { id: 'r4', type: 'live_room', unlock_level: 1 },
      { id: 'r5', type: 'mastering_suite', unlock_level: 1 },
      { id: 'r6', type: 'foley_room', unlock_level: 1 },
      { id: 'r7', type: 'vocal_booth', unlock_level: 1 },
      { id: 'r8', type: 'streaming_room', unlock_level: 1 }
    ];
    state.roomsInstalled = [
      { mic: ['i1'] },
      { monitor: ['i1'] },
      { monitor: ['i1'] },
      { mic: ['i1'] },
      { monitor: ['i1'] },
      { mic: ['i1'] },
      { mic: ['i1'] },
      { mic: ['i1'] }
    ];
    state.player = { level: 10 };
    state.reputation = {
      overall: 50,
      byGenre: { pop: 50, rap: 50, hiphop: 50, rock: 50, podcast: 50, live: 50, film_score: 50, commercial: 50 }
    };
    state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
    state.time = { day: 12, hour: 0, workHoursPerDay: 8 };
  });

  test('eligible templates include pipeline when rooms are active', () => {
    const eligible = getEligibleTemplates(50);
    expect(eligible.length).toBeGreaterThan(0);
    expect(eligible.some(t => Array.isArray(t.stages) && t.stages.length > 1)).toBe(true);
  });
});

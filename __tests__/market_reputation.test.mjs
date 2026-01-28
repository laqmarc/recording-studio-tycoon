/** @jest-environment jsdom */

import { generateDailyOffers, acceptOffer, declineOffer } from '../client_market.js';
import { simulateContract } from '../simulation.js';

describe('client market and reputation', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db.rooms = [
      { id: 'r1', type: 'control_room', unlock_level: 1 },
      { id: 'r2', type: 'vocal_booth', unlock_level: 3 },
      { id: 'r3', type: 'live_room', unlock_level: 4 },
      { id: 'r4', type: 'mastering_suite', unlock_level: 6 },
      { id: 'r5', type: 'streaming_room', unlock_level: 5 }
    ];
    state.db.contracts = [];
    state.reputation = { overall: 0, byGenre: {} };
    state.player = { level: 10, xp: 0, fatigue: 0, fatigueShort: 0, fatigueChronic: 0 };
    state.market = { offers: [], lastDayGenerated: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.roomsInstalled = [ {}, {}, {}, {}, {} ];
    state.itemsById = new Map();
    state.selected = { roomIndex: 0 };
    document.body.innerHTML = '<div id="log"></div>';
  });

  test('generateDailyOffers yields 2 offers at low reputation', () => {
    state.reputation.overall = 0;
    const offers = generateDailyOffers(true);
    expect(offers.length).toBe(2);
    expect(state.market.lastDayGenerated).toBe(1);
  });

  test('generateDailyOffers yields more offers at higher reputation', () => {
    state.reputation.overall = 20;
    const offers = generateDailyOffers(true);
    expect(offers.length).toBe(6);
  });

  test('acceptOffer moves offer into contracts', () => {
    state.market.offers = [{ id: 'o1', name: 'Mix', type: 'mix', base_pay: 120 }];
    acceptOffer('o1');
    expect(state.db.contracts.length).toBe(1);
    expect(state.db.contracts[0].id).toBe('contract_o1');
    expect(state.market.offers.length).toBe(0);
  });

  test('declineOffer removes offer', () => {
    state.market.offers = [{ id: 'o2', name: 'Rec', type: 'recording', base_pay: 100 }];
    declineOffer('o2');
    expect(state.market.offers.length).toBe(0);
  });

  test('simulateContract increases reputation', () => {
    state.db.rooms = [{ id: 'r1', type: 'control_room', base_acoustic: 40, noise_floor_db: -60 }];
    state.roomsInstalled = [ {} ];
    state.itemsById = new Map();
    state.selected.roomIndex = 0;
    state.db.contracts = [{ id: 'c1', name: 'Rock', type: 'mix', genre: 'rock', base_pay: 100, duration_hours: 2, worked_hours: 2, requirements: {} }];
    const before = state.reputation.overall;
    const ok = simulateContract('c1');
    expect(ok).toBe(true);
    expect(state.reputation.overall).toBeGreaterThan(before);
    expect(state.reputation.byGenre.rock).toBeGreaterThan(0);
  });
});

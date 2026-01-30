/** @jest-environment jsdom */

import { advanceTime } from '../helpers.js';

describe('helpers advanceTime integration', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="log"></div>`;
    state.time = { day: 1, hour: 7, workHoursPerDay: 8 };
    state.player = { fatigueShort: 10, fatigueChronic: 2, fatigue: 0, restBonus: 0 };
    state.db.rooms = [];
    state.roomsInstalled = [];
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.cash = 100;
    state.finance = { weeklyExpenses: 0 };

    let processed = 0;
    let offers = 0;
    window.processScheduledDay = () => { processed += 1; };
    window.generateDailyOffers = () => { offers += 1; };
    window.__counts = () => ({ processed, offers });
  });

  test('crossing day triggers scheduled processing and offers', () => {
    advanceTime(2);
    expect(state.time.day).toBe(2);
    const counts = window.__counts();
    expect(counts.processed).toBe(1);
    expect(counts.offers).toBe(1);
  });

  test('recovery reduces fatigue values', () => {
    advanceTime(2);
    expect(state.player.fatigueShort).toBeCloseTo(5, 5);
    expect(state.player.fatigueChronic).toBeCloseTo(1.5, 5);
  });

  test('daily costs reduce cash by staff daily', () => {
    const staffDaily = (1 * 120 + 1 * 100) / 7;
    advanceTime(2);
    expect(state.cash).toBeCloseTo(100 - staffDaily, 5);
  });
});

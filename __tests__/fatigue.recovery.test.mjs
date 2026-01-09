/** @jest-environment jsdom */

import { advanceTime, useConsumable } from '../helpers.js';
import * as stateMod from '../state.js';

describe('fatigue recovery and consumables', () => {
  beforeEach(() => {
    // reset player
    stateMod.state.player.fatigueShort = 10;
    stateMod.state.player.fatigueChronic = 5;
    stateMod.updateFatigueDerived();
  });

  test('advanceTime (next day) reduces short fatigue and chronic decays slowly', () => {
    // simulate passing enough hours to move to next day
    stateMod.state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    advanceTime(8); // advances one day
    // with 50% percentage recovery, 10 -> 5
    expect(stateMod.state.player.fatigueShort).toBeCloseTo(5);
    expect(stateMod.state.player.fatigueChronic).toBeCloseTo(4.5);
  });

  test('using coffee reduces short-term fatigue immediately', () => {
    const had = stateMod.state.player.fatigueShort;
    // put a coffee into inventory so useConsumable can remove it
    stateMod.state.inventory.set('coffee', 1);
    const ok = useConsumable('coffee');
    expect(ok).toBe(true);
    expect(stateMod.state.player.fatigueShort).toBe(Math.max(0, had - 2));
  });
});

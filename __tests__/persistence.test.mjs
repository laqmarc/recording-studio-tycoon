/** @jest-environment jsdom */

import { saveState, loadStateFromStorage, loadFromObject, clearPersistenceAndReset } from '../persistence.js';

describe('persistence', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    localStorage.clear();
    state.db = { items: [], rooms: [], contracts: [], people: [] };
    state.inventory = new Map();
    state.roomsInstalled = [];
    state.roomBilling = [];
    state.finance = { weeklyExpenses: 0, monthlyExpenses: 0 };
    state.itemCondition = new Map();
  });

  test('saveState and loadStateFromStorage round-trip', () => {
    state.cash = 777;
    state.player = { level: 3, xp: 20, fatigue: 1 };
    state.time = { day: 2, hour: 4, workHoursPerDay: 8 };
    state.inventory.set('i1', 2);
    state.itemCondition.set('i1', 90);
    state.market = { offers: [], lastDayGenerated: 2 };
    saveState();

    state.cash = 0;
    state.player.level = 1;
    state.inventory.clear();
    state.itemCondition.clear();

    const ok = loadStateFromStorage();
    expect(ok).toBe(true);
    expect(state.cash).toBe(777);
    expect(state.player.level).toBe(3);
    expect(state.inventory.get('i1')).toBe(2);
    expect(state.itemCondition.get('i1')).toBe(90);
  });

  test('loadFromObject seeds db and indices', () => {
    const data = {
      items: [{ id: 'i1', name: 'Item', category: 'mic', price: 10 }],
      rooms: [{ id: 'r1', name: 'Room', type: 'control_room', slots: { mic: 1 } }],
      contracts: [{ id: 'c1', name: 'Mix', duration_hours: 2, worked_hours: 0 }],
      people: [{ id: 'p1', name: 'Mia', role: 'musician', unlock_level: 1 }]
    };
    loadFromObject(data);
    expect(state.db.items.length).toBe(1);
    expect(state.itemsById.get('i1')).toBeTruthy();
    expect(state.db.rooms.length).toBe(1);
    expect(state.roomsInstalled.length).toBe(1);
    expect(state.db.people.length).toBe(1);
  });

  test('clearPersistenceAndReset resets state and storage', () => {
    state.cash = 500;
    saveState();
    clearPersistenceAndReset();
    expect(localStorage.getItem('studio_tycoon_state_v1')).toBeNull();
    expect(state.cash).toBe(1000);
    expect(state.inventory.size).toBe(0);
  });
});

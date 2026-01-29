import { state } from '../state.js';
import { saveState, loadStateFromStorage } from '../persistence.js';

describe('persistence talent metadata', () => {
  beforeEach(() => {
    state.db.contracts = [
      {
        id: 'c1',
        name: 'Podcast Series',
        client_names: ['Alex Serra', 'Nora Vidal'],
        talent_note: 'Banda client · només cal engineer',
        requirements: { room_type: 'podcast_studio' }
      }
    ];
    state.db.items = [];
    state.db.rooms = [];
    state.db.people = [];
    state.inventory = new Map();
    state.roomsInstalled = [];
    state.roomBilling = [];
    state.roomMaintenance = [];
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };

    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; }
    };
  });

  test('save/load keeps client_names and talent_note', () => {
    saveState();
    state.db.contracts[0].client_names = [];
    state.db.contracts[0].talent_note = null;

    const loaded = loadStateFromStorage();
    expect(loaded).toBe(true);
    const c = state.db.contracts[0];
    expect(c.client_names).toEqual(['Alex Serra', 'Nora Vidal']);
    expect(c.talent_note).toBe('Banda client · només cal engineer');
  });
});

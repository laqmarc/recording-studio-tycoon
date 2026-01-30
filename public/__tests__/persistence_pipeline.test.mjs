import { state } from '../state.js';
import { saveState, loadStateFromStorage } from '../persistence.js';

describe('persistence pipeline', () => {
  beforeEach(() => {
    state.db.contracts = [
      {
        id: 'c1',
        name: 'Pipeline',
        pipeline: true,
        stages: [
          { label: 'Gravacio', type: 'recording', room_type: 'live_room', duration_hours: 2, requirements: { room_type: 'live_room' } },
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
        ],
        stage_index: 1,
        stage_label: 'Edicio',
        pipeline_total_hours: 3,
        stage_room_type: 'edit_room',
        duration_hours: 1,
        type: 'edit',
        requirements: { room_type: 'edit_room' },
        worked_hours: 0,
        completed: false
      }
    ];
    state.db.items = [];
    state.db.rooms = [];
    state.db.people = [];
    state.inventory = new Map();
    state.roomBilling = [];
    state.roomsInstalled = [];
    state.roomMaintenance = [];
    state.analytics = { revenueByDay: {}, expenseByDay: {}, sessions: [], daily: [] };

    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; }
    };
  });

  test('save/load keeps pipeline metadata', () => {
    saveState();
    // clear fields
    state.db.contracts[0].pipeline = false;
    state.db.contracts[0].stages = [];
    state.db.contracts[0].stage_index = 0;
    state.db.contracts[0].stage_label = null;
    state.db.contracts[0].requirements = {};

    const loaded = loadStateFromStorage();
    expect(loaded).toBe(true);
    const c = state.db.contracts[0];
    expect(c.pipeline).toBe(true);
    expect(Array.isArray(c.stages)).toBe(true);
    expect(c.stage_index).toBe(1);
    expect(c.stage_label).toBe('Edicio');
    expect(c.requirements && c.requirements.room_type).toBe('edit_room');
  });
});

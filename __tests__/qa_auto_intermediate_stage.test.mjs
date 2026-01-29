import { applyScheduledWork } from '../esm/actions.mjs';
import { state } from '../state.js';

describe('QA auto on intermediate stage', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', type: 'live_room' },
      { id: 'r2', type: 'edit_room' }
    ];
    state.itemsById = new Map();
    state.roomsInstalled = [{}, {}];
    state.player = { level: 10, fatigueShort: 0, fatigueChronic: 0 };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [{ contractId: 'c1', roomIndex: 0, day: 1, hours: 2 }];
    state.selected = { roomIndex: 0 };
    state.ui = { autoQa: true };

    state.db.contracts = [
      {
        id: 'c1',
        name: 'Pipeline',
        pipeline: true,
        stages: [
          { label: 'Gravacio', type: 'recording', room_type: 'live_room', duration_hours: 2, requirements: { room_type: 'live_room' } },
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
        ],
        stage_index: 0,
        stage_label: 'Gravacio',
        type: 'recording',
        duration_hours: 2,
        worked_hours: 0,
        requirements: { room_type: 'live_room' },
        completed: false
      }
    ];

    window.state = state;
    window.simulateContract = () => true;
    window.assignContractPeople = () => {};
    window.applyItemWear = () => {};
    window.renderAll = () => {};
    window.saveState = () => {};
    window.showNotification = () => {};
    window.installedIds = () => [];
    window.log = () => {};
  });

  test('does not set QA on stage advance', () => {
    applyScheduledWork('c1', 2, 0, 1);
    const c = state.db.contracts[0];
    expect(c.completed).toBe(false);
    expect(c.qa_done).toBeUndefined();
  });
});

import { state } from '../state.js';
import { workOnContract } from '../esm/actions.mjs';

describe('QA auto on final stage', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'control_room' }];
    state.itemsById = new Map();
    state.roomsInstalled = [{}];
    state.player = { level: 10, fatigueShort: 0, fatigueChronic: 0 };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [{ contractId: 'c1', roomIndex: 0, day: 1, hours: 1 }];
    state.selected = { roomIndex: 0 };
    state.ui = { autoQa: true };

    state.db.contracts = [
      {
        id: 'c1',
        name: 'Final Stage',
        pipeline: true,
        stages: [
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } },
          { label: 'Mescla', type: 'mix', room_type: 'control_room', duration_hours: 1, requirements: { room_type: 'control_room' } }
        ],
        stage_index: 1,
        stage_label: 'Mescla',
        type: 'mix',
        duration_hours: 1,
        worked_hours: 0,
        requirements: { room_type: 'control_room' },
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
    window.addXp = () => {};
  });

  test('auto QA marks contract on completion', () => {
    workOnContract('c1', 1);
    const c = state.db.contracts[0];
    expect(c.completed).toBe(true);
    expect(c.qa_done).toBe(true);
    expect(c.qa_bonus).toBeGreaterThanOrEqual(4);
  });
});

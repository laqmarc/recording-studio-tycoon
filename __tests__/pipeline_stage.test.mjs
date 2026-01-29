import { state } from '../state.js';
import { applyScheduledWork } from '../esm/actions.mjs';

describe('pipeline stages', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', name: 'Live Room', type: 'live_room', unlock_level: 1 },
      { id: 'r2', name: 'Edit Room', type: 'edit_room', unlock_level: 1 }
    ];
    state.db.contracts = [];
    state.player = { level: 10 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.schedule = [];
    state.analytics = { completedContracts: 0, completedSpecialContracts: 0 };

    window.state = state;
    window.simulateContract = () => true;
    window.checkContractRequirements = () => true;
    window.assignContractPeople = () => {};
    window.applyItemWear = () => {};
    window.renderAll = () => {};
    window.saveState = () => {};
    window.showNotification = () => {};
    window.log = () => {};
  });

  test('advances to next stage without completing', () => {
    const contract = {
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
      completed: false
    };
    state.db.contracts.push(contract);
    state.schedule = [{ contractId: 'c1', roomIndex: 0, day: 1, hours: 2 }];

    const result = applyScheduledWork('c1', 2, 0, 1);

    expect(contract.stage_index).toBe(1);
    expect(contract.type).toBe('edit');
    expect(contract.duration_hours).toBe(1);
    expect(contract.worked_hours).toBe(0);
    expect(contract.completed).toBe(false);
    expect(contract.requirements && contract.requirements.room_type).toBe('edit_room');
    expect(state.schedule.length).toBe(0);
    expect(result).toEqual(expect.objectContaining({ stageAdvanced: true, completed: false }));
  });

  test('final stage completes contract', () => {
    const contract = {
      id: 'c2',
      name: 'Pipeline',
      pipeline: true,
      stages: [
        { label: 'Gravacio', type: 'recording', room_type: 'live_room', duration_hours: 2, requirements: { room_type: 'live_room' } },
        { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
      ],
      stage_index: 1,
      stage_label: 'Edicio',
      type: 'edit',
      duration_hours: 1,
      worked_hours: 0,
      completed: false
    };
    state.db.contracts.push(contract);

    const result = applyScheduledWork('c2', 1, 1, 2);

    expect(contract.completed).toBe(true);
    expect(result).toEqual(expect.objectContaining({ completed: true }));
  });
});

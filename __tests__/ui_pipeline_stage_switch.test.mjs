import { applyScheduledWork } from '../esm/actions.mjs';
import { renderRooms } from '../ui/rooms.js';
import { state } from '../state.js';

describe('ui pipeline stage switch', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="roomList"></div><div id="roomsMeta"></div><div id="leftContracts"></div><div id="contractsMeta"></div>';
    state.db.rooms = [
      { id: 'r1', name: 'Sala A', type: 'live_room', unlock_level: 1 },
      { id: 'r2', name: "Sala d'Edicio", type: 'edit_room', unlock_level: 1 }
    ];
    state.player = { level: 10 };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [{ contractId: 'c1', roomIndex: 0, day: 1, hours: 2 }];
    state.selected = { roomIndex: 0 };
    state.analytics = { completedContracts: 0, completedSpecialContracts: 0 };

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
    window.checkContractRequirements = () => true;
    window.assignContractPeople = () => {};
    window.applyItemWear = () => {};
    window.renderAll = () => {};
    window.saveState = () => {};
    window.showNotification = () => {};
    window.log = () => {};
  });

  test('after stage advance, UI shows new stage', () => {
    applyScheduledWork('c1', 2, 0, 1);
    state.selected.roomIndex = 1;
    renderRooms();
    const text = document.body.textContent;
    expect(text).toMatch(/Etapa Edicio/);
  });
});

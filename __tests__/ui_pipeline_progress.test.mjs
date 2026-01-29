import { renderRooms } from '../ui/rooms.js';
import { state } from '../state.js';

describe('ui pipeline progress', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="roomList"></div><div id="roomsMeta"></div><div id="leftContracts"></div><div id="contractsMeta"></div>';
    state.db.rooms = [
      { id: 'r1', name: 'Sala A', type: 'live_room', unlock_level: 1 }
    ];
    state.player = { level: 10 };
    state.selected = { roomIndex: 0 };
    state.schedule = [];

    state.db.contracts = [
      {
        id: 'c1',
        name: 'Full Production',
        type: 'recording',
        pipeline: true,
        stages: [
          { label: 'Gravacio', type: 'recording', room_type: 'live_room', duration_hours: 2, requirements: { room_type: 'live_room' } },
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
        ],
        stage_index: 0,
        stage_label: 'Gravacio',
        duration_hours: 2,
        worked_hours: 0,
        requirements: { room_type: 'live_room' },
        completed: false
      }
    ];
  });

  test('renders process line with stages and marker', () => {
    renderRooms();
    const text = document.body.textContent;
    expect(text).toMatch(/Proces:/);
    expect(text).toMatch(/Gravacio/);
    expect(text).toMatch(/Edicio/);
  });
});

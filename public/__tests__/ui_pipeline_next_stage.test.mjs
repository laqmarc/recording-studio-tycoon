import { renderRooms } from '../ui/rooms.js';
import { state } from '../state.js';

describe('ui pipeline next stage', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="roomList"></div><div id="roomsMeta"></div><div id="leftContracts"></div><div id="contractsMeta"></div>';
    state.db.rooms = [
      { id: 'r1', name: 'Sala A', type: 'podcast_studio', unlock_level: 1 },
      { id: 'r2', name: "Sala d'Edicio", type: 'edit_room', unlock_level: 1 }
    ];
    state.player = { level: 10 };
    state.schedule = [];
    state.selected = { roomIndex: 0 };
    state.db.contracts = [
      {
        id: 'c1',
        name: 'Podcast Series',
        pipeline: true,
        stages: [
          { label: 'Gravacio', type: 'recording', room_type: 'podcast_studio', duration_hours: 2, requirements: { room_type: 'podcast_studio' } },
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
        ],
        stage_index: 0,
        stage_label: 'Gravacio',
        duration_hours: 2,
        worked_hours: 0,
        requirements: { room_type: 'podcast_studio' },
        type: 'recording',
        completed: false
      }
    ];
  });

  test('shows next stage info with room', () => {
    renderRooms();
    const text = document.body.textContent;
    expect(text).toMatch(/Seguent etapa/);
    expect(text).toMatch(/Sala d'Edicio/);
  });
});

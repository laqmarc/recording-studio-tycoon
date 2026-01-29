import { renderRooms } from '../ui/rooms.js';
import { state } from '../state.js';

describe('ui talent display', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="roomList"></div><div id="roomsMeta"></div><div id="leftContracts"></div><div id="contractsMeta"></div>';
    state.db.rooms = [
      { id: 'r1', name: 'Estudi Podcast', type: 'podcast_studio', unlock_level: 1 }
    ];
    state.roomsInstalled = [ { mic: ['m1'] } ];
    state.itemsById = new Map();
    state.player = { level: 10 };
    state.selected = { roomIndex: 0 };
    state.schedule = [];
    state.market = { offers: [], lastDayGenerated: 0 };

    state.db.contracts = [
      {
        id: 'c1',
        name: 'Podcast Series',
        type: 'recording',
        requirements: { room_type: 'podcast_studio' },
        duration_hours: 3,
        worked_hours: 0,
        completed: false,
        pipeline: true,
        stages: [
          { label: 'Gravacio', type: 'recording', room_type: 'podcast_studio', duration_hours: 2, requirements: { room_type: 'podcast_studio' } },
          { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
        ],
        stage_index: 0,
        stage_label: 'Gravacio',
        client_names: ['Alex Serra', 'Nora Vidal'],
        talent_note: 'Banda client · només cal engineer'
      }
    ];
  });

  test('renders client names and talent note', () => {
    renderRooms();
    const text = document.body.textContent;
    expect(text).toMatch(/Clients:/);
    expect(text).toMatch(/Alex Serra/);
    expect(text).toMatch(/Nora Vidal/);
    expect(text).toMatch(/només cal engineer/i);
  });
});

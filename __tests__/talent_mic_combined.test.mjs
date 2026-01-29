import { buildRoleDefs } from '../ui/people_logic.js';
import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('talent + mic requirements', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'live_room' }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', category: 'mic', type: ['vocals'] }],
      ['mic2', { id: 'mic2', category: 'mic', type: ['guitarra'] }]
    ]);
    state.roomsInstalled = [{ mic: ['mic1', 'mic2'], mic_stand: ['s1', 's2'] }];
  });

  test('studio_musicians requires musicians and mic coverage', () => {
    const contract = {
      type: 'recording',
      genre: 'rock',
      talent_mode: 'studio_musicians',
      requirements: {
        room_type: 'live_room',
        min_items: { mic: 2 },
        mic_types: ['vocals', 'guitarra']
      }
    };
    const roles = buildRoleDefs(contract);
    expect(roles.some(r => r.role === 'musician')).toBe(true);
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });
});

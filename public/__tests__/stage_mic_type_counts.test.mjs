import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('stage mic type counts', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'live_room' }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', category: 'mic', type: ['vocals'] }],
      ['mic2', { id: 'mic2', category: 'mic', type: ['guitarra'] }],
      ['mic3', { id: 'mic3', category: 'mic', type: ['vocals'] }]
    ]);
    state.roomsInstalled = [{ mic: ['mic1', 'mic2', 'mic3'], mic_stand: ['s1', 's2', 's3'] }];
  });

  test('passes when mic_type_counts are satisfied', () => {
    const contract = {
      requirements: {
        room_type: 'live_room',
        min_items: { mic: 3 },
        mic_type_counts: { vocals: 2, guitarra: 1 }
      }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });

  test('fails when mic_type_counts are missing', () => {
    state.roomsInstalled = [{ mic: ['mic1', 'mic2'], mic_stand: ['s1', 's2'] }];
    const contract = {
      requirements: {
        room_type: 'live_room',
        min_items: { mic: 3 },
        mic_type_counts: { vocals: 2, guitarra: 1 }
      }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(false);
  });
});

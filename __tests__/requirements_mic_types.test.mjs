import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('requirements mic type counts', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'live_room' }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', category: 'mic', type: ['vocals'] }],
      ['mic2', { id: 'mic2', category: 'mic', type: ['guitarra'] }]
    ]);
    state.roomsInstalled = [{ mic: ['mic1', 'mic2'], mic_stand: ['s1', 's2'] }];
  });

  test('passes when required mic types are covered', () => {
    const contract = {
      requirements: {
        room_type: 'live_room',
        min_items: { mic: 2 },
        mic_types: ['vocals', 'guitarra']
      }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });

  test('fails when missing a required mic type', () => {
    state.roomsInstalled = [{ mic: ['mic1'], mic_stand: ['s1'] }];
    const contract = {
      requirements: {
        room_type: 'live_room',
        min_items: { mic: 2 },
        mic_types: ['vocals', 'guitarra']
      }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(false);
  });
});

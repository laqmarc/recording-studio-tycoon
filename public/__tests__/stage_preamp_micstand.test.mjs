import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('stage preamp and mic_stand requirements', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'vocal_booth' }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', category: 'mic', type: ['vocals'] }],
      ['pre1', { id: 'pre1', category: 'preamp' }]
    ]);
    state.roomsInstalled = [{ mic: ['mic1'], preamp: ['pre1'], mic_stand: [] }];
  });

  test('fails when missing mic stand', () => {
    const contract = {
      requirements: { room_type: 'vocal_booth', min_items: { mic: 1, preamp: 1 } }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(false);
  });

  test('passes when mic stand is present', () => {
    state.roomsInstalled = [{ mic: ['mic1'], preamp: ['pre1'], mic_stand: ['s1'] }];
    const contract = {
      requirements: { room_type: 'vocal_booth', min_items: { mic: 1, preamp: 1 } }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });
});

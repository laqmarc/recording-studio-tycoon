import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('stage requirements validation', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'edit_room', name: "Sala d'Edicio" }];
    state.roomsInstalled = [{ monitor: ['m1'] }];
    state.itemsById = new Map([
      ['m1', { id: 'm1', category: 'monitor' }]
    ]);
  });

  test('requires correct room type for stage', () => {
    const contract = {
      requirements: { room_type: 'edit_room', min_items: { monitor: 1 } }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });
});

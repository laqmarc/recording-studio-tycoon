import { checkContractRequirements } from '../helpers.js';
import { state } from '../state.js';

describe('stage min_interface_inputs', () => {
  beforeEach(() => {
    state.db.rooms = [{ id: 'r1', type: 'control_room' }];
    state.itemsById = new Map([
      ['int1', { id: 'int1', category: 'interface', io: { inputs_total: 2 }, stats: { inputs: 2 } }],
      ['int2', { id: 'int2', category: 'interface', io: { inputs_total: 6 }, stats: { inputs: 6 } }]
    ]);
    state.roomsInstalled = [{ interface: ['int1'] }];
  });

  test('fails when interface inputs are insufficient', () => {
    const contract = {
      requirements: { room_type: 'control_room', min_interface_inputs: 4 }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(false);
  });

  test('passes when interface inputs are enough', () => {
    state.roomsInstalled = [{ interface: ['int2'] }];
    const contract = {
      requirements: { room_type: 'control_room', min_interface_inputs: 4 }
    };
    const ok = checkContractRequirements(contract, 0);
    expect(ok).toBe(true);
  });
});

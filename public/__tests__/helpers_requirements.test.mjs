import { checkContractRequirements } from '../helpers.js';

describe('helpers checkContractRequirements', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db.rooms = [{ id: 'r1', type: 'control_room' }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', type: ['vocals'] }],
      ['iface1', { id: 'iface1', stats: { inputs: 2 } }],
      ['stand1', { id: 'stand1' }]
    ]);
    window.installedIds = (roomIndex, cat) => {
      if (cat === 'mic') return ['mic1'];
      if (cat === 'interface') return ['iface1'];
      if (cat === 'mic_stand') return ['stand1'];
      return [];
    };
  });

  test('fails when room type mismatch', () => {
    const contract = { requirements: { room_type: 'live_room' } };
    expect(checkContractRequirements(contract, 0)).toBe(false);
  });

  test('fails when mic type missing', () => {
    const contract = { requirements: { mic_types: ['guitarra'] } };
    expect(checkContractRequirements(contract, 0)).toBe(false);
  });

  test('fails when interface inputs too low', () => {
    const contract = { requirements: { min_interface_inputs: 3 } };
    expect(checkContractRequirements(contract, 0)).toBe(false);
  });

  test('fails when mic stands fewer than mics', () => {
    window.installedIds = (roomIndex, cat) => {
      if (cat === 'mic') return ['mic1', 'mic2'];
      if (cat === 'mic_stand') return ['stand1'];
      return [];
    };
    const contract = { requirements: {} };
    expect(checkContractRequirements(contract, 0)).toBe(false);
  });

  test('passes when requirements met', () => {
    const contract = { requirements: { room_type: 'control_room', mic_types: ['vocals'], min_interface_inputs: 1 } };
    expect(checkContractRequirements(contract, 0)).toBe(true);
  });
});

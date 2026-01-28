import { state, rebuildIndexes, ensureRoomsInstalled, installedIds, getRoomEffective, getRoomSlotCapacity, installToRoom, uninstallFromRoom, uninstallItemFromRoom } from '../state.js';

describe('state core', () => {
  beforeEach(() => {
    state.db = { items: [], rooms: [], contracts: [], people: [] };
    state.itemsById.clear();
    state.itemsByCategory.clear();
    state.roomsInstalled = [];
    state.roomBilling = [];
    state.roomUpgrades = {};
  });

  test('rebuildIndexes sorts items by price', () => {
    state.db.items = [
      { id: 'b', name: 'B', category: 'mic', price: 200 },
      { id: 'a', name: 'A', category: 'mic', price: 100 }
    ];
    rebuildIndexes();
    const items = state.itemsByCategory.get('mic');
    expect(items[0].id).toBe('a');
    expect(items[1].id).toBe('b');
  });

  test('ensureRoomsInstalled initializes rooms and upgrades', () => {
    state.db.rooms = [
      { id: 'r1', slots: { mic: 1 } },
      { id: 'r2', slots: { mic: 2 } }
    ];
    ensureRoomsInstalled();
    expect(state.roomsInstalled.length).toBe(2);
    expect(state.roomBilling.length).toBe(2);
    expect(state.roomUpgrades[0]).toBeTruthy();
  });

  test('installToRoom adds item and marks justInstalled', () => {
    state.db.rooms = [{ id: 'r1', slots: { mic: 1 } }];
    ensureRoomsInstalled();
    const res = installToRoom(0, 'mic', 'm1');
    expect(res.ok).toBe(true);
    expect(installedIds(0, 'mic')).toEqual(['m1']);
    expect(state.roomBilling[0].justInstalled).toBe(true);
  });

  test('uninstallFromRoom removes last item', () => {
    state.db.rooms = [{ id: 'r1', slots: { mic: 1 } }];
    ensureRoomsInstalled();
    installToRoom(0, 'mic', 'm1');
    const res = uninstallFromRoom(0, 'mic');
    expect(res.ok).toBe(true);
    expect(res.removed).toBe('m1');
    expect(installedIds(0, 'mic').length).toBe(0);
  });

  test('uninstallItemFromRoom removes specific item', () => {
    state.db.rooms = [{ id: 'r1', slots: { mic: 2 } }];
    ensureRoomsInstalled();
    installToRoom(0, 'mic', 'm1');
    installToRoom(0, 'mic', 'm2');
    const res = uninstallItemFromRoom(0, 'mic', 'm1');
    expect(res.ok).toBe(true);
    expect(installedIds(0, 'mic')).toEqual(['m2']);
  });

  test('getRoomEffective applies upgrades', () => {
    state.db.rooms = [{ id: 'r1', base_acoustic: 40, noise_floor_db: -60, slots: { mic: 1 } }];
    ensureRoomsInstalled();
    state.roomUpgrades[0] = { acoustic: 1, isolation: 1, slots: 1 };
    const eff = getRoomEffective(0);
    expect(eff.base_acoustic).toBe(45);
    expect(eff.noise_floor_db).toBe(-62);
    expect(eff.slots.mic).toBe(2);
  });

  test('getRoomSlotCapacity returns slot count', () => {
    state.db.rooms = [{ id: 'r1', slots: { mic: 3 } }];
    ensureRoomsInstalled();
    expect(getRoomSlotCapacity(0, 'mic')).toBe(3);
  });
});

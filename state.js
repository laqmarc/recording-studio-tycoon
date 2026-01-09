// state.js - global state and data (now an ES module with window compatibility)
export const state = {
  cash: 1000,
  db: { items: [], rooms: [], contracts: [] },
  itemsById: new Map(),
  itemsByCategory: new Map(),
  inventory: new Map(), // id -> qty
  selected: { roomIndex: 0, shopItemId: null },
  roomsInstalled: [], // per room: { category -> [itemId,...] }
  player: { level: 1, xp: 0, fatigue: 0 }
};
// time state (days/hours)
state.time = { day: 1, hour: 0, workHoursPerDay: 8 };

export function rebuildIndexes() {
  state.itemsById.clear();
  state.itemsByCategory.clear();
  for (const it of state.db.items) {
    state.itemsById.set(it.id, it);
    const cat = it.category || "misc";
    if (!state.itemsByCategory.has(cat)) state.itemsByCategory.set(cat, []);
    state.itemsByCategory.get(cat).push(it);
  }
  for (const [cat, arr] of state.itemsByCategory.entries()) {
    arr.sort((a,b)=>(Number(a.price||0)-Number(b.price||0)));
  }
}
export function ensureRoomsInstalled() {
  state.roomsInstalled = state.db.rooms.map(()=> ({}));
}
export function installedIds(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex] || {};
  return bag[category] || [];
}
export function installToRoom(roomIndex, category, itemId) {
  const room = state.db.rooms[roomIndex];
  const slots = room.slots || {};
  const max = Number(slots[category] || 0);
  const bag = state.roomsInstalled[roomIndex];
  bag[category] = bag[category] || [];
  if (bag[category].length >= max) return { ok:false, reason:`No hi ha slots de ${category} (max ${max})` };
  bag[category].push(itemId);
  return { ok:true };
}
export function uninstallFromRoom(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex];
  if (!bag[category] || !bag[category].length) return { ok:false, reason:"No hi ha res instal·lat" };
  const removed = bag[category].pop();
  return { ok:true, removed };
}

// Expose for legacy scripts that rely on globals
if (typeof window !== 'undefined') {
  window.state = state;
  window.rebuildIndexes = rebuildIndexes;
  window.ensureRoomsInstalled = ensureRoomsInstalled;
  window.installedIds = installedIds;
  window.installToRoom = installToRoom;
  window.uninstallFromRoom = uninstallFromRoom;
}

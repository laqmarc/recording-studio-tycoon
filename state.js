// state.js - global state and data (now an ES module with window compatibility)
export const state = {
  cash: 1000,
  db: { items: [], rooms: [], contracts: [] },
  finance: { weeklyExpenses: 0 },
  itemsById: new Map(),
  itemsByCategory: new Map(),
  inventory: new Map(), // id -> qty
  selected: { roomIndex: 0, shopItemId: null },
  ui: { page: "rooms" },
  roomsInstalled: [], // per room: { category -> [itemId,...] }
  // billing info per room: { lastBilledDay: number|null }
  roomBilling: [],
  // Player state: track short-term and chronic fatigue separately.
  player: { level: 1, xp: 0, fatigue: 0, fatigueShort: 0, fatigueChronic: 0, restBonus: 0 }
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
  // initialize billing info array in parallel with roomsInstalled
  state.roomBilling = state.db.rooms.map(()=> ({ lastBilledDay: null, weeksBilled: 0, totalCharged: 0, justInstalled: false }));
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
  const wasEmpty = Object.values(bag).every(arr => !Array.isArray(arr) || arr.length === 0);
  bag[category].push(itemId);
  // If this was the first installation in the room, mark for immediate weekly billing
  try {
    if (wasEmpty) {
      // ensure billing array exists
      state.roomBilling = state.roomBilling || state.db.rooms.map(()=>({ lastBilledDay: null }));
      // set last billed day to current day so helpers can bill now if desired
      state.roomBilling[roomIndex] = state.roomBilling[roomIndex] || { lastBilledDay: null };
      // indicate that room has been newly installed; actual cash change handled by helpers to avoid circular imports
      state.roomBilling[roomIndex].justInstalled = true;
    }
  } catch (e) {}
  return { ok:true };
}
export function uninstallFromRoom(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex];
  if (!bag[category] || !bag[category].length) return { ok:false, reason:"No hi ha res instal·lat" };
  const removed = bag[category].pop();
  // If room becomes empty, clear billing marker (future charges stop)
  try {
    const stillHas = Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
    if (!stillHas && state.roomBilling && state.roomBilling[roomIndex]) {
      state.roomBilling[roomIndex].lastBilledDay = state.roomBilling[roomIndex].lastBilledDay || null;
    }
  } catch (e) {}
  return { ok:true, removed };
}

// Recalculate the compatible `player.fatigue` field from short/chronic components.
export function updateFatigueDerived() {
  if (!state.player) return;
  const chronicWeight = 0.5; // chronic contributes partially to immediate fatigue
  state.player.fatigue = (Number(state.player.fatigueShort || 0) + chronicWeight * Number(state.player.fatigueChronic || 0));
}

// Expose for legacy scripts that rely on globals
if (typeof window !== 'undefined') {
  window.state = state;
  window.rebuildIndexes = rebuildIndexes;
  window.ensureRoomsInstalled = ensureRoomsInstalled;
  window.installedIds = installedIds;
  window.installToRoom = installToRoom;
  window.uninstallFromRoom = uninstallFromRoom;
  window.updateFatigueDerived = updateFatigueDerived;
}

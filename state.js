// state.js - global state and data (now an ES module with window compatibility)
export const state = {
  cash: 1000,
  db: { items: [], rooms: [], contracts: [], people: [] },
  finance: { weeklyExpenses: 0 },
  itemsById: new Map(),
  itemsByCategory: new Map(),
  inventory: new Map(), // id -> qty
  selected: { roomIndex: 0, shopItemId: null },
  ui: { page: "rooms", roomLayout: {}, showSignalFlow: false, ambient: { enabled: false, volume: 0.2 } },
  staff: { engineer: { level: 1 }, producer: { level: 1 } },
  reputation: { overall: 0, byGenre: {} },
  roomUpgrades: {},
  itemCondition: new Map(),
  market: { offers: [], lastDayGenerated: 0 },
  schedule: [],
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
  state.roomUpgrades = state.roomUpgrades || {};
  state.db.rooms.forEach((r, idx) => {
    state.roomUpgrades[idx] = state.roomUpgrades[idx] || { acoustic: 0, isolation: 0, slots: 0 };
  });
}
export function installedIds(roomIndex, category) {
  const bag = state.roomsInstalled[roomIndex] || {};
  return bag[category] || [];
}
function ensureRoomBase(room) {
  if (!room) return;
  if (room._base_acoustic == null) room._base_acoustic = room.base_acoustic || 0;
  if (room._base_noise == null) room._base_noise = room.noise_floor_db || -60;
  if (!room._base_slots) room._base_slots = Object.assign({}, room.slots || {});
}

export function getRoomEffective(roomIndex) {
  const room = state.db.rooms[roomIndex];
  if (!room) return { room: null, slots: {}, base_acoustic: 0, noise_floor_db: -60 };
  ensureRoomBase(room);
  const upgrades = (state.roomUpgrades && state.roomUpgrades[roomIndex]) || { acoustic: 0, isolation: 0, slots: 0 };
  const base_acoustic = Number(room._base_acoustic || 0) + Number(upgrades.acoustic || 0) * 5;
  const noise_floor_db = Number(room._base_noise || -60) - Number(upgrades.isolation || 0) * 2;
  const slots = Object.assign({}, room._base_slots || room.slots || {});
  const slotBonus = Number(upgrades.slots || 0);
  if (slotBonus > 0) {
    for (const key of Object.keys(slots)) slots[key] = Number(slots[key] || 0) + slotBonus;
  }
  return { room, slots, base_acoustic, noise_floor_db };
}

export function getRoomSlotCapacity(roomIndex, category) {
  const eff = getRoomEffective(roomIndex);
  return Number((eff.slots && eff.slots[category]) || 0);
}
export function installToRoom(roomIndex, category, itemId) {
  const room = state.db.rooms[roomIndex];
  const max = getRoomSlotCapacity(roomIndex, category);
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

export function uninstallItemFromRoom(roomIndex, category, itemId) {
  const bag = state.roomsInstalled[roomIndex];
  if (!bag[category] || !bag[category].length) return { ok:false, reason:"No hi ha res instal·lat" };
  const idx = bag[category].indexOf(itemId);
  if (idx === -1) return { ok:false, reason:"Item no trobat" };
  const removed = bag[category].splice(idx, 1)[0];
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
  window.getRoomEffective = getRoomEffective;
  window.getRoomSlotCapacity = getRoomSlotCapacity;
  window.installToRoom = installToRoom;
  window.uninstallFromRoom = uninstallFromRoom;
  window.uninstallItemFromRoom = uninstallItemFromRoom;
  window.updateFatigueDerived = updateFatigueDerived;
}

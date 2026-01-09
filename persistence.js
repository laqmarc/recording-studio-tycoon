// persistence.js - save/load functions (ES module)
import { state, rebuildIndexes, ensureRoomsInstalled } from './state.js';
import { log } from './helpers.js';

export function saveState() {
  try {
    const payload = {
      player: state.player,
      time: state.time,
      cash: state.cash,
      inventory: Array.from(state.inventory.entries()),
      roomsInstalled: state.roomsInstalled,
      contractsProgress: state.db.contracts.map(c => ({ id: c.id, worked_hours: c.worked_hours || 0, completed: !!c.completed, completed_at: c.completed_at || null }))
    };
    localStorage.setItem('studio_tycoon_state_v1', JSON.stringify(payload));
    log('💾 Estat guardat');
  } catch (e) {
    log('❌ Error guardant estat: ' + e.message);
  }
}

function ensurePlayerDefaults() {
  if (!state.player) state.player = { level:1, xp:0, fatigue:0 };
  if (typeof state.player.fatigue !== 'number') state.player.fatigue = 0;
  if (typeof state.player.level !== 'number') state.player.level = 1;
  if (typeof state.player.xp !== 'number') state.player.xp = 0;
}

export function loadStateFromStorage() {
  try {
    const txt = localStorage.getItem('studio_tycoon_state_v1');
    if (!txt) return false;
    const p = JSON.parse(txt);
    if (p.player) {
      state.player = p.player;
    }
    ensurePlayerDefaults();
    if (p.time) state.time = p.time;
    if (typeof p.cash === 'number') state.cash = p.cash;
    if (Array.isArray(p.inventory)) {
      state.inventory.clear();
      for (const [id, qty] of p.inventory) state.inventory.set(id, qty);
    }
    if (Array.isArray(p.roomsInstalled) && p.roomsInstalled.length === state.db.rooms.length) {
      state.roomsInstalled = p.roomsInstalled;
    }
    if (Array.isArray(p.contractsProgress)) {
      for (const cp of p.contractsProgress) {
        const c = state.db.contracts.find(x => x.id === cp.id);
        if (c) {
          c.worked_hours = cp.worked_hours || 0;
          c.completed = !!cp.completed;
          c.completed_at = cp.completed_at || null;
        }
      }
    }
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    log('📥 Estat carregat des de localStorage');
    return true;
  } catch (e) {
    log('❌ Error carregant estat: ' + e.message);
    return false;
  }
}

export function clearPersistenceAndReset() {
  try {
    localStorage.removeItem('studio_tycoon_state_v1');
    state.player = { level: 1, xp: 0, fatigue: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: state.time.workHoursPerDay || 8 };
    state.cash = 1000;
    state.inventory.clear();
    ensureRoomsInstalled();
    for (const c of state.db.contracts) {
      c.worked_hours = 0;
      c.completed = false;
      c.completed_at = null;
    }
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    log('♻️ Persistència esborrada i progrés reiniciat.');
  } catch (e) {
    log('❌ Error esborrant persistència: ' + e.message);
  }
}

export function loadFromObject(obj) {
  const items = obj.items || [];
  const rooms = obj.rooms || [];
  const contracts = obj.contracts || [];

  state.db = { items, rooms, contracts };
  rebuildIndexes();
  for (const c of state.db.contracts) {
    if (c.worked_hours == null) c.worked_hours = 0;
    if (c.completed == null) c.completed = false;
  }
  ensureRoomsInstalled();
  state.selected.roomIndex = 0;
  state.selected.shopItemId = items.length ? items[0].id : null;
  log(`📦 Dades carregades: items=${items.length}, rooms=${rooms.length}, contracts=${contracts.length}`);
  const selCat = document.getElementById("selCategory");
  if (selCat) selCat.options.length = 0;
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function resetGame() {
  state.cash = 1000;
  state.inventory.clear();
  ensureRoomsInstalled();
  state.selected.shopItemId = state.db.items.length ? state.db.items[0].id : null;
  log("🔄 Reset: cash=1000, inventari buit, instal·lacions buides.");
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  localStorage.removeItem('studio_tycoon_state_v1');
}

// Expose for legacy scripts
if (typeof window !== 'undefined') {
  window.saveState = saveState;
  window.loadStateFromStorage = loadStateFromStorage;
  window.clearPersistenceAndReset = clearPersistenceAndReset;
  window.loadFromObject = loadFromObject;
  window.resetGame = resetGame;
}

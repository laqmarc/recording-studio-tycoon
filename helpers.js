// helpers.js - browser-friendly ES module wrapper
// Export useful helpers and keep backwards compatibility by attaching
// them to `window` so non-module scripts continue to work.
export function log(msg) {
  const el = document.getElementById("log");
  if (!el) return;
  el.textContent = (msg + "\n" + el.textContent).slice(0, 6000);
}
export function euro(n) { return `${Math.round(n)}€`; }
export function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
export function avgStat(items, key) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  let s=0, n=0;
  for (const it of items) {
    const stats = it && it.stats ? it.stats : {};
    if (stats[key] != null) { s += Number(stats[key]); n++; }
  }
  return n ? s/n : 0;
}
export function sumStat(items, key) {
  let s=0;
  for (const it of (items || [])) {
    const stats = it && it.stats ? it.stats : {};
    s += Number(stats[key] || 0);
  }
  return s;
}
// Leveling helpers
export function xpToNext(level){
  return Math.max(200, Math.round(200 * Math.pow(level, 1.4)));
}
export function addXp(amount){
  if(!amount || amount<=0) return;
  if (typeof state === 'undefined' || !state.player) return;
  state.player.xp += Number(amount);
  log(`⭐ Guanyes ${amount} XP`);
  while(state.player.xp >= xpToNext(state.player.level)){
    state.player.xp -= xpToNext(state.player.level);
    state.player.level += 1;
    log(`⬆️ Level up! Ara ets nivell ${state.player.level}`);
  }
}

// Inventory helpers
export function invQty(id) { return (typeof state !== 'undefined' && state.inventory) ? Number(state.inventory.get(id) || 0) : 0; }
export function invAdd(id, qty=1){ if (typeof state !== 'undefined' && state.inventory) state.inventory.set(id, invQty(id)+qty); }
export function invRemove(id, qty=1){
  if (typeof state === 'undefined' || !state.inventory) return false;
  const cur = invQty(id);
  if (cur < qty) return false;
  const next = cur-qty;
  if (next<=0) state.inventory.delete(id); else state.inventory.set(id,next);
  return true;
}

// Contract requirement checker
export function checkContractRequirements(contract, roomIndex) {
  const req = contract.requirements || {};
  const room = state && state.db && state.db.rooms ? state.db.rooms[roomIndex] : undefined;
  if (!room) return false;
  
  if (req.room_type && req.room_type !== room.type) {
    return false;
  }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const used = (typeof installedIds === 'function') ? installedIds(roomIndex, cat).length : 0;
      if (used < Number(min)) {
        return false;
      }
    }
  }

  if (req.mic_types) {
    const installedMicIds = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic') : [];
    const installedMicTypes = new Set();
    for (const micId of installedMicIds) {
      const mic = state && state.itemsById ? state.itemsById.get(micId) : null;
      if (mic && mic.type) {
        mic.type.forEach(t => installedMicTypes.add(t));
      }
    }
    for (const requiredType of req.mic_types) {
      if (!installedMicTypes.has(requiredType)) {
        return false;
      }
    }
  }

  if (req.min_interface_inputs) {
    const interfaces = (typeof installedIds === 'function') ? installedIds(roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean) : [];
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    if (maxIns < Number(req.min_interface_inputs)) {
      return false;
    }
  }

  const micCount = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic').length : 0;
  if (micCount > 0) {
    const standCount = (typeof installedIds === 'function') ? installedIds(roomIndex, 'mic_stand').length : 0;
    if (standCount < micCount) {
      return false;
    }
  }

  return true;
}

// Time management
export function advanceTime(hours) {
  if (typeof state === 'undefined' || !state.time) return;
  state.time.hour += hours;
  while (state.time.hour >= state.time.workHoursPerDay) {
    state.time.hour -= state.time.workHoursPerDay;
    state.time.day += 1;
    // Recover fatigue when day changes: reduce short-term fatigue by base + rest bonus,
    // and decay chronic fatigue slowly.
    if (state.player) {
      // Percentage-based recovery: recover a fraction of short-term fatigue each night
      const recoveryRate = 0.5; // recover 50% of short fatigue per day
      const bonus = Number(state.player.restBonus || 0);
      const prevShort = Number(state.player.fatigueShort || 0);
      const recovered = prevShort * recoveryRate + bonus;
      state.player.fatigueShort = Math.max(0, prevShort - recovered);
      // chronic recovers very slowly
      state.player.fatigueChronic = Math.max(0, (state.player.fatigueChronic || 0) - 0.5);
      // reset one-day rest bonus
      state.player.restBonus = 0;
      if (typeof updateFatigueDerived === 'function') updateFatigueDerived();
      log(`🌅 Nou dia! Fatiga curta: ${state.player.fatigueShort.toFixed(1)}h · Fatiga crònica: ${state.player.fatigueChronic.toFixed(2)}`);
    }
  }
}

// Consumable items: immediate effects like coffee or improving sleep recovery
export function useConsumable(itemId) {
  if (typeof state === 'undefined' || !state.player) return false;
  if (typeof invQty === 'function' && invQty(itemId) <= 0) return false;
  // define simple consumable effects by id
  if (itemId === 'coffee') {
    // immediate short-term reduction
    state.player.fatigueShort = Math.max(0, (state.player.fatigueShort || 0) - 2);
    if (typeof invRemove === 'function') invRemove(itemId, 1);
    if (typeof updateFatigueDerived === 'function') updateFatigueDerived();
    return true;
  }
  if (itemId === 'good_bed') {
    // increases next-day recovery
    state.player.restBonus = (state.player.restBonus || 0) + 4;
    if (typeof invRemove === 'function') invRemove(itemId, 1);
    return true;
  }
  return false;
}

// Notifications
export function showNotification(message, duration = 3000) {
  const container = document.getElementById('notifications');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'notification';
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => {
    div.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => div.remove(), 500);
  }, duration);
}

// Attach to window for backward compatibility with non-module scripts
if (typeof window !== 'undefined') {
  window.Helpers = Object.assign(window.Helpers || {}, { log, euro, clamp, avgStat, sumStat, xpToNext, addXp, invQty, invAdd, invRemove, checkContractRequirements, advanceTime, showNotification });
  // Overwrite any temporary shim wrappers so the real implementations are used
  window.log = log;
  window.euro = euro;
  window.clamp = clamp;
  window.avgStat = avgStat;
  window.sumStat = sumStat;
  window.xpToNext = xpToNext;
  window.addXp = addXp;
  window.invQty = invQty;
  window.invAdd = invAdd;
  window.invRemove = invRemove;
  window.useConsumable = useConsumable;
  // Expose advanceTime and requirement checker as direct globals for legacy callers
  window.advanceTime = advanceTime;
  window.checkContractRequirements = checkContractRequirements;
}

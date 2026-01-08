// helpers.js - utility functions
function log(msg) {
  const el = document.getElementById("log");
  el.textContent = (msg + "\n" + el.textContent).slice(0, 6000);
}
function euro(n) { return `${Math.round(n)}€`; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function avgStat(items, key) {
  if (!items.length) return 0;
  let s=0, n=0;
  for (const it of items) {
    const stats = it.stats || {};
    if (stats[key] != null) { s += Number(stats[key]); n++; }
  }
  return n ? s/n : 0;
}
function sumStat(items, key) {
  let s=0;
  for (const it of items) {
    const stats = it.stats || {};
    s += Number(stats[key] || 0);
  }
  return s;
}
// Leveling helpers
function xpToNext(level){
  return Math.max(200, Math.round(200 * Math.pow(level, 1.4)));
}
function addXp(amount){
  if(!amount || amount<=0) return;
  state.player.xp += Number(amount);
  log(`⭐ Guanyes ${amount} XP`);
  while(state.player.xp >= xpToNext(state.player.level)){
    state.player.xp -= xpToNext(state.player.level);
    state.player.level += 1;
    log(`⬆️ Level up! Ara ets nivell ${state.player.level}`);
  }
}

// Inventory helpers
function invQty(id) { return Number(state.inventory.get(id) || 0); }
function invAdd(id, qty=1){ state.inventory.set(id, invQty(id)+qty); }
function invRemove(id, qty=1){
  const cur = invQty(id);
  if (cur < qty) return false;
  const next = cur-qty;
  if (next<=0) state.inventory.delete(id); else state.inventory.set(id,next);
  return true;
}

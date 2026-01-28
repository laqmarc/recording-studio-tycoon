import { state, getRoomSlotCapacity, installToRoom, installedIds } from '../state.js';
import { invQty, invRemove, log, showNotification } from '../helpers.js';

export function installAllInventoryToRoom(roomIndex) {
  if (!state || !state.inventory) return;
  let installedCount = 0;
  const categories = new Map();
  for (const [id, qty] of state.inventory.entries()) {
    if (qty <= 0) continue;
    const item = state.itemsById.get(id);
    if (!item) continue;
    const cat = item.category || 'misc';
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat).push({ id, qty });
  }

  for (const [cat, items] of categories.entries()) {
    const max = getRoomSlotCapacity(roomIndex, cat);
    const current = installedIds(roomIndex, cat).length;
    let remaining = Math.max(0, max - current);
    if (!remaining) continue;
    for (const entry of items) {
      while (remaining > 0 && invQty(entry.id) > 0) {
        const res = installToRoom(roomIndex, cat, entry.id);
        if (!res.ok) { remaining = 0; break; }
        if (!invRemove(entry.id, 1)) break;
        installedCount += 1;
        remaining -= 1;
      }
    }
  }

  if (installedCount > 0) {
    log(`🧩 Instal·lats ${installedCount} items a la sala`);
    showNotification(`🧩 Instal·lats ${installedCount} items`);
  } else {
    log('ℹ️ No hi ha items per instal·lar o no hi ha slots disponibles');
  }

  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
}

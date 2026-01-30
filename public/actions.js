// actions.js - module that wires DOM events and exposes legacy globals
import * as E from './esm/actions.mjs';
import { installAllInventoryToRoom } from './ui/inventory_actions.js';

function getImpl(name) {
  return (E && typeof E[name] === 'function') ? E[name] : (window.ESActions && typeof window.ESActions[name] === 'function') ? window.ESActions[name] : (typeof window[name] === 'function' ? window[name] : null);
}

function call(name, ...args) {
  const fn = getImpl(name);
  if (!fn) return undefined;
  return fn(...args);
}

// Expose direct globals for legacy code if not already present
if (typeof window !== 'undefined') {
  window.workOnContract = window.workOnContract || ((id,h)=>call('workOnContract', id, h));
  window.applyScheduledWork = window.applyScheduledWork || ((id,h,room,day)=>call('applyScheduledWork', id, h, room, day));
  window.buySelected = window.buySelected || (()=>call('buySelected'));
  window.leaseSelected = window.leaseSelected || (()=>call('leaseSelected'));
  window.prepareInstallFromShop = window.prepareInstallFromShop || (()=>call('prepareInstallFromShop'));
  window.installSelected = window.installSelected || (()=>call('installSelected'));
  window.uninstallLast = window.uninstallLast || (()=>call('uninstallLast'));
  window.getContractETA = window.getContractETA || ((c)=>{ const fn = getImpl('getContractETA'); return fn ? fn(c) : undefined; });
}

// Wire DOM events
if (typeof document !== 'undefined') {
  const on = (id, ev, cb) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, cb); };

  on('btnLoadDemo', 'click', () => { if (typeof loadFromObject === 'function' && typeof DEMO !== 'undefined') loadFromObject(DEMO); });
  on('btnReset', 'click', () => { if (typeof resetGame === 'function') resetGame(); });
  on('btnClearSave', 'click', () => { if (confirm('Esborrar la persistència i reiniciar el progrés?')) clearPersistenceAndReset(); });

  on('btnBuy', 'click', () => call('buySelected'));
  on('btnInstall', 'click', () => call('installSelected'));
  on('btnUninstall', 'click', () => call('uninstallLast'));
  on('btnUseConsumable', 'click', () => {
    try {
      const itemId = document.getElementById('selInvItem').value;
      if (itemId) {
        // try to call useConsumable via available implementations
        const fn = getImpl('useConsumable') || window.useConsumable;
        if (fn) fn(itemId);
        if (typeof window.renderAll === 'function') window.renderAll();
      }
    } catch(e) { if (typeof window.log === 'function') window.log('Error al usar item: '+e.message); }
  });

  on('btnSimPodcast', 'click', () => { if (typeof window !== 'undefined' && window.simulateContract) window.simulateContract('contract_podcast_duo'); });
  on('btnSimMix', 'click', () => { if (typeof window !== 'undefined' && window.simulateContract) window.simulateContract('contract_mix_single'); });

  on('btnNextDay', 'click', () => {
    try {
      if (typeof window === 'undefined' || !window.advanceTime || !window.state) return;
      const wh = Number(window.state.time.workHoursPerDay || 8);
      const curHour = Number(window.state.time.hour || 0);
      // compute hours to advance to reach the next day's start (ensure >0)
      const remainingHours = wh - curHour;
      const hoursToNextDay = (remainingHours % wh) || wh;
      // if player hasn't used the day much, give at least the remaining free hours as rest bonus
      try {
        if (window.state && window.state.player) {
          window.state.player.restBonus = (window.state.player.restBonus || 0) + remainingHours;
        }
      } catch (e) { /* ignore */ }
      window.advanceTime(hoursToNextDay);
      if (typeof window.updateFatigueDerived === 'function') window.updateFatigueDerived();
      if (typeof window.log === 'function') window.log(`⏭️ Saltat a demà. Fatiga curta: ${window.state.player.fatigueShort.toFixed(1)}h · crònica: ${window.state.player.fatigueChronic.toFixed(2)}`);
      if (typeof window.showNotification === 'function') window.showNotification(`🌅 Dia passat! Fatiga: ${window.state.player.fatigue.toFixed(1)}h`);
      if (typeof window.renderAll === 'function') window.renderAll();
      if (typeof window.saveState === 'function') window.saveState();
    } catch (e) {
      if (typeof window !== 'undefined' && typeof window.log === 'function') window.log('Error al passar dia: '+e.message);
    }
  });

  on('btnInstallAll', 'click', () => {
    try {
      const roomIndex = window.state && window.state.selected ? Number(window.state.selected.roomIndex || 0) : 0;
      installAllInventoryToRoom(roomIndex);
    } catch (e) {
      if (typeof window !== 'undefined' && typeof window.log === 'function') window.log('Error instal·lant tot: ' + e.message);
    }
  });

  on('btnCheat', 'click', () => {
    try {
      if (typeof window === 'undefined' || !window.state) return;
      window.state.cash = 1000000;
      if (typeof window.addXp === 'function') {
        window.addXp(20000);
      } else if (window.state.player) {
        window.state.player.xp = 20000;
      }
      // Set reputation to 100 for all genres
      if (!window.state.reputation) window.state.reputation = { overall: 0, byGenre: {} };
      window.state.reputation.overall = 100;
      const genres = ['pop', 'rap', 'hiphop', 'rock', 'podcast', 'live', 'film_score', 'commercial'];
      genres.forEach(genre => {
        window.state.reputation.byGenre[genre] = 100;
      });

      // Enable multisala testing: fill key rooms with installed gear
      if (typeof window.rebuildIndexes === 'function') window.rebuildIndexes();
      if (typeof window.ensureRoomsInstalled === 'function') window.ensureRoomsInstalled();
      const targetTypes = new Set([
        'vocal_booth',
        'control_room',
        'live_room',
        'mastering_suite',
        'podcast_studio',
        'edit_room',
        'foley_room',
        'streaming_room'
      ]);
      const rooms = (window.state.db && Array.isArray(window.state.db.rooms)) ? window.state.db.rooms : [];
      const roomIndexes = [];
      const slotTotals = {};
      rooms.forEach((room, idx) => {
        if (!room || !targetTypes.has(room.type)) return;
        roomIndexes.push(idx);
        const slots = room.slots || {};
        for (const [cat, count] of Object.entries(slots)) {
          slotTotals[cat] = (slotTotals[cat] || 0) + Number(count || 0);
        }
      });
      const itemsByCategory = window.state.itemsByCategory || new Map();
      if (typeof window.invAdd === 'function') {
        for (const [cat, count] of Object.entries(slotTotals)) {
          const items = itemsByCategory.get(cat) || [];
          if (!items.length) continue;
          const id = items[0].id;
          window.invAdd(id, Math.max(1, Math.floor(count)));
        }
      }
      for (const idx of roomIndexes) {
        installAllInventoryToRoom(idx);
      }

      if (typeof window.log === 'function') window.log('🧪 Cheat activat: cash=1.000.000€, +20.000 XP i reputació màxima');
      if (typeof window.showNotification === 'function') window.showNotification('🧪 Cheat activat');
      if (typeof window.renderAll === 'function') window.renderAll();
      if (typeof window.saveState === 'function') window.saveState();
    } catch (e) {
      if (typeof window !== 'undefined' && typeof window.log === 'function') window.log('Error cheat: '+e.message);
    }
  });

  on('selCategory', 'change', () => { if (typeof window.renderShop === 'function') window.renderShop(); });
  on('txtSearch', 'input', () => { if (typeof window.renderShop === 'function') window.renderShop(); });
  on('selInvCategory', 'change', () => { if (typeof window.renderRight === 'function') window.renderRight(); });

  const fileInput = document.getElementById('fileInput');
  if (fileInput) fileInput.addEventListener('change', async (e)=>{
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const txt = await file.text();
    try { const obj = JSON.parse(txt); if (typeof loadFromObject === 'function') loadFromObject(obj); }
    catch(err){ if (typeof window.log === 'function') window.log('❌ JSON invàlid: ' + err.message); }
  });

  // Boot actions
  const bootLoad = () => {
    if (typeof window !== 'undefined' && window.__demoLoaded) return;
    const hasItems = (typeof window !== 'undefined')
      ? (window.__itemsLoaded || (Array.isArray(window.ITEMS) && window.ITEMS.length) || (typeof DEMO !== 'undefined' && Array.isArray(DEMO.items) && DEMO.items.length))
      : (typeof DEMO !== 'undefined' && Array.isArray(DEMO.items) && DEMO.items.length);
    const hasRooms = (typeof window !== 'undefined')
      ? (window.__roomsLoaded || (Array.isArray(window.ROOMS) && window.ROOMS.length) || (typeof DEMO !== 'undefined' && Array.isArray(DEMO.rooms) && DEMO.rooms.length))
      : (typeof DEMO !== 'undefined' && Array.isArray(DEMO.rooms) && DEMO.rooms.length);
    if (typeof DEMO !== 'undefined' && typeof window !== 'undefined' && window.ITEMS && (!Array.isArray(DEMO.items) || !DEMO.items.length)) {
      DEMO.items = window.ITEMS;
    }
    if (typeof DEMO !== 'undefined' && typeof window !== 'undefined' && window.ROOMS && (!Array.isArray(DEMO.rooms) || !DEMO.rooms.length)) {
      DEMO.rooms = window.ROOMS;
    }
    if (hasItems && hasRooms && typeof loadFromObject === 'function' && typeof DEMO !== 'undefined') {
      if (typeof window !== 'undefined') window.__demoLoaded = true;
      loadFromObject(DEMO);
    }
  };
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    if (window.PEOPLE && typeof DEMO !== 'undefined') {
      bootLoad();
    } else {
      window.addEventListener('people-ready', bootLoad, { once: true });
      window.addEventListener('demo-ready', bootLoad, { once: true });
      window.addEventListener('items-ready', bootLoad, { once: true });
      window.addEventListener('rooms-ready', bootLoad, { once: true });
    }
  } else {
    bootLoad();
  }
  if (typeof ensurePlayerDefaults === 'function') ensurePlayerDefaults();
  try { if (typeof loadStateFromStorage === 'function') loadStateFromStorage(); } catch(e) {}
}

// Export named implementations for ESM consumers (ui_render imports these)
export function getContractETA(...args) {
  const fn = getImpl('getContractETA');
  return fn ? fn(...args) : undefined;
}

export function workOnContract(...args) {
  return call('workOnContract', ...args);
}

export function buySelected(...args) {
  return call('buySelected', ...args);
}

export function leaseSelected(...args) {
  return call('leaseSelected', ...args);
}

export function prepareInstallFromShop(...args) {
  return call('prepareInstallFromShop', ...args);
}

export function installSelected(...args) {
  return call('installSelected', ...args);
}

export function uninstallLast(...args) {
  return call('uninstallLast', ...args);
}


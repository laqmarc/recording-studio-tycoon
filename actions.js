// actions.js - module that wires DOM events and exposes legacy globals
import * as E from './esm/actions.mjs';

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
  window.buySelected = window.buySelected || (()=>call('buySelected'));
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
  on('btnAddToInstall', 'click', () => call('prepareInstallFromShop'));
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
  if (typeof loadFromObject === 'function' && typeof DEMO !== 'undefined') loadFromObject(DEMO);
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

export function prepareInstallFromShop(...args) {
  return call('prepareInstallFromShop', ...args);
}

export function installSelected(...args) {
  return call('installSelected', ...args);
}

export function uninstallLast(...args) {
  return call('uninstallLast', ...args);
}


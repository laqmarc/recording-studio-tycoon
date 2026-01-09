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

  on('btnSimPodcast', 'click', () => { if (typeof window !== 'undefined' && window.simulateContract) window.simulateContract('contract_podcast_duo'); });
  on('btnSimMix', 'click', () => { if (typeof window !== 'undefined' && window.simulateContract) window.simulateContract('contract_mix_single'); });

  on('btnNextDay', 'click', () => {
    if (typeof window !== 'undefined' && window.advanceTime && window.state) {
      const remainingHours = window.state.time.workHoursPerDay - window.state.time.hour;
      if (remainingHours > 0) {
        window.advanceTime(remainingHours);
        if (typeof window.log === 'function') window.log(`⏭️ Saltat a demà. Fatiga reduïda a ${window.state.player.fatigue.toFixed(1)}h`);
        if (typeof window.showNotification === 'function') window.showNotification(`🌅 Dia passat! Fatiga: ${window.state.player.fatigue.toFixed(1)}h`);
        if (typeof window.renderAll === 'function') window.renderAll();
        if (typeof window.saveState === 'function') window.saveState();
      } else {
        if (typeof window.log === 'function') window.log('Ja estàs al final del dia.');
      }
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


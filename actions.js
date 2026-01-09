// actions.js - user actions and boot (now a module with legacy fallbacks)
// NOTE: `advanceTime` is implemented in `helpers.js` to keep time logic
// centralized. Do not redefine it here to avoid duplicate definitions.

// Wrap in an IIFE to avoid polluting global scope and to prevent
// duplicate top-level declarations when the legacy scripts and
// migration shims are both loaded.
(function(){
  // Bind globals from window for gradual migration (legacy functions remain available on window)
  const state = (typeof window !== 'undefined' && window.state) ? window.state : undefined;
  const rebuildIndexes = (typeof window !== 'undefined' && window.rebuildIndexes) ? window.rebuildIndexes : undefined;
  const ensurePlayerDefaults = (typeof window !== 'undefined' && window.ensurePlayerDefaults) ? window.ensurePlayerDefaults : undefined;
  const loadStateFromStorage = (typeof window !== 'undefined' && window.loadStateFromStorage) ? window.loadStateFromStorage : undefined;
  const installedIds = (typeof window !== 'undefined' && window.installedIds) ? window.installedIds : undefined;
  const installToRoom = (typeof window !== 'undefined' && window.installToRoom) ? window.installToRoom : undefined;
  const uninstallFromRoom = (typeof window !== 'undefined' && window.uninstallFromRoom) ? window.uninstallFromRoom : undefined;
  const invAdd = (typeof window !== 'undefined' && window.invAdd) ? window.invAdd : undefined;
  const invRemove = (typeof window !== 'undefined' && window.invRemove) ? window.invRemove : undefined;
  const invQty = (typeof window !== 'undefined' && window.invQty) ? window.invQty : undefined;
  const advanceTime = (typeof window !== 'undefined' && window.advanceTime) ? window.advanceTime : undefined;
  const simulateContract = (typeof window !== 'undefined' && window.simulateContract) ? window.simulateContract : undefined;
  const renderAll = (typeof window !== 'undefined' && window.renderAll) ? window.renderAll : undefined;
  const renderShop = (typeof window !== 'undefined' && window.renderShop) ? window.renderShop : undefined;
  const renderRight = (typeof window !== 'undefined' && window.renderRight) ? window.renderRight : undefined;
  // actions.js — tiny legacy shim delegating to the ES module implementation
  // This file keeps the legacy bindings and event wiring, but the
  // real logic lives in `esm/actions.mjs` (loaded as a module).

  (function(){
    function getImpl(name) {
      return (typeof window !== 'undefined' && window.ESActions && typeof window.ESActions[name] === 'function')
        ? window.ESActions[name]
        : (typeof window !== 'undefined' && typeof window[name] === 'function') ? window[name] : null;
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
      // ensure getContractETA also points to module impl if available
      window.getContractETA = window.getContractETA || ((c)=>{
        const fn = getImpl('getContractETA');
        return fn ? fn(c) : undefined;
      });
    }

    // Wire DOM events (deferred execution expected: this file is loaded with `defer`)
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

      const bindSimple = (id, fnName) => on(id, 'change', () => { if (typeof window[fnName] === 'function') window[fnName](); });
      // These will call renderShop/renderRight when applicable
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

      // Boot actions that rely on persistence/helpers being available (loaded earlier with defer)
      if (typeof loadFromObject === 'function' && typeof DEMO !== 'undefined') loadFromObject(DEMO);
      if (typeof ensurePlayerDefaults === 'function') ensurePlayerDefaults();
      try { if (typeof loadStateFromStorage === 'function') loadStateFromStorage(); } catch(e) {}
    }

  })();
})();


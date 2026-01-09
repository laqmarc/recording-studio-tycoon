// esm/state.mjs — expose accessors to the global `state` for progressive migration
function getState() {
  return typeof window !== 'undefined' ? window.state : undefined;
}

function setState(s) {
  if (typeof window !== 'undefined') window.state = s;
}

function ensureProxy() {
  if (typeof window === 'undefined') return;
  if (!window.ESState) {
    window.ESState = {
      get: () => window.state,
      set: (s) => { window.state = s; }
    };
  }
}

ensureProxy();

export { getState, setState, ensureProxy };

if (typeof window !== 'undefined') window.ESState = window.ESState || { get: getState, set: setState };

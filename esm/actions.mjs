// esm/actions.mjs — exported wrappers that delegate to legacy global actions when available
function callIfExists(name, ...args) {
  if (typeof window !== 'undefined' && typeof window[name] === 'function') {
    return window[name](...args);
  }
  // no-op or return undefined when legacy not loaded
  return undefined;
}

export function buySelected() { return callIfExists('buySelected'); }
export function installSelected() { return callIfExists('installSelected'); }
export function workOnContract(id, hours) { return callIfExists('workOnContract', id, hours); }
export function uninstallLast() { return callIfExists('uninstallLast'); }

if (typeof window !== 'undefined') {
  window.ESActions = { buySelected, installSelected, workOnContract, uninstallLast };
}

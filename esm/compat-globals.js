// compat-globals.js — bridge ES modules -> legacy scripts
// Create top-level `var` bindings that legacy scripts expect (e.g. `state`)
if (typeof window !== 'undefined') {
  // create global var bindings; these run in global scope (not inside a function)
  // if the module attached values to window earlier, capture them in real globals
  var state = window.state;
  var rebuildIndexes = window.rebuildIndexes;
  var ensureRoomsInstalled = window.ensureRoomsInstalled;
  var installedIds = window.installedIds;
  var installToRoom = window.installToRoom;
  var uninstallFromRoom = window.uninstallFromRoom;

  // also ensure window has the same references
  window.state = state;
  window.rebuildIndexes = rebuildIndexes;
  window.ensureRoomsInstalled = ensureRoomsInstalled;
  window.installedIds = installedIds;
  window.installToRoom = installToRoom;
  window.uninstallFromRoom = uninstallFromRoom;
}

/** @jest-environment jsdom */

import { installSelected, uninstallLast } from '../esm/actions.mjs';

describe('esm/actions install/uninstall', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <select id="selInvCategory"></select>
      <select id="selInvItem"></select>
    `;
    state.db.rooms = [{ id: 'r1', name: 'Room', type: 'control_room', slots: { mic: 1 } }];
    state.selected = { roomIndex: 0, shopItemId: null };
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', name: 'Mic', category: 'mic' }]
    ]);
    state.inventory = new Map([['mic1', 1]]);
    window.state = state;
    window.renderAll = () => {};
    window.saveState = () => {};
    window.log = () => {};
  });

  test('installSelected calls installToRoom and invRemove', () => {
    const sel = document.getElementById('selInvItem');
    sel.add(new Option('Mic', 'mic1'));
    sel.value = 'mic1';
    const calls = { install: 0, remove: 0 };
    window.installToRoom = () => { calls.install += 1; return { ok: true }; };
    window.invRemove = () => { calls.remove += 1; };
    window.invQty = () => 1;
    installSelected();
    expect(calls.install).toBe(1);
    expect(calls.remove).toBe(1);
  });

  test('uninstallLast calls uninstallFromRoom and invAdd', () => {
    document.getElementById('selInvCategory').value = 'mic';
    const calls = { uninstall: 0, add: 0 };
    window.uninstallFromRoom = () => { calls.uninstall += 1; return { ok: true, removed: 'mic1' }; };
    window.invAdd = () => { calls.add += 1; };
    uninstallLast();
    expect(calls.uninstall).toBe(1);
    expect(calls.add).toBe(1);
  });
});

/** @jest-environment jsdom */

import { renderShop } from '../ui/shop.js';

describe('ui/shop', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <select id="selCategory"></select>
      <input id="txtSearch" />
      <div id="micTypeFilter"><select id="selMicType"></select></div>
      <div id="shopMeta"></div>
      <div id="shopBundles"></div>
      <div id="shopList"></div>
    `;
    const micTypeSelect = document.getElementById('selMicType');
    micTypeSelect.innerHTML = '<option value="">Tots</option><option value="vocals">Vocals</option><option value="guitarra">Guitarra</option>';

    state.db.rooms = [{ id: 'r1', type: 'control_room' }];
    state.itemsById = new Map();
    state.itemsByCategory = new Map([
      ['mic', [
        { id: 'm1', name: 'Mic Vocals', category: 'mic', price: 100, type: ['vocals'], stats: { mic_quality: 60 }, unlock_level: 1 },
        { id: 'm2', name: 'Mic Guitar', category: 'mic', price: 120, type: ['guitarra'], stats: { mic_quality: 55 }, unlock_level: 1 }
      ]],
      ['monitor', [
        { id: 'mon1', name: 'Monitor', category: 'monitor', price: 300, stats: { monitor_accuracy: 70 }, unlock_level: 1 }
      ]]
    ]);
    for (const arr of state.itemsByCategory.values()) {
      for (const it of arr) state.itemsById.set(it.id, it);
    }
    state.player = { level: 1 };
    state.selected = { shopItemId: null, roomIndex: 0 };
    state.reputation = { overall: 0, byGenre: {} };

    window.buySelected = () => {};
  });

  test('shows mic type filter only for mic category', () => {
    renderShop({ renderRight: () => {}, renderAll: () => {} });
    const filter = document.getElementById('micTypeFilter');
    expect(filter.style.display).toBe('block');

    const sel = document.getElementById('selCategory');
    sel.value = 'monitor';
    renderShop({ renderRight: () => {}, renderAll: () => {} });
    expect(filter.style.display).toBe('none');
  });

  test('filters by mic type and search', () => {
    const sel = document.getElementById('selCategory');
    sel.value = 'mic';
    document.getElementById('selMicType').value = 'vocals';
    document.getElementById('txtSearch').value = 'vocals';
    renderShop({ renderRight: () => {}, renderAll: () => {} });
    const list = document.getElementById('shopList');
    expect(list.textContent).toMatch(/Mic Vocals/);
    expect(list.textContent).not.toMatch(/Mic Guitar/);
  });

  test('quick buy button calls window.buySelected', () => {
    let called = 0;
    window.buySelected = () => { called += 1; };
    renderShop({ renderRight: () => {}, renderAll: () => {} });
    const quick = document.querySelector('.btn-quick');
    quick.click();
    expect(called).toBe(1);
  });
});

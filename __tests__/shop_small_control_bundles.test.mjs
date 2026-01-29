import { renderShop } from '../ui/shop.js';
import { state } from '../state.js';

describe('shop small control room bundles', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="shopBundles"></div>
      <div id="shopMeta"></div>
      <div id="shopList"></div>
      <select id="selCategory"></select>
      <input id="txtSearch" />
      <div id="micTypeFilter"></div>
      <select id="selMicType"></select>
    `;

    state.db.rooms = [{ id: 'r1', name: 'Sala petita', type: 'control_room', size_m2: 12 }];
    state.selected = { roomIndex: 0, shopItemId: null };
    state.player = { level: 1 };
    state.cash = 1000;
    state.reputation = { overall: 0, byGenre: {} };
    state.itemsById = new Map([
      ['a1', { id: 'a1', name: 't.akustik QRD Diffusor', category: 'acoustic_treatment', price: 50 }],
      ['m1', { id: 'm1', name: 'Mackie CR4-X', category: 'monitor', price: 80 }],
      ['s1', { id: 's1', name: 'Audacity', category: 'software', price: 0 }],
      ['v1', { id: 'v1', name: 'Micròfon Condensador Vocal', category: 'mic', price: 60 }],
      ['p1', { id: 'p1', name: 'Behringer MIC200 Tube Ultragain', category: 'preamp', price: 60 }],
      ['h1', { id: 'h1', name: 'Tascam TH-02', category: 'headphones', price: 40 }],
      ['c1', { id: 'c1', name: 'the sssnake XLR3 Basic', category: 'cable', price: 10 }],
      ['s2', { id: 's2', name: 'Millenium MS3003', category: 'mic_stand', price: 20 }],
      ['i1', { id: 'i1', name: 'Focusrite Scarlett Solo 4th Gen', category: 'interface', price: 100 }]
    ]);
    state.itemsByCategory = new Map([
      ['mic', [{ id: 'v1', name: 'Micròfon Condensador Vocal', category: 'mic', price: 60, unlock_level: 1 }]],
      ['preamp', [{ id: 'p1', name: 'Behringer MIC200 Tube Ultragain', category: 'preamp', price: 60, unlock_level: 1 }]],
      ['headphones', [{ id: 'h1', name: 'Tascam TH-02', category: 'headphones', price: 40, unlock_level: 1 }]],
      ['cable', [{ id: 'c1', name: 'the sssnake XLR3 Basic', category: 'cable', price: 10, unlock_level: 1 }]],
      ['mic_stand', [{ id: 's2', name: 'Millenium MS3003', category: 'mic_stand', price: 20, unlock_level: 1 }]],
      ['interface', [{ id: 'i1', name: 'Focusrite Scarlett Solo 4th Gen', category: 'interface', price: 100, unlock_level: 1 }]],
      ['monitor', [{ id: 'm1', name: 'Mackie CR4-X', category: 'monitor', price: 80, unlock_level: 1 }]],
      ['acoustic_treatment', [{ id: 'a1', name: 't.akustik QRD Diffusor', category: 'acoustic_treatment', price: 50, unlock_level: 1 }]],
      ['software', [{ id: 's1', name: 'Audacity', category: 'software', price: 0, unlock_level: 1 }]]
    ]);
  });

  test('renders small room bundles', () => {
    renderShop({ renderAll: () => {}, renderRight: () => {} });
    const text = document.body.textContent;
    expect(text).toMatch(/Control Room Essentials/);
    expect(text).toMatch(/Vocal Starter Pack/);
  });
});

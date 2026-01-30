/** @jest-environment jsdom */

describe('ui_render basic DOM behaviour', () => {
  let ui;
  beforeEach(async () => {
    document.body.innerHTML = `
      <select id="selCategory"></select>
      <input id="txtSearch" />
      <select id="selMicType"></select>
      <div id="micTypeFilter"></div>
      <div id="shopMeta"></div>
      <div id="shopList"></div>
    `;
    // minimal globals used by renderShop
    global.state = {
      itemsByCategory: new Map([['mic', [{ id: 'm1', name: 'Mic A', category: 'mic', price: 100, type: ['cardioid'], stats: { mic_quality: 60 } }]]]),
      player: { level: 1 },
      selected: { shopItemId: null }
    };
    global.euro = (n) => `${n}€`;
    ui = require('../ui_render.cjs');
  });

  test('renderShop populates category and items', () => {
    ui.renderShop();
    const sel = document.getElementById('selCategory');
    expect(sel.options.length).toBeGreaterThan(0);
    const list = document.getElementById('shopList');
    expect(list.children.length).toBeGreaterThan(0);
    const meta = document.getElementById('shopMeta');
    expect(meta.textContent).toMatch(/items/);
  });
});

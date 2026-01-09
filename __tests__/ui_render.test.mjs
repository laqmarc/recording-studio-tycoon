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
    // set the real module state so ui_render imports see it
    const stateMod = await import('../state.js');
    stateMod.state.itemsByCategory = new Map([['mic', [{ id: 'm1', name: 'Mic A', category: 'mic', price: 100, type: ['cardioid'], stats: { mic_quality: 60 } }]]]);
    stateMod.state.player = { level: 1 };
    stateMod.state.selected = { shopItemId: null };
    global.euro = (n) => `${n}€`;
    ui = await import('../ui_render.mjs');
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

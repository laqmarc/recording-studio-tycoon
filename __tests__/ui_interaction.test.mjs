/** @jest-environment jsdom */

describe('UI interaction flows', () => {
  let ui;
  beforeEach(async () => {
    document.body.innerHTML = `
      <select id="selCategory"></select>
      <input id="txtSearch" />
      <select id="selMicType"></select>
      <div id="micTypeFilter"></div>
      <div id="shopMeta"></div>
      <div id="shopList"></div>
      <div id="roomDetails"></div>
      <select id="selInvCategory"></select>
      <select id="selInvItem"></select>
      <div id="kpis"></div>
      <div id="rightMeta"></div>
    `;
    global.euro = (n) => `${n}€`;
    global.xpToNext = (lvl) => 200 + lvl * 50;
    global.invQty = (id) => 0;
    // set module state so ESM renderer sees it
    const stateMod = await import('../state.js');
    stateMod.state.db = { items: [{ id: 'i1', name: 'Item One', category: 'mic', price: 100, stats: { mic_quality: 60 }, type: ['vocals'] }], rooms: [{ id: 'r1', base_acoustic: 10, noise_floor_db: -60 }], contracts: [] };
    stateMod.state.itemsByCategory = new Map([['mic', [{ id: 'i1', name: 'Item One', category: 'mic', price: 100, stats: { mic_quality: 60 }, type: ['vocals'] }]]]);
    stateMod.state.itemsById = new Map([['i1', { id: 'i1', name: 'Item One' }]]);
    stateMod.state.player = { level: 1, fatigue: 0, xp: 0 };
    stateMod.state.roomsInstalled = [ {} ];
    stateMod.state.selected = { shopItemId: null, roomIndex: 0 };
    stateMod.state.inventory = new Map();
    stateMod.state.cash = 1000;
    stateMod.state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    ui = await import('../ui_render.mjs');
  });

  test('clicking an item card updates selection and re-renders', () => {
    ui.renderShop();
    const list = document.getElementById('shopList');
    expect(list.children.length).toBeGreaterThan(0);
    const firstCard = list.children[0];
    // simulate click
    firstCard.click();
    expect(state.selected.shopItemId).toBe('i1');
    // renderRight should reflect room info without throwing
    ui.renderRight();
    const details = document.getElementById('roomDetails');
    expect(details).toBeTruthy();
  });
});

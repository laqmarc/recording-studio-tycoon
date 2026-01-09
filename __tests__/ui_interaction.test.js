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
    // minimal state
    global.state = {
      db: { items: [{ id: 'i1', name: 'Item One', category: 'mic', price: 100, stats: { mic_quality: 60 }, type: ['vocals'] }], rooms: [{ id: 'r1', base_acoustic: 10, noise_floor_db: -60 }], contracts: [] },
      itemsByCategory: new Map([['mic', [{ id: 'i1', name: 'Item One', category: 'mic', price: 100, stats: { mic_quality: 60 }, type: ['vocals'] }]]]),
      itemsById: new Map([['i1', { id: 'i1', name: 'Item One' }]]),
      player: { level: 1, fatigue: 0, xp: 0 },
      roomsInstalled: [ {} ],
      selected: { shopItemId: null, roomIndex: 0 },
      inventory: new Map(),
      cash: 1000,
      time: { day: 1, hour: 0, workHoursPerDay: 8 }
    };
    ui = require('../ui_render.cjs');
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

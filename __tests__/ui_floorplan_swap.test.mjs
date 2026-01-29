/** @jest-environment jsdom */

import { renderRoomDetails } from '../ui/room_details.js';

function makeDataTransfer() {
  const store = {};
  return {
    setData: (type, val) => { store[type] = val; },
    getData: (type) => store[type] || '',
    effectAllowed: ''
  };
}

describe('ui/room_details floorplan swap', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <div id="rightMeta"></div>
      <div id="roomDetails"></div>
      <div class="inventory-panel"><div class="content"><div class="inventory-grid" id="inventoryList"></div></div></div>
      <div id="kpis"></div>
      <div id="mobileKpis"></div>
    `;
    global.requestAnimationFrame = (cb) => cb();
    state.db.rooms = [{ id: 'r1', name: 'Room', type: 'control_room', size_m2: 12, noise_floor_db: -60, base_acoustic: 40, slots: { mic: 2 } }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', name: 'Mic One', category: 'mic', price: 100, stats: { mic_quality: 50 } }],
      ['mic2', { id: 'mic2', name: 'Mic Two', category: 'mic', price: 120, stats: { mic_quality: 55 } }]
    ]);
    state.roomsInstalled = [{ mic: ['mic1', 'mic2'] }];
    state.inventory = new Map();
    state.selected.roomIndex = 0;
    state.player = { level: 1, xp: 0, fatigue: 0, fatigueShort: 0, fatigueChronic: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.ui = { page: 'rooms', roomLayout: {} };
  });

  test('drag installed item onto another slot swaps layout', () => {
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const nodes = document.querySelectorAll('.floor-node.filled');
    expect(nodes.length).toBe(2);
    const fromToken = nodes[0].querySelector('.floor-token');
    const targetNode = nodes[1];

    const dt = makeDataTransfer();
    const dragStart = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStart, 'dataTransfer', { value: dt });
    fromToken.dispatchEvent(dragStart);

    const drop = new Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', { value: dt });
    targetNode.dispatchEvent(drop);

    const layout = state.ui.roomLayout[0].mic;
    expect(layout).toEqual(['mic2', 'mic1']);
  });
});

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

describe('ui/room_details drag & drop', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <div id="rightMeta"></div>
      <div id="roomDetails"></div>
      <div class="inventory-panel">
        <div class="content">
          <div class="inventory-grid" id="inventoryList"></div>
        </div>
      </div>
      <div id="kpis"></div>
      <div id="mobileKpis"></div>
    `;
    global.requestAnimationFrame = (cb) => cb();
    state.db.rooms = [{ id: 'r1', name: 'Room', type: 'control_room', size_m2: 12, noise_floor_db: -60, base_acoustic: 40, slots: { mic: 1 } }];
    state.itemsById = new Map([
      ['mic1', { id: 'mic1', name: 'Mic One', category: 'mic', price: 100, stats: { mic_quality: 50 } }]
    ]);
    state.inventory = new Map();
    state.roomsInstalled = [ {} ];
    state.selected.roomIndex = 0;
    state.player = { level: 1, xp: 0, fatigue: 0, fatigueShort: 0, fatigueChronic: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.ui = { page: 'rooms', roomLayout: {} };
  });

  test('drag inventory item onto floor installs item', () => {
    state.inventory.set('mic1', 1);
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const card = document.querySelector('.inventory-card');
    const node = document.querySelector('.floor-node.empty');
    const dt = makeDataTransfer();
    const dragStart = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStart, 'dataTransfer', { value: dt });
    card.dispatchEvent(dragStart);

    const drop = new Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', { value: dt });
    node.dispatchEvent(drop);

    expect(state.roomsInstalled[0].mic.length).toBe(1);
    expect(Number(state.inventory.get('mic1') || 0)).toBe(0);
  });

  test('drag installed item back to inventory uninstalls', () => {
    state.roomsInstalled = [{ mic: ['mic1'] }];
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const token = document.querySelector('.floor-token');
    const invList = document.getElementById('inventoryList');
    const dt = makeDataTransfer();
    const dragStart = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStart, 'dataTransfer', { value: dt });
    token.dispatchEvent(dragStart);

    const drop = new Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', { value: dt });
    invList.dispatchEvent(drop);

    expect(state.roomsInstalled[0].mic.length).toBe(0);
    expect(Number(state.inventory.get('mic1') || 0)).toBe(1);
  });
});

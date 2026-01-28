/** @jest-environment jsdom */

import { renderRoomDetails } from '../ui/room_details.js';

describe('ui/room_details', () => {
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

    state.db.rooms = [{ id: 'r1', name: 'Studio', type: 'control_room', size_m2: 18, noise_floor_db: -60, base_acoustic: 40, slots: { mic: 1 } }];
    state.roomsInstalled = [{ mic: ['i1'] }];
    state.itemsById = new Map([
      ['i1', { id: 'i1', name: 'Mic One', category: 'mic', price: 100, stats: { mic_quality: 50 } }]
    ]);
    state.inventory = new Map([['i1', 1]]);
    state.itemCondition = new Map([['i1', 80]]);
    state.player = { level: 1, xp: 0, fatigue: 0, fatigueShort: 0, fatigueChronic: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.ui = { page: 'rooms', roomLayout: {}, showSignalFlow: false };

    global.requestAnimationFrame = (cb) => cb();
  });

  test('renders inventory and maintenance card under inventory', () => {
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const invList = document.getElementById('inventoryList');
    expect(invList.textContent).toMatch(/Mic One/);
    const maintenance = document.querySelectorAll('.inventory-maintenance');
    expect(maintenance.length).toBe(1);
    expect(maintenance[0].textContent).toMatch(/Manteniment/);
    expect(maintenance[0].textContent).toMatch(/Reparar/);
  });

  test('does not duplicate maintenance on re-render', () => {
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const maintenance = document.querySelectorAll('.inventory-maintenance');
    expect(maintenance.length).toBe(1);
  });

  test('repair button applies maintenance', () => {
    state.cash = 100;
    renderRoomDetails({ renderRight: () => {}, renderAll: () => {} });
    const btn = Array.from(document.querySelectorAll('.inventory-maintenance button'))[0];
    btn.click();
    expect(state.itemCondition.get('i1')).toBe(100);
    expect(state.cash).toBe(95);
  });
});

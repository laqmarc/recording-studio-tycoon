/** @jest-environment jsdom */

import { renderRooms } from '../ui/rooms.js';

describe('ui/rooms render', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <div id="roomList"></div>
      <div id="roomsMeta"></div>
      <select id="selContractRoom"></select>
      <div id="leftContracts"></div>
      <div id="contractsMeta"></div>
      <button id="btnFetchClients"></button>
    `;

    state.db.rooms = [
      { id: 'r1', name: 'Room A', type: 'control_room', size_m2: 18, noise_floor_db: -60, slots: { mic: 1 } },
      { id: 'r2', name: 'Room B', type: 'live_room', size_m2: 24, noise_floor_db: -55, slots: { mic: 2 }, unlock_level: 2 }
    ];
    state.db.contracts = [
      { id: 'c1', name: 'Vocal', type: 'recording', duration_hours: 4, worked_hours: 1, base_pay: 120, target_quality: 60, requirements: { room_type: 'control_room' } },
      { id: 'c2', name: 'Live', type: 'recording', duration_hours: 3, worked_hours: 0, base_pay: 80, requirements: { room_type: 'live_room' } }
    ];
    state.player = { level: 1 };
    state.selected.roomIndex = 0;
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.market = { offers: [], lastDayGenerated: 0 };
    state.reputation = { overall: 0, byGenre: {} };

    let called = 0;
    window.generateDailyOffers = () => { called += 1; };
    window.__offersCalled = () => called;
  });

  test('renders visible rooms and contracts for active room', () => {
    renderRooms({ renderAll: () => {} });
    const list = document.getElementById('roomList');
    expect(list.children.length).toBe(1);
    const roomsMeta = document.getElementById('roomsMeta');
    expect(roomsMeta.textContent).toMatch(/1 sales/);

    const contracts = document.querySelectorAll('.contract-card');
    expect(contracts.length).toBe(1);
    expect(contracts[0].textContent).toMatch(/Vocal/);

    const contractMeta = document.getElementById('contractsMeta');
    expect(contractMeta.textContent).toMatch(/1 contractes/);
  });

  test('populates contract room select with visible rooms', () => {
    renderRooms({ renderAll: () => {} });
    const sel = document.getElementById('selContractRoom');
    expect(sel.options.length).toBe(1);
    expect(sel.options[0].textContent).toBe('Room A');
  });

  test('generates daily offers when market empty', () => {
    renderRooms({ renderAll: () => {} });
    expect(window.__offersCalled()).toBeGreaterThan(0);
  });
});

/** @jest-environment jsdom */

import { renderRooms } from '../ui/rooms.js';

describe('ui/rooms interaction', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <div id="roomList"></div>
      <select id="selContractRoom"></select>
      <div id="leftContracts"></div>
      <div id="contractsMeta"></div>
    `;

    state.db.rooms = [
      { id: 'r1', name: 'Room A', type: 'control_room', size_m2: 18, noise_floor_db: -60, slots: { mic: 1 } },
      { id: 'r2', name: 'Room B', type: 'control_room', size_m2: 20, noise_floor_db: -58, slots: { mic: 1 } }
    ];
    state.db.contracts = [
      { id: 'c1', name: 'Vocal', type: 'recording', duration_hours: 4, worked_hours: 1, base_pay: 120, requirements: { room_type: 'control_room', mic_types: ['vocals'] } }
    ];
    state.db.people = [
      { id: 'm1', name: 'Mia', role: 'musician', instruments: ['vocals'], skill: 60, fee_per_hour: 20, unlock_level: 1 }
    ];
    state.hiredPeople = ['m1'];
    state.player = { level: 1 };
    state.selected.roomIndex = 0;
    state.roomsInstalled = [ {}, {} ];
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
  });

  test('clicking room updates selection and calls renderAll', () => {
    let rerenders = 0;
    renderRooms({ renderAll: () => { rerenders += 1; } });
    const cards = document.querySelectorAll('#roomList .card');
    cards[1].click();
    expect(state.selected.roomIndex).toBe(1);
    expect(rerenders).toBeGreaterThan(0);
  });

  test('changing contract room select updates selection', () => {
    let rerenders = 0;
    renderRooms({ renderAll: () => { rerenders += 1; } });
    const sel = document.getElementById('selContractRoom');
    sel.value = '1';
    sel.dispatchEvent(new Event('change'));
    expect(state.selected.roomIndex).toBe(1);
    expect(rerenders).toBeGreaterThan(0);
  });

  test('manual talent select persists assigned people', () => {
    renderRooms({ renderAll: () => {} });
    const select = document.querySelector('.talent-selects select');
    select.value = 'm1';
    select.dispatchEvent(new Event('change'));
    const c = state.db.contracts[0];
    expect(c.assigned_people).toContain('m1');
  });
});

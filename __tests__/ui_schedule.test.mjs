/** @jest-environment jsdom */

import { renderScheduleBoard } from '../ui/schedule.js';

describe('ui/schedule', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="scheduleBoard"></div>`;

    state.db.rooms = [
      { id: 'r1', name: 'Room A', type: 'control_room', unlock_level: 1 },
      { id: 'r2', name: 'Room B', type: 'live_room', unlock_level: 2 }
    ];
    state.db.contracts = [{ id: 'c1', name: 'Mix', duration_hours: 8, worked_hours: 0 }];
    state.player = { level: 1 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [{ contractId: 'c1', roomIndex: 0, day: 1, hours: 4 }];
  });

  test('renders grid and scheduled items for visible rooms', () => {
    renderScheduleBoard({ renderAll: () => {} });
    const grid = document.querySelector('.schedule-grid');
    expect(grid).toBeTruthy();
    const rows = document.querySelectorAll('.schedule-row');
    expect(rows.length).toBe(1);
    const item = document.querySelector('.schedule-item');
    expect(item.textContent).toMatch(/Mix \(4h\)/);
    const badge = document.querySelector('.schedule-cell .tiny');
    expect(badge.textContent).toBe('4/8h');
  });
});

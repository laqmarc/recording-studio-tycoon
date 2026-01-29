/** @jest-environment jsdom */

import { renderScheduleBoard } from '../ui/schedule.js';

describe('ui/schedule drop', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="scheduleBoard"></div>`;

    state.db.rooms = [{ id: 'r1', name: 'Room A', type: 'control_room', unlock_level: 1 }];
    state.db.contracts = [{ id: 'c1', name: 'Mix', duration_hours: 10, worked_hours: 0, requirements: {} }];
    state.player = { level: 1 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [];
    state.ui = { scheduleShowEmptyRooms: true };
    window.saveState = () => {};
  });

  test('drop schedules contract across days', () => {
    renderScheduleBoard({ renderAll: () => {} });
    const cell = document.querySelector('.schedule-cell');
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { getData: () => JSON.stringify({ type: 'contract', contractId: 'c1' }) }
    });
    cell.dispatchEvent(dropEvent);

    const items = state.schedule.filter(s => s.contractId === 'c1');
    const total = items.reduce((sum, s) => sum + s.hours, 0);
    expect(items.length).toBeGreaterThan(0);
    expect(total).toBe(10);
    expect(items[0].day).toBe(1);
    expect(items[items.length - 1].day).toBeGreaterThanOrEqual(2);
  });
});

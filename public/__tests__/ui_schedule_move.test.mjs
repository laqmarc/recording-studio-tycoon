/** @jest-environment jsdom */

import { renderScheduleBoard } from '../ui/schedule.js';

describe('ui/schedule scheduled item move', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="scheduleBoard"></div>`;
    state.db.rooms = [{ id: 'r1', name: 'Room A', type: 'control_room', unlock_level: 1 }];
    state.db.contracts = [{ id: 'c1', name: 'Mix', duration_hours: 4, worked_hours: 0, requirements: {} }];
    state.player = { level: 1 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.schedule = [
      { contractId: 'c1', roomIndex: 0, day: 1, hours: 2 },
      { contractId: 'c1', roomIndex: 0, day: 2, hours: 2 }
    ];
    state.ui = { scheduleShowEmptyRooms: true };
    window.saveState = () => {};
    window.checkContractRequirements = () => true;
  });

  test('dropping scheduled item reschedules from new day', () => {
    renderScheduleBoard({ renderAll: () => {} });
    const target = document.querySelector('.schedule-cell[data-day="3"]');
    const drop = new Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { getData: () => JSON.stringify({ type: 'scheduled', contractId: 'c1', roomIndex: 0, day: 1 }) }
    });
    target.dispatchEvent(drop);

    const days = state.schedule.map(s => s.day);
    expect(days.some(d => d === 1)).toBe(false);
    expect(days.every(d => d >= 3)).toBe(true);
  });
});

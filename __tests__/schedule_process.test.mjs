/** @jest-environment jsdom */

import { processScheduledDay } from '../helpers.js';
import { applyScheduledWork } from '../esm/actions.mjs';

describe('schedule processing', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db.rooms = [{ id: 'r1', type: 'control_room', base_acoustic: 40, noise_floor_db: -60 }];
    state.db.contracts = [{ id: 'c1', name: 'Mix', duration_hours: 2, worked_hours: 0, requirements: {} }];
    state.selected = { roomIndex: 0 };
    state.player = { level: 1, fatigue: 0, fatigueShort: 0, fatigueChronic: 0 };
    state.staff = { engineer: { level: 0 }, producer: { level: 0 } };
    state.schedule = [
      { contractId: 'c1', roomIndex: 0, day: 1, hours: 1 },
      { contractId: 'c1', roomIndex: 0, day: 2, hours: 1 }
    ];
    state.itemsById = new Map();
    state.roomsInstalled = [{}];
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    window.saveState = () => {};
  });

  test('applyScheduledWork completes contract and marks completed', () => {
    let simulated = 0;
    window.simulateContract = () => { simulated += 1; return true; };
    window.checkContractRequirements = () => true;
    const res = applyScheduledWork('c1', 2, 0, 1);
    expect(res.completed).toBe(true);
    expect(simulated).toBe(1);
    expect(state.db.contracts[0].completed).toBe(true);
  });

  test('processScheduledDay removes entries and completed contract', () => {
    window.applyScheduledWork = () => ({ completed: true, id: 'c1' });
    processScheduledDay(1);
    expect(state.schedule.length).toBe(0);
    expect(state.db.contracts.length).toBe(0);
  });
});

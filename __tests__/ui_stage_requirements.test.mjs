import { getRequirementsElement } from '../ui/requirements.js';
import { state } from '../state.js';

describe('ui stage requirements', () => {
  beforeEach(() => {
    state.roomsInstalled = [{ mic: ['m1'] }];
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
  });

  test('shows stage room type in requirements', () => {
    const contract = {
      requirements: { room_type: 'edit_room', min_items: { monitor: 1 } },
      deadline_days: 2,
      start_day: 1
    };
    const el = getRequirementsElement(contract, 0);
    expect(el).toBeTruthy();
    const text = el.textContent;
    expect(text).toMatch(/Sala: Sala d'Edicio/);
  });
});

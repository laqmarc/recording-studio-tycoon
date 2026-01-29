import { acceptSpecialOffer } from '../client_market.js';
import { state } from '../state.js';

describe('special pipeline accept', () => {
  beforeEach(() => {
    state.db.contracts = [];
    state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
    state.player = { level: 10 };

    const offer = {
      id: 'special_1',
      name: 'SP Podcast Series · podcast',
      pipeline: true,
      stages: [
        { label: 'Gravacio', type: 'recording', room_type: 'podcast_studio', duration_hours: 2, requirements: { room_type: 'podcast_studio' } },
        { label: 'Edicio', type: 'edit', room_type: 'edit_room', duration_hours: 1, requirements: { room_type: 'edit_room' } }
      ],
      stage_index: 0,
      stage_label: 'Gravacio',
      requirements: { room_type: 'podcast_studio' },
      duration_hours: 2,
      type: 'recording',
      base_pay: 300,
      target_quality: 70,
      special: true
    };
    state.market.specials = [offer];

    window.state = state;
    window.saveState = () => {};
    window.renderAll = () => {};
  });

  test('acceptSpecialOffer copies pipeline stages', () => {
    acceptSpecialOffer('special_1');
    const contract = state.db.contracts.find(c => c.id === 'contract_special_1');
    expect(contract).toBeTruthy();
    expect(contract.pipeline).toBe(true);
    expect(Array.isArray(contract.stages)).toBe(true);
    expect(contract.stage_index).toBe(0);
    expect(contract.requirements && contract.requirements.room_type).toBe('podcast_studio');
  });
});

import { acceptOffer } from '../client_market.js';
import { state } from '../state.js';

describe('offer pipeline accept', () => {
  beforeEach(() => {
    state.db.rooms = [
      { id: 'r1', type: 'podcast_studio', unlock_level: 1 },
      { id: 'r2', type: 'edit_room', unlock_level: 1 },
      { id: 'r3', type: 'control_room', unlock_level: 1 }
    ];
    state.roomsInstalled = [
      { mic: ['i1'] },
      { monitor: ['i1'] },
      { monitor: ['i1'] }
    ];
    state.player = { level: 10 };
    state.reputation = { overall: 50, byGenre: { podcast: 50, pop: 10 } };
    state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
    state.time = { day: 3, hour: 0, workHoursPerDay: 8 };
    state.db.contracts = [];

    window.state = state;
    window.saveState = () => {};
    window.renderAll = () => {};
  });

  test('acceptOffer copies pipeline stages into contract', () => {
    const pipelineOffer = {
      id: 'offer_test_1',
      name: 'Podcast Series · podcast',
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
      base_pay: 200,
      target_quality: 70
    };
    state.market.offers = [pipelineOffer];
    acceptOffer(pipelineOffer.id);
    const contract = state.db.contracts.find(c => c.id === `contract_${pipelineOffer.id}`);

    expect(contract).toBeTruthy();
    expect(contract.pipeline).toBe(true);
    expect(Array.isArray(contract.stages)).toBe(true);
    expect(contract.stages.length).toBeGreaterThan(1);
    expect(contract.stage_index).toBe(0);
    expect(contract.stage_label).toBeTruthy();
    expect(contract.requirements).toBeTruthy();
  });
});

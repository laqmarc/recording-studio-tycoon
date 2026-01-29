import { buildRoleDefs } from '../ui/people_logic.js';

describe('talent modes', () => {
  test('client_podcast uses engineer only', () => {
    const contract = {
      type: 'recording',
      genre: 'podcast',
      talent_mode: 'client_podcast',
      requirements: { mic_types: ['vocals', 'guitarra'] }
    };
    const defs = buildRoleDefs(contract);
    expect(defs.length).toBe(1);
    expect(defs[0].role).toBe('engineer');
  });

  test('client_band uses engineer only for recording', () => {
    const contract = {
      type: 'recording',
      genre: 'rock',
      talent_mode: 'client_band',
      requirements: { mic_types: ['bombo', 'caixa', 'hh', 'oh', 'guitarra'] }
    };
    const defs = buildRoleDefs(contract);
    expect(defs.length).toBe(1);
    expect(defs[0].role).toBe('engineer');
  });

  test('studio_musicians groups drum mics into one musician', () => {
    const contract = {
      type: 'recording',
      genre: 'rock',
      talent_mode: 'studio_musicians',
      requirements: { mic_types: ['bombo', 'caixa', 'hh', 'oh', 'guitarra'] }
    };
    const defs = buildRoleDefs(contract);
    const musicians = defs.filter(d => d.role === 'musician');
    const instruments = musicians.map(m => m.instrument);
    expect(musicians.length).toBe(2);
    expect(instruments).toContain('bombo');
    expect(instruments).toContain('guitarra');
  });
});

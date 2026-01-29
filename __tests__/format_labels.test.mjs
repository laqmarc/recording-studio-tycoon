import { formatContractTypeLabel, formatRoomLabel } from '../ui/shared.js';

describe('format labels', () => {
  test('formatContractTypeLabel returns Catalan labels', () => {
    expect(formatContractTypeLabel('recording')).toBe('Gravacio');
    expect(formatContractTypeLabel('mix')).toBe('Mescla');
    expect(formatContractTypeLabel('edit')).toBe('Edicio');
    expect(formatContractTypeLabel('mix_master')).toBe('Mescla + Mastering');
  });

  test('formatRoomLabel returns Catalan room names', () => {
    expect(formatRoomLabel('control_room')).toBe('Sala de Control');
    expect(formatRoomLabel('live_room')).toBe('Sala en directe');
    expect(formatRoomLabel('vocal_booth')).toBe('Cabina de veu');
    expect(formatRoomLabel('edit_room')).toBe("Sala d'Edicio");
  });
});

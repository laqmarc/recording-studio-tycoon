import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { clamp, avgStat, sumStat, xpToNext } = require('../lib/helpers');

describe('helpers', () => {
  test('clamp bounds', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
    expect(clamp(100, 0, 50)).toBe(50);
  });

  test('avgStat handles empty and values', () => {
    expect(avgStat([], 'foo')).toBe(0);
    const items = [ { stats: { a: 10 } }, { stats: { a: 30 } }, { stats: {} } ];
    expect(avgStat(items, 'a')).toBeCloseTo(20);
  });

  test('sumStat sums properly', () => {
    const items = [ { stats: { b: 2 } }, { stats: { b: 3 } }, { stats: {} } ];
    expect(sumStat(items, 'b')).toBe(5);
    expect(sumStat([], 'b')).toBe(0);
  });

  test('xpToNext grows with level and never below 200', () => {
    expect(xpToNext(1)).toBeGreaterThanOrEqual(200);
    expect(xpToNext(10)).toBeGreaterThan(xpToNext(1));
  });
});

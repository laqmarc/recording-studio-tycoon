// lib/helpers.js - pure helpers for node tests (ESM)
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function avgStat(items, key) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  let s = 0, n = 0;
  for (const it of items) {
    const stats = it && it.stats ? it.stats : {};
    if (stats[key] != null) { s += Number(stats[key]); n++; }
  }
  return n ? s / n : 0;
}
export function sumStat(items, key) {
  let s = 0;
  for (const it of (items || [])) {
    const stats = it && it.stats ? it.stats : {};
    s += Number(stats[key] || 0);
  }
  return s;
}
export function xpToNext(level) { return Math.max(200, Math.round(200 * Math.pow(level, 1.4))); }

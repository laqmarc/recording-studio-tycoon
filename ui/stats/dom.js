export function makeStat(label, value, hint) {
  const item = document.createElement('div');
  item.className = 'stat-item';
  const name = document.createElement('div');
  name.className = 'stat-label';
  name.textContent = label;
  const val = document.createElement('div');
  val.className = 'stat-value';
  val.textContent = value;
  item.appendChild(name);
  item.appendChild(val);
  if (hint) {
    const small = document.createElement('div');
    small.className = 'stat-hint';
    small.textContent = hint;
    item.appendChild(small);
  }
  return item;
}

export function makeBarRow(label, value, max, suffix = '') {
  const row = document.createElement('div');
  row.className = 'stat-bar-row';
  const left = document.createElement('div');
  left.className = 'stat-bar-label';
  left.textContent = label;
  const bar = document.createElement('div');
  bar.className = 'stat-bar';
  const fill = document.createElement('div');
  fill.className = 'stat-bar-fill';
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  fill.style.width = `${pct}%`;
  const right = document.createElement('div');
  right.className = 'stat-bar-value';
  right.textContent = `${value}${suffix}`;
  bar.appendChild(fill);
  row.appendChild(left);
  row.appendChild(bar);
  row.appendChild(right);
  return row;
}

export function createStatGrid(stats) {
  const grid = document.createElement('div');
  grid.className = 'stat-grid';
  stats.forEach(stat => {
    grid.appendChild(makeStat(stat.label, stat.value, stat.hint));
  });
  return grid;
}

export function createPanel(title, subtitle, full = false) {
  const panel = document.createElement('section');
  panel.className = full ? 'panel full' : 'panel';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  if (subtitle) {
    const small = document.createElement('small');
    small.textContent = subtitle;
    h2.appendChild(small);
  }
  const content = document.createElement('div');
  content.className = 'content';
  panel.appendChild(h2);
  panel.appendChild(content);
  return { panel, content };
}

export function createPanelWithGrid(title, stats, full = false, subtitle = null) {
  const panel = createPanel(title, subtitle, full);
  panel.content.appendChild(createStatGrid(stats));
  return panel;
}

export function createPanelWithBars(title, entries, max, suffix = '', full = false) {
  const panel = createPanel(title, null, full);
  panel.content.appendChild(buildBars(entries, max, suffix));
  return panel;
}

export function buildLineChart(values, color) {
  const wrap = document.createElement('div');
  wrap.className = 'chart chart-line';
  if (!values.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'Sense dades';
    wrap.appendChild(empty);
    return wrap;
  }

  const Chart = getChartGlobal();
  if (Chart && typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.className = 'chart-canvas';
    wrap.appendChild(canvas);
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx) {
      const stroke = color || getAccentColor();
      const gradient = ctx.createLinearGradient(0, 0, 0, 120);
      gradient.addColorStop(0, hexToRgba(stroke, 0.35));
      gradient.addColorStop(1, hexToRgba(stroke, 0));
      const axisColor = getAxisColor();
      const gridColor = getGridColor();
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const pad = Math.max(1, (maxVal - minVal) * 0.1);
      try {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: values.map((_, i) => String(i + 1)),
            datasets: [{
              data: values,
              borderColor: stroke,
              backgroundColor: gradient,
              borderWidth: 2,
              tension: 0.35,
              pointRadius: 2,
              pointHoverRadius: 4,
              pointBackgroundColor: stroke,
              pointBorderColor: hexToRgba(stroke, 0.4),
              pointBorderWidth: 1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600 },
            layout: { padding: { left: 6, right: 6, top: 8, bottom: 4 } },
            plugins: {
              legend: { display: false },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: () => '',
                  label: ctx => ` ${ctx.parsed.y}`
                }
              }
            },
            interaction: { mode: 'index', intersect: false },
            scales: {
              x: {
                display: true,
                grid: { color: gridColor, lineWidth: 1 },
                border: { color: gridColor },
                ticks: {
                  color: axisColor,
                  maxTicksLimit: Math.min(8, values.length),
                  padding: 6,
                  font: { size: 10 }
                }
              },
              y: {
                display: true,
                grid: { color: gridColor, lineWidth: 1 },
                border: { color: gridColor },
                ticks: {
                  color: axisColor,
                  maxTicksLimit: 6,
                  padding: 6,
                  font: { size: 10 }
                },
                suggestedMin: minVal - pad,
                suggestedMax: maxVal + pad
              }
            }
          }
        });
        return wrap;
      } catch (e) {
        wrap.removeChild(canvas);
      }
    }
    wrap.textContent = '';
  }

  const max = Math.max(1, ...values);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 40');
  svg.classList.add('chart-line-svg');
  const points = values.map((v, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 100;
    const y = 40 - (v / max) * 34 - 3;
    return `${x},${y}`;
  }).join(' ');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', points);
  line.setAttribute('class', 'chart-line-path');
  if (color) line.style.stroke = color;
  svg.appendChild(line);
  wrap.appendChild(svg);
  return wrap;
}

function getChartGlobal() {
  if (typeof globalThis !== 'undefined' && globalThis.Chart) return globalThis.Chart;
  return null;
}

function getAccentColor() {
  const css = getCssVar('--acc');
  return css || '#23d9a0';
}

function getAxisColor() {
  const css = getCssVar('--muted');
  return css || 'rgba(255, 255, 255, 0.7)';
}

function getGridColor() {
  const css = getCssVar('--grid-line') || getCssVar('--line');
  if (!css) return 'rgba(255, 255, 255, 0.12)';
  if (css.startsWith('#')) return hexToRgba(css, 0.25);
  return css;
}

function getCssVar(name) {
  if (typeof document === 'undefined') return '';
  const root = document.documentElement;
  if (!root) return '';
  const val = getComputedStyle(root).getPropertyValue(name);
  return (val || '').trim();
}

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string') return `rgba(35, 217, 160, ${alpha})`;
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return `rgba(35, 217, 160, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return `rgba(35, 217, 160, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildBars(entries, max, suffix = '') {
  const wrap = document.createElement('div');
  wrap.className = 'chart chart-bars';
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'Sense dades';
    wrap.appendChild(empty);
    return wrap;
  }
  const maxVal = max || Math.max(1, ...entries.map(e => Number(e.value || 0)));

  const Chart = getChartGlobal();
  if (Chart && typeof document !== 'undefined') {
    wrap.classList.add('chart-canvas-wrap');
    const canvas = document.createElement('canvas');
    canvas.className = 'chart-canvas';
    const height = Math.max(140, entries.length * 26);
    canvas.height = height;
    canvas.style.height = `${height}px`;
    wrap.appendChild(canvas);
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx) {
      const accent = getAccentColor();
      const gradient = ctx.createLinearGradient(0, 0, 200, 0);
      gradient.addColorStop(0, hexToRgba(accent, 0.85));
      gradient.addColorStop(1, hexToRgba(accent, 0.25));
      const axisColor = getAxisColor();
      try {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: entries.map(e => e.label),
            datasets: [{
              data: entries.map(e => Number(e.value || 0)),
              backgroundColor: gradient,
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600 },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: ctx => ` ${ctx.parsed.x}${suffix}`
                }
              }
            },
            scales: {
              x: {
                display: true,
                beginAtZero: true,
                max: maxVal,
                grid: { color: gridColor, lineWidth: 1 },
                border: { color: gridColor },
                ticks: {
                  color: axisColor,
                  maxTicksLimit: 6,
                  padding: 6,
                  font: { size: 10 }
                }
              },
              y: {
                grid: { color: gridColor, lineWidth: 1 },
                border: { color: gridColor },
                ticks: {
                  color: axisColor,
                  font: { size: 11 },
                  padding: 6
                }
              }
            }
          }
        });
        return wrap;
      } catch (e) {
        wrap.removeChild(canvas);
      }
    }
    wrap.textContent = '';
  }

  for (const entry of entries) {
    const row = document.createElement('div');
    row.className = 'chart-bar-row';
    const label = document.createElement('div');
    label.className = 'chart-bar-label';
    label.textContent = entry.label;
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    const fill = document.createElement('div');
    fill.className = 'chart-bar-fill';
    const pct = maxVal > 0 ? Math.min(100, Math.round((entry.value / maxVal) * 100)) : 0;
    fill.style.width = `${pct}%`;
    const value = document.createElement('div');
    value.className = 'chart-bar-value';
    value.textContent = `${entry.value}${suffix}`;
    bar.appendChild(fill);
    row.appendChild(label);
    row.appendChild(bar);
    row.appendChild(value);
    wrap.appendChild(row);
  }
  return wrap;
}

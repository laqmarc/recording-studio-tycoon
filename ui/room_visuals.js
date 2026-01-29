import { state } from '../state.js';

// Removed signal flow functionality as requested
/*
export function renderSignalFlowOverlay(canvas, floorplan) {
  if (!canvas || !floorplan) return;
  const old = canvas.querySelector('.signal-flow');
  if (old) old.remove();
  if (!state.ui || !state.ui.showSignalFlow) return;

  const zones = {};
  floorplan.querySelectorAll('.floor-zone').forEach(zone => {
    const cat = zone.dataset.category;
    zones[cat] = zone;
  });

  const pairs = [
    ['mic', 'preamp'],
    ['mic', 'preamp_multi'],
    ['preamp', 'interface'],
    ['preamp_multi', 'interface'],
    ['interface', 'software'],
    ['interface', 'software_mix_master'],
    ['interface', 'software_vst']
  ];

  const rect = floorplan.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('signal-flow');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const lines = [];
  for (const [from, to] of pairs) {
    const a = zones[from];
    const b = zones[to];
    if (!a || !b) continue;
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    const x1 = (aRect.left - rect.left) + aRect.width / 2;
    const y1 = (aRect.top - rect.top) + aRect.height / 2;
    const x2 = (bRect.left - rect.left) + bRect.width / 2;
    const y2 = (bRect.top - rect.top) + bRect.height / 2;
    lines.push({ x1, y1, x2, y2 });
  }

  for (const line of lines) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (line.x1 + line.x2) / 2;
    const d = `M ${line.x1} ${line.y1} Q ${midX} ${line.y1 - 18} ${line.x2} ${line.y2}`;
    path.setAttribute('d', d);
    path.setAttribute('class', 'flow-line');
    svg.appendChild(path);

    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'flow-line glow');
    svg.appendChild(glow);
  }

  canvas.appendChild(svg);
}
*/

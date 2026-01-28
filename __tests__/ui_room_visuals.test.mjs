/** @jest-environment jsdom */

import { renderSignalFlowOverlay } from '../ui/room_visuals.js';

describe('ui/room_visuals', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.ui = { showSignalFlow: true };
  });

  test('does nothing when showSignalFlow is false', () => {
    state.ui.showSignalFlow = false;
    const canvas = document.createElement('div');
    const floor = document.createElement('div');
    renderSignalFlowOverlay(canvas, floor);
    expect(canvas.querySelector('svg')).toBeNull();
  });

  test('renders svg paths when zones available', () => {
    const canvas = document.createElement('div');
    const floor = document.createElement('div');
    const mic = document.createElement('div'); mic.className = 'floor-zone'; mic.dataset.category = 'mic';
    const pre = document.createElement('div'); pre.className = 'floor-zone'; pre.dataset.category = 'preamp';
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    floor.getBoundingClientRect = () => rect;
    mic.getBoundingClientRect = () => ({ left: 10, top: 10, width: 10, height: 10 });
    pre.getBoundingClientRect = () => ({ left: 60, top: 10, width: 10, height: 10 });
    floor.appendChild(mic); floor.appendChild(pre);
    canvas.appendChild(floor);

    renderSignalFlowOverlay(canvas, floor);
    const svg = canvas.querySelector('svg.signal-flow');
    expect(svg).toBeTruthy();
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBe(2);
  });
});

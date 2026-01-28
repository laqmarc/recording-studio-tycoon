/** @jest-environment jsdom */

import { renderOffers } from '../ui/offers.js';
import { renderPersonnelPanel } from '../ui/people.js';

describe('ui/offers', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="clientOffers"></div>`;
    state.db.rooms = [{ id: 'r1', type: 'control_room' }];
    state.roomsInstalled = [{}];
    state.itemsById = new Map();
    state.selected.roomIndex = 0;
  });

  test('renders empty state when no offers', () => {
    state.market = { offers: [] };
    renderOffers();
    expect(document.getElementById('clientOffers').textContent).toMatch(/No hi ha ofertes avui/);
  });

  test('renders offers and handles accept/decline', () => {
    let accepted = null;
    let declined = null;
    window.acceptOffer = (id) => { accepted = id; };
    window.declineOffer = (id) => { declined = id; };

    state.market = {
      offers: [
        { id: 'o1', name: 'Podcast', type: 'recording', duration_hours: 2, base_pay: 100, target_quality: 50, deadline_days: 3, requirements: {} }
      ]
    };
    renderOffers();
    const buttons = document.querySelectorAll('#clientOffers button');
    expect(buttons.length).toBe(2);
    buttons[0].click();
    buttons[1].click();
    expect(accepted).toBe('o1');
    expect(declined).toBe('o1');
  });
});

describe('ui/people', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `<div id="personnelPanel"></div>`;
    state.db.people = [
      { id: 'm1', name: 'Mia', role: 'musician', instruments: ['vocals'], skill: 60, fee_per_hour: 20, unlock_level: 1 },
      { id: 't1', name: 'Toni', role: 'technician', skill: 50, fee_per_hour: 15, unlock_level: 1 },
      { id: 'm2', name: 'Locked', role: 'musician', instruments: ['guitarra'], skill: 70, fee_per_hour: 25, unlock_level: 3 }
    ];
    state.player = { level: 1 };
    state.hiredPeople = ['m1'];
    state.db.contracts = [];
    window.saveState = () => {};
  });

  test('renders hired, available, and locked sections', () => {
    renderPersonnelPanel({ renderAll: () => {} });
    const panel = document.getElementById('personnelPanel');
    expect(panel.textContent).toMatch(/Contractats/);
    expect(panel.textContent).toMatch(/Disponibles/);
    expect(panel.textContent).toMatch(/Bloquejats/);
    expect(panel.textContent).toMatch(/Mia/);
    expect(panel.textContent).toMatch(/Toni/);
    expect(panel.textContent).toMatch(/Locked/);
  });

  test('can hire and fire from panel', () => {
    let rerenders = 0;
    renderPersonnelPanel({ renderAll: () => { rerenders += 1; } });
    const hireBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Contractar');
    hireBtn.click();
    expect(state.hiredPeople).toContain('t1');
    const fireBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Descontractar');
    fireBtn.click();
    expect(state.hiredPeople).not.toContain('m1');
    expect(rerenders).toBeGreaterThan(0);
  });
});

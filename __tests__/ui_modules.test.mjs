/** @jest-environment jsdom */

import { clearChildren, createBadge, createArt, formatStatKey, getItemArt, getPrimaryStat, getRoomArt, getTopStats } from '../ui/shared.js';
import { ensurePeopleData, getPeopleByIdMap, buildRoleDefs, getPeopleOptions, assignContractPeople } from '../ui/people_logic.js';
import { getRequirementsElement } from '../ui/requirements.js';
import { calcRoomRepairCost, repairRoomItems } from '../ui/room_maintenance.js';
import { getUpgradeMeta, getUpgradeCost, applyRoomUpgrade } from '../ui/room_upgrades.js';
import { setPage, initPageNav } from '../ui/nav.js';

describe('ui/shared helpers', () => {
  test('getRoomArt uses mapped and default assets', () => {
    expect(getRoomArt({ type: 'live_room' })).toBe('assets/rooms/live_room.svg');
    expect(getRoomArt({ type: 'unknown' })).toBe('assets/rooms/control_room.svg');
    expect(getRoomArt(null)).toBe('assets/rooms/control_room.svg');
  });

  test('getItemArt uses category and default', () => {
    expect(getItemArt({ category: 'monitor' })).toBe('assets/items/monitor.svg');
    expect(getItemArt({ category: 'missing' })).toBe('assets/items/console.svg');
    expect(getItemArt(null)).toBe('assets/items/console.svg');
  });

  test('formatStatKey maps labels and truncates', () => {
    expect(formatStatKey('mic_quality')).toBe('Mic');
    expect(formatStatKey('some_long_key_name')).toBe('some long ke');
  });

  test('getPrimaryStat prefers category key', () => {
    const item = { category: 'mic', stats: { mic_quality: 10, other: 99 } };
    expect(getPrimaryStat(item).key).toBe('mic_quality');
  });

  test('getTopStats sorts and limits', () => {
    const item = { stats: { a: 1, b: 5, c: 3 } };
    const top = getTopStats(item, 2).map(s => s.key);
    expect(top).toEqual(['b', 'c']);
  });

  test('createBadge renders class and text', () => {
    const badge = createBadge('Test', 'badge--risk', 'high');
    expect(badge.className).toContain('badge');
    expect(badge.className).toContain('badge--risk');
    expect(badge.classList.contains('high')).toBe(true);
    expect(badge.textContent).toBe('Test');
  });

  test('clearChildren removes all nodes', () => {
    const el = document.createElement('div');
    el.appendChild(document.createElement('span'));
    el.appendChild(document.createElement('span'));
    clearChildren(el);
    expect(el.children.length).toBe(0);
  });

  test('createArt builds art wrapper', () => {
    const art = createArt('assets/items/monitor.svg', 'Monitor');
    expect(art.className).toBe('card-art');
    expect(art.querySelector('img').getAttribute('alt')).toBe('Monitor');
  });
});

describe('ui/people_logic', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db = { items: [], rooms: [], contracts: [], people: [] };
    state.hiredPeople = [];
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    if (typeof window !== 'undefined') window.PEOPLE = undefined;
  });

  test('ensurePeopleData seeds fallback when empty', () => {
    expect(state.db.people.length).toBe(0);
    ensurePeopleData();
    expect(state.db.people.length).toBeGreaterThan(0);
    expect(Array.isArray(window.PEOPLE)).toBe(true);
  });

  test('getPeopleByIdMap includes self roles', () => {
    ensurePeopleData();
    const map = getPeopleByIdMap();
    expect(map.has('self_engineer')).toBe(true);
    expect(map.has('self_producer')).toBe(true);
  });

  test('buildRoleDefs returns expected roles', () => {
    const contract = { type: 'production', requirements: { mic_types: ['vocals'] }, genre: 'pop' };
    const roles = buildRoleDefs(contract).map(r => r.role);
    expect(roles).toContain('musician');
    expect(roles).toContain('producer');
  });

  test('getPeopleOptions includes self for non-musician', () => {
    state.db.people = [
      { id: 'eng1', name: 'Eng', role: 'engineer', skill: 50, genres: ['any'] },
      { id: 'mus1', name: 'Mus', role: 'musician', skill: 60, genres: ['any'], instruments: ['vocals'] }
    ];
    state.hiredPeople = ['eng1', 'mus1'];
    const opts = getPeopleOptions('engineer', 'any');
    expect(opts[0].id).toBe('self_engineer');
  });

  test('assignContractPeople uses self for engineer', () => {
    state.db.people = [];
    const contract = { id: 'c1', type: 'mix', requirements: {}, genre: 'any' };
    const assigned = assignContractPeople(contract);
    expect(assigned).toContain('self_engineer');
  });
});

describe('ui/requirements', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.db = { items: [], rooms: [{ type: 'live_room' }], contracts: [], people: [] };
    state.roomsInstalled = [{}];
    state.itemsById = new Map([
      ['m1', { id: 'm1', category: 'mic', type: ['vocals'], stats: {} }]
    ]);
    state.time = { day: 1, hour: 0, workHoursPerDay: 8 };
  });

  test('getRequirementsElement returns null for empty requirements', () => {
    const el = getRequirementsElement({ requirements: {} }, 0);
    expect(el).toBeNull();
  });

  test('getRequirementsElement renders requirement lines', () => {
    state.roomsInstalled = [{ mic: ['m1'], mic_stand: [] }];
    const contract = {
      requirements: { room_type: 'live_room', mic_types: ['vocals', 'guitarra'], min_items: { mic: 1 } },
      deadline_days: 2,
      start_day: 1
    };
    const el = getRequirementsElement(contract, 0);
    expect(el).toBeTruthy();
    const text = el.textContent;
    expect(text).toMatch(/Sala: live_room/);
    expect(text).toMatch(/Mic vocals/);
    expect(text).toMatch(/Mic guitarra/);
  });
});

describe('ui/room_maintenance', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.itemsById = new Map([
      ['i1', { id: 'i1', price: 100 }]
    ]);
    state.roomsInstalled = [{ misc: ['i1'] }];
    state.itemCondition = new Map([['i1', 80]]);
    state.cash = 100;
  });

  test('calcRoomRepairCost computes wear cost', () => {
    const cost = calcRoomRepairCost(0);
    expect(cost).toBe(5);
  });

  test('repairRoomItems restores condition and deducts cash', () => {
    repairRoomItems(0);
    expect(state.itemCondition.get('i1')).toBe(100);
    expect(state.cash).toBe(95);
  });
});

describe('ui/room_upgrades', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    state.roomUpgrades = {};
    state.cash = 1000;
  });

  test('getUpgradeMeta returns defaults', () => {
    const meta = getUpgradeMeta(0);
    expect(meta.upgrades.acoustic).toBe(0);
    expect(meta.limits.slots).toBeGreaterThan(0);
  });

  test('applyRoomUpgrade increases level and reduces cash', () => {
    const cost = getUpgradeCost('acoustic', 0);
    applyRoomUpgrade(0, 'acoustic');
    expect(state.roomUpgrades[0].acoustic).toBe(1);
    expect(state.cash).toBe(1000 - cost);
  });

  test('applyRoomUpgrade does nothing when cash insufficient', () => {
    state.cash = 0;
    applyRoomUpgrade(0, 'acoustic');
    expect(state.roomUpgrades[0]).toBeUndefined();
  });
});

describe('ui/nav', () => {
  let state;
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    state = stateMod.state;
    document.body.innerHTML = `
      <button data-page-tab="rooms"></button>
      <button data-page-tab="shop"></button>
    `;
    state.ui = { page: 'rooms' };
  });

  test('setPage updates body attribute and active tab', () => {
    setPage('shop');
    expect(document.body.getAttribute('data-page')).toBe('shop');
    const tabs = document.querySelectorAll('[data-page-tab]');
    expect(tabs[1].classList.contains('active')).toBe(true);
  });

  test('initPageNav wires click handlers', () => {
    initPageNav();
    const shopBtn = document.querySelectorAll('[data-page-tab]')[1];
    shopBtn.click();
    expect(state.ui.page).toBe('shop');
  });
});

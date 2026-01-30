import path from 'path';
import { pathToFileURL } from 'url';
import { JSDOM } from 'jsdom';

beforeEach(() => {
  // ensure a jsdom-like global `window` exists
  if (typeof global.window === 'undefined') {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = { userAgent: 'node.js' };
  }

  // reset global window state for each test
  global.window.state = {
    time: { day: 1, hour: 2, workHoursPerDay: 8 },
    player: { level: 1, xp: 0, fatigue: 0 },
    db: { items: [], rooms: [], contracts: [] },
    itemsById: new Map(),
    itemsByCategory: new Map(),
    inventory: new Map(),
    selected: { roomIndex: 0, shopItemId: null },
    roomsInstalled: []
  };
});

test('getContractETA returns same-day ETA when hours remaining fit today', async () => {
  const file = pathToFileURL(path.resolve(__dirname, '..', 'esm', 'actions.mjs')).href;
  const mod = await import(file);
  const contract = { worked_hours: 1, duration_hours: 3 };
  const eta = mod.getContractETA(contract);
  expect(eta.hours).toBe(2);
  expect(eta.days).toBe(0);
});

test('workOnContract delegates to window.workOnContract when present', async () => {
  const file = pathToFileURL(path.resolve(__dirname, '..', 'esm', 'actions.mjs')).href;
  const mod = await import(file);
  // prepare a contract in state and stub dependencies
  global.window.state.db.contracts.push({ id: 'c1', duration_hours: 3, worked_hours: 0, name: 'C1', requirements: {} });
  global.window.installedIds = () => [];
  global.window.simulateContract = jest.fn(() => true);
  global.window.log = jest.fn();
  mod.workOnContract('c1', 2);
  expect(global.window.state.db.contracts[0].worked_hours).toBe(2);
});

test('buySelected purchases an item and updates inventory', async () => {
  const file = pathToFileURL(path.resolve(__dirname, '..', 'esm', 'actions.mjs')).href;
  const mod = await import(file);
  // setup DOM qty input
  const qty = document.createElement('input'); qty.id = 'qtyBuy'; qty.value = '1'; document.body.appendChild(qty);
  // setup item in state
  const item = { id: 'i1', name: 'Item1', price: 10, category: 'misc', unlock_level: 1 };
  global.window.state.db.items.push(item);
  global.window.state.itemsById.set('i1', item);
  global.window.state.itemsByCategory.set('misc', [item]);
  global.window.state.selected.shopItemId = 'i1';
  global.window.invAdd = jest.fn();
  global.window.saveState = jest.fn();
  global.window.log = jest.fn();
  global.window.showNotification = jest.fn();
  mod.buySelected();
  expect(global.window.invAdd).toHaveBeenCalledWith('i1', 1);
});

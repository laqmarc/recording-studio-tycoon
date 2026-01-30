/** @jest-environment jsdom */

describe('people_loader success', () => {
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    stateMod.state.db.people = [];
    window.state = stateMod.state;
    window.renderAll = () => { window.__rendered = true; };
    window.__rendered = false;
  });

  test('loads people.json when fetch succeeds', async () => {
    const payload = [{ id: 'p1', name: 'Mia' }];
    window.PEOPLE = null;
    window.__eventCount = 0;
    window.addEventListener('people-ready', () => { window.__eventCount += 1; });
    global.fetch = async () => ({ json: async () => payload });

    const url = new URL('../people_loader.js', import.meta.url);
    url.search = `?ok=${Math.random()}`;
    await import(url.href);
    await new Promise(r => setTimeout(r, 0));

    expect(Array.isArray(window.PEOPLE)).toBe(true);
    expect(window.PEOPLE[0].id).toBe('p1');
    expect(window.state.db.people[0].id).toBe('p1');
    expect(window.__eventCount).toBeGreaterThan(0);
  });
});

/** @jest-environment jsdom */

describe('people_loader fallback', () => {
  beforeEach(async () => {
    const stateMod = await import('../state.js');
    stateMod.state.db.people = [];
    window.state = stateMod.state;
    window.renderAll = () => { window.__rendered = true; };
    window.__rendered = false;
  });

  test('falls back when fetch fails', async () => {
    window.PEOPLE = null;
    window.__eventCount = 0;
    window.addEventListener('people-ready', () => { window.__eventCount += 1; });
    global.fetch = async () => { throw new Error('fail'); };

    const url = new URL('../people_loader.js', import.meta.url);
    url.search = `?fail=${Math.random()}`;
    await import(url.href);
    await new Promise(r => setTimeout(r, 0));

    expect(Array.isArray(window.PEOPLE)).toBe(true);
    expect(window.PEOPLE.length).toBeGreaterThan(0);
    expect(window.state.db.people.length).toBeGreaterThan(0);
    expect(window.__eventCount).toBeGreaterThan(0);
  });
});

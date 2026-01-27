// people_loader.js - loads people.json and exposes it on window.PEOPLE
async function loadPeople() {
  try {
    const res = await fetch('people.json');
    const data = await res.json();
    if (typeof window !== 'undefined') {
      window.PEOPLE = data;
      if (window.DEMO) window.DEMO.people = data;
      if (window.state && window.state.db) {
        window.state.db.people = data;
        if (typeof window.renderAll === 'function') window.renderAll();
      }
      window.dispatchEvent(new CustomEvent('people-ready'));
    }
  } catch (e) {
    console.warn('people.json load failed', e);
  }
}

loadPeople();

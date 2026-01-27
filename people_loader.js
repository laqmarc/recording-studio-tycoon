// people_loader.js - loads people.json and exposes it on window.PEOPLE
import { PEOPLE_FALLBACK } from './people_data.js';

function maybeLoadDemo() {
  try {
    if (typeof window === 'undefined') return;
    if (window.__demoLoaded) return;
    if (window.DEMO && window.PEOPLE) window.DEMO.people = window.PEOPLE;
    if (window.DEMO && typeof window.loadFromObject === 'function') {
      window.__demoLoaded = true;
      window.loadFromObject(window.DEMO);
    }
  } catch (e) {}
}

function seedPeopleFallback() {
  try {
    if (typeof window === 'undefined') return;
    if (!window.PEOPLE || !Array.isArray(window.PEOPLE) || !window.PEOPLE.length) {
      window.PEOPLE = PEOPLE_FALLBACK;
    }
    if (window.state && window.state.db && (!Array.isArray(window.state.db.people) || !window.state.db.people.length)) {
      window.state.db.people = window.PEOPLE;
    }
    window.dispatchEvent(new CustomEvent('people-ready'));
  } catch (e) {}
}

async function loadPeople() {
  try {
    const res = await fetch('people.json');
    const data = await res.json();
    if (typeof window !== 'undefined') {
      window.PEOPLE = data;
      if (window.DEMO) window.DEMO.people = data;
      if (window.state && window.state.db) window.state.db.people = data;
      window.dispatchEvent(new CustomEvent('people-ready'));
    }
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    maybeLoadDemo();
  } catch (e) {
    console.warn('people.json load failed', e);
    try {
      if (typeof window !== 'undefined') {
        window.PEOPLE = PEOPLE_FALLBACK;
        if (window.DEMO) window.DEMO.people = PEOPLE_FALLBACK;
        if (window.state && window.state.db) window.state.db.people = PEOPLE_FALLBACK;
        window.dispatchEvent(new CustomEvent('people-ready'));
      }
      if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
      maybeLoadDemo();
    } catch (err) {}
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('demo-ready', maybeLoadDemo, { once: true });
}

loadPeople();
seedPeopleFallback();

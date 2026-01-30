// demo.js - demo dataset
const DEMO = {
  "items": [],
  "rooms": [],
  "contracts": []
};

// Remove preset contracts; focus on client offers
DEMO.contracts = [];

if (typeof window !== "undefined") {
  window.DEMO = DEMO;
  if (window.PEOPLE) {
    DEMO.people = window.PEOPLE;
  }
  window.dispatchEvent(new CustomEvent('demo-ready'));
}

// items_loader.js - loads items by category and injects into DEMO/state

async function loadItemsIndex() {
  const res = await fetch('items/index.json');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.files)) return data.files;
  if (Array.isArray(data.categories)) return data.categories.map(cat => `items/${cat}.json`);
  return [];
}

function setItems(items) {
  if (typeof window === 'undefined') return;
  window.ITEMS = items;
  window.__itemsLoaded = true;
  if (window.DEMO) window.DEMO.items = items;
  if (window.state && window.state.db) window.state.db.items = items;
  window.dispatchEvent(new CustomEvent('items-ready'));
}

function maybeLoadDemo() {
  try {
    if (typeof window === 'undefined') return;
    if (window.__demoLoaded) return;
    const hasItems = window.__itemsLoaded || (Array.isArray(window.ITEMS) && window.ITEMS.length);
    const hasPeople = Array.isArray(window.PEOPLE) && window.PEOPLE.length;
    const hasRooms = window.__roomsLoaded || (Array.isArray(window.ROOMS) && window.ROOMS.length);
    if (window.DEMO && hasItems && hasPeople && hasRooms && typeof window.loadFromObject === 'function') {
      window.__demoLoaded = true;
      window.loadFromObject(window.DEMO);
    }
  } catch (e) {}
}

async function loadItems() {
  try {
    const files = await loadItemsIndex();
    const items = [];
    for (const file of files) {
      const res = await fetch(file);
      const data = await res.json();
      if (Array.isArray(data)) items.push(...data);
      else if (Array.isArray(data.items)) items.push(...data.items);
    }
    setItems(items);
    maybeLoadDemo();
  } catch (e) {
    try {
      const res = await fetch('items_master.json.old');
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      setItems(items);
      maybeLoadDemo();
    } catch (err) {
      setItems([]);
      maybeLoadDemo();
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('demo-ready', maybeLoadDemo, { once: true });
  window.addEventListener('people-ready', maybeLoadDemo, { once: true });
  window.addEventListener('rooms-ready', maybeLoadDemo, { once: true });
}

loadItems();

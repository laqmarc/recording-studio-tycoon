// rooms_loader.js - loads rooms by type and injects into DEMO/state

async function loadRoomsIndex() {
  const res = await fetch('rooms/index.json');
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.files)) return data.files;
  if (Array.isArray(data.types)) return data.types.map(t => `rooms/${t}.json`);
  return [];
}

function setRooms(rooms) {
  if (typeof window === 'undefined') return;
  window.ROOMS = rooms;
  window.__roomsLoaded = true;
  if (window.DEMO) window.DEMO.rooms = rooms;
  if (window.state && window.state.db) window.state.db.rooms = rooms;
  window.dispatchEvent(new CustomEvent('rooms-ready'));
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

async function loadRooms() {
  try {
    const files = await loadRoomsIndex();
    const rooms = [];
    for (const file of files) {
      const res = await fetch(file);
      const data = await res.json();
      if (Array.isArray(data)) rooms.push(...data);
      else if (Array.isArray(data.rooms)) rooms.push(...data.rooms);
    }
    setRooms(rooms);
    maybeLoadDemo();
  } catch (e) {
    try {
      const res = await fetch('rooms_master.json');
      const data = await res.json();
      const rooms = Array.isArray(data.rooms) ? data.rooms : [];
      setRooms(rooms);
      maybeLoadDemo();
    } catch (err) {
      setRooms([]);
      maybeLoadDemo();
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('demo-ready', maybeLoadDemo, { once: true });
  window.addEventListener('people-ready', maybeLoadDemo, { once: true });
  window.addEventListener('items-ready', maybeLoadDemo, { once: true });
}

loadRooms();

// ui_render.mjs - ES module renderer (moved from ui_render.js)
import { state } from './state.js';
import { getContractETA as getContractETA_impl, workOnContract as workOnContract_impl } from './actions.js';
import { renderOffers } from './ui/offers.js';
import { renderPersonnelPanel } from './ui/people.js';
import { renderScheduleBoard } from './ui/schedule.js';
import { renderReputationPanels } from './ui/reputation.js';
import { renderShop as renderShopImpl } from './ui/shop.js';
import { renderRooms as renderRoomsImpl } from './ui/rooms.js';
import { renderRoomDetails } from './ui/room_details.js';
import { renderStatsPage } from './ui/stats.js';
import { assignContractPeople, ensurePeopleData } from './ui/people_logic.js';
import { getRequirementsElement } from './ui/requirements.js';
import { clearChildren } from './ui/shared.js';
import { initPageNav, setPage } from './ui/nav.js';

export { getRequirementsElement };

ensurePeopleData();

// If tests (or other legacy code) provided a global `state`, merge it into the imported module state
if (typeof globalThis !== 'undefined' && globalThis.state && typeof state === 'object') {
  try { Object.assign(state, globalThis.state); } catch (e) { /* ignore */ }
}

export function renderAll() {
  ensurePeopleData();
  const moneyEl = document.getElementById('money');
  if (moneyEl) moneyEl.textContent = `Cash: ${Math.round(state.cash)}€`;
  renderRooms();
  renderShop();
  renderRight();
  renderStatsPage();
}

export function renderRooms() {
  renderRoomsImpl({ renderAll });
  renderReputationPanels();
  renderOffers();
  renderPersonnelPanel({ renderAll });
  renderScheduleBoard({ renderAll });
}

export function renderShop() {
  renderShopImpl({
    renderRight,
    renderAll
  });
}

export function renderRight() {
  renderRoomDetails({
    renderRight,
    renderAll
  });
}

// Attach to window for legacy code
if (typeof window !== 'undefined') {
  window.renderAll = window.renderAll || renderAll;
  window.renderRooms = window.renderRooms || renderRooms;
  window.renderShop = window.renderShop || renderShop;
  window.renderRight = window.renderRight || renderRight;
  window.getRequirementsElement = window.getRequirementsElement || getRequirementsElement;
  window.clearChildren = window.clearChildren || clearChildren;
  window.setPage = window.setPage || setPage;
  window.assignContractPeople = window.assignContractPeople || assignContractPeople;
  // ensure action bindings point to module impl when available
  window.getContractETA = window.getContractETA || getContractETA_impl;
  window.workOnContract = window.workOnContract || workOnContract_impl;
}

if (typeof document !== 'undefined') {
  initPageNav();
}

// If data was loaded before this module initialized (DEMO loaded and persistence.loadFromObject ran), render now
if (typeof window !== 'undefined' && typeof window.renderAll === 'function' && window.state && window.state.db && ((window.state.db.items && window.state.db.items.length) || (window.state.db.contracts && window.state.db.contracts.length))) {
  try { window.renderAll(); } catch (e) { /* ignore render errors at load time */ }
}

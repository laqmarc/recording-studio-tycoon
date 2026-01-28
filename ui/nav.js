import { state } from '../state.js';

export function setPage(page) {
  const normalized = (page === 'contracts' || page === 'shop' || page === 'rooms' || page === 'people') ? page : 'rooms';
  state.ui = state.ui || { page: 'rooms' };
  state.ui.page = normalized;
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-page', normalized);
    document.querySelectorAll('[data-page-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-page-tab') === normalized);
    });
  }
}

export function initPageNav() {
  const tabs = document.querySelectorAll('[data-page-tab]');
  if (!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => setPage(btn.getAttribute('data-page-tab')));
  });
  setPage((state.ui && state.ui.page) ? state.ui.page : 'rooms');
}

import { state } from '../state.js';

function clearChildren(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

function renderRepContent(panel) {
  const repHeader = document.createElement('div'); repHeader.className = 'rep-header';
  const repTitle = document.createElement('div'); repTitle.className = 'rep-title'; repTitle.textContent = 'Reputacio per genere';
  const repValue = document.createElement('div'); repValue.className = 'rep-total';
  const overall = state.reputation ? Number(state.reputation.overall || 0) : 0;
  repValue.textContent = `Total ${overall}`;
  repHeader.appendChild(repTitle); repHeader.appendChild(repValue);
  panel.appendChild(repHeader);

  const repBars = document.createElement('div'); repBars.className = 'rep-bars';
  const byGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const entries = Object.entries(byGenre).sort((a,b)=>Number(b[1])-Number(a[1]));
  if (!entries.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Encara no tens reputacio per genere.';
    panel.appendChild(empty);
  } else {
    const max = Math.max(1, ...entries.map(e => Number(e[1]) || 0));
    for (const [genre, value] of entries) {
      const row = document.createElement('div'); row.className = 'rep-row';
      const label = document.createElement('div'); label.className = 'rep-label'; label.textContent = genre;
      const bar = document.createElement('div'); bar.className = 'rep-bar';
      const fill = document.createElement('div'); fill.className = 'rep-bar-fill';
      fill.style.width = `${Math.min(100, Math.round((Number(value) / max) * 100))}%`;
      const val = document.createElement('div'); val.className = 'rep-val'; val.textContent = String(value);
      bar.appendChild(fill);
      row.appendChild(label); row.appendChild(bar); row.appendChild(val);
      repBars.appendChild(row);
    }
    panel.appendChild(repBars);
  }
}

export function renderReputationPanels() {
  const repPanel = document.getElementById('repPanel');
  if (repPanel) {
    clearChildren(repPanel);
    repPanel.appendChild(document.createElement('div'));
    renderRepContent(repPanel);
  }

  const repPanelRooms = document.getElementById('repPanelRooms');
  if (repPanelRooms) {
    clearChildren(repPanelRooms);
    renderRepContent(repPanelRooms);
  }
}

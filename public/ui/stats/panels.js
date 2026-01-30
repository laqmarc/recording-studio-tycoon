import { state } from '../../state.js';
import { CAMPAIGN_CHAPTERS } from '../../campaign.js';
import { formatGenreLabel } from '../shared.js';
import { createPanel, makeBarRow } from './dom.js';
import { getObjectiveProgress } from './metrics.js';

export function buildRepBars() {
  const wrap = document.createElement('div');
  wrap.className = 'stat-bars';
  const byGenre = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const entries = Object.entries(byGenre).sort((a, b) => Number(b[1]) - Number(a[1]));
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'Encara no tens reputacio per genere.';
    wrap.appendChild(empty);
    return wrap;
  }
  const max = Math.max(1, ...entries.map(e => Number(e[1]) || 0));
  for (const [genre, value] of entries) {
    wrap.appendChild(makeBarRow(formatGenreLabel(genre), Number(value || 0), max));
  }
  return wrap;
}

export function buildCampaignPanel() {
  const panel = createPanel('🧭 Campanya');
  const wrap = document.createElement('div');
  wrap.className = 'campaign-list';

  const active = state.campaign && state.campaign.active;
  const currentChapter = active ? Number(state.campaign.currentChapter || 0) : 0;
  const currentObjective = active ? Number(state.campaign.currentObjective || 0) : 0;
  const completed = active && Array.isArray(state.campaign.completedObjectives) ? state.campaign.completedObjectives : [];

  if (!active) {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = 'Campanya desactivada. Activa-la amb el botó "Campanya".';
    panel.content.appendChild(note);
  }

  CAMPAIGN_CHAPTERS.forEach((chapter, chIndex) => {
    const chapterEl = document.createElement('div');
    chapterEl.className = 'campaign-chapter';
    const title = document.createElement('div');
    title.className = 'campaign-chapter-title';
    title.textContent = `${chIndex + 1}. ${chapter.title}`;
    const desc = document.createElement('div');
    desc.className = 'tiny muted';
    desc.textContent = chapter.description;
    chapterEl.appendChild(title);
    chapterEl.appendChild(desc);

    chapter.objectives.forEach((obj, objIndex) => {
      const progress = getObjectiveProgress(obj);
      const isCurrent = active && chIndex === currentChapter && objIndex === currentObjective;
      const isDone = progress.done || completed.includes(obj.id);

      const row = document.createElement('div');
      row.className = 'campaign-objective';
      if (isCurrent) row.classList.add('current');
      if (isDone) row.classList.add('done');

      const left = document.createElement('div');
      left.className = 'campaign-left';
      const label = document.createElement('div');
      label.className = 'campaign-title';
      label.textContent = obj.title;
      const sub = document.createElement('div');
      sub.className = 'tiny muted';
      sub.textContent = obj.description;
      left.appendChild(label);
      left.appendChild(sub);

      const right = document.createElement('div');
      right.className = 'campaign-progress';
      right.textContent = progress.label;

      row.appendChild(left);
      row.appendChild(right);
      chapterEl.appendChild(row);
    });

    wrap.appendChild(chapterEl);
  });

  panel.content.appendChild(wrap);
  return panel;
}

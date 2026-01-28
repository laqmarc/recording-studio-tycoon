import { state } from '../state.js';
import { euro } from '../helpers.js';
import { clearChildren } from './shared.js';
import { ensurePeopleData } from './people_logic.js';

export function renderPersonnelPanel({ renderAll } = {}) {
  const personnelPanel = document.getElementById('personnelPanel');
  if (!personnelPanel) return;
  clearChildren(personnelPanel);
  if (typeof ensurePeopleData === 'function') ensurePeopleData();
  const people = (state.db && Array.isArray(state.db.people)) ? state.db.people : [];
  const playerLevel = Number(state.player && state.player.level || 1);
  if (!people.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'muted';
    placeholder.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Personal en carrega...';
    personnelPanel.appendChild(placeholder);
  }

  const hiredSet = new Set(Array.isArray(state.hiredPeople) ? state.hiredPeople : []);
  const activeAssigned = new Set();
  try {
    for (const c of state.db.contracts || []) {
      if (c.completed) continue;
      if (Array.isArray(c.assigned_people)) c.assigned_people.forEach(id => activeAssigned.add(id));
    }
  } catch (e) {}

  const grid = document.createElement('div'); grid.className = 'personnel-grid';

  const hiredSection = document.createElement('div'); hiredSection.className = 'personnel-section';
  const hiredTitle = document.createElement('div'); hiredTitle.className = 'personnel-title'; hiredTitle.textContent = 'Contractats';
  const hiredList = document.createElement('div'); hiredList.className = 'personnel-list';
  const hiredPeople = people.filter(p => hiredSet.has(p.id));
  const hiredMusicians = hiredPeople.filter(p => p.role === 'musician');
  const hiredTechs = hiredPeople.filter(p => p.role !== 'musician');
  const renderPersonCard = (p, container) => {
    const card = document.createElement('div'); card.className = 'personnel-card';
    const row = document.createElement('div'); row.className = 'personnel-row';
    const name = document.createElement('b'); name.textContent = p.name;
    const role = document.createElement('span'); role.className = 'pill'; role.textContent = p.role;
    row.appendChild(name); row.appendChild(role);
    const meta = document.createElement('div'); meta.className = 'personnel-meta';
    const instr = p.instruments && p.instruments.length ? p.instruments.join(', ') : '';
    const lvl = Number(p.unlock_level || 1);
    meta.textContent = `Skill ${p.skill || 0} · ${instr} · ${euro(p.fee_per_hour || 0)}/h · Lvl ${lvl}`;
    const actions = document.createElement('div'); actions.className = 'offer-actions';
    const btn = document.createElement('button'); btn.className = 'btn2'; btn.textContent = activeAssigned.has(p.id) ? 'Assignat' : 'Descontractar';
    btn.disabled = activeAssigned.has(p.id);
    btn.addEventListener('click', () => {
      state.hiredPeople = (state.hiredPeople || []).filter(id => id !== p.id);
      if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
      if (typeof renderAll === 'function') renderAll();
    });
    actions.appendChild(btn);
    card.appendChild(row); card.appendChild(meta); card.appendChild(actions);
    container.appendChild(card);
  };
  if (!hiredPeople.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'No tens personal contractat.';
    hiredList.appendChild(empty);
  } else {
    const columns = document.createElement('div'); columns.className = 'personnel-columns';
    const musCol = document.createElement('div'); musCol.className = 'personnel-col';
    const techCol = document.createElement('div'); techCol.className = 'personnel-col';
    const musTitle = document.createElement('div'); musTitle.className = 'personnel-subtitle'; musTitle.textContent = 'Musics';
    const techTitle = document.createElement('div'); techTitle.className = 'personnel-subtitle'; techTitle.textContent = 'Tecnics';
    const musList = document.createElement('div'); musList.className = 'personnel-list';
    const techList = document.createElement('div'); techList.className = 'personnel-list';
    if (!hiredMusicians.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense musics contractats.';
      musList.appendChild(empty);
    } else {
      hiredMusicians.forEach(p => renderPersonCard(p, musList));
    }
    if (!hiredTechs.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense tecnics contractats.';
      techList.appendChild(empty);
    } else {
      hiredTechs.forEach(p => renderPersonCard(p, techList));
    }
    musCol.appendChild(musTitle); musCol.appendChild(musList);
    techCol.appendChild(techTitle); techCol.appendChild(techList);
    columns.appendChild(musCol); columns.appendChild(techCol);
    hiredList.appendChild(columns);
  }
  hiredSection.appendChild(hiredTitle); hiredSection.appendChild(hiredList);

  const availableSection = document.createElement('div'); availableSection.className = 'personnel-section';
  const availTitle = document.createElement('div'); availTitle.className = 'personnel-title'; availTitle.textContent = 'Disponibles';
  const availList = document.createElement('div'); availList.className = 'personnel-list';
  const availablePeople = people.filter(p => !hiredSet.has(p.id) && Number(p.unlock_level || 1) <= playerLevel);
  const lockedPeople = people.filter(p => !hiredSet.has(p.id) && Number(p.unlock_level || 1) > playerLevel);
  const availableMusicians = availablePeople.filter(p => p.role === 'musician');
  const availableTechs = availablePeople.filter(p => p.role !== 'musician');
  if (!availablePeople.length) {
    const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'No hi ha mes personal disponible.';
    availList.appendChild(empty);
  } else {
    const columns = document.createElement('div'); columns.className = 'personnel-columns';
    const musCol = document.createElement('div'); musCol.className = 'personnel-col';
    const techCol = document.createElement('div'); techCol.className = 'personnel-col';
    const musTitle = document.createElement('div'); musTitle.className = 'personnel-subtitle'; musTitle.textContent = 'Musics';
    const techTitle = document.createElement('div'); techTitle.className = 'personnel-subtitle'; techTitle.textContent = 'Tecnics';
    const musList = document.createElement('div'); musList.className = 'personnel-list';
    const techList = document.createElement('div'); techList.className = 'personnel-list';
    const renderHireCard = (p, container) => {
      const card = document.createElement('div'); card.className = 'personnel-card';
      const row = document.createElement('div'); row.className = 'personnel-row';
      const name = document.createElement('b'); name.textContent = p.name;
      const role = document.createElement('span'); role.className = 'pill'; role.textContent = p.role;
      row.appendChild(name); row.appendChild(role);
      const meta = document.createElement('div'); meta.className = 'personnel-meta';
      const instr = p.instruments && p.instruments.length ? p.instruments.join(', ') : '';
      const lvl = Number(p.unlock_level || 1);
      meta.textContent = `Skill ${p.skill || 0} · ${instr} · ${euro(p.fee_per_hour || 0)}/h · Lvl ${lvl}`;
      const actions = document.createElement('div'); actions.className = 'offer-actions';
      const btn = document.createElement('button'); btn.className = 'btn2 btnOk'; btn.textContent = 'Contractar';
      btn.addEventListener('click', () => {
        state.hiredPeople = Array.isArray(state.hiredPeople) ? state.hiredPeople : [];
        if (!state.hiredPeople.includes(p.id)) state.hiredPeople.push(p.id);
        if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
        if (typeof renderAll === 'function') renderAll();
      });
      actions.appendChild(btn);
      card.appendChild(row); card.appendChild(meta); card.appendChild(actions);
      container.appendChild(card);
    };
    if (!availableMusicians.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense musics disponibles.';
      musList.appendChild(empty);
    } else {
      availableMusicians.forEach(p => renderHireCard(p, musList));
    }
    if (!availableTechs.length) {
      const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Sense tecnics disponibles.';
      techList.appendChild(empty);
    } else {
      availableTechs.forEach(p => renderHireCard(p, techList));
    }
    musCol.appendChild(musTitle); musCol.appendChild(musList);
    techCol.appendChild(techTitle); techCol.appendChild(techList);
    columns.appendChild(musCol); columns.appendChild(techCol);
    availList.appendChild(columns);
  }

  if (lockedPeople.length) {
    const lockedTitle = document.createElement('div'); lockedTitle.className = 'personnel-subtitle'; lockedTitle.textContent = 'Bloquejats';
    const lockedList = document.createElement('div'); lockedList.className = 'personnel-list';
    lockedPeople.forEach(p => {
      const card = document.createElement('div'); card.className = 'personnel-card';
      const row = document.createElement('div'); row.className = 'personnel-row';
      const name = document.createElement('b'); name.textContent = p.name;
      const role = document.createElement('span'); role.className = 'pill'; role.textContent = p.role;
      row.appendChild(name); row.appendChild(role);
      const meta = document.createElement('div'); meta.className = 'personnel-meta';
      const lvl = Number(p.unlock_level || 1);
      meta.textContent = `Desbloqueja a nivell ${lvl}`;
      card.appendChild(row); card.appendChild(meta);
      lockedList.appendChild(card);
    });
    availList.appendChild(lockedTitle);
    availList.appendChild(lockedList);
  }
  availableSection.appendChild(availTitle); availableSection.appendChild(availList);

  grid.appendChild(hiredSection);
  grid.appendChild(availableSection);
  personnelPanel.appendChild(grid);
}

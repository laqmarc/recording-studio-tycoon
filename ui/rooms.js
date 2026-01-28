import { state, getRoomEffective } from '../state.js';
import { euro } from '../helpers.js';
import { getContractETA } from '../actions.js';
import { assignContractPeople, buildRoleDefs, getPeopleByIdMap, getPeopleOptions } from './people_logic.js';
import { getRequirementsElement } from './requirements.js';
import { clearChildren, createArt, createBadge, formatEta, getRiskLevel, getRoomArt } from './shared.js';

export function renderRooms(options = {}) {
  const { renderAll } = options;

  const el = document.getElementById('roomList');
  clearChildren(el);
  const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx })).filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
  const roomsMeta = document.getElementById('roomsMeta'); if (roomsMeta) roomsMeta.textContent = `${visibleRooms.length} sales`;

  if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') {
    const day = Number(state.time.day || 1);
    const hasOffers = state.market && Array.isArray(state.market.offers) && state.market.offers.length > 0;
    if (!state.market || state.market.lastDayGenerated !== day || !hasOffers) {
      window.generateDailyOffers(true);
    }
  }

  const visibleIndices = visibleRooms.map(v => v.idx);
  if (visibleIndices.length > 0 && !visibleIndices.includes(state.selected.roomIndex)) {
    state.selected.roomIndex = visibleIndices[0];
  }

  const contractRoomSelect = document.getElementById('selContractRoom');
  if (contractRoomSelect) {
    contractRoomSelect.options.length = 0;
    visibleRooms.forEach(({ r, idx }) => contractRoomSelect.add(new Option(r.name, String(idx))));
    if (visibleIndices.includes(state.selected.roomIndex)) {
      contractRoomSelect.value = String(state.selected.roomIndex);
    } else if (visibleRooms.length) {
      contractRoomSelect.value = String(visibleRooms[0].idx);
    }
    if (contractRoomSelect.dataset.bound !== '1') {
      contractRoomSelect.addEventListener('change', () => {
        state.selected.roomIndex = Number(contractRoomSelect.value);
        if (typeof renderAll === 'function') renderAll();
      });
      contractRoomSelect.dataset.bound = '1';
    }
  }

  const btnFetch = document.getElementById('btnFetchClients');
  if (btnFetch && btnFetch.dataset.bound !== '1') {
    btnFetch.addEventListener('click', () => {
      if (typeof window !== 'undefined' && typeof window.generateDailyOffers === 'function') window.generateDailyOffers(true);
      if (typeof renderAll === 'function') renderAll();
    });
    btnFetch.dataset.bound = '1';
  }

  visibleRooms.forEach(({ r, idx }) => {
    const div = document.createElement('div');
    div.className = 'card' + (idx === state.selected.roomIndex ? ' active' : '');
    div.onclick = () => { state.selected.roomIndex = idx; if (typeof renderAll === 'function') renderAll(); };
    const layout = document.createElement('div');
    layout.className = 'card-grid';
    const art = createArt(getRoomArt(r), `${r.name} art`);
    const body = document.createElement('div');
    body.className = 'card-body';

    const eff = getRoomEffective(idx);
    const slots = eff.slots || {};
    const types = Object.keys(slots).slice(0, 4).join(', ');

    const row1 = document.createElement('div');
    row1.className = 'row';
    const b = document.createElement('b'); b.textContent = r.name;
    const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = r.type;
    row1.appendChild(b); row1.appendChild(pill);

    const row2 = document.createElement('div'); row2.className = 'row muted'; row2.style.marginTop = '6px';
    const s1 = document.createElement('span'); s1.textContent = `${r.size_m2} m² · noise ${r.noise_floor_db} dB`;
    const s2 = document.createElement('span'); s2.textContent = `${Object.keys(slots).length} slots`;
    row2.appendChild(s1); row2.appendChild(s2);

    const tiny = document.createElement('div'); tiny.className = 'tiny'; tiny.style.marginTop = '6px';
    tiny.textContent = `Slots: ${types}${Object.keys(slots).length > 4 ? '…' : ''}`;

    body.appendChild(row1); body.appendChild(row2); body.appendChild(tiny);
    layout.appendChild(art); layout.appendChild(body);
    div.appendChild(layout);
    el.appendChild(div);
  });

  const leftContracts = document.getElementById('leftContracts');
  if (leftContracts) {
    const room = state.db.rooms[state.selected.roomIndex];
    const applicable = state.db.contracts.filter(c => {
      const req = c.requirements || {};
      const playerLevel = Number(state.player.level || 1);
      const unlockLevel = Number(c.unlock_level || 1);
      return unlockLevel <= playerLevel && (!req.room_type || req.room_type === (room && room.type));
    });
    const contractsMeta = document.getElementById('contractsMeta'); if (contractsMeta) contractsMeta.textContent = `${applicable.length} contractes`;
    clearChildren(leftContracts);
    if (!applicable.length) {
      const m = document.createElement('div'); m.className = 'muted'; m.textContent = 'No hi ha contractes compatibles per aquesta sala.';
      leftContracts.appendChild(m);
    } else {
      for (const c of applicable) {
        const worked = Number(c.worked_hours || 0);
        const total = Number(c.duration_hours || 0);
        const remaining = Math.max(0, total - worked);
        const pct = total ? Math.round((worked / total) * 100) : 0;
        const eta = getContractETA(c);
        const etaText = remaining === 0 ? 'Ready' : formatEta(eta);
        const isDone = Boolean(c.completed);

        const card = document.createElement('div');
        card.className = 'card contract-card';
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'contract', contractId: c.id }));
            e.dataTransfer.effectAllowed = 'move';
          }
        });
        if (isDone) card.style.opacity = '.6', card.style.filter = 'grayscale(.4)';
        if (isDone) {
          card.classList.add('is-complete');
          card.setAttribute('data-stamp', 'DONE');
        }

        const row = document.createElement('div'); row.className = 'row';
        const bt = document.createElement('b'); bt.textContent = c.name;
        const typ = document.createElement('span'); typ.className = 'pill'; typ.textContent = c.type;
        row.appendChild(bt); row.appendChild(typ);

        const badges = document.createElement('div'); badges.className = 'badge-row';
        if (c.genre && c.genre !== 'any') badges.appendChild(createBadge(c.genre, 'badge--genre'));
        const risk = getRiskLevel(c);
        badges.appendChild(createBadge(risk.label, 'badge--risk', risk.level));
        if (c.target_quality != null) badges.appendChild(createBadge(`Qualitat ${c.target_quality}`, 'badge--quality'));
        if (c.genre) {
          const rep = state.reputation && state.reputation.byGenre ? (state.reputation.byGenre[c.genre] || 0) : 0;
          badges.appendChild(createBadge(`Rep ${rep}`, 'badge--genre'));
        }
        if (c.negotiated) badges.appendChild(createBadge(`Negociat: ${c.negotiated}`, 'badge--deadline'));
        if (c.deadline_days) {
          const startDay = (c.start_day != null) ? c.start_day : state.time.day;
          const dueDay = startDay + Number(c.deadline_days || 0);
          const remainingDays = dueDay - state.time.day;
          const deadlineText = remainingDays < 0 ? `Tard ${Math.abs(remainingDays)}d` : `D-${remainingDays}d`;
          const deadlineBadge = createBadge(`Deadline ${deadlineText}`, remainingDays < 0 ? 'badge--late' : 'badge--deadline');
          badges.appendChild(deadlineBadge);
        }

        const meta = document.createElement('div'); meta.className = 'muted'; meta.style.marginTop = '6px';
        meta.textContent = `${c.duration_hours}h · ${euro(c.base_pay)}`;
        if (isDone) {
          const pillDone = document.createElement('span'); pillDone.className = 'pill'; pillDone.textContent = 'Complet';
          meta.appendChild(document.createTextNode(' ')); meta.appendChild(pillDone);
        }

        const assignedIds = assignContractPeople(c);
        const peopleMap = getPeopleByIdMap();
        const talent = assignedIds.map(id => peopleMap.get(id)).filter(Boolean);
        const talentWrap = document.createElement('div'); talentWrap.className = 'talent-row';
        if (talent.length) {
          for (const p of talent) {
            const label = p.role === 'musician' ? `${p.name} (${(p.instruments || []).join(', ')})` : `${p.name} (${p.role})`;
            const chip = document.createElement('span'); chip.className = 'badge'; chip.textContent = label;
            talentWrap.appendChild(chip);
          }
        } else {
          const empty = document.createElement('div'); empty.className = 'tiny muted'; empty.textContent = 'Sense talent assignat';
          talentWrap.appendChild(empty);
        }

        card.appendChild(row); card.appendChild(badges); card.appendChild(meta); card.appendChild(talentWrap);

        const manualWrap = document.createElement('div'); manualWrap.className = 'talent-manual';
        const manualTitle = document.createElement('div'); manualTitle.className = 'tiny'; manualTitle.textContent = 'Talent manual:';
        manualWrap.appendChild(manualTitle);
        const selects = document.createElement('div'); selects.className = 'talent-selects';

        const genre = c.genre || 'any';
        const roleDefs = buildRoleDefs(c);
        const assignedMap = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];

        roleDefs.forEach((def) => {
          const selectWrap = document.createElement('div'); selectWrap.className = 'talent-select-wrap';
          const label = document.createElement('label'); label.textContent = def.label;
          const select = document.createElement('select');
          select.dataset.role = def.role;
          select.dataset.instrument = def.instrument || '';
          select.add(new Option('Auto', ''));
          const optionsList = getPeopleOptions(def.role, genre, def.instrument);
          optionsList.forEach(p => select.add(new Option(`${p.name} (${p.skill})`, p.id)));
          if (!optionsList.length && def.role === 'musician') {
            select.add(new Option('No tens musics contractats', ''));
          }

          const entry = assignedMap.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
          const currentId = entry && entry.id ? entry.id : '';
          if (currentId && peopleMap.has(currentId)) {
            const exists = Array.from(select.options).some(o => o.value === currentId);
            if (!exists) {
              const p = peopleMap.get(currentId);
              select.add(new Option(`${p.name} (${p.skill})`, p.id));
            }
            select.value = currentId;
          } else if (!currentId) {
            const fallbackId = select.options.length > 1 ? select.options[1].value : '';
            if (fallbackId) {
              select.value = fallbackId;
              const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
              let target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
              if (!target) {
                target = { role: def.role, instrument: def.instrument || '', id: fallbackId };
                map.push(target);
              } else {
                target.id = fallbackId;
              }
              const seen = new Set();
              c.assigned_people = map.filter(p => p && p.id && !seen.has(p.id) && seen.add(p.id)).map(p => p.id);
              c.assigned_people_map = map;
            }
          }

          select.addEventListener('change', () => {
            const id = select.value;
            if (!id) {
              const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
              const target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
              if (target) target.id = null;
              assignContractPeople(c);
              if (typeof renderAll === 'function') renderAll();
              if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
              return;
            }
            const map = Array.isArray(c.assigned_people_map) ? c.assigned_people_map : [];
            let target = map.find(e => e && e.role === def.role && (e.instrument || '') === (def.instrument || ''));
            if (!target) {
              target = { role: def.role, instrument: def.instrument || '', id };
              map.push(target);
            }
            target.id = id;
            const seen = new Set();
            c.assigned_people = map.filter(p => p && p.id && !seen.has(p.id) && seen.add(p.id)).map(p => p.id);
            c.assigned_people_map = map;
            if (typeof renderAll === 'function') renderAll();
            if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
          });

          selectWrap.appendChild(label);
          selectWrap.appendChild(select);
          selects.appendChild(selectWrap);
        });

        if (roleDefs.length) {
          manualWrap.appendChild(selects);
          card.appendChild(manualWrap);
        }

        const reqEl = getRequirementsElement(c, state.selected.roomIndex);
        if (reqEl) card.appendChild(reqEl);

        const progWrap = document.createElement('div'); progWrap.style.marginTop = '8px';
        const progText = document.createElement('div'); progText.className = 'row tiny';
        const progLeft = document.createElement('span'); progLeft.textContent = `Progrés: ${worked}/${total}h`;
        const etaSpan = document.createElement('span'); etaSpan.className = 'eta-pill'; etaSpan.textContent = `ETA ${etaText}`;
        progText.appendChild(progLeft); progText.appendChild(etaSpan);
        const progress = document.createElement('div'); progress.className = 'progress'; progress.style.marginTop = '6px';
        const progressInner = document.createElement('div'); progressInner.className = 'progress-inner'; progressInner.style.width = `${pct}%`;
        if (isDone) progressInner.style.opacity = '0.6';
        progress.appendChild(progressInner);
        progWrap.appendChild(progText); progWrap.appendChild(progress);
        card.appendChild(progWrap);

        const schedNote = document.createElement('div'); schedNote.className = 'tiny'; schedNote.textContent = '⏱️ Aquesta feina es fa des del calendari.';
        card.appendChild(schedNote);

        leftContracts.appendChild(card);
      }
    }
  }
}

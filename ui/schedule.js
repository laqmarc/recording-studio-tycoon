import { state } from '../state.js';
import { log } from '../helpers.js';
import { clearChildren } from './shared.js';

function getScheduleUsedHours(roomIndex, day) {
  const schedule = Array.isArray(state.schedule) ? state.schedule : [];
  return schedule
    .filter(s => s.roomIndex === roomIndex && s.day === day)
    .reduce((sum, s) => sum + Number(s.hours || 0), 0);
}

function scheduleContract(contractId, roomIndex, startDay) {
  const contract = state.db.contracts.find(c => c.id === contractId);
  if (!contract || contract.completed) return;
  const workHours = Number(state.time.workHoursPerDay || 8);
  state.schedule = Array.isArray(state.schedule) ? state.schedule : [];
  state.schedule = state.schedule.filter(s => s.contractId !== contractId);
  let remaining = Math.max(0, Number(contract.duration_hours || 0) - Number(contract.worked_hours || 0));
  let day = Number(startDay || state.time.day || 1);
  let safety = 0;
  while (remaining > 0 && safety < 60) {
    const used = getScheduleUsedHours(roomIndex, day);
    const available = Math.max(0, workHours - used);
    if (available <= 0) { day += 1; safety += 1; continue; }
    const hours = Math.min(remaining, available);
    state.schedule.push({ contractId, roomIndex, day, hours });
    remaining -= hours;
    day += 1;
    safety += 1;
  }
}

export function renderScheduleBoard({ renderAll } = {}) {
  const scheduleBoard = document.getElementById('scheduleBoard');
  if (!scheduleBoard) return;
  clearChildren(scheduleBoard);
  const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx }))
    .filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
  const days = 7;
  const startDay = Number(state.time.day || 1);
  const schedule = Array.isArray(state.schedule) ? state.schedule : [];
  const grid = document.createElement('div'); grid.className = 'schedule-grid';
  const head = document.createElement('div'); head.className = 'schedule-head';
  const blank = document.createElement('div'); blank.textContent = 'Sala'; head.appendChild(blank);
  for (let i = 0; i < days; i++) {
    const d = document.createElement('div'); d.textContent = `Dia ${startDay + i}`; head.appendChild(d);
  }
  grid.appendChild(head);

  for (const { r, idx } of visibleRooms) {
    const row = document.createElement('div'); row.className = 'schedule-row';
    const roomCell = document.createElement('div'); roomCell.className = 'schedule-room'; roomCell.textContent = r.name;
    row.appendChild(roomCell);
    for (let i = 0; i < days; i++) {
      const day = startDay + i;
      const cell = document.createElement('div'); cell.className = 'schedule-cell';
      cell.dataset.roomIndex = String(idx);
      cell.dataset.day = String(day);

      const items = schedule.filter(s => s.roomIndex === idx && s.day === day);
      for (const s of items) {
        const c = state.db.contracts.find(x => x.id === s.contractId);
        if (!c) continue;
        const chip = document.createElement('div'); chip.className = 'schedule-item';
        chip.textContent = `${c.name} (${s.hours}h)`;
        chip.setAttribute('draggable', 'true');
        chip.addEventListener('dragstart', (e) => {
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
              type: 'scheduled',
              contractId: s.contractId,
              roomIndex: s.roomIndex,
              day: s.day
            }));
          }
        });
        cell.appendChild(chip);
      }

      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.classList.add('drag-over');
      });
      cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('drag-over');
        const raw = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
        if (!raw) return;
        let payload = null;
        try { payload = JSON.parse(raw); } catch (err) { payload = { type: 'contract', contractId: raw }; }
        const contractId = payload.contractId || payload.id;
        const contract = state.db.contracts.find(x => x.id === contractId);
        if (!contract) return;
        const roomIndex = Number(cell.dataset.roomIndex || 0);
        const dayNum = Number(cell.dataset.day || startDay);
        if (contract.requirements && contract.requirements.room_type) {
          const room = state.db.rooms[roomIndex];
          if (room && room.type !== contract.requirements.room_type) {
            log('❌ Sala incompatible');
            return;
          }
        }
        try {
          if (typeof window !== 'undefined' && typeof window.checkContractRequirements === 'function') {
            const ok = window.checkContractRequirements(contract, roomIndex);
            if (!ok) log('⚠️ Requisits tecnics encara no complerts (pots preparar-ho abans de la sessio)');
          }
        } catch (e) {}
        scheduleContract(contractId, roomIndex, dayNum);
        if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
        if (typeof renderAll === 'function') renderAll();
      });

      const used = getScheduleUsedHours(idx, day);
      if (used > 0) {
        const badge = document.createElement('div'); badge.className = 'tiny';
        badge.textContent = `${used}/${state.time.workHoursPerDay}h`;
        cell.appendChild(badge);
      }
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  scheduleBoard.appendChild(grid);
}

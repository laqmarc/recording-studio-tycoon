import { state, installedIds } from '../state.js';
import { createTextDiv, formatCategoryLabel, formatRoomLabel } from './shared.js';

function getMicTypeCounts(req) {
  const counts = {};
  let types = [];
  const micTotal = Number((req.min_items && req.min_items.mic) || 0);
  if (req.mic_type_counts && typeof req.mic_type_counts === 'object') {
    for (const [type, count] of Object.entries(req.mic_type_counts)) {
      const n = Number(count) || 0;
      if (n > 0) {
        counts[type] = n;
        types.push(type);
      }
    }
    return { types, counts };
  }
  if (Array.isArray(req.mic_types) && req.mic_types.length) {
    types = req.mic_types.slice();
    if (micTotal > 0 && types.length <= micTotal) {
      const base = Math.floor(micTotal / types.length);
      const extra = micTotal % types.length;
      types.forEach((type, idx) => {
        counts[type] = base + (idx < extra ? 1 : 0);
      });
    } else {
      types.forEach(type => { counts[type] = 1; });
    }
  }
  return { types, counts };
}

function assignMicTypes(installedMicIds, counts) {
  const assigned = {};
  const remaining = {};
  for (const [type, count] of Object.entries(counts)) {
    assigned[type] = 0;
    remaining[type] = Number(count) || 0;
  }
  if (!Object.keys(remaining).length) return { assigned, remaining };
  const mics = installedMicIds.map(id => state.itemsById.get(id)).filter(Boolean);
  for (const mic of mics) {
    const micTypes = Array.isArray(mic.type) ? mic.type : [];
    const candidates = micTypes.filter(type => remaining[type] > 0);
    if (!candidates.length) continue;
    candidates.sort((a, b) => remaining[b] - remaining[a]);
    const chosen = candidates[0];
    remaining[chosen] -= 1;
    assigned[chosen] += 1;
  }
  return { assigned, remaining };
}

export function getRequirementsElement(contract, roomIndex) {
  const req = contract.requirements || {};
  const container = document.createElement('div');
  container.className = 'tiny';
  container.style.marginTop = '6px';
  container.style.lineHeight = '1.4';
  let has = false;

  if (req.room_type) {
    const room = state.db.rooms[roomIndex];
    const hasRoom = room && room.type === req.room_type;
    container.appendChild(createTextDiv(`Sala: ${formatRoomLabel(req.room_type)}`, hasRoom ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const installed = installedIds(roomIndex, cat).length;
      const hasEnough = installed >= Number(min);
      container.appendChild(createTextDiv(`${formatCategoryLabel(cat)}: ${installed}/${min}`, hasEnough ? '#4CAF50' : '#f44336'));
      has = true;
    }
  }

  const micTypeInfo = getMicTypeCounts(req);
  if (micTypeInfo.types.length) {
    const installedMicIds = installedIds(roomIndex, 'mic');
    const coverage = assignMicTypes(installedMicIds, micTypeInfo.counts);
    for (const requiredType of micTypeInfo.types) {
      const required = Number(micTypeInfo.counts[requiredType] || 0);
      const current = Number(coverage.assigned[requiredType] || 0);
      const hasType = current >= required;
      container.appendChild(createTextDiv(`Mic ${requiredType}: ${current}/${required}`, hasType ? '#4CAF50' : '#f44336'));
      has = true;
    }
  }

  const micCount = installedIds(roomIndex, 'mic').length;
  if (micCount > 0) {
    const standCount = installedIds(roomIndex, 'mic_stand').length;
    const hasEnough = standCount >= micCount;
    container.appendChild(createTextDiv(`Mic stands: ${standCount}/${micCount}`, hasEnough ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (req.min_interface_inputs) {
    const interfaces = installedIds(roomIndex, 'interface').map(id=>state.itemsById.get(id)).filter(Boolean);
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    const hasEnough = maxIns >= Number(req.min_interface_inputs);
    container.appendChild(createTextDiv(`Entrades interface: ${maxIns}/${req.min_interface_inputs}`, hasEnough ? '#4CAF50' : '#f44336'));
    has = true;
  }

  if (contract.deadline_days) {
    const start = contract.start_day || state.time.day;
    const deadline = start + contract.deadline_days;
    const isLate = state.time.day > deadline;
    const daysLeft = deadline - state.time.day;
    container.appendChild(createTextDiv(`Deadline: ${daysLeft} dies restants`, isLate ? '#f44336' : '#4CAF50'));
    has = true;
  }

  return has ? container : null;
}

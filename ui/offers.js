import { state } from '../state.js';
import { euro } from '../helpers.js';
import { clearChildren } from './shared.js';
import { getRequirementsElement } from './requirements.js';
import { ensureRoomOffers } from '../client_market.js';

export function renderOffers() {
  const offersEl = document.getElementById('clientOffers');
  if (!offersEl) return;
  clearChildren(offersEl);
  const room = state.db && Array.isArray(state.db.rooms) ? state.db.rooms[state.selected.roomIndex] : null;
  const roomType = room ? room.type : null;
  if (roomType) ensureRoomOffers(roomType, 2);
  const offers = (state.market && Array.isArray(state.market.offers))
    ? state.market.offers.filter(o => {
      const reqType = o.requirements && o.requirements.room_type;
      if (!roomType) return true;
      if (!reqType) return true;
      return reqType === roomType;
    })
    : [];
  if (!offers.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No hi ha ofertes avui.';
    offersEl.appendChild(empty);
    return;
  }

  for (const offer of offers) {
    const card = document.createElement('div'); card.className = 'offer-card';
    const row = document.createElement('div'); row.className = 'offer-row';
    const name = document.createElement('b'); name.textContent = offer.name;
    const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = offer.type;
    row.appendChild(name); row.appendChild(pill);
    const meta = document.createElement('div'); meta.className = 'offer-meta';
    meta.textContent = `${offer.duration_hours}h · ${euro(offer.base_pay)} · Qualitat ${offer.target_quality} · Deadline ${offer.deadline_days}d · Sala ${offer.requirements && offer.requirements.room_type ? offer.requirements.room_type : 'any'}`;
    const reqEl = getRequirementsElement(offer, state.selected.roomIndex);
    const actions = document.createElement('div'); actions.className = 'offer-actions';
    const btnAccept = document.createElement('button'); btnAccept.className = 'btn2 btnOk'; btnAccept.textContent = 'Acceptar';
    btnAccept.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.acceptOffer === 'function') window.acceptOffer(offer.id); });
    const btnDecline = document.createElement('button'); btnDecline.className = 'btn2'; btnDecline.textContent = 'Declinar';
    btnDecline.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.declineOffer === 'function') window.declineOffer(offer.id); });
    actions.appendChild(btnAccept); actions.appendChild(btnDecline);
    card.appendChild(row); card.appendChild(meta);
    if (reqEl) card.appendChild(reqEl);
    card.appendChild(actions);
    offersEl.appendChild(card);
  }
}

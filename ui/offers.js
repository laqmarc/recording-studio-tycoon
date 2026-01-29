import { state } from '../state.js';
import { euro } from '../helpers.js';
import { clearChildren, formatGenreLabel, formatRoomLabel } from './shared.js';
import { getRequirementsElement } from './requirements.js';
import { ensureRoomOffers } from '../client_market.js';

export function renderOffers() {
  const offersEl = document.getElementById('clientOffers');
  if (!offersEl) return;
  clearChildren(offersEl);
  const room = state.db && Array.isArray(state.db.rooms) ? state.db.rooms[state.selected.roomIndex] : null;
  const roomType = room ? room.type : null;
  if (roomType) ensureRoomOffers(roomType, 2);
  const specials = (state.market && Array.isArray(state.market.specials))
    ? state.market.specials.filter(o => {
      const reqType = o.requirements && o.requirements.room_type;
      if (!roomType) return true;
      if (!reqType) return true;
      return reqType === roomType;
    })
    : [];
  const offers = (state.market && Array.isArray(state.market.offers))
    ? state.market.offers.filter(o => {
      const reqType = o.requirements && o.requirements.room_type;
      if (!roomType) return true;
      if (!reqType) return true;
      return reqType === roomType;
    })
    : [];
  if (!offers.length && !specials.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No hi ha ofertes avui.';
    offersEl.appendChild(empty);
    return;
  }

  if (specials.length) {
    const head = document.createElement('div'); head.className = 'offer-section';
    head.textContent = '🌍 Projectes especials';
    offersEl.appendChild(head);
    const workHours = Number(state.time && state.time.workHoursPerDay || 8);
    for (const offer of specials) {
      const card = document.createElement('div'); card.className = 'offer-card special-offer';
      const row = document.createElement('div'); row.className = 'offer-row';
      const name = document.createElement('b'); name.textContent = offer.name;
      const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = 'special';
      row.appendChild(name); row.appendChild(pill);
      const days = Math.max(1, Math.round(Number(offer.duration_hours || 0) / workHours));
      const meta = document.createElement('div'); meta.className = 'offer-meta';
      const expires = offer.expires_day ? ` · Expira dia ${offer.expires_day}` : '';
      meta.textContent = `${days} dies · ${offer.duration_hours}h · ${euro(offer.base_pay)} · Qualitat ${offer.target_quality}${expires}`;
      const reqEl = getRequirementsElement(offer, state.selected.roomIndex);
      const milestones = document.createElement('div'); milestones.className = 'tiny muted';
      const count = Array.isArray(offer.milestones) ? offer.milestones.length : 0;
      milestones.textContent = count ? `Milestones: ${count} · Decisions incloses` : '';
      const actions = document.createElement('div'); actions.className = 'offer-actions';
      const btnAccept = document.createElement('button'); btnAccept.className = 'btn2 btnOk'; btnAccept.textContent = 'Acceptar';
      btnAccept.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.acceptSpecialOffer === 'function') window.acceptSpecialOffer(offer.id); });
      const btnDecline = document.createElement('button'); btnDecline.className = 'btn2'; btnDecline.textContent = 'Declinar';
      btnDecline.addEventListener('click', () => { if (typeof window !== 'undefined' && typeof window.declineSpecialOffer === 'function') window.declineSpecialOffer(offer.id); });
      actions.appendChild(btnAccept); actions.appendChild(btnDecline);
      card.appendChild(row); card.appendChild(meta);
      if (reqEl) card.appendChild(reqEl);
      if (milestones.textContent) card.appendChild(milestones);
      card.appendChild(actions);
      offersEl.appendChild(card);
    }
  }

  for (const offer of offers) {
    const card = document.createElement('div'); card.className = 'offer-card';
    const row = document.createElement('div'); row.className = 'offer-row';
    const name = document.createElement('b');
    if (offer && offer.genre) {
      const genreLabel = formatGenreLabel(offer.genre);
      name.textContent = offer.name ? offer.name.replace(offer.genre, genreLabel) : `${offer.type} · ${genreLabel}`;
    } else {
      name.textContent = offer.name;
    }
    const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = offer.type;
    row.appendChild(name); row.appendChild(pill);
    const meta = document.createElement('div'); meta.className = 'offer-meta';
    const roomLabel = offer.requirements && offer.requirements.room_type ? formatRoomLabel(offer.requirements.room_type) : 'any';
    meta.textContent = `${offer.duration_hours}h · ${euro(offer.base_pay)} · Qualitat ${offer.target_quality} · Deadline ${offer.deadline_days}d · Sala ${roomLabel}`;
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

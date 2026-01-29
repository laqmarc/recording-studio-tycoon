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

  const createPriceSpan = (value) => {
    const span = document.createElement('span');
    span.className = 'price-highlight';
    span.textContent = euro(value);
    return span;
  };

  const createRateSpan = (value) => {
    const span = document.createElement('span');
    span.className = 'rate-highlight';
    span.textContent = `${Math.round(value)} €/h`;
    return span;
  };

  const appendMetaParts = (meta, parts) => {
    parts.forEach((part) => {
      if (part == null) return;
      if (part.nodeType) meta.appendChild(part);
      else meta.appendChild(document.createTextNode(part));
    });
  };

  if (specials.length) {
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
      const hours = Number(offer.duration_hours || 0);
      const rate = hours ? Number(offer.base_pay || 0) / hours : 0;
      appendMetaParts(meta, [
        `${days} dies · ${offer.duration_hours}h · `,
        createPriceSpan(offer.base_pay),
        ' · ',
        createRateSpan(rate),
        ` · Qualitat ${offer.target_quality}${expires}`
      ]);
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
    const hours = Number(offer.duration_hours || 0);
    const rate = hours ? Number(offer.base_pay || 0) / hours : 0;
    appendMetaParts(meta, [
      `${offer.duration_hours}h · `,
      createPriceSpan(offer.base_pay),
      ' · ',
      createRateSpan(rate),
      ` · Qualitat ${offer.target_quality} · Deadline ${offer.deadline_days}d · Sala ${roomLabel}`
    ]);
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

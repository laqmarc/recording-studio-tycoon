// ui_render.js - rendering functions
function renderAll() {
  document.getElementById("money").textContent = `Cash: ${Math.round(state.cash)}€`;
  renderRooms();
  renderShop();
  renderRight();
}

function renderRooms() {
  const el = document.getElementById("roomList");
  el.innerHTML = "";
  const visibleRooms = state.db.rooms.map((r, idx) => ({ r, idx })).filter(({ r }) => Number(r.unlock_level || 1) <= Number(state.player.level || 1));
  document.getElementById("roomsMeta").textContent = `${visibleRooms.length} sales`;

  const visibleIndices = visibleRooms.map(v => v.idx);
  if (visibleIndices.length > 0 && !visibleIndices.includes(state.selected.roomIndex)) {
    state.selected.roomIndex = visibleIndices[0];
  }

  visibleRooms.forEach(({ r, idx }) => {
    const div = document.createElement("div");
    div.className = "card" + (idx===state.selected.roomIndex ? " active":"");
    div.onclick = () => { state.selected.roomIndex = idx; renderAll(); };

    const slots = r.slots || {};
    const types = Object.keys(slots).slice(0,4).join(", ");
    div.innerHTML = `
      <div class="row">
        <b>${r.name}</b>
        <span class="pill">${r.type}</span>
      </div>
      <div class="row muted" style="margin-top:6px">
        <span>${r.size_m2} m² · noise ${r.noise_floor_db} dB</span>
        <span>${Object.keys(slots).length} slots</span>
      </div>
      <div class="tiny" style="margin-top:6px">Slots: ${types}${Object.keys(slots).length>4?"…":""}</div>
    `;
    el.appendChild(div);
  });

  const leftContracts = document.getElementById("leftContracts");
  if (leftContracts) {
    const room = state.db.rooms[state.selected.roomIndex];
    const wh = state.time.workHoursPerDay || 8;
    const applicable = state.db.contracts.filter(c => {
      const req = c.requirements || {};
      return !req.room_type || req.room_type === (room && room.type);
    });
    if (!applicable.length) {
      leftContracts.innerHTML = `<div class="muted">No hi ha contractes compatibles per aquesta sala.</div>`;
    } else {
      leftContracts.innerHTML = applicable.map(c => {
        const worked = Number(c.worked_hours || 0);
        const total = Number(c.duration_hours || 0);
        const remaining = Math.max(0, total - worked);
        const pct = total ? Math.round((worked/total)*100) : 0;
        const eta = getContractETA(c);
        const etaText = remaining === 0 ? 'Ready' : (eta.days ? `${eta.days}d ${eta.hours}h` : `${eta.hours}h`);
        const isDone = Boolean(c.completed);
        return `
          <div class="card" style="${isDone ? 'opacity:.6; filter:grayscale(.4);' : ''}">
            <div class="row"><b>${c.name}</b><span class="pill">${c.type}</span></div>
            <div class="muted" style="margin-top:6px">${c.duration_hours}h · ${euro(c.base_pay)} ${isDone ? '<span class="pill">Complet</span>' : ''}</div>
            <div style="margin-top:8px">
              <div class="tiny">Progrés: ${worked}/${total}h <span style="float:right">ETA: ${etaText}</span></div>
              <div class="progress" style="height:8px; background:#eee; border-radius:4px; overflow:hidden; margin-top:6px"><div style="width:${pct}%; height:8px; background:${isDone? '#999':'#6bb'}; border-radius:4px"></div></div>
            </div>
            <div style="margin-top:8px; display:flex; gap:6px">
              <button class="btn2" onclick="workOnContract('${c.id}', 1)">${isDone ? 'Reiniciar' : 'Treballar 1h'}</button>
              <button class="btn2" onclick="workOnContract('${c.id}', ${wh})">${isDone ? 'Reiniciar dia' : `Treballar ${wh}h`}</button>
              <button class="btn2 btnOk" onclick="workOnContract('${c.id}', 9999)">${isDone ? 'Reiniciar i finalitzar' : 'Finalitzar'}</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function renderShop() {
  const cats = Array.from(state.itemsByCategory.keys()).sort();
  const sel = document.getElementById("selCategory");
  if (!sel.options.length) {
    sel.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join("");
  }
  if (!cats.includes(sel.value) && cats.length) sel.value = cats[0];

  const q = document.getElementById("txtSearch").value.trim().toLowerCase();
  const cat = sel.value;
  const items = (state.itemsByCategory.get(cat) || []).filter(it => {
    const unlocked = Number(it.unlock_level || 1) <= Number(state.player.level || 1);
    return unlocked && (!q || String(it.name||"").toLowerCase().includes(q));
  });

  document.getElementById("shopMeta").textContent = `${items.length} items`;

  const list = document.getElementById("shopList");
  list.innerHTML = "";

  for (const it of items.slice(0, 80)) {
    const div = document.createElement("div");
    div.className = "card" + (it.id === state.selected.shopItemId ? " active":"");
    div.onclick = () => { state.selected.shopItemId = it.id; renderShop(); renderRight(); };
    const tier = it.tier || "mid";
    const tierPill = tier === "pro" ? "ok" : tier === "low" ? "bad" : "";
    const statsHtml = (it.stats && Object.keys(it.stats).length)
      ? `<div style="margin-top:8px">${Object.entries(it.stats).map(([k,v])=>`<div class=\"tiny\">${k.replace(/_/g,' ')}: ${v}</div>`).join('')}</div>`
      : '';
    div.innerHTML = `
      <div class="row">
        <b>${it.name}</b>
        <span class="pill ${tierPill}">${tier}</span>
      </div>
      <div class="row muted" style="margin-top:6px">
        <span>${it.category}</span>
        <span>${euro(it.price || 0)}</span>
      </div>
      <div class="tiny" style="margin-top:6px">${it.notes ? it.notes : ""}</div>
      ${statsHtml}
    `;
    list.appendChild(div);
  }
}

function renderRight() {
  const room = state.db.rooms[state.selected.roomIndex];
  document.getElementById("rightMeta").textContent = room ? room.name : "";

  const details = document.getElementById("roomDetails");
  if (!room) { details.innerHTML = "<div class='muted'>No hi ha sala.</div>"; return; }

  const slots = room.slots || {};
  const bag = state.roomsInstalled[state.selected.roomIndex] || {};
  const slotHtml = Object.keys(slots).sort().map(cat => {
    const max = slots[cat];
    const used = (bag[cat] || []).length;
    return `<div class="slot"><b>${cat}</b><div class="muted">${used}/${max}</div></div>`;
  }).join("");

  details.innerHTML = `
    <div class="row">
      <b style="font-size:16px">${room.name}</b>
      <span class="pill">${room.type}</span>
    </div>
    <div class="muted" style="margin-top:6px">
      ${room.size_m2} m² · noise ${room.noise_floor_db} dB · base acoustic ${room.base_acoustic}
    </div>
    <div class="slotline">${slotHtml}</div>
  `;

  const invCats = Array.from(state.itemsByCategory.keys()).sort();
  const selCat = document.getElementById("selInvCategory");
  const prevSelCat = selCat.value;
  selCat.innerHTML = invCats.map(c=>`<option value="${c}">${c}</option>`).join("");
  if (prevSelCat && invCats.includes(prevSelCat)) {
    selCat.value = prevSelCat;
  } else if (invCats.length) {
    selCat.value = invCats[0];
  }

  const cat = selCat.value;
  const owned = (state.itemsByCategory.get(cat) || []).filter(it => invQty(it.id) > 0);

  const selItem = document.getElementById("selInvItem");
  const prevSelItem = selItem.value;
  selItem.innerHTML = owned.map(it => `<option value="${it.id}">${it.name} (x${invQty(it.id)})</option>`).join("");
  if (prevSelItem && owned.find(o=>o.id === prevSelItem)) {
    selItem.value = prevSelItem;
  } else if (!selItem.value && owned.length) {
    selItem.value = owned[0].id;
  }

  const k = document.getElementById("kpis");
  const xpNext = xpToNext(state.player.level || 1);
  k.innerHTML = `
    <div class="box"><div class="muted">Cash</div><div class="v">${Math.round(state.cash)}€</div></div>
    <div class="box"><div class="muted">Inventari</div><div class="v">${state.inventory.size}</div></div>
    <div class="box"><div class="muted">Sala slots</div><div class="v">${Object.keys(slots).length}</div></div>
    <div class="box"><div class="muted">Temps</div><div class="v">Dia ${state.time.day} · Hora ${state.time.hour}/${state.time.workHoursPerDay}</div></div>
    <div class="box"><div class="muted">Nivell</div><div class="v">${state.player.level} · XP ${state.player.xp}/${xpNext}</div></div>
  `;
}

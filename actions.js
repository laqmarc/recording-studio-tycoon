// actions.js - user actions and boot
function advanceTime(hours) {
  let h = Math.max(0, Number(hours || 0));
  if (!h) return;
  while (h > 0) {
    const remainingToday = state.time.workHoursPerDay - state.time.hour;
    const take = Math.min(remainingToday || state.time.workHoursPerDay, h);
    state.time.hour += take;
    h -= take;
    if (state.time.hour >= state.time.workHoursPerDay) {
      state.time.day += 1;
      state.time.hour = 0;
      // Recover fatigue
      state.player.fatigue = Math.max(0, state.player.fatigue - 8);
    }
  }
  log(`⏱️ Avançat ${hours}h — Dia ${state.time.day} · Hora ${state.time.hour}/${state.time.workHoursPerDay}`);
  renderAll();
}

function getContractETA(c) {
  const worked = Number(c.worked_hours || 0);
  const total = Number(c.duration_hours || 0);
  const remaining = Math.max(0, total - worked);
  if (remaining === 0) return { days:0, hours:0, finishDay: state.time.day, finishHour: state.time.hour };
  const hoursLeftToday = state.time.workHoursPerDay - state.time.hour;
  if (remaining <= hoursLeftToday) {
    return { days:0, hours:remaining, finishDay: state.time.day, finishHour: state.time.hour + remaining };
  }
  let rem = remaining - hoursLeftToday;
  const fullDays = Math.floor(rem / state.time.workHoursPerDay);
  const finalHours = rem % state.time.workHoursPerDay;
  const finishDay = state.time.day + 1 + fullDays;
  const finishHour = finalHours === 0 ? 0 : finalHours;
  return { days: fullDays + 1, hours: finalHours, finishDay, finishHour };
}

function workOnContract(contractId, hours) {
  const c = state.db.contracts.find(x => x.id === contractId);
  if (!c) return log('Contracte no trobat.');
  // If completed, reset to allow repeating
  if (c.completed) {
    c.worked_hours = 0;
    c.completed = false;
    c.completed_at = null;
    c.start_day = state.time.day; // Reset start day
    log(`🔄 Reiniciant contracte: ${c.name}`);
  }
  // Set start day if not set
  if (c.start_day == null) c.start_day = state.time.day;
  const room = state.db.rooms[state.selected.roomIndex];
  const req = c.requirements || {};
  if (req.room_type && req.room_type !== room.type) {
    log(`❌ Aquest contracte demana sala tipus "${req.room_type}". Ara estàs a "${room.type}".`);
    return;
  }

  if (req.min_items) {
    for (const [cat, min] of Object.entries(req.min_items)) {
      const used = installedIds(state.selected.roomIndex, cat).length;
      if (used < Number(min)) {
        log(`❌ Falta equip: ${cat} (${used}/${min})`);
        return;
      }
    }
  }

  const micCount = installedIds(state.selected.roomIndex, 'mic').length;
  if (micCount > 0) {
    const standCount = installedIds(state.selected.roomIndex, 'mic_stand').length;
    if (standCount < micCount) {
      log(`❌ Falta equip: mic_stand (${standCount}/${micCount}) — cal un peu per cada micròfon.`);
      return;
    }
  }

  if (req.min_interface_inputs) {
    const interfaces = installedIds(state.selected.roomIndex, "interface").map(id=>state.itemsById.get(id)).filter(Boolean);
    const maxIns = interfaces.reduce((m,it)=>Math.max(m, Number((it.io && it.io.inputs_total) || (it.stats && it.stats.inputs) || 0)), 0);
    if (maxIns < Number(req.min_interface_inputs)) {
      log(`❌ Cal una interface amb mínim ${req.min_interface_inputs} entrades (ara max: ${maxIns}).`);
      return;
    }
  }

  if (req.mic_types && Array.isArray(req.mic_types)) {
    const mics = installedIds(state.selected.roomIndex, "mic").map(id=>state.itemsById.get(id)).filter(Boolean);
    const coveredTypes = new Set();
    
    for (const mic of mics) {
      if (mic.type && Array.isArray(mic.type)) {
        // Cada micròfon només cobreix un tipus (el primer requerit que pot fer)
        const coveredType = mic.type.find(t => req.mic_types.includes(t) && !coveredTypes.has(t));
        if (coveredType) {
          coveredTypes.add(coveredType);
        }
      }
    }
    
    for (const requiredType of req.mic_types) {
      if (!coveredTypes.has(requiredType)) {
        log(`❌ Falta micròfon per: ${requiredType}`);
        return;
      }
    }
  }

  const remaining = (c.duration_hours || 0) - (c.worked_hours || 0);
  const actual_hours = Math.min(Number(hours || 0), remaining);
  c.worked_hours = Number(c.worked_hours || 0) + actual_hours;
  if (c.worked_hours >= (c.duration_hours || 0)) {
    c.worked_hours = c.duration_hours || c.worked_hours;
    log(`✅ Contracte completat: ${c.name} (treballats ${c.worked_hours}h/${c.duration_hours}h)`);
    const ok = simulateContract(c.id);
    if (ok) {
      c.completed = true;
      c.completed_at = { day: state.time.day, hour: state.time.hour };
      log(`📥 Contracte marcat com a complet (no s'elimina).`);
      showNotification(`🎉 Contracte "${c.name}" completat!`);
      saveState();
    }
  } else {
    log(`🛠️ Treballat ${actual_hours}h sobre ${c.name} — ${c.worked_hours}/${c.duration_hours}h`);
  }

  // Increase fatigue
  state.player.fatigue += actual_hours;

  advanceTime(actual_hours);
  renderAll();
}

function buySelected() {
  let id = state.selected.shopItemId;
  if (!id) {
    // Select the first item in current category
    const cat = document.getElementById("selCategory").value;
    const items = (state.itemsByCategory.get(cat) || []).filter(it => Number(it.unlock_level || 1) <= Number(state.player.level || 1));
    if (items.length) {
      id = items[0].id;
      state.selected.shopItemId = id;
      log("Seleccionat automàticament el primer item: " + state.itemsById.get(id).name);
    } else {
      return log("No hi ha items disponibles en aquesta categoria.");
    }
  }
  const it = state.itemsById.get(id);
  if (!it) return log("Item no trobat.");

  const qty = clamp(Number(document.getElementById("qtyBuy").value || 1), 1, 99);
  const cost = Number(it.price || 0) * qty;

  if (state.cash < cost) return log(`No tens prou diners. Necessites ${euro(cost)}.`);
  state.cash -= cost;
  invAdd(id, qty);
  renderAll();
  try { prepareInstallFromShop(); } catch (e) { }
  log(`✅ Comprat: ${it.name} x${qty} per ${euro(cost)}.`);  showNotification(`🛒 Comprat: ${it.name} x${qty}`);  saveState();
}

function prepareInstallFromShop() {
  const id = state.selected.shopItemId;
  if (!id) return log("Selecciona un item del Shop.");
  const it = state.itemsById.get(id);
  const selInvCat = document.getElementById("selInvCategory");
  const selInvItem = document.getElementById("selInvItem");
  selInvCat.value = it.category;
  renderRight();
  if (invQty(id) > 0) selInvItem.value = id;
  log("→ Preparat per instal·lar (si el tens a inventari).");
}

function installSelected() {
  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];

  const itemId = document.getElementById("selInvItem").value;
  if (!itemId) return log("No tens cap item a inventari en aquesta categoria.");
  if (invQty(itemId) <= 0) return log("No en tens a inventari.");

  const it = state.itemsById.get(itemId);
  if (!it) return log("Item no trobat.");

  const category = it.category || "misc";
  const res = installToRoom(roomIndex, category, itemId);
  if (!res.ok) return log(`❌ No es pot instal·lar: ${res.reason}`);

  invRemove(itemId, 1);
  log(`🧩 Instal·lat a ${room.name}: ${it.name} (${category})`);
  renderAll();
  saveState();
}

function uninstallLast() {
  const roomIndex = state.selected.roomIndex;
  const room = state.db.rooms[roomIndex];
  const cat = document.getElementById("selInvCategory").value;
  const res = uninstallFromRoom(roomIndex, cat);
  if (!res.ok) return log(`❌ ${res.reason} (${cat})`);

  const it = state.itemsById.get(res.removed);
  invAdd(res.removed, 1);
  log(`↩️ Desinstal·lat de ${room.name}: ${it ? it.name : res.removed} (${cat})`);
  renderAll();
  saveState();
}

// wire events
document.getElementById("btnLoadDemo").addEventListener("click", () => loadFromObject(DEMO));
document.getElementById("btnReset").addEventListener("click", resetGame);
document.getElementById("btnClearSave").addEventListener("click", () => {
  if (confirm('Esborrar la persistència i reiniciar el progrés?')) clearPersistenceAndReset();
});

document.getElementById("btnBuy").addEventListener("click", buySelected);
document.getElementById("btnAddToInstall").addEventListener("click", prepareInstallFromShop);
document.getElementById("btnInstall").addEventListener("click", installSelected);
document.getElementById("btnUninstall").addEventListener("click", uninstallLast);

document.getElementById("btnSimPodcast").addEventListener("click", () => simulateContract("contract_podcast_duo"));
document.getElementById("btnSimMix").addEventListener("click", () => simulateContract("contract_mix_single"));

document.getElementById("selCategory").addEventListener("change", renderShop);
document.getElementById("txtSearch").addEventListener("input", renderShop);

document.getElementById("selInvCategory").addEventListener("change", renderRight);

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const txt = await file.text();
  try {
    const obj = JSON.parse(txt);
    loadFromObject(obj);
  } catch (err) {
    log("❌ JSON invàlid: " + err.message);
  }
});

// boot demo by default
loadFromObject(DEMO);
ensurePlayerDefaults();
try { loadStateFromStorage(); } catch(e) { }

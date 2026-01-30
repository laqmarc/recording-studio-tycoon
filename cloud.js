import { saveState, loadStateFromStorage } from './persistence.js';

const API_BASE = (typeof window !== 'undefined' && window.CLOUD_API_BASE)
  ? String(window.CLOUD_API_BASE).replace(/\/$/, '')
  : 'http://localhost:3001';

const cloudState = {
  user: null,
  saves: [],
  activeSaveId: null,
  activeVersion: 0,
  activeTitle: '',
  suspendSave: false,
  saving: false
};

const storageKeys = {
  saveId: 'cloud.activeSaveId',
  saveVersion: 'cloud.activeSaveVersion',
  saveTitle: 'cloud.activeSaveTitle'
};

let saveTimer = null;
let pendingPayload = null;
let modalEl = null;
let statusEl = null;
let authWrap = null;
let savesWrap = null;
let headerUserEl = null;
let savesListEl = null;
let activeBadgeEl = null;
let mode = 'login';
let csrfToken = null;
let syncStatusEl = null;
let inlineModalEl = null;
let inlineTitleEl = null;
let inlineBodyEl = null;
let inlineActionsEl = null;

function loadSavedMeta() {
  cloudState.activeSaveId = localStorage.getItem(storageKeys.saveId) || null;
  cloudState.activeVersion = Number(localStorage.getItem(storageKeys.saveVersion) || 0);
  cloudState.activeTitle = localStorage.getItem(storageKeys.saveTitle) || '';
}

function saveMeta() {
  if (cloudState.activeSaveId) {
    localStorage.setItem(storageKeys.saveId, cloudState.activeSaveId);
    localStorage.setItem(storageKeys.saveVersion, String(cloudState.activeVersion || 0));
    localStorage.setItem(storageKeys.saveTitle, cloudState.activeTitle || '');
  } else {
    localStorage.removeItem(storageKeys.saveId);
    localStorage.removeItem(storageKeys.saveVersion);
    localStorage.removeItem(storageKeys.saveTitle);
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

async function ensureCsrfToken(force = false) {
  if (csrfToken && !force) return csrfToken;
  try {
    const res = await fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    csrfToken = data && data.token ? String(data.token) : null;
    return csrfToken;
  } catch (e) {
    return null;
  }
}

async function api(path, options = {}) {
  const method = String(options.method || 'GET').toUpperCase();
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (!SAFE_METHODS.has(method) && !options.skipCsrf) {
    const token = await ensureCsrfToken();
    if (token) headers['x-csrf-token'] = token;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  if (!SAFE_METHODS.has(method) && response.status === 403) {
    let data = null;
    try { data = await response.clone().json(); } catch (e) {}
    if (data && data.error === 'csrf') {
      await ensureCsrfToken(true);
      if (csrfToken) headers['x-csrf-token'] = csrfToken;
      return fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include'
      });
    }
  }
  return response;
}

function setStatus(message, tone = 'muted') {
  if (!statusEl) return;
  statusEl.textContent = message || '';
  statusEl.className = `tiny ${tone}`;
}

function setSyncIndicator(state, message) {
  if (!syncStatusEl) return;
  syncStatusEl.textContent = message || '';
  syncStatusEl.className = `cloud-sync ${state || ''}`.trim();
}

function updateSyncIndicator() {
  if (!syncStatusEl) return;
  if (!cloudState.user || !cloudState.activeSaveId) {
    setSyncIndicator('local', 'Local');
    return;
  }
  if (cloudState.saving || pendingPayload || saveTimer) {
    setSyncIndicator('syncing', 'Syncing');
    return;
  }
  setSyncIndicator('ok', 'Nuvol');
}

function hasCoreData() {
  if (typeof window === 'undefined') return false;
  const hasItems = window.__itemsLoaded || (Array.isArray(window.ITEMS) && window.ITEMS.length);
  const hasRooms = window.__roomsLoaded || (Array.isArray(window.ROOMS) && window.ROOMS.length);
  const hasDb = window.state && window.state.db && Array.isArray(window.state.db.rooms) && window.state.db.rooms.length;
  return Boolean(hasItems && hasRooms && hasDb);
}

function waitForCoreData(timeoutMs = 4000) {
  if (hasCoreData()) return Promise.resolve(true);
  return new Promise(resolve => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      window.removeEventListener('items-ready', onReady);
      window.removeEventListener('rooms-ready', onReady);
      resolve(ok);
    };
    const onReady = () => {
      if (hasCoreData()) finish(true);
    };
    window.addEventListener('items-ready', onReady, { once: false });
    window.addEventListener('rooms-ready', onReady, { once: false });
    setTimeout(() => finish(hasCoreData()), timeoutMs);
  });
}

function openInlineModal({ title, buildBody, confirmLabel, onConfirm }) {
  if (!inlineModalEl) return;
  inlineTitleEl.textContent = title || '';
  inlineBodyEl.innerHTML = '';
  if (typeof buildBody === 'function') buildBody(inlineBodyEl);
  inlineActionsEl.innerHTML = '';
  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn2 btnSmall';
  btnCancel.textContent = 'Cancel·lar';
  btnCancel.addEventListener('click', () => closeInlineModal());
  const btnConfirm = document.createElement('button');
  btnConfirm.className = 'btn2 btnSmall';
  btnConfirm.textContent = confirmLabel || 'Confirmar';
  btnConfirm.addEventListener('click', async () => {
    const keepOpen = await onConfirm();
    if (keepOpen === false) return;
    closeInlineModal();
  });
  inlineActionsEl.appendChild(btnCancel);
  inlineActionsEl.appendChild(btnConfirm);
  inlineModalEl.style.display = 'flex';
}

function closeInlineModal() {
  if (!inlineModalEl) return;
  inlineModalEl.style.display = 'none';
}

async function refreshSession() {
  try {
    const res = await api('/auth/me');
    const data = await res.json();
    cloudState.user = data && data.user ? data.user : null;
  } catch (e) {
    cloudState.user = null;
  }
  updateSyncIndicator();
}

async function listSaves() {
  if (!cloudState.user) return [];
  try {
    const res = await api('/saves');
    if (!res.ok) return [];
    const data = await res.json();
    cloudState.saves = Array.isArray(data.saves) ? data.saves : [];
    const active = cloudState.saves.find(s => s.id === cloudState.activeSaveId);
    if (active) {
      cloudState.activeVersion = Number(active.version || cloudState.activeVersion || 0);
      cloudState.activeTitle = active.title || cloudState.activeTitle || '';
      saveMeta();
    }
    updateSyncIndicator();
    return cloudState.saves;
  } catch (e) {
    return [];
  }
}

function setActiveSave(save) {
  cloudState.activeSaveId = save.id;
  cloudState.activeVersion = Number(save.version || 1);
  cloudState.activeTitle = save.title || '';
  saveMeta();
  renderSavesList();
  updateSyncIndicator();
}

async function loadSave(id) {
  if (!cloudState.user) return;
  setStatus('Carregant...', 'muted');
  try {
    const res = await api(`/saves/${id}`);
    if (!res.ok) {
      setStatus('No es pot carregar la partida.', 'muted');
      return;
    }
    const data = await res.json();
    const save = data && data.save ? data.save : null;
    if (!save) {
      setStatus('No es pot carregar la partida.', 'muted');
      return;
    }
    const ready = await waitForCoreData();
    if (!ready) {
      setStatus('Dades base no carregades. Reintenta en uns segons.', 'muted');
      return;
    }
    cloudState.suspendSave = true;
    if (save.payload && typeof save.payload === 'object') {
      try { localStorage.setItem('studio_tycoon_state_v1', JSON.stringify(save.payload)); } catch (e) {}
      const ok = loadStateFromStorage();
      if (!ok) {
        setStatus('No s\'ha pogut aplicar la partida.', 'muted');
        cloudState.suspendSave = false;
        return;
      }
    }
    setActiveSave(save);
    if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
    setStatus('Partida carregada.', 'ok');
  } catch (e) {
    setStatus('Error carregant la partida.', 'muted');
  } finally {
    cloudState.suspendSave = false;
  }
}

async function createSave(slotIndex, title) {
  if (!cloudState.user) return;
  setStatus('Creant slot...', 'muted');
  try {
    const payload = buildPayloadSnapshot();
    const res = await api('/saves', {
      method: 'POST',
      body: JSON.stringify({ slot_index: slotIndex, title, payload })
    });
    if (!res.ok) {
      if (res.status === 409) setStatus('Slot ocupat.', 'muted');
      else setStatus('Error creant slot.', 'muted');
      return;
    }
    const data = await res.json();
    if (data && data.save) {
      cloudState.saves.push(data.save);
      setActiveSave(data.save);
      setStatus('Slot creat.', 'ok');
      renderSavesList();
    }
  } catch (e) {
    setStatus('Error creant slot.', 'muted');
  }
}

async function renameSave(saveId, title) {
  if (!cloudState.user) return;
  try {
    const res = await api(`/saves/${saveId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title })
    });
    if (!res.ok) {
      setStatus('No s\'ha pogut renombrar.', 'muted');
      return;
    }
    const target = cloudState.saves.find(s => s.id === saveId);
    if (target) target.title = title;
    if (saveId === cloudState.activeSaveId) {
      cloudState.activeTitle = title;
      saveMeta();
    }
    renderSavesList();
    setStatus('Renombrat.', 'ok');
  } catch (e) {
    setStatus('No s\'ha pogut renombrar.', 'muted');
  }
}

async function duplicateSave(saveId, slotIndex, title) {
  if (!cloudState.user) return;
  setStatus('Duplicant...', 'muted');
  try {
    const res = await api(`/saves/${saveId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ slot_index: slotIndex, title })
    });
    if (!res.ok) {
      if (res.status === 409) setStatus('Slot ocupat.', 'muted');
      else setStatus('Error duplicant.', 'muted');
      return false;
    }
    const data = await res.json();
    if (data && data.save) {
      cloudState.saves.push(data.save);
      renderSavesList();
      setStatus('Duplicat creat.', 'ok');
    }
    return true;
  } catch (e) {
    setStatus('Error duplicant.', 'muted');
    return false;
  }
}

async function deleteSave(saveId) {
  if (!cloudState.user) return false;
  setStatus('Esborrant...', 'muted');
  try {
    const res = await api(`/saves/${saveId}`, { method: 'DELETE' });
    if (!res.ok) {
      setStatus('No s\'ha pogut esborrar.', 'muted');
      return false;
    }
    cloudState.saves = cloudState.saves.filter(s => s.id !== saveId);
    if (saveId === cloudState.activeSaveId) {
      cloudState.activeSaveId = null;
      cloudState.activeVersion = 0;
      cloudState.activeTitle = '';
      saveMeta();
      if (activeBadgeEl) activeBadgeEl.textContent = 'Cap slot actiu';
    }
    renderSavesList();
    updateSyncIndicator();
    setStatus('Slot esborrat.', 'ok');
    return true;
  } catch (e) {
    setStatus('No s\'ha pogut esborrar.', 'muted');
    return false;
  }
}

function scheduleSave(payload) {
  if (cloudState.suspendSave) return;
  if (!cloudState.user || !cloudState.activeSaveId) return;
  pendingPayload = payload;
  updateSyncIndicator();
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    flushSave();
  }, 800);
}

async function flushSave() {
  if (!pendingPayload || cloudState.saving) return;
  const payload = pendingPayload;
  pendingPayload = null;
  await saveActive(payload);
  if (pendingPayload) flushSave();
}

async function saveActive(payload) {
  if (!cloudState.user || !cloudState.activeSaveId) return;
  if (!cloudState.activeVersion) {
    await listSaves();
  }
  if (!cloudState.activeVersion) return;
  cloudState.saving = true;
  updateSyncIndicator();
  try {
    const res = await api(`/saves/${cloudState.activeSaveId}`, {
      method: 'PUT',
      body: JSON.stringify({
        payload,
        version: cloudState.activeVersion,
        title: cloudState.activeTitle || null
      })
    });
    if (res.status === 409) {
      const data = await res.json();
      cloudState.activeVersion = Number(data.server_version || cloudState.activeVersion || 0);
      saveMeta();
      setStatus('Conflicte de versio: refresca el slot.', 'muted');
      setSyncIndicator('error', 'Conflicte');
      return;
    }
    if (!res.ok) {
      setStatus('Error guardant al nuvol.', 'muted');
      setSyncIndicator('error', 'Error');
      return;
    }
    const data = await res.json();
    cloudState.activeVersion = Number(data.version || cloudState.activeVersion || 0);
    saveMeta();
    if (activeBadgeEl) activeBadgeEl.textContent = `Actiu · v${cloudState.activeVersion}`;
    updateSyncIndicator();
  } catch (e) {
    setStatus('Error guardant al nuvol.', 'muted');
    setSyncIndicator('error', 'Error');
  } finally {
    cloudState.saving = false;
    updateSyncIndicator();
  }
}

async function manualSaveNow() {
  if (!cloudState.user || !cloudState.activeSaveId) {
    setStatus('Activa un slot abans de guardar.', 'muted');
    return;
  }
  const payload = buildPayloadSnapshot();
  if (!payload) {
    setStatus('No s\'ha pogut preparar la partida.', 'muted');
    return;
  }
  setStatus('Guardant al nuvol...', 'muted');
  await saveActive(payload);
  updateSyncIndicator();
}

function buildPayloadSnapshot() {
  const prev = cloudState.suspendSave;
  cloudState.suspendSave = true;
  try {
    saveState();
  } catch (e) {
  } finally {
    cloudState.suspendSave = prev;
  }
  try {
    const raw = localStorage.getItem('studio_tycoon_state_v1');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function renderSavesList() {
  if (!savesListEl) return;
  savesListEl.innerHTML = '';
  const saves = (cloudState.saves || []).slice().sort((a, b) => {
    return Number(a.slot_index || 0) - Number(b.slot_index || 0);
  });
  if (!saves.length) {
    const empty = document.createElement('div');
    empty.className = 'tiny muted';
    empty.textContent = 'Sense slots encara.';
    savesListEl.appendChild(empty);
    return;
  }
  saves.forEach(save => {
    const card = document.createElement('div');
    card.className = 'cloud-save-card';
    const title = document.createElement('div');
    title.className = 'cloud-save-title';
    const slotLabel = `Slot ${save.slot_index}`;
    const titleText = save.title ? ` · ${save.title}` : '';
    title.textContent = `${slotLabel}${titleText}`;
    const meta = document.createElement('div');
    meta.className = 'tiny muted';
    meta.textContent = `v${save.version} · ${new Date(save.updated_at || save.created_at).toLocaleString()}`;
    const actions = document.createElement('div');
    actions.className = 'cloud-save-actions';
    const btnLoad = document.createElement('button');
    btnLoad.className = 'btn2 btnSmall';
    btnLoad.textContent = 'Carregar';
    btnLoad.addEventListener('click', () => loadSave(save.id));
    const btnSet = document.createElement('button');
    btnSet.className = 'btn2 btnSmall';
    btnSet.textContent = save.id === cloudState.activeSaveId ? 'Actiu' : 'Activar';
    btnSet.addEventListener('click', () => setActiveSave(save));
    const btnRename = document.createElement('button');
    btnRename.className = 'btn2 btnSmall';
    btnRename.textContent = 'Renombrar';
    btnRename.addEventListener('click', () => {
      const nextTitle = prompt('Nou titol', save.title || '');
      if (nextTitle == null) return;
      renameSave(save.id, String(nextTitle).trim());
    });
    const btnDup = document.createElement('button');
    btnDup.className = 'btn2 btnSmall';
    btnDup.textContent = 'Duplicar';
    btnDup.addEventListener('click', () => {
      openInlineModal({
        title: 'Duplicar slot',
        buildBody: (body) => {
          const slotInput = document.createElement('input');
          slotInput.type = 'number';
          slotInput.min = '1';
          slotInput.max = '5';
          slotInput.placeholder = 'Slot desti (1-5)';
          const titleInput = document.createElement('input');
          titleInput.type = 'text';
          titleInput.placeholder = 'Titol (opcional)';
          titleInput.value = save.title ? `${save.title} copy` : '';
          body.appendChild(slotInput);
          body.appendChild(titleInput);
          body.dataset.slotInputId = 'slotInput';
          body.dataset.titleInputId = 'titleInput';
          body._slotInput = slotInput;
          body._titleInput = titleInput;
        },
        confirmLabel: 'Duplicar',
        onConfirm: async () => {
          const slotInput = inlineBodyEl && inlineBodyEl._slotInput;
          const titleInput = inlineBodyEl && inlineBodyEl._titleInput;
          const index = slotInput ? Number(slotInput.value || 0) : 0;
          if (!index) {
            setStatus('Slot invalid.', 'muted');
            return false;
          }
          const title = titleInput ? String(titleInput.value || '').trim() : '';
          const ok = await duplicateSave(save.id, index, title);
          return ok;
        }
      });
    });
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn2 btnSmall';
    btnDelete.textContent = 'Esborrar';
    btnDelete.addEventListener('click', () => {
      openInlineModal({
        title: 'Esborrar slot',
        buildBody: (body) => {
          const text = document.createElement('div');
          text.className = 'tiny';
          text.textContent = `Segur que vols esborrar el Slot ${save.slot_index}? Aquesta accio no es pot desfer.`;
          body.appendChild(text);
        },
        confirmLabel: 'Esborrar',
        onConfirm: async () => {
          const ok = await deleteSave(save.id);
          return ok;
        }
      });
    });
    actions.appendChild(btnLoad);
    actions.appendChild(btnSet);
    actions.appendChild(btnRename);
    actions.appendChild(btnDup);
    actions.appendChild(btnDelete);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    if (save.id === cloudState.activeSaveId) card.classList.add('active');
    savesListEl.appendChild(card);
  });
}

function renderAuthSection() {
  if (!authWrap) return;
  authWrap.innerHTML = '';
  if (cloudState.user) return;

  const toggle = document.createElement('div');
  toggle.className = 'cloud-toggle';
  const btnLogin = document.createElement('button');
  btnLogin.className = `btn2 btnSmall ${mode === 'login' ? 'active' : ''}`;
  btnLogin.textContent = 'Entrar';
  const btnRegister = document.createElement('button');
  btnRegister.className = `btn2 btnSmall ${mode === 'register' ? 'active' : ''}`;
  btnRegister.textContent = 'Registrar';
  btnLogin.addEventListener('click', () => { mode = 'login'; renderModal(); });
  btnRegister.addEventListener('click', () => { mode = 'register'; renderModal(); });
  toggle.appendChild(btnLogin);
  toggle.appendChild(btnRegister);

  const form = document.createElement('form');
  form.className = 'cloud-form';
  const email = document.createElement('input');
  email.type = 'email';
  email.placeholder = 'email';
  const pass = document.createElement('input');
  pass.type = 'password';
  pass.placeholder = 'password';
  const submit = document.createElement('button');
  submit.className = 'btn btn-primary';
  submit.type = 'submit';
  submit.textContent = mode === 'login' ? 'Entrar' : 'Crear compte';
  form.appendChild(email);
  form.appendChild(pass);
  form.appendChild(submit);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Connectant...', 'muted');
    const body = { email: email.value, password: pass.value };
    const path = mode === 'login' ? '/auth/login' : '/auth/register';
    const res = await api(path, { method: 'POST', body: JSON.stringify(body) });
    if (!res.ok) {
      setStatus('No s\'ha pogut autenticar.', 'muted');
      return;
    }
    const data = await res.json();
    cloudState.user = data.user || null;
    await listSaves();
    renderModal();
    setStatus('Sessio iniciada.', 'ok');
  });

  authWrap.appendChild(toggle);
  authWrap.appendChild(form);
}

function renderSavesSection() {
  if (!savesWrap) return;
  savesWrap.innerHTML = '';
  if (!cloudState.user) return;

  const header = document.createElement('div');
  header.className = 'cloud-header-row';
  const userLabel = document.createElement('div');
  userLabel.className = 'tiny';
  userLabel.textContent = `Sessio: ${cloudState.user.email}`;
  headerUserEl = userLabel;
  const logout = document.createElement('button');
  logout.className = 'btn2 btnSmall';
  logout.textContent = 'Sortir';
  logout.addEventListener('click', async () => {
    await api('/auth/logout', { method: 'POST' });
    cloudState.user = null;
    cloudState.saves = [];
    updateSyncIndicator();
    renderModal();
  });
  header.appendChild(userLabel);
  header.appendChild(logout);

  const active = document.createElement('div');
  active.className = 'cloud-active';
  activeBadgeEl = document.createElement('div');
  activeBadgeEl.className = 'pill';
  const badgeText = cloudState.activeSaveId ? `Actiu · v${cloudState.activeVersion || 0}` : 'Cap slot actiu';
  activeBadgeEl.textContent = badgeText;
  const btnSaveNow = document.createElement('button');
  btnSaveNow.className = 'btn2 btnSmall';
  btnSaveNow.textContent = 'Guardar ara';
  btnSaveNow.addEventListener('click', () => {
    saveState();
    manualSaveNow();
  });
  active.appendChild(activeBadgeEl);
  active.appendChild(btnSaveNow);

  const create = document.createElement('div');
  create.className = 'cloud-create';
  const slotInput = document.createElement('input');
  slotInput.type = 'number';
  slotInput.min = '1';
  slotInput.max = '5';
  slotInput.placeholder = 'Slot';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Titol (opcional)';
  const btnCreate = document.createElement('button');
  btnCreate.className = 'btn2 btnSmall';
  btnCreate.textContent = 'Nou slot';
  btnCreate.addEventListener('click', () => {
    const index = Number(slotInput.value || 0);
    if (!index) { setStatus('Posa un slot.', 'muted'); return; }
    createSave(index, titleInput.value || null);
  });
  create.appendChild(slotInput);
  create.appendChild(titleInput);
  create.appendChild(btnCreate);

  savesListEl = document.createElement('div');
  savesListEl.className = 'cloud-save-list';
  renderSavesList();

  savesWrap.appendChild(header);
  savesWrap.appendChild(active);
  savesWrap.appendChild(create);
  savesWrap.appendChild(savesListEl);
}

function renderModal() {
  if (!modalEl) return;
  renderAuthSection();
  renderSavesSection();
}

function createModal() {
  modalEl = document.createElement('div');
  modalEl.className = 'modal';
  modalEl.style.display = 'none';
  const content = document.createElement('div');
  content.className = 'modal-content';
  const wrap = document.createElement('div');
  wrap.className = 'content';
  wrap.style.padding = '24px';
  const header = document.createElement('div');
  header.className = 'cloud-modal-header';
  const title = document.createElement('h2');
  title.textContent = 'Compte i partides';
  const close = document.createElement('button');
  close.className = 'btn2 btnSmall';
  close.textContent = 'Tancar';
  close.addEventListener('click', () => { modalEl.style.display = 'none'; });
  header.appendChild(title);
  header.appendChild(close);
  statusEl = document.createElement('div');
  statusEl.className = 'tiny muted';
  authWrap = document.createElement('div');
  authWrap.className = 'cloud-auth';
  savesWrap = document.createElement('div');
  savesWrap.className = 'cloud-saves';
  wrap.appendChild(header);
  wrap.appendChild(statusEl);
  wrap.appendChild(authWrap);
  wrap.appendChild(savesWrap);
  content.appendChild(wrap);
  inlineModalEl = document.createElement('div');
  inlineModalEl.className = 'cloud-inline-modal';
  const inlineCard = document.createElement('div');
  inlineCard.className = 'cloud-inline-card';
  inlineTitleEl = document.createElement('h3');
  inlineBodyEl = document.createElement('div');
  inlineBodyEl.className = 'cloud-inline-body';
  inlineActionsEl = document.createElement('div');
  inlineActionsEl.className = 'cloud-inline-actions';
  inlineCard.appendChild(inlineTitleEl);
  inlineCard.appendChild(inlineBodyEl);
  inlineCard.appendChild(inlineActionsEl);
  inlineModalEl.appendChild(inlineCard);
  inlineModalEl.addEventListener('click', (e) => {
    if (e.target === inlineModalEl) closeInlineModal();
  });
  content.appendChild(inlineModalEl);
  modalEl.appendChild(content);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) modalEl.style.display = 'none';
  });
  document.body.appendChild(modalEl);
}

export async function initCloudUI() {
  if (typeof document === 'undefined') return;
  loadSavedMeta();
  createModal();
  syncStatusEl = document.getElementById('cloudSyncStatus');
  await refreshSession();
  if (cloudState.user) await listSaves();
  renderModal();
  updateSyncIndicator();

  const btn = document.getElementById('btnCloud');
  if (btn) {
    btn.addEventListener('click', async () => {
      await refreshSession();
      if (cloudState.user) await listSaves();
      renderModal();
      modalEl.style.display = 'flex';
    });
  }
}

if (typeof window !== 'undefined') {
  window.cloudSaveActiveSlot = scheduleSave;
  window.cloudSaveNow = manualSaveNow;
  window.cloudSuspendSave = (flag) => { cloudState.suspendSave = Boolean(flag); };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initCloudUI().catch(() => {});
  });
}

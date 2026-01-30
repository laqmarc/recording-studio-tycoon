const storageKey = "studio_tycoon_theme";
const root = document.documentElement;

function applyTheme(mode) {
  if (mode === "dark" || mode === "light" || mode === "forest") {
    root.setAttribute("data-theme", mode);
  } else {
    root.removeAttribute("data-theme");
  }
}

function labelFor(mode) {
  if (mode === "dark") return "Tema: Fosc";
  if (mode === "light") return "Tema: Clar";
  if (mode === "forest") return "Tema: Bosc";
  return "Tema: Auto";
}

function nextMode(mode) {
  if (mode === "auto") return "dark";
  if (mode === "dark") return "light";
  if (mode === "light") return "forest";
  return "auto";
}

function readMode() {
  const stored = localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light" || stored === "forest" || stored === "auto") return stored;
  const attr = root.getAttribute("data-theme");
  if (attr === "dark" || attr === "light" || attr === "forest") return attr;
  return "dark";
}

function writeMode(mode) {
  if (mode === "dark" || mode === "light" || mode === "forest" || mode === "auto") {
    localStorage.setItem(storageKey, mode);
    return;
  }
  localStorage.removeItem(storageKey);
}

function initThemeToggle() {
  const btn = document.getElementById("btnTheme");
  if (!btn) return;

  let mode = readMode();
  applyTheme(mode === "auto" ? null : mode);
  btn.textContent = labelFor(mode);

  btn.addEventListener("click", () => {
    mode = nextMode(mode);
    writeMode(mode);
    applyTheme(mode === "auto" ? null : mode);
    btn.textContent = labelFor(mode);
  });
}

function initAutoQaToggle() {
  const btn = document.getElementById("btnAutoQa");
  if (!btn) return;

  // Import state from state.js
  let state;
  try {
    state = window.state || { ui: { autoQa: true } };
  } catch (e) {
    state = { ui: { autoQa: true } };
  }

  function updateButton() {
    const enabled = state.ui && state.ui.autoQa;
    btn.textContent = `QA Auto: ${enabled ? 'ON' : 'OFF'}`;
    btn.style.backgroundColor = enabled ? '#4CAF50' : '';
    btn.style.color = enabled ? 'white' : '';
  }

  updateButton();

  btn.addEventListener("click", () => {
    if (!state.ui) state.ui = { autoQa: true };
    state.ui.autoQa = !state.ui.autoQa;
    updateButton();

    // Save state if available
    if (typeof window !== 'undefined' && typeof window.saveState === 'function') {
      window.saveState();
    }

    // Show notification
    if (typeof showNotification === 'function') {
      showNotification(state.ui.autoQa ? '✅ QA automàtic activat' : '❌ QA automàtic desactivat');
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initAutoQaToggle();
  });
} else {
  initThemeToggle();
  initAutoQaToggle();
}

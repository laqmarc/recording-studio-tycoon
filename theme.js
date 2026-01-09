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
  if (stored === "dark" || stored === "light" || stored === "forest") return stored;
  return "auto";
}

function writeMode(mode) {
  if (mode === "dark" || mode === "light" || mode === "forest") {
    localStorage.setItem(storageKey, mode);
  } else {
    localStorage.removeItem(storageKey);
  }
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}

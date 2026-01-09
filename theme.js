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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}

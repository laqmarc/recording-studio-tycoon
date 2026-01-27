const storageKey = "studio_tycoon_tutorial_seen";

const steps = [
  {
    title: "Benvingut",
    text: "Aixo es una guia rapida per jugar a Studio Tycoon. Usa les pestanyes per canviar de pagina.",
    selector: "header",
    page: "rooms"
  },
  {
    title: "Sales",
    text: "Selecciona una sala i mira els slots disponibles.",
    selector: "#roomList",
    page: "rooms"
  },
  {
    title: "Contractes",
    text: "Aqui tens contractes compatibles amb la sala activa.",
    selector: "#leftContracts",
    page: "contracts"
  },
  {
    title: "Botiga",
    text: "Compra equips i consumibles. Filtra per categoria i cerca noms.",
    selector: "#shopList",
    page: "shop"
  },
  {
    title: "Sala + Inventari",
    text: "Instal la equips, desinstal la i usa consumibles. Pots arrossegar items als slots.",
    selector: "#inventoryControls",
    page: "rooms"
  },
  {
    title: "Passar dia",
    text: "Avanca el temps per recuperar fatiga i aplicar costos.",
    selector: "#btnNextDay",
    page: "rooms"
  },
  {
    title: "Llestos",
    text: "Ja pots jugar. Pots reiniciar el tutorial esborrant la persistencia.",
    selector: null,
    page: "rooms"
  }
];

function shouldShowTutorial() {
  return !localStorage.getItem(storageKey);
}

function setSeen() {
  localStorage.setItem(storageKey, "1");
}

function clearHighlight() {
  const prev = document.querySelector(".tour-highlight");
  if (prev) prev.classList.remove("tour-highlight");
}

function applyHighlight(selector) {
  clearHighlight();
  if (!selector) return;
  const target = document.querySelector(selector);
  if (!target) return;
  target.classList.add("tour-highlight");
  if (typeof target.scrollIntoView === "function") {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function buildTour() {
  const overlay = document.createElement("div");
  overlay.className = "tour-overlay";

  const card = document.createElement("div");
  card.className = "tour-card";

  const title = document.createElement("div");
  title.className = "tour-title";

  const text = document.createElement("div");
  text.className = "tour-text";

  const stepInfo = document.createElement("div");
  stepInfo.className = "tour-step";

  const actions = document.createElement("div");
  actions.className = "tour-actions";

  const btnBack = document.createElement("button");
  btnBack.className = "tour-btn";
  btnBack.textContent = "Enrere";

  const btnSkip = document.createElement("button");
  btnSkip.className = "tour-btn";
  btnSkip.textContent = "Saltar";

  const btnNext = document.createElement("button");
  btnNext.className = "tour-btn primary";
  btnNext.textContent = "Seguent";

  actions.appendChild(btnBack);
  actions.appendChild(btnSkip);
  actions.appendChild(btnNext);
  card.appendChild(title);
  card.appendChild(text);
  card.appendChild(stepInfo);
  card.appendChild(actions);

  document.body.appendChild(overlay);
  document.body.appendChild(card);
  document.body.classList.add("tour-lock");

  let index = 0;

  function render() {
    const step = steps[index];
    if (step.page && typeof window !== "undefined" && typeof window.setPage === "function") {
      window.setPage(step.page);
    }
    title.textContent = step.title;
    text.textContent = step.text;
    stepInfo.textContent = `Pas ${index + 1} / ${steps.length}`;
    btnBack.style.display = index === 0 ? "none" : "inline-flex";
    btnNext.textContent = index === steps.length - 1 ? "Finalitzar" : "Seguent";
    applyHighlight(step.selector);
  }

  function close() {
    clearHighlight();
    overlay.remove();
    card.remove();
    document.body.classList.remove("tour-lock");
    setSeen();
  }

  btnBack.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    render();
  });

  btnNext.addEventListener("click", () => {
    if (index >= steps.length - 1) {
      close();
      return;
    }
    index += 1;
    render();
  });

  btnSkip.addEventListener("click", close);

  render();
}

function initTutorial() {
  if (!shouldShowTutorial()) return;
  buildTour();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTutorial);
} else {
  initTutorial();
}

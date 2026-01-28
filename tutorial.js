const storageKey = "studio_tycoon_tutorial_seen_v2";

const steps = [
  {
    title: "Benvingut",
    text: "Aixo es un tutorial complet. Seguirem el flux natural del joc.",
    selector: "header",
    page: "rooms"
  },
  {
    title: "Pestanyes",
    text: "Fes servir les pestanyes per moure't entre Sales, Contractes, Shop i Personal.",
    selector: "#pageTabs",
    page: "rooms"
  },
  {
    title: "KPIs",
    text: "Aqui tens els indicadors clau: cash, temps, fatiga, reputacio i despeses.",
    selector: "#kpis",
    page: "rooms"
  },
  {
    title: "Sales",
    text: "Selecciona una sala. Cada sala te slots i limitacions diferents.",
    selector: "#roomList",
    page: "rooms"
  },
  {
    title: "Sala activa",
    text: "A la dreta veus el floorplan i dades de la sala. Aqui es on instal les equips.",
    selector: "#roomDetails",
    page: "rooms"
  },
  {
    title: "Inventari",
    text: "Arrossega equips de l'inventari al floorplan. Arrossega de tornada per desinstal lar.",
    selector: "#inventoryList",
    page: "rooms"
  },
  {
    title: "Manteniment",
    text: "Sota l'inventari tens l'estat dels equips i el boto de reparacio.",
    selector: ".inventory-panel",
    page: "rooms"
  },
  {
    title: "Log",
    text: "El log et dona detall de sessions, costos i penalitzacions.",
    selector: "#log",
    page: "rooms"
  },
  {
    title: "Passar dia",
    text: "Avanca el temps per recuperar fatiga i aplicar costos diaris.",
    selector: "#btnNextDay",
    page: "rooms"
  },
  {
    title: "Feines",
    text: "Aqui tens les feines compatibles. Estan en mode compacte per ocupar poc.",
    selector: "#leftContracts",
    page: "contracts"
  },
  {
    title: "Detalls i talent",
    text: "Prem Detalls per veure requisits, progres i assignar talent. Auto (Jo) no cobra.",
    selector: "#leftContracts",
    page: "contracts"
  },
  {
    title: "Sala activa per contractes",
    text: "Canvia la sala activa per veure feines compatibles amb cada sala.",
    selector: "#selContractRoom",
    page: "contracts"
  },
  {
    title: "Clients",
    text: "Les ofertes apareixen aqui. Si no n'hi ha, prem Buscar client.",
    selector: "#clientOffers",
    page: "contracts"
  },
  {
    title: "Calendari",
    text: "Arrossega feines al calendari per planificar hores. Pots moure-les entre dies.",
    selector: "#scheduleBoard",
    page: "contracts"
  },
  {
    title: "Reputacio",
    text: "La reputacio per genere puja quan completes feines i millora les ofertes.",
    selector: "#repPanel",
    page: "contracts"
  },
  {
    title: "Personal",
    text: "Contracta musics i tecnics. Sense personal contractat no podras assignar-los.",
    selector: "#personnelPanel",
    page: "people"
  },
  {
    title: "Shop",
    text: "Filtra per categoria i cerca equips. Els bundles acceleren la compra.",
    selector: "#selCategory",
    page: "shop"
  },
  {
    title: "Llista d'items",
    text: "Selecciona un item, compara stats i compra. Els equips apareixen a l'inventari.",
    selector: "#shopList",
    page: "shop"
  },
  {
    title: "Controls",
    text: "Pots canviar tema, activar audio ambient i resetar la persistencia des del header.",
    selector: "header",
    page: "rooms"
  },
  {
    title: "Llestos",
    text: "Ja pots jugar. Si vols tornar a veure el tutorial, reinicia la persistencia.",
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

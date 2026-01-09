# Recording Studio Tycoon

Prototype jugable per provar mecàniques de gestió d'un estudi d'enregistrament: comprar, instal·lar equips, treballar contractes i gestionar costos i fatiga.

**Inici ràpid**
- Obrir [index.html](index.html) en un navegador modern (o servir el directori amb un servidor estàtic).
- Desenvolupament i tests (requereix Node.js):

```bash
npm install
npm test
```

**Com jugar (resum)**
- Compra items des del panell `Shop`.
- A la secció `Sala + Inventari` selecciona una sala, tria un item del teu inventari i fes clic `Instal·lar a la sala` per instal·lar-lo.
- Quan instal·les el primer equip d'una sala comencen els costos: es cobra la setmana sencera (`price_per_week`) en la primera instal·lació i després cada 7 dies.
- Usa consumibles (`coffee`, `good_bed`) des del teu inventari mitjançant el botó `Usar`.
- Prem `🌅 Passar dia` per avançar el dia; el joc aplica recuperació de fatiga i gestiona cobraments setmanals.
- Treballa en `Contracts` des de la llista esquerra per guanyar diners i experiència; la fatiga redueix la qualitat i el pagament.

**Detalls de jugabilitat**
- Fatiga: el jugador té `fatigueShort` i `fatigueChronic`; el valor `player.fatigue` és derivat. Cada nit es recupera un 50% de la fatiga curta i la crònica decau lentament.
- Consumibles:
  - `coffee`: redueix la fatiga curta immediatament.
  - `good_bed`: augmenta la recuperació de la següent nit.
- Economies i facturació:
  - No pagues per una sala fins que hi instal·les alguna cosa.
  - En la primera instal·lació d'una sala es cobra la setmana sencera (full `price_per_week`).
  - Cada 7 dies es cobra novament la setmana sencera; els cobrament acumulats apareixen a `Total facturat`.

**UI i controls**
- Les KPI principals estan al header: `Cash`, `Inventari`, `Sala slots`, `Temps`, `Nivell`, `Fatiga`, `Despesa setmanal` i `Total facturat`.
- Les controls d'inventari i botons d'acció estan fixats a la part inferior (desktop) per a accés ràpid.
- Les notificacions mostren els cobrament i altres esdeveniments.

**Fitxers clau**
- `index.html` — entrada i estructura principal.
- `state.js` — estat global i funcions d'índex.
- `helpers.js` — utilitats, `advanceTime`, facturació (`applyDailyRoomCosts`), consumibles.
- `persistence.js` — càrrega/guardat (localStorage) i inicialització de demo.
- `ui_render.mjs` — render ESM del DOM (mostra KPIs i controls).
- `actions.js` — handlers d'acció (comprar, instal·lar, treballar).
- `demo.js` — dades de demostració (rooms, items, contracts).

**Desenvolupament i tests**
- Instal·lar dependències i córrer tests:

```bash
npm install
npm test
```

- Les proves estan a `__tests__/` i el codi per a tests es troba a `lib/`.

**Actualitzacions recents**
- Migració a mòduls ESM per al renderer i compatibilitat de tests.
- Fatiga: model curt/crònic i recuperació nocturna (50%).
- Consumibles: `coffee` i `good_bed`.
- Facturació setmanal: només sales amb instal·lacions paguen; primera instal·lació cobra la setmana sencera; cobraments setmanals automàtics i notificacions.
- UI: KPI al header i controls d'inventari fixes a la part inferior en desktop.

---

Si vols, puc: afegir una secció de tuning (paràmetres de fatiga/fees), exemples de partides, o canviar la política de facturació (prorrateig primer dia).
# Recording Studio Tycoon

Una versió prototip d'un "studio tycoon" per provar mecàniques de compra, instal·lació d'equip, i treball amb contractes.

**Inici ràpid**
- Obrir `index.html` en un navegador modern (o servir el directori amb un servidor estàtic).
- Per al desenvolupament i tests (requereix Node.js):

```bash
npm install
npm test
```

**Estructura ràpida**
- `index.html` — entrada de l'aplicació (carrega els scripts legacy i `esm/bootstrap.mjs`).
- `demo.js`, `items_master.json` — dades de demostració i catàleg d'items.
- `state.js` — objecte global `state` i helpers d'índex/instal·lació.
- `helpers.js` — utilitats i algunes funcions browser-specific (`advanceTime`).
- `simulation.js` — lògica de simulació (`simulateRecording`, `simulateContract`).
- `actions.js` — accions de l'usuari i wiring d'esdeveniments.
- `ui_render.js` — renderització DOM (still uses `innerHTML` in places).
- `persistence.js` — guardat/càrrega via `localStorage`.
- `lib/` — versions CommonJS de funcions pures per a tests (Node/Jest).
- `esm/` — mòduls ES per al navegador; actualment exposen `ESHelpers` i `ESSimulation` a `window` per compatibilitat.
- `__tests__/` — tests Jest.

**Tests**
- Ja hi ha un harness de tests amb Jest. Executa `npm test` per córrer els tests existents.
- Per afegir tests nous, posa la lògica pura en `lib/` i crea fitxers a `__tests__/`.

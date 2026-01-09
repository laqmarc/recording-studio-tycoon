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

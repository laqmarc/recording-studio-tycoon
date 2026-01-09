# Recording Studio Tycoon

Prototype jugable per provar mecàniques de gestió d'un estudi de grabació de so: comprar, instal·lar equips, treballar contractes i gestionar costos i fatiga.

**Inici ràpid**
- Obrir [index.html](index.html) en un navegador modern (o servir el directori amb un servidor estàtic).

**Com jugar (resum)**
- Compra items des del panell `Shop`.
- A la secció `Sala + Inventari` selecciona una sala, tria un item del teu inventari i fes clic `Instal·lar a la sala` per instal·lar-lo.
- Quan instal·les el primer equip d'una sala comencen els costos: es cobra la setmana sencera (`price_per_week`) en la primera instal·lació i després cada 7 dies.
- Usa consumibles (`coffee`, `good_bed`) des del teu inventari mitjançant el botó `Usar`.
- Prem `Passar dia` per avançar el dia; el joc aplica recuperació de fatiga i gestiona cobraments setmanals.
- Treballa en `Contracts` des de la llista esquerra per guanyar diners i experiència; la fatiga redueix la qualitat.

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

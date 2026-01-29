# Recording Studio Tycoon

Prototype jugable per gestionar un estudi: sales, inventari, clients, calendaris, personal, reputacio i costos.

**Inici rapid**
- Obre `index.html` en un navegador modern (o serveix el directori amb un servidor static).

**Música de fons**
El joc inclou un reproductor de música integrat. Per afegir les teves pròpies cançons:
1. Crea la carpeta `assets/music/` (si no existeix).
2. Afegeix fitxers MP3 a la carpeta.
3. Edita `index.html` i modifica la llista `playlist` amb els teus fitxers, per exemple:
   ```javascript
   const playlist = [
     { title: 'Nom de la cançó', src: 'assets/music/el_teu_fitxer.mp3' },
     // afegeix més...
   ];
   ```
4. Recarrega la pàgina. El reproductor apareix com una icona 🎵 a la cantonada inferior dreta; clica per obrir els controls.

**Com jugar (resum)**
- `Shop`: compra equips i afegeix-los a inventari.
- `Sales`: selecciona una sala i instal·la equips amb drag & drop al floorplan.
- `Feines`: accepta ofertes i planifica la feina al calendari (drag & drop).
- `Personal`: contracta musics i tecnics per poder assignar-los manualment.

**Sistemes principals**
- **Sales + inventari**: drag & drop d'inventari a la sala; els slots limiten quins items pots instal·lar.
- **Contractes + calendari**: les feines avancen via calendari. Programa hores i avanca el temps per completar-les.
- **Clients i ofertes**: generacio diaria d'ofertes segons reputacio, nivell i sales desbloquejades.
- **Personal i talent**: assigns manuals dins de “Detalls”. Per defecte es fa servir “Jo” (0 EUR/h). Si assigns un professional, es cobra el fee al completar la feina.
- **Reputacio**: puja per genere quan completes feines i millora la qualitat de les ofertes.
- **Manteniment**: desgast d'equip i cost de reparacio sota l'inventari de la sala.
- **Fatiga**: afecta la qualitat. Es recupera cada nit i es mostra a KPIs.
- **Economia**: costos diaris + facturacio setmanal de sales actives. Tot queda reflectit a KPIs.

**UI i controls**
- Contractes compactes: a la columna d'esquerra ocupen poc espai; fes clic a **Detalls** per desplegar informació.
- Calendari de 7 dies amb drag & drop per planificar.
- KPIs principals al header per control rapid.

**Logs de sessio**
- Quan completes una feina, el log mostra qualitat, penalitzacions i un detall del talent assignat (rol, nom, EUR/h i cost total).

**Fitxers clau**
- `index.html` — estructura principal.
- `ui_render.mjs` — orquestracio de render.
- `ui/` — mòduls per sales, shop, personal, calendari, etc.
- `state.js` — estat global.
- `helpers.js` — temps, economia, fatiga i utilitats.
- `client_market.js` — generacio d'ofertes.
- `simulation.js` — simulacio de feines i payouts.
- `persistence.js` — guardar/carregar a localStorage.

**Tests**
```bash
npm install
npm test
```

Els tests viuen a `__tests__/` i cobreixen UI, simulacio, accions, persistencia i helpers.

# Recording Studio Tycoon

Prototype jugable per gestionar un estudi: sales, inventari, clients, calendaris, personal, reputacio i costos.

**Inici rapid**
- Obre `index.html` en un navegador modern (o serveix el directori amb un servidor static).

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



## Possibles noves features

Contractes recurrents: afegeix clients que contracten sessions setmanals/mensuals; dona ingressos previsibles i obligacions. (Backend: marca contractes amb freq i genera nous treballs automàticament.)

Reserva i agenda: reservar hores per sala; conflicts, penalitzacions per cancel·lacions i ingressos per hores ocupades. (Afegir calendari per sala + checks d’horari.)

Preus variable / demanda: ajustar preus segons demanda/ocupació; promocions i temporada alta. (Economia: factor demanda que modifiqui base_pay i price_per_week.)

Manteniment i desgast: equips s’espatllen o perden rendiment; manteniment i assegurances. (Stats d’item: durabilitat → cost/temps d’inactivitat.)
Contractes amb requisits creatius: gèneres, nivells de qualitat, deadlines i bonus/penalties per qualitat i temps. (Ja hi ha contracts bàsics; ampliar amb metadades i bonificacions.)

Personal / empleats: contractar tècnics, enginyers i artistes amb salaris, habilitats i temps de treball; gestió d’equip. (Persona objects, assignació a sessions, XP/level.)

Formació i R+D: invertir en formació/recerca per millorar eficiència o nous serveis (mastering, streaming). (Inversions que desbloquegen stats globals o noves opcions.)

Marketing / reputació: reputació que augmenta preus i qualitat de contractes; campanyes de marketing pagades. (Metric: reputation → affects contract unlocks/pay.)

Millores de sala i remodelacions: gastar per millorar acoustics, capacitat o estètica; augmenta base pay o permet contracts superiors. (Room upgrades amb cost i temps d’obra.)

Clients amb història / relacions: historial de clients, preferències i relacions; fidelització i referrals. (DB de clients amb flags i esdeveniments.)

Metrics i analytics: gràfics d’ingressos/despeses, occupancy rate, profit per m2; export CSV. (UI: charts, KPI expandibles.)

Sistema d’objectius/missions: missions diàries/setmanals amb recompenses per guiar el jugador. (Tasks + rewards per retenció.)

Autoplay / programació de treballs: permet preparar sessions i deixar que el joc processi (ideal per provar simulacions ràpides). (Queue system + fast-forward.)

Marketplace / vendes d’items usats: vendre o llogar equips; mercat amb preus fluctuants. (Inventari: vendre, llogar per temps limitat.)
Multijugador asíncron / leaderboard: comparar ingressos, reputació o temps amb altres jugadors; comparteix “studios”. (Servidor o export/import d’estat.)

Accessibilitat / tutorial interactiu: onboarding pas a pas que explica fatiga, facturació i instal·lacions. (UI: tour, tooltips, exemple de partida.)

Configuració de dificultat / modifiers: ajusta taxes, recuperació de fatiga, preus per tests i rejugabilitat. (Settings JSON o menú.)

Events aleatoris: artistes famosos, inspeccions, festivals o imprevistos que alteren la dinàmica. (Random events system amb impacte econòmic/opcional.)

Història / campanya: progressió amb scansió narrativa i objectius a llarg termini. (Sèries d’escenaris guiats.)

-----

Contractes recurrents avançats: clients amb calendaris, penalitzacions per cancel·lacions i bonuses per fidelitat.
Reserva/Agenda: calendari horari per sala amb conflictes i venda d’hores per hores.
Demanda i preus dinàmics: fluctuació de preus segons ocupació, temporada i reputació.
Manteniment d’equip: desgast, fallades, temps d’inactivitat i costos de reparació.
Personal especialitzat: tècnics, enginyers i managers amb habilitats i salaris; assignació a sessions.
Formació i R+D: inversions que milloren eficiència, qualitat o desbloquegen serveis (mastering, streaming).
Marketing i reputació: campanyes pagades, reputació que afecta tipus de contractes i preus.
Millores i remodelacions de sala: upgrades amb cost i temps que milloren acústica/capacitat.
Clients amb història: preferències, historial i referrals que generen oportunitats.
Sistema de lliuraments/qualitat: bonus/penalitzacions segons qualitat i temps, influït per fatiga i equip.
Marketplace de segona mà / lloguer: vendre o llogar equips amb preus variables.
Lloguer d’estudi per esdeveniments: festivals, streaming en viu, que ocupen molt de temps però paguen bé.
Assegurança i risc: pòlisses que cobreixen fallades però amb primes i exclusions.
Prestecs i banc: crèdits, interessos i risc de fallida; opcions d’expansió financera.
Mini-jocs de qualitat: skill checks per parts de la producció (p.ex. ajustar EQ) que milloren resultat.
Sistema de missions/objectius: tasques diàries/setmanals per guiar progressió i recompenses.
Analytics i dashboards: gràfics d’ingressos, ocupació i ROI per prendre decisions.
Esdeveniments aleatoris: oportunitats o crisis (artista famós, inspecció, fallada) que trenquen rutina.
Marketplace online / sync/licensing: vendre llicències d’obres per anuncis/series amb royalties recurrents.
Multijugador asíncron / rankings: compartir estudis, comparar ingressos i reputació.
Escenaris i narrativa: campanya amb objectius i restriccions temàtiques.
Editor de levels / moddability: crear i compartir plantilles de studios, items i events.
Accessibilitat i tutorial interactiu: onboarding guiada, tooltips i opcions d’accessibilitat.
Configuracions de dificultat i modifiers: ajustar taxes, recuperació i economia per rejugabilitat.
Export / import partida: compartir saves i “benchmarks” per competició.
Integració AI: assistents que automatitzen tasques (auto-mix, suggeriments de preu).
Logs històrics i notificacions avançades: timeline d’esdeveniments filtrable.
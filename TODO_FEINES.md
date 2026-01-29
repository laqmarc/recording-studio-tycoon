# TODO feines

## Talent i personal segons tipus de feina
- Definir logica de talent per tipus de gravacio (recording/streaming/podcast/mix/master).
- Crear nou tipus de feian que sera edit. Seria editar les grabacions. Hi haurà un control room especialitzat per això.
- Podcast: el client es qui grava el podcast. Generar noms uniques amb un array de 30 noms + 30 cognoms.
- Live room: requerir musics per instrument. Bombo/caixa/hh/oh compten com el mateix music.
- Diferenciar bandes que porten els seus musics (nomes cal engineer) vs. feines que demanen musics d'estudi.
- Afegir contractes de tipus "productor vol algo diferent" que obliguen musics d'estudi.

## Pipeline multi-sala (gravacio -> edicio -> mescla -> mastering)
- Crear nou tipus de feina "edit" per editar gravacions.
- Afegir control_room especialitzat per edicio (sala o variant amb bonuses d'edit).
- Crear feines multi-etapa que passen per estats/sales diferents.
- Desbloquejar cada etapa quan la sala corresponent existeix i esta activa.
- Estat 1: gravacio (live_room / vocal_booth / control_room segons tipus).
- Estat 2: edicio (control_room o sala dedicada si s'afegeix).
- Estat 3: mescla (control_room).
- Estat 4: mastering (mastering_suite).
- UI: mostrar el progres d'etapes i la sala actual.

## Dades i contingut
- Afegir cataleg de noms/cognoms (30 + 30) per podcasts i clients generics.
- Afegir llistes d'instruments i mapatge de musics per etapes.
- Afegir nous templates de contracte que usin el pipeline multi-sala.

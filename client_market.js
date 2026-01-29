import { state } from './state.js';
import { log, showNotification, euro } from './helpers.js';

const GENRES = ['pop', 'rap', 'hiphop', 'rock', 'podcast', 'live', 'film_score', 'commercial'];
const PODCAST_FIRST_NAMES = [
  'Alex', 'Mia', 'Leo', 'Nora', 'Hugo', 'Vega', 'Jordi', 'Paula', 'Marc', 'Emma',
  'Lucas', 'Laia', 'Bruno', 'Carla', 'Ivan', 'Sofia', 'Eric', 'Lara', 'Dani', 'Alba',
  'Oriol', 'Iris', 'Nil', 'Julia', 'Joan', 'Anna', 'Pol', 'Sara', 'Raul', 'Marta'
];
const PODCAST_LAST_NAMES = [
  'Serra', 'Costa', 'Vidal', 'Roca', 'Puig', 'Soler', 'Mora', 'Rios', 'Flores', 'Perez',
  'Lopez', 'Torres', 'Campos', 'Navarro', 'Reyes', 'Mendez', 'Marin', 'Blanco', 'Vega', 'Ortega',
  'Silva', 'Ramos', 'Iglesias', 'Santos', 'Cruz', 'Nadal', 'Gil', 'Ferrer', 'Castro', 'Soto'
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildUniqueNames(count) {
  const names = new Set();
  let safety = 0;
  const target = Math.max(1, Number(count || 1));
  while (names.size < target && safety < 200) {
    const full = `${pickRandom(PODCAST_FIRST_NAMES)} ${pickRandom(PODCAST_LAST_NAMES)}`;
    names.add(full);
    safety += 1;
  }
  return Array.from(names);
}
const TEMPLATE_POOL = [
  {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [120, 260],
    target_quality: [55, 72],
    duration: [3, 6],
    deadline: [2, 5],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1 }
  },
    {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [120, 220],
    target_quality: [50, 70],
    duration: [2, 4],
    deadline: [2, 5],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1 }
  },
  {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 2,
    allowed_genres: ['any'],
    base_pay: [140, 320],
    target_quality: [58, 75],
    duration: [3, 6],
    deadline: [2, 5],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1, software_daw: 1 }
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 3,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [140, 280],
    target_quality: [58, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 4,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [180, 340],
    target_quality: [62, 80],
    duration: [2, 5],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1, shock_mount: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 4,
    allowed_genres: ['rock', 'live'],
    base_pay: [220, 420],
    target_quality: [60, 78],
    duration: [4, 7],
    deadline: [2, 5],
    min_items: { mic: 4, preamp_multi: 1, interface: 1, headphones: 2, cable: 6, mic_stand: 4 },
    mic_types: ['guitarra', 'caixa', 'oh'],
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 5,
    allowed_genres: ['rock', 'live'],
    base_pay: [300, 520],
    target_quality: [64, 82],
    duration: [5, 8],
    deadline: [2, 5],
    min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6, multicore: 1 },
    mic_types: ['guitarra', 'caixa', 'oh', 'bombo'],
    talent_mode: 'client_band'
  },
  {
    name: 'Studio Musicians Session',
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['rock', 'live'],
    base_pay: [340, 620],
    target_quality: [66, 84],
    duration: [5, 9],
    deadline: [2, 5],
    min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6, multicore: 1 },
    mic_types: ['guitarra', 'caixa', 'oh', 'bombo'],
    talent_mode: 'studio_musicians',
    talent_note: 'Calen musics d\'estudi'
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['any'],
    base_pay: [150, 300],
    target_quality: [60, 75],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 2 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 2,
    allowed_genres: ['any'],
    base_pay: [180, 320],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 4,
    allowed_genres: ['any'],
    base_pay: [220, 380],
    target_quality: [65, 80],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 3, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [220, 420],
    target_quality: [65, 82],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 4, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [260, 460],
    target_quality: [68, 86],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 6, software_mix_master: 1 }
  },
  {
    type: 'master',
    room_type: 'control_room',
    unlock_level: 4,
    allowed_genres: ['any'],
    base_pay: [180, 360],
    target_quality: [62, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 4 }
  },
  {
    type: 'master',
    room_type: 'control_room',
    unlock_level: 5,
    allowed_genres: ['any'],
    base_pay: [220, 400],
    target_quality: [66, 84],
    duration: [3, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 5, software_daw: 1 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [240, 460],
    target_quality: [66, 86],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 6, software_daw: 1 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [300, 540],
    target_quality: [70, 90],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 8, software_mix_master: 1 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    unlock_level: 6,
    allowed_genres: ['hiphop', 'pop', 'film_score'],
    base_pay: [280, 620],
    target_quality: [60, 78],
    duration: [4, 8],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    unlock_level: 7,
    allowed_genres: ['pop', 'hiphop', 'film_score'],
    base_pay: [320, 700],
    target_quality: [62, 80],
    duration: [5, 9],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2, software_daw: 1, midi_controller: 1 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['live', 'podcast'],
    base_pay: [120, 240],
    target_quality: [55, 70],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 4,
    allowed_genres: ['live', 'podcast'],
    base_pay: [160, 300],
    target_quality: [58, 74],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, monitor: 1 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 6,
    allowed_genres: ['live'],
    base_pay: [220, 380],
    target_quality: [60, 78],
    duration: [3, 6],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1 }
  },
  {
    type: 'streaming',
    room_type: 'control_room',
    unlock_level: 2,
    allowed_genres: ['podcast', 'live'],
    base_pay: [140, 260],
    target_quality: [56, 72],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, monitor: 1 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 4,
    allowed_genres: ['podcast'],
    base_pay: [120, 220],
    target_quality: [55, 70],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2 }
  },
  {
    name: 'Podcast Session',
    type: 'recording',
    room_type: 'podcast_studio',
    unlock_level: 3,
    allowed_genres: ['podcast'],
    base_pay: [180, 320],
    target_quality: [60, 78],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { mic: 2, preamp: 1, interface: 1, headphones: 2, pop_filter: 1, mic_stand: 2 },
    mic_types: ['vocals'],
    talent_mode: 'client_podcast',
    client_count: 2,
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'podcast_studio',
        duration_pct: 0.5,
        min_items: { mic: 2, preamp: 1, interface: 1, headphones: 2, pop_filter: 1, mic_stand: 2 },
        mic_types: ['vocals']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.3,
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.2,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      }
    ]
  },
  {
    name: 'Streamer Collab',
    type: 'streaming',
    room_type: 'podcast_studio',
    unlock_level: 4,
    allowed_genres: ['live', 'podcast'],
    base_pay: [160, 300],
    target_quality: [58, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, pop_filter: 1, mic_stand: 2 },
    mic_types: ['vocals'],
    talent_mode: 'client_podcast',
    client_count: 2
  },
  {
    name: 'Podcast Series',
    type: 'recording',
    room_type: 'podcast_studio',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [320, 540],
    target_quality: [62, 80],
    duration: [6, 10],
    deadline: [2, 5],
    talent_mode: 'client_podcast',
    client_count: 2,
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'podcast_studio',
        duration_pct: 0.5,
        min_items: { mic: 2, preamp: 1, interface: 1, headphones: 2, pop_filter: 1, mic_stand: 2 },
        mic_types: ['vocals']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.3,
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.2,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      }
    ]
  },
  {
    name: 'Vocal EP',
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 6,
    allowed_genres: ['pop', 'rap', 'hiphop'],
    base_pay: [420, 760],
    target_quality: [68, 86],
    duration: [6, 10],
    deadline: [3, 6],
    talent_mode: 'studio_musicians',
    talent_note: "Cal vocalista d'estudi",
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'vocal_booth',
        duration_pct: 0.4,
        min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
        mic_types: ['vocals']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.2,
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.25,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      },
      {
        id: 'master',
        label: 'Mastering',
        type: 'master',
        room_type: 'mastering_suite',
        duration_pct: 0.15,
        min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
      }
    ]
  },
  {
    name: 'Ad Voiceover',
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 4,
    allowed_genres: ['commercial'],
    base_pay: [200, 360],
    target_quality: [62, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    name: 'Agency Spot Mix',
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 5,
    allowed_genres: ['commercial', 'film_score'],
    base_pay: [240, 420],
    target_quality: [64, 82],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
  },
  {
    name: 'Foley Effects Session',
    type: 'recording',
    room_type: 'foley_room',
    unlock_level: 5,
    allowed_genres: ['film_score', 'commercial'],
    base_pay: [280, 520],
    target_quality: [62, 82],
    duration: [4, 7],
    deadline: [2, 5],
    min_items: { mic: 4, preamp: 1, interface: 1, headphones: 2, instruments: 2, effects: 1, mic_stand: 4, cable: 6 },
    mic_types: ['oh', 'guitarra', 'vocals']
  },
  // Vocal booth expansion
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 3,
    allowed_genres: ['rap', 'hiphop'],
    base_pay: [160, 320],
    target_quality: [60, 78],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 4,
    allowed_genres: ['pop'],
    base_pay: [180, 340],
    target_quality: [62, 80],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 4,
    allowed_genres: ['podcast'],
    base_pay: [140, 240],
    target_quality: [58, 74],
    duration: [2, 4],
    deadline: [1, 2],
    min_items: { mic: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 6,
    allowed_genres: ['pop', 'rap', 'hiphop'],
    base_pay: [200, 380],
    target_quality: [64, 82],
    duration: [3, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 2 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [220, 420],
    target_quality: [66, 84],
    duration: [3, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 4 },
    mic_types: ['vocals']
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 4,
    allowed_genres: ['podcast', 'live'],
    base_pay: [120, 220],
    target_quality: [56, 72],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1 }
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [140, 240],
    target_quality: [58, 74],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1, headphone_amp: 1 }
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 6,
    allowed_genres: ['live'],
    base_pay: [160, 280],
    target_quality: [60, 76],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1, acoustic_treatment: 2 }
  },
  // Live room expansion
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 3,
    allowed_genres: ['rock'],
    base_pay: [240, 420],
    target_quality: [60, 78],
    duration: [4, 7],
    deadline: [2, 5],
    min_items: { mic: 5, preamp_multi: 1, interface: 1, headphones: 3, cable: 8, mic_stand: 5 },
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 4,
    allowed_genres: ['live'],
    base_pay: [260, 440],
    target_quality: [62, 80],
    duration: [4, 7],
    deadline: [2, 5],
    min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6, mic_accessory: 2 },
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 5,
    allowed_genres: ['rock', 'live'],
    base_pay: [300, 520],
    target_quality: [64, 82],
    duration: [5, 8],
    deadline: [2, 5],
    min_items: { mic: 8, preamp_multi: 1, interface: 1, headphones: 4, cable: 12, mic_stand: 8, multicore: 1 },
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['rock'],
    base_pay: [320, 560],
    target_quality: [66, 84],
    duration: [5, 9],
    deadline: [2, 5],
    min_items: { mic: 10, preamp_multi: 2, interface: 1, headphones: 5, cable: 14, mic_stand: 10, mic_accessory: 4 },
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [340, 620],
    target_quality: [66, 86],
    duration: [6, 9],
    deadline: [2, 5],
    min_items: { mic: 12, preamp_multi: 2, interface: 1, headphones: 6, cable: 16, mic_stand: 12, multicore: 1 },
    talent_mode: 'client_band'
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 8,
    allowed_genres: ['rock', 'live'],
    base_pay: [380, 700],
    target_quality: [68, 88],
    duration: [6, 10],
    deadline: [3, 6],
    min_items: { mic: 14, preamp_multi: 2, interface: 2, headphones: 6, cable: 18, mic_stand: 14, mic_accessory: 6, multicore: 1 }
  },
  {
    type: 'streaming',
    room_type: 'live_room',
    unlock_level: 4,
    allowed_genres: ['live'],
    base_pay: [180, 300],
    target_quality: [58, 74],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, cable: 6 }
  },
  {
    type: 'streaming',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['live'],
    base_pay: [220, 360],
    target_quality: [60, 76],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 3, headphones: 3, cable: 8, mic_stand: 3 }
  },
  // Mastering suite expansion
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [240, 420],
    target_quality: [66, 84],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 6, software_daw: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [260, 460],
    target_quality: [68, 86],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 6, software_daw: 1, effects: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [280, 520],
    target_quality: [70, 88],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 3, acoustic_treatment: 8, software_daw: 1, effects: 2 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [260, 480],
    target_quality: [68, 88],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 6, software_daw: 1 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [320, 560],
    target_quality: [72, 92],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { monitor: 3, acoustic_treatment: 8, software_daw: 1, effects: 2 }
  },
  {
    type: 'mix_master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [360, 640],
    target_quality: [72, 92],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 3, acoustic_treatment: 8, software_daw: 1, effects: 2 }
  },
  // Streaming room expansion
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 4,
    allowed_genres: ['podcast'],
    base_pay: [140, 240],
    target_quality: [56, 72],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, mic_stand: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['live'],
    base_pay: [180, 320],
    target_quality: [58, 74],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1, mic_stand: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 6,
    allowed_genres: ['live'],
    base_pay: [220, 380],
    target_quality: [60, 78],
    duration: [3, 6],
    deadline: [1, 3],
    min_items: { interface: 2, mic: 3, headphones: 3, monitor: 1, mic_stand: 3, cable: 6 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [260, 420],
    target_quality: [62, 80],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { interface: 2, mic: 3, headphones: 3, monitor: 1, mic_stand: 3, acoustic_treatment: 2 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 4,
    allowed_genres: ['podcast'],
    base_pay: [120, 220],
    target_quality: [55, 70],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2, mic_stand: 2 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [150, 260],
    target_quality: [58, 74],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2, mic_stand: 2, acoustic_treatment: 2 }
  },
  // High-tier progression templates (10 per room type)
  {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 5,
    allowed_genres: ['any'],
    base_pay: [200, 380],
    target_quality: [60, 78],
    duration: [3, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1, software_daw: 1 }
  },
  {
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [280, 520],
    target_quality: [64, 82],
    duration: [4, 7],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1, software_daw: 1, acoustic_treatment: 2 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 5,
    allowed_genres: ['any'],
    base_pay: [260, 460],
    target_quality: [66, 82],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [300, 520],
    target_quality: [68, 84],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 5, software_mix_master: 1, effects: 1 }
  },
  {
    type: 'mix_master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [380, 680],
    target_quality: [70, 88],
    duration: [5, 7],
    deadline: [2, 4],
    min_items: { monitor: 2, acoustic_treatment: 5, software_mix_master: 1, effects: 2 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [260, 480],
    target_quality: [66, 84],
    duration: [3, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 5, software_daw: 1 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    unlock_level: 8,
    allowed_genres: ['pop', 'hiphop', 'film_score'],
    base_pay: [400, 800],
    target_quality: [66, 84],
    duration: [6, 10],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2, software_daw: 1, midi_controller: 1, instruments: 1 }
  },
  {
    type: 'production',
    room_type: 'control_room',
    unlock_level: 9,
    allowed_genres: ['pop', 'hiphop', 'film_score'],
    base_pay: [480, 900],
    target_quality: [68, 86],
    duration: [6, 10],
    deadline: [3, 6],
    min_items: { interface: 1, monitor: 2, software_daw: 1, midi_controller: 1, instruments: 1 }
  },
  {
    type: 'streaming',
    room_type: 'control_room',
    unlock_level: 5,
    allowed_genres: ['podcast', 'live'],
    base_pay: [180, 320],
    target_quality: [60, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1 }
  },
  {
    type: 'streaming',
    room_type: 'control_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [220, 360],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1, software_daw: 1 }
  },
  // Vocal booth high-tier
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 5,
    allowed_genres: ['rap', 'hiphop'],
    base_pay: [180, 320],
    target_quality: [62, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1, shock_mount: 1 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 6,
    allowed_genres: ['pop'],
    base_pay: [220, 380],
    target_quality: [64, 82],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 2 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [260, 420],
    target_quality: [66, 84],
    duration: [3, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 4 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [300, 500],
    target_quality: [68, 86],
    duration: [3, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 6 },
    mic_types: ['vocals']
  },
  {
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 9,
    allowed_genres: ['any'],
    base_pay: [340, 560],
    target_quality: [70, 88],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, shock_mount: 1, mic_stand: 1, acoustic_treatment: 8 },
    mic_types: ['vocals']
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [150, 260],
    target_quality: [58, 74],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1 }
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 6,
    allowed_genres: ['podcast'],
    base_pay: [180, 300],
    target_quality: [60, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1, headphone_amp: 1 }
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [200, 340],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1, acoustic_treatment: 2 }
  },
  {
    type: 'streaming',
    room_type: 'vocal_booth',
    unlock_level: 8,
    allowed_genres: ['live'],
    base_pay: [230, 380],
    target_quality: [64, 80],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 1, headphones: 1, pop_filter: 1, mic_stand: 1, acoustic_treatment: 4 }
  },
  // Live room high-tier
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['rock'],
    base_pay: [320, 560],
    target_quality: [66, 84],
    duration: [5, 9],
    deadline: [2, 5],
    min_items: { mic: 10, preamp_multi: 2, interface: 1, headphones: 5, cable: 14, mic_stand: 10, mic_accessory: 4 }
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [360, 620],
    target_quality: [68, 86],
    duration: [6, 9],
    deadline: [2, 5],
    min_items: { mic: 12, preamp_multi: 2, interface: 1, headphones: 6, cable: 16, mic_stand: 12, multicore: 1 }
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 8,
    allowed_genres: ['rock', 'live'],
    base_pay: [420, 740],
    target_quality: [70, 88],
    duration: [6, 10],
    deadline: [3, 6],
    min_items: { mic: 14, preamp_multi: 2, interface: 2, headphones: 6, cable: 18, mic_stand: 14, mic_accessory: 6, multicore: 1 }
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 9,
    allowed_genres: ['rock', 'live'],
    base_pay: [460, 820],
    target_quality: [72, 90],
    duration: [7, 10],
    deadline: [3, 6],
    min_items: { mic: 16, preamp_multi: 3, interface: 2, headphones: 8, cable: 20, mic_stand: 16, mic_accessory: 8, multicore: 1 }
  },
  {
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 10,
    allowed_genres: ['live'],
    base_pay: [520, 900],
    target_quality: [74, 92],
    duration: [7, 11],
    deadline: [3, 6],
    min_items: { mic: 18, preamp_multi: 3, interface: 2, headphones: 8, cable: 22, mic_stand: 18, mic_accessory: 10, multicore: 1 }
  },
  {
    type: 'streaming',
    room_type: 'live_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [260, 420],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 3, headphones: 3, cable: 8, mic_stand: 3 }
  },
  {
    type: 'streaming',
    room_type: 'live_room',
    unlock_level: 8,
    allowed_genres: ['live'],
    base_pay: [300, 480],
    target_quality: [64, 80],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 2, mic: 4, headphones: 4, cable: 10, mic_stand: 4 }
  },
  {
    type: 'streaming',
    room_type: 'live_room',
    unlock_level: 9,
    allowed_genres: ['live'],
    base_pay: [340, 520],
    target_quality: [66, 82],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { interface: 2, mic: 4, headphones: 4, cable: 12, mic_stand: 4, acoustic_treatment: 2 }
  },
  // Mastering suite high-tier
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 7,
    allowed_genres: ['any'],
    base_pay: [280, 500],
    target_quality: [68, 86],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 3, acoustic_treatment: 8, software_mix_master: 1, effects: 2 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [320, 560],
    target_quality: [70, 88],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 3, acoustic_treatment: 8, software_mix_master: 1, effects: 2 }
  },
  {
    type: 'mix',
    room_type: 'mastering_suite',
    unlock_level: 9,
    allowed_genres: ['any'],
    base_pay: [360, 620],
    target_quality: [72, 90],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 4, acoustic_treatment: 10, software_mix_master: 1, effects: 3 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [320, 560],
    target_quality: [72, 90],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { monitor: 3, acoustic_treatment: 8, software_mix_master: 1, effects: 2 }
  },
  {
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 9,
    allowed_genres: ['any'],
    base_pay: [380, 640],
    target_quality: [74, 92],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { monitor: 4, acoustic_treatment: 10, software_mix_master: 1, effects: 3 }
  },
  {
    type: 'mix_master',
    room_type: 'mastering_suite',
    unlock_level: 9,
    allowed_genres: ['any'],
    base_pay: [420, 720],
    target_quality: [74, 92],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 4, acoustic_treatment: 10, software_mix_master: 1, effects: 3 }
  },
  {
    type: 'mix_master',
    room_type: 'mastering_suite',
    unlock_level: 10,
    allowed_genres: ['any'],
    base_pay: [480, 820],
    target_quality: [76, 94],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { monitor: 4, acoustic_treatment: 12, software_mix_master: 1, effects: 4 }
  },
  // Streaming room high-tier
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [180, 320],
    target_quality: [60, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, mic_stand: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 6,
    allowed_genres: ['live'],
    base_pay: [220, 380],
    target_quality: [62, 78],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1, mic_stand: 2 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 7,
    allowed_genres: ['live'],
    base_pay: [260, 420],
    target_quality: [64, 80],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { interface: 2, mic: 3, headphones: 3, monitor: 1, mic_stand: 3 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 8,
    allowed_genres: ['live'],
    base_pay: [300, 460],
    target_quality: [66, 82],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { interface: 2, mic: 3, headphones: 3, monitor: 1, mic_stand: 3, cable: 6 }
  },
  {
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 9,
    allowed_genres: ['live'],
    base_pay: [340, 520],
    target_quality: [68, 84],
    duration: [4, 6],
    deadline: [2, 4],
    min_items: { interface: 2, mic: 4, headphones: 4, monitor: 1, mic_stand: 4, acoustic_treatment: 2 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['podcast'],
    base_pay: [160, 280],
    target_quality: [60, 76],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2, mic_stand: 2 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 6,
    allowed_genres: ['podcast'],
    base_pay: [200, 320],
    target_quality: [62, 78],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2, mic_stand: 2, acoustic_treatment: 2 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 7,
    allowed_genres: ['podcast'],
    base_pay: [240, 380],
    target_quality: [64, 80],
    duration: [2, 4],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 1, headphones: 2, mic_stand: 2, acoustic_treatment: 4 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 8,
    allowed_genres: ['podcast'],
    base_pay: [280, 420],
    target_quality: [66, 82],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 2, headphones: 2, mic_stand: 2, acoustic_treatment: 4 }
  },
  {
    type: 'recording',
    room_type: 'streaming_room',
    unlock_level: 9,
    allowed_genres: ['podcast'],
    base_pay: [320, 480],
    target_quality: [68, 84],
    duration: [3, 5],
    deadline: [1, 3],
    min_items: { mic: 2, interface: 2, headphones: 2, mic_stand: 2, acoustic_treatment: 6 }
  },
  {
    type: 'edit',
    room_type: 'edit_room',
    unlock_level: 4,
    allowed_genres: ['any'],
    base_pay: [140, 260],
    target_quality: [60, 78],
    duration: [2, 4],
    deadline: [2, 4],
    min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
  },
  {
    type: 'edit',
    room_type: 'edit_room',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [200, 340],
    target_quality: [64, 82],
    duration: [3, 5],
    deadline: [2, 4],
    min_items: { monitor: 2, interface: 1, headphones: 2, software_daw: 1, software_fx: 1 }
  },
  {
    name: 'Full Production',
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 7,
    allowed_genres: ['rock', 'live'],
    base_pay: [800, 1400],
    target_quality: [70, 88],
    duration: [10, 16],
    deadline: [4, 8],
    talent_mode: 'client_band',
    talent_note: 'Banda client · només cal engineer',
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'live_room',
        duration_pct: 0.4,
        duration_pct_by_genre: { live: 0.45, rock: 0.4 },
        min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6 },
        mic_types: ['guitarra', 'caixa', 'oh', 'bombo']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.25,
        duration_pct_by_genre: { live: 0.18, rock: 0.25 },
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.25,
        duration_pct_by_genre: { live: 0.22, rock: 0.25 },
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      },
      {
        id: 'master',
        label: 'Mastering',
        type: 'master',
        room_type: 'mastering_suite',
        duration_pct: 0.1,
        duration_pct_by_genre: { live: 0.15, rock: 0.1 },
        min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
      }
    ]
  },
  {
    name: 'Indie Single',
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 5,
    allowed_genres: ['pop', 'rap', 'hiphop'],
    base_pay: [380, 640],
    target_quality: [66, 84],
    duration: [5, 9],
    deadline: [3, 6],
    talent_mode: 'studio_musicians',
    talent_note: "Cal vocalista d'estudi",
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'vocal_booth',
        duration_pct: 0.45,
        duration_pct_by_genre: { pop: 0.4, rap: 0.5, hiphop: 0.5 },
        min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, pop_filter: 1, mic_stand: 1 },
        mic_types: ['vocals']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.2,
        duration_pct_by_genre: { pop: 0.25, rap: 0.18, hiphop: 0.18 },
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.25,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      },
      {
        id: 'master',
        label: 'Mastering',
        type: 'master',
        room_type: 'mastering_suite',
        duration_pct: 0.1,
        min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
      }
    ]
  },
  {
    name: 'Live Session',
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['live', 'rock'],
    base_pay: [420, 760],
    target_quality: [66, 84],
    duration: [6, 10],
    deadline: [3, 6],
    talent_mode: 'client_band',
    talent_note: 'Banda client · només cal engineer',
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'live_room',
        duration_pct: 0.6,
        duration_pct_by_genre: { live: 0.65, rock: 0.6 },
        min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6 },
        mic_types: ['guitarra', 'caixa', 'oh', 'bombo']
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.3,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      },
      {
        id: 'master',
        label: 'Mastering',
        type: 'master',
        room_type: 'mastering_suite',
        duration_pct: 0.1,
        min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
      }
    ]
  },
  {
    name: 'Film Cue',
    type: 'recording',
    room_type: 'foley_room',
    unlock_level: 7,
    allowed_genres: ['film_score'],
    base_pay: [520, 920],
    target_quality: [70, 88],
    duration: [6, 12],
    deadline: [3, 6],
    talent_mode: 'studio_musicians',
    stages: [
      {
        id: 'record',
        label: 'Gravacio',
        type: 'recording',
        room_type: 'foley_room',
        duration_pct: 0.45,
        min_items: { mic: 4, preamp: 1, interface: 1, headphones: 2, instruments: 2, effects: 1, mic_stand: 4, cable: 6 },
        mic_types: ['oh', 'guitarra', 'vocals']
      },
      {
        id: 'edit',
        label: 'Edicio',
        type: 'edit',
        room_type: 'edit_room',
        duration_pct: 0.25,
        min_items: { monitor: 2, interface: 1, headphones: 1, software_daw: 1 }
      },
      {
        id: 'mix',
        label: 'Mescla',
        type: 'mix',
        room_type: 'control_room',
        duration_pct: 0.2,
        min_items: { monitor: 2, acoustic_treatment: 2, software_daw: 1 }
      },
      {
        id: 'master',
        label: 'Mastering',
        type: 'master',
        room_type: 'mastering_suite',
        duration_pct: 0.1,
        min_items: { monitor: 2, acoustic_treatment: 4, software_mix_master: 1 }
      }
    ]
  }
];

const SPECIAL_TEMPLATES = [
  {
    name: 'SP First Recording',
    type: 'recording',
    room_type: 'control_room',
    unlock_level: 1,
    allowed_genres: ['pop', 'rap', 'hiphop', 'podcast'],
    base_pay: [300, 600],
    target_quality: [60, 75],
    duration: [8, 16],
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1 }
  },
  {
    name: 'SP Quick Mix',
    type: 'mix',
    room_type: 'control_room',
    unlock_level: 2,
    allowed_genres: ['any'],
    base_pay: [350, 650],
    target_quality: [65, 80],
    duration: [6, 12],
    min_items: { monitor: 2, acoustic_treatment: 2 }
  },
  {
    name: 'SP Tour Sessions',
    type: 'recording',
    room_type: 'live_room',
    unlock_level: 6,
    allowed_genres: ['live', 'rock'],
    base_pay: [1200, 2200],
    target_quality: [70, 88],
    duration: [24, 48],
    min_items: { mic: 10, preamp_multi: 1, interface: 1, headphones: 4, cable: 12, mic_stand: 10, multicore: 1 }
  },
  {
    name: 'SP Vocal Tour',
    type: 'recording',
    room_type: 'vocal_booth',
    unlock_level: 5,
    allowed_genres: ['pop', 'rap', 'hiphop'],
    base_pay: [700, 1500],
    target_quality: [68, 84],
    duration: [24, 40],
    min_items: { mic: 4, preamp: 1, interface: 1, headphones: 2, pop_filter: 1, mic_stand: 2 }
  },
  {
    name: 'SP Production Sprint',
    type: 'production',
    room_type: 'control_room',
    unlock_level: 7,
    allowed_genres: ['pop', 'hiphop', 'film_score'],
    base_pay: [1400, 2600],
    target_quality: [70, 88],
    duration: [32, 56],
    min_items: { interface: 1, monitor: 2, software_daw: 1, midi_controller: 1 }
  },
  {
    name: 'SP Mastering Marathon',
    type: 'master',
    room_type: 'mastering_suite',
    unlock_level: 8,
    allowed_genres: ['any'],
    base_pay: [1200, 2200],
    target_quality: [72, 92],
    duration: [24, 40],
    min_items: { monitor: 2, acoustic_treatment: 6, software_mix_master: 1 }
  },
  {
    name: 'SP Streaming Week',
    type: 'streaming',
    room_type: 'streaming_room',
    unlock_level: 5,
    allowed_genres: ['live', 'podcast'],
    base_pay: [600, 1400],
    target_quality: [62, 80],
    duration: [24, 48],
    min_items: { interface: 1, mic: 3, headphones: 2, monitor: 1 }
  }
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[0];
}

function pickGenreWithTemplates(templates) {
  const rep = (state.reputation && state.reputation.byGenre) ? state.reputation.byGenre : {};
  const allowed = new Set();
  for (const t of templates) {
    const list = t.allowed_genres || ['any'];
    if (list.includes('any')) {
      for (const g of GENRES) allowed.add(g);
    } else {
      for (const g of list) allowed.add(g);
    }
  }
  const genres = GENRES.filter(g => allowed.has(g));
  if (!genres.length) return 'pop';
  const weights = genres.map(g => 1 + Number(rep[g] || 0));
  return pickWeighted(genres, weights);
}

function pickTemplate(templates, genre) {
  const playerLevel = Number((state.player && state.player.level) || 1);
  const pool = templates.filter(t => {
    if (t.unlock_level && playerLevel < t.unlock_level) return false;
    const allowed = t.allowed_genres || ['any'];
    if (!allowed.includes('any') && !allowed.includes(genre)) return false;
    return true;
  });
  if (!pool.length) return templates[randInt(0, templates.length - 1)];
  return pool[randInt(0, pool.length - 1)];
}

export function getEligibleTemplates(repOverall) {
  const playerLevel = Number((state.player && state.player.level) || 1);
  const unlockedTypes = getUnlockedRoomTypes();
  return TEMPLATE_POOL.filter(t => {
    if (t.unlock_level && playerLevel < t.unlock_level) return false;
    if (Array.isArray(t.stages) && t.stages.length) {
      for (const stage of t.stages) {
        if (stage.room_type && !unlockedTypes.has(stage.room_type)) return false;
        if (stage.room_type && !hasActiveRoomType(stage.room_type)) return false;
      }
    } else if (t.room_type && !unlockedTypes.has(t.room_type)) return false;
    if (repOverall < 5) return t.type === 'recording' || t.type === 'mix' || t.type === 'edit';
    if (repOverall < 10) return t.type === 'recording' || t.type === 'mix' || t.type === 'edit' || t.type === 'master';
    if (repOverall < 20) return t.type !== 'production';
    return true;
  });
}

function getUnlockedRoomTypes() {
  const types = new Set();
  const rooms = state.db && Array.isArray(state.db.rooms) ? state.db.rooms : [];
  const level = Number((state.player && state.player.level) || 1);
  for (const r of rooms) {
    if (Number(r.unlock_level || 1) <= level) types.add(r.type);
  }
  return types;
}

function hasActiveRoomType(roomType) {
  const rooms = state.db && Array.isArray(state.db.rooms) ? state.db.rooms : [];
  const installs = Array.isArray(state.roomsInstalled) ? state.roomsInstalled : [];
  return rooms.some((r, idx) => {
    if (!r || r.type !== roomType) return false;
    const bag = installs[idx] || {};
    return Object.values(bag).some(arr => Array.isArray(arr) && arr.length > 0);
  });
}

function pickMicTypes(genre, type, roomType, micCount) {
  if (type !== 'recording' && type !== 'streaming') return [];
  if (roomType === 'vocal_booth') return ['vocals'];
  if (roomType === 'streaming_room') return ['vocals'];
  if (roomType === 'live_room' || genre === 'rock' || genre === 'live') {
    if (Number(micCount || 0) && Number(micCount) < 4) return ['vocals'];
    return ['bombo', 'caixa', 'oh', 'guitarra'];
  }
  if (genre === 'film_score') return ['vocals', 'guitarra', 'oh'];
  return ['vocals'];
}

function distributeMicTypeCounts(micTypes, total) {
  const counts = {};
  if (!Array.isArray(micTypes) || !micTypes.length || !total) return counts;
  const types = micTypes.slice(0, Math.min(micTypes.length, total));
  const base = Math.floor(total / types.length);
  const extra = total % types.length;
  types.forEach((type, idx) => {
    counts[type] = base + (idx < extra ? 1 : 0);
  });
  return counts;
}

function buildStageRequirements(stage, genre) {
  const req = {
    room_type: stage.room_type,
    min_items: stage.min_items || {}
  };
  const micTotal = Number((req.min_items && req.min_items.mic) || 0);
  let micTypes = Array.isArray(stage.mic_types) && stage.mic_types.length
    ? stage.mic_types.slice()
    : pickMicTypes(genre, stage.type, stage.room_type, micTotal);
  if (!micTypes.length && micTotal > 0) micTypes = ['vocals'];
  if (micTotal > 0 && micTypes.length > micTotal) micTypes = micTypes.slice(0, micTotal);
  if (micTypes.length) {
    req.mic_types = micTypes;
    if (micTotal > 0) req.mic_type_counts = distributeMicTypeCounts(micTypes, micTotal);
    const minInputs = Math.max(micTotal, micTypes.length);
    if (minInputs > 0) req.min_interface_inputs = minInputs;
  }
  return req;
}

function applyTalentMetadata(template, offer, genre) {
  const talentMode = template.talent_mode || (genre === 'podcast' ? 'client_podcast' : 'studio_musicians');
  offer.talent_mode = talentMode;
  if (template.talent_note) offer.talent_note = template.talent_note;
  if (talentMode === 'client_podcast') {
    const count = template.client_count || randInt(2, 3);
    offer.client_names = buildUniqueNames(count);
  }
  if (talentMode === 'client_band') {
    const count = template.client_count || randInt(3, 5);
    offer.client_names = buildUniqueNames(count);
    offer.talent_note = offer.talent_note || 'Banda client · només cal engineer';
  }
}

export function buildStages(template, genre, totalHours) {
  if (!Array.isArray(template.stages) || !template.stages.length) return null;
  const stages = [];
  let remaining = Math.max(1, Number(totalHours || 1));
  template.stages.forEach((stage, idx) => {
    let pct = Number(stage.duration_pct || 0);
    if (stage.duration_pct_by_genre && typeof stage.duration_pct_by_genre === 'object') {
      if (stage.duration_pct_by_genre[genre] != null) pct = Number(stage.duration_pct_by_genre[genre]);
      else if (stage.duration_pct_by_genre.any != null) pct = Number(stage.duration_pct_by_genre.any);
    }
    const isLast = idx === template.stages.length - 1;
    const hours = isLast
      ? Math.max(1, remaining)
      : Math.max(1, Math.round(totalHours * pct));
    remaining = Math.max(0, remaining - hours);
    const requirements = buildStageRequirements(stage, genre);
    stages.push({
      id: stage.id || stage.type,
      label: stage.label || formatTypeLabel(stage.type),
      type: stage.type,
      room_type: stage.room_type,
      duration_hours: hours,
      requirements
    });
  });
  return stages;
}

function formatTypeLabel(type) {
  const map = {
    recording: 'Gravacio',
    streaming: 'Streaming',
    mix: 'Mescla',
    master: 'Mastering',
    mix_master: 'Mescla + Mastering',
    production: 'Produccio',
    edit: 'Edicio'
  };
  if (map[type]) return map[type];
  const label = String(type || '').replace(/_/g, ' ');
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildMilestones(totalHours) {
  const steps = [
    {
      id: 'prep',
      label: 'Pre-produccio',
      atPct: 0.25,
      options: [
        { id: 'fast', label: 'Anar rapid', effects: { pay_multiplier: 1.04, quality_delta: -2, deadline_delta: -1 } },
        { id: 'quality', label: 'Refinar', effects: { pay_multiplier: 1.08, quality_delta: 3, deadline_delta: 1 } }
      ]
    },
    {
      id: 'mid',
      label: 'Mig projecte',
      atPct: 0.55,
      options: [
        { id: 'extra', label: 'Prendre extra takes', effects: { pay_multiplier: 1.06, quality_delta: 2, deadline_delta: 1 } },
        { id: 'keep', label: 'Mantenir ritme', effects: { pay_multiplier: 1.02, quality_delta: 1, deadline_delta: 0 } }
      ]
    },
    {
      id: 'final',
      label: 'Tancament',
      atPct: 0.85,
      options: [
        { id: 'master', label: 'Passada extra', effects: { pay_multiplier: 1.07, quality_delta: 3, deadline_delta: 1 } },
        { id: 'deliver', label: 'Entregar aviat', effects: { pay_multiplier: 0.98, quality_delta: -1, deadline_delta: -1 } }
      ]
    }
  ];
  return steps.map(step => ({
    id: step.id,
    label: step.label,
    at_hours: Math.max(1, Math.round(totalHours * step.atPct)),
    options: step.options,
    reached: false,
    choice: null
  }));
}

function buildSpecialOffer(day, index, template) {
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const genre = pickGenreWithTemplates([template]);
  const pay = randInt(template.base_pay[0], template.base_pay[1]);
  const target = randInt(template.target_quality[0], template.target_quality[1]);
  const duration = randInt(template.duration[0], template.duration[1]);
  const workHours = Number(state.time && state.time.workHoursPerDay || 8);
  const duration_days = Math.ceil(duration / workHours);
  const deadline = duration_days + randInt(2, 5);
  const repBoost = Math.min(2.5, 1 + repOverall * 0.01);
  const genreRep = (state.reputation && state.reputation.byGenre) ? Number(state.reputation.byGenre[genre] || 0) : 0;
  const genreBoost = Math.min(3, 1 + genreRep * 0.015);
  const base_pay = Math.round(pay * repBoost * genreBoost);
  const target_quality = Math.min(92, Math.round(target + repOverall * 0.15));
  const milestones = buildMilestones(duration);
  const stages = buildStages(template, genre, duration);
  const stage = stages ? stages[0] : null;
  const stageHours = stage ? stage.duration_hours : duration;
  const stageType = stage ? stage.type : template.type;
  let requirements = null;
  if (stage) {
    requirements = stage.requirements;
  } else {
    const micTotal = Number((template.min_items && template.min_items.mic) || 0);
    let micTypes = Array.isArray(template.mic_types) && template.mic_types.length
      ? template.mic_types.slice()
      : pickMicTypes(genre, template.type, template.room_type, micTotal);
    if (!micTypes.length && micTotal > 0) micTypes = ['vocals'];
    if (micTotal > 0 && micTypes.length > micTotal) micTypes = micTypes.slice(0, micTotal);
    requirements = (() => {
      const req = {
        room_type: template.room_type,
        min_items: template.min_items
      };
      if (micTypes.length) {
        req.mic_types = micTypes;
        if (micTotal > 0) req.mic_type_counts = distributeMicTypeCounts(micTypes, micTotal);
        const minInputs = Math.max(micTotal, micTypes.length);
        if (minInputs > 0) req.min_interface_inputs = minInputs;
      }
      return req;
    })();
  }

  const offer = {
    id: `special_${day}_${index}_${Math.floor(Math.random() * 9999)}`,
    name: `${template.name} · ${genre}`,
    type: stageType,
    genre,
    duration_hours: stageHours,
    duration_days,
    base_pay,
    target_quality,
    deadline_days: deadline,
    start_day: day,
    expires_day: day + randInt(3, 5),
    special: true,
    milestones,
    requirements,
    reputation_gain: { success: Math.max(2, Math.round(genreRep * 0.35) + 3), fail: 1 },
    source: 'special',
    pipeline: Boolean(stages && stages.length),
    stages: stages || [],
    stage_index: 0,
    stage_label: stage ? stage.label : null,
    pipeline_total_hours: duration
  };
  applyTalentMetadata(template, offer, genre);
  return offer;
}

function buildOffer(day, index, templates) {
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const genre = pickGenreWithTemplates(templates);
  const template = pickTemplate(templates, genre);
  const pay = randInt(template.base_pay[0], template.base_pay[1]);
  const target = randInt(template.target_quality[0], template.target_quality[1]);
  const duration = randInt(template.duration[0], template.duration[1]);
  const workHours = Number(state.time && state.time.workHoursPerDay || 8);
  const duration_days = Math.ceil(duration / workHours);
  const deadline = randInt(template.deadline[0], template.deadline[1]);
  const repBoost = Math.min(2.5, 1 + repOverall * 0.01);
  const genreRep = (state.reputation && state.reputation.byGenre) ? Number(state.reputation.byGenre[genre] || 0) : 0;
  const genreBoost = Math.min(3, 1 + genreRep * 0.015);
  const base_pay = Math.round(pay * repBoost * genreBoost);
  const target_quality = Math.min(90, Math.round(target + repOverall * 0.2));

  const typeLabel = formatTypeLabel(template.type);
  const name = template.name ? `${template.name} · ${genre}` : `${typeLabel} · ${genre}`;
  const stages = buildStages(template, genre, duration);
  const stage = stages ? stages[0] : null;
  const stageHours = stage ? stage.duration_hours : duration;
  const stageType = stage ? stage.type : template.type;
  let requirements = null;
  if (stage) {
    requirements = stage.requirements;
  } else {
    requirements = (() => {
      const req = {
        room_type: template.room_type,
        min_items: template.min_items
      };
      const micTotal = Number((template.min_items && template.min_items.mic) || 0);
      let micTypes = Array.isArray(template.mic_types) && template.mic_types.length
        ? template.mic_types.slice()
        : pickMicTypes(genre, template.type, template.room_type, micTotal);
      if (!micTypes.length && micTotal > 0) micTypes = ['vocals'];
      if (micTotal > 0 && micTypes.length > micTotal) micTypes = micTypes.slice(0, micTotal);
      if (micTypes.length) {
        req.mic_types = micTypes;
        if (micTotal > 0) req.mic_type_counts = distributeMicTypeCounts(micTypes, micTotal);
        const minInputs = Math.max(micTotal, micTypes.length);
        if (minInputs > 0) req.min_interface_inputs = minInputs;
      }
      return req;
    })();
  }
  const offer = {
    id: `offer_${day}_${index}_${Math.floor(Math.random() * 9999)}`,
    name,
    type: stageType,
    genre,
    duration_hours: stageHours,
    duration_days,
    base_pay,
    target_quality,
    deadline_days: deadline,
    start_day: day,
    requirements,
    reputation_gain: { success: Math.max(1, Math.round(genreRep * 0.3) + 2), fail: 1 },
    source: 'market',
    pipeline: Boolean(stages && stages.length),
    stages: stages || [],
    stage_index: 0,
    stage_label: stage ? stage.label : null,
    pipeline_total_hours: duration
  };
  applyTalentMetadata(template, offer, genre);
  return offer;
}

export function generateDailyOffers(force = false) {
  state.market = state.market || { offers: [], lastDayGenerated: 0 };
  const day = state.time ? Number(state.time.day || 1) : 1;
  if (!force && state.market.lastDayGenerated === day && state.market.offers && state.market.offers.length) return state.market.offers;
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const eligibleTemplates = getEligibleTemplates(repOverall);
  const templates = eligibleTemplates.length
    ? eligibleTemplates
    : TEMPLATE_POOL.filter(t => t.room_type === 'control_room');
  const poolSize = templates.length || TEMPLATE_POOL.length;
  const count = Math.min(8, Math.max(2, Math.min(poolSize, 2 + Math.floor(repOverall / 5))));
  const offers = [];
  for (let i = 0; i < count; i++) offers.push(buildOffer(day, i + 1, templates));
  state.market.offers = offers;
  state.market.lastDayGenerated = day;
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof showNotification === 'function') showNotification(`📬 ${offers.length} ofertes noves`);
  try { if (typeof generateSpecialOffers === 'function') generateSpecialOffers(); } catch (e) {}
  return offers;
}

export function generateSpecialOffers(force = false) {
  state.market = state.market || { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };
  const day = state.time ? Number(state.time.day || 1) : 1;
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const playerLevel = Number((state.player && state.player.level) || 1);
  if (repOverall < 6) return [];
  state.market.specials = Array.isArray(state.market.specials) ? state.market.specials : [];
  state.market.specials = state.market.specials.filter(s => !s.expires_day || s.expires_day >= day);
  const lastDay = Number(state.market.lastSpecialDay || 0);
  if (!force && state.market.specials.length && (day - lastDay) < 4) return state.market.specials;
  const unlockedTypes = getUnlockedRoomTypes();
  const pool = SPECIAL_TEMPLATES.filter(t => (!t.unlock_level || playerLevel >= t.unlock_level) && unlockedTypes.has(t.room_type));
  if (!pool.length) return state.market.specials;
  const count = repOverall >= 20 ? 2 : 1;
  const specials = [];
  for (let i = 0; i < count; i++) {
    const template = pool[randInt(0, pool.length - 1)];
    specials.push(buildSpecialOffer(day, i + 1, template));
  }
  state.market.specials = specials;
  state.market.lastSpecialDay = day;
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  return specials;
}

export function acceptSpecialOffer(offerId) {
  const specials = (state.market && Array.isArray(state.market.specials)) ? state.market.specials : [];
  const offer = specials.find(o => o.id === offerId);
  if (!offer) return;
  const contract = { ...offer };
  contract.id = `contract_${offer.id}`;
  contract.worked_hours = 0;
  contract.completed = false;
  contract.completed_at = null;
  contract.assigned_people = [];
  contract.assigned_people_map = [];
  if (offer.requirements) contract.requirements = JSON.parse(JSON.stringify(offer.requirements));
  if (Array.isArray(offer.stages)) contract.stages = JSON.parse(JSON.stringify(offer.stages));
  contract.milestones = offer.milestones ? JSON.parse(JSON.stringify(offer.milestones)) : [];
  if (offer.requirements) contract.requirements = JSON.parse(JSON.stringify(offer.requirements));
  if (Array.isArray(offer.stages)) contract.stages = JSON.parse(JSON.stringify(offer.stages));
  state.db.contracts.push(contract);
  state.market.specials = specials.filter(o => o.id !== offerId);
  if (typeof log === 'function') log(`🧭 Projecte especial acceptat: ${offer.name} (${euro(offer.base_pay)})`);
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function updateContractMilestones(contract) {
  if (!contract || !Array.isArray(contract.milestones)) return;
  const progress = Number(contract.worked_hours || 0);
  for (const milestone of contract.milestones) {
    if (milestone.reached) continue;
    if (progress >= Number(milestone.at_hours || 0)) {
      milestone.reached = true;
      if (Array.isArray(milestone.options) && milestone.options.length && !milestone.choice) {
        milestone.pending = true;
        if (typeof log === 'function') log(`🧭 Decisio pendent: ${contract.name} · ${milestone.label}`);
        if (typeof showNotification === 'function') showNotification(`🧭 Decisio: ${milestone.label}`);
      }
    }
  }
}

export function applySpecialDecision(contractId, milestoneId, optionId) {
  const contract = state.db && Array.isArray(state.db.contracts) ? state.db.contracts.find(c => c.id === contractId) : null;
  if (!contract || !Array.isArray(contract.milestones)) return;
  const milestone = contract.milestones.find(m => m.id === milestoneId);
  if (!milestone || milestone.choice) return;
  const option = Array.isArray(milestone.options) ? milestone.options.find(o => o.id === optionId) : null;
  if (!option) return;
  const effects = option.effects || {};
  if (effects.pay_multiplier) contract.base_pay = Math.round(Number(contract.base_pay || 0) * Number(effects.pay_multiplier || 1));
  if (effects.pay_add) contract.base_pay = Math.round(Number(contract.base_pay || 0) + Number(effects.pay_add || 0));
  if (effects.quality_delta) contract.target_quality = Math.min(95, Math.round(Number(contract.target_quality || 0) + Number(effects.quality_delta || 0)));
  if (effects.deadline_delta && contract.deadline_days) contract.deadline_days = Math.max(1, Number(contract.deadline_days || 0) + Number(effects.deadline_delta || 0));
  milestone.choice = option.id;
  milestone.pending = false;
  if (typeof log === 'function') log(`✅ Decisio aplicada: ${milestone.label} · ${option.label}`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function declineSpecialOffer(offerId) {
  const specials = (state.market && Array.isArray(state.market.specials)) ? state.market.specials : [];
  state.market.specials = specials.filter(o => o.id !== offerId);
  if (typeof log === 'function') log('📪 Oferta especial declinada');
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function ensureRoomOffers(roomType, minCount = 2) {
  if (!roomType) return [];
  state.market = state.market || { offers: [], lastDayGenerated: 0 };
  const day = state.time ? Number(state.time.day || 1) : 1;
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const eligibleTemplates = getEligibleTemplates(repOverall).filter(t => t.room_type === roomType);
  if (!eligibleTemplates.length) return state.market.offers || [];
  const offers = Array.isArray(state.market.offers) ? state.market.offers : [];
  const existing = offers.filter(o => {
    const reqType = o.requirements && o.requirements.room_type;
    return reqType ? reqType === roomType : false;
  });
  const needed = Math.max(0, Number(minCount || 0) - existing.length);
  if (needed <= 0) return offers;
  for (let i = 0; i < needed; i++) {
    offers.push(buildOffer(day, offers.length + 1, eligibleTemplates));
  }
  state.market.offers = offers;
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  return offers;
}

export function acceptOffer(offerId) {
  const offers = (state.market && Array.isArray(state.market.offers)) ? state.market.offers : [];
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;
  const contract = { ...offer };
  contract.id = `contract_${offer.id}`;
  contract.worked_hours = 0;
  contract.completed = false;
  contract.completed_at = null;
  contract.assigned_people = [];
  contract.assigned_people_map = [];
  state.db.contracts.push(contract);
  state.market.offers = offers.filter(o => o.id !== offerId);
  if (typeof log === 'function') log(`📩 Acceptat: ${offer.name} (${euro(offer.base_pay)})`);
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

export function declineOffer(offerId) {
  const offers = (state.market && Array.isArray(state.market.offers)) ? state.market.offers : [];
  state.market.offers = offers.filter(o => o.id !== offerId);
  if (typeof log === 'function') log('📪 Oferta declinada');
  try { if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof window !== 'undefined' && typeof window.renderAll === 'function') window.renderAll();
}

if (typeof window !== 'undefined') {
  window.generateDailyOffers = window.generateDailyOffers || generateDailyOffers;
  window.generateSpecialOffers = window.generateSpecialOffers || generateSpecialOffers;
  window.ensureRoomOffers = window.ensureRoomOffers || ensureRoomOffers;
  window.acceptOffer = window.acceptOffer || acceptOffer;
  window.acceptSpecialOffer = window.acceptSpecialOffer || acceptSpecialOffer;
  window.applySpecialDecision = window.applySpecialDecision || applySpecialDecision;
  window.updateContractMilestones = window.updateContractMilestones || updateContractMilestones;
  window.declineSpecialOffer = window.declineSpecialOffer || declineSpecialOffer;
  window.declineOffer = window.declineOffer || declineOffer;
}

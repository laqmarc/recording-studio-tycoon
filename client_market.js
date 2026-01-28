import { state } from './state.js';
import { log, showNotification, euro } from './helpers.js';

const GENRES = ['pop', 'rap', 'hiphop', 'rock', 'podcast', 'live', 'film_score'];
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
    mic_types: ['guitarra', 'caixa', 'oh']
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
    mic_types: ['guitarra', 'caixa', 'oh', 'bombo']
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
    min_items: { monitor: 2, acoustic_treatment: 3, software_mix_master: 1 }
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
    min_items: { monitor: 2, acoustic_treatment: 5, software_mix_master: 1 }
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
    min_items: { mic: 5, preamp_multi: 1, interface: 1, headphones: 3, cable: 8, mic_stand: 5 }
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
    min_items: { mic: 6, preamp_multi: 1, interface: 1, headphones: 4, cable: 10, mic_stand: 6, mic_accessory: 2 }
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
    min_items: { mic: 8, preamp_multi: 1, interface: 1, headphones: 4, cable: 12, mic_stand: 8, multicore: 1 }
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
    min_items: { mic: 10, preamp_multi: 2, interface: 1, headphones: 5, cable: 14, mic_stand: 10, mic_accessory: 4 }
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
    min_items: { mic: 12, preamp_multi: 2, interface: 1, headphones: 6, cable: 16, mic_stand: 12, multicore: 1 }
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
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1, software: 1 }
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
    min_items: { mic: 1, preamp: 1, interface: 1, headphones: 1, cable: 2, mic_stand: 1, software: 1, acoustic_treatment: 2 }
  },
  {
    type: 'mix',
    room_type: 'control_room',
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
    room_type: 'control_room',
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
    room_type: 'control_room',
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
    room_type: 'control_room',
    unlock_level: 6,
    allowed_genres: ['any'],
    base_pay: [260, 480],
    target_quality: [66, 84],
    duration: [3, 4],
    deadline: [1, 3],
    min_items: { monitor: 2, acoustic_treatment: 5, software_mix_master: 1 }
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
    min_items: { interface: 1, monitor: 2, software: 1, midi_controller: 1, instruments: 1 }
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
    min_items: { interface: 2, monitor: 2, software: 2, midi_controller: 1, instruments: 2 }
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
    min_items: { interface: 1, mic: 2, headphones: 2, monitor: 1, software: 1 }
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
    min_items: { monitor: 3, acoustic_treatment: 8, software: 1, effects: 2 }
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
    min_items: { monitor: 3, acoustic_treatment: 8, software: 2, effects: 2 }
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
    min_items: { monitor: 4, acoustic_treatment: 10, software: 2, effects: 3 }
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
    min_items: { monitor: 3, acoustic_treatment: 8, software: 1, effects: 2 }
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
    min_items: { monitor: 4, acoustic_treatment: 10, software: 2, effects: 3 }
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
    min_items: { monitor: 4, acoustic_treatment: 10, software: 2, effects: 3 }
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
    min_items: { monitor: 4, acoustic_treatment: 12, software: 2, effects: 4 }
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

function getEligibleTemplates(repOverall) {
  const playerLevel = Number((state.player && state.player.level) || 1);
  const unlockedTypes = getUnlockedRoomTypes();
  return TEMPLATE_POOL.filter(t => {
    if (t.unlock_level && playerLevel < t.unlock_level) return false;
    if (t.room_type && !unlockedTypes.has(t.room_type)) return false;
    if (repOverall < 5) return t.type === 'recording' || t.type === 'mix';
    if (repOverall < 10) return t.type === 'recording' || t.type === 'mix' || t.type === 'master';
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

function buildOffer(day, index, templates) {
  const repOverall = Number((state.reputation && state.reputation.overall) || 0);
  const genre = pickGenreWithTemplates(templates);
  const template = pickTemplate(templates, genre);
  const pay = randInt(template.base_pay[0], template.base_pay[1]);
  const target = randInt(template.target_quality[0], template.target_quality[1]);
  const duration = randInt(template.duration[0], template.duration[1]);
  const deadline = randInt(template.deadline[0], template.deadline[1]);
  const repBoost = 1 + repOverall * 0.01;
  const genreRep = (state.reputation && state.reputation.byGenre) ? Number(state.reputation.byGenre[genre] || 0) : 0;
  const genreBoost = 1 + genreRep * 0.015;
  const base_pay = Math.round(pay * repBoost * genreBoost);
  const target_quality = Math.min(90, Math.round(target + repOverall * 0.2));

  return {
    id: `offer_${day}_${index}_${Math.floor(Math.random() * 9999)}`,
    name: `${template.type} · ${genre}`,
    type: template.type,
    genre,
    duration_hours: duration,
    base_pay,
    target_quality,
    deadline_days: deadline,
    start_day: day,
    requirements: (() => {
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
        req.min_interface_inputs = micTypes.length;
      }
      return req;
    })(),
    reputation_gain: { success: Math.max(1, Math.round(genreRep * 0.3) + 2), fail: 1 },
    source: 'market'
  };
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
  return offers;
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
  window.ensureRoomOffers = window.ensureRoomOffers || ensureRoomOffers;
  window.acceptOffer = window.acceptOffer || acceptOffer;
  window.declineOffer = window.declineOffer || declineOffer;
}

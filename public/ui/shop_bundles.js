export const ROOM_BUNDLE_DEFS = {
  vocal_booth: [
    { name: 'Vocal Booth Kit', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' },
      { cat: 'cable' },
      { cat: 'mic_stand' }
    ]}
  ],
  live_room: [
    { name: 'Live Tracking Pack', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp_multi', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphone_amp' },
      { cat: 'cable' }
    ]}
  ],
  mastering_suite: [
    { name: 'Suite de Mastering', items: [
      { cat: 'monitor', stat: 'monitor_accuracy' },
      { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
      { cat: 'software_mix_master', stat: 'daw_quality' },
      { cat: 'effects' }
    ]}
  ],
  podcast_studio: [
    { name: 'Podcast Studio Kit', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' },
      { cat: 'pop_filter' },
      { cat: 'mic_stand' },
      { cat: 'software_daw', stat: 'daw_quality' }
    ]}
  ],
  foley_room: [
    { name: 'Foley Essentials', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' },
      { cat: 'instruments', stat: 'instrument_quality' },
      { cat: 'effects' }
    ]}
  ],
  edit_room: [
    { name: "Kit d'Edicio", items: [
      { cat: 'monitor', stat: 'monitor_accuracy' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' },
      { cat: 'software_daw', stat: 'daw_quality' },
      { cat: 'software_fx', stat: 'daw_quality' },
      { cat: 'acoustic_treatment', stat: 'room_acoustic_add' }
    ]}
  ],
  streaming_room: [
    { name: 'Streaming Rig', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' },
      { cat: 'software', stat: 'daw_quality' }
    ]}
  ],
  control_room: [
    { name: 'Mix Suite', items: [
      { cat: 'monitor', stat: 'monitor_accuracy' },
      { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
      { cat: 'software_mix_master', stat: 'daw_quality' }
    ]},
    { name: 'Production Pack', items: [
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'software', stat: 'daw_quality' },
      { cat: 'midi_controller' },
      { cat: 'instruments', stat: 'instrument_quality' }
    ]}
  ]
};

export const SMALL_CONTROL_ROOM_BUNDLES = [
  {
    name: 'Control Room Essentials',
    total: 350,
    fixedTotal: true,
    itemsByName: [
      't.akustik QRD Diffusor',
      't.akustik QRD Diffusor',
      'Mackie CR4-X',
      'Mackie CR4-X',
      'Audacity'
    ]
  },
  {
    name: 'Vocal Starter Pack',
    total: 300,
    fixedTotal: true,
    itemsByName: [
      'Micròfon Condensador Vocal',
      'Behringer MIC200 Tube Ultragain',
      'Tascam TH-02',
      'the sssnake XLR3 Basic',
      'the sssnake XLR3 Basic',
      'Millenium MS3003',
      'Focusrite Scarlett Solo 4th Gen'
    ]
  }
];

export function getGenreBundles(reputationByGenre = {}) {
  const genres = Object.keys(reputationByGenre || {});
  const bundles = [];
  if (genres.includes('rap') || genres.includes('hiphop')) {
    bundles.push({ name: 'HipHop Chain', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'software', stat: 'daw_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }
  if (genres.includes('rock')) {
    bundles.push({ name: 'Rock Tracking', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp_multi', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphone_amp' }
    ]});
  }
  if (genres.includes('podcast')) {
    bundles.push({ name: 'Podcast Duo', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }
  return bundles;
}

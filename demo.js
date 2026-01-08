// demo.js - demo dataset
const DEMO = {
  "items": [
    {
      "id": "accessory_cabling_neutrik_xlr_panel_connectors_set",
      "name": "Neutrik XLR Panel Connectors Set",
      "category": "accessory_cabling",
      "tier": "mid",
      "price": 25.0,
      "maintenance_weekly": 0.05,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Per caixes i racks personalitzats"
    },
    {
      "id": "accessory_cabling_patch_cables_tt_bantam_mogami_set",
      "name": "Patch Cables TT Bantam Mogami Set",
      "category": "accessory_cabling",
      "tier": "pro",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Per patchbays TT professionals"
    },
    {
      "id": "acoustic_treatment_t_akustik_highline_absorber",
      "name": "t.akustik Highline Absorber",
      "category": "acoustic_treatment",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Panell absorbent",
        "Absorbent"
      ],
      "stats": {
        "room_acoustic_add": 4,
        "bass_control_add": 2.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Panell individual, fàcil instal·lació"
    },
    {
      "id": "acoustic_treatment_the_t_bone_micscreen",
      "name": "the t.bone Micscreen",
      "category": "acoustic_treatment",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Mixte",
        "Reflexion Filter"
      ],
      "stats": {
        "room_acoustic_add": 4,
        "bass_control_add": 2.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Redueix reflexions en gravació de veu"
    },
    {
      "id": "acoustic_treatment_t_akustik_qrd_diffusor",
      "name": "t.akustik QRD Diffusor",
      "category": "acoustic_treatment",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Difusor",
        "Difusió 1D"
      ],
      "stats": {
        "room_acoustic_add": 4,
        "bass_control_add": 2.0,
        "diffusion_add": 4
      },
      "io": {},
      "notes": "Millora espai sense matar el so"
    },
    {
      "id": "acoustic_treatment_auralex_studiofoam_wedges_2_pack",
      "name": "Auralex Studiofoam Wedges 2\" (pack)",
      "category": "acoustic_treatment",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Panell absorbent",
        "Absorbent"
      ],
      "stats": {
        "room_acoustic_add": 4,
        "bass_control_add": 2.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Redueix reflexions altes freqüències"
    },
    {
      "id": "acoustic_treatment_auralex_lenrd_bass_traps_pack",
      "name": "Auralex LENRD Bass Traps (pack)",
      "category": "acoustic_treatment",
      "tier": "low",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Bass Trap",
        "Trampa de greus"
      ],
      "stats": {
        "room_acoustic_add": 4,
        "bass_control_add": 4,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Per cantonades, escuma"
    },
    {
      "id": "acoustic_treatment_vicoustic_flexi_a50",
      "name": "Vicoustic Flexi A50",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Panell absorbent",
        "Absorbent"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 3.5,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Bona absorció mitjanes-altes"
    },
    {
      "id": "acoustic_treatment_t_akustik_bass_trap_corner",
      "name": "t.akustik Bass Trap Corner",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Bass Trap",
        "Trampa de greus"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 7,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Format triangular, tela"
    },
    {
      "id": "acoustic_treatment_vicoustic_cinema_round_ultra",
      "name": "Vicoustic Cinema Round Ultra",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 130.0,
      "maintenance_weekly": 0.26,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Panell absorbent",
        "Absorbent decoratiu"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 3.5,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Disseny + absorció"
    },
    {
      "id": "acoustic_treatment_vicoustic_multifuser_dc2",
      "name": "Vicoustic Multifuser DC2",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 160.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Difusor",
        "Difusió 2D"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 3.5,
        "diffusion_add": 7
      },
      "io": {},
      "notes": "Difusió i absorció combinades"
    },
    {
      "id": "acoustic_treatment_auralex_tfusor",
      "name": "Auralex T'Fusor",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Difusor",
        "Difusió"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 3.5,
        "diffusion_add": 7
      },
      "io": {},
      "notes": "Difusió per parets posteriors"
    },
    {
      "id": "acoustic_treatment_gik_acoustics_tri_trap",
      "name": "GIK Acoustics Tri-Trap",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 190.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Bass Trap",
        "Trampa de greus"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 7,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Alta absorció en cantonades"
    },
    {
      "id": "acoustic_treatment_se_electronics_reflexion_filter_pro",
      "name": "SE Electronics Reflexion Filter Pro",
      "category": "acoustic_treatment",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Mixte",
        "Cabina vocal portàtil"
      ],
      "stats": {
        "room_acoustic_add": 7,
        "bass_control_add": 3.5,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Molt usat per vocals"
    },
    {
      "id": "acoustic_treatment_gik_acoustics_244_bass_trap_panel",
      "name": "GIK Acoustics 244 Bass Trap Panel",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Panell absorbent",
        "Absorbent ample banda"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Funciona també com bass trap lleu"
    },
    {
      "id": "acoustic_treatment_vicoustic_vicpanel_premium",
      "name": "Vicoustic VicPanel Premium",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 160.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Panell absorbent",
        "Absorbent"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Alta absorció i acabat premium"
    },
    {
      "id": "acoustic_treatment_vicoustic_flexi_screen_ultra_mkii",
      "name": "Vicoustic Flexi Screen Ultra MKII",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Mixte",
        "Cabina vocal portàtil"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Alta absorció al voltant del micro"
    },
    {
      "id": "acoustic_treatment_vicoustic_super_bass_extreme_ultra",
      "name": "Vicoustic Super Bass Extreme Ultra",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Bass Trap",
        "Trampa de greus"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 10,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Greus profunds, alt rendiment"
    },
    {
      "id": "acoustic_treatment_gik_acoustics_soffit_bass_trap",
      "name": "GIK Acoustics Soffit Bass Trap",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Bass Trap",
        "Trampa de greus"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 10,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Per unions paret-sostre"
    },
    {
      "id": "acoustic_treatment_vicoustic_multifuser_wood_36",
      "name": "Vicoustic Multifuser Wood 36",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Difusor",
        "Difusió fusta 2D"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 10
      },
      "io": {},
      "notes": "Difusió d’alta qualitat"
    },
    {
      "id": "acoustic_treatment_gik_acoustics_portable_vocal_booth",
      "name": "GIK Acoustics Portable Vocal Booth",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Mixte",
        "Cabina portàtil"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 0
      },
      "io": {},
      "notes": "Solució completa per vocals"
    },
    {
      "id": "acoustic_treatment_rpg_skyline_diffuser",
      "name": "RPG Skyline Diffuser",
      "category": "acoustic_treatment",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Difusor",
        "Difusió 2D"
      ],
      "stats": {
        "room_acoustic_add": 10,
        "bass_control_add": 5.0,
        "diffusion_add": 10
      },
      "io": {},
      "notes": "Referència en estudis professionals"
    },
    {
      "id": "cable_the_sssnake_patch_cable_trs",
      "name": "the sssnake Patch Cable TRS",
      "category": "cable",
      "tier": "low",
      "price": 5.0,
      "maintenance_weekly": 0.01,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Per patchbay"
    },
    {
      "id": "cable_the_sssnake_xlr3_basic",
      "name": "the sssnake XLR3 Basic",
      "category": "cable",
      "tier": "low",
      "price": 10.0,
      "maintenance_weekly": 0.02,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Cable bàsic de micro"
    },
    {
      "id": "cable_cordial_cfm_trs",
      "name": "Cordial CFM TRS",
      "category": "cable",
      "tier": "mid",
      "price": 12.0,
      "maintenance_weekly": 0.02,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Connexions de rack"
    },
    {
      "id": "cable_cordial_ccm_fm",
      "name": "Cordial CCM FM",
      "category": "cable",
      "tier": "mid",
      "price": 18.0,
      "maintenance_weekly": 0.04,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Molt fiable"
    },
    {
      "id": "cable_mogami_gold_trs",
      "name": "Mogami Gold TRS",
      "category": "cable",
      "tier": "pro",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Baix soroll, molt durador"
    },
    {
      "id": "cable_mogami_gold_xlr",
      "name": "Mogami Gold XLR",
      "category": "cable",
      "tier": "pro",
      "price": 40.0,
      "maintenance_weekly": 0.08,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Estàndard professional"
    },
    {
      "id": "chair_ikea_markus",
      "name": "IKEA Markus",
      "category": "chair",
      "tier": "low",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 1,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Còmoda per sessions llargues"
    },
    {
      "id": "chair_topstar_open_point_sy",
      "name": "Topstar Open Point SY",
      "category": "chair",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 1,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Bona postura per treball"
    },
    {
      "id": "chair_secretlab_titan_evo",
      "name": "Secretlab Titan Evo",
      "category": "chair",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 3,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Molt usada en estudis moderns"
    },
    {
      "id": "chair_herman_miller_aeron",
      "name": "Herman Miller Aeron",
      "category": "chair",
      "tier": "pro",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 3,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Referència en ergonomia"
    },
    {
      "id": "console_analog_mackie_802vlz4",
      "name": "Mackie 802VLZ4",
      "category": "console_analog",
      "tier": "low",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 43.2,
        "headroom": 60,
        "channels": 8
      },
      "io": {},
      "notes": "Compacta, robusta, bona per submix i home-studio"
    },
    {
      "id": "console_analog_soundcraft_notepad_12fx",
      "name": "Soundcraft Notepad-12FX",
      "category": "console_analog",
      "tier": "low",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 44.8,
        "headroom": 60,
        "channels": 12
      },
      "io": {},
      "notes": "USB + FX, ideal per streaming/podcast"
    },
    {
      "id": "console_analog_allen_heath_zed_10",
      "name": "Allen & Heath ZED-10",
      "category": "console_analog",
      "tier": "low",
      "price": 250.0,
      "maintenance_weekly": 0.5,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 44.0,
        "headroom": 60,
        "channels": 10
      },
      "io": {},
      "notes": "USB estèreo, fiable per home-studio"
    },
    {
      "id": "console_analog_mackie_1202vlz4",
      "name": "Mackie 1202VLZ4",
      "category": "console_analog",
      "tier": "low",
      "price": 320.0,
      "maintenance_weekly": 0.64,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 44.8,
        "headroom": 60,
        "channels": 12
      },
      "io": {},
      "notes": "Previs Onyx, molt típica per estudi petit"
    },
    {
      "id": "console_analog_allen_heath_zed_14",
      "name": "Allen & Heath ZED-14",
      "category": "console_analog",
      "tier": "low",
      "price": 380.0,
      "maintenance_weekly": 0.76,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 45.6,
        "headroom": 60,
        "channels": 14
      },
      "io": {},
      "notes": "14 canals, bon EQ"
    },
    {
      "id": "console_analog_soundcraft_signature_12mtk",
      "name": "Soundcraft Signature 12MTK",
      "category": "console_analog",
      "tier": "low",
      "price": 420.0,
      "maintenance_weekly": 0.84,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 44.8,
        "headroom": 60,
        "channels": 12
      },
      "io": {},
      "notes": "USB multitrack, molt útil per gravar maquetes"
    },
    {
      "id": "console_analog_yamaha_mg16xu",
      "name": "Yamaha MG16XU",
      "category": "console_analog",
      "tier": "low",
      "price": 430.0,
      "maintenance_weekly": 0.86,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "USB, FX, pràctica per gravar i directe"
    },
    {
      "id": "console_analog_tascam_model_12",
      "name": "Tascam Model 12",
      "category": "console_analog",
      "tier": "low",
      "price": 620.0,
      "maintenance_weekly": 1.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 44.8,
        "headroom": 60,
        "channels": 12
      },
      "io": {},
      "notes": "Analògica + gravador/USB multitrack"
    },
    {
      "id": "console_analog_soundcraft_signature_22mtk",
      "name": "Soundcraft Signature 22MTK",
      "category": "console_analog",
      "tier": "low",
      "price": 650.0,
      "maintenance_weekly": 1.3,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 48.8,
        "headroom": 60,
        "channels": 22
      },
      "io": {},
      "notes": "USB multitrack, moltes entrades"
    },
    {
      "id": "console_analog_mackie_1604vlz4",
      "name": "Mackie 1604VLZ4",
      "category": "console_analog",
      "tier": "low",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "16 canals, clàssica per assaig/estudi project"
    },
    {
      "id": "console_analog_tascam_model_16",
      "name": "Tascam Model 16",
      "category": "console_analog",
      "tier": "mid",
      "price": 880.0,
      "maintenance_weekly": 1.76,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "Analògica + USB multitrack"
    },
    {
      "id": "console_analog_allen_heath_zed_24",
      "name": "Allen & Heath ZED-24",
      "category": "console_analog",
      "tier": "mid",
      "price": 950.0,
      "maintenance_weekly": 1.9,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 60,
        "channels": 24
      },
      "io": {},
      "notes": "Bon EQ i routing per estudi project"
    },
    {
      "id": "console_analog_tascam_model_24",
      "name": "Tascam Model 24",
      "category": "console_analog",
      "tier": "mid",
      "price": 1150.0,
      "maintenance_weekly": 2.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 60,
        "channels": 24
      },
      "io": {},
      "notes": "Analògica + USB multitrack, molt completa"
    },
    {
      "id": "console_analog_allen_heath_mixwizard_wz4_16_2",
      "name": "Allen & Heath MixWizard WZ4 16:2",
      "category": "console_analog",
      "tier": "mid",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "Routing molt flexible, previ bo"
    },
    {
      "id": "console_analog_ssl_six",
      "name": "SSL SiX",
      "category": "console_analog",
      "tier": "mid",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 42.4,
        "headroom": 60,
        "channels": 6
      },
      "io": {},
      "notes": "Summing/mini consola pro; bus compressor SSL"
    },
    {
      "id": "console_analog_allen_heath_zed_436",
      "name": "Allen & Heath ZED-436",
      "category": "console_analog",
      "tier": "mid",
      "price": 2200.0,
      "maintenance_weekly": 4.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 54.4,
        "headroom": 60,
        "channels": 36
      },
      "io": {},
      "notes": "Format gran, molta connectivitat"
    },
    {
      "id": "console_analog_midas_venice_f16",
      "name": "Midas Venice F16",
      "category": "console_analog",
      "tier": "mid",
      "price": 2200.0,
      "maintenance_weekly": 4.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "So Midas, molt musical"
    },
    {
      "id": "console_analog_soundcraft_gb2_16",
      "name": "Soundcraft GB2-16",
      "category": "console_analog",
      "tier": "mid",
      "price": 2400.0,
      "maintenance_weekly": 4.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 60,
        "channels": 16
      },
      "io": {},
      "notes": "Consola analògica de qualitat per racks i patchbay"
    },
    {
      "id": "console_analog_midas_venice_f24",
      "name": "Midas Venice F24",
      "category": "console_analog",
      "tier": "mid",
      "price": 3200.0,
      "maintenance_weekly": 6.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 60,
        "channels": 24
      },
      "io": {},
      "notes": "Més canals, bon headroom"
    },
    {
      "id": "console_analog_soundcraft_gb2_24",
      "name": "Soundcraft GB2-24",
      "category": "console_analog",
      "tier": "mid",
      "price": 3200.0,
      "maintenance_weekly": 6.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 60,
        "channels": 24
      },
      "io": {},
      "notes": "Més canals, so Soundcraft clàssic"
    },
    {
      "id": "console_analog_ssl_big_six",
      "name": "SSL Big SiX",
      "category": "console_analog",
      "tier": "pro",
      "price": 3000.0,
      "maintenance_weekly": 6.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola compacta pro, USB, so SSL"
    },
    {
      "id": "console_analog_toft_audio_atb_16",
      "name": "Toft Audio ATB-16",
      "category": "console_analog",
      "tier": "pro",
      "price": 5200.0,
      "maintenance_weekly": 10.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Estil Trident, bon EQ"
    },
    {
      "id": "console_analog_toft_audio_atb_24",
      "name": "Toft Audio ATB-24",
      "category": "console_analog",
      "tier": "pro",
      "price": 7200.0,
      "maintenance_weekly": 14.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 75,
        "channels": 24
      },
      "io": {},
      "notes": "Més canals, mateix caràcter"
    },
    {
      "id": "console_analog_audient_asp4816",
      "name": "Audient ASP4816",
      "category": "console_analog",
      "tier": "pro",
      "price": 17000.0,
      "maintenance_weekly": 34.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola d’estudi amb bon routing"
    },
    {
      "id": "console_analog_api_the_box_2",
      "name": "API The Box 2",
      "category": "console_analog",
      "tier": "pro",
      "price": 23000.0,
      "maintenance_weekly": 46.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola/summing amb caràcter API"
    },
    {
      "id": "console_analog_neve_8424",
      "name": "Neve 8424",
      "category": "console_analog",
      "tier": "pro",
      "price": 26000.0,
      "maintenance_weekly": 52.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 75,
        "channels": 24
      },
      "io": {},
      "notes": "Summing + monitor + control; molt d’estudi modern"
    },
    {
      "id": "console_analog_ssl_origin_16",
      "name": "SSL Origin 16",
      "category": "console_analog",
      "tier": "pro",
      "price": 32000.0,
      "maintenance_weekly": 64.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola d’estudi analògica moderna"
    },
    {
      "id": "console_analog_trident_88_24ch",
      "name": "Trident 88 24ch",
      "category": "console_analog",
      "tier": "pro",
      "price": 65000.0,
      "maintenance_weekly": 130.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 75,
        "channels": 24
      },
      "io": {},
      "notes": "Consola analògica premium (format gran)"
    },
    {
      "id": "console_analog_api_1608_ii",
      "name": "API 1608-II",
      "category": "console_analog",
      "tier": "pro",
      "price": 70000.0,
      "maintenance_weekly": 140.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola analògica clàssica API"
    },
    {
      "id": "console_analog_neve_genesys_black_configurable",
      "name": "Neve Genesys Black (configurable)",
      "category": "console_analog",
      "tier": "pro",
      "price": 90000.0,
      "maintenance_weekly": 180.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 75,
        "channels": 16
      },
      "io": {},
      "notes": "Consola híbrida/analògica pro (depèn configuració)"
    },
    {
      "id": "console_digital_behringer_x32_rack",
      "name": "Behringer X32 Rack",
      "category": "console_digital",
      "tier": "low",
      "price": 1300.0,
      "maintenance_weekly": 2.6,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 46.4,
        "headroom": 55,
        "channels": 16
      },
      "io": {},
      "notes": "Digital, molt comú; ideal per gravació via USB/expansions"
    },
    {
      "id": "console_digital_behringer_x32_compact",
      "name": "Behringer X32 Compact",
      "category": "console_digital",
      "tier": "low",
      "price": 1800.0,
      "maintenance_weekly": 3.6,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "routing": 52.8,
        "headroom": 55,
        "channels": 32
      },
      "io": {},
      "notes": "32 canals, ecosistema molt estès"
    },
    {
      "id": "console_digital_soundcraft_ui24r",
      "name": "Soundcraft Ui24R",
      "category": "console_digital",
      "tier": "mid",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 49.6,
        "headroom": 55,
        "channels": 24
      },
      "io": {},
      "notes": "Stagebox/mixer controlat per app; gravació multipista"
    },
    {
      "id": "console_digital_yamaha_tf1",
      "name": "Yamaha TF1",
      "category": "console_digital",
      "tier": "mid",
      "price": 1900.0,
      "maintenance_weekly": 3.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 52.8,
        "headroom": 55,
        "channels": 32
      },
      "io": {},
      "notes": "Molt popular; gravació USB"
    },
    {
      "id": "console_digital_allen_heath_sq_5",
      "name": "Allen & Heath SQ-5",
      "category": "console_digital",
      "tier": "mid",
      "price": 2600.0,
      "maintenance_weekly": 5.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 59.2,
        "headroom": 55,
        "channels": 48
      },
      "io": {},
      "notes": "Molt bon so, opcions d’expansió, USB multitrack"
    },
    {
      "id": "console_digital_midas_m32r",
      "name": "Midas M32R",
      "category": "console_digital",
      "tier": "mid",
      "price": 2600.0,
      "maintenance_weekly": 5.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 52.8,
        "headroom": 55,
        "channels": 32
      },
      "io": {},
      "notes": "So/previs Midas, workflow pro"
    },
    {
      "id": "console_digital_yamaha_tf3",
      "name": "Yamaha TF3",
      "category": "console_digital",
      "tier": "mid",
      "price": 3200.0,
      "maintenance_weekly": 6.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 59.2,
        "headroom": 55,
        "channels": 48
      },
      "io": {},
      "notes": "Més canals i faders"
    },
    {
      "id": "console_digital_allen_heath_sq_6",
      "name": "Allen & Heath SQ-6",
      "category": "console_digital",
      "tier": "mid",
      "price": 3300.0,
      "maintenance_weekly": 6.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "routing": 59.2,
        "headroom": 55,
        "channels": 48
      },
      "io": {},
      "notes": "Més control físic; molt completa"
    },
    {
      "id": "console_digital_yamaha_dm3s",
      "name": "Yamaha DM3S",
      "category": "console_digital",
      "tier": "pro",
      "price": 2000.0,
      "maintenance_weekly": 4.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 48.8,
        "headroom": 70,
        "channels": 22
      },
      "io": {},
      "notes": "Compacta pro; molt bona per estudi petit/FOH"
    },
    {
      "id": "console_digital_yamaha_ql1",
      "name": "Yamaha QL1",
      "category": "console_digital",
      "tier": "pro",
      "price": 7200.0,
      "maintenance_weekly": 14.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 52.8,
        "headroom": 70,
        "channels": 32
      },
      "io": {},
      "notes": "Gama pro Yamaha, molt fiable"
    },
    {
      "id": "console_digital_yamaha_cl1",
      "name": "Yamaha CL1",
      "category": "console_digital",
      "tier": "pro",
      "price": 14000.0,
      "maintenance_weekly": 28.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 59.2,
        "headroom": 70,
        "channels": 48
      },
      "io": {},
      "notes": "Consola pro gran; estàndard en directe"
    },
    {
      "id": "console_digital_allen_heath_dlive_c1500_surface_dm0",
      "name": "Allen & Heath dLive C1500 (Surface) + DM0",
      "category": "console_digital",
      "tier": "pro",
      "price": 16000.0,
      "maintenance_weekly": 32.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 91.2,
        "headroom": 70,
        "channels": 128
      },
      "io": {},
      "notes": "Sistema modular pro; depèn del mixrack"
    },
    {
      "id": "console_digital_digico_sd11",
      "name": "DiGiCo SD11",
      "category": "console_digital",
      "tier": "pro",
      "price": 18000.0,
      "maintenance_weekly": 36.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 78.4,
        "headroom": 70,
        "channels": 96
      },
      "io": {},
      "notes": "Molt pro; so i routing top"
    },
    {
      "id": "console_digital_midas_heritage_d_hd96_24",
      "name": "Midas Heritage-D HD96-24",
      "category": "console_digital",
      "tier": "pro",
      "price": 35000.0,
      "maintenance_weekly": 70.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 95,
        "headroom": 70,
        "channels": 144
      },
      "io": {},
      "notes": "Gama alta Midas; workflow pro"
    },
    {
      "id": "console_digital_avid_s6l_sistema",
      "name": "Avid S6L (sistema)",
      "category": "console_digital",
      "tier": "pro",
      "price": 40000.0,
      "maintenance_weekly": 80.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "routing": 91.2,
        "headroom": 70,
        "channels": 128
      },
      "io": {},
      "notes": "Estàndard touring; preu depèn configuració"
    },
    {
      "id": "desk_millenium_sd_120_b",
      "name": "Millenium SD-120 B",
      "category": "desk",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Compacta per home studio"
    },
    {
      "id": "desk_thomann_studio_desk_basic",
      "name": "Thomann Studio Desk Basic",
      "category": "desk",
      "tier": "low",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Espai per monitors petits"
    },
    {
      "id": "desk_zaor_miza_junior",
      "name": "Zaor Miza Junior",
      "category": "desk",
      "tier": "mid",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Disseny i ergonomia"
    },
    {
      "id": "desk_zaor_miza_z",
      "name": "Zaor Miza Z",
      "category": "desk",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Espai per racks i pantalles"
    },
    {
      "id": "desk_zaor_miza_x2_flex",
      "name": "Zaor Miza X2 Flex",
      "category": "desk",
      "tier": "pro",
      "price": 1400.0,
      "maintenance_weekly": 2.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Per estudis grans"
    },
    {
      "id": "desk_argosy_halo",
      "name": "Argosy Halo",
      "category": "desk",
      "tier": "pro",
      "price": 6000.0,
      "maintenance_weekly": 12.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Mobiliari premium per consoles"
    },
    {
      "id": "headphone_amp_behringer_ha400_microamp",
      "name": "Behringer HA400 Microamp",
      "category": "headphone_amp",
      "tier": "low",
      "price": 25.0,
      "maintenance_weekly": 0.05,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 4
      },
      "io": {},
      "notes": "Molt econòmic per repartiment de senyal"
    },
    {
      "id": "headphone_amp_mackie_hm_4",
      "name": "Mackie HM-4",
      "category": "headphone_amp",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 4
      },
      "io": {},
      "notes": "Molt compacte i portàtil"
    },
    {
      "id": "headphone_amp_presonus_hp2",
      "name": "Presonus HP2",
      "category": "headphone_amp",
      "tier": "low",
      "price": 70.0,
      "maintenance_weekly": 0.14,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 1
      },
      "io": {},
      "notes": "Amplificador de cinturó per músics"
    },
    {
      "id": "headphone_amp_art_headamp4",
      "name": "ART HeadAmp4",
      "category": "headphone_amp",
      "tier": "low",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 4
      },
      "io": {},
      "notes": "Compacte i fiable"
    },
    {
      "id": "headphone_amp_samson_qh4",
      "name": "Samson QH4",
      "category": "headphone_amp",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 4
      },
      "io": {},
      "notes": "4 canals amb control independent"
    },
    {
      "id": "headphone_amp_presonus_hp4",
      "name": "Presonus HP4",
      "category": "headphone_amp",
      "tier": "low",
      "price": 130.0,
      "maintenance_weekly": 0.26,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 4
      },
      "io": {},
      "notes": "4 sortides amb volum independent"
    },
    {
      "id": "headphone_amp_behringer_ha8000_powerplay",
      "name": "Behringer HA8000 Powerplay",
      "category": "headphone_amp",
      "tier": "low",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "hp_amp_quality": 40,
        "channels": 8
      },
      "io": {},
      "notes": "8 canals independents per estudi"
    },
    {
      "id": "headphone_amp_behringer_powerplay_p2",
      "name": "Behringer Powerplay P2",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 1
      },
      "io": {},
      "notes": "Amplificador personal de cinturó"
    },
    {
      "id": "headphone_amp_art_headamp6",
      "name": "ART HeadAmp6",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 6
      },
      "io": {},
      "notes": "6 sortides, molt usat en estudis"
    },
    {
      "id": "headphone_amp_mackie_hm_800",
      "name": "Mackie HM-800",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 250.0,
      "maintenance_weekly": 0.5,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 8
      },
      "io": {},
      "notes": "8 sortides per estudi"
    },
    {
      "id": "headphone_amp_behringer_powerplay_p16_hq",
      "name": "Behringer Powerplay P16-HQ",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 16
      },
      "io": {},
      "notes": "Sistema de monitoratge personal"
    },
    {
      "id": "headphone_amp_presonus_hp60",
      "name": "PreSonus HP60",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 6
      },
      "io": {},
      "notes": "Entrades A/B, talkback"
    },
    {
      "id": "headphone_amp_focusrite_rednet_am2",
      "name": "Focusrite RedNet AM2",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 450.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 1
      },
      "io": {},
      "notes": "Per sistemes en xarxa Dante"
    },
    {
      "id": "headphone_amp_furman_hds_6_hrm_6_system",
      "name": "Furman HDS-6/HRM-6 System",
      "category": "headphone_amp",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "hp_amp_quality": 55,
        "channels": 6
      },
      "io": {},
      "notes": "Sistema modular de monitoratge"
    },
    {
      "id": "headphone_amp_lake_people_g103_s",
      "name": "Lake People G103-S",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 1
      },
      "io": {},
      "notes": "Molt net i potent"
    },
    {
      "id": "headphone_amp_rupert_neve_designs_rnhp",
      "name": "Rupert Neve Designs RNHP",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 1
      },
      "io": {},
      "notes": "So molt detallat i natural"
    },
    {
      "id": "headphone_amp_spl_phonitor_one",
      "name": "SPL Phonitor One",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 1
      },
      "io": {},
      "notes": "Crossfeed per mescla amb cascos"
    },
    {
      "id": "headphone_amp_grace_design_m900",
      "name": "Grace Design m900",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 800.0,
      "maintenance_weekly": 1.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 2
      },
      "io": {},
      "notes": "Qualitat audiófila i d’estudi"
    },
    {
      "id": "headphone_amp_grace_design_m902",
      "name": "Grace Design m902",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 1600.0,
      "maintenance_weekly": 3.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 2
      },
      "io": {},
      "notes": "Referència en mastering"
    },
    {
      "id": "headphone_amp_spl_phonitor_x",
      "name": "SPL Phonitor X",
      "category": "headphone_amp",
      "tier": "pro",
      "price": 2300.0,
      "maintenance_weekly": 4.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "hp_amp_quality": 70,
        "channels": 2
      },
      "io": {},
      "notes": "Referència absoluta en cascos"
    },
    {
      "id": "headphones_behringer_hpm1000",
      "name": "Behringer HPM1000",
      "category": "headphones",
      "tier": "low",
      "price": 20.0,
      "maintenance_weekly": 0.04,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Útils per músics en gravació"
    },
    {
      "id": "headphones_behringer_bh470",
      "name": "Behringer BH470",
      "category": "headphones",
      "tier": "low",
      "price": 25.0,
      "maintenance_weekly": 0.05,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Molt econòmics per gravació bàsica"
    },
    {
      "id": "headphones_superlux_hd681",
      "name": "Superlux HD681",
      "category": "headphones",
      "tier": "low",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Semi-obert"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 30
      },
      "io": {},
      "notes": "Sorprenentment bons pel preu"
    },
    {
      "id": "headphones_tascam_th_02",
      "name": "Tascam TH-02",
      "category": "headphones",
      "tier": "low",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Bàsics per estudi casolà"
    },
    {
      "id": "headphones_akg_k52",
      "name": "AKG K52",
      "category": "headphones",
      "tier": "low",
      "price": 40.0,
      "maintenance_weekly": 0.08,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Confortables i lleugers"
    },
    {
      "id": "headphones_presonus_hd7",
      "name": "Presonus HD7",
      "category": "headphones",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Semi-obert"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 30
      },
      "io": {},
      "notes": "Bona imatge estèreo"
    },
    {
      "id": "headphones_samson_sr850",
      "name": "Samson SR850",
      "category": "headphones",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Semi-obert"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 30
      },
      "io": {},
      "notes": "Bona relació qualitat/preu"
    },
    {
      "id": "headphones_superlux_hd662_evo",
      "name": "Superlux HD662 EVO",
      "category": "headphones",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Més aïllament per tracking"
    },
    {
      "id": "headphones_akg_k72",
      "name": "AKG K72",
      "category": "headphones",
      "tier": "low",
      "price": 55.0,
      "maintenance_weekly": 0.11,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Millor resposta en greus"
    },
    {
      "id": "headphones_audio_technica_ath_m20x",
      "name": "Audio-Technica ATH-M20x",
      "category": "headphones",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 40,
        "isolation": 70
      },
      "io": {},
      "notes": "Seguiment i edició bàsica"
    },
    {
      "id": "headphones_akg_k240_studio",
      "name": "AKG K240 Studio",
      "category": "headphones",
      "tier": "mid",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Semi-obert"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 30
      },
      "io": {},
      "notes": "Clàssics d’estudi"
    },
    {
      "id": "headphones_audio_technica_ath_m40x",
      "name": "Audio-Technica ATH-M40x",
      "category": "headphones",
      "tier": "mid",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 70
      },
      "io": {},
      "notes": "Resposta bastant plana"
    },
    {
      "id": "headphones_sennheiser_hd280_pro",
      "name": "Sennheiser HD280 Pro",
      "category": "headphones",
      "tier": "mid",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 70
      },
      "io": {},
      "notes": "Molt bon aïllament"
    },
    {
      "id": "headphones_sony_mdr_7506",
      "name": "Sony MDR-7506",
      "category": "headphones",
      "tier": "mid",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 70
      },
      "io": {},
      "notes": "Estàndard en broadcast"
    },
    {
      "id": "headphones_beyerdynamic_dt_770_pro_80",
      "name": "Beyerdynamic DT 770 Pro 80Ω",
      "category": "headphones",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 70
      },
      "io": {},
      "notes": "Molt usats per gravació"
    },
    {
      "id": "headphones_audio_technica_ath_m50x",
      "name": "Audio-Technica ATH-M50x",
      "category": "headphones",
      "tier": "mid",
      "price": 160.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 70
      },
      "io": {},
      "notes": "Molt popular, bons greus"
    },
    {
      "id": "headphones_beyerdynamic_dt_990_pro_250",
      "name": "Beyerdynamic DT 990 Pro 250Ω",
      "category": "headphones",
      "tier": "mid",
      "price": 160.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 30
      },
      "io": {},
      "notes": "Molt bons per mescla"
    },
    {
      "id": "headphones_akg_k702",
      "name": "AKG K702",
      "category": "headphones",
      "tier": "mid",
      "price": 170.0,
      "maintenance_weekly": 0.34,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 30
      },
      "io": {},
      "notes": "Molt detall en mescla"
    },
    {
      "id": "headphones_beyerdynamic_dt_880_pro",
      "name": "Beyerdynamic DT 880 Pro",
      "category": "headphones",
      "tier": "mid",
      "price": 190.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Semi-obert"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 30
      },
      "io": {},
      "notes": "Equilibri entre tracking i mixing"
    },
    {
      "id": "headphones_sennheiser_hd560s",
      "name": "Sennheiser HD560S",
      "category": "headphones",
      "tier": "mid",
      "price": 190.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 55,
        "isolation": 30
      },
      "io": {},
      "notes": "Resposta molt neutra"
    },
    {
      "id": "headphones_sennheiser_hd600",
      "name": "Sennheiser HD600",
      "category": "headphones",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 30
      },
      "io": {},
      "notes": "Referència per mescla"
    },
    {
      "id": "headphones_sennheiser_hd650",
      "name": "Sennheiser HD650",
      "category": "headphones",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 30
      },
      "io": {},
      "notes": "Més càlids que HD600"
    },
    {
      "id": "headphones_beyerdynamic_dt_1990_pro",
      "name": "Beyerdynamic DT 1990 Pro",
      "category": "headphones",
      "tier": "pro",
      "price": 450.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 30
      },
      "io": {},
      "notes": "Detall extrem per mixing"
    },
    {
      "id": "headphones_neumann_ndh_20",
      "name": "Neumann NDH 20",
      "category": "headphones",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 70
      },
      "io": {},
      "notes": "Tracking pro amb molt aïllament"
    },
    {
      "id": "headphones_shure_srh1540",
      "name": "Shure SRH1540",
      "category": "headphones",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Tancat"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 70
      },
      "io": {},
      "notes": "Tancats d’alta gamma"
    },
    {
      "id": "headphones_neumann_ndh_30",
      "name": "Neumann NDH 30",
      "category": "headphones",
      "tier": "pro",
      "price": 650.0,
      "maintenance_weekly": 1.3,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 30
      },
      "io": {},
      "notes": "Resposta molt precisa"
    },
    {
      "id": "headphones_audeze_lcd_2_classic",
      "name": "Audeze LCD-2 Classic",
      "category": "headphones",
      "tier": "pro",
      "price": 800.0,
      "maintenance_weekly": 1.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert planar"
      ],
      "stats": {
        "hp_accuracy": 75,
        "isolation": 30
      },
      "io": {},
      "notes": "So molt natural"
    },
    {
      "id": "headphones_dan_clark_audio_aeon_2",
      "name": "Dan Clark Audio AEON 2",
      "category": "headphones",
      "tier": "pro",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert planar"
      ],
      "stats": {
        "hp_accuracy": 75,
        "isolation": 30
      },
      "io": {},
      "notes": "Planars lleugers i molt detallats"
    },
    {
      "id": "headphones_audeze_lcd_x",
      "name": "Audeze LCD-X",
      "category": "headphones",
      "tier": "pro",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert planar"
      ],
      "stats": {
        "hp_accuracy": 75,
        "isolation": 30
      },
      "io": {},
      "notes": "Planars per mastering"
    },
    {
      "id": "headphones_focal_clear_mg_professional",
      "name": "Focal Clear Mg Professional",
      "category": "headphones",
      "tier": "pro",
      "price": 1500.0,
      "maintenance_weekly": 3.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Obert"
      ],
      "stats": {
        "hp_accuracy": 70,
        "isolation": 30
      },
      "io": {},
      "notes": "Alta gamma d’estudi"
    },
    {
      "id": "interface_behringer_umc22",
      "name": "Behringer UMC22",
      "category": "interface",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Molt bàsica, ideal per començar"
    },
    {
      "id": "interface_m_audio_m_track_duo",
      "name": "M-Audio M-Track Duo",
      "category": "interface",
      "tier": "low",
      "price": 70.0,
      "maintenance_weekly": 0.14,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Molt econòmica"
    },
    {
      "id": "interface_behringer_umc202hd",
      "name": "Behringer UMC202HD",
      "category": "interface",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "24bit/192kHz, millor qualitat"
    },
    {
      "id": "interface_zoom_u_22",
      "name": "Zoom U-22",
      "category": "interface",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Portàtil i bus-powered"
    },
    {
      "id": "interface_steinberg_ur12",
      "name": "Steinberg UR12",
      "category": "interface",
      "tier": "low",
      "price": 95.0,
      "maintenance_weekly": 0.19,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Previs Yamaha"
    },
    {
      "id": "interface_presonus_audiobox_usb_96",
      "name": "Presonus AudioBox USB 96",
      "category": "interface",
      "tier": "low",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Robusta i senzilla"
    },
    {
      "id": "interface_focusrite_scarlett_solo_4th_gen",
      "name": "Focusrite Scarlett Solo 4th Gen",
      "category": "interface",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB-C"
      },
      "notes": "Podcast i veus"
    },
    {
      "id": "interface_native_instruments_komplete_audio_2",
      "name": "Native Instruments Komplete Audio 2",
      "category": "interface",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB"
      },
      "notes": "Bona per producció musical"
    },
    {
      "id": "interface_tascam_us_2x2hr",
      "name": "Tascam US-2x2HR",
      "category": "interface",
      "tier": "low",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB-C"
      },
      "notes": "24bit/192kHz"
    },
    {
      "id": "interface_focusrite_scarlett_2i2_4th_gen",
      "name": "Focusrite Scarlett 2i2 4th Gen",
      "category": "interface",
      "tier": "low",
      "price": 190.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "conversion_quality": 45,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 2
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 2,
        "connection": "USB-C"
      },
      "notes": "Molt popular per home studio"
    },
    {
      "id": "interface_motu_m4",
      "name": "MOTU M4",
      "category": "interface",
      "tier": "mid",
      "price": 280.0,
      "maintenance_weekly": 0.56,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 4,
        "outputs": 4
      },
      "io": {
        "inputs_total": 4,
        "outputs_total": 4,
        "connection": "USB-C"
      },
      "notes": "Molt baixa latència"
    },
    {
      "id": "interface_audient_id14_mkii",
      "name": "Audient iD14 MKII",
      "category": "interface",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 10,
        "outputs": 6
      },
      "io": {
        "inputs_total": 10,
        "outputs_total": 6,
        "connection": "USB-C"
      },
      "notes": "Previs molt bons"
    },
    {
      "id": "interface_ssl_2",
      "name": "SSL 2+",
      "category": "interface",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 2,
        "outputs": 4
      },
      "io": {
        "inputs_total": 2,
        "outputs_total": 4,
        "connection": "USB-C"
      },
      "notes": "So SSL, compacte"
    },
    {
      "id": "interface_focusrite_scarlett_8i6_3rd_gen",
      "name": "Focusrite Scarlett 8i6 3rd Gen",
      "category": "interface",
      "tier": "mid",
      "price": 320.0,
      "maintenance_weekly": 0.64,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 8,
        "outputs": 6
      },
      "io": {
        "inputs_total": 8,
        "outputs_total": 6,
        "connection": "USB"
      },
      "notes": "MIDI i SPDIF"
    },
    {
      "id": "interface_universal_audio_volt_476",
      "name": "Universal Audio Volt 476",
      "category": "interface",
      "tier": "mid",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 4,
        "outputs": 4
      },
      "io": {
        "inputs_total": 4,
        "outputs_total": 4,
        "connection": "USB-C"
      },
      "notes": "Compressor analògic integrat"
    },
    {
      "id": "interface_presonus_studio_1824c",
      "name": "Presonus Studio 1824c",
      "category": "interface",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 18,
        "outputs": 20
      },
      "io": {
        "inputs_total": 18,
        "outputs_total": 20,
        "connection": "USB-C"
      },
      "notes": "ADAT per expansió"
    },
    {
      "id": "interface_focusrite_scarlett_18i20_3rd_gen",
      "name": "Focusrite Scarlett 18i20 3rd Gen",
      "category": "interface",
      "tier": "mid",
      "price": 520.0,
      "maintenance_weekly": 1.04,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 18,
        "outputs": 20
      },
      "io": {
        "inputs_total": 18,
        "outputs_total": 20,
        "connection": "USB"
      },
      "notes": "Ideal per gravar bateries"
    },
    {
      "id": "interface_steinberg_ur824",
      "name": "Steinberg UR824",
      "category": "interface",
      "tier": "mid",
      "price": 650.0,
      "maintenance_weekly": 1.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 24,
        "outputs": 24
      },
      "io": {
        "inputs_total": 24,
        "outputs_total": 24,
        "connection": "USB"
      },
      "notes": "DSP integrat"
    },
    {
      "id": "interface_audient_id44_mkii",
      "name": "Audient iD44 MKII",
      "category": "interface",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 55,
        "inputs": 20,
        "outputs": 24
      },
      "io": {
        "inputs_total": 20,
        "outputs_total": 24,
        "connection": "USB-C"
      },
      "notes": "2 ports ADAT"
    },
    {
      "id": "interface_motu_8pre_es",
      "name": "MOTU 8pre-es",
      "category": "interface",
      "tier": "mid",
      "price": 1100.0,
      "maintenance_weekly": 2.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "conversion_quality": 60,
        "latency_score": 65,
        "inputs": 16,
        "outputs": 24
      },
      "io": {
        "inputs_total": 16,
        "outputs_total": 24,
        "connection": "USB/Thunderbolt/AVB"
      },
      "notes": "També funciona com previ ADAT"
    },
    {
      "id": "interface_antelope_audio_zen_go_synergy_core",
      "name": "Antelope Audio Zen Go Synergy Core",
      "category": "interface",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 4,
        "outputs": 8
      },
      "io": {
        "inputs_total": 4,
        "outputs_total": 8,
        "connection": "USB/Thunderbolt"
      },
      "notes": "DSP i bons clocks"
    },
    {
      "id": "interface_rme_babyface_pro_fs",
      "name": "RME Babyface Pro FS",
      "category": "interface",
      "tier": "pro",
      "price": 850.0,
      "maintenance_weekly": 1.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 65,
        "inputs": 12,
        "outputs": 12
      },
      "io": {
        "inputs_total": 12,
        "outputs_total": 12,
        "connection": "USB"
      },
      "notes": "Drivers ultra estables"
    },
    {
      "id": "interface_universal_audio_apollo_twin_x_duo",
      "name": "Universal Audio Apollo Twin X Duo",
      "category": "interface",
      "tier": "pro",
      "price": 950.0,
      "maintenance_weekly": 1.9,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 10,
        "outputs": 6
      },
      "io": {
        "inputs_total": 10,
        "outputs_total": 6,
        "connection": "Thunderbolt"
      },
      "notes": "DSP per plugins UAD"
    },
    {
      "id": "interface_rme_fireface_ucx_ii",
      "name": "RME Fireface UCX II",
      "category": "interface",
      "tier": "pro",
      "price": 1300.0,
      "maintenance_weekly": 2.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 65,
        "inputs": 20,
        "outputs": 20
      },
      "io": {
        "inputs_total": 20,
        "outputs_total": 20,
        "connection": "USB"
      },
      "notes": "Molt usada en estudis"
    },
    {
      "id": "interface_apogee_symphony_desktop",
      "name": "Apogee Symphony Desktop",
      "category": "interface",
      "tier": "pro",
      "price": 1500.0,
      "maintenance_weekly": 3.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 10,
        "outputs": 14
      },
      "io": {
        "inputs_total": 10,
        "outputs_total": 14,
        "connection": "USB/Thunderbolt"
      },
      "notes": "Conversió d’alta gamma"
    },
    {
      "id": "interface_motu_1248",
      "name": "MOTU 1248",
      "category": "interface",
      "tier": "pro",
      "price": 1600.0,
      "maintenance_weekly": 3.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 66,
        "outputs": 66
      },
      "io": {
        "inputs_total": 66,
        "outputs_total": 66,
        "connection": "Thunderbolt/AVB/USB"
      },
      "notes": "Sistema en xarxa AVB"
    },
    {
      "id": "interface_rme_fireface_ufx_ii",
      "name": "RME Fireface UFX II",
      "category": "interface",
      "tier": "pro",
      "price": 2400.0,
      "maintenance_weekly": 4.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 65,
        "inputs": 30,
        "outputs": 30
      },
      "io": {
        "inputs_total": 30,
        "outputs_total": 30,
        "connection": "USB"
      },
      "notes": "Gravació directa a USB"
    },
    {
      "id": "interface_universal_audio_apollo_x8",
      "name": "Universal Audio Apollo x8",
      "category": "interface",
      "tier": "pro",
      "price": 2800.0,
      "maintenance_weekly": 5.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 18,
        "outputs": 24
      },
      "io": {
        "inputs_total": 18,
        "outputs_total": 24,
        "connection": "Thunderbolt"
      },
      "notes": "Estudi professional"
    },
    {
      "id": "interface_antelope_audio_orion_studio_synergy_core",
      "name": "Antelope Audio Orion Studio Synergy Core",
      "category": "interface",
      "tier": "pro",
      "price": 3000.0,
      "maintenance_weekly": 6.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 37,
        "outputs": 37
      },
      "io": {
        "inputs_total": 37,
        "outputs_total": 37,
        "connection": "USB/Thunderbolt"
      },
      "notes": "Tot en un per estudi gran"
    },
    {
      "id": "interface_focusrite_red_8pre",
      "name": "Focusrite Red 8Pre",
      "category": "interface",
      "tier": "pro",
      "price": 5000.0,
      "maintenance_weekly": 10.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "conversion_quality": 75,
        "latency_score": 75,
        "inputs": 64,
        "outputs": 64
      },
      "io": {
        "inputs_total": 64,
        "outputs_total": 64,
        "connection": "Thunderbolt/Dante"
      },
      "notes": "Estàndard broadcast i Pro Tools"
    },
    {
      "id": "mic_the_t_bone_bd_200",
      "name": "the t.bone BD 200",
      "category": "mic",
      "tier": "low",
      "price": 27.0,
      "maintenance_weekly": 0.05,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 43,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo molt econòmic"
    },
    {
      "id": "mic_the_t_bone_cc57",
      "name": "the t.bone CC57",
      "category": "mic",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 40,
        "self_noise": 0
      },
      "io": {},
      "notes": "Caixa"
    },
    {
      "id": "mic_the_t_bone_bd_300",
      "name": "the t.bone BD 300",
      "category": "mic",
      "tier": "low",
      "price": 53.0,
      "maintenance_weekly": 0.11,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 43,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo econòmic"
    },
    {
      "id": "mic_behringer_c_2_parell",
      "name": "Behringer C-2 (parell)",
      "category": "mic",
      "tier": "low",
      "price": 55.0,
      "maintenance_weekly": 0.11,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 45,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads econòmic"
    },
    {
      "id": "mic_audio_technica_at2020",
      "name": "Audio-Technica AT2020",
      "category": "mic",
      "tier": "low",
      "price": 88.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 45,
        "self_noise": 0
      },
      "io": {},
      "notes": "Veus / Percussió"
    },
    {
      "id": "mic_audio_technica_at2021",
      "name": "Audio-Technica AT2021",
      "category": "mic",
      "tier": "low",
      "price": 89.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 45,
        "self_noise": 0
      },
      "io": {},
      "notes": "Instrumental"
    },
    {
      "id": "mic_samson_c02",
      "name": "Samson C02",
      "category": "mic",
      "tier": "low",
      "price": 89.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 45,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads econòmic"
    },
    {
      "id": "mic_the_t_bone_mb7_beta",
      "name": "the t.bone MB7 Beta",
      "category": "mic",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 40,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms"
    },
    {
      "id": "mic_behringer_b_1",
      "name": "Behringer B-1",
      "category": "mic",
      "tier": "mid",
      "price": 99.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Estudi econòmic"
    },
    {
      "id": "mic_the_t_bone_bd_500_beta",
      "name": "the t.bone BD 500 Beta",
      "category": "mic",
      "tier": "mid",
      "price": 99.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo econòmic"
    },
    {
      "id": "mic_the_t_bone_bd500",
      "name": "the t.bone BD500",
      "category": "mic",
      "tier": "mid",
      "price": 99.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Graves",
        "Baix"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Econòmic"
    },
    {
      "id": "mic_the_t_bone_sc140",
      "name": "the t.bone SC140",
      "category": "mic",
      "tier": "mid",
      "price": 99.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads"
    },
    {
      "id": "mic_shure_sm57",
      "name": "Shure SM57",
      "category": "mic",
      "tier": "mid",
      "price": 109.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Caixa / Guitar cab"
    },
    {
      "id": "mic_se_electronics_v7_x",
      "name": "SE Electronics V7 X",
      "category": "mic",
      "tier": "mid",
      "price": 119.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Cordes",
        "Guitarra"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Amp elèctrica"
    },
    {
      "id": "mic_sennheiser_e904",
      "name": "Sennheiser e904",
      "category": "mic",
      "tier": "mid",
      "price": 125.0,
      "maintenance_weekly": 0.25,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms / Caixa"
    },
    {
      "id": "mic_universal_audio_sd_7",
      "name": "Universal Audio SD-7",
      "category": "mic",
      "tier": "mid",
      "price": 129.0,
      "maintenance_weekly": 0.26,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms / Guitar"
    },
    {
      "id": "mic_rode_nt5",
      "name": "Rode NT5",
      "category": "mic",
      "tier": "mid",
      "price": 149.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads / Cordes"
    },
    {
      "id": "mic_the_t_bone_dc1500",
      "name": "the t.bone DC1500",
      "category": "mic",
      "tier": "mid",
      "price": 159.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo / percussió"
    },
    {
      "id": "mic_lewitt_lct_140_air",
      "name": "Lewitt LCT 140 Air",
      "category": "mic",
      "tier": "mid",
      "price": 164.0,
      "maintenance_weekly": 0.33,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads"
    },
    {
      "id": "mic_audix_d2",
      "name": "Audix D2",
      "category": "mic",
      "tier": "mid",
      "price": 169.0,
      "maintenance_weekly": 0.34,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms"
    },
    {
      "id": "mic_akg_d112_mkii",
      "name": "AKG D112 MKII",
      "category": "mic",
      "tier": "mid",
      "price": 172.0,
      "maintenance_weekly": 0.34,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo / Baix amp"
    },
    {
      "id": "mic_audix_d4",
      "name": "Audix D4",
      "category": "mic",
      "tier": "mid",
      "price": 179.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms"
    },
    {
      "id": "mic_se_electronics_v_beat",
      "name": "SE Electronics V Beat",
      "category": "mic",
      "tier": "mid",
      "price": 186.0,
      "maintenance_weekly": 0.37,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms"
    },
    {
      "id": "mic_shure_beta_52a",
      "name": "Shure Beta 52A",
      "category": "mic",
      "tier": "mid",
      "price": 188.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo / Baix amp"
    },
    {
      "id": "mic_akg_c451b",
      "name": "AKG C451B",
      "category": "mic",
      "tier": "mid",
      "price": 199.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Plats / Guitar acústica"
    },
    {
      "id": "mic_rode_nt1_a",
      "name": "Rode NT1-A",
      "category": "mic",
      "tier": "mid",
      "price": 199.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Veus / Overheads"
    },
    {
      "id": "mic_se_electronics_x1_s",
      "name": "SE Electronics X1 S",
      "category": "mic",
      "tier": "mid",
      "price": 199.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Multiús"
    },
    {
      "id": "mic_se_electronics_se8",
      "name": "SE Electronics sE8",
      "category": "mic",
      "tier": "mid",
      "price": 199.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Overheads"
    },
    {
      "id": "mic_se_electronics_v_kick",
      "name": "SE Electronics V Kick",
      "category": "mic",
      "tier": "mid",
      "price": 229.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo"
    },
    {
      "id": "mic_audix_d6",
      "name": "Audix D6",
      "category": "mic",
      "tier": "mid",
      "price": 243.0,
      "maintenance_weekly": 0.49,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 58,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo modern"
    },
    {
      "id": "mic_sennheiser_md421",
      "name": "Sennheiser MD421",
      "category": "mic",
      "tier": "mid",
      "price": 258.0,
      "maintenance_weekly": 0.52,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Toms / Guitar cab"
    },
    {
      "id": "mic_lewitt_lct_440_pure",
      "name": "Lewitt LCT 440 Pure",
      "category": "mic",
      "tier": "mid",
      "price": 269.0,
      "maintenance_weekly": 0.54,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Veus"
    },
    {
      "id": "mic_aston_origin",
      "name": "Aston Origin",
      "category": "mic",
      "tier": "mid",
      "price": 299.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Veus"
    },
    {
      "id": "mic_rode_nt5_stereo_pair",
      "name": "Rode NT5 Stereo Pair",
      "category": "mic",
      "tier": "mid",
      "price": 299.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Estèreo",
        "Parell"
      ],
      "stats": {
        "mic_quality": 55,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes / Overheads"
    },
    {
      "id": "mic_warm_audio_wa_47jr",
      "name": "Warm Audio WA-47jr",
      "category": "mic",
      "tier": "mid",
      "price": 299.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 60,
        "self_noise": 0
      },
      "io": {},
      "notes": "Estudi"
    },
    {
      "id": "mic_akg_c214",
      "name": "AKG C214",
      "category": "mic",
      "tier": "pro",
      "price": 349.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 75,
        "self_noise": 0
      },
      "io": {},
      "notes": "Estudi"
    },
    {
      "id": "mic_shure_sm7b",
      "name": "Shure SM7B",
      "category": "mic",
      "tier": "pro",
      "price": 389.0,
      "maintenance_weekly": 0.78,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Graves",
        "Baix"
      ],
      "stats": {
        "mic_quality": 73,
        "self_noise": 0
      },
      "io": {},
      "notes": "Estudi"
    },
    {
      "id": "mic_akg_c451_pair",
      "name": "AKG C451 Pair",
      "category": "mic",
      "tier": "pro",
      "price": 399.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Estèreo",
        "Parell"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes"
    },
    {
      "id": "mic_aston_spirit",
      "name": "Aston Spirit",
      "category": "mic",
      "tier": "pro",
      "price": 399.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Cordes",
        "Guitarra"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Acústica"
    },
    {
      "id": "mic_rode_nt2_a",
      "name": "Rode NT2-A",
      "category": "mic",
      "tier": "pro",
      "price": 399.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 75,
        "self_noise": 0
      },
      "io": {},
      "notes": "Multi patró"
    },
    {
      "id": "mic_se_electronics_se8_pair",
      "name": "SE Electronics sE8 Pair",
      "category": "mic",
      "tier": "pro",
      "price": 399.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Estèreo",
        "Parell"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes"
    },
    {
      "id": "mic_sontronics_dm_1b",
      "name": "Sontronics DM-1B",
      "category": "mic",
      "tier": "pro",
      "price": 409.0,
      "maintenance_weekly": 0.82,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Percussió",
        "Caixa/Tom"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Caixa premium"
    },
    {
      "id": "mic_electro_voice_re20",
      "name": "Electro-Voice RE20",
      "category": "mic",
      "tier": "pro",
      "price": 449.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Graves",
        "Baix"
      ],
      "stats": {
        "mic_quality": 73,
        "self_noise": 0
      },
      "io": {},
      "notes": "Estudi"
    },
    {
      "id": "mic_lauten_audio_kick_mic",
      "name": "Lauten Audio Kick Mic",
      "category": "mic",
      "tier": "pro",
      "price": 485.0,
      "maintenance_weekly": 0.97,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 73,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo estudi"
    },
    {
      "id": "mic_royer_r_10",
      "name": "Royer R-10",
      "category": "mic",
      "tier": "pro",
      "price": 499.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Cordes",
        "Guitarra"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Ribbon amp"
    },
    {
      "id": "mic_beyerdynamic_mc930",
      "name": "Beyerdynamic MC930",
      "category": "mic",
      "tier": "pro",
      "price": 555.0,
      "maintenance_weekly": 1.11,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 75,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes"
    },
    {
      "id": "mic_dpa_4055",
      "name": "DPA 4055",
      "category": "mic",
      "tier": "pro",
      "price": 649.0,
      "maintenance_weekly": 1.3,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Percussió",
        "Bombo"
      ],
      "stats": {
        "mic_quality": 73,
        "self_noise": 0
      },
      "io": {},
      "notes": "Bombo premium"
    },
    {
      "id": "mic_beyerdynamic_m160",
      "name": "Beyerdynamic M160",
      "category": "mic",
      "tier": "pro",
      "price": 699.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Cordes",
        "Guitarra"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Ribbon amp"
    },
    {
      "id": "mic_neumann_km184",
      "name": "Neumann KM184",
      "category": "mic",
      "tier": "pro",
      "price": 699.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Condensador",
        "Petit"
      ],
      "stats": {
        "mic_quality": 75,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes premium"
    },
    {
      "id": "mic_neumann_tlm102",
      "name": "Neumann TLM102",
      "category": "mic",
      "tier": "pro",
      "price": 699.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Condensador",
        "Gran"
      ],
      "stats": {
        "mic_quality": 75,
        "self_noise": 0
      },
      "io": {},
      "notes": "Veus premium"
    },
    {
      "id": "mic_beyerdynamic_mc930_pair",
      "name": "Beyerdynamic MC930 Pair",
      "category": "mic",
      "tier": "pro",
      "price": 999.0,
      "maintenance_weekly": 2.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Estèreo",
        "Parell"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes premium"
    },
    {
      "id": "mic_neumann_km184_pair",
      "name": "Neumann KM184 Pair",
      "category": "mic",
      "tier": "pro",
      "price": 1399.0,
      "maintenance_weekly": 2.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Estèreo",
        "Parell"
      ],
      "stats": {
        "mic_quality": 70,
        "self_noise": 0
      },
      "io": {},
      "notes": "Cordes premium"
    },
    {
      "id": "mic_accessory_the_t_bone_drum_clip",
      "name": "the t.bone Drum Clip",
      "category": "mic_accessory",
      "tier": "low",
      "price": 12.0,
      "maintenance_weekly": 0.02,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Per muntar micro a bateria"
    },
    {
      "id": "mic_accessory_k_m_24030_universal_clamp",
      "name": "K&M 24030 Universal Clamp",
      "category": "mic_accessory",
      "tier": "mid",
      "price": 30.0,
      "maintenance_weekly": 0.06,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Per barres i tubs"
    },
    {
      "id": "mic_accessory_sennheiser_mzh_drum_clamp",
      "name": "Sennheiser MZH Drum Clamp",
      "category": "mic_accessory",
      "tier": "mid",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Molt estable per toms"
    },
    {
      "id": "mic_accessory_triad_orbit_io_equipped_micro_adapters_set",
      "name": "Triad-Orbit IO-Equipped Micro Adapters Set",
      "category": "mic_accessory",
      "tier": "pro",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Canvi ràpid de micros"
    },
    {
      "id": "mic_stand_millenium_ms2003",
      "name": "Millenium MS2003",
      "category": "mic_stand",
      "tier": "low",
      "price": 20.0,
      "maintenance_weekly": 0.04,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Bàsic per veu i instruments"
    },
    {
      "id": "mic_stand_millenium_ms3003",
      "name": "Millenium MS3003",
      "category": "mic_stand",
      "tier": "low",
      "price": 25.0,
      "maintenance_weekly": 0.05,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Versàtil per instruments"
    },
    {
      "id": "mic_stand_k_m_210_9",
      "name": "K&M 210/9",
      "category": "mic_stand",
      "tier": "mid",
      "price": 55.0,
      "maintenance_weekly": 0.11,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Molt robust, estàndard d’estudi"
    },
    {
      "id": "mic_stand_k_m_25950_low_profile",
      "name": "K&M 25950 Low Profile",
      "category": "mic_stand",
      "tier": "mid",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Ideal per bombo i amplis"
    },
    {
      "id": "mic_stand_k_m_21090_heavy_duty",
      "name": "K&M 21090 Heavy Duty",
      "category": "mic_stand",
      "tier": "pro",
      "price": 85.0,
      "maintenance_weekly": 0.17,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Per micros pesants"
    },
    {
      "id": "mic_stand_triad_orbit_t2_boom",
      "name": "Triad-Orbit T2 + BOOM",
      "category": "mic_stand",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Sistema professional modular"
    },
    {
      "id": "midi_controller_m_audio_keystation_mini_32",
      "name": "M-Audio Keystation Mini 32",
      "category": "midi_controller",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 49.6
      },
      "io": {},
      "notes": "Molt lleuger i simple"
    },
    {
      "id": "midi_controller_akai_lpk25_wireless",
      "name": "Akai LPK25 Wireless",
      "category": "midi_controller",
      "tier": "low",
      "price": 70.0,
      "maintenance_weekly": 0.14,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Bluetooth, molt portàtil"
    },
    {
      "id": "midi_controller_behringer_umx250",
      "name": "Behringer UMX250",
      "category": "midi_controller",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Opció molt econòmica"
    },
    {
      "id": "midi_controller_akai_mpk_mini_mk3",
      "name": "Akai MPK Mini Mk3",
      "category": "midi_controller",
      "tier": "low",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Molt popular i portàtil"
    },
    {
      "id": "midi_controller_novation_launchkey_mini_mk3",
      "name": "Novation Launchkey Mini Mk3",
      "category": "midi_controller",
      "tier": "low",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Ideal per Ableton Live"
    },
    {
      "id": "midi_controller_arturia_minilab_3",
      "name": "Arturia MiniLab 3",
      "category": "midi_controller",
      "tier": "low",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Bona integració amb DAWs"
    },
    {
      "id": "midi_controller_korg_microkey2_37",
      "name": "Korg microKEY2-37",
      "category": "midi_controller",
      "tier": "low",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 51.1
      },
      "io": {},
      "notes": "Tecles tipus mini, molt fi"
    },
    {
      "id": "midi_controller_m_audio_keystation_49_mk3",
      "name": "M-Audio Keystation 49 MK3",
      "category": "midi_controller",
      "tier": "low",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Clàssic per estudiar"
    },
    {
      "id": "midi_controller_nektar_impact_lx25",
      "name": "Nektar Impact LX25+",
      "category": "midi_controller",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 47.5
      },
      "io": {},
      "notes": "Control directe de DAW"
    },
    {
      "id": "midi_controller_nektar_impact_lx49",
      "name": "Nektar Impact LX49+",
      "category": "midi_controller",
      "tier": "low",
      "price": 160.0,
      "maintenance_weekly": 0.32,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Més tecles i controls"
    },
    {
      "id": "midi_controller_novation_launchkey_49_mk3",
      "name": "Novation Launchkey 49 Mk3",
      "category": "midi_controller",
      "tier": "mid",
      "price": 220.0,
      "maintenance_weekly": 0.44,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Control profund d’Ableton"
    },
    {
      "id": "midi_controller_native_instruments_komplete_kontrol_a49",
      "name": "Native Instruments Komplete Kontrol A49",
      "category": "midi_controller",
      "tier": "mid",
      "price": 230.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Control directe Kontakt/Komplete"
    },
    {
      "id": "midi_controller_arturia_keylab_essential_49_mk3",
      "name": "Arturia KeyLab Essential 49 Mk3",
      "category": "midi_controller",
      "tier": "mid",
      "price": 240.0,
      "maintenance_weekly": 0.48,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Bona integració Arturia"
    },
    {
      "id": "midi_controller_novation_launchkey_61_mk3",
      "name": "Novation Launchkey 61 Mk3",
      "category": "midi_controller",
      "tier": "mid",
      "price": 260.0,
      "maintenance_weekly": 0.52,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 58.3
      },
      "io": {},
      "notes": "Per producció completa"
    },
    {
      "id": "midi_controller_native_instruments_komplete_kontrol_a61",
      "name": "Native Instruments Komplete Kontrol A61",
      "category": "midi_controller",
      "tier": "mid",
      "price": 280.0,
      "maintenance_weekly": 0.56,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 58.3
      },
      "io": {},
      "notes": "Tecles grans i còmodes"
    },
    {
      "id": "midi_controller_arturia_keylab_essential_61_mk3",
      "name": "Arturia KeyLab Essential 61 Mk3",
      "category": "midi_controller",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 58.3
      },
      "io": {},
      "notes": "Més rang per tocar"
    },
    {
      "id": "midi_controller_akai_mpk249",
      "name": "Akai MPK249",
      "category": "midi_controller",
      "tier": "mid",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Pads professionals"
    },
    {
      "id": "midi_controller_nektar_panorama_p4",
      "name": "Nektar Panorama P4",
      "category": "midi_controller",
      "tier": "mid",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Integració DAW molt profunda"
    },
    {
      "id": "midi_controller_akai_mpk261",
      "name": "Akai MPK261",
      "category": "midi_controller",
      "tier": "mid",
      "price": 450.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 58.3
      },
      "io": {},
      "notes": "Control complet per estudi"
    },
    {
      "id": "midi_controller_korg_keystage_49",
      "name": "Korg Keystage 49",
      "category": "midi_controller",
      "tier": "mid",
      "price": 550.0,
      "maintenance_weekly": 1.1,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 54.7
      },
      "io": {},
      "notes": "Aftertouch polifònic"
    },
    {
      "id": "midi_controller_arturia_keylab_49_mkii",
      "name": "Arturia KeyLab 49 MkII",
      "category": "midi_controller",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 74.7
      },
      "io": {},
      "notes": "Construcció metàl·lica"
    },
    {
      "id": "midi_controller_arturia_keylab_61_mkii",
      "name": "Arturia KeyLab 61 MkII",
      "category": "midi_controller",
      "tier": "pro",
      "price": 650.0,
      "maintenance_weekly": 1.3,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 78.3
      },
      "io": {},
      "notes": "Control avançat"
    },
    {
      "id": "midi_controller_novation_sl_mkiii_61",
      "name": "Novation SL MkIII 61",
      "category": "midi_controller",
      "tier": "pro",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 78.3
      },
      "io": {},
      "notes": "Control hardware i software"
    },
    {
      "id": "midi_controller_native_instruments_komplete_kontrol_s49_mk3",
      "name": "Native Instruments Komplete Kontrol S49 Mk3",
      "category": "midi_controller",
      "tier": "pro",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 74.7
      },
      "io": {},
      "notes": "Pantalles i aftertouch"
    },
    {
      "id": "midi_controller_akai_mpc_key_37",
      "name": "Akai MPC Key 37",
      "category": "midi_controller",
      "tier": "pro",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 71.1
      },
      "io": {},
      "notes": "MPC + teclat integrats"
    },
    {
      "id": "midi_controller_native_instruments_komplete_kontrol_s61_mk3",
      "name": "Native Instruments Komplete Kontrol S61 Mk3",
      "category": "midi_controller",
      "tier": "pro",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 78.3
      },
      "io": {},
      "notes": "Alta integració i qualitat"
    },
    {
      "id": "midi_controller_native_instruments_komplete_kontrol_s88_mk3",
      "name": "Native Instruments Komplete Kontrol S88 Mk3",
      "category": "midi_controller",
      "tier": "pro",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 86.4
      },
      "io": {},
      "notes": "Tecles contrapesades"
    },
    {
      "id": "midi_controller_roli_seaboard_rise_2",
      "name": "Roli Seaboard Rise 2",
      "category": "midi_controller",
      "tier": "pro",
      "price": 1400.0,
      "maintenance_weekly": 2.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 74.7
      },
      "io": {},
      "notes": "Expressió multidimensional"
    },
    {
      "id": "midi_controller_akai_mpc_key_61",
      "name": "Akai MPC Key 61",
      "category": "midi_controller",
      "tier": "pro",
      "price": 1700.0,
      "maintenance_weekly": 3.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 78.3
      },
      "io": {},
      "notes": "Producció sense ordinador"
    },
    {
      "id": "midi_controller_osmose_by_expressive_e",
      "name": "Osmose by Expressive E",
      "category": "midi_controller",
      "tier": "pro",
      "price": 1800.0,
      "maintenance_weekly": 3.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 74.7
      },
      "io": {},
      "notes": "Control físic molt avançat"
    },
    {
      "id": "monitor_mackie_cr3_x",
      "name": "Mackie CR3-X",
      "category": "monitor",
      "tier": "low",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 47.0
      },
      "io": {},
      "notes": "Molt compactes per escriptori"
    },
    {
      "id": "monitor_presonus_eris_e3_5",
      "name": "Presonus Eris E3.5",
      "category": "monitor",
      "tier": "low",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 49.0
      },
      "io": {},
      "notes": "Home studio bàsic"
    },
    {
      "id": "monitor_mackie_cr4_x",
      "name": "Mackie CR4-X",
      "category": "monitor",
      "tier": "low",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 51.0
      },
      "io": {},
      "notes": "Millor greus que CR3"
    },
    {
      "id": "monitor_behringer_studio_50usb",
      "name": "Behringer Studio 50USB",
      "category": "monitor",
      "tier": "low",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "USB directe, molt econòmic"
    },
    {
      "id": "monitor_presonus_eris_e4_5",
      "name": "Presonus Eris E4.5",
      "category": "monitor",
      "tier": "low",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 53.0
      },
      "io": {},
      "notes": "Més potència i claredat"
    },
    {
      "id": "monitor_jbl_305p_mkii",
      "name": "JBL 305P MkII",
      "category": "monitor",
      "tier": "low",
      "price": 260.0,
      "maintenance_weekly": 0.52,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "Molt popular en project studios"
    },
    {
      "id": "monitor_behringer_truth_b2030a",
      "name": "Behringer Truth B2030A",
      "category": "monitor",
      "tier": "low",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 62.0
      },
      "io": {},
      "notes": "Bona potència, menys precís"
    },
    {
      "id": "monitor_krk_rokit_5_g4",
      "name": "KRK Rokit 5 G4",
      "category": "monitor",
      "tier": "low",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "So potent, DSP integrat"
    },
    {
      "id": "monitor_jbl_306p_mkii",
      "name": "JBL 306P MkII",
      "category": "monitor",
      "tier": "low",
      "price": 340.0,
      "maintenance_weekly": 0.68,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 59.0
      },
      "io": {},
      "notes": "Més greus, mateix caràcter"
    },
    {
      "id": "monitor_krk_rokit_7_g4",
      "name": "KRK Rokit 7 G4",
      "category": "monitor",
      "tier": "low",
      "price": 420.0,
      "maintenance_weekly": 0.84,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "monitor_accuracy": 45,
        "bass_extension": 63.0
      },
      "io": {},
      "notes": "Més cos en greus"
    },
    {
      "id": "monitor_adam_t5v",
      "name": "Adam T5V",
      "category": "monitor",
      "tier": "mid",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "Tweeter de cinta, molt detall"
    },
    {
      "id": "monitor_kali_audio_lp_6_v2",
      "name": "Kali Audio LP-6 V2",
      "category": "monitor",
      "tier": "mid",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Resposta molt plana"
    },
    {
      "id": "monitor_yamaha_hs5",
      "name": "Yamaha HS5",
      "category": "monitor",
      "tier": "mid",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "So molt neutre"
    },
    {
      "id": "monitor_adam_t7v",
      "name": "Adam T7V",
      "category": "monitor",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 63.0
      },
      "io": {},
      "notes": "Molt bon balanç qualitat/preu"
    },
    {
      "id": "monitor_yamaha_hs7",
      "name": "Yamaha HS7",
      "category": "monitor",
      "tier": "mid",
      "price": 520.0,
      "maintenance_weekly": 1.04,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Més resposta en greus"
    },
    {
      "id": "monitor_focal_alpha_50_evo",
      "name": "Focal Alpha 50 Evo",
      "category": "monitor",
      "tier": "mid",
      "price": 550.0,
      "maintenance_weekly": 1.1,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "So càlid i controlat"
    },
    {
      "id": "monitor_genelec_8010a",
      "name": "Genelec 8010A",
      "category": "monitor",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 47.0
      },
      "io": {},
      "notes": "Ultra compactes i precises"
    },
    {
      "id": "monitor_kali_audio_in_5",
      "name": "Kali Audio IN-5",
      "category": "monitor",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "Coaxial, imatge molt precisa"
    },
    {
      "id": "monitor_yamaha_hs8",
      "name": "Yamaha HS8",
      "category": "monitor",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 67.0
      },
      "io": {},
      "notes": "Per sales mitjanes"
    },
    {
      "id": "monitor_focal_alpha_65_evo",
      "name": "Focal Alpha 65 Evo",
      "category": "monitor",
      "tier": "mid",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "monitor_accuracy": 63,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Més detall en greus"
    },
    {
      "id": "monitor_genelec_8030c",
      "name": "Genelec 8030C",
      "category": "monitor",
      "tier": "pro",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 55.0
      },
      "io": {},
      "notes": "Molt precises i fiables"
    },
    {
      "id": "monitor_adam_a7v",
      "name": "Adam A7V",
      "category": "monitor",
      "tier": "pro",
      "price": 1500.0,
      "maintenance_weekly": 3.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 63.0
      },
      "io": {},
      "notes": "Nova generació Adam"
    },
    {
      "id": "monitor_neumann_kh120_ii",
      "name": "Neumann KH120 II",
      "category": "monitor",
      "tier": "pro",
      "price": 1600.0,
      "maintenance_weekly": 3.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 56.0
      },
      "io": {},
      "notes": "Estàndard professional"
    },
    {
      "id": "monitor_focal_shape_65",
      "name": "Focal Shape 65",
      "category": "monitor",
      "tier": "pro",
      "price": 2000.0,
      "maintenance_weekly": 4.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Sense port bass-reflex"
    },
    {
      "id": "monitor_genelec_8040b",
      "name": "Genelec 8040B",
      "category": "monitor",
      "tier": "pro",
      "price": 2000.0,
      "maintenance_weekly": 4.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Més potència i rang"
    },
    {
      "id": "monitor_adam_a8h",
      "name": "Adam A8H",
      "category": "monitor",
      "tier": "pro",
      "price": 2500.0,
      "maintenance_weekly": 5.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 67.0
      },
      "io": {},
      "notes": "Molt detall i headroom"
    },
    {
      "id": "monitor_pmc_result6",
      "name": "PMC Result6",
      "category": "monitor",
      "tier": "pro",
      "price": 2600.0,
      "maintenance_weekly": 5.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 61.0
      },
      "io": {},
      "notes": "Transmissió lineal, molt natural"
    },
    {
      "id": "monitor_neumann_kh310",
      "name": "Neumann KH310",
      "category": "monitor",
      "tier": "pro",
      "price": 4200.0,
      "maintenance_weekly": 8.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 68.0
      },
      "io": {},
      "notes": "Referència d’estudi gran"
    },
    {
      "id": "monitor_barefoot_footprint01",
      "name": "Barefoot Footprint01",
      "category": "monitor",
      "tier": "pro",
      "price": 5000.0,
      "maintenance_weekly": 10.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 67.0
      },
      "io": {},
      "notes": "Referència moderna"
    },
    {
      "id": "monitor_focal_trio6_st6",
      "name": "Focal Trio6 ST6",
      "category": "monitor",
      "tier": "pro",
      "price": 5000.0,
      "maintenance_weekly": 10.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "monitor_accuracy": 80,
        "bass_extension": 67.0
      },
      "io": {},
      "notes": "Convertible 2/3 vies"
    },
    {
      "id": "monitor_stand_millenium_desktop_monitor_stand",
      "name": "Millenium Desktop Monitor Stand",
      "category": "monitor_stand",
      "tier": "low",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Per monitors petits"
    },
    {
      "id": "monitor_stand_millenium_bs_500",
      "name": "Millenium BS-500",
      "category": "monitor_stand",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Alçada regulable"
    },
    {
      "id": "monitor_stand_isoacoustics_iso_155",
      "name": "IsoAcoustics ISO-155",
      "category": "monitor_stand",
      "tier": "mid",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Redueix vibracions"
    },
    {
      "id": "monitor_stand_k_m_26720",
      "name": "K&M 26720",
      "category": "monitor_stand",
      "tier": "mid",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Molt estable"
    },
    {
      "id": "monitor_stand_isoacoustics_aperta_300",
      "name": "IsoAcoustics Aperta 300",
      "category": "monitor_stand",
      "tier": "pro",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Millora imatge estèreo"
    },
    {
      "id": "multicore_the_sssnake_sm10",
      "name": "the sssnake SM10",
      "category": "multicore",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Per connexions fixes"
    },
    {
      "id": "multicore_behringer_ms8000",
      "name": "Behringer MS8000",
      "category": "multicore",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Amb retorns"
    },
    {
      "id": "multicore_sommer_multicore_stage_8",
      "name": "Sommer Multicore Stage 8",
      "category": "multicore",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Molt robust"
    },
    {
      "id": "multicore_cordial_cyb_multicore_12_4",
      "name": "Cordial CYB Multicore 12/4",
      "category": "multicore",
      "tier": "mid",
      "price": 220.0,
      "maintenance_weekly": 0.44,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Qualitat de cable professional"
    },
    {
      "id": "multicore_cordial_cse_multicore_custom",
      "name": "Cordial CSE Multicore Custom",
      "category": "multicore",
      "tier": "pro",
      "price": 600.0,
      "maintenance_weekly": 1.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Instal·lacions fixes"
    },
    {
      "id": "patchbay_the_sssnake_ppa48",
      "name": "the sssnake PPA48",
      "category": "patchbay",
      "tier": "low",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Molt econòmic"
    },
    {
      "id": "patchbay_behringer_px3000_ultrapatch_pro",
      "name": "Behringer PX3000 Ultrapatch Pro",
      "category": "patchbay",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Normalització completa/mitja/lliure"
    },
    {
      "id": "patchbay_samson_s_patch_plus",
      "name": "Samson S-Patch Plus",
      "category": "patchbay",
      "tier": "low",
      "price": 110.0,
      "maintenance_weekly": 0.22,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "signal_integrity": 55
      },
      "io": {},
      "notes": "Canvi de mode frontal"
    },
    {
      "id": "patchbay_art_p48",
      "name": "ART P48",
      "category": "patchbay",
      "tier": "mid",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Robust i fiable"
    },
    {
      "id": "patchbay_neutrik_nys_spp_l1",
      "name": "Neutrik NYS-SPP-L1",
      "category": "patchbay",
      "tier": "mid",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Qualitat professional"
    },
    {
      "id": "patchbay_samson_s_patch_q",
      "name": "Samson S-Patch Q",
      "category": "patchbay",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "signal_integrity": 65
      },
      "io": {},
      "notes": "Contactes daurats"
    },
    {
      "id": "patchbay_neutrik_nys_spp_l1_2",
      "name": "Neutrik NYS-SPP-L1-2",
      "category": "patchbay",
      "tier": "pro",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Connexions d’alta durabilitat"
    },
    {
      "id": "patchbay_switchcraft_studiopatch_9625",
      "name": "Switchcraft StudioPatch 9625",
      "category": "patchbay",
      "tier": "pro",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "signal_integrity": 75
      },
      "io": {},
      "notes": "Estàndard d’estudi professional"
    },
    {
      "id": "pop_filter_millenium_pf_10",
      "name": "Millenium PF-10",
      "category": "pop_filter",
      "tier": "low",
      "price": 8.0,
      "maintenance_weekly": 0.02,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Solució econòmica"
    },
    {
      "id": "pop_filter_the_t_bone_ms60_pop_filter",
      "name": "the t.bone MS60 Pop Filter",
      "category": "pop_filter",
      "tier": "low",
      "price": 10.0,
      "maintenance_weekly": 0.02,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Redueix plosives en veu"
    },
    {
      "id": "pop_filter_k_m_23956",
      "name": "K&M 23956",
      "category": "pop_filter",
      "tier": "mid",
      "price": 35.0,
      "maintenance_weekly": 0.07,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Braç flexible, molt durador"
    },
    {
      "id": "pop_filter_stedman_proscreen_ps101",
      "name": "Stedman Proscreen PS101",
      "category": "pop_filter",
      "tier": "mid",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "No mata aguts"
    },
    {
      "id": "pop_filter_aston_shield_gn",
      "name": "Aston Shield GN",
      "category": "pop_filter",
      "tier": "pro",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Molt robust, qualitat pro"
    },
    {
      "id": "preamp_the_t_bone_micplug_usb",
      "name": "the t.bone MicPlug USB",
      "category": "preamp",
      "tier": "low",
      "price": 40.0,
      "maintenance_weekly": 0.08,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_behringer_mic100_tube_ultragain",
      "name": "Behringer MIC100 Tube Ultragain",
      "category": "preamp",
      "tier": "low",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_behringer_umc22_previ_integrat",
      "name": "Behringer UMC22 (previ integrat)",
      "category": "preamp",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_m_audio_m_track_solo_previ_integrat",
      "name": "M-Audio M-Track Solo (previ integrat)",
      "category": "preamp",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_art_tube_mp",
      "name": "ART Tube MP",
      "category": "preamp",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_behringer_mic200_tube_ultragain",
      "name": "Behringer MIC200 Tube Ultragain",
      "category": "preamp",
      "tier": "low",
      "price": 65.0,
      "maintenance_weekly": 0.13,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_art_tube_mp_studio_v3",
      "name": "ART Tube MP Studio V3",
      "category": "preamp",
      "tier": "low",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_presonus_tubepre_v2",
      "name": "Presonus TubePre V2",
      "category": "preamp",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_art_usb_dual_pre",
      "name": "ART USB Dual Pre",
      "category": "preamp",
      "tier": "low",
      "price": 140.0,
      "maintenance_weekly": 0.28,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_behringer_ada8200",
      "name": "Behringer ADA8200",
      "category": "preamp",
      "tier": "low",
      "price": 230.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_dbx_286s",
      "name": "DBX 286s",
      "category": "preamp",
      "tier": "mid",
      "price": 230.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor + processador"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_audient_id14_previs_integrats",
      "name": "Audient iD14 (previs integrats)",
      "category": "preamp",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_golden_age_project_pre_73_jr",
      "name": "Golden Age Project Pre-73 Jr",
      "category": "preamp",
      "tier": "mid",
      "price": 360.0,
      "maintenance_weekly": 0.72,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor (Neve style)"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_art_pro_mpa_ii",
      "name": "ART Pro MPA II",
      "category": "preamp",
      "tier": "mid",
      "price": 420.0,
      "maintenance_weekly": 0.84,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Vàlvula"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_focusrite_scarlett_octopre",
      "name": "Focusrite Scarlett OctoPre",
      "category": "preamp",
      "tier": "mid",
      "price": 480.0,
      "maintenance_weekly": 0.96,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_warm_audio_wa12_mkii",
      "name": "Warm Audio WA12 MKII",
      "category": "preamp",
      "tier": "mid",
      "price": 480.0,
      "maintenance_weekly": 0.96,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor (API style)"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_black_lion_audio_auteur",
      "name": "Black Lion Audio Auteur",
      "category": "preamp",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_focusrite_isa_one",
      "name": "Focusrite ISA One",
      "category": "preamp",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_ssl_alpha_channel",
      "name": "SSL Alpha Channel",
      "category": "preamp",
      "tier": "mid",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_presonus_digimax_dp88",
      "name": "Presonus DigiMax DP88",
      "category": "preamp",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 50,
        "gain_db": 60,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_grace_design_m101",
      "name": "Grace Design m101",
      "category": "preamp",
      "tier": "pro",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor ultra net"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_api_512c",
      "name": "API 512c",
      "category": "preamp",
      "tier": "pro",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor (API style)"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_neve_1073spx",
      "name": "Neve 1073SPX",
      "category": "preamp",
      "tier": "pro",
      "price": 1500.0,
      "maintenance_weekly": 3.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor (Class A)"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_rupert_neve_designs_portico_5012",
      "name": "Rupert Neve Designs Portico 5012",
      "category": "preamp",
      "tier": "pro",
      "price": 1700.0,
      "maintenance_weekly": 3.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_focusrite_isa_828",
      "name": "Focusrite ISA 828",
      "category": "preamp",
      "tier": "pro",
      "price": 2300.0,
      "maintenance_weekly": 4.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_universal_audio_4_710d",
      "name": "Universal Audio 4-710d",
      "category": "preamp",
      "tier": "pro",
      "price": 2400.0,
      "maintenance_weekly": 4.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Híbrid vàlvula/transistor"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_avalon_vt_737sp",
      "name": "Avalon VT-737sp",
      "category": "preamp",
      "tier": "pro",
      "price": 2800.0,
      "maintenance_weekly": 5.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Vàlvula + channel strip"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 1
      },
      "io": {
        "inputs_xlr": 1,
        "outputs_line": 1
      },
      "notes": ""
    },
    {
      "id": "preamp_chandler_limited_tg2",
      "name": "Chandler Limited TG2",
      "category": "preamp",
      "tier": "pro",
      "price": 2800.0,
      "maintenance_weekly": 5.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor (Abbey Road style)"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_neve_1073dpx",
      "name": "Neve 1073DPX",
      "category": "preamp",
      "tier": "pro",
      "price": 3200.0,
      "maintenance_weekly": 6.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor (Class A)"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_millennia_hv_3d",
      "name": "Millennia HV-3D",
      "category": "preamp",
      "tier": "pro",
      "price": 4200.0,
      "maintenance_weekly": 8.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "Transistor ultra net"
      ],
      "stats": {
        "preamp_quality": 70,
        "gain_db": 60,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_behringer_ada8000",
      "name": "Behringer ADA8000",
      "category": "preamp_multi",
      "tier": "low",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_behringer_ada8200_ultragain",
      "name": "Behringer ADA8200 Ultragain",
      "category": "preamp_multi",
      "tier": "low",
      "price": 230.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_presonus_digimax_d8",
      "name": "Presonus Digimax D8",
      "category": "preamp_multi",
      "tier": "low",
      "price": 250.0,
      "maintenance_weekly": 0.5,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_behringer_umc1820",
      "name": "Behringer UMC1820",
      "category": "preamp_multi",
      "tier": "low",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR/Jack",
        "USB/ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_mackie_onyx_800r",
      "name": "Mackie Onyx 800R",
      "category": "preamp_multi",
      "tier": "low",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT/Analog"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_tascam_series_8p_dyna",
      "name": "Tascam Series 8p Dyna",
      "category": "preamp_multi",
      "tier": "low",
      "price": 450.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR/Jack",
        "ADAT/USB"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_presonus_studio_1824c_previs_integrats",
      "name": "Presonus Studio 1824c (previs integrats)",
      "category": "preamp_multi",
      "tier": "low",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR/Jack",
        "USB"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_focusrite_scarlett_octopre_dynamic",
      "name": "Focusrite Scarlett OctoPre Dynamic",
      "category": "preamp_multi",
      "tier": "low",
      "price": 520.0,
      "maintenance_weekly": 1.04,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_art_tubeopto_8",
      "name": "ART TubeOpto 8",
      "category": "preamp_multi",
      "tier": "low",
      "price": 550.0,
      "maintenance_weekly": 1.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_zoom_f8n_previs_integrats",
      "name": "Zoom F8n (previs integrats)",
      "category": "preamp_multi",
      "tier": "low",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [
        "XLR",
        "Digital"
      ],
      "stats": {
        "preamp_quality": 35,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_art_pro_mpa_ii_2_canals",
      "name": "ART Pro MPA II (2 canals)",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 420.0,
      "maintenance_weekly": 0.84,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR/Jack",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_presonus_digimax_dp88",
      "name": "Presonus DigiMax DP88",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 700.0,
      "maintenance_weekly": 1.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "ADAT/Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_audient_asp800",
      "name": "Audient ASP800",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "ADAT"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_focusrite_clarett_octopre",
      "name": "Focusrite Clarett+ OctoPre",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "ADAT/Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_golden_age_project_pre_573_500_rack_x2",
      "name": "Golden Age Project Pre-573 (500 rack x2)",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_rme_quadmic_ii",
      "name": "RME QuadMic II",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 900.0,
      "maintenance_weekly": 1.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_audient_asp880",
      "name": "Audient ASP880",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 950.0,
      "maintenance_weekly": 1.9,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "ADAT/Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_motu_8pre_es_previs_integrats",
      "name": "MOTU 8pre-es (previs integrats)",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 1100.0,
      "maintenance_weekly": 2.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR/Jack",
        "Thunderbolt/USB/AVB"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_warm_audio_wa412",
      "name": "Warm Audio WA412",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 1300.0,
      "maintenance_weekly": 2.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_ssl_xlogic_alpha_vhd_pre",
      "name": "SSL XLogic Alpha VHD Pre",
      "category": "preamp_multi",
      "tier": "mid",
      "price": 1400.0,
      "maintenance_weekly": 2.8,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 53,
        "gain_db": 55,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_focusrite_isa_828_mkii",
      "name": "Focusrite ISA 828 MkII",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 2300.0,
      "maintenance_weekly": 4.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog/ADAT opcional"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8,
        "adat_out": true
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_chandler_limited_tg_microphone_cassette_x2",
      "name": "Chandler Limited TG Microphone Cassette x2",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 2400.0,
      "maintenance_weekly": 4.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_rupert_neve_designs_5088_shelford_5057_x2",
      "name": "Rupert Neve Designs 5088 Shelford 5057 x2",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 2500.0,
      "maintenance_weekly": 5.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 2
      },
      "io": {
        "inputs_xlr": 2,
        "outputs_line": 2
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_daking_mic_pre_iv",
      "name": "Daking Mic Pre IV",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 2800.0,
      "maintenance_weekly": 5.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_ssl_puredrive_quad",
      "name": "SSL PureDrive Quad",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 3000.0,
      "maintenance_weekly": 6.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog/Digital"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_api_3124v",
      "name": "API 3124V",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 3200.0,
      "maintenance_weekly": 6.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 4
      },
      "io": {
        "inputs_xlr": 4,
        "outputs_line": 4
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_grace_design_m108",
      "name": "Grace Design m108",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 3500.0,
      "maintenance_weekly": 7.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog/Digital"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_millennia_hv_3d",
      "name": "Millennia HV-3D",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 4200.0,
      "maintenance_weekly": 8.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_neve_1073opx",
      "name": "Neve 1073OPX",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 4500.0,
      "maintenance_weekly": 9.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR",
        "Analog/Digital"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "preamp_multi_focusrite_red_8pre_previs_integrats",
      "name": "Focusrite Red 8Pre (previs integrats)",
      "category": "preamp_multi",
      "tier": "pro",
      "price": 5000.0,
      "maintenance_weekly": 10.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [
        "XLR/Jack",
        "Thunderbolt/Pro Tools"
      ],
      "stats": {
        "preamp_quality": 73,
        "gain_db": 63,
        "channels": 8
      },
      "io": {
        "inputs_xlr": 8,
        "outputs_line": 8
      },
      "notes": ""
    },
    {
      "id": "rack_millenium_steel_box_4u",
      "name": "Millenium Steel Box 4U",
      "category": "rack",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Per transportar outboard"
    },
    {
      "id": "rack_millenium_sr_2012",
      "name": "Millenium SR-2012",
      "category": "rack",
      "tier": "low",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 1
      },
      "io": {},
      "notes": "Rack metàl·lic bàsic"
    },
    {
      "id": "rack_thon_studio_rack_12u",
      "name": "Thon Studio Rack 12U",
      "category": "rack",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Més estable i estètic"
    },
    {
      "id": "rack_zaor_onda_angled_rack_10u",
      "name": "Zaor Onda Angled Rack 10U",
      "category": "rack",
      "tier": "mid",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Ideal per patchbays"
    },
    {
      "id": "rack_argosy_spire_rack",
      "name": "Argosy Spire Rack",
      "category": "rack",
      "tier": "pro",
      "price": 1200.0,
      "maintenance_weekly": 2.4,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "comfort_bonus": 0,
        "space_bonus": 2
      },
      "io": {},
      "notes": "Integració amb taules Argosy"
    },
    {
      "id": "shock_mount_the_t_bone_ssm_5",
      "name": "the t.bone SSM-5",
      "category": "shock_mount",
      "tier": "low",
      "price": 15.0,
      "maintenance_weekly": 0.03,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 1
      },
      "io": {},
      "notes": "Compatible amb molts micros"
    },
    {
      "id": "shock_mount_audio_technica_at8449",
      "name": "Audio-Technica AT8449",
      "category": "shock_mount",
      "tier": "mid",
      "price": 45.0,
      "maintenance_weekly": 0.09,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Per sèrie AT2020/2035"
    },
    {
      "id": "shock_mount_rode_sm6",
      "name": "Rode SM6",
      "category": "shock_mount",
      "tier": "mid",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 2
      },
      "io": {},
      "notes": "Per micros Rode grans"
    },
    {
      "id": "shock_mount_rycote_invision_usm",
      "name": "Rycote InVision USM",
      "category": "shock_mount",
      "tier": "pro",
      "price": 75.0,
      "maintenance_weekly": 0.15,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Aïllament excel·lent"
    },
    {
      "id": "shock_mount_neumann_ea_87",
      "name": "Neumann EA 87",
      "category": "shock_mount",
      "tier": "pro",
      "price": 250.0,
      "maintenance_weekly": 0.5,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "setup_speed_bonus": 3
      },
      "io": {},
      "notes": "Per micros Neumann U87"
    },
    {
      "id": "software_daw_ardour",
      "name": "Ardour",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Multipista seriós, molt bé en Linux"
    },
    {
      "id": "software_daw_audacity",
      "name": "Audacity",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Edició i gravació bàsica, molt popular"
    },
    {
      "id": "software_daw_cakewalk_by_bandlab",
      "name": "Cakewalk by BandLab",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "DAW complet gratuït per Windows"
    },
    {
      "id": "software_daw_davinci_resolve_fairlight",
      "name": "DaVinci Resolve Fairlight",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Fairlight integrat a Resolve (ed. gratuïta)"
    },
    {
      "id": "software_daw_garageband",
      "name": "GarageBand",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Ideal per començar en Mac"
    },
    {
      "id": "software_daw_lmms",
      "name": "LMMS",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Producció musical; menys orientat a gravació multipista real"
    },
    {
      "id": "software_daw_ocenaudio",
      "name": "Ocenaudio",
      "category": "software_daw",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "workflow": 50
      },
      "io": {},
      "notes": "Editor lleuger per gravació/edició ràpida"
    },
    {
      "id": "software_daw_reaper",
      "name": "REAPER",
      "category": "software_daw",
      "tier": "mid",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Molt potent i lleuger; gran comunitat"
    },
    {
      "id": "software_daw_harrison_mixbus",
      "name": "Harrison Mixbus",
      "category": "software_daw",
      "tier": "mid",
      "price": 90.0,
      "maintenance_weekly": 0.18,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Versió més econòmica, bon so"
    },
    {
      "id": "software_daw_fl_studio_producer_edition",
      "name": "FL Studio Producer Edition",
      "category": "software_daw",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Molt popular per beats i música urbana"
    },
    {
      "id": "software_daw_reason_subscripci",
      "name": "Reason+ (subscripció)",
      "category": "software_daw",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Model subscription amb contingut extra"
    },
    {
      "id": "software_daw_logic_pro",
      "name": "Logic Pro",
      "category": "software_daw",
      "tier": "mid",
      "price": 230.0,
      "maintenance_weekly": 0.46,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Molt complet per gravació i producció"
    },
    {
      "id": "software_daw_adobe_audition",
      "name": "Adobe Audition",
      "category": "software_daw",
      "tier": "mid",
      "price": 240.0,
      "maintenance_weekly": 0.48,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Edició d’àudio i post; integració Adobe"
    },
    {
      "id": "software_daw_avid_media_composer_audio_post",
      "name": "Avid Media Composer (Audio post)",
      "category": "software_daw",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Edició vídeo amb fluxos d’àudio (no és DAW pur)"
    },
    {
      "id": "software_daw_fl_studio_signature_bundle",
      "name": "FL Studio Signature Bundle",
      "category": "software_daw",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Més plugins i instruments"
    },
    {
      "id": "software_daw_pro_tools_studio",
      "name": "Pro Tools Studio",
      "category": "software_daw",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Estàndard d’estudi per edició i gravació"
    },
    {
      "id": "software_daw_sound_forge_pro",
      "name": "Sound Forge Pro",
      "category": "software_daw",
      "tier": "mid",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "workflow": 55
      },
      "io": {},
      "notes": "Editor clàssic de mastering/edició"
    },
    {
      "id": "software_daw_final_cut_pro_udio_b_sic",
      "name": "Final Cut Pro (àudio bàsic)",
      "category": "software_daw",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Eines d’àudio dins l’edició de vídeo"
    },
    {
      "id": "software_daw_bitwig_studio",
      "name": "Bitwig Studio",
      "category": "software_daw",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Modular, excel·lent per creativitat"
    },
    {
      "id": "software_daw_harrison_mixbus_32c",
      "name": "Harrison Mixbus 32C",
      "category": "software_daw",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "So ‘console-style’, orientat a mix"
    },
    {
      "id": "software_daw_magix_samplitude_pro_x",
      "name": "MAGIX Samplitude Pro X",
      "category": "software_daw",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Molt fort en edició i mastering"
    },
    {
      "id": "software_daw_studio_one_professional",
      "name": "Studio One Professional",
      "category": "software_daw",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Workflow ràpid, molt bo per gravar i mesclar"
    },
    {
      "id": "software_daw_izotope_rx_standard",
      "name": "iZotope RX (Standard)",
      "category": "software_daw",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Restauració/neteja d’àudio (complement)"
    },
    {
      "id": "software_daw_reason_13",
      "name": "Reason 13",
      "category": "software_daw",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Rack virtual, molt característic"
    },
    {
      "id": "software_daw_steinberg_wavelab_pro",
      "name": "Steinberg WaveLab Pro",
      "category": "software_daw",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Mastering i edició (no multipista pur)"
    },
    {
      "id": "software_daw_steinberg_cubase_pro",
      "name": "Steinberg Cubase Pro",
      "category": "software_daw",
      "tier": "pro",
      "price": 580.0,
      "maintenance_weekly": 1.16,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Molt fort en MIDI i producció"
    },
    {
      "id": "software_daw_ableton_live_suite",
      "name": "Ableton Live Suite",
      "category": "software_daw",
      "tier": "pro",
      "price": 750.0,
      "maintenance_weekly": 1.5,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Producció i directe; molt creatiu"
    },
    {
      "id": "software_daw_pro_tools_ultimate",
      "name": "Pro Tools Ultimate",
      "category": "software_daw",
      "tier": "pro",
      "price": 800.0,
      "maintenance_weekly": 1.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Gama alta per post i estudis grans (subscr.)"
    },
    {
      "id": "software_daw_steinberg_nuendo",
      "name": "Steinberg Nuendo",
      "category": "software_daw",
      "tier": "pro",
      "price": 1000.0,
      "maintenance_weekly": 2.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Orientat a postproducció i àudio per vídeo"
    },
    {
      "id": "software_daw_magix_sequoia",
      "name": "MAGIX Sequoia",
      "category": "software_daw",
      "tier": "pro",
      "price": 3000.0,
      "maintenance_weekly": 6.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "workflow": 65
      },
      "io": {},
      "notes": "Broadcast/mastering d’alta gamma"
    },
    {
      "id": "software_fx_valhalla_delay",
      "name": "Valhalla Delay",
      "category": "software_fx",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Delay versàtil"
    },
    {
      "id": "software_fx_valhalla_room",
      "name": "Valhalla Room",
      "category": "software_fx",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Reverb clàssica"
    },
    {
      "id": "software_fx_waves_h_delay",
      "name": "Waves H-Delay",
      "category": "software_fx",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Delay clàssic"
    },
    {
      "id": "software_fx_baby_audio_comeback_kid",
      "name": "Baby Audio Comeback Kid",
      "category": "software_fx",
      "tier": "low",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Delay creatiu"
    },
    {
      "id": "software_fx_baby_audio_crystalline",
      "name": "Baby Audio Crystalline",
      "category": "software_fx",
      "tier": "low",
      "price": 80.0,
      "maintenance_weekly": 0.16,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Reverb moderna"
    },
    {
      "id": "software_fx_cableguys_shaperbox",
      "name": "Cableguys ShaperBox",
      "category": "software_fx",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Sidechain i efectes rítmics"
    },
    {
      "id": "software_fx_izotope_trash_2",
      "name": "Izotope Trash 2",
      "category": "software_fx",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Distorsió creativa"
    },
    {
      "id": "software_fx_little_alterboy",
      "name": "Little AlterBoy",
      "category": "software_fx",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Canvi de veu creatiu"
    },
    {
      "id": "software_fx_rc_20_retro_color",
      "name": "RC-20 Retro Color",
      "category": "software_fx",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Efecte lo-fi i textura"
    },
    {
      "id": "software_fx_waves_r_verb",
      "name": "Waves R-Verb",
      "category": "software_fx",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Reverb digital clàssica"
    },
    {
      "id": "software_fx_fabfilter_pro_c_2",
      "name": "FabFilter Pro-C 2",
      "category": "software_fx",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Compressor molt flexible"
    },
    {
      "id": "software_fx_fabfilter_pro_r",
      "name": "FabFilter Pro-R",
      "category": "software_fx",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Reverb musical"
    },
    {
      "id": "software_fx_oxford_inflator",
      "name": "Oxford Inflator",
      "category": "software_fx",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Augment percepció volum"
    },
    {
      "id": "software_fx_decapitator",
      "name": "Decapitator",
      "category": "software_fx",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Distorsió analògica"
    },
    {
      "id": "software_fx_echoboy",
      "name": "EchoBoy",
      "category": "software_fx",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Delay professional"
    },
    {
      "id": "software_fx_gullfoss",
      "name": "Gullfoss",
      "category": "software_fx",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Correcció tonal automàtica"
    },
    {
      "id": "software_fx_soothe2",
      "name": "Soothe2",
      "category": "software_fx",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Reducció ressonàncies automàtica"
    },
    {
      "id": "software_fx_uadx_1176_collection",
      "name": "UADx 1176 Collection",
      "category": "software_fx",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Compressors FET clàssics"
    },
    {
      "id": "software_fx_eventide_h3000_factory",
      "name": "Eventide H3000 Factory",
      "category": "software_fx",
      "tier": "pro",
      "price": 350.0,
      "maintenance_weekly": 0.7,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Pitch i efectes clàssics"
    },
    {
      "id": "software_fx_soundtoys_5",
      "name": "Soundtoys 5",
      "category": "software_fx",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Delay, saturació, mod"
    },
    {
      "id": "software_mix_master_valhalla_vintageverb",
      "name": "Valhalla VintageVerb",
      "category": "software_mix_master",
      "tier": "low",
      "price": 50.0,
      "maintenance_weekly": 0.1,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "Reverb molt popular"
    },
    {
      "id": "software_mix_master_tokyo_dawn_labs_slickeq_ge",
      "name": "Tokyo Dawn Labs SlickEQ GE",
      "category": "software_mix_master",
      "tier": "low",
      "price": 60.0,
      "maintenance_weekly": 0.12,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "mix_bonus": 2
      },
      "io": {},
      "notes": "EQ musical"
    },
    {
      "id": "software_mix_master_brainworx_bx_masterdesk",
      "name": "Brainworx bx_masterdesk",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 100.0,
      "maintenance_weekly": 0.2,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Mastering ràpid i musical"
    },
    {
      "id": "software_mix_master_waves_ssl_g_master_buss_comp",
      "name": "Waves SSL G-Master Buss Comp",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Bus compressor estil SSL"
    },
    {
      "id": "software_mix_master_sonible_smart_eq_3",
      "name": "Sonible smart:EQ 3",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 130.0,
      "maintenance_weekly": 0.26,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "EQ automàtic"
    },
    {
      "id": "software_mix_master_sonible_smart_comp_2",
      "name": "Sonible smart:comp 2",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 130.0,
      "maintenance_weekly": 0.26,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Compressor amb IA"
    },
    {
      "id": "software_mix_master_acustica_audio_sand",
      "name": "Acustica Audio Sand",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Emulació consola SSL"
    },
    {
      "id": "software_mix_master_slate_digital_virtual_mix_rack",
      "name": "Slate Digital Virtual Mix Rack",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Rack modular de processament"
    },
    {
      "id": "software_mix_master_uadx_studer_a800",
      "name": "UADx Studer A800",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Emulació de cinta"
    },
    {
      "id": "software_mix_master_fabfilter_pro_l_2",
      "name": "FabFilter Pro-L 2",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Limiter de mastering molt transparent"
    },
    {
      "id": "software_mix_master_fabfilter_pro_q_3",
      "name": "FabFilter Pro-Q 3",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "EQ paramètric professional"
    },
    {
      "id": "software_mix_master_dmg_audio_limitless",
      "name": "DMG Audio Limitless",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Limiter multibanda"
    },
    {
      "id": "software_mix_master_eventide_blackhole",
      "name": "Eventide Blackhole",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Reverbs espacials"
    },
    {
      "id": "software_mix_master_waves_gold_bundle",
      "name": "Waves Gold Bundle",
      "category": "software_mix_master",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "mix_bonus": 4
      },
      "io": {},
      "notes": "Pack clàssic d’efectes"
    },
    {
      "id": "software_mix_master_plugin_alliance_mastering_bundle",
      "name": "Plugin Alliance Mastering Bundle",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Eines de mastering professionals"
    },
    {
      "id": "software_mix_master_uadx_la_2a_collection",
      "name": "UADx LA-2A Collection",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 300.0,
      "maintenance_weekly": 0.6,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Compressors òptics clàssics"
    },
    {
      "id": "software_mix_master_t_racks_5_max",
      "name": "T-Racks 5 Max",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Mastering i processament"
    },
    {
      "id": "software_mix_master_izotope_neutron_advanced",
      "name": "iZotope Neutron Advanced",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Assistent de mix amb EQ i comp intel·ligent"
    },
    {
      "id": "software_mix_master_izotope_ozone_advanced",
      "name": "iZotope Ozone Advanced",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Suite completa de mastering"
    },
    {
      "id": "software_mix_master_softube_weiss_ds1_mk3",
      "name": "Softube Weiss DS1-MK3",
      "category": "software_mix_master",
      "tier": "pro",
      "price": 600.0,
      "maintenance_weekly": 1.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "mix_bonus": 7
      },
      "io": {},
      "notes": "Processador mastering premium"
    },
    {
      "id": "software_vst_spitfire_bbc_symphony_discover",
      "name": "Spitfire BBC Symphony Discover",
      "category": "software_vst",
      "tier": "low",
      "price": 0.0,
      "maintenance_weekly": 0.0,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "production_bonus": 2
      },
      "io": {},
      "notes": "Orquestra gratuïta"
    },
    {
      "id": "software_vst_ample_sound_guitar",
      "name": "Ample Sound Guitar",
      "category": "software_vst",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "production_bonus": 2
      },
      "io": {},
      "notes": "Guitarres realistes"
    },
    {
      "id": "software_vst_output_arcade",
      "name": "Output Arcade",
      "category": "software_vst",
      "tier": "low",
      "price": 120.0,
      "maintenance_weekly": 0.24,
      "reliability": 0.9,
      "unlock_level": 1,
      "tags": [],
      "stats": {
        "production_bonus": 2
      },
      "io": {},
      "notes": "Loops i textures"
    },
    {
      "id": "software_vst_native_instruments_fm8",
      "name": "Native Instruments FM8",
      "category": "software_vst",
      "tier": "mid",
      "price": 150.0,
      "maintenance_weekly": 0.3,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Sintesi FM"
    },
    {
      "id": "software_vst_addictive_drums_2",
      "name": "Addictive Drums 2",
      "category": "software_vst",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Bateries realistes"
    },
    {
      "id": "software_vst_ezdrummer_3",
      "name": "EZdrummer 3",
      "category": "software_vst",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Bateria fàcil d’usar"
    },
    {
      "id": "software_vst_u_he_diva",
      "name": "U-He Diva",
      "category": "software_vst",
      "tier": "mid",
      "price": 180.0,
      "maintenance_weekly": 0.36,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Emulació analògica top"
    },
    {
      "id": "software_vst_serum",
      "name": "Serum",
      "category": "software_vst",
      "tier": "mid",
      "price": 190.0,
      "maintenance_weekly": 0.38,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "EDM i disseny sonor"
    },
    {
      "id": "software_vst_arturia_analog_lab",
      "name": "Arturia Analog Lab",
      "category": "software_vst",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Sons ràpids de sintetitzadors"
    },
    {
      "id": "software_vst_arturia_pigments",
      "name": "Arturia Pigments",
      "category": "software_vst",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Sintesi híbrida"
    },
    {
      "id": "software_vst_native_instruments_massive_x",
      "name": "Native Instruments Massive X",
      "category": "software_vst",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Sintesi moderna"
    },
    {
      "id": "software_vst_u_he_zebra_2",
      "name": "U-He Zebra 2",
      "category": "software_vst",
      "tier": "mid",
      "price": 200.0,
      "maintenance_weekly": 0.4,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Molt flexible"
    },
    {
      "id": "software_vst_pianoteq",
      "name": "Pianoteq",
      "category": "software_vst",
      "tier": "mid",
      "price": 250.0,
      "maintenance_weekly": 0.5,
      "reliability": 0.95,
      "unlock_level": 3,
      "tags": [],
      "stats": {
        "production_bonus": 4
      },
      "io": {},
      "notes": "Modelatge físic de piano"
    },
    {
      "id": "software_vst_keyscape",
      "name": "Keyscape",
      "category": "software_vst",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Teclats realistes"
    },
    {
      "id": "software_vst_native_instruments_kontakt",
      "name": "Native Instruments Kontakt",
      "category": "software_vst",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Base per llibreries"
    },
    {
      "id": "software_vst_superior_drummer_3",
      "name": "Superior Drummer 3",
      "category": "software_vst",
      "tier": "pro",
      "price": 400.0,
      "maintenance_weekly": 0.8,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Bateria ultra detallada"
    },
    {
      "id": "software_vst_spitfire_albion_one",
      "name": "Spitfire Albion One",
      "category": "software_vst",
      "tier": "pro",
      "price": 450.0,
      "maintenance_weekly": 0.9,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Orquestra cinematogràfica"
    },
    {
      "id": "software_vst_eastwest_hollywood_orchestra",
      "name": "EastWest Hollywood Orchestra",
      "category": "software_vst",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Orquestra professional"
    },
    {
      "id": "software_vst_spectrasonics_omnisphere",
      "name": "Spectrasonics Omnisphere",
      "category": "software_vst",
      "tier": "pro",
      "price": 500.0,
      "maintenance_weekly": 1.0,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Molt potent i versàtil"
    },
    {
      "id": "software_vst_arturia_v_collection",
      "name": "Arturia V Collection",
      "category": "software_vst",
      "tier": "pro",
      "price": 600.0,
      "maintenance_weekly": 1.2,
      "reliability": 0.97,
      "unlock_level": 6,
      "tags": [],
      "stats": {
        "production_bonus": 7
      },
      "io": {},
      "notes": "Sintetitzadors clàssics"
    }
  ],
  "rooms": [
    {
      "id": "room_control_1",
      "name": "Control Room (Petit)",
      "type": "control_room",
      "unlock_level": 1,
      "size_m2": 14,
      "max_people": 2,
      "noise_floor_db": -65,
      "isolation": 45,
      "base_acoustic": 45,
      "slots": {
        "monitor": 2,
        "interface": 1,
        "console_analog": 1,
        "console_digital": 1,
        "headphones": 2,
        "headphone_amp": 1,
        "desk": 1,
        "rack": 1,
        "acoustic_treatment": 6,
        "patchbay": 1,
        "cable": 10,
        "mic": 2,
        "preamp": 2,
        "mic_stand": 2,
        "mic_accessory": 2
      }
    },
    {
      "id": "room_vocal_1",
      "name": "Cabina Vocal",
      "type": "vocal_booth",
      "unlock_level": 2,
      "size_m2": 6,
      "max_people": 1,
      "noise_floor_db": -60,
      "isolation": 55,
      "base_acoustic": 50,
      "slots": {
        "mic": 1,
        "preamp": 1,
        "interface": 1,
        "headphones": 1,
        "headphone_amp": 1,
        "pop_filter": 1,
        "shock_mount": 1,
        "mic_stand": 1,
        "acoustic_treatment": 8,
        "cable": 6
      }
    },
    {
      "id": "room_live_1",
      "name": "Live Room (Mitjà)",
      "type": "live_room",
      "unlock_level": 3,
      "size_m2": 28,
      "max_people": 6,
      "noise_floor_db": -55,
      "isolation": 40,
      "base_acoustic": 40,
      "slots": {
        "mic": 12,
        "preamp_multi": 1,
        "interface": 1,
        "headphones": 6,
        "headphone_amp": 1,
        "mic_stand": 10,
        "mic_accessory": 6,
        "acoustic_treatment": 10,
        "patchbay": 1,
        "cable": 20,
        "multicore": 1
      }
    },
    {
      "id": "room_control_2",
      "name": "Control Room (Gran)",
      "type": "control_room",
      "unlock_level": 5,
      "size_m2": 25,
      "max_people": 4,
      "noise_floor_db": -70,
      "isolation": 50,
      "base_acoustic": 55,
      "slots": {
        "monitor": 4,
        "interface": 2,
        "console_analog": 1,
        "console_digital": 1,
        "headphones": 4,
        "headphone_amp": 2,
        "desk": 1,
        "rack": 2,
        "acoustic_treatment": 10,
        "patchbay": 1,
        "cable": 15
      }
    },
    {
      "id": "room_live_2",
      "name": "Live Room (Gran)",
      "type": "live_room",
      "unlock_level": 6,
      "size_m2": 40,
      "max_people": 10,
      "noise_floor_db": -60,
      "isolation": 45,
      "base_acoustic": 50,
      "slots": {
        "mic": 16,
        "preamp_multi": 2,
        "interface": 2,
        "headphones": 8,
        "headphone_amp": 2,
        "mic_stand": 14,
        "mic_accessory": 8,
        "acoustic_treatment": 12,
        "patchbay": 1,
        "cable": 30,
        "multicore": 1
      }
    }
  ],
  "contracts": [
    {
      "id": "contract_rap_vocal_basic",
      "name": "Sessió Rap (Vocal)",
      "type": "recording",
      "genre": "rap",
      "duration_hours": 2,
      "base_pay": 220,
      "target_quality": 55,
      "requirements": {
        "room_type": "vocal_booth",
        "min_interface_inputs": 1,
        "min_items": {
          "mic": 1,
          "preamp": 1,
          "headphones": 1
        }
      },
      "reputation_gain": {
        "success": 3,
        "fail": 1
      }
    },
    {
      "id": "contract_podcast_duo",
      "name": "Podcast 2 veus",
      "type": "recording",
      "genre": "podcast",
      "duration_hours": 2,
      "base_pay": 180,
      "target_quality": 50,
      "requirements": {
        "room_type": "control_room",
        "min_interface_inputs": 2,
        "min_items": {
          "mic": 2,
          "headphones": 2,
          "headphone_amp": 1
        }
      },
      "reputation_gain": {
        "success": 2,
        "fail": 1
      }
    },
    {
      "id": "contract_rock_band_tracking",
      "name": "Rock Band (Tracking)",
      "type": "recording",
      "genre": "rock",
      "duration_hours": 6,
      "base_pay": 650,
      "target_quality": 65,
      "requirements": {
        "room_type": "live_room",
        "min_interface_inputs": 8,
        "min_items": {
          "mic": 8,
          "preamp_multi": 1,
          "headphones": 4
        }
      },
      "reputation_gain": {
        "success": 6,
        "fail": 2
      }
    },
    {
      "id": "contract_mix_single",
      "name": "Mescla 1 tema",
      "type": "mix",
      "genre": "any",
      "duration_hours": 4,
      "base_pay": 300,
      "target_quality": 60,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2
        }
      },
      "reputation_gain": {
        "success": 3,
        "fail": 1
      }
    },
    {
      "id": "contract_master_single",
      "name": "Mastering 1 tema",
      "type": "master",
      "genre": "any",
      "duration_hours": 2,
      "base_pay": 200,
      "target_quality": 62,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2,
          "acoustic_treatment": 4
        }
      },
      "reputation_gain": {
        "success": 3,
        "fail": 1
      }
    },
    {
      "id": "contract_production_beat",
      "name": "Producció Beat",
      "type": "production",
      "genre": "hiphop",
      "duration_hours": 5,
      "base_pay": 400,
      "target_quality": 65,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2,
          "interface": 1
        }
      },
      "reputation_gain": {
        "success": 4,
        "fail": 1
      }
    },
    {
      "id": "contract_production_full_track",
      "name": "Producció Tema Complet",
      "type": "production",
      "genre": "pop",
      "duration_hours": 10,
      "base_pay": 900,
      "target_quality": 70,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2,
          "interface": 1
        }
      },
      "reputation_gain": {
        "success": 5,
        "fail": 2
      }
    },
    {
      "id": "contract_album_mix_master",
      "name": "Mix i Master d’Àlbum",
      "type": "mix_master",
      "genre": "any",
      "duration_hours": 30,
      "base_pay": 2500,
      "target_quality": 80,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2,
          "acoustic_treatment": 6
        }
      },
      "reputation_gain": {
        "success": 10,
        "fail": 4
      }
    },
    {
      "id": "contract_film_score_production",
      "name": "Producció Banda Sonora",
      "type": "production",
      "genre": "film_score",
      "duration_hours": 40,
      "base_pay": 4000,
      "target_quality": 85,
      "requirements": {
        "room_type": "control_room",
        "min_items": {
          "monitor": 2,
          "interface": 1
        }
      },
      "reputation_gain": {
        "success": 12,
        "fail": 5
      }
    },
    {
      "id": "contract_live_recording_event",
      "name": "Gravació en Directe d’Event",
      "type": "recording",
      "genre": "live",
      "duration_hours": 20,
      "base_pay": 3000,
      "target_quality": 80,
      "requirements": {
        "room_type": "live_room",
        "min_interface_inputs": 16,
        "min_items": {
          "mic": 12,
          "preamp_multi": 1,
          "headphones": 6
        }
      },
      "reputation_gain": {
        "success": 10,
        "fail": 4
      }
    }


  ]
};
// Campaign system for Recording Studio Tycoon
// Story mode with chapters, objectives, and progression

export const CAMPAIGN_CHAPTERS = [
  {
    id: 0,
    title: "Els Inicis",
    description: "Comença el teu viatge com a productor casolà",
    requirements: { level: 1 },
    objectives: [
      {
        id: "first_session",
        title: "Primera sessió",
        description: "Completa el teu primer contracte d'enregistrament",
        type: "contract_complete",
        target: 1,
        reward: { xp: 100, cash: 500 },
        unlocks: ["tutorial_complete"]
      },
      {
        id: "earn_1000",
        title: "Primer èxit financer",
        description: "Guanya €1000 en ingressos totals",
        type: "revenue_total",
        target: 1000,
        reward: { xp: 150, cash: 200 },
        unlocks: ["basic_equipment"]
      },
      {
        id: "level_3",
        title: "Aprenent",
        description: "Arriba al nivell 3",
        type: "level",
        target: 3,
        reward: { xp: 200, cash: 500 },
        unlocks: ["new_clients"]
      }
    ]
  },
  {
    id: 1,
    title: "Estudi Local",
    description: "Fes-te un nom a l'escena musical local",
    requirements: { level: 3 },
    objectives: [
      {
        id: "vocal_booth",
        title: "Cabina de veu",
        description: "Construeix una cabina de veu professional",
        type: "room_built",
        target: "vocal_booth",
        reward: { xp: 300, cash: 1000 },
        unlocks: ["vocal_clients"]
      },
      {
        id: "reputation_20",
        title: "Reputació local",
        description: "Aconsegueix 20 punts de reputació general",
        type: "reputation",
        target: 20,
        reward: { xp: 250, cash: 750 },
        unlocks: ["special_offers"]
      },
      {
        id: "5_contracts",
        title: "Experiència",
        description: "Completa 5 contractes amb èxit",
        type: "contract_complete",
        target: 5,
        reward: { xp: 400, cash: 1500 },
        unlocks: ["production_room"]
      }
    ]
  },
  {
    id: 2,
    title: "Profesional",
    description: "Treballa amb discogràfiques independents",
    requirements: { level: 5 },
    objectives: [
      {
        id: "control_room",
        title: "Sala de control",
        description: "Construeix una sala de control professional",
        type: "room_built",
        target: "control_room",
        reward: { xp: 500, cash: 2000 },
        unlocks: ["major_labels"]
      },
      {
        id: "quality_80",
        title: "Qualitat excepcional",
        description: "Completa un contracte amb 80% de qualitat o superior",
        type: "quality_single",
        target: 80,
        reward: { xp: 600, cash: 3000 },
        unlocks: ["premium_clients"]
      },
      {
        id: "genre_master",
        title: "Especialista",
        description: "Aconsegueix 30 de reputació en qualsevol gènere",
        type: "genre_reputation",
        target: 30,
        reward: { xp: 450, cash: 2500 },
        unlocks: ["genre_bonuses"]
      }
    ]
  },
  {
    id: 3,
    title: "Llegendari",
    description: "Converteix-te en una referència mundial",
    requirements: { level: 8 },
    objectives: [
      {
        id: "mastering_suite",
        title: "Suite de mastering",
        description: "Construeix una suite de mastering",
        type: "room_built",
        target: "mastering_suite",
        reward: { xp: 800, cash: 5000 },
        unlocks: ["international_clients"]
      },
      {
        id: "reputation_50",
        title: "Renom mundial",
        description: "Aconsegueix 50 de reputació general",
        type: "reputation",
        target: 50,
        reward: { xp: 1000, cash: 10000 },
        unlocks: ["platinum_albums"]
      },
      {
        id: "10_special_contracts",
        title: "Especialista en casos especials",
        description: "Completa 10 contractes especials",
        type: "special_contract_complete",
        target: 10,
        reward: { xp: 1200, cash: 15000 },
        unlocks: ["hall_of_fame"]
      }
    ]
  }
];

export async function initializeCampaign() {
  const { state } = await import('./state.js');
  
  state.campaign = {
    active: true,
    currentChapter: 0,
    currentObjective: 0,
    completedObjectives: [],
    unlockedFeatures: [],
    storylineProgress: {},
    milestones: [],
    achievements: []
  };
  
  return CAMPAIGN_CHAPTERS[0];
}

export async function getCurrentObjective() {
  const { state } = await import('./state.js');
  
  if (!state.campaign.active) return null;
  
  const chapter = CAMPAIGN_CHAPTERS[state.campaign.currentChapter];
  if (!chapter) return null;
  
  const objective = chapter.objectives[state.campaign.currentObjective];
  // console.log('📋 getCurrentObjective returning:', objective);
  return objective;
}

export async function checkObjectiveProgress(type, currentValue, targetValue = null) {
  const { state } = await import('./state.js');
  
   //   console.log('🎯 checkObjectiveProgress called:', { type, currentValue, targetValue, campaignActive: state.campaign?.active });
  
  if (!state.campaign.active) return false;
  
  const objective = await getCurrentObjective();
  // console.log('📋 Current objective:', objective);
  
  if (!objective || objective.type !== type) {
      // console.log('❌ No matching objective found for type:', type);
    return false;
  }
  
  const target = targetValue || objective.target;
  let completed = false;
  
  // Special handling for room_built objectives
  if (type === 'room_built' && targetValue) {
    completed = targetValue === objective.target;
    // console.log('🏠 Room built check:', 
    //   { 
    //   builtRoomType: targetValue, 
    //   requiredRoomType: objective.target, 
    //   completed 
    // });
  } else {
    completed = currentValue >= target;
    // console.log('🎯 Standard check:', { 
    //   currentValue, 
    //   target, 
    //   type, 
    //   objectiveId: objective.id,
    //   completed: completed,
    //   completedEnough: `${currentValue} >= ${target} = ${completed}`
    // });
  }
  
  if (completed) {
    // console.log('✅ Objective completed!');
    await completeObjective(objective.id);
    // Update UI immediately after completing objective
    try {
      if (typeof window !== 'undefined' && window.updateCampaignUI) {
        window.updateCampaignUI();
      }
    } catch (e) {}
    return true;
  }
  
  // Also update UI to show current progress
  try {
    if (typeof window !== 'undefined' && window.updateCampaignUI) {
      window.updateCampaignUI();
    }
  } catch (e) {}
  
  return false;
}

export async function completeObjective(objectiveId) {
  const { state } = await import('./state.js');
  
  const objective = await getCurrentObjective();
  if (!objective || objective.id !== objectiveId) return false;
  
  // Mark as completed
  state.campaign.completedObjectives.push(objectiveId);
  
  // Apply rewards
  if (objective.reward.xp) {
    state.player.xp += objective.reward.xp;
  }
  if (objective.reward.cash) {
    state.cash += objective.reward.cash;
  }
  
  // Unlock features
  if (objective.unlocks) {
    state.campaign.unlockedFeatures.push(...objective.unlocks);
  }
  
  // Move to next objective
  const chapter = CAMPAIGN_CHAPTERS[state.campaign.currentChapter];
  if (state.campaign.currentObjective < chapter.objectives.length - 1) {
    state.campaign.currentObjective++;
  } else {
    // Chapter completed, move to next
    if (state.campaign.currentChapter < CAMPAIGN_CHAPTERS.length - 1) {
      state.campaign.currentChapter++;
      state.campaign.currentObjective = 0;
    } else {
      // Campaign completed!
      state.campaign.completedObjectives.push('campaign_complete');
    }
  }
  
  return true;
}

export async function getCampaignProgress() {
  const { state } = await import('./state.js');
  
  if (!state.campaign.active) return null;
  
  const currentChapter = CAMPAIGN_CHAPTERS[state.campaign.currentChapter];
  const totalObjectives = CAMPAIGN_CHAPTERS.reduce((sum, ch) => sum + ch.objectives.length, 0);
  const completedCount = state.campaign.completedObjectives.length;
  
  return {
    currentChapter: state.campaign.currentChapter,
    totalChapters: CAMPAIGN_CHAPTERS.length,
    currentChapterTitle: currentChapter?.title || "Campanya completada",
    currentObjective: state.campaign.currentObjective,
    totalObjectives: totalObjectives,
    completedObjectives: completedCount,
    progress: Math.round((completedCount / totalObjectives) * 100)
  };
}
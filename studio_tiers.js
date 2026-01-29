// Studio Tier System for Career Progression
// Defines different studio levels and their benefits

export const STUDIO_TIERS = {
  0: {
    name: "Estudi Casolà",
    description: "Un espai modest als afores de la ciutat",
    icon: "🏠",
    maxRooms: 2,
    maxStaff: 1,
    reputationMultiplier: 0.8,
    payMultiplier: 0.7,
    unlockedGenres: ["rock", "pop"],
    specialFeatures: [],
    requirements: { level: 1, reputation: 0 }
  },
  1: {
    name: "Estudi Local", 
    description: "Un estudi reconegut a l'escena underground",
    icon: "🎸",
    maxRooms: 4,
    maxStaff: 2,
    reputationMultiplier: 1.0,
    payMultiplier: 1.0,
    unlockedGenres: ["rock", "pop", "rap", "hiphop"],
    specialFeatures: ["vocal_booth", "basic_equipment"],
    requirements: { level: 3, reputation: 15 }
  },
  2: {
    name: "Estudi Professional",
    description: "Instal·lacions de primer nivell per a artistes independents",
    icon: "🎛️",
    maxRooms: 6,
    maxStaff: 4,
    reputationMultiplier: 1.3,
    payMultiplier: 1.5,
    unlockedGenres: ["rock", "pop", "rap", "hiphop", "electronic", "jazz"],
    specialFeatures: ["control_room", "production_room", "special_offers"],
    requirements: { level: 5, reputation: 30 }
  },
  3: {
    name: "Estudi Llegendari",
    description: "Una referència mundial en la indústria musical",
    icon: "🏆",
    maxRooms: 8,
    maxStaff: 6,
    reputationMultiplier: 1.6,
    payMultiplier: 2.0,
    unlockedGenres: ["all"],
    specialFeatures: ["mastering_suite", "streaming_room", "international_clients", "platinum_albums"],
    requirements: { level: 8, reputation: 50 }
  }
};

export async function getCurrentTier() {
  const { state } = await import('./state.js');
  
  for (let tier = 3; tier >= 0; tier--) {
    const requirements = STUDIO_TIERS[tier].requirements;
    if (state.player.level >= requirements.level && state.reputation.overall >= requirements.reputation) {
      return tier;
    }
  }
  return 0;
}

export function getTierInfo(tier) {
  return STUDIO_TIERS[tier] || STUDIO_TIERS[0];
}

export async function checkTierUpgrades() {
  const { state } = await import('./state.js');
  
  const currentTier = await getCurrentTier();
  const lastKnownTier = state.campaign?.lastTier || 0;
  
  if (currentTier > lastKnownTier) {
    // Tier up!
    if (!state.campaign) state.campaign = {};
    state.campaign.lastTier = currentTier;
    
    return {
      tierUp: true,
      newTier: currentTier,
      previousTier: lastKnownTier,
      tierInfo: getTierInfo(currentTier)
    };
  }
  
  return { tierUp: false };
}

export async function applyTierBenefits(tier) {
  const tierInfo = getTierInfo(tier);
  
  // Apply reputation multiplier
  const { state } = await import('./state.js');
  
  // This would be called when generating contracts or calculating rewards
  return {
    reputationMultiplier: tierInfo.reputationMultiplier,
    payMultiplier: tierInfo.payMultiplier,
    maxRooms: tierInfo.maxRooms,
    maxStaff: tierInfo.maxStaff,
    unlockedGenres: tierInfo.unlockedGenres,
    specialFeatures: tierInfo.specialFeatures
  };
}

export async function getNextTierRequirements() {
  const currentTier = await getCurrentTier();
  
  if (currentTier >= 3) return null; // Max tier
  
  const nextTier = currentTier + 1;
  return {
    tier: nextTier,
    name: STUDIO_TIERS[nextTier].name,
    requirements: STUDIO_TIERS[nextTier].requirements,
    benefits: STUDIO_TIERS[nextTier]
  };
}

export async function isGenreUnlocked(genre) {
  const currentTier = await getCurrentTier();
  const tierInfo = getTierInfo(currentTier);
  
  return tierInfo.unlockedGenres.includes("all") || tierInfo.unlockedGenres.includes(genre);
}

export async function isFeatureUnlocked(feature) {
  const { state } = await import('./state.js');
  const currentTier = await getCurrentTier();
  const tierInfo = getTierInfo(currentTier);
  
  // Check tier-based unlocks
  if (tierInfo.specialFeatures.includes(feature)) {
    return true;
  }
  
  // Check campaign-based unlocks
  if (state.campaign && state.campaign.unlockedFeatures) {
    return state.campaign.unlockedFeatures.includes(feature);
  }
  
  return false;
}
// Achievements System for Recording Studio Tycoon
// Tracks player accomplishments and unlocks rewards

export const ACHIEVEMENTS = {
  // Contract Achievements
  first_contract: {
    id: "first_contract",
    name: "Primera vegada",
    description: "Completa el teu primer contracte",
    icon: "🎯",
    category: "contracts",
    reward: { xp: 50, cash: 200 },
    condition: { type: "contract_complete", target: 1 }
  },
  contract_veteran: {
    id: "contract_veteran",
    name: "Veterà",
    description: "Completa 25 contractes",
    icon: "⭐",
    category: "contracts",
    reward: { xp: 500, cash: 2000 },
    condition: { type: "contract_complete", target: 25 }
  },
  quality_master: {
    id: "quality_master",
    name: "Mestre de la qualitat",
    description: "Completa un contracte amb 95% de qualitat",
    icon: "💎",
    category: "contracts",
    reward: { xp: 300, cash: 1500 },
    condition: { type: "quality_single", target: 95 }
  },

  // Financial Achievements
  first_profit: {
    id: "first_profit",
    name: "Primers beneficis",
    description: "Acumula €10,000 en guanys nets",
    icon: "💰",
    category: "financial",
    reward: { xp: 200, cash: 1000 },
    condition: { type: "total_profit", target: 10000 }
  },
  wealthy_studio: {
    id: "wealthy_studio",
    name: "Estudi ric",
    description: "Tingui €50,000 en efectiu",
    icon: "💵",
    category: "financial",
    reward: { xp: 400, cash: 2500 },
    condition: { type: "cash_earned", target: 50000 }
  },
  economist: {
    id: "economist",
    name: "Economista",
    description: "Completa 5 contractes amb marge de beneficis del 200% o superior",
    icon: "📊",
    category: "financial",
    reward: { xp: 600, cash: 3000 },
    condition: { type: "high_margin_contracts", target: 5 }
  },

  // Reputation Achievements
  local_legend: {
    id: "local_legend",
    name: "Llegenda local",
    description: "Aconsegueix 50 de reputació general",
    icon: "🏆",
    category: "reputation",
    reward: { xp: 750, cash: 5000 },
    condition: { type: "reputation_overall", target: 50 }
  },
  genre_specialist: {
    id: "genre_specialist",
    name: "Especialista de gènere",
    description: "Aconsegueix 40 de reputació en qualsevol gènere",
    icon: "🎸",
    category: "reputation",
    reward: { xp: 500, cash: 3000 },
    condition: { type: "genre_reputation", target: 40 }
  },
  versatile_producer: {
    id: "versatile_producer",
    name: "Productor versàtil",
    description: "Aconsegueix 25 de reputació en 4 gèneres diferents",
    icon: "🎵",
    category: "reputation",
    reward: { xp: 800, cash: 4000 },
    condition: { type: "multi_genre_reputation", target: { genres: 4, reputation: 25 } }
  },

  // Staff Achievements
  team_builder: {
    id: "team_builder",
    name: "Constructor d'equips",
    description: "Contracta 5 membres de personal",
    icon: "👥",
    category: "staff",
    reward: { xp: 300, cash: 1500 },
    condition: { type: "staff_hired", target: 5 }
  },
  expert_team: {
    id: "expert_team",
    name: "Equip expert",
    description: "Tingui 2 membres de personal a nivell 5 o superior",
    icon: "🎓",
    category: "staff",
    reward: { xp: 600, cash: 3000 },
    condition: { type: "expert_staff", target: 2 }
  },

  // Equipment Achievements
  equipment_collector: {
    id: "equipment_collector",
    name: "Col·leccionista",
    description: "Posseeix 50 peces d'equipament diferents",
    icon: "🎛️",
    category: "equipment",
    reward: { xp: 400, cash: 2000 },
    condition: { type: "unique_items", target: 50 }
  },
  high_tech_studio: {
    id: "high_tech_studio",
    name: "Estudi d'alta tecnologia",
    description: "Posseeix equipament amb valor total de €100,000",
    icon: "⚡",
    category: "equipment",
    reward: { xp: 500, cash: 2500 },
    condition: { type: "equipment_value", target: 100000 }
  },

  // Special Achievements
  speed_demon: {
    id: "speed_demon",
    name: "Dimoni de la velocitat",
    description: "Completa un contracte en la meitat del temps previst",
    icon: "⚡",
    category: "special",
    reward: { xp: 700, cash: 3500 },
    condition: { type: "speed_complete", target: 0.5 }
  },
  perfectionist: {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Completa 10 contractes consecutius amb qualitat 90% o superior",
    icon: "🌟",
    category: "special",
    reward: { xp: 1000, cash: 5000 },
    condition: { type: "consecutive_high_quality", target: 10 }
  },
  campaign_master: {
    id: "campaign_master",
    name: "Mestre de campanya",
    description: "Completa tota la campanya",
    icon: "👑",
    category: "special",
    reward: { xp: 2000, cash: 10000 },
    condition: { type: "campaign_complete", target: 1 }
  }
};

export class AchievementManager {
  constructor() {
    this.achievements = new Map(Object.entries(ACHIEVEMENTS));
    this.unlockedAchievements = new Set();
    this.progress = new Map();
  }

  initialize(state) {
    // Load unlocked achievements from save state
    if (state.achievements) {
      this.unlockedAchievements = new Set(state.achievements.unlocked || []);
      this.progress = new Map(Object.entries(state.achievements.progress || {}));
    }
  }

  checkAchievement(type, currentValue, additionalData = {}) {
    for (const [id, achievement] of this.achievements) {
      if (this.unlockedAchievements.has(id)) continue;
      if (achievement.condition.type !== type) continue;

      if (this._checkCondition(achievement.condition, currentValue, additionalData)) {
        this.unlockAchievement(id);
      }
    }
  }

  _checkCondition(condition, currentValue, additionalData) {
    switch (condition.type) {
      case "contract_complete":
      case "staff_hired":
      case "unique_items":
      case "consecutive_high_quality":
      case "campaign_complete":
        return currentValue >= condition.target;

      case "quality_single":
      case "reputation_overall":
      case "genre_reputation":
      case "total_profit":
      case "cash_earned":
      case "equipment_value":
      case "high_margin_contracts":
      case "expert_staff":
        return currentValue >= condition.target;

      case "speed_complete":
        return currentValue <= condition.target;

      case "multi_genre_reputation":
        const { state } = require('./state.js');
        const genreCount = Object.values(state.reputation.byGenre)
          .filter(rep => rep >= condition.target.reputation).length;
        return genreCount >= condition.target.genres;

      default:
        return false;
    }
  }

  unlockAchievement(achievementId) {
    if (this.unlockedAchievements.has(achievementId)) return false;

    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    this.unlockedAchievements.add(achievementId);

    // Apply rewards
    const { state } = require('./state.js');
    if (achievement.reward.xp) {
      state.player.xp += achievement.reward.xp;
    }
    if (achievement.reward.cash) {
      state.cash += achievement.reward.cash;
    }

    // Show notification
    if (typeof window !== 'undefined' && window.showCampaignNotification) {
      window.showCampaignNotification(
        `🏆 Assoliment desbloquejat!`,
        `${achievement.icon} ${achievement.name}\n${achievement.description}`,
        'success'
      );
    }

    return true;
  }

  getAchievementProgress(achievementId) {
    return this.progress.get(achievementId) || 0;
  }

  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements);
  }

  getAchievementsByCategory(category) {
    return Array.from(this.achievements.values())
      .filter(ach => ach.category === category);
  }

  getTotalProgress() {
    const total = this.achievements.size;
    const unlocked = this.unlockedAchievements.size;
    return {
      total,
      unlocked,
      percentage: Math.round((unlocked / total) * 100)
    };
  }

  saveToState() {
    return {
      unlocked: Array.from(this.unlockedAchievements),
      progress: Object.fromEntries(this.progress)
    };
  }
}

// Global achievement manager instance
export const achievementManager = new AchievementManager();

// Hook into game events
export function hookAchievementEvents() {
  const { state } = require('./state.js');

  // Contract completion hook
  const originalCompleteContract = window.completeContract;
  if (originalCompleteContract) {
    window.completeContract = function(...args) {
      const result = originalCompleteContract.apply(this, args);
      
      if (result && state.campaign.active) {
        // Count total contracts
        const totalContracts = state.schedule.filter(c => c.completed).length;
        achievementManager.checkAchievement('contract_complete', totalContracts);

        // Check quality achievements
        if (result.quality) {
          achievementManager.checkAchievement('quality_single', result.quality);
        }

        // Check speed completion
        const contract = args[0]; // Assuming contract is first argument
        if (contract && result.completed) {
          const expectedTime = contract.duration_days * 8; // hours
          const actualTime = result.worked_hours || 0;
          if (actualTime > 0 && actualTime <= expectedTime * 0.5) {
            achievementManager.checkAchievement('speed_complete', actualTime / expectedTime);
          }
        }
      }
      
      return result;
    };
  }

  // Financial hooks
  const originalUpdateCash = window.updateCash;
  if (originalUpdateCash) {
    window.updateCash = function(amount) {
      const result = originalUpdateCash.apply(this, [amount]);
      
      if (state.campaign.active && state.cash > 0) {
        achievementManager.checkAchievement('cash_earned', state.cash);
        
        // Calculate total profit (simplified)
        const totalRevenue = Object.values(state.analytics.revenueByDay)
          .reduce((sum, day) => sum + day, 0);
        const totalExpense = Object.values(state.analytics.expenseByDay)
          .reduce((sum, day) => sum + day, 0);
        const totalProfit = totalRevenue - totalExpense;
        
        achievementManager.checkAchievement('total_profit', totalProfit);
      }
      
      return result;
    };
  }

  // Reputation hooks
  const originalUpdateReputation = window.updateReputation;
  if (originalUpdateReputation) {
    window.updateReputation = function(...args) {
      const result = originalUpdateReputation.apply(this, args);
      
      if (state.campaign.active) {
        achievementManager.checkAchievement('reputation_overall', state.reputation.overall);
        
        // Check genre reputation
        for (const [genre, rep] of Object.entries(state.reputation.byGenre)) {
          achievementManager.checkAchievement('genre_reputation', rep);
        }
        
        // Check multi-genre reputation
        achievementManager.checkAchievement('multi_genre_reputation', 0);
      }
      
      return result;
    };
  }
}
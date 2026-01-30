// Prestige/New Game+ System for Recording Studio Tycoon
// Allows players to restart with bonus features after completing the campaign

export const PRESTIGE_LEVELS = {
  0: {
    name: "Novell",
    description: "Primera vegada dirigint un estudi",
    icon: "🎓",
    bonusMultiplier: 1.0,
    unlocks: [],
    specialFeatures: []
  },
  1: {
    name: "Productor Experimentat",
    description: "Has completat una campanya i portes experiència",
    icon: "⭐",
    bonusMultiplier: 1.2,
    unlocks: ["enhanced_equipment", "better_clients"],
    specialFeatures: ["start_bonus_cash", "xp_boost"]
  },
  2: {
    name: "Llegendari de l'Estudi",
    description: "Múltiples campanyes completes, ets una referència",
    icon: "👑",
    bonusMultiplier: 1.5,
    unlocks: ["premium_equipment", "celebrity_clients", "advanced_features"],
    specialFeatures: ["start_bonus_staff", "reputation_boost", "unlimited_slots"]
  },
  3: {
    name: "Mestre del So",
    description: "Domini absolut de la producció musical",
    icon: "🏆",
    bonusMultiplier: 2.0,
    unlocks: ["all_equipment", "exclusive_clients", "secret_features"],
    specialFeatures: ["god_mode", "instant_upgrades", "creative_freedom"]
  }
};

export class PrestigeManager {
  constructor() {
    this.prestigeLevel = 0;
    this.totalPrestigePoints = 0;
    this.completedCampaigns = 0;
    this.prestigeHistory = [];
  }

  initialize(state) {
    // Load prestige data from save state
    if (state.prestige) {
      this.prestigeLevel = state.prestige.level || 0;
      this.totalPrestigePoints = state.prestige.points || 0;
      this.completedCampaigns = state.prestige.campaigns || 0;
      this.prestigeHistory = state.prestige.history || [];
    }
  }

  canPrestige() {
    const { state } = require('./state.js');
    
    // Check if campaign is completed
    if (!state.campaign || !state.campaign.completedObjectives.includes('campaign_complete')) {
      return { canPrestige: false, reason: "Has de completar la campanya principal" };
    }

    // Check minimum requirements
    const totalContracts = state.schedule.filter(c => c.completed).length;
    if (totalContracts < 50) {
      return { canPrestige: false, reason: "Has de completar almenys 50 contractes" };
    }

    if (state.reputation.overall < 60) {
      return { canPrestige: false, reason: "Has d'aconseguir 60 de reputació" };
    }

    return { canPrestige: true };
  }

  calculatePrestigePoints(state) {
    let points = 0;

    // Base points for campaign completion
    points += 1000;

    // Points for completed contracts
    const totalContracts = state.schedule.filter(c => c.completed).length;
    points += totalContracts * 20;

    // Points for reputation
    points += state.reputation.overall * 15;

    // Points for wealth
    points += Math.floor(state.cash / 100) * 5;

    // Points for achievements
    if (state.achievements) {
      points += state.achievements.unlocked.length * 50;
    }

    // Points for studio tier
    const { getCurrentTier } = require('./studio_tiers.js');
    points += getCurrentTier() * 200;

    // Points for special accomplishments
    if (state.campaign && state.campaign.completedObjectives.includes('campaign_complete')) {
      points += 500;
    }

    return points;
  }

  prestige() {
    const { state } = require('./state.js');
    const canPrestige = this.canPrestige();
    
    if (!canPrestige.canPrestige) {
      return false;
    }

    // Calculate prestige points
    const points = this.calculatePrestigePoints(state);
    
    // Update prestige stats
    this.totalPrestigePoints += points;
    this.completedCampaigns++;
    
    // Calculate new prestige level
    const newLevel = Math.min(3, Math.floor(this.totalPrestigePoints / 2000));
    const levelUp = newLevel > this.prestigeLevel;
    
    if (levelUp) {
      this.prestigeLevel = newLevel;
    }

    // Store prestige history
    this.prestigeHistory.push({
      timestamp: Date.now(),
      points: points,
      level: this.prestigeLevel,
      finalStats: {
        contracts: state.schedule.filter(c => c.completed).length,
        reputation: state.reputation.overall,
        cash: state.cash,
        achievements: state.achievements?.unlocked?.length || 0
      }
    });

    // Apply prestige reset with bonuses
    this.applyPrestigeReset();

    return {
      success: true,
      points: points,
      newLevel: this.prestigeLevel,
      levelUp: levelUp
    };
  }

  applyPrestigeReset() {
    const { state } = require('./state.js');
    const prestigeInfo = PRESTIGE_LEVELS[this.prestigeLevel];

    // Reset core game state
    state.cash = 1000;
    state.player = { 
      level: 1, 
      xp: 0, 
      fatigue: 0, 
      fatigueShort: 0, 
      fatigueChronic: 0, 
      restBonus: 0 
    };
    state.reputation = { overall: 0, byGenre: {} };
    state.staff = { engineer: { level: 1 }, producer: { level: 1 } };
    state.schedule = [];
    state.hiredPeople = [];
    state.roomsInstalled = state.db.rooms.map(() => ({}));
    state.roomBilling = state.db.rooms.map(() => ({ lastBilledDay: null, weeksBilled: 0, totalCharged: 0, justInstalled: false }));
    state.roomMaintenance = state.db.rooms.map(() => ({ lastInspectionDay: null, inspectionUntilDay: 0 }));
    state.inventory.clear();
    state.market = { offers: [], lastDayGenerated: 0, specials: [], lastSpecialDay: 0 };

    // Reset campaign but keep prestige info
    state.campaign = {
      active: false,
      currentChapter: 0,
      currentObjective: 0,
      completedObjectives: [],
      unlockedFeatures: [],
      storylineProgress: {},
      milestones: [],
      achievements: []
    };

    // Apply prestige bonuses
    if (prestigeInfo.specialFeatures.includes('start_bonus_cash')) {
      state.cash = 2000;
    }

    if (prestigeInfo.specialFeatures.includes('start_bonus_staff')) {
      state.staff.engineer.level = 2;
      state.staff.producer.level = 2;
    }

    if (prestigeInfo.specialFeatures.includes('reputation_boost')) {
      state.reputation.overall = 10;
    }

    // Store prestige data
    state.prestige = {
      level: this.prestigeLevel,
      points: this.totalPrestigePoints,
      campaigns: this.completedCampaigns,
      history: this.prestigeHistory
    };

    // Apply persistent unlocks
    if (prestigeInfo.unlocks.length > 0) {
      state.prestige.unlocks = prestigeInfo.unlocks;
    }
  }

  getPrestigeInfo() {
    return {
      currentLevel: this.prestigeLevel,
      totalPoints: this.totalPrestigePoints,
      completedCampaigns: this.completedCampaigns,
      currentInfo: PRESTIGE_LEVELS[this.prestigeLevel],
      nextInfo: PRESTIGE_LEVELS[Math.min(3, this.prestigeLevel + 1)],
      history: this.prestigeHistory
    };
  }

  getPrestigeProgress() {
    const currentLevelPoints = this.prestigeLevel * 2000;
    const nextLevelPoints = (this.prestigeLevel + 1) * 2000;
    const progress = this.totalPrestigePoints - currentLevelPoints;
    const needed = nextLevelPoints - currentLevelPoints;

    return {
      current: progress,
      needed: needed,
      percentage: Math.round((progress / needed) * 100)
    };
  }

  saveToState() {
    return {
      level: this.prestigeLevel,
      points: this.totalPrestigePoints,
      campaigns: this.completedCampaigns,
      history: this.prestigeHistory
    };
  }
}

// Global prestige manager instance
export const prestigeManager = new PrestigeManager();

// UI functions for prestige system
export function showPrestigeDialog() {
  const canPrestige = prestigeManager.canPrestige();
  const prestigeInfo = prestigeManager.getPrestigeInfo();
  const { calculatePrestigePoints } = prestigeManager;
  const { state } = require('./state.js');

  const potentialPoints = calculatePrestigePoints(state);
  
  const dialog = document.createElement('div');
  dialog.className = 'prestige-dialog';
  dialog.innerHTML = `
    <div class="prestige-content">
      <h2>🏆 Prestige Mode</h2>
      
      <div class="prestige-current">
        <h3>Estat Actual</h3>
        <p>Nivell de Prestige: ${prestigeInfo.currentLevel} - ${prestigeInfo.currentInfo.name}</p>
        <p>Punts totals: ${prestigeInfo.totalPoints}</p>
        <p>Campanyes completes: ${prestigeInfo.completedCampaigns}</p>
      </div>

      <div class="prestige-preview">
        <h3>Recompenses de Prestige</h3>
        <p><strong>Punts d'aquesta partida:</strong> ${potentialPoints}</p>
        <p><strong>Pròxim nivell:</strong> ${prestigeInfo.nextInfo.name}</p>
        <p><strong>Bonus multiplicador:</strong> x${prestigeInfo.nextInfo.bonusMultiplier}</p>
        <ul>
          ${prestigeInfo.nextInfo.unlocks.map(unlock => `<li>✨ ${unlock}</li>`).join('')}
          ${prestigeInfo.nextInfo.specialFeatures.map(feature => `<li>⭐ ${feature}</li>`).join('')}
        </ul>
      </div>

      ${canPrestige.canPrestige ? `
        <div class="prestige-actions">
          <button class="btn-prestige" onclick="performPrestige()">
            🚀 Fer Prestige i Començar Novament
          </button>
        </div>
      ` : `
        <div class="prestige-locked">
          <p>❌ ${canPrestige.reason}</p>
        </div>
      `}

      <button class="btn-close" onclick="closePrestigeDialog()">Tancar</button>
    </div>
  `;

  document.body.appendChild(dialog);
}

export function performPrestige() {
  const result = prestigeManager.prestige();
  
  if (result.success) {
    if (typeof window !== 'undefined' && window.showCampaignNotification) {
      window.showCampaignNotification(
        `🏆 Prestige Completat!`,
        `Has arribat al nivell ${result.newLevel}: ${PRESTIGE_LEVELS[result.newLevel].name}\nGuanyats ${result.points} punts de prestige!`,
        'success'
      );
    }
    
    closePrestigeDialog();
    
    // Reload the game to apply the reset
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

export function closePrestigeDialog() {
  const dialog = document.querySelector('.prestige-dialog');
  if (dialog) {
    dialog.remove();
  }
}

// Prestige dialog styles
const prestigeStyles = `
  .prestige-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .prestige-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 30px;
    max-width: 600px;
    color: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .prestige-content h2 {
    margin: 0 0 20px 0;
    font-size: 28px;
    text-align: center;
  }

  .prestige-content h3 {
    margin: 20px 0 10px 0;
    color: #ffd700;
  }

  .prestige-current, .prestige-preview {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .prestige-actions {
    text-align: center;
    margin: 20px 0;
  }

  .btn-prestige {
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .btn-prestige:hover {
    transform: scale(1.05);
  }

  .prestige-locked {
    text-align: center;
    padding: 20px;
    background: rgba(255, 0, 0, 0.2);
    border-radius: 8px;
    margin: 20px 0;
  }

  .btn-close {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    display: block;
    margin: 20px auto 0;
  }
`;

// Inject styles
if (!document.getElementById('prestige-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'prestige-styles';
  styleSheet.textContent = prestigeStyles;
  document.head.appendChild(styleSheet);
}
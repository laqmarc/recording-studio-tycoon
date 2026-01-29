// Campaign UI management for Recording Studio Tycoon

import { getCurrentObjective, getCampaignProgress, CAMPAIGN_CHAPTERS } from './campaign.js';
import { getCurrentTier, getTierInfo, checkTierUpgrades } from './studio_tiers.js';
import { state } from './state.js';

export async function updateCampaignUI() {
  const campaignStatus = document.getElementById('campaignStatus');
  
  if (!state.campaign.active) {
    campaignStatus.style.display = 'none';
    return;
  }

  campaignStatus.style.display = 'block';

  // Check for tier upgrades
  const tierUpgrade = await checkTierUpgrades();
  if (tierUpgrade.tierUp) {
    showCampaignNotification(
      `🎯 Nivell d'estudi: ${tierUpgrade.tierInfo.name}`,
      `${tierUpgrade.tierInfo.description}\n\n✨ Noves desbloquejos: ${tierUpgrade.tierInfo.specialFeatures.join(', ')}`,
      'success'
    );
  }

  const progress = await getCampaignProgress();
  const objective = await getCurrentObjective();
  const currentTier = await getCurrentTier();
  const tierInfo = getTierInfo(currentTier);

  if (progress && objective) {
    document.getElementById('campaignChapter').textContent = 
      `${tierInfo.icon} ${tierInfo.name} | ${progress.currentChapterTitle} (${progress.currentChapter + 1}/${progress.totalChapters})`;
    document.getElementById('campaignProgress').style.width = `${progress.progress}%`;
    document.getElementById('campaignObjective').textContent = `📋 ${objective.title}: ${objective.description}`;
  } else {
    document.getElementById('campaignChapter').textContent = `${tierInfo.icon} ${tierInfo.name} | 🎉 Campanya Completada!`;
    document.getElementById('campaignProgress').style.width = '100%';
    document.getElementById('campaignObjective').textContent = 'Has convertit el teu estudi en una llegenda!';
  }
}

export function initializeCampaignUI() {
  // Wait longer for state to be fully loaded from localStorage
  setTimeout(() => {
      // console.log('initializeCampaignUI called, checking state...');
    showCampaignUI();
  }, 1500);
}

function showCampaignUI() {
  try {
    // console.log('showCampaignUI called, state.campaign.active:', state.campaign?.active);
    
    // Campaign button is now handled by the header toggle and modal
    // Removed the inline campaign panel since we have the modal
    
    if (state.campaign && state.campaign.active) {
      // console.log('Campaign is active, updating UI');
      // Show campaign progress if campaign is active
      updateCampaignUI();
    }
  } catch (e) {
    // console.log('Campaign UI error:', e);
  }
}

export async function startCampaign() {
  try {
    //  console.log('Starting campaign...');
    
    // Initialize campaign state directly
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
    
    // console.log('Campaign state set:', state.campaign);
    
    // Save campaign state immediately
    const { saveState } = await import('./persistence.js');
    await saveState();
    
    // console.log('Campaign state saved');
    
    // Show confirmation before reload
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      z-index: 10001;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
      <h2>🎮 Campanya Iniciada!</h2>
      <p>El teu viatge com a productor comença ara...</p>
      <p style="margin-top:15px; opacity:0.8;">La pàgina es recarregarà en un moment...</p>
    `;
    document.body.appendChild(notification);
    
    // Reload UI to show campaign elements
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (e) {
    // console.error('Error starting campaign:', e);
    alert('Error al iniciar la campanya. Refresca la pàgina i torna-ho a provar.');
  }
}

// Make it globally available
window.startCampaign = startCampaign;
window.updateCampaignUI = updateCampaignUI;

export function showCampaignNotification(title, message, type = 'info') {
  // Create campaign notification
  const notification = document.createElement('div');
  notification.className = `campaign-notification campaign-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
  
  // Add to notifications container or create one
  let container = document.getElementById('notifications');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notifications';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Hook into existing game events to check campaign progress
export function hookCampaignEvents() {
  // Listen for contract completions
  const originalCompleteContract = window.completeContract;
  if (originalCompleteContract) {
    window.completeContract = function(...args) {
      const result = originalCompleteContract.apply(this, args);
      
      // Check campaign progress for contract completions
      if (result && state.campaign.active) {
        const { checkObjectiveProgress } = require('./campaign.js');
        
        // Count total completed contracts
        const totalCompleted = state.schedule.filter(c => c.completed).length;
        checkObjectiveProgress('contract_complete', totalCompleted);
        
        // Check for special contracts
        const specialCompleted = state.schedule.filter(c => c.completed && c.is_special).length;
        checkObjectiveProgress('special_contract_complete', specialCompleted);
      }
      
      return result;
    };
  }
  
  // Listen for level ups
  const originalAddXP = window.addXP;
  if (originalAddXP) {
    window.addXP = function(...args) {
      const result = originalAddXP.apply(this, args);
      
      if (state.campaign.active) {
        const { checkObjectiveProgress } = require('./campaign.js');
        checkObjectiveProgress('level', state.player.level);
      }
      
      return result;
    };
  }
  
  // Listen for room construction
  const originalInstallItem = window.installItem;
  if (originalInstallItem) {
    window.installItem = function(roomIndex, itemId) {
      const result = originalInstallItem.apply(this, [roomIndex, itemId]);
      
      if (state.campaign.active && result) {
        const { checkObjectiveProgress } = require('./campaign.js');
        const room = state.db.rooms[roomIndex];
        if (room) {
          checkObjectiveProgress('room_built', 1, room.category);
        }
      }
      
      return result;
    };
  }
}

// Campaign notification styles
const campaignStyles = `
  .campaign-status {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 15px 20px;
    margin: 10px 0;
    border-radius: 8px;
    color: white;
  }

  .campaign-progress {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 14px;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    transition: width 0.5s ease;
    border-radius: 4px;
  }

  .campaign-notification {
    background: white;
    border-left: 4px solid #667eea;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
  }

  .campaign-success {
    border-left-color: #4CAF50;
  }

  .campaign-warning {
    border-left-color: #FF9800;
  }

  .campaign-info {
    border-left-color: #2196F3;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .notification-content h3 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 16px;
  }

  .notification-content p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

// Inject styles
if (!document.getElementById('campaign-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'campaign-styles';
  styleSheet.textContent = campaignStyles;
  document.head.appendChild(styleSheet);
}

export function initCampaignToggle() {
  const btn = document.getElementById('btnCampaign');
  if (!btn) return;

  function updateButton() {
    btn.textContent = state.campaign.active ? 'Campanya: ON' : 'Campanya: OFF';
  }

  updateButton();

  btn.addEventListener('click', () => {
    const wasActive = state.campaign.active;
    state.campaign.active = !state.campaign.active;
    updateButton();
    if (state.campaign.active && !wasActive) {
      // Show modal if just activated
      showCampaignStartModal();
    }
    updateCampaignUI();
    // Save state
    if (typeof window.saveState === 'function') {
      window.saveState();
    }
  });
}

function showCampaignStartModal() {
  const modal = document.getElementById('campaignModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideCampaignStartModal() {
  const modal = document.getElementById('campaignModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Add event listener for start button
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById('btnStartCampaign');
    if (startBtn) {
      startBtn.addEventListener('click', hideCampaignStartModal);
    }
  });
} else {
  const startBtn = document.getElementById('btnStartCampaign');
  if (startBtn) {
    startBtn.addEventListener('click', hideCampaignStartModal);
  }
}

// Initialize campaign UI when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeCampaignUI();
    initCampaignToggle();
  });
} else {
  initializeCampaignUI();
  initCampaignToggle();
}
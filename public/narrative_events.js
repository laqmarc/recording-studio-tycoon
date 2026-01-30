// Narrative Events and Random Scenarios System
// Adds story events and random scenarios to the campaign

export const NARRATIVE_EVENTS = {
  // Positive Events
  viral_hit: {
    id: "viral_hit",
    title: "Èxit viral!",
    description: "Una de les teves produccions s'ha fet viral a les xarxes socials!",
    type: "positive",
    requirements: { reputation: 20, completed_contracts: 5 },
    effects: { reputation: 5, cash: 2000, xp: 200 },
    choices: [
      {
        text: "Aprofitar el moment",
        effects: { reputation: 3, cash: 1000 },
        result: "Crees contingut addicional que augmenta la teva visibilitat."
      },
      {
        text: "Centrar-se en nous projectes",
        effects: { reputation: 1, xp: 150 },
        result: "Mantens el focus mentre l'èxit viral es difon."
      }
    ]
  },

  celebrity_client: {
    id: "celebrity_client",
    title: "Client famós",
    description: "Un artista famós ha demanat els teus serveis després d'escoltar un dels teus treballs!",
    type: "positive",
    requirements: { reputation: 35, tier: 2 },
    effects: { special_contract: true, reputation: 8, cash: 5000 },
    choices: [
      {
        text: "Acceptar immediatament",
        effects: { special_contract: true, cash: 3000 },
        result: "El client famós està impressionat per la teva professionalitat."
      },
      {
        text: "Negociar millors condicions",
        effects: { special_contract: true, cash: 5000, reputation: 2 },
        result: "Les teves habilitats de negociació sorprenen al famós."
      }
    ]
  },

  equipment_sponsorship: {
    id: "equipment_sponsorship",
    title: "Patrocini d'equipament",
    description: "Una marca d'equipament t'ofereix un patrocini!",
    type: "positive",
    requirements: { tier: 1, reputation: 25 },
    effects: { free_equipment: true, discount: 0.3 },
    choices: [
      {
        text: "Firmar el contracte",
        effects: { free_equipment: true, reputation: 2 },
        result: "Rebs equipament gratuït a canvi de publicitat."
      },
      {
        text: "Negociar millors termes",
        effects: { discount: 0.4, reputation: 1 },
        result: "Consegueix un descompte del 40% en tot l'equipament."
      }
    ]
  },

  // Challenge Events
  equipment_failure: {
    id: "equipment_failure",
    title: "Fallada tècnica",
    description: "Un equipament crític ha fallat a mitja sessió!",
    type: "challenge",
    requirements: { completed_contracts: 3 },
    effects: { current_quality: -10, time_cost: 2 },
    choices: [
      {
        text: "Reparar ràpidament",
        effects: { cash: -500, quality_impact: -5 },
        result: "La reparació és ràpida però la qualitat en surt afectada."
      },
      {
        text: "Cercar equipament de substitució",
        effects: { cash: -1000, quality_impact: -2 },
        result: "Trobes una solució temporal que manté la qualitat."
      },
      {
        text: "Adiar la sessió",
        effects: { reputation: -2, cash: -200 },
        result: "El client entén la situació però es retarda el projecte."
      }
    ]
  },

  difficult_client: {
    id: "difficult_client",
    title: "Client difícil",
    description: "Un client exigeix canvis constants i té expectatives irreals!",
    type: "challenge",
    requirements: { completed_contracts: 2 },
    effects: { time_cost: 3, stress: 10 },
    choices: [
      {
        text: "Negociar límits clars",
        effects: { reputation: 1, time_cost: 2 },
        result: "Estables fronteres professionals que el client accepta."
      },
      {
        text: "Fer tot el possible",
        effects: { reputation: 2, stress: 15 },
        result: "El client està content però tu estàs esgotat."
      },
      {
        text: "Suggerir un altre productor",
        effects: { reputation: -1, xp: 50 },
        result: "Et retires professionalment i guanyes respecte."
      }
    ]
  },

  // Random Events
  weather_problems: {
    id: "weather_problems",
    title: "Problemes meteorològics",
    description: "Una tempesta ha tallat l'electricitat a la zona!",
    type: "random",
    requirements: { tier: 0 },
    effects: { work_interruption: true },
    choices: [
      {
        text: "Esperar que passi",
        effects: { time_delay: 1 },
        result: "L'electricitat torna després d'unes hores."
      },
      {
        text: "Treballar amb generador",
        effects: { cash: -300, quality_impact: -3 },
        result: "El soroll del generador afecta lleugerament la gravació."
      }
    ]
  },

  staff_opportunity: {
    id: "staff_opportunity",
    title: "Oportunitat de personal",
    description: "Un enginyer talentós busca feina i ha escoltat parlar bé del teu estudi!",
    type: "random",
    requirements: { tier: 1 },
    effects: { staff_hire: true },
    choices: [
      {
        text: "Contractar immediatament",
        effects: { staff_hire: true, cash: -2000 },
        result: "El nou personal s'integra perfectament a l'equip."
      },
      {
        text: "Fer una prova",
        effects: { staff_chance: 0.8, cash: -500 },
        result: "Proves les seves habilitats abans de decidir."
      }
    ]
  },

  festival_request: {
    id: "festival_request",
    title: "Petició de festival",
    description: "Un festival musical et demana que preparis una banda local!",
    type: "random",
    requirements: { reputation: 30, tier: 2 },
    effects: { special_contract: true, deadline_tight: true },
    choices: [
      {
        text: "Acceptar el repte",
        effects: { special_contract: true, reputation: 5 },
        result: "La banda sona excel·lent i el festival et contracta any rere any."
      },
      {
        text: "Demanar més temps",
        effects: { reputation: 2, deadline_extension: true },
        result: "Els organitzadors t'agraden per la teva honestedat."
      }
    ]
  }
};

export class NarrativeEventManager {
  constructor() {
    this.events = new Map(Object.entries(NARRATIVE_EVENTS));
    this.activeEvents = [];
    this.eventHistory = [];
    this.cooldowns = new Map();
  }

  initialize(state) {
    // Load event history from save state
    if (state.narrative) {
      this.eventHistory = state.narrative.eventHistory || [];
      this.cooldowns = new Map(Object.entries(state.narrative.cooldowns || {}));
    }
  }

  canTriggerEvent(eventId, state) {
    const event = this.events.get(eventId);
    if (!event) return false;

    // Check if event has cooldown
    if (this.cooldowns.has(eventId)) {
      const cooldownEnd = this.cooldowns.get(eventId);
      if (state.time.day < cooldownEnd) return false;
    }

    // Check requirements
    if (event.requirements) {
      if (event.requirements.reputation && state.reputation.overall < event.requirements.reputation) {
        return false;
      }
      if (event.requirements.tier) {
        const { getCurrentTier } = require('./studio_tiers.js');
        if (getCurrentTier() < event.requirements.tier) return false;
      }
      if (event.requirements.completed_contracts) {
        const completed = state.schedule.filter(c => c.completed).length;
        if (completed < event.requirements.completed_contracts) return false;
      }
    }

    return true;
  }

  triggerRandomEvent(state) {
    // Filter events that can be triggered
    const availableEvents = Array.from(this.events.keys())
      .filter(id => this.canTriggerEvent(id, state))
      .filter(id => !this.eventHistory.includes(id));

    if (availableEvents.length === 0) return null;

    // Weight events by type (positive: 40%, challenge: 30%, random: 30%)
    const weightedEvents = [];
    for (const eventId of availableEvents) {
      const event = this.events.get(eventId);
      let weight = 1;
      
      if (event.type === 'positive') weight = 0.4;
      else if (event.type === 'challenge') weight = 0.3;
      else if (event.type === 'random') weight = 0.3;
      
      weightedEvents.push({ id: eventId, weight });
    }

    // Select random event
    const totalWeight = weightedEvents.reduce((sum, e) => sum + e.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { id, weight } of weightedEvents) {
      random -= weight;
      if (random <= 0) {
        return this.activateEvent(id);
      }
    }

    return null;
  }

  activateEvent(eventId) {
    const event = this.events.get(eventId);
    if (!event) return null;

    const activeEvent = {
      ...event,
      id: eventId,
      triggeredDay: state.time.day,
      resolved: false
    };

    this.activeEvents.push(activeEvent);
    
    // Add to history and set cooldown
    this.eventHistory.push(eventId);
    const { state } = require('./state.js');
    this.cooldowns.set(eventId, state.time.day + 7); // 7 day cooldown

    // Show notification
    if (typeof window !== 'undefined' && window.showCampaignNotification) {
      window.showCampaignNotification(
        event.title,
        event.description,
        event.type === 'positive' ? 'success' : event.type === 'challenge' ? 'warning' : 'info'
      );
    }

    return activeEvent;
  }

  resolveEvent(eventId, choiceIndex) {
    const eventIndex = this.activeEvents.findIndex(e => e.id === eventId && !e.resolved);
    if (eventIndex === -1) return false;

    const event = this.activeEvents[eventIndex];
    const choice = event.choices[choiceIndex];
    if (!choice) return false;

    // Apply effects
    this.applyEffects(choice.effects);
    
    // Mark as resolved
    event.resolved = true;
    event.choiceIndex = choiceIndex;
    event.result = choice.result;

    // Show result notification
    if (typeof window !== 'undefined' && window.showCampaignNotification) {
      window.showCampaignNotification(
        `✅ Resolt: ${event.title}`,
        choice.result,
        'success'
      );
    }

    return true;
  }

  applyEffects(effects) {
    const { state } = require('./state.js');
    
    if (effects.cash) state.cash += effects.cash;
    if (effects.xp) state.player.xp += effects.xp;
    if (effects.reputation) state.reputation.overall += effects.reputation;
    if (effects.special_contract) {
      // Trigger special contract generation
      const { generateSpecialOffers } = require('./client_market.js');
      generateSpecialOffers(state.time.day, true);
    }
    if (effects.free_equipment || effects.discount) {
      // Store equipment benefits
      if (!state.equipmentBenefits) state.equipmentBenefits = {};
      state.equipmentBenefits.discount = effects.discount || 0;
      state.equipmentBenefits.freeNext = effects.free_equipment || false;
    }
  }

  getActiveEvents() {
    return this.activeEvents.filter(e => !e.resolved);
  }

  getEventHistory() {
    return this.eventHistory;
  }

  saveToState() {
    return {
      eventHistory: this.eventHistory,
      cooldowns: Object.fromEntries(this.cooldowns)
    };
  }
}

// Global narrative events manager instance
export const narrativeEventManager = new NarrativeEventManager();

// Hook into daily events
export function hookNarrativeEvents() {
  // Trigger random events on daily update
  const originalAdvanceDay = window.advanceDay;
  if (originalAdvanceDay) {
    window.advanceDay = function(...args) {
      const result = originalAdvanceDay.apply(this, args);
      
      // 15% chance of random event per day
      if (Math.random() < 0.15 && state.campaign.active) {
        narrativeEventManager.triggerRandomEvent(state);
      }
      
      return result;
    };
  }
}
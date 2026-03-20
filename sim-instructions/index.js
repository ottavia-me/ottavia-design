'use strict';

const { ROUTER_SYSTEM_PROMPT, ROUTE_SCHEMA, AGENCY_SNAPSHOT_CONTEXT } = require('./router.js');
const { GENERAL_AGENT_INSTRUCTIONS, GENERAL_AGENT_MODEL, GENERAL_AGENT_EFFORT } = require('./generalAgent.js');
const { NUTRITION_AGENT_INSTRUCTIONS, NUTRITION_AGENT_MODEL, NUTRITION_AGENT_EFFORT } = require('./nutritionAgent.js');
const { CONDITION_AGENT_INSTRUCTIONS, CONDITION_AGENT_MODEL, CONDITION_AGENT_EFFORT } = require('./conditionAgent.js');
const { PREFERENCE_AGENT_INSTRUCTIONS, PREFERENCE_AGENT_MODEL, PREFERENCE_AGENT_EFFORT } = require('./preferenceAgent.js');
const { VISUALIZATION_AGENT_INSTRUCTIONS, VISUALIZATION_AGENT_MODEL, VISUALIZATION_AGENT_EFFORT } = require('./visualizationAgent.js');
const { COACH_AGENT_INSTRUCTIONS, COACH_AGENT_MODEL, COACH_AGENT_EFFORT } = require('./coachAgent.js');

const AGENT_MAP = {
  general: {
    instructions: GENERAL_AGENT_INSTRUCTIONS,
    model: GENERAL_AGENT_MODEL,
    effort: GENERAL_AGENT_EFFORT,
  },
  nutrition: {
    instructions: NUTRITION_AGENT_INSTRUCTIONS,
    model: NUTRITION_AGENT_MODEL,
    effort: NUTRITION_AGENT_EFFORT,
  },
  condition: {
    instructions: CONDITION_AGENT_INSTRUCTIONS,
    model: CONDITION_AGENT_MODEL,
    effort: CONDITION_AGENT_EFFORT,
  },
  preference: {
    instructions: PREFERENCE_AGENT_INSTRUCTIONS,
    model: PREFERENCE_AGENT_MODEL,
    effort: PREFERENCE_AGENT_EFFORT,
  },
  visualization: {
    instructions: VISUALIZATION_AGENT_INSTRUCTIONS,
    model: VISUALIZATION_AGENT_MODEL,
    effort: VISUALIZATION_AGENT_EFFORT,
  },
  coach_cue: {
    instructions: COACH_AGENT_INSTRUCTIONS,
    model: COACH_AGENT_MODEL,
    effort: COACH_AGENT_EFFORT,
  },
};

/**
 * Get instructions for an agent by ID.
 * @param {string} agentId
 * @returns {string}
 */
function getAgentInstructions(agentId) {
  return AGENT_MAP[agentId]?.instructions || '';
}

/**
 * Get default model for an agent by ID.
 * @param {string} agentId
 * @returns {string}
 */
function getAgentDefaultModel(agentId) {
  return AGENT_MAP[agentId]?.model || 'gpt-4o-mini';
}

/**
 * Get effort for an agent by ID.
 * @param {string} agentId
 * @returns {string}
 */
function getAgentEffort(agentId) {
  return AGENT_MAP[agentId]?.effort || 'medium';
}

module.exports = {
  getAgentInstructions,
  getAgentDefaultModel,
  getAgentEffort,
  ROUTER_SYSTEM_PROMPT,
  ROUTE_SCHEMA,
  AGENCY_SNAPSHOT_CONTEXT,
  AGENT_MAP,
};

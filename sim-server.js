'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const OpenAI = require('openai').default;
const fs = require('fs');
const path = require('path');

const {
  getAgentInstructions,
  getAgentDefaultModel,
  ROUTER_SYSTEM_PROMPT,
  ROUTE_SCHEMA,
} = require('./sim-instructions/index.js');

// ── Load judge prompt ──────────────────────────────────────────────────────
const JUDGE_PROMPT = fs.readFileSync(path.join(__dirname, 'sim-eval.md'), 'utf8');

// ── Express setup ──────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3002;

// ── MongoDB (singleton) ────────────────────────────────────────────────────
let mongoClient = null;

async function getMongo() {
  if (!mongoClient) {
    if (!process.env.MONGODB_URI) return null;
    mongoClient = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    try {
      await mongoClient.connect();
    } catch (e) {
      console.warn('MongoDB connect failed:', e.message);
      mongoClient = null;
      return null;
    }
  }
  return mongoClient;
}

// ── Collection schemas (hardcoded mirror of MCP schemas) ───────────────────
const COLLECTION_SCHEMAS = {
  nutrition: {
    allowed_fields: ['date', 'clock_hm', 'food_item', 'serving_size', 'macronutrients', 'micronutrients', 'summary_id', 'is_most_recent'],
  },
  nutrition_daily_totals: {
    allowed_fields: ['date', 'daily_total_energy_kcal', 'daily_total_protein_g', 'daily_total_carbohydrates_g', 'daily_total_total_fat_g', 'daily_total_saturated_fat_g', 'daily_total_fiber_g', 'daily_total_sugars_g', 'daily_total_water_ml', 'daily_total_caffeine_mg', 'daily_total_alcohol_g'],
  },
  conditions: {
    allowed_fields: ['date', 'clock_hm', 'condition', 'severity', 'context', 'expected_expiry', 'reported_expiry', 'last_checked', 'resolved_by_model', 'chronic', 'source', 'confidence', 'summary_id'],
  },
  preferences: {
    allowed_fields: ['date', 'clock_hm', 'category', 'type', 'item', 'goal_value', 'target_date', 'confidence', 'source', 'summary_id'],
  },
  activities: {
    allowed_fields: ['date', 'start_time', 'activity_type', 'activity_name', 'distance_km', 'duration_minutes', 'calories_burned', 'avg_hr', 'max_hr', 'training_load', 'aerobic_te'],
  },
  activity_weekly_totals: {
    allowed_fields: ['week_start', 'total_distance_km', 'total_duration_minutes', 'total_calories', 'activity_count', 'avg_training_load'],
  },
  energy_expenditure: {
    allowed_fields: ['date', 'active_calories', 'resting_calories', 'total_calories', 'steps', 'distance_km'],
  },
  daily_summary: {
    allowed_fields: ['date', 'steps', 'distance_km', 'active_calories', 'resting_calories', 'total_calories', 'activity_minutes', 'floors', 'body_battery_charged', 'body_battery_drained'],
  },
  fitness_metrics: {
    allowed_fields: ['date', 'vo2max', 'training_load_7d', 'training_load_28d', 'recovery_time_hours', 'training_status', 'fitness_age'],
  },
  sleep: {
    allowed_fields: ['date', 'bedtime', 'wake_time', 'duration_seconds', 'sleep_score', 'deep_sleep_seconds', 'rem_sleep_seconds', 'light_sleep_seconds', 'awake_seconds', 'sleep_stress', 'respiration_rate', 'spo2_avg'],
  },
  hrv: {
    allowed_fields: ['date', 'hrv_night_avg', 'hrv_baseline', 'resting_hr', 'stress_level', 'body_battery_end'],
  },
  body_composition: {
    allowed_fields: ['date', 'weight_kg', 'body_fat_percent', 'muscle_mass_kg', 'bone_mass_kg', 'water_percent', 'bmi', 'is_most_recent'],
  },
  blood_pressure: {
    allowed_fields: ['date', 'clock_hm', 'systolic_mmhg', 'diastolic_mmhg', 'pulse_bpm', 'notes'],
  },
  user_profile: {
    allowed_fields: ['name', 'age', 'gender', 'height_cm', 'weight_kg', 'timezone', 'units', 'date_of_birth'],
  },
  coach_cues: {
    allowed_fields: ['date', 'clock_hm', 'category', 'title', 'message', 'status', 'initiator', 'action', 'replace_on_regeneration', 'summary_id'],
  },
  engagement: {
    allowed_fields: ['date', 'last_engagement', 'engagement_count', 'interaction_type'],
  },
};

// ── Tool definitions ───────────────────────────────────────────────────────

const MCP_TOOLS = [
  {
    type: 'function',
    name: 'mongo__listSchemas',
    description: 'List allowed fields for one or more MongoDB collections. Always call this before mongo__find or mongo__findMany.',
    parameters: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'Collection names to get schemas for',
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'mongo__find',
    description: 'Query a single MongoDB collection. Never include user_id — it is injected automatically.',
    parameters: {
      type: 'object',
      properties: {
        collection: { type: 'string', description: 'Collection name' },
        filter: { type: 'object', description: 'MongoDB filter (no user_id)' },
        projection: { type: 'object', description: 'Fields to include/exclude' },
        sort: { type: 'object', description: 'Sort order' },
        limit: { type: 'number', description: 'Max records (capped at 50)' },
      },
      required: ['collection'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'mongo__findMany',
    description: 'Query multiple MongoDB collections in one call for efficiency.',
    parameters: {
      type: 'object',
      properties: {
        queries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              collection: { type: 'string' },
              filter: { type: 'object' },
              projection: { type: 'object' },
              sort: { type: 'object' },
              limit: { type: 'number' },
            },
            required: ['collection'],
            additionalProperties: false,
          },
        },
      },
      required: ['queries'],
      additionalProperties: false,
    },
  },
];

const NUTRITION_WRITE_TOOLS = [
  {
    type: 'function',
    name: 'get_nutrition_from_image',
    description: 'Log a food/drink entry. Call once per distinct food item.',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        clock_hm: { type: 'string' },
        food_item: { type: 'string' },
        serving_size: { type: 'string' },
        is_most_recent: { type: 'boolean' },
        macronutrients: {
          type: 'object',
          properties: {
            energy_kcal: { type: 'number' }, protein_g: { type: 'number' },
            total_fat_g: { type: 'number' }, saturated_fat_g: { type: 'number' },
            cholesterol_mg: { type: 'number' }, carbohydrates_g: { type: 'number' },
            fiber_g: { type: 'number' }, sugars_g: { type: 'number' },
            added_sugars_g: { type: 'number' }, alcohol_g: { type: 'number' }, water_ml: { type: 'number' },
          },
          required: ['energy_kcal', 'protein_g', 'total_fat_g', 'carbohydrates_g'],
          additionalProperties: false,
        },
        micronutrients: {
          type: 'object',
          properties: {
            vitamin_b9_ug: { type: 'number' }, vitamin_b12_mcg: { type: 'number' },
            vitamin_c_mg: { type: 'number' }, vitamin_d_mcg: { type: 'number' },
            calcium_mg: { type: 'number' }, iron_mg: { type: 'number' },
            magnesium_mg: { type: 'number' }, phosphorus_mg: { type: 'number' },
            potassium_mg: { type: 'number' }, sodium_mg: { type: 'number' },
            zinc_mg: { type: 'number' }, iodine_ug: { type: 'number' }, caffeine_mg: { type: 'number' },
          },
          additionalProperties: false,
        },
      },
      required: ['date', 'clock_hm', 'food_item', 'serving_size', 'macronutrients'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'update_nutrition',
    description: 'Update an existing nutrition entry by summary_id.',
    parameters: {
      type: 'object',
      properties: {
        summary_id: { type: 'string' },
        updates: { type: 'array', items: { type: 'object' } },
      },
      required: ['summary_id', 'updates'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'delete_nutrition',
    description: 'Delete a nutrition entry by summary_id.',
    parameters: {
      type: 'object',
      properties: { summary_id: { type: 'string' } },
      required: ['summary_id'],
      additionalProperties: false,
    },
  },
];

const CONDITION_WRITE_TOOLS = [
  {
    type: 'function',
    name: 'log_condition',
    description: 'Log one health condition or symptom entry.',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string' }, clock_hm: { type: 'string' },
        condition: { type: 'string' }, severity: { type: 'number' },
        context: { type: 'string' }, expected_expiry: { type: 'string' },
        reported_expiry: { type: 'string' }, chronic: { type: 'boolean' },
        source: { type: 'string' }, confidence: { type: 'string' },
        resolved_by_model: { type: 'boolean' }, last_checked: { type: 'string' },
        is_most_recent: { type: 'boolean' },
      },
      required: ['condition', 'severity'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'update_condition',
    description: 'Update an existing condition record by summary_id.',
    parameters: {
      type: 'object',
      properties: {
        summary_id: { type: 'string' },
        updates: { type: 'array', items: { type: 'object' } },
      },
      required: ['summary_id', 'updates'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'delete_condition',
    description: 'Delete a condition record by summary_id.',
    parameters: {
      type: 'object',
      properties: { summary_id: { type: 'string' } },
      required: ['summary_id'],
      additionalProperties: false,
    },
  },
];

const PREFERENCE_WRITE_TOOLS = [
  {
    type: 'function',
    name: 'log_preference',
    description: 'Log one user preference, goal, or constraint.',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string' }, clock_hm: { type: 'string' },
        category: { type: 'string' }, type: { type: 'string' },
        item: { type: 'string' }, goal_value: { type: 'string' },
        target_date: { type: 'string' }, confidence: { type: 'string' }, source: { type: 'string' },
      },
      required: ['category', 'type', 'item'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'update_preference',
    description: 'Update an existing preference by summary_id.',
    parameters: {
      type: 'object',
      properties: {
        summary_id: { type: 'string' },
        updates: { type: 'array', items: { type: 'object' } },
      },
      required: ['summary_id', 'updates'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'delete_preference',
    description: 'Delete a preference by summary_id.',
    parameters: {
      type: 'object',
      properties: { summary_id: { type: 'string' } },
      required: ['summary_id'],
      additionalProperties: false,
    },
  },
];

const VISUALIZATION_WRITE_TOOLS = [
  {
    type: 'function',
    name: 'return_visualization',
    description: 'Return the structured visualization JSON payload.',
    parameters: {
      type: 'object',
      properties: {
        chartData: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['bar', 'line', 'progress'] },
            title: { type: 'string' },
            dateRange: { type: ['string', 'null'] },
            average: { type: ['number', 'null'] },
            values: {},
          },
          required: ['type', 'title'],
          additionalProperties: false,
        },
        meta: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            text: { type: ['string', 'null'] },
            summary: { type: ['string', 'null'] },
            question: { type: ['string', 'null'] },
          },
          required: ['type'],
          additionalProperties: false,
        },
      },
      required: ['chartData', 'meta'],
      additionalProperties: false,
    },
  },
];

const COACH_WRITE_TOOLS = [
  {
    type: 'function',
    name: 'generate_coach_cues',
    description: 'Save coach cues for scheduled delivery.',
    parameters: {
      type: 'object',
      properties: {
        timezone: { type: 'string' },
        cues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              message: { type: 'string' },
              category: { type: 'string' },
              date: { type: 'string' },
              clock_hm: { type: 'string' },
              operation: { type: 'string' },
              replace_on_regeneration: { type: 'boolean' },
            },
            required: ['title', 'message', 'category', 'date', 'clock_hm'],
            additionalProperties: false,
          },
        },
      },
      required: ['cues'],
      additionalProperties: false,
    },
  },
];

function getToolsForAgent(agentId) {
  const base = [...MCP_TOOLS];
  switch (agentId) {
    case 'nutrition': return [...base, ...NUTRITION_WRITE_TOOLS];
    case 'condition': return [...base, ...CONDITION_WRITE_TOOLS];
    case 'preference': return [...base, ...PREFERENCE_WRITE_TOOLS];
    case 'visualization': return [...base, ...VISUALIZATION_WRITE_TOOLS];
    case 'coach_cue': return [...base, ...COACH_WRITE_TOOLS];
    default: return base; // general
  }
}

// ── Normalize MCP tool names (mongo.X → mongo__X) ─────────────────────────
function normalizeInstructions(instructions) {
  return instructions
    .replace(/mongo\.listSchemas/g, 'mongo__listSchemas')
    .replace(/mongo\.findMany/g, 'mongo__findMany')
    .replace(/mongo\.find\b/g, 'mongo__find');
}

// ── Extract text from Responses API output ─────────────────────────────────
function extractResponseText(response) {
  if (response?.output) {
    for (const item of response.output) {
      if (item?.type === 'message') {
        for (const content of item.content || []) {
          if (content?.type === 'output_text' && content.text) {
            return content.text;
          }
        }
      }
    }
  }
  if (typeof response?.output_text === 'string') return response.output_text;
  return null;
}

function extractFunctionCalls(response) {
  return (response?.output || []).filter(item => item?.type === 'function_call');
}

// ── MCP tool shim ──────────────────────────────────────────────────────────
async function executeToolShim(toolName, args, userId, sseEmit) {
  // ── MCP read tools ──
  if (toolName === 'mongo__listSchemas') {
    const domains = args.domains || [];
    if (domains.length === 0) {
      return { schemas: Object.fromEntries(Object.entries(COLLECTION_SCHEMAS).map(([k, v]) => [k, v.allowed_fields])) };
    }
    const result = {};
    for (const domain of domains) {
      result[domain] = COLLECTION_SCHEMAS[domain]?.allowed_fields || [];
    }
    return { schemas: result };
  }

  if (toolName === 'mongo__find') {
    const client = await getMongo();
    if (!client) return { error: 'MongoDB not connected', records: [] };
    const { collection, filter = {}, projection, sort, limit = 10 } = args;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const col = db.collection(collection);
    const finalFilter = { ...filter, user_id: userId };
    const finalLimit = Math.min(Number(limit) || 10, 50);
    try {
      let cursor = col.find(finalFilter);
      if (projection && Object.keys(projection).length) cursor = cursor.project(projection);
      if (sort && Object.keys(sort).length) cursor = cursor.sort(sort);
      cursor = cursor.limit(finalLimit);
      const docs = await cursor.toArray();
      return { records: docs.map(d => ({ ...d, _id: d._id?.toString() })) };
    } catch (e) {
      return { error: e.message, records: [] };
    }
  }

  if (toolName === 'mongo__findMany') {
    const client = await getMongo();
    if (!client) return { error: 'MongoDB not connected', results: {} };
    const { queries = [] } = args;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const results = {};
    for (const q of queries) {
      const { collection, filter = {}, projection, sort, limit = 10 } = q;
      const col = db.collection(collection);
      const finalFilter = { ...filter, user_id: userId };
      const finalLimit = Math.min(Number(limit) || 10, 50);
      try {
        let cursor = col.find(finalFilter);
        if (projection && Object.keys(projection).length) cursor = cursor.project(projection);
        if (sort && Object.keys(sort).length) cursor = cursor.sort(sort);
        cursor = cursor.limit(finalLimit);
        const docs = await cursor.toArray();
        results[collection] = docs.map(d => ({ ...d, _id: d._id?.toString() }));
      } catch (e) {
        results[collection] = { error: e.message };
      }
    }
    return results;
  }

  // ── Write stubs (sim: never write to DB) ──
  if (['get_nutrition_from_image', 'update_nutrition', 'delete_nutrition',
       'log_condition', 'update_condition', 'delete_condition',
       'log_preference', 'update_preference', 'delete_preference',
       'generate_coach_cues'].includes(toolName)) {
    const simId = `sim-${Date.now()}`;
    return { simulated: true, summary_id: simId, status: 'success', message: `[SIM] ${toolName} called — no data written.` };
  }

  if (toolName === 'return_visualization') {
    sseEmit('visualization_payload', { chartData: args.chartData, meta: args.meta });
    return { simulated: true, status: 'visualization_returned' };
  }

  return { error: `Unknown tool: ${toolName}` };
}

// ── Agent executor with tool loop ──────────────────────────────────────────
async function executeAgent({ openai, agentId, userMessage, userId, model, sseEmit, maxIter = 10 }) {
  const rawInstructions = getAgentInstructions(agentId);
  const instructions = normalizeInstructions(rawInstructions);
  const tools = getToolsForAgent(agentId);
  const today = new Date().toISOString();

  const systemContext = `Current date/time: ${today}`;
  const fullInstructions = instructions + '\n\n' + systemContext;

  sseEmit('agent_start', { agent: agentId, model });

  let inputItems = [{ role: 'user', content: userMessage }];
  let responseText = null;
  let toolCallCount = 0;

  for (let i = 0; i < maxIter; i++) {
    let response;
    try {
      response = await openai.responses.create({
        model,
        instructions: fullInstructions,
        input: inputItems,
        tools,
        store: false,
      });
    } catch (err) {
      const errMsg = `Agent ${agentId} API error: ${err.message}`;
      sseEmit('agent_error', { agent: agentId, error: errMsg });
      return { text: errMsg, toolCalls: toolCallCount };
    }

    const functionCalls = extractFunctionCalls(response);

    if (functionCalls.length === 0) {
      // Done — extract response text
      responseText = extractResponseText(response);
      break;
    }

    // Execute tool calls
    const toolOutputs = [];
    for (const call of functionCalls) {
      let callArgs = {};
      try { callArgs = JSON.parse(call.arguments || '{}'); } catch (_) {}

      sseEmit('tool_call', { agent: agentId, tool: call.name, args: callArgs });
      toolCallCount++;

      const result = await executeToolShim(call.name, callArgs, userId, sseEmit);
      const resultStr = JSON.stringify(result);

      sseEmit('tool_result', { agent: agentId, tool: call.name, rows: getRowCount(result) });

      toolOutputs.push({ type: 'function_call_output', call_id: call.call_id, output: resultStr });
    }

    // Extend input with response output + tool results
    inputItems = [...inputItems, ...response.output, ...toolOutputs];
  }

  if (!responseText) {
    responseText = '[Agent did not produce a text response]';
  }

  sseEmit('agent_done', { agent: agentId, text: responseText });
  return { text: responseText, toolCalls: toolCallCount };
}

function getRowCount(result) {
  if (Array.isArray(result)) return result.length;
  if (result?.records && Array.isArray(result.records)) return result.records.length;
  if (typeof result === 'object' && result !== null) {
    // findMany result: sum all arrays
    let total = 0;
    for (const v of Object.values(result)) {
      if (Array.isArray(v)) total += v.length;
    }
    return total || 1;
  }
  return 1;
}

// ── Router ─────────────────────────────────────────────────────────────────
async function runRouter(openai, question, sseEmit) {
  sseEmit('router_start', { question });

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini', // Use gpt-4o-mini as universal fallback; switch to gpt-5-nano if your key supports it
      instructions: ROUTER_SYSTEM_PROMPT,
      input: [{ role: 'user', content: question }],
      text: { format: ROUTE_SCHEMA },
      store: false,
    });

    const raw = extractResponseText(response);
    const parsed = JSON.parse(raw);

    const result = {
      intent: parsed.intent || 'AMBIGUOUS',
      agents: parsed.agents || [],
      addWarmth: !!parsed.add_warmth,
      clarification: parsed.clarification || null,
    };

    sseEmit('router_done', result);
    return result;
  } catch (err) {
    const fallback = { intent: 'INSIGHT_OR_ADVICE', agents: ['general'], addWarmth: true, clarification: null };
    sseEmit('router_done', { ...fallback, error: err.message });
    return fallback;
  }
}

// ── Eval scorer ────────────────────────────────────────────────────────────
async function scoreResponse(openai, { question, intent, agents, dataSummary, responseText }) {
  const userPrompt = `QUESTION: ${question}

INTENT: ${intent}
AGENTS: ${agents.join(', ')}
DATA_SUMMARY: ${dataSummary}

RESPONSE TO SCORE:
---
${responseText}
---

Score the response on all 14 dimensions per the rubric. Return only JSON.`;

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: JUDGE_PROMPT,
      input: [{ role: 'user', content: userPrompt }],
      text: { format: { type: 'json_object' } },
      store: false,
    });

    const raw = extractResponseText(response);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Eval scoring error:', err.message);
    return { scores: {}, error: err.message };
  }
}

// ── Suggestion generator ───────────────────────────────────────────────────
async function generateSuggestions(openai, { question, responseText, scores }) {
  // Find lowest 3 scoring dimensions
  const scorePairs = Object.entries(scores || {}).map(([k, v]) => ({ key: k, score: v?.score || 50 }));
  scorePairs.sort((a, b) => a.score - b.score);
  const lowest = scorePairs.slice(0, 3).map(p => `${p.key}: ${p.score}`).join(', ');

  const prompt = `You are reviewing an Ottavia AI health assistant response to improve it.

QUESTION: ${question}

LOWEST SCORING DIMENSIONS: ${lowest}

RESPONSE:
---
${responseText}
---

Based on the lowest scoring dimensions, suggest concrete improvements.
Return JSON with this exact structure:
{
  "instruction_improvements": [
    { "agent": "agent_name", "issue": "specific problem", "suggestion": "concrete fix for the instruction file" }
  ],
  "infra_improvements": [
    { "area": "router|general|tooling|data", "issue": "specific problem", "suggestion": "concrete technical fix" }
  ]
}

Keep each improvement to 1-2 sentences. Max 3 instruction improvements and 2 infra improvements.`;

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are a senior AI engineer reviewing an AI assistant for improvements. Be specific and actionable.',
      input: [{ role: 'user', content: prompt }],
      text: { format: { type: 'json_object' } },
      store: false,
    });

    const raw = extractResponseText(response);
    return JSON.parse(raw);
  } catch (err) {
    return { instruction_improvements: [], infra_improvements: [], error: err.message };
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

app.get('/sim/health', async (req, res) => {
  const client = await getMongo();
  res.json({
    status: 'ok',
    mongo: client ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/sim/schema/:collection', (req, res) => {
  const schema = COLLECTION_SCHEMAS[req.params.collection];
  if (!schema) return res.status(404).json({ error: 'Collection not found' });
  res.json({ collection: req.params.collection, ...schema });
});

app.post('/sim/run', async (req, res) => {
  const { question, userId, model, openaiKey } = req.body;

  if (!openaiKey) {
    return res.status(400).json({ error: 'OpenAI API key required' });
  }
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // SSE setup
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const openai = new OpenAI({ apiKey: openaiKey });

  function sseEmit(event, data) {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch (_) {}
  }

  try {
    // ── 1. Route ──
    const routeResult = await runRouter(openai, question, sseEmit);

    if (routeResult.intent === 'AMBIGUOUS' || routeResult.agents.length === 0) {
      sseEmit('done', { clarification: routeResult.clarification || 'Could you clarify what you mean?' });
      return res.end();
    }

    // ── 2. Execute agents ──
    const agentModel = model || 'gpt-4o-mini';
    const agentResults = [];
    const dataSummaryParts = [];

    for (const agentId of routeResult.agents) {
      const result = await executeAgent({
        openai, agentId, userMessage: question, userId,
        model: agentModel, sseEmit,
      });
      agentResults.push({ agentId, ...result });
      if (result.toolCalls > 0) {
        dataSummaryParts.push(`${agentId}: ${result.toolCalls} tool call(s)`);
      }
    }

    const fullResponseText = agentResults.map(r => r.text).filter(Boolean).join('\n\n---\n\n');
    const dataSummary = dataSummaryParts.length > 0 ? dataSummaryParts.join('; ') : 'No data queried';

    // ── 3. Eval ──
    sseEmit('eval_start', {});
    const evalResult = await scoreResponse(openai, {
      question,
      intent: routeResult.intent,
      agents: routeResult.agents,
      dataSummary,
      responseText: fullResponseText,
    });

    // ── 4. Suggestions ──
    const suggestions = await generateSuggestions(openai, {
      question,
      responseText: fullResponseText,
      scores: evalResult.scores || {},
    });

    sseEmit('eval_done', {
      scores: evalResult.scores || {},
      voice_violations: evalResult.voice_violations || [],
      suggestions,
    });

    sseEmit('done', { agents: routeResult.agents, intent: routeResult.intent });

  } catch (err) {
    console.error('Pipeline error:', err);
    sseEmit('error', { message: err.message });
    sseEmit('done', {});
  }

  res.end();
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Ottavia Sim Server running on http://localhost:${PORT}`);
  console.log(`  Health: GET http://localhost:${PORT}/sim/health`);
  console.log(`  Run:    POST http://localhost:${PORT}/sim/run`);
  if (!process.env.MONGODB_URI) {
    console.warn('  Warning: MONGODB_URI not set — MongoDB reads will fail. Set it in .env');
  }
});

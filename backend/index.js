const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { processQuestion } = require('./engine/orchestrator');
const { GLOBAL_EVIDENCE_GRAPH, computeConfidence } = require('./engine/evidence');
const { enrichWithContext, USER_PROFILES, registerUser } = require('./engine/context');
const { evaluateEvidenceChallenge } = require('./engine/challenge');
const { evaluateThesisEvolution, THESIS_MEMORY_LEDGER, getThesisHistoryForUser } = require('./engine/tracker');
const { runDecisionStressTest } = require('./engine/stressTest');
const { runIntegrityChecks } = require('./engine/integrity');
const { runDecisionReplay } = require('./engine/replay');

// Helper to generate personalized contract based on the user (routed through the orchestrator)
const generateContract = (userId) => {
  return processQuestion("I want to buy TSLA because earnings are accelerating and EV adoption is growing.", userId);
};

// --- AUTHENTICATION ENDPOINTS ---
app.post('/api/register', (req, res) => {
  const { username, password, name, riskTolerance } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (USER_PROFILES[username]) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Map simple risk string to a mock profile object
  let profileName = "Balanced";
  let horizon = "Medium-term";
  if (riskTolerance === "Low") {
    profileName = "Conservative"; horizon = "Short-term";
  } else if (riskTolerance === "High") {
    profileName = "Growth"; horizon = "Long-term";
  }

  const newUser = registerUser(username, {
    name,
    password,
    profile: profileName,
    riskTolerance: riskTolerance || "Medium",
    horizon
  });

  res.json({ success: true, user: newUser });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USER_PROFILES[username];

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Simple plain-text password check for demo purposes
  if (user.password === password || (["user1", "user2", "user3"].includes(username) && password === "admin123")) {
    return res.json({ success: true, user, userId: username });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});
// ---------------------------------

app.post('/api/analyze', async (req, res) => {
  const { thesis, userId, demoMode } = req.body;
  if (!thesis) return res.status(400).json({ error: 'Thesis is required' });

  setTimeout(async () => {
    if (demoMode) {
      res.json({ success: true, contract: generateContract(userId) });
    } else {
      const dynamicContract = await processQuestion(thesis, userId);
      res.json({ success: true, contract: dynamicContract });
    }
  }, 3500);
});

app.post('/api/summarize', async (req, res) => {
  const { viewName, contextData } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: 'Groq API Key is missing. Please update backend/.env' });
  }

  const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant"
  ];

  let lastError = null;
  const prompt = `You are an expert financial analyst AI. Summarize the following data from the "${viewName}" tab of a financial dashboard into a concise 2-3 sentence executive summary. Do not include pleasantries. Data: ${JSON.stringify(contextData)}`;

  for (const model of MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": [
            { "role": "user", "content": prompt }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return res.json({ summary: data.choices[0].message.content, modelUsed: model });
      } else {
        lastError = data.error?.message || 'Invalid response format';
        console.warn(`[Groq] Model ${model} failed:`, lastError);
      }
    } catch (err) {
      console.warn(`[Groq] Model ${model} fetch failed:`, err.message);
      lastError = err.message;
    }
  }

  console.error("All Groq models failed. Last error:", lastError);

  const mockSummaries = {
    "dashboard": "The portfolio shows strong growth led by tech allocations, with risk exposure remaining within conservative limits. No immediate rebalancing is required.",
    "firewall": "The Decision Firewall has intercepted a high-risk trade proposal due to excessive concentration in volatile assets. Awaiting manual override.",
    "war-room": "Agents have reached consensus on the TSLA thesis. The combined confidence score is 84% based on strong earnings velocity.",
    "ledger": "Evidence logs show a 98.4% data integrity score. Three sources were recently updated and verified by the compliance engine.",
    "mirror": "Behavioral analysis indicates a slight tendency towards momentum chasing in recent trades. Recommended action: adhere to entry criteria.",
    "regret": "Regret analysis highlights a missed opportunity in energy sectors last quarter, but overall performance remains resilient against drawdowns."
  };

  const fallbackSummary = mockSummaries[viewName] || "AI systems are currently operating in offline mode. Local analysis indicates stable metrics with no critical alerts.";

  res.json({
    summary: `[MOCK AI] ${fallbackSummary}`,
    modelUsed: "local-mock-fallback"
  });
});

app.post('/api/trigger-event', (req, res) => {
  const { type, userId } = req.body;

  if (type === 'TRIPWIRE_FIRE') {
    // Process the question to get the deterministic graph and agents
    const contract = processQuestion("I want to buy TSLA because earnings are accelerating and EV adoption is growing.", userId);

    // Invalidate the primary evidence
    const targetEvidence = contract.provenanceGraph.find(e => e.evidenceId === "EV-014");
    if (targetEvidence) {
      targetEvidence.status = "SUPERSEDED";
      targetEvidence.reliability = 0; // It's no longer valid
    }

    const context = enrichWithContext(userId, { intent: "STOCK_ANALYSIS", requiresContract: true });
    // Recalculate confidence deterministically with tripwireTriggered = true
    const newEvidenceData = computeConfidence(contract.provenanceGraph, contract.agents, { ...context, tripwires: contract.tripwires }, 0, true);
    const newChallengeData = evaluateEvidenceChallenge(contract.provenanceGraph, contract.thesis, contract.question, { ...context, tripwires: contract.tripwires }, 0, true);

    // Apply the changes to the contract
    contract.status = 'INVALIDATED';
    contract.decision = 'NO';
    contract.verdict = 'NO';
    contract.answer = 'NO — Previous growth thesis is no longer valid. Core revenue growth fell below the 8% falsification threshold (11% -> 6.5%).';
    contract.confidence = newEvidenceData.decisionConfidence;
    contract.confidenceBreakdown = newEvidenceData;
    contract.evidenceChallenge = newChallengeData;
    contract.thesis = "Previous growth thesis is no longer valid. Core revenue growth fell below the 8% falsification threshold (11% -> 6.5%).";
    contract.thesisVersion = "v2";
    contract.thesisHistory.push({
      version: "v2",
      status: "INVALIDATED",
      timestamp: new Date().toISOString(),
      confidence: newEvidenceData.decisionConfidence,
      reason: "Revenue growth fell below thesis threshold (11% -> 6.5%)."
    });

    // Update the tripwire state
    contract.tripwires[0].status = "TRIGGERED";
    contract.tripwires[0].lastEvaluatedValue = "6.5%";

    // Update continuous thesis tracker for invalidated state
    const prevSnapshot = (THESIS_MEMORY_LEDGER[userId] && THESIS_MEMORY_LEDGER[userId]["TSLA"] && THESIS_MEMORY_LEDGER[userId]["TSLA"][0]) || null;
    contract.thesisEvolution = evaluateThesisEvolution(prevSnapshot, contract, "TSLA");

    // Recompute stress test for invalidated state
    contract.stressTest = runDecisionStressTest(contract, userId);

    // Update challenger agent in agents list
    const challengerAgent = contract.agents.find(a => a.name === "Evidence Challenger");
    if (challengerAgent) {
      challengerAgent.status = "bearish";
      challengerAgent.message = newChallengeData.challengeSummary;
    }

    return res.json({ success: true, contract });
  }

  if (type === 'DATA_FAILURE') {
    return res.json({
      success: false,
      status: 'CANNOT CONCLUDE',
      reason: 'Two critical evidence sources are unavailable and the remaining evidence does not meet the minimum confidence quorum. 3/5 required channels active.',
      dataCompleteness: 35
    });
  }

  res.json({ success: false, error: 'Unknown event' });
});

const {
  SHADOW_DECISION_LEDGER,
  computeRegretSummary,
  getBehavioralRegretInsights,
  getDecisionReplaySnapshot,
  recordDecisionContract
} = require('./engine/regret');

// ---------------- FEATURE 8: REGRET LEDGER API ----------------

app.get('/api/regret-ledger', (req, res) => {
  const userId = req.query.userId || 'user1';
  const records = SHADOW_DECISION_LEDGER[userId] || SHADOW_DECISION_LEDGER['user1'];
  const summary = computeRegretSummary(userId);
  const insights = getBehavioralRegretInsights(userId);

  res.json({
    success: true,
    userId,
    records,
    summary,
    insights
  });
});

app.get('/api/regret-ledger/:id/replay', (req, res) => {
  const decisionId = req.params.id;
  const userId = req.query.userId || 'user1';
  const snapshot = getDecisionReplaySnapshot(decisionId, userId);

  if (!snapshot) {
    return res.status(404).json({ success: false, error: 'Decision record not found' });
  }

  res.json({
    success: true,
    snapshot
  });
});

app.post('/api/regret-ledger/record', (req, res) => {
  const { contract, userId } = req.body;
  if (!contract) {
    return res.status(400).json({ success: false, error: 'Contract is required' });
  }

  const record = recordDecisionContract(contract, userId);
  res.json({
    success: true,
    record
  });
});

app.get('/api/thesis-history', (req, res) => {
  const userId = req.query.userId || 'user1';
  const subject = (req.query.subject || 'TSLA').toUpperCase();
  const history = getThesisHistoryForUser(userId, subject);
  res.json({
    success: true,
    userId,
    subject,
    history
  });
});

app.post('/api/stress-test', (req, res) => {
  const { contract, userId } = req.body;
  if (!contract) {
    return res.status(400).json({ success: false, error: 'Contract is required' });
  }

  const stressTest = runDecisionStressTest(contract, userId || 'user1');
  res.json({
    success: true,
    stressTest
  });
});

app.get('/api/users', (req, res) => {
  // Demo users
  res.json({
    success: true,
    users: [
      { id: "user1", name: "Arjun", profile: "Conservative" },
      { id: "user2", name: "Priya", profile: "Growth" },
      { id: "user3", name: "Karthik", profile: "Balanced" }
    ]
  });
});

app.post('/api/integrity-check', (req, res) => {
  const { contract, userId } = req.body;

  if (!contract || !userId) {
    return res.status(400).json({ success: false, error: 'Contract and userId are required' });
  }

  try {
    const integrity = runIntegrityChecks(contract, userId);
    return res.json({ success: true, integrity });
  } catch (error) {
    console.error("Integrity check failed:", error);
    return res.status(500).json({ success: false, error: 'Integrity check failed' });
  }
});

app.post('/api/replay', (req, res) => {
  const { contract, userId } = req.body;
  if (!contract) {
    return res.status(400).json({ success: false, error: 'Contract is required for replay' });
  }
  try {
    const replayData = runDecisionReplay(contract, userId || 'user1');
    res.json({ success: true, ...replayData });
  } catch (err) {
    console.error("Replay failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/dashboard/financial-intelligence', (req, res) => {
  const userId = req.query.userId || 'user1';
  // Use deterministic base from existing context logic
  const { user } = enrichWithContext(userId, { intent: "STOCK_ANALYSIS", agents: [] });

  // 1. Portfolio Trend (Deterministic mock over time for the demo)
  const baseValue = 100000;
  const portfolioTrend = Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
    value: baseValue + (i * 1200) + (Math.sin(i) * 3000), // deterministic wave
    exposure: user.portfolio.techExposure + (i % 3),
    concentration: 40 + i
  }));

  // 2. Risk Exposure
  const riskExposure = [
    { name: "Tech", value: user.portfolio.techExposure },
    { name: "Crypto", value: user.portfolio.cryptoExposure || 10 },
    { name: "Cash", value: user.portfolio.cash || 20 },
    { name: "Bonds", value: 10 }
  ];

  res.json({
    success: true,
    portfolioTrend,
    riskExposure
  });
});

app.get('/api/market-data', async (req, res) => {
  const { symbol = 'TSLA' } = req.query;
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'ALPHAVANTAGE_API_KEY is not configured.' });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Error Message']) {
      return res.status(400).json({ success: false, error: data['Error Message'] });
    }

    if (data['Note'] || data['Information']) {
      return res.status(429).json({ success: false, error: 'API rate limit exceeded. Please try again later.' });
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      return res.status(500).json({ success: false, error: 'Invalid data received from Alpha Vantage.' });
    }

    const dates = Object.keys(timeSeries).slice(0, 14).reverse();
    const chartData = dates.map(date => ({
      date: date.substring(5),
      price: parseFloat(timeSeries[date]['4. close'])
    }));

    res.json({ success: true, symbol, chartData });
  } catch (err) {
    console.error("AlphaVantage fetch error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/live-quote', async (req, res) => {
  const { symbol = 'TSLA' } = req.query;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'FINNHUB_API_KEY is not configured.' });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ success: false, error: data.error });
    }

    res.json({
      success: true,
      symbol,
      price: data.c,
      change: data.d,
      percentChange: data.dp
    });
  } catch (err) {
    console.error("Finnhub fetch error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SentinelIQ Backend running on http://localhost:${PORT}`);
});

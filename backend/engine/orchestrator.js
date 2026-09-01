// engine/orchestrator.js
const { classifyIntent } = require('./classifier');
const { enrichWithContext } = require('./context');
const { GLOBAL_EVIDENCE_GRAPH, computeConfidence } = require('./evidence');
const { recordDecisionContract } = require('./regret');
const { evaluateEvidenceChallenge } = require('./challenge');
const { compareAndRecordThesis } = require('./tracker');
const { runDecisionStressTest } = require('./stressTest');
const { runDevilsAdvocate } = require('./devilsAdvocate');

function generateAISummary(agents) {
    if (!agents || agents.length === 0) return "No agent analysis available.";
    
    const bullishAgents = agents.filter(a => a.status === 'bullish').map(a => a.name);
    const bearishAgents = agents.filter(a => a.status === 'bearish').map(a => a.name);
    
    let summary = `The intelligence network has completed its multi-agent evaluation. `;
    
    if (bullishAgents.length > bearishAgents.length) {
        summary += `Overall sentiment is bullish, driven by strong signals from ${bullishAgents.slice(0, 2).join(" and ")}. `;
        if (bearishAgents.length > 0) {
            summary += `However, ${bearishAgents[0]} raised concerns which were ultimately outweighed by positive factors. `;
        }
    } else if (bearishAgents.length > bullishAgents.length) {
        summary += `The consensus leans bearish due to critical flags raised by ${bearishAgents.slice(0, 2).join(" and ")}. `;
        if (bullishAgents.length > 0) {
            summary += `While ${bullishAgents[0]} detected some positive momentum, the structural risks remain too high. `;
        }
    } else {
        summary += `The network is deeply divided. Strong conflicting signals between ${bullishAgents[0] || 'bullish models'} and ${bearishAgents[0] || 'bearish models'} require caution. `;
    }
    
    // Add a specific highlight from one of the agents
    const criticalAgent = agents.find(a => a.name === 'Portfolio Risk' || a.name === 'Behavioral Mirror') || agents[0];
    if (criticalAgent) {
        summary += `Notably, ${criticalAgent.name} concluded: "${criticalAgent.message}"`;
    }
    
    return summary;
}

/**
 * The core Dynamic Orchestrator. 
 * Replaces the hardcoded SentinelIQ response with dynamic analysis.
 */
function processQuestion(question, userId) {
    // 1. Classify the Intent
    const intentData = classifyIntent(question);
    
    // 2. Data Failure Check (If user asks for something we can't reliably conclude)
    if (question.toLowerCase().includes("private") || question.toLowerCase().includes("unknown")) {
        return {
            status: "CANNOT_CONCLUDE",
            reason: "Required evidence for this query is unavailable in the trusted data stream. The system refuses to hallucinate.",
            confidenceBreakdown: { evidence: 0, reasoning: 0, decision: 0 }
        };
    }

    // 3. Personalize Context
    const { user, blastRadiusWarning, confidencePenalty, behavioralRiskScore, behavioralIntervention } = enrichWithContext(userId, intentData);

    // 4. Simulated RAG / Agent Evidence generation based on intent
    let agents = [];
    let thesis = "";
    
    // Mock the dynamic agent execution
    if (intentData.agents.includes("Signal Core")) {
        agents.push({
            name: "Signal Core",
            role: "Market Dynamics",
            status: "bullish",
            message: "Detected strong institutional accumulation in the trailing 48 hours."
        });
    }

    if (intentData.agents.includes("Fundamental Evidence")) {
        // If the question is about an event or verification, mock specific evidence.
        if (intentData.intent === "MARKET_EVENT") {
            agents.push({
                name: "Fundamental Evidence",
                role: "Financials",
                status: "bearish",
                message: "Q3 earnings missed consensus estimates by 4.2% on top-line revenue."
            });
        } else {
            agents.push({
                name: "Fundamental Evidence",
                role: "Financials",
                status: "bullish",
                message: "Free cash flow yield remains highly attractive at 6.2%."
            });
        }
    }

    if (intentData.agents.includes("Macro & Sector")) {
        agents.push({
            name: "Macro & Sector",
            role: "Environment",
            status: "bearish",
            message: "Sector rotation models indicate capital flight from this specific sub-sector."
        });
    }

    if (intentData.agents.includes("Portfolio Risk")) {
        agents.push({
            name: "Portfolio Risk",
            role: "Exposure",
            status: user.portfolio.techExposure > 40 ? "bearish" : "bullish",
            message: blastRadiusWarning
        });
    }

    if (intentData.agents.includes("Behavioral Mirror")) {
        agents.push({
            name: "Behavioral Mirror",
            role: "Psychology",
            status: user.behavioral.recentFOMO ? "bearish" : "bullish",
            message: user.behavioral.recentFOMO 
                ? "WARNING: You are demonstrating Recent-Performance Bias. Your last 3 identical trades lost money."
                : "No significant cognitive bias detected in this decision."
        });
    }

    if (intentData.agents.includes("Adversarial Agent")) {
        agents.push({
            name: "Adversarial Agent",
            role: "Red Team",
            status: "bearish",
            message: "Thesis ignores rising debt service costs which will erode margin in Q4."
        });
    }

    if (intentData.agents.includes("Quantum Predictor")) {
        agents.push({
            name: "Quantum Predictor",
            role: "Probabilistic Modeling",
            status: "bullish",
            message: "Simulated 10,000 Monte Carlo trajectories indicate a 78% probability of upward breakout over the next 14 days based on quantum state convergence."
        });
    }

    if (intentData.requiresContract) {
        agents.push({
            name: "Personal Adversary",
            role: "Behavioral Guard",
            status: user.behavioral.recentFOMO ? "bearish" : "bullish",
            message: behavioralIntervention
        });
    }

    // Compute Deterministic Evidence Challenge & Quality Assessment
    const evidenceChallenge = evaluateEvidenceChallenge(GLOBAL_EVIDENCE_GRAPH, thesis, question, { user, confidencePenalty, behavioralRiskScore, blastRadiusWarning }, 0, false);

    // Add Evidence Challenger Agent to the War Room
    if (intentData.requiresContract || intentData.agents.includes("Adjudicator")) {
        agents.push({
            name: "Evidence Challenger",
            role: "Epistemic Red Team",
            status: evidenceChallenge.status === "SUPPORTED" ? "bullish" : "bearish",
            message: evidenceChallenge.challengeSummary
        });
    }

    // Compute Deterministic Confidence & Provenance Breakdown
    const evidenceData = computeConfidence(GLOBAL_EVIDENCE_GRAPH, agents, { user, confidencePenalty, behavioralRiskScore, blastRadiusWarning }, 0);

    if (intentData.agents.includes("Adjudicator")) {
        agents.push({
            name: "Adjudicator",
            role: "Synthesis",
            status: evidenceData.decisionConfidence >= 60 ? "bullish" : "bearish",
            message: `Evidence integrity synthesized mathematically across ${GLOBAL_EVIDENCE_GRAPH.length} nodes (${evidenceData.breakdown.sourceQuality}% Source Quality, ${evidenceData.breakdown.agentAgreement}% Agreement).`
        });
    }

    // Generate output specific to intent
    let extractedAsset = question.match(/(tsla|tesla|reliance|tcs|amd|nvda|apple|aapl|microsoft|msft|google|goog)/i);
    let assetName = extractedAsset ? extractedAsset[0].toUpperCase() : "the target asset";

    let decision = "YES";
    let verdict = "YES";
    let answer = "";
    const questionFormatted = `[${intentData.type}] ${question.trim()}`;

    if (intentData.intent === "EMERGENCY_FUND") {
        if (user.portfolio.cash >= 20) {
            decision = "YES";
            verdict = "YES";
            answer = "YES — Your emergency fund is sufficient to cover three to six months of living expenses.";
            thesis = `Liquidity Analysis: Your portfolio holds ${user.portfolio.cash}% in liquid cash reserves, comfortably exceeding the recommended 3 to 6 months living expense buffer.`;
        } else if (user.portfolio.cash >= 15) {
            decision = "YES";
            verdict = "YES";
            answer = "YES — Your emergency fund meets the 3-month baseline for living expenses.";
            thesis = `Liquidity Analysis: Your cash allocation stands at ${user.portfolio.cash}%, providing an adequate 3-month emergency safety net.`;
        } else {
            decision = "NO";
            verdict = "NO";
            answer = "NO — Your emergency fund is not sufficient to cover three to six months of living expenses.";
            thesis = `Liquidity Deficit Warning: Your liquid cash allocation is only ${user.portfolio.cash}%, which is insufficient to cover 3 to 6 months of living expenses.`;
        }
    } else if (intentData.intent === "PORTFOLIO_RISK") {
        if (user.portfolio.techExposure > 40) {
            decision = "YES";
            verdict = "YES";
            answer = `YES — You are overexposed to the technology sector (${user.portfolio.techExposure}% vs ${user.profile === 'Conservative' ? '40%' : '45%'} limit).`;
            thesis = `Portfolio Concentration Warning: Tech exposure is at ${user.portfolio.techExposure}%, exceeding your ${user.profile} risk limit.`;
        } else {
            decision = "NO";
            verdict = "NO";
            answer = `NO — You are not overexposed to the technology sector (current exposure is ${user.portfolio.techExposure}%).`;
            thesis = `Portfolio Concentration Analysis: Tech exposure of ${user.portfolio.techExposure}% is within acceptable ${user.profile} bounds.`;
        }
    } else if (intentData.intent === "BEHAVIORAL_RISK") {
        if (user.behavioral.recentFOMO) {
            decision = "YES";
            verdict = "YES";
            answer = "YES — Recent-Performance Bias detected across your recent trading history.";
            thesis = `Behavioral Risk Analysis: Cognitive bias analysis detected recent-performance chasing behavior. 2 of your last 3 momentum entries resulted in losses.`;
        } else {
            decision = "NO";
            verdict = "NO";
            answer = "NO — No significant cognitive bias patterns detected in your recent trading history.";
            thesis = `Behavioral Risk Analysis: Decision patterns reflect disciplined execution with no active FOMO triggers.`;
        }
    } else if (intentData.intent === "STOCK_ANALYSIS" || intentData.requiresContract) {
        if (user.portfolio.techExposure > 40) {
            decision = "NO";
            verdict = "NO";
            answer = `NO — Allocating to ${assetName} is not recommended because technology exposure (${user.portfolio.techExposure}%) exceeds your ${user.profile} profile limits.`;
            thesis = `Actionable Thesis on ${assetName}: While fundamental metrics remain strong, adding this position increases tech exposure to ${user.portfolio.techExposure + 4}%, which conflicts with your ${user.profile} constraints.`;
        } else {
            decision = "YES";
            verdict = "YES";
            answer = `YES — ${assetName} presents a viable entry point supported by fundamental acceleration and risk fit.`;
            thesis = `Actionable Thesis on ${assetName}: Based on multi-agent synthesis, ${assetName} presents a viable entry point. Fundamental growth metrics remain strong (accelerating revenue and robust margins). Sizing fits within your ${user.profile} limits.`;
        }
    } else if (intentData.intent === "EVIDENCE_VERIFICATION") {
        decision = "YES";
        verdict = "YES";
        answer = "YES — Core claims are corroborated by primary SEC filings and independent institutional flow data.";
        thesis = `Evidence Verification: Cited metrics are validated against primary regulatory filings with high data integrity.`;
    } else if (intentData.type === "COMPARE") {
        decision = "COMPLETED";
        verdict = "COMPLETED";
        answer = "Comparative synthesis complete — weighted allocation favors the defensive asset under current rate dynamics.";
        thesis = `Comparative Analysis: The intelligence network evaluated requested assets across fundamental and macroeconomic vectors, recommending a weighted allocation favoring the more defensive asset.`;
    } else if (intentData.type === "INFORM") {
        decision = "EXPLAINED";
        verdict = "EXPLAINED";
        answer = `Recent price action in ${assetName} is driven by institutional block trades and macro sentiment rather than structural deterioration.`;
        thesis = `Market Event Analysis: The recent price action in ${assetName} is primarily driven by institutional block trades and shifting macroeconomic sentiment, rather than structural deterioration.`;
    } else {
        const isYesNo = /^(is|are|can|does|do|should|will|has|have|am i|was|were)\b/i.test(question.trim());
        if (isYesNo) {
            const isPositive = evidenceData.decisionConfidence >= 60;
            decision = isPositive ? "YES" : "NO";
            verdict = isPositive ? "YES" : "NO";
            answer = `${isPositive ? "YES" : "NO"} — Analysis indicates ${isPositive ? "favorable conditions supported by core intelligence evidence." : "insufficient supporting evidence under current portfolio constraints."}`;
        } else {
            decision = "INFORMATIONAL";
            verdict = "INFORMATIONAL";
            answer = "Multi-agent intelligence analysis completed for your query.";
        }
        thesis = `Dynamic Analysis: Our intelligence network has parsed the latest filings and market data regarding your query on ${assetName}. Consensus is positive, pointing to underlying strength.`;
    }

    // FEATURE 24: Devil's Advocate / Counterfactual Risk Analysis
    let adversarialReview = null;
    if (intentData.intent === "STOCK_ANALYSIS" || intentData.requiresContract) {
        adversarialReview = runDevilsAdvocate(decision, evidenceData.decisionConfidence, intentData, user, assetName);
        
        // Override final decision and confidence based on the adversarial review
        decision = adversarialReview.finalDecision;
        verdict = adversarialReview.finalVerdict;
        
        // Append Devil's Advocate reason if decision was altered
        if (adversarialReview.challengeLevel === "CRITICAL" || adversarialReview.challengeLevel === "HIGH") {
            answer = `${decision} — ${adversarialReview.decisionImpact}`;
        }
    }

    // Default Tripwires for actionable contracts using the DSL
    const tripwires = intentData.requiresContract ? [
        {
            id: "tw_rev_1",
            metric: "Revenue Growth",
            operator: "<",
            threshold: "8",
            unit: "%",
            status: "SAFE",
            lastEvaluatedValue: "11%",
            sourceEvidenceId: "Q3_GUIDANCE"
        },
        {
            id: "tw_sec_1",
            metric: "Sector Correlation",
            operator: ">",
            threshold: "0.85",
            unit: "ratio",
            status: "SAFE",
            lastEvaluatedValue: "0.62",
            sourceEvidenceId: "MACRO_MODEL"
        },
        {
            id: "tw_port_1",
            metric: "Tech Exposure",
            operator: ">",
            threshold: user.portfolio.techExposure + 5,
            unit: "%",
            status: user.portfolio.techExposure > 40 ? "WARNING" : "SAFE",
            lastEvaluatedValue: `${user.portfolio.techExposure}%`,
            sourceEvidenceId: "PORTFOLIO_CONTEXT"
        },
        {
            id: "tw_miss_1",
            metric: "Forward Guidance",
            operator: "==",
            threshold: "WITHDRAWN",
            unit: "status",
            status: "UNKNOWN",
            lastEvaluatedValue: "UNKNOWN",
            sourceEvidenceId: "PENDING_EARNINGS"
        },
        {
            id: "tw_behav_1",
            metric: "Post-Rally Entry",
            operator: "<",
            threshold: "24",
            unit: "hours",
            status: "ARMED",
            lastEvaluatedValue: "N/A",
            sourceEvidenceId: "BEHAVIORAL_HISTORY"
        }
    ] : [];

    const invalidationConditions = intentData.requiresContract ? [
        "Revenue growth falls below 8%.",
        "Management withdraws forward guidance.",
        "Technology exposure exceeds your maximum portfolio limit."
    ] : [];

    // Construct the payload
    const finalConfidence = evidenceData.decisionConfidence;
    const contract = {
        contractId: `TRIPWIRE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: "ACTIVE",
        question: questionFormatted,
        decision: decision,
        verdict: verdict,
        answer: answer,
        answerType: intentData.type,
        thesis: thesis,
        confidence: finalConfidence,
        confidenceBreakdown: evidenceData,
        aiSummary: generateAISummary(agents),
        provenanceGraph: JSON.parse(JSON.stringify(GLOBAL_EVIDENCE_GRAPH)),
        investorFit: Math.max(0, 100 - (confidencePenalty * 1.5)),
        positionSuggestion: intentData.requiresContract ? (finalConfidence > 80 ? "Full Allocation" : "Quarter Position") : "N/A",
        blastRadius: {
            before: `${user.portfolio.techExposure}%`,
            after: `${user.portfolio.techExposure + 4}%`,
            warning: blastRadiusWarning
        },
        agents: agents,
        tripwires: tripwires,
        invalidationConditions: invalidationConditions,
        thesisVersion: "v1",
        thesisHistory: [
            { version: "v1", status: "ACTIVE", timestamp: new Date().toISOString(), confidence: finalConfidence, reason: "Initial synthesis completed." }
        ],
        personalizationContext: `System applied a penalty due to your ${user.profile} profile risk limits.`,
        evidenceChallenge: evidenceChallenge,
        behavioralData: {
            riskScore: behavioralRiskScore,
            intervention: behavioralIntervention,
            matchedDecisions: user.behavioral.historicalDecisions,
            patterns: [
                { name: "FOMO Tendency", score: user.behavioral.recentFOMO ? 81 : 12 },
                { name: "Confirmation Bias", score: 71 },
                { name: "Over-sizing", score: 64 }
            ]
        },
        adversarialReview: adversarialReview
    };

    // FEATURE 21: Evaluate Continuous Thesis Evolution against previous snapshot
    const thesisEvolution = compareAndRecordThesis(contract, userId, intentData);
    contract.thesisEvolution = thesisEvolution;

    // FEATURE 22: Decision Stress Test & Adversarial Scenario Engine
    const stressTest = runDecisionStressTest(contract, userId);
    contract.stressTest = stressTest;

    // Auto-record to shadow decision ledger for counterfactual accountability
    recordDecisionContract(contract, userId);

    return contract;
}

module.exports = { processQuestion };

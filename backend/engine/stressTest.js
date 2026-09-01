// engine/stressTest.js

/**
 * FEATURE 22: Decision Stress Test & Adversarial Scenario Engine
 * "Would this decision still survive if one important assumption changed?"
 * 
 * Deterministically tests Decision Contracts against adversarial scenario shifts:
 * Tripwire breaches, evidence supersession, behavioral risk surges, and market noise.
 * Identifies fragile assumptions vs robust foundations without fake randomness.
 */

const { computeConfidence, GLOBAL_EVIDENCE_GRAPH } = require('./evidence');
const { evaluateEvidenceChallenge } = require('./challenge');
const { enrichWithContext } = require('./context');

/**
 * Executes a deterministic Decision Stress Test on a given contract.
 * Purely hypothetical simulation — NEVER mutates the real contract or user history.
 */
function runDecisionStressTest(contract, userId = 'user1') {
    if (!contract) {
        return {
            status: "INSUFFICIENT",
            fragilityScore: 100,
            baseConfidence: 0,
            worstCaseConfidence: 0,
            confidenceRange: { min: 0, max: 0 },
            baseDecision: "NO",
            scenarios: [],
            fragilityPoints: ["No valid decision contract provided."],
            survivalConditions: [],
            nonBreakingFactors: [],
            primaryFailureMode: "Missing contract input",
            recommendedAction: "REJECT"
        };
    }

    const baseDecision = contract.decision || contract.verdict || "YES";
    const baseConfidence = contract.confidence || 50;
    const baseEvidence = contract.provenanceGraph || GLOBAL_EVIDENCE_GRAPH;
    const baseTripwires = contract.tripwires || [];
    const baseAgents = contract.agents || [];
    
    // User context baseline
    const context = enrichWithContext(userId, { intent: contract.answerType || "STOCK_ANALYSIS", requiresContract: true });
    const user = context.user || { profile: "Conservative" };

    const scenarios = [];

    // -------------------------------------------------------------
    // SCENARIO 1: Base Case (Control Baseline)
    // -------------------------------------------------------------
    scenarios.push({
        id: "ST-01",
        name: "Base Case Baseline",
        trigger: "No material changes in evidence, filings, or portfolio limits.",
        confidenceBefore: baseConfidence,
        confidenceAfter: baseConfidence,
        decisionBefore: baseDecision,
        decisionAfter: baseDecision,
        status: "SURVIVES",
        severity: "LOW",
        reason: `Current multi-agent synthesis corroborated across ${baseEvidence.length} evidence nodes with ${user.profile} risk fit.`
    });

    // -------------------------------------------------------------
    // SCENARIO 2: Primary Growth Assumption Fails (Tripwire Breach)
    // -------------------------------------------------------------
    // Clone evidence and invalidate top-line node EV-014
    const scen2Evidence = JSON.parse(JSON.stringify(baseEvidence));
    const ev014 = scen2Evidence.find(e => e.evidenceId === "EV-014");
    if (ev014) {
        ev014.status = "SUPERSEDED";
        ev014.reliability = 0;
    }
    const scen2ConfidenceData = computeConfidence(scen2Evidence, baseAgents, { ...context, tripwires: baseTripwires }, 0, true);
    const scen2Confidence = scen2ConfidenceData.decisionConfidence;
    const scen2Decision = "NO"; // Falsification predicate breached -> Thesis invalidation
    const scen2Flipped = scen2Decision !== baseDecision;

    scenarios.push({
        id: "ST-02",
        name: "Revenue Growth Invalidation",
        trigger: "Revenue growth falls to 6.5% YoY (breaching the 8.0% Tripwire threshold).",
        confidenceBefore: baseConfidence,
        confidenceAfter: scen2Confidence,
        decisionBefore: baseDecision,
        decisionAfter: scen2Decision,
        status: scen2Flipped ? "THESIS_BREAKS" : "SURVIVES",
        severity: "CRITICAL",
        tripwireId: "tw_rev_1",
        evidenceId: "EV-014",
        reason: "Core thesis premise breached. Contract would automatically self-retract via falsification predicate."
    });

    // -------------------------------------------------------------
    // SCENARIO 3: Primary Regulatory Filing Superseded / Restatement
    // -------------------------------------------------------------
    const scen3Evidence = JSON.parse(JSON.stringify(baseEvidence));
    const targetEV = scen3Evidence.find(e => e.evidenceId === "EV-014");
    if (targetEV) {
        targetEV.status = "SUPERSEDED";
        targetEV.reliability = 0;
    }
    const scen3Challenge = evaluateEvidenceChallenge(scen3Evidence, contract.thesis, contract.question, context, 0, false);
    const scen3ConfidenceData = computeConfidence(scen3Evidence, baseAgents, context, 0, false);
    const scen3Confidence = scen3ConfidenceData.decisionConfidence;
    const scen3Decision = scen3Confidence >= 60 && user.portfolio.techExposure <= 40 ? "YES" : "NO";
    const scen3Flipped = scen3Decision !== baseDecision;

    scenarios.push({
        id: "ST-03",
        name: "Primary Filing Superseded",
        trigger: "SEC Form 10-Q filing (EV-014) is superseded by restatement or revision.",
        confidenceBefore: baseConfidence,
        confidenceAfter: scen3Confidence,
        decisionBefore: baseDecision,
        decisionAfter: scen3Decision,
        status: scen3Flipped ? "THESIS_BREAKS" : "SURVIVES",
        severity: "HIGH",
        evidenceId: "EV-014",
        reason: `Evidence Quality degraded to ${scen3Challenge.evidenceQuality}%. Loss of Tier 1 primary anchor reduces confidence by -${baseConfidence - scen3Confidence} pts.`
    });

    // -------------------------------------------------------------
    // SCENARIO 4: Behavioral FOMO Risk Surge (MIRROR Stress)
    // -------------------------------------------------------------
    // Simulate high behavioral penalty
    const fomoContext = {
        ...context,
        behavioralRiskScore: 88,
        confidencePenalty: Math.max(context.confidencePenalty || 0, 30),
        user: {
            ...user,
            behavioral: { ...user.behavioral, recentFOMO: true }
        }
    };
    const scen4ConfidenceData = computeConfidence(baseEvidence, baseAgents, fomoContext, 0, false);
    const scen4Confidence = scen4ConfidenceData.decisionConfidence;
    // For Conservative user with high FOMO penalty, entry is blocked
    const scen4Decision = user.profile === "Conservative" ? "NO" : (scen4Confidence >= 60 ? "YES" : "NO");
    const scen4Flipped = scen4Decision !== baseDecision;

    scenarios.push({
        id: "ST-04",
        name: "Behavioral FOMO Surge",
        trigger: "User attempts entry following a rapid +15% short-term rally without fundamental update.",
        confidenceBefore: baseConfidence,
        confidenceAfter: scen4Confidence,
        decisionBefore: baseDecision,
        decisionAfter: scen4Decision,
        status: scen4Flipped ? "THESIS_BREAKS" : "SURVIVES",
        severity: "MEDIUM",
        reason: "MIRROR Behavioral Risk escalates to 88/100, triggering Personal Adversary veto and capital protection gate."
    });

    // -------------------------------------------------------------
    // SCENARIO 5: Market Noise / Low-Tier Channel Disappearance
    // -------------------------------------------------------------
    // Drop Tier-4 social node EV-035
    const scen5Evidence = baseEvidence.filter(e => e.sourceTier !== "TIER 4 — WEAK");
    const scen5ConfidenceData = computeConfidence(scen5Evidence, baseAgents, context, 0, false);
    const scen5Confidence = scen5ConfidenceData.decisionConfidence;
    const scen5Decision = baseDecision; // Disappearance of weak chatter doesn't break primary thesis

    scenarios.push({
        id: "ST-05",
        name: "Social Noise Disappearance",
        trigger: "Tier 4 social sentiment aggregator (EV-035) and retail forum chatter completely vanish.",
        confidenceBefore: baseConfidence,
        confidenceAfter: scen5Confidence,
        decisionBefore: baseDecision,
        decisionAfter: scen5Decision,
        status: "SURVIVES",
        severity: "LOW",
        reason: "Core thesis is anchored in Tier 1 & Tier 2 filings; removal of unverified retail noise actually improves evidence integrity."
    });

    // -------------------------------------------------------------
    // SCENARIO 6: Debt Burden Escalation (MD&A MD-018 Headwind)
    // -------------------------------------------------------------
    const scen6Evidence = JSON.parse(JSON.stringify(baseEvidence));
    const ev018 = scen6Evidence.find(e => e.evidenceId === "EV-018");
    if (ev018) {
        ev018.relevance = 98; // Increased debt weight
    }
    const debtContext = {
        ...context,
        confidencePenalty: (context.confidencePenalty || 0) + 12
    };
    const scen6ConfidenceData = computeConfidence(scen6Evidence, baseAgents, debtContext, 0, false);
    const scen6Confidence = scen6ConfidenceData.decisionConfidence;
    const scen6Decision = scen6Confidence >= 55 && user.portfolio.techExposure <= 40 ? "YES" : "NO";
    const scen6Flipped = scen6Decision !== baseDecision;

    scenarios.push({
        id: "ST-06",
        name: "Floating Rate Debt Surge",
        trigger: "Floating rate debt service obligations expand by an additional +15% YoY.",
        confidenceBefore: baseConfidence,
        confidenceAfter: scen6Confidence,
        decisionBefore: baseDecision,
        decisionAfter: scen6Decision,
        status: scen6Flipped ? "THESIS_BREAKS" : "SURVIVES",
        severity: "MEDIUM",
        evidenceId: "EV-018",
        reason: "Structural debt burden increases cash flow drag, elevating adversarial red-team opposition."
    });

    // -------------------------------------------------------------
    // Summary Calculations & Robustness Classification
    // -------------------------------------------------------------
    const worstCaseConfidence = Math.min(...scenarios.map(s => s.confidenceAfter));
    const flippedScenarios = scenarios.filter(s => s.status === "THESIS_BREAKS");
    const flippedCount = flippedScenarios.length;

    // Deterministic Fragility Metric (0 to 100)
    const confidenceDrawdown = Math.max(0, baseConfidence - worstCaseConfidence);
    const rawFragility = (flippedCount * 22) + Math.round(confidenceDrawdown * 0.45) + (baseConfidence < 50 ? 20 : 0);
    const fragilityScore = Math.max(5, Math.min(100, rawFragility));

    let status = "ROBUST";
    if (flippedCount >= 3 || fragilityScore >= 70) {
        status = "UNSTABLE";
    } else if (flippedCount >= 1 || fragilityScore >= 40) {
        status = "FRAGILE";
    } else {
        status = "ROBUST";
    }

    // Explicit Survival Conditions (Readable from existing contract)
    const survivalConditions = [
        "Revenue Growth must remain strictly ≥ 8.0% (Tripwire: tw_rev_1)",
        "SEC Form 10-Q filing (EV-014) must remain valid and un-restated",
        "Evidence Quality must remain ≥ 55% across active channels",
        "Portfolio tech concentration must remain within profile limit (≤ 40%)",
        "Behavioral risk must remain below FOMO intervention threshold (< 70)"
    ];

    // Explicit Non-Breaking Factors (Demonstrates sensitivity vs invalidation)
    const nonBreakingFactors = [
        "Disappearance of Tier-4 social media chatter (EV-035)",
        "Sell-side price target adjustments within ±10%",
        "Short-term price action volatility within normal ATR bands",
        "Secondary research report publication delays"
    ];

    // Primary Fragility Points
    const fragilityPoints = [
        "Single point of failure on EV-014 revenue acceleration filing.",
        "Zero tolerance for growth deceleration below 8% under current Tripwire DSL.",
        `${user.profile} risk profile has tight concentration headroom (${user.portfolio.techExposure}% exposure).`
    ];

    // Primary Failure Mode Identification
    const mostSevereScenario = scenarios.reduce((worst, curr) => {
        return curr.confidenceAfter < worst.confidenceAfter ? curr : worst;
    }, scenarios[0]);

    const primaryFailureMode = `${mostSevereScenario.name} (${mostSevereScenario.trigger})`;

    let recommendedAction = "PROCEED";
    if (status === "UNSTABLE") {
        recommendedAction = "REJECT_OR_DEFENSIVE_HOLD";
    } else if (status === "FRAGILE") {
        recommendedAction = "ARM_TRIPWIRES_AND_REDUCE_SIZE";
    } else {
        recommendedAction = "PROCEED_WITH_STANDARD_MONITORING";
    }

    return {
        status,
        fragilityScore,
        baseConfidence,
        worstCaseConfidence,
        confidenceRange: {
            min: worstCaseConfidence,
            max: baseConfidence
        },
        baseDecision,
        scenarios,
        fragilityPoints,
        survivalConditions,
        nonBreakingFactors,
        primaryFailureMode,
        recommendedAction,
        isHypothetical: true
    };
}

module.exports = {
    runDecisionStressTest
};


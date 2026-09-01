// engine/tracker.js

/**
 * FEATURE 21: Continuous Thesis Tracker & Decision Memory Engine
 * "What changed since the last time SentinelIQ evaluated this?"
 * 
 * Remembers previous Decision Contracts for the same asset/subject, compares
 * state point-in-time, computes evidence diffs, detects tripwire transitions,
 * tracks version evolution (v1 -> v2), and explains why conclusions shifted.
 */

// Multi-User Isolated Thesis Memory Ledger
const THESIS_MEMORY_LEDGER = {
    user1: { // Arjun (Conservative)
        "TSLA": [
            {
                thesisId: "THESIS-TSLA-V1-USER1",
                userId: "user1",
                question: "[STOCK_ANALYSIS] I want to buy TSLA because earnings are accelerating and EV adoption is growing.",
                asset: "TSLA",
                intent: "STOCK_ANALYSIS",
                decision: "YES",
                verdict: "YES",
                answer: "YES — TSLA presents a viable entry point supported by fundamental growth metrics.",
                timestamp: "2026-08-14T09:30:00.000Z",
                confidence: 78,
                evidenceIds: ["EV-014", "EV-018", "EV-022"],
                evidenceQuality: 82,
                evidenceGraph: [
                    { evidenceId: "EV-014", sourceTier: "TIER 1 — PRIMARY", status: "VALID", reliability: 96 },
                    { evidenceId: "EV-018", sourceTier: "TIER 1 — PRIMARY", status: "VALID", reliability: 94 },
                    { evidenceId: "EV-022", sourceTier: "TIER 2 — HIGH QUALITY", status: "VALID", reliability: 82 }
                ],
                tripwires: [
                    { id: "tw_rev_1", metric: "Revenue Growth", threshold: "8%", status: "SAFE" },
                    { id: "tw_fomo_1", metric: "Holding Time Before Exit", threshold: "24 hours", status: "SAFE" }
                ],
                behavioralRisk: 28,
                challengeStatus: "SUPPORTED",
                challengeSeverity: "LOW",
                thesisVersion: "v1",
                status: "ACTIVE"
            }
        ],
        "EMERGENCY_FUND": [
            {
                thesisId: "THESIS-EMERGENCY-V1-USER1",
                userId: "user1",
                question: "[INFORM] Is your emergency fund sufficient to cover three to six months of living expenses?",
                asset: "PORTFOLIO",
                intent: "EMERGENCY_FUND",
                decision: "YES",
                verdict: "YES",
                answer: "YES — Your emergency fund is sufficient to cover three to six months of living expenses.",
                timestamp: "2026-07-10T14:00:00.000Z",
                confidence: 90,
                evidenceIds: ["EV-014"],
                evidenceQuality: 92,
                evidenceGraph: [{ evidenceId: "EV-014", status: "VALID" }],
                tripwires: [],
                behavioralRisk: 15,
                challengeStatus: "SUPPORTED",
                challengeSeverity: "LOW",
                thesisVersion: "v1",
                status: "ACTIVE"
            }
        ]
    },
    user2: { // Priya (Growth)
        "TSLA": [
            {
                thesisId: "THESIS-TSLA-V1-USER2",
                userId: "user2",
                question: "[STOCK_ANALYSIS] I want to buy TSLA because earnings are accelerating and EV adoption is growing.",
                asset: "TSLA",
                intent: "STOCK_ANALYSIS",
                decision: "YES",
                verdict: "YES",
                answer: "YES — TSLA presents a viable entry point with accelerating top-line revenue.",
                timestamp: "2026-08-14T09:30:00.000Z",
                confidence: 85,
                evidenceIds: ["EV-014", "EV-022"],
                evidenceQuality: 88,
                evidenceGraph: [
                    { evidenceId: "EV-014", sourceTier: "TIER 1 — PRIMARY", status: "VALID", reliability: 96 },
                    { evidenceId: "EV-022", sourceTier: "TIER 2 — HIGH QUALITY", status: "VALID", reliability: 82 }
                ],
                tripwires: [
                    { id: "tw_rev_1", metric: "Revenue Growth", threshold: "8%", status: "SAFE" }
                ],
                behavioralRisk: 22,
                challengeStatus: "SUPPORTED",
                challengeSeverity: "LOW",
                thesisVersion: "v1",
                status: "ACTIVE"
            }
        ]
    },
    user3: { // Karthik (Balanced)
        "EMERGENCY_FUND": [
            {
                thesisId: "THESIS-EMERGENCY-V1-USER3",
                userId: "user3",
                question: "[INFORM] Is your emergency fund sufficient to cover three to six months of living expenses?",
                asset: "PORTFOLIO",
                intent: "EMERGENCY_FUND",
                decision: "YES",
                verdict: "YES",
                answer: "YES — Your emergency fund meets the baseline for living expenses.",
                timestamp: "2026-06-01T10:00:00.000Z",
                confidence: 80,
                evidenceIds: ["EV-014"],
                evidenceQuality: 85,
                evidenceGraph: [{ evidenceId: "EV-014", status: "VALID" }],
                tripwires: [],
                behavioralRisk: 30,
                challengeStatus: "SUPPORTED",
                challengeSeverity: "LOW",
                thesisVersion: "v1",
                status: "ACTIVE"
            }
        ]
    }
};

/**
 * Extracts a canonical subject key from the question or contract intent.
 */
function getSubjectKey(question = "", intentData = {}, assetName = "") {
    if (assetName && assetName !== "the target asset" && assetName.trim() !== "") {
        return assetName.toUpperCase().trim();
    }
    
    const assetMatch = question.match(/(tsla|tesla|reliance|tcs|amd|nvda|apple|aapl|microsoft|msft|google|goog)/i);
    if (assetMatch) {
        return assetMatch[0].toUpperCase();
    }
    
    if (intentData.intent) {
        return intentData.intent.toUpperCase();
    }
    
    return "GENERAL_ANALYSIS";
}

/**
 * Creates a deterministic Thesis Snapshot from a Decision Contract.
 */
function createThesisSnapshot(contract, userId, subjectKey) {
    const evidenceList = contract.provenanceGraph || [];
    return {
        thesisId: contract.contractId || `THESIS-${subjectKey}-${Date.now()}`,
        userId: userId,
        question: contract.question || contract.thesis,
        asset: subjectKey,
        intent: contract.answerType || "ANALYSIS",
        decision: contract.decision || contract.verdict || "YES",
        verdict: contract.verdict || contract.decision || "YES",
        answer: contract.answer || "",
        timestamp: new Date().toISOString(),
        confidence: contract.confidence || 0,
        evidenceIds: evidenceList.map(e => e.evidenceId),
        evidenceQuality: contract.evidenceChallenge?.evidenceQuality || 75,
        evidenceGraph: evidenceList.map(e => ({
            evidenceId: e.evidenceId,
            sourceTier: e.sourceTier,
            sourceName: e.sourceName,
            status: e.status,
            reliability: e.reliability,
            documentDate: e.documentDate
        })),
        tripwires: (contract.tripwires || []).map(tw => ({
            id: tw.id,
            metric: tw.metric,
            operator: tw.operator,
            threshold: `${tw.threshold}${tw.unit !== 'ratio' && tw.unit !== 'status' ? tw.unit : ''}`,
            status: tw.status
        })),
        behavioralRisk: contract.behavioralData?.riskScore || 0,
        challengeStatus: contract.evidenceChallenge?.status || "SUPPORTED",
        challengeSeverity: contract.evidenceChallenge?.challengeSeverity || "LOW",
        thesisVersion: contract.thesisVersion || "v1",
        status: contract.status || "ACTIVE"
    };
}

/**
 * Deterministically computes the evolution diff between a previous thesis snapshot and the current contract.
 */
function evaluateThesisEvolution(previousSnapshot, currentContract, subjectKey) {
    if (!previousSnapshot) {
        return {
            status: "FIRST_EVALUATION",
            isFirstEvaluation: true,
            subject: subjectKey,
            summary: `Initial evaluation established for ${subjectKey}. Decision baseline recorded for continuous tracking.`,
            thesisVersion: currentContract.thesisVersion || "v1",
            changesDetected: false,
            drivers: ["Baseline thesis synthesized across primary intelligence channels."]
        };
    }

    const currConfidence = currentContract.confidence ?? 0;
    const prevConfidence = previousSnapshot.confidence ?? 0;
    const confidenceDelta = currConfidence - prevConfidence;

    const currQuality = currentContract.evidenceChallenge?.evidenceQuality ?? 75;
    const prevQuality = previousSnapshot.evidenceQuality ?? 75;
    const qualityDelta = currQuality - prevQuality;

    const prevDecision = previousSnapshot.decision || "YES";
    const currDecision = currentContract.decision || "YES";
    const decisionChanged = prevDecision !== currDecision;

    // Evidence Set Diff
    const prevEvidenceIds = previousSnapshot.evidenceIds || [];
    const currentEvidenceList = currentContract.provenanceGraph || [];
    const currEvidenceIds = currentEvidenceList.map(e => e.evidenceId);

    const addedEvidence = currEvidenceIds.filter(id => !prevEvidenceIds.includes(id));
    const removedEvidence = prevEvidenceIds.filter(id => !currEvidenceIds.includes(id));
    
    // Check superseded evidence
    const supersededEvidence = currentEvidenceList
        .filter(e => e.status === "SUPERSEDED" || e.reliability === 0)
        .map(e => e.evidenceId);

    // Check Tripwire state changes
    const tripwireShifts = [];
    (currentContract.tripwires || []).forEach(currTw => {
        const prevTw = (previousSnapshot.tripwires || []).find(ptw => ptw.id === currTw.id);
        if (prevTw && prevTw.status !== currTw.status) {
            tripwireShifts.push({
                id: currTw.id,
                metric: currTw.metric,
                previousStatus: prevTw.status,
                currentStatus: currTw.status,
                threshold: currTw.threshold
            });
        }
    });

    // Check Evidence Challenge Severity Shifts
    const prevChallenge = previousSnapshot.challengeStatus || "SUPPORTED";
    const currChallenge = currentContract.evidenceChallenge?.status || "SUPPORTED";
    const challengeShifted = prevChallenge !== currChallenge;

    // Check Behavioral Risk Score Shifts
    const prevRisk = previousSnapshot.behavioralRisk || 0;
    const currRisk = currentContract.behavioralData?.riskScore || 0;
    const riskDelta = currRisk - prevRisk;

    // Detect if material change occurred
    const hasMaterialChange = decisionChanged || 
        Math.abs(confidenceDelta) >= 5 || 
        Math.abs(qualityDelta) >= 5 || 
        supersededEvidence.length > 0 || 
        tripwireShifts.length > 0 || 
        challengeShifted || 
        addedEvidence.length > 0 ||
        currentContract.status === "INVALIDATED";

    // Generate Explanatory Drivers from actual state changes
    const drivers = [];

    if (decisionChanged) {
        drivers.push(`Decision conclusion shifted from ${prevDecision} to ${currDecision}.`);
    }

    if (tripwireShifts.length > 0) {
        tripwireShifts.forEach(ts => {
            drivers.push(`Tripwire [${ts.metric}]: transitioned from ${ts.previousStatus} to ${ts.currentStatus}.`);
        });
    }

    if (supersededEvidence.length > 0) {
        drivers.push(`Primary evidence [${supersededEvidence.join(", ")}] was superseded or invalidated.`);
    }

    if (Math.abs(confidenceDelta) >= 5) {
        const dir = confidenceDelta > 0 ? "increased" : "decreased";
        drivers.push(`Decision confidence ${dir} by ${Math.abs(confidenceDelta)} pts (${prevConfidence}% → ${currConfidence}%).`);
    }

    if (Math.abs(qualityDelta) >= 5) {
        const dir = qualityDelta > 0 ? "strengthened" : "degraded";
        drivers.push(`Evidence Quality ${dir} by ${Math.abs(qualityDelta)} pts (${prevQuality}% → ${currQuality}%).`);
    }

    if (challengeShifted) {
        drivers.push(`Evidence Challenge status changed from ${prevChallenge} to ${currChallenge}.`);
    }

    if (addedEvidence.length > 0) {
        drivers.push(`New intelligence nodes incorporated: [${addedEvidence.join(", ")}].`);
    }

    if (riskDelta >= 15) {
        drivers.push(`MIRROR behavioral risk elevated by +${riskDelta} pts due to detected cognitive bias.`);
    }

    if (drivers.length === 0) {
        drivers.push("No material changes detected. Previous thesis assumptions remain valid.");
    }

    // Version Lifecycle Tracking
    const prevVersion = previousSnapshot.thesisVersion || "v1";
    let nextVersion = currentContract.thesisVersion || "v1";
    if (currentContract.status === "INVALIDATED" || currentContract.thesisVersion === "v2") {
        nextVersion = "v2";
    } else if (hasMaterialChange && prevVersion === "v1" && currentContract.status !== "ACTIVE") {
        nextVersion = "v2";
    }

    return {
        status: hasMaterialChange ? "THESIS_EVOLVED" : "NO_MATERIAL_CHANGE",
        isFirstEvaluation: false,
        subject: subjectKey,
        previousSnapshotDate: previousSnapshot.timestamp,
        versionTransition: `${prevVersion} → ${nextVersion}`,
        decisionShift: {
            previous: prevDecision,
            current: currDecision,
            changed: decisionChanged
        },
        confidenceShift: {
            previous: prevConfidence,
            current: currConfidence,
            delta: confidenceDelta,
            formatted: `${prevConfidence}% → ${currConfidence}% (${confidenceDelta >= 0 ? '+' : ''}${confidenceDelta} pts)`
        },
        evidenceQualityShift: {
            previous: prevQuality,
            current: currQuality,
            delta: qualityDelta,
            formatted: `${prevQuality}% → ${currQuality}% (${qualityDelta >= 0 ? '+' : ''}${qualityDelta} pts)`
        },
        evidenceDiff: {
            previousIds: prevEvidenceIds,
            currentIds: currEvidenceIds,
            added: addedEvidence,
            removed: removedEvidence,
            superseded: supersededEvidence
        },
        tripwireShifts,
        challengeShift: {
            previous: prevChallenge,
            current: currChallenge,
            shifted: challengeShifted
        },
        behavioralRiskShift: {
            previous: prevRisk,
            current: currRisk,
            delta: riskDelta
        },
        drivers,
        summary: decisionChanged 
            ? `Thesis shifted from ${prevDecision} to ${currDecision} (${prevConfidence}% → ${currConfidence}% confidence). ${drivers[0] || ""}`
            : hasMaterialChange
            ? `Thesis maintained (${currDecision}), but evidentiary confidence adjusted from ${prevConfidence}% to ${currConfidence}%.`
            : `Thesis unchanged. All prior evidentiary assumptions for ${subjectKey} remain corroborated.`
    };
}

/**
 * End-to-end function called by orchestrator:
 * Compares current contract with previous snapshot, attaches evolution to contract,
 * and updates continuous decision memory.
 */
function compareAndRecordThesis(contract, userId = "user1", intentData = {}) {
    const targetUser = THESIS_MEMORY_LEDGER[userId] ? userId : "user1";
    if (!THESIS_MEMORY_LEDGER[targetUser]) {
        THESIS_MEMORY_LEDGER[targetUser] = {};
    }

    let extractedAsset = (contract.question || contract.thesis || "").match(/(tsla|tesla|reliance|tcs|amd|nvda|apple|aapl|microsoft|msft|google|goog)/i);
    let assetName = extractedAsset ? extractedAsset[0].toUpperCase() : "";
    const subjectKey = getSubjectKey(contract.question || contract.thesis, intentData, assetName);

    const history = THESIS_MEMORY_LEDGER[targetUser][subjectKey] || [];
    const previousSnapshot = history.length > 0 ? history[0] : null;

    // Evaluate Evolution
    const evolution = evaluateThesisEvolution(previousSnapshot, contract, subjectKey);

    // Create current snapshot and record to memory
    const currentSnapshot = createThesisSnapshot(contract, targetUser, subjectKey);
    
    // Store in history
    if (!THESIS_MEMORY_LEDGER[targetUser][subjectKey]) {
        THESIS_MEMORY_LEDGER[targetUser][subjectKey] = [];
    }
    THESIS_MEMORY_LEDGER[targetUser][subjectKey].unshift(currentSnapshot);

    return evolution;
}

/**
 * Retrieves continuous thesis history for a specific user and subject.
 */
function getThesisHistoryForUser(userId = "user1", subjectKey = "TSLA") {
    const targetUser = THESIS_MEMORY_LEDGER[userId] ? userId : "user1";
    return THESIS_MEMORY_LEDGER[targetUser]?.[subjectKey] || [];
}

module.exports = {
    THESIS_MEMORY_LEDGER,
    getSubjectKey,
    createThesisSnapshot,
    evaluateThesisEvolution,
    compareAndRecordThesis,
    getThesisHistoryForUser
};


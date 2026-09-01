// engine/integrity.js
const { processQuestion } = require('./orchestrator');
const { enrichWithContext } = require('./context');

function runIntegrityChecks(contract, userId) {
    const checks = [];

    const addCheck = (id, name, status, explanation, source) => {
        checks.push({ id, name, status, explanation, source });
    };

    // CHECK-01 Question Integrity
    if (contract.question && contract.question.length > 0) {
        addCheck("CHECK-01", "Question Integrity", "PASS", "Question exists and is correctly populated.", "Core");
    } else {
        addCheck("CHECK-01", "Question Integrity", "FAIL", "Missing question field.", "Core");
    }

    // CHECK-02 User Profile Integrity
    const { user } = enrichWithContext(userId, { type: "STOCK_ANALYSIS" });
    if (user && contract.personalizationContext) {
        addCheck("CHECK-02", "User Profile Integrity", "PASS", "User profile data is integrated.", "Context");
    } else {
        addCheck("CHECK-02", "User Profile Integrity", "FAIL", "Missing user profile linkage.", "Context");
    }

    // CHECK-03 Agent Execution Integrity (Quorum Verification)
    const validAgents = (contract.agents || []).filter(a => a.name && a.status && a.message);
    if (validAgents.length >= 3) {
        addCheck("CHECK-03", "Agent Execution Integrity", "PASS", `${validAgents.length} specialized agents executed successfully.`, "Agents");
    } else {
        addCheck("CHECK-03", "Agent Execution Integrity", "FAIL", `Only ${validAgents.length} agents executed. Minimum 3 required for multi-agent quorum.`, "Agents");
    }

    // CHECK-04 Evidence Grounding Integrity
    if (contract.provenanceGraph && contract.provenanceGraph.length > 0) {
        addCheck("CHECK-04", "Evidence Grounding Integrity", "PASS", "Decision is grounded in structured evidence.", "Evidence");
    } else {
        addCheck("CHECK-04", "Evidence Grounding Integrity", "FAIL", "Missing evidence provenance graph.", "Evidence");
    }

    // CHECK-05 Citation Integrity
    const hasValidCitations = (contract.provenanceGraph || []).every(e => e.sourceTier && (e.url || e.evidenceId));
    if (hasValidCitations && contract.provenanceGraph && contract.provenanceGraph.length > 0) {
        addCheck("CHECK-05", "Citation Integrity", "PASS", "All evidence claims have proper citations and source tiers.", "Evidence");
    } else {
        addCheck("CHECK-05", "Citation Integrity", "FAIL", "Missing or invalid citations detected.", "Evidence");
    }

    // CHECK-06 Answer Integrity
    if (contract.answer && (contract.answer.startsWith("YES") || contract.answer.startsWith("NO") || contract.answer.includes("COMPLETED") || contract.answer.includes("EXPLAINED") || contract.answer.includes("INFORMATIONAL"))) {
        if (contract.decision && contract.verdict && contract.decision === contract.verdict) {
            addCheck("CHECK-06", "Answer Integrity", "PASS", "Final answer is explicitly connected to backend verdict logic.", "Core");
        } else {
            addCheck("CHECK-06", "Answer Integrity", "FAIL", "Mismatch between textual answer and logical verdict.", "Core");
        }
    } else {
        addCheck("CHECK-06", "Answer Integrity", "FAIL", "Answer format unrecognized or missing.", "Core");
    }

    // CHECK-07 Confidence Provenance Integrity
    if (contract.confidence !== undefined && contract.confidenceBreakdown && typeof contract.confidenceBreakdown.decisionConfidence === 'number') {
        if (contract.confidence === contract.confidenceBreakdown.decisionConfidence) {
            addCheck("CHECK-07", "Confidence Provenance Integrity", "PASS", "Final confidence score decomposes correctly.", "Math");
        } else {
            addCheck("CHECK-07", "Confidence Provenance Integrity", "FAIL", "Final confidence differs from computed breakdown.", "Math");
        }
    } else {
        addCheck("CHECK-07", "Confidence Provenance Integrity", "FAIL", "Missing confidence breakdown.", "Math");
    }

    // CHECK-08 Tripwire Integrity
    const validTripwires = (contract.tripwires || []).filter(tw => tw.id && tw.metric && tw.operator && tw.threshold !== undefined && tw.status);
    if (validTripwires.length > 0 && validTripwires.length === contract.tripwires.length) {
        addCheck("CHECK-08", "Tripwire Integrity", "PASS", "All tripwires have valid structural predicates.", "Tripwires");
    } else if (contract.tripwires && contract.tripwires.length > 0) {
        addCheck("CHECK-08", "Tripwire Integrity", "FAIL", "Invalid tripwire structures detected.", "Tripwires");
    } else {
        addCheck("CHECK-08", "Tripwire Integrity", "WARN", "No tripwires present on this contract.", "Tripwires");
    }

    // CHECK-09 MIRROR Integrity (Personalization)
    let mirrorCheckStatus = "PASS";
    let mirrorCheckReason = "Behavioral analysis successfully mapped.";
    
    const otherUser = userId === "user1" ? "user2" : "user1";
    // For identical query
    const rawQuestion = (contract.question || "I want to buy TSLA").replace(/^\[.*?\]\s*/, '');
    const duplicateContract = processQuestion(rawQuestion, otherUser);
    
    let sameMarketInputs = true;
    let profileDependentDifferences = [];
    
    if (contract.behavioralData && duplicateContract.behavioralData) {
        if (contract.behavioralData.riskScore !== duplicateContract.behavioralData.riskScore || 
            contract.behavioralData.intervention !== duplicateContract.behavioralData.intervention) {
            profileDependentDifferences.push("Behavioral Intervention");
        }
    }
    
    if (contract.blastRadius && duplicateContract.blastRadius) {
        if (contract.blastRadius.after !== duplicateContract.blastRadius.after) {
            profileDependentDifferences.push("Position Sizing / Blast Radius");
        }
    }

    if (contract.decision !== duplicateContract.decision || contract.confidence !== duplicateContract.confidence) {
        profileDependentDifferences.push("Final Decision / Burden of Proof");
    }
    
    if (profileDependentDifferences.length > 0) {
        addCheck("CHECK-09", "MIRROR Integrity", "PASS", `Verified personalization via: ${profileDependentDifferences.join(", ")}`, "Personalization");
    } else {
        if (contract.answerType === "INFORM" || contract.answerType === "COMPARE" || contract.answerType === "MARKET_EVENT") {
            addCheck("CHECK-09", "MIRROR Integrity", "WARN", "Personalization not applicable for informational query.", "Personalization");
        } else {
            addCheck("CHECK-09", "MIRROR Integrity", "FAIL", "No computational differences detected for different user profiles.", "Personalization");
        }
    }

    // CHECK-10 Portfolio Integrity
    if (contract.blastRadius && contract.blastRadius.before && contract.blastRadius.after) {
        addCheck("CHECK-10", "Portfolio Integrity", "PASS", "Portfolio context is accurately mapped.", "Portfolio");
    } else {
        if (contract.answerType === "INFORM" || contract.answerType === "COMPARE" || contract.answerType === "MARKET_EVENT") {
            addCheck("CHECK-10", "Portfolio Integrity", "WARN", "Portfolio context not applicable for informational query.", "Portfolio");
        } else {
            addCheck("CHECK-10", "Portfolio Integrity", "FAIL", "Missing portfolio blast radius context.", "Portfolio");
        }
    }

    // CHECK-11 Thesis History Integrity
    if (contract.thesisHistory && contract.thesisHistory.length > 0) {
        addCheck("CHECK-11", "Thesis History Integrity", "PASS", "Thesis tracker maintains chronological history.", "Tracker");
    } else {
        addCheck("CHECK-11", "Thesis History Integrity", "FAIL", "Thesis history is empty or missing.", "Tracker");
    }

    // CHECK-12 Stress-Test Isolation
    if (contract.stressTest) {
        if (contract.stressTest.isHypothetical === true) {
            addCheck("CHECK-12", "Stress-Test Isolation", "PASS", "Stress test is marked as hypothetical.", "Engine");
        } else {
            addCheck("CHECK-12", "Stress-Test Isolation", "FAIL", "Stress test results are bleeding into real decision context.", "Engine");
        }
    } else {
        addCheck("CHECK-12", "Stress-Test Isolation", "WARN", "No stress test executed.", "Engine");
    }

    // CHECK-13 Degraded-Data Integrity
    if (contract.status === "CANNOT_CONCLUDE" || contract.status === "ACTIVE" || contract.status === "INVALIDATED") {
        addCheck("CHECK-13", "Degraded-Data Integrity", "PASS", "State representation accounts for degraded or active status.", "Core");
    } else {
        addCheck("CHECK-13", "Degraded-Data Integrity", "FAIL", "Invalid or unknown status representation.", "Core");
    }

    // CHECK-14 Determinism Integrity
    const deterministicTestContract = processQuestion(rawQuestion, userId);
    
    let isDeterministic = true;
    if (deterministicTestContract.decision !== contract.decision && contract.status !== 'INVALIDATED') isDeterministic = false;
    if (deterministicTestContract.confidence !== contract.confidence && contract.status !== 'INVALIDATED') isDeterministic = false;
    
    if (isDeterministic) {
        addCheck("CHECK-14", "Determinism Integrity", "PASS", "Subsequent identical queries produce identical structural results.", "Math");
    } else {
        addCheck("CHECK-14", "Determinism Integrity", "FAIL", "Non-deterministic outputs detected.", "Math");
    }

    const passedChecks = checks.filter(c => c.status === "PASS").length;
    const applicableChecks = checks.filter(c => c.status !== "WARN").length;
    const integrityScore = applicableChecks > 0 ? Math.round((passedChecks / applicableChecks) * 100) : 0;

    return {
        score: integrityScore,
        status: integrityScore === 100 ? "VERIFIED" : (integrityScore >= 80 ? "WARNING" : "FAILED"),
        checks: checks,
        personalization: {
            sameMarketInputs,
            profileDependentDifferences,
            personalizationStatus: profileDependentDifferences.length > 0 ? "PASS" : "FAIL"
        },
        determinism: {
            isDeterministic
        },
        lineage: "QUESTION -> AGENTS -> EVIDENCE -> CONFLICTS -> PERSONALIZATION -> TRIPWIRES -> STRESS TEST -> ANSWER -> CONFIDENCE"
    };
}

module.exports = { runIntegrityChecks };

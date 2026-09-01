const { processQuestion } = require('./orchestrator');
const { GLOBAL_EVIDENCE_GRAPH } = require('./evidence');

async function runDecisionReplay(contract, userId) {
    const thesis = contract ? (contract.question || contract.thesis) : "I want to buy TSLA because earnings are accelerating and EV adoption is growing.";
    
    // Preserve original evidence state
    const targetEvidence = GLOBAL_EVIDENCE_GRAPH.find(e => e.evidenceId === "EV-014");
    let originalStatus = "VALID";
    let originalReliability = 96;
    let originalClaim = "Revenue growth accelerated by 11.2% YoY in latest quarterly period.";
    if (targetEvidence) {
        originalStatus = targetEvidence.status;
        originalReliability = targetEvidence.reliability;
        originalClaim = targetEvidence.claim;
    }

    // Step 1, 2, 3: Initial contract evaluation (v1)
    const v1 = await processQuestion(thesis, userId);
    v1.replayStage = "v1";

    // Step 4 & 5: Trigger tripwire (Invalidate EV-014)
    if (targetEvidence) {
        targetEvidence.status = "SUPERSEDED";
        targetEvidence.reliability = 0;
        targetEvidence.claim = "Revenue growth slowed to 6.5%, missing the 8.0% threshold.";
    }

    // Step 6 & 7: Generate v2
    const v2 = await processQuestion(thesis, userId);
    v2.replayStage = "v2";
    v2.contractId = v1.contractId + "-V2";

    // Step 8 is integrity check, done implicitly in orchestration/frontend

    // Restore evidence state
    if (targetEvidence) {
        targetEvidence.status = originalStatus;
        targetEvidence.reliability = originalReliability;
        targetEvidence.claim = originalClaim;
    }

    return {
        v1,
        v2,
        events: [
            { step: 1, name: "Initial evaluation" },
            { step: 2, name: "Contract v1 Issued" },
            { step: 3, name: "Tripwires armed" },
            { step: 4, name: "Market/evidence event" },
            { step: 5, name: "Tripwire triggered" },
            { step: 6, name: "Self-retraction" },
            { step: 7, name: "v2 generated" },
            { step: 8, name: "Integrity recheck" }
        ]
    };
}

module.exports = {
    runDecisionReplay
};

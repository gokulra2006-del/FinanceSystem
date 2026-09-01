const { runDecisionReplay } = require('../backend/engine/replay');

function testFeature24() {
    console.log("=== STARTING FEATURE 24: REPLAY ENGINE TEST SUITE ===\n");
    let passed = 0;
    let failed = 0;

    const assert = (condition, msg) => {
        if (condition) {
            console.log(`[PASS] ${msg}`);
            passed++;
        } else {
            console.error(`[FAIL] ${msg}`);
            failed++;
        }
    };

    try {
        const dummyContract = {
            thesis: "I want to buy TSLA because earnings are accelerating and EV adoption is growing."
        };

        const result = runDecisionReplay(dummyContract, "user2");

        // Test 1-5: Structure
        assert(result.v1 !== undefined, "v1 contract is generated");
        assert(result.v2 !== undefined, "v2 contract is generated");
        assert(result.events !== undefined, "Events array is generated");
        assert(result.events.length === 8, "Events array has 8 steps");
        assert(result.v1.replayStage === "v1", "v1 is tagged correctly");
        
        // Test 6-10: Evidence mutations
        assert(result.v2.replayStage === "v2", "v2 is tagged correctly");
        assert(result.v2.contractId !== result.v1.contractId, "v1 and v2 have different contract IDs");
        
        const ev1 = result.v1.provenanceGraph.find(e => e.evidenceId === "EV-014");
        const ev2 = result.v2.provenanceGraph.find(e => e.evidenceId === "EV-014");
        
        assert(ev1 && ev1.status === "VALID", "v1 maintains valid evidence");
        assert(ev2 && ev2.status === "SUPERSEDED", "v2 triggers evidence invalidation");
        assert(ev1.reliability === 96, "v1 evidence reliability is intact");
        assert(ev2.reliability === 0, "v2 evidence reliability is zeroed");
        
        // Test 11-15: Verdict and Confidence logic
        assert(result.v1.verdict === "YES", "v1 verdict is YES");
        assert(result.v2.verdict === "NO" || result.v2.confidence < result.v1.confidence, "v2 verdict flips or confidence drops");
        assert(result.v1.confidence >= 60, "v1 confidence is appropriately high");
        assert(result.v2.confidence < result.v1.confidence, "v2 confidence drops below v1");
        
        console.log(`\n=== RESULTS ===`);
        console.log(`Passed: ${passed}/15`);
        console.log(`Failed: ${failed}/15`);
        
    } catch (err) {
        console.error("Test Suite crashed:", err);
    }
}

testFeature24();

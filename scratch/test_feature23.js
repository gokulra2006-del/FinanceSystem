const { runIntegrityChecks } = require('../backend/engine/integrity');
const { processQuestion } = require('../backend/engine/orchestrator');

console.log("==========================================");
console.log("RUNNING FEATURE 23 TESTS");
console.log("==========================================\n");

let passed = 0;
let failed = 0;

function assertCheck(name, actualStatus, expectedStatus) {
    if (actualStatus === expectedStatus) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
    } else {
        console.log(`❌ [FAIL] ${name} - Expected ${expectedStatus}, got ${actualStatus}`);
        failed++;
    }
}

// 1. Generate base contract for tests
const baseContract = processQuestion("I want to buy TSLA because earnings are accelerating and EV adoption is growing.", "user1");

// Test 1: Valid contract passes integrity
const res1 = runIntegrityChecks(baseContract, "user1");
assertCheck("1. Valid contract passes overall integrity (Score 100)", res1.score, 100);

// Test 2: Missing answer fails Answer Integrity
const contractNoAnswer = JSON.parse(JSON.stringify(baseContract));
contractNoAnswer.answer = "";
const res2 = runIntegrityChecks(contractNoAnswer, "user1");
assertCheck("2. Missing answer fails CHECK-06", res2.checks.find(c => c.id === 'CHECK-06').status, "FAIL");

// Test 3: Missing citations fail Citation Integrity
const contractNoCitations = JSON.parse(JSON.stringify(baseContract));
contractNoCitations.provenanceGraph.forEach(e => {
    delete e.sourceTier;
    delete e.url;
});
const res3 = runIntegrityChecks(contractNoCitations, "user1");
assertCheck("3. Missing citations fail CHECK-05", res3.checks.find(c => c.id === 'CHECK-05').status, "FAIL");

// Test 4: Fewer than 3 agents fails Agent Quorum
const contractFewAgents = JSON.parse(JSON.stringify(baseContract));
contractFewAgents.agents = contractFewAgents.agents.slice(0, 2);
const res4 = runIntegrityChecks(contractFewAgents, "user1");
assertCheck("4. Fewer than 3 agents fails CHECK-03", res4.checks.find(c => c.id === 'CHECK-03').status, "FAIL");

// Test 5: Invalid tripwire fails Tripwire Integrity
const contractBadTw = JSON.parse(JSON.stringify(baseContract));
if (contractBadTw.tripwires.length > 0) {
    delete contractBadTw.tripwires[0].threshold;
}
const res5 = runIntegrityChecks(contractBadTw, "user1");
assertCheck("5. Invalid tripwire fails CHECK-08", res5.checks.find(c => c.id === 'CHECK-08').status, "FAIL");

// Test 6: Stress-test mutation is detected
const contractBadStress = JSON.parse(JSON.stringify(baseContract));
contractBadStress.stressTest.isHypothetical = false;
const res6 = runIntegrityChecks(contractBadStress, "user1");
assertCheck("6. Stress-test mutation fails CHECK-12", res6.checks.find(c => c.id === 'CHECK-12').status, "FAIL");

// Test 7: Deterministic repeated evaluation passes (tested implicitly via CHECK-14 in valid contract)
assertCheck("7. Deterministic evaluation passes CHECK-14", res1.checks.find(c => c.id === 'CHECK-14').status, "PASS");

// Test 8: Profile personalization passes
assertCheck("8. Profile personalization passes CHECK-09", res1.checks.find(c => c.id === 'CHECK-09').status, "PASS");

// Test 9: Fake confidence does not determine answer (Answer vs Confidence mismatch)
const contractFakeConf = JSON.parse(JSON.stringify(baseContract));
contractFakeConf.confidence = 99; // manipulated
const res9 = runIntegrityChecks(contractFakeConf, "user1");
assertCheck("9. Manipulated confidence fails CHECK-07", res9.checks.find(c => c.id === 'CHECK-07').status, "FAIL");

// Test 10: Integrity score is calculated correctly
assertCheck("10. Score calculation logic applies correctly (Bad score < 100)", res9.score < 100, true);

console.log(`\nTests completed: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}

// engine/devilsAdvocate.js

/**
 * Devil's Advocate Agent
 * Actively tries to disprove the system's own recommendation.
 */
function runDevilsAdvocate(initialDecision, initialConfidence, intentData, user, assetName) {
    // We start with a base assumption that the agent will challenge the decision
    let robustnessScore = 100;
    let confidenceAdjustment = 0;
    
    let counterarguments = [];
    let assumptionsChallenged = [];
    let failureConditions = [];
    
    // Simulate RAG / Document retrieval based on the asset and intent
    let challengeLevel = "LOW"; // LOW, MEDIUM, HIGH, CRITICAL
    
    if (initialDecision === "YES") {
        assumptionsChallenged.push({ assumption: `${assetName} earnings continue growing`, status: "Weakly supported" });
        assumptionsChallenged.push({ assumption: "Current margins remain stable", status: "Supported" });
        
        // Context-aware challenges
        if (user.portfolio.techExposure > 30) {
            counterarguments.push({
                title: "Portfolio Concentration Risk",
                severity: "HIGH",
                explanation: `While ${assetName} may be fundamentally sound, your existing tech exposure is already at ${user.portfolio.techExposure}%. Adding this position increases concentration risk significantly.`,
                evidence: [{ source: "Portfolio Analytics", detail: "Current Tech Exposure" }]
            });
            robustnessScore -= 25;
            confidenceAdjustment -= 15;
            challengeLevel = "HIGH";
            
            failureConditions.push("Technology exposure exceeds your maximum portfolio limit.");
        }
        
        // Add a fundamental counterargument
        counterarguments.push({
            title: "Valuation vs Historical Average",
            severity: "MEDIUM",
            explanation: `Current forward P/E is trading 20% above the 5-year historical average, pricing in perfect execution. Any macroeconomic slowdown could trigger a severe multiple compression.`,
            evidence: [{ source: "Q3 Sector Report", detail: "Valuation Metrics" }]
        });
        robustnessScore -= 15;
        confidenceAdjustment -= 10;
        if (challengeLevel === "LOW") challengeLevel = "MEDIUM";

        failureConditions.push("Revenue growth misses consensus estimates in the upcoming quarter.");
        failureConditions.push("Sector rotation away from high-beta tech accelerates.");

    } else if (initialDecision === "NO") {
        // Challenging a BEARISH / NO decision
        assumptionsChallenged.push({ assumption: "Negative sentiment will persist", status: "Weakly supported" });
        
        counterarguments.push({
            title: "Overstated Bearish Thesis",
            severity: "MEDIUM",
            explanation: `The bearish view heavily weights recent technical breakdowns, but institutional accumulation has quietly increased at these support levels over the last 72 hours.`,
            evidence: [{ source: "Institutional Flow Data", detail: "Block Trades" }]
        });
        robustnessScore -= 12;
        confidenceAdjustment -= 5;
        challengeLevel = "MEDIUM";
        
        failureConditions.push("Institutional buying accelerates above key resistance levels.");
    }
    
    // Ensure robustness and confidence stay within bounds
    robustnessScore = Math.max(0, Math.min(100, robustnessScore));
    let finalConfidence = Math.max(0, Math.min(100, initialConfidence + confidenceAdjustment));
    
    // Outcome Logic (Decision Kill Switch)
    let finalDecision = initialDecision;
    let finalVerdict = initialDecision;
    let decisionImpact = "The recommendation survived adversarial review with minor confidence adjustments.";
    
    if (robustnessScore < 50 && initialDecision === "YES") {
        finalDecision = "WAIT";
        finalVerdict = "WAIT";
        decisionImpact = `The original bullish thesis is not sufficiently robust for your ${user.profile} profile under adversarial review.`;
        challengeLevel = "CRITICAL";
    } else if (robustnessScore < 60) {
        decisionImpact = "Significant weaknesses were identified. Proceed with caution and reduced sizing.";
    }
    
    return {
        challengeLevel,
        initialConfidence,
        finalConfidence,
        robustnessScore,
        confidenceAdjustment,
        counterarguments,
        assumptionsChallenged,
        failureConditions,
        decisionImpact,
        finalDecision,
        finalVerdict
    };
}

module.exports = { runDevilsAdvocate };

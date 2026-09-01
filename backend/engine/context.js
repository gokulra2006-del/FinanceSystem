// engine/context.js

/**
 * Simulates injecting personal user data (from a database) into the Agent Context.
 * This guarantees the exact same question will yield different answers 
 * for different authenticated users.
 */

// Mock Database of user contexts
const USER_PROFILES = {
    user1: {
        name: "Arjun",
        profile: "Conservative",
        riskTolerance: "Low",
        horizon: "Short-term",
        portfolio: { total: "₹1,24,500", techExposure: 41, cash: 45 },
        behavioral: { 
            recentFOMO: true, 
            panicSells: false,
            historicalDecisions: [
                { id: "D12", asset: "TSLA", entryReason: "Strong upward momentum", outcome: "-8.4%", pattern: "FOMO" },
                { id: "D18", asset: "AMD", entryReason: "Everyone is talking about AI", outcome: "-11.2%", pattern: "Confirmation Bias" },
                { id: "D27", asset: "NVDA", entryReason: "Price breakout", outcome: "+2.1%", pattern: "Momentum" }
            ]
        }
    },
    user2: {
        name: "Priya",
        profile: "Growth",
        riskTolerance: "High",
        horizon: "Long-term",
        portfolio: { total: "₹4,82,000", techExposure: 30, cash: 5 },
        behavioral: { 
            recentFOMO: false, 
            panicSells: false,
            historicalDecisions: [
                { id: "D44", asset: "HDFCBANK", entryReason: "Fundamental undervaluation", outcome: "+14.2%", pattern: "Value" },
                { id: "D51", asset: "INFY", entryReason: "Long-term compounding", outcome: "+8.4%", pattern: "Steady Growth" }
            ]
        }
    },
    user3: {
        name: "Karthik",
        profile: "Balanced",
        riskTolerance: "Medium",
        horizon: "Medium-term",
        portfolio: { total: "₹2,76,500", techExposure: 35, cash: 15 },
        behavioral: { 
            recentFOMO: false, 
            panicSells: true,
            historicalDecisions: []
        }
    }
};

function enrichWithContext(userId, intentData) {
    const user = USER_PROFILES[userId] || USER_PROFILES['user1'];
    
    // We pass back the context rules for the engine to modify the confidence / blast radius
    let blastRadiusWarning = "";
    let confidencePenalty = 0;
    let behavioralRiskScore = 30; // Base score
    let behavioralIntervention = "No severe behavioral patterns detected. Proceed with standard caution.";
    
    if (intentData.intent === "STOCK_ANALYSIS" || intentData.intent === "PORTFOLIO_RISK") {
        if (user.portfolio.techExposure > 40) {
            blastRadiusWarning = `WARNING: Your portfolio is currently at ${user.portfolio.techExposure}% Tech Exposure. Adding this position severely violates your ${user.profile} risk limits.`;
            confidencePenalty += 15;
        } else if (user.portfolio.techExposure > 32) {
            blastRadiusWarning = `Caution: Portfolio at ${user.portfolio.techExposure}% Tech. Moderate sizing suggested to preserve ${user.profile} allocation.`;
            confidencePenalty += 6;
        } else {
            blastRadiusWarning = `Position sizing fits within your ${user.portfolio.techExposure}% Tech limit.`;
        }
    }

    if (intentData.intent === "BEHAVIORAL_RISK" || intentData.requiresContract) {
        if (user.behavioral.recentFOMO) {
            confidencePenalty += 10;
            behavioralRiskScore = 78;
            behavioralIntervention = "This decision resembles 3 previous momentum entries. 2 ended in losses. Before proceeding, can you identify a fundamental reason for entering that is independent of recent price movement?";
        } else if (user.behavioral.panicSells) {
            confidencePenalty += 5;
            behavioralRiskScore = 55;
            behavioralIntervention = "Past behavioral pattern indicates premature exits during volatility drawdowns. Pre-commit to thesis-based stop rules.";
        }
    }

    return {
        user,
        blastRadiusWarning,
        confidencePenalty,
        behavioralRiskScore,
        behavioralIntervention
    };
}

module.exports = { enrichWithContext };

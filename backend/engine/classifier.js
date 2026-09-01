// engine/classifier.js

/**
 * Dynamically classifies the user's natural language input into a specific Intent.
 * This determines WHICH agents are spun up.
 */
function classifyIntent(query) {
    const q = query.toLowerCase();

    // 1. EMERGENCY_FUND / LIQUIDITY CHECK
    if (q.includes("emergency fund") || q.includes("living expenses") || q.includes("cash reserve") || q.includes("savings buffer") || (q.includes("cash") && (q.includes("enough") || q.includes("sufficient")))) {
        return {
            intent: "EMERGENCY_FUND",
            type: "INFORM",
            agents: ["Portfolio Risk", "Macro & Sector", "Adjudicator"],
            requiresContract: false
        };
    }

    // 2. STOCK_COMPARISON
    if (q.includes("compare") || (q.includes("vs") && !q.includes("buy"))) {
        return {
            intent: "STOCK_COMPARISON",
            type: "COMPARE",
            agents: ["Fundamental Evidence", "Macro & Sector", "Signal Core"],
            requiresContract: false
        };
    }

    // 3. PORTFOLIO_RISK / EXPOSURE
    if (q.includes("overexposed") || q.includes("exposure") || q.includes("happen to my portfolio")) {
        return {
            intent: "PORTFOLIO_RISK",
            type: "ANALYZE",
            agents: ["Portfolio Risk", "Macro & Sector", "Adjudicator"],
            requiresContract: false
        };
    }

    // 4. MARKET_EVENT / WHY DID X FALL
    if (q.includes("why did") || q.includes("fall today") || q.includes("jump today")) {
        return {
            intent: "MARKET_EVENT",
            type: "INFORM",
            agents: ["Signal Core", "Fundamental Evidence", "Macro & Sector", "Adjudicator"],
            requiresContract: false
        };
    }

    // 5. BEHAVIORAL_RISK
    if (q.includes("fomo") || q.includes("emotional") || q.includes("bias")) {
        return {
            intent: "BEHAVIORAL_RISK",
            type: "CAUTION",
            agents: ["Behavioral Mirror", "Adjudicator"],
            requiresContract: false
        };
    }

    // 6. EVIDENCE_VERIFICATION
    if (q.includes("supported by") || q.includes("latest filing") || q.includes("evidence")) {
        return {
            intent: "EVIDENCE_VERIFICATION",
            type: "ANALYZE",
            agents: ["Fundamental Evidence", "Adversarial Agent", "Adjudicator"],
            requiresContract: false
        };
    }

    // 7. ACTIONABLE INVESTMENT (Default fallback if "buy", "sell", "invest" is found)
    if (q.includes("buy") || q.includes("sell") || q.includes("invest") || q.includes("allocate")) {
        return {
            intent: "STOCK_ANALYSIS",
            type: "STOCK_ANALYSIS",
            // For a full investment thesis, we run the gauntlet.
            agents: ["Signal Core", "Fundamental Evidence", "Portfolio Risk", "Behavioral Mirror", "Adversarial Agent", "Quantum Predictor", "Adjudicator"],
            requiresContract: true
        };
    }

    // 8. GENERAL_FINANCIAL_RESEARCH
    return {
        intent: "GENERAL_FINANCIAL_RESEARCH",
        type: "INFORM",
        agents: ["Fundamental Evidence", "Macro & Sector", "Adjudicator"],
        requiresContract: false
    };
}

module.exports = { classifyIntent };

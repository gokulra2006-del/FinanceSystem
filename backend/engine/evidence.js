// engine/evidence.js

/**
 * FEATURE 7: Evidence Integrity & Confidence Provenance Engine
 * 
 * Deterministically computes explainable confidence, source tiers,
 * reasoning chains, agent disagreements, contradiction penalties,
 * and source independence lineage.
 */

// 1. Evidence Quality Hierarchy (Tiers 1 to 4)
const EVIDENCE_TIERS = {
    TIER_1: {
        id: "TIER 1 — PRIMARY",
        name: "Primary Regulatory & Exchange Disclosures",
        desc: "Official SEC filings (10-K, 10-Q, 8-K), regulatory filings, verified corporate press releases.",
        baseReliability: 96,
        badgeColor: "blue"
    },
    TIER_2: {
        id: "TIER 2 — HIGH QUALITY",
        name: "Audited Financials & Institutional Research",
        desc: "Audited financial statements, earnings call audio transcripts, institutional equity research.",
        baseReliability: 85,
        badgeColor: "purple"
    },
    TIER_3: {
        id: "TIER 3 — SECONDARY",
        name: "Reputable Financial Press & Market Pulse",
        desc: "Reputable financial news reporting, sell-side analyst consensus, market flow data.",
        baseReliability: 70,
        badgeColor: "amber"
    },
    TIER_4: {
        id: "TIER 4 — WEAK",
        name: "Unverified Commentary & Social Rumor Streams",
        desc: "Unverified social sentiment, retail blog posts, unattributed claims.",
        baseReliability: 35,
        badgeColor: "gray"
    }
};

// 2. Mock Graph of Verified Evidence Nodes across Tiers
const GLOBAL_EVIDENCE_GRAPH = [
    {
        evidenceId: "EV-014",
        claim: "Revenue growth accelerated by 11.2% YoY in latest quarterly period.",
        sourceType: "FILING",
        sourceTier: "TIER 1 — PRIMARY",
        sourceName: "SEC Form 10-Q Quarterly Filing",
        publisher: "U.S. Securities and Exchange Commission (EDGAR)",
        documentDate: "2026-10-14",
        retrievedAt: new Date().toISOString(),
        relevance: 94,
        recency: 98,
        reliability: 96,
        independence: 100, // Primary root source
        supports: ["Fundamental Evidence", "Signal Core"],
        contradicts: [],
        status: "VALID",
        relatedTripwire: "tw_rev_1",
        derivesFrom: null
    },
    {
        evidenceId: "EV-018",
        claim: "Debt service obligations increased 27% due to floating rate debt structure.",
        sourceType: "FILING",
        sourceTier: "TIER 1 — PRIMARY",
        sourceName: "Form 10-Q MD&A Risk Disclosures",
        publisher: "U.S. Securities and Exchange Commission (EDGAR)",
        documentDate: "2026-10-14",
        retrievedAt: new Date().toISOString(),
        relevance: 88,
        recency: 98,
        reliability: 94,
        independence: 100, // Primary root source
        supports: ["Adversarial Agent"],
        contradicts: ["Fundamental Evidence"],
        status: "VALID",
        relatedTripwire: null,
        derivesFrom: null
    },
    {
        evidenceId: "EV-022",
        claim: "Institutional capital rotation models indicate net outflow from high-multiple tech.",
        sourceType: "RESEARCH",
        sourceTier: "TIER 2 — HIGH QUALITY",
        sourceName: "Institutional Capital Flow Index",
        publisher: "Morgan Stanley Institutional Research",
        documentDate: "2026-10-12",
        retrievedAt: new Date().toISOString(),
        relevance: 78,
        recency: 85,
        reliability: 82,
        independence: 85,
        supports: ["Macro & Sector"],
        contradicts: [],
        status: "VALID",
        relatedTripwire: "tw_sec_1",
        derivesFrom: null
    },
    {
        evidenceId: "EV-027",
        claim: "Management withdrew forward guidance for Q4 gross operating margins.",
        sourceType: "TRANSCRIPT",
        sourceTier: "TIER 2 — HIGH QUALITY",
        sourceName: "Q3 Earnings Call Audio Transcript",
        publisher: "Corporate Investor Relations",
        documentDate: "2026-10-14",
        retrievedAt: new Date().toISOString(),
        relevance: 84,
        recency: 92,
        reliability: 88,
        independence: 90,
        supports: ["Adversarial Agent"],
        contradicts: ["Signal Core"],
        status: "VALID",
        relatedTripwire: "tw_miss_1",
        derivesFrom: null
    },
    {
        evidenceId: "EV-031",
        claim: "Tech sector correlation rose above 0.78 amid broader index rebalancing.",
        sourceType: "MARKET_DATA",
        sourceTier: "TIER 3 — SECONDARY",
        sourceName: "Financial Market Commentary & Flow Analysis",
        publisher: "Bloomberg Market Pulse",
        documentDate: "2026-10-15",
        retrievedAt: new Date().toISOString(),
        relevance: 70,
        recency: 90,
        reliability: 70,
        independence: 70,
        supports: ["Macro & Sector"],
        contradicts: [],
        status: "VALID",
        relatedTripwire: null,
        derivesFrom: null
    },
    {
        evidenceId: "EV-035",
        claim: "Social volume surged +240% following retail breakout chatter.",
        sourceType: "SOCIAL_AGGREGATOR",
        sourceTier: "TIER 4 — WEAK",
        sourceName: "Social Sentiment Aggregator",
        publisher: "Retail Trading Forum Tracker (Unverified)",
        documentDate: "2026-10-15",
        retrievedAt: new Date().toISOString(),
        relevance: 45,
        recency: 95,
        reliability: 35,
        independence: 20, // Derived from secondary market chatter
        supports: ["Signal Core"],
        contradicts: ["Portfolio Risk"],
        status: "VALID",
        relatedTripwire: null,
        derivesFrom: "EV-031"
    }
];

/**
 * Deterministically computes the explainable Confidence Breakdown & Provenance Chain.
 */
function computeConfidence(evidenceNodes, agents, userContext = {}, missingDataCount = 0, tripwireTriggered = false) {
    const validNodes = (evidenceNodes || []).filter(e => e.status === "VALID");
    const supersededNodes = (evidenceNodes || []).filter(e => e.status === "SUPERSEDED");

    // 1. Evidence Quality / Strength (0-100)
    const avgQuality = validNodes.length > 0 
        ? validNodes.reduce((acc, curr) => acc + curr.reliability, 0) / validNodes.length 
        : 0;

    // 2. Source Quality (Tier-weighted)
    let tierSum = 0;
    validNodes.forEach(node => {
        if (node.sourceTier && node.sourceTier.includes("PRIMARY")) tierSum += 96;
        else if (node.sourceTier && node.sourceTier.includes("HIGH QUALITY")) tierSum += 85;
        else if (node.sourceTier && node.sourceTier.includes("SECONDARY")) tierSum += 70;
        else tierSum += 35;
    });
    const sourceQuality = validNodes.length > 0 ? Math.round(tierSum / validNodes.length) : 0;

    // 3. Evidence Recency
    const avgRecency = validNodes.length > 0 
        ? validNodes.reduce((acc, curr) => acc + curr.recency, 0) / validNodes.length 
        : 0;

    // 4. Source Independence & Lineage
    let independentCount = 0;
    validNodes.forEach(node => {
        if (!node.derivesFrom) independentCount++;
    });
    const sourceIndependence = validNodes.length > 0 
        ? Math.round((independentCount / validNodes.length) * 100)
        : 0;
    const independenceSummary = `${independentCount} of ${validNodes.length} supporting sources verified as independent root streams.`;

    // 5. Agent Agreement & Dissent
    let bullishCount = 0;
    let bearishCount = 0;
    let cautionCount = 0;
    (agents || []).forEach(a => {
        if (a.status === 'bullish') bullishCount++;
        else if (a.status === 'bearish') bearishCount++;
        else if (a.status === 'caution') cautionCount++;
    });
    const totalVotes = bullishCount + bearishCount + cautionCount;
    const agreementScore = totalVotes > 0 
        ? Math.round((bullishCount / totalVotes) * 100)
        : 0;
    const dissentRatio = totalVotes > 0 
        ? ((bearishCount + (cautionCount * 0.5)) / totalVotes)
        : 0;
    const dissentIndex = Math.round(dissentRatio * 100);

    // 6. Contradiction Risk
    let contradictionCount = 0;
    validNodes.forEach(node => {
        contradictionCount += (node.contradicts || []).length;
    });
    const contradictionRisk = Math.min(100, (contradictionCount * 18) + (bearishCount * 10));
    const contradictionPenalty = Math.min(25, contradictionCount * 8 + bearishCount * 4);

    // 7. Data Completeness & Unknown Penalty
    const unknownTripwires = ((userContext && userContext.tripwires) || []).filter(t => t.status === "UNKNOWN").length;
    const dataCompleteness = Math.max(0, 100 - (missingDataCount * 25) - (unknownTripwires * 10));

    // 8. Personalization Fit & Contextual Penalties
    const user = (userContext && userContext.user) || {};
    const confidencePenalty = (userContext && userContext.confidencePenalty) || 0;
    const behavioralRiskScore = (userContext && userContext.behavioralRiskScore) || 30;
    const behavioralDrag = behavioralRiskScore > 50 ? (behavioralRiskScore - 50) * 0.4 : 0;
    const personalizationFit = Math.max(0, Math.min(100, Math.round(100 - (confidencePenalty * 1.8) - behavioralDrag)));

    // 9. Base Mathematical Formula
    let rawConfidence = (avgQuality * 0.30) + 
                        (sourceQuality * 0.20) + 
                        (avgRecency * 0.15) + 
                        (sourceIndependence * 0.10) + 
                        (agreementScore * 0.20) + 
                        (dataCompleteness * 0.05);

    // Deductions
    rawConfidence = rawConfidence - (contradictionPenalty * 0.5) - behavioralDrag - (confidencePenalty * 0.9);

    if (tripwireTriggered || supersededNodes.length > 0) {
        rawConfidence = Math.min(38, rawConfidence * 0.45);
    }

    const finalDecisionConfidence = Math.max(0, Math.min(100, Math.round(rawConfidence)));

    // Determine primary drag
    let primaryDrag = "None";
    if (tripwireTriggered || supersededNodes.length > 0) {
        primaryDrag = "Tripwire Falsification (EV-014 Superseded)";
    } else if (confidencePenalty > 10) {
        primaryDrag = `Portfolio Concentration Limit (${user.portfolio?.techExposure || 41}% Tech)`;
    } else if (behavioralRiskScore > 70) {
        primaryDrag = "Behavioral Risk (Recent-Performance Bias)";
    } else if (dissentIndex > 35) {
        primaryDrag = "Agent Dissent (Adversarial & Macro Warnings)";
    } else if (contradictionRisk > 30) {
        primaryDrag = "Debt Growth Contradiction (EV-018 vs EV-014)";
    } else if (dataCompleteness < 80) {
        primaryDrag = "Missing Data / Pending Guidance";
    }

    // Generate Structured Reasoning Chain
    const reasoningChain = [
        {
            step: 1,
            type: "CLAIM",
            title: "Core Thesis Claim",
            statement: "Accelerating revenue growth and operational metrics justify position conviction.",
            sourceTier: "TIER 1 — PRIMARY"
        },
        {
            step: 2,
            type: "EVIDENCE",
            title: "Primary Verification",
            statement: supersededNodes.length > 0 
                ? "Revenue growth fell to 6.5% YoY (Below 8.0% falsification threshold)."
                : "Q3 revenue growth accelerated by 11.2% YoY (SEC Form 10-Q).",
            evidenceId: "EV-014",
            sourceName: "SEC Form 10-Q Financial Filing",
            sourceTier: "TIER 1 — PRIMARY",
            reliability: supersededNodes.length > 0 ? 0 : 96,
            status: supersededNodes.length > 0 ? "SUPERSEDED" : "VALID"
        },
        {
            step: 3,
            type: "AGENT",
            title: "Specialized Interpretation",
            agentName: "Fundamental Evidence Analyst",
            stance: supersededNodes.length > 0 ? "OPPOSES" : "SUPPORTS",
            statement: supersededNodes.length > 0 
                ? "Top-line deceleration violates fundamental growth assumptions."
                : "Free cash flow yield and operating margins confirm strong operational execution."
        },
        {
            step: 4,
            type: "COUNTER_EVIDENCE",
            title: "Contradiction Identified",
            statement: "Debt service obligations rose 27% under current floating rate structure.",
            evidenceId: "EV-018",
            sourceName: "Form 10-Q MD&A Section",
            sourceTier: "TIER 1 — PRIMARY",
            reliability: 94,
            status: "VALID"
        },
        {
            step: 5,
            type: "ADVERSARIAL_AGENT",
            title: "Red Team Challenge",
            agentName: "Adversarial Agent",
            stance: "OPPOSES",
            statement: "Rising debt service costs will erode net margin in Q4, creating mid-term downside risk."
        },
        {
            step: 6,
            type: "DECISION_IMPACT",
            title: "Provenance Synthesis",
            statement: supersededNodes.length > 0 
                ? "Contract invalidated. Thesis revoked due to tripwire failure."
                : `Net confidence calibrated to ${finalDecisionConfidence}% based on agent gauntlet, debt contradiction, and ${user.profile || 'investor'} constraints.`,
            netImpact: supersededNodes.length > 0 ? "REVOKED (-58% penalty)" : `-${Math.round(100 - finalDecisionConfidence)}% Net Drag Applied`
        }
    ];

    // Positive Contributors & Negative Drags
    const positiveContributors = [];
    if (sourceQuality >= 70) {
        positiveContributors.push({
            factor: "Tier 1 & 2 Primary Sources",
            weight: 28,
            detail: "Primary regulatory filings (SEC 10-Q) and audited transcripts form the evidentiary backbone."
        });
    }
    if (agreementScore >= 50) {
        positiveContributors.push({
            factor: "Fundamental & Signal Consensus",
            weight: 22,
            detail: "Signal Core and Fundamental agents align on positive trailing volume and margin health."
        });
    }
    if (avgRecency >= 75) {
        positiveContributors.push({
            factor: "Evidence Stream Recency",
            weight: 18,
            detail: "All active evidence nodes retrieved and validated within trailing 24–72 hours."
        });
    }
    if (dataCompleteness >= 70) {
        positiveContributors.push({
            factor: "Data Quorum Completeness",
            weight: 14,
            detail: "5 of 5 required market and regulatory intelligence channels active."
        });
    }

    const negativeDrags = [];
    if (tripwireTriggered || supersededNodes.length > 0) {
        negativeDrags.push({
            factor: "Revenue Tripwire Falsification",
            weight: 35,
            detail: "Revenue growth fell from 11.2% to 6.5%, breaching the 8% falsification threshold."
        });
    }
    if (confidencePenalty > 0) {
        negativeDrags.push({
            factor: `Portfolio Concentration Drag (${user.portfolio?.techExposure || 41}% Tech)`,
            weight: confidencePenalty,
            detail: `Existing portfolio tech exposure exceeds allowable ${user.profile || 'Conservative'} risk ceiling.`
        });
    }
    if (dissentIndex > 20) {
        negativeDrags.push({
            factor: "Specialized Agent Dissent",
            weight: 14,
            detail: "Adversarial Agent and Macro & Sector model flag rising debt and macro headwinds."
        });
    }
    if (contradictionRisk > 20) {
        negativeDrags.push({
            factor: "Debt Growth Contradiction",
            weight: 12,
            detail: "Form 10-Q MD&A reveals 27% increase in floating rate debt obligations."
        });
    }
    if (behavioralRiskScore > 50) {
        negativeDrags.push({
            factor: "Behavioral Risk (Recent-Performance Bias)",
            weight: 10,
            detail: "Cognitive mirror detected 3 past momentum entries with 2 subsequent loss outcomes."
        });
    }
    if (unknownTripwires > 0 || missingDataCount > 0) {
        negativeDrags.push({
            factor: "Unverified Forward Guidance",
            weight: 8,
            detail: "Management guidance status remains UNKNOWN pending next quarterly filing."
        });
    }

    // Agent Disagreements
    const agentDisagreements = (agents || []).map(a => ({
        agentName: a.name,
        role: a.role,
        stance: a.status === 'bullish' ? 'SUPPORTS' : a.status === 'bearish' ? 'OPPOSES' : a.status === 'caution' ? 'CAUTION' : 'SYNTHESIS',
        message: a.message
    }));

    const opposingAgents = (agents || []).filter(a => a.status === 'bearish');
    const agentDisagreementSummary = opposingAgents.length > 0
        ? `Decision confidence reduced because ${opposingAgents.length} of ${agents.length} specialized agents identified material risks (${opposingAgents.map(a => a.name).join(", ")}).`
        : `Consensus agreement across active specialized intelligence agents.`;

    return {
        decisionConfidence: finalDecisionConfidence,
        dissentIndex: dissentIndex,
        primaryDrag: primaryDrag,
        breakdown: {
            evidenceStrength: Math.round(avgQuality),
            agentAgreement: Math.round(agreementScore),
            sourceQuality: sourceQuality,
            dataCompleteness: Math.round(dataCompleteness),
            contradictionRisk: Math.round(contradictionRisk),
            personalizationFit: personalizationFit,
            sourceIndependence: sourceIndependence
        },
        components: {
            quality: Math.round(avgQuality),
            recency: Math.round(avgRecency),
            independence: sourceIndependence,
            agreement: Math.round(agreementScore),
            completeness: Math.round(dataCompleteness),
            contradictionRisk: Math.round(contradictionRisk),
            behavioralUncertainty: Math.round(behavioralRiskScore),
            personalizationFit: personalizationFit
        },
        positiveContributors: positiveContributors,
        negativeDrags: negativeDrags,
        reasoningChain: reasoningChain,
        agentDisagreements: agentDisagreements,
        agentDisagreementSummary: agentDisagreementSummary,
        sourceIndependenceSummary: independenceSummary
    };
}

module.exports = {
    EVIDENCE_TIERS,
    GLOBAL_EVIDENCE_GRAPH,
    computeConfidence
};

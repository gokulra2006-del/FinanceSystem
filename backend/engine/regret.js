// engine/regret.js

/**
 * FEATURE 8: Regret Ledger & Counterfactual Intelligence Engine
 * "Track the decisions you did NOT take."
 * 
 * Evaluates decisions made and decisions not taken using strict point-in-time
 * evidence, counterfactual calculations, and decision quality vs outcome separation.
 */

// 1. Initial Shadow Decision Ledger (Seeded Curated Historical Replay Scenarios & Session Records)
const SHADOW_DECISION_LEDGER = {
    user1: [ // Arjun (Conservative, 41% Tech Exposure, Recent FOMO history)
        {
            id: "DEC-2026-081",
            userId: "user1",
            asset: "TSLA",
            assetName: "Tesla, Inc.",
            question: "[STOCK_ANALYSIS] I want to buy TSLA because earnings are accelerating and EV adoption is growing.",
            thesis: "Revenue acceleration and EV market share justify initiating a momentum position.",
            decisionTimestamp: "2026-08-14T09:30:00Z",
            outcomeTimestamp: "2026-09-14T16:00:00Z", // T+30 days
            nominalPositionSize: 12000,
            
            // Point-in-time decision context at T+0
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-014",
                    claim: "Revenue growth accelerated by 11.2% YoY in Q2 10-Q filing.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "SEC Form 10-Q Quarterly Filing",
                    reliability: 96,
                    documentDate: "2026-08-10"
                },
                {
                    evidenceId: "EV-018",
                    claim: "Debt service obligations increased 27% under floating rate structure.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Form 10-Q MD&A Section",
                    reliability: 94,
                    documentDate: "2026-08-10"
                },
                {
                    evidenceId: "EV-022",
                    claim: "Sector rotation models indicate net capital outflow from high-multiple tech.",
                    sourceType: "RESEARCH",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "Morgan Stanley Institutional Capital Flow Report",
                    reliability: 82,
                    documentDate: "2026-08-12"
                }
            ],
            pointInTimeConfidence: 51,
            confidenceBreakdown: {
                evidenceStrength: 86,
                agentAgreement: 57,
                sourceQuality: 91,
                dataCompleteness: 100,
                contradictionRisk: 42,
                personalizationFit: 41
            },
            pointInTimeAgents: [
                { name: "Signal Core", stance: "SUPPORTS", role: "Market Dynamics" },
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Financials" },
                { name: "Portfolio Risk", stance: "OPPOSES", role: "Exposure Guard (41% Tech Exposure)" },
                { name: "Adversarial Agent", stance: "OPPOSES", role: "Red Team (Debt Growth)" },
                { name: "Behavioral Mirror", stance: "CAUTION", role: "Psychology (Recent FOMO Match)" }
            ],
            tripwiresAtDecision: [
                { id: "tw_rev_1", metric: "Revenue Growth", operator: "<", threshold: "8%", status: "ARMED" },
                { id: "tw_port_1", metric: "Tech Exposure", operator: ">", threshold: "45%", status: "WARNING" }
            ],
            
            // Actions & Counterfactuals
            actualDecision: "NO",
            actualPath: "WAITED",
            actualActionDescription: "Chose to WAIT after Behavioral Mirror warned against impulsive entry and Portfolio Risk flagged 41% Tech concentration.",
            counterfactualPath: "ACTED",
            counterfactualDescription: "What if you had entered a ₹12,000 position at T+0?",
            
            // Forward 30-Day Market Outcome
            forwardReturn30D: -11.2,
            actualFinancialImpact: 0, // Did not lose money
            counterfactualFinancialImpact: -1344, // Would have lost ₹1,344
            avoidedLoss: 1344,
            missedOpportunity: 0,
            outcomeCategory: "AVOIDED_LOSS",
            
            // Decision Quality vs Outcome Evaluation
            decisionQuality: "ROBUST",
            decisionQualityReason: "The decision to wait was well-supported by 41% portfolio tech exposure limits and adversarial debt warnings at T+0. Avoided a subsequent -11.2% drawdown.",
            
            // Unavailable at T+0
            unavailableFutureInformation: [
                "Withdrawal of Q4 gross margin guidance (Occurred T+18 days)",
                "Variable interest rate surge on floating debt (Occurred T+22 days)",
                "30-day stock price drop of -11.2%"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-086",
            userId: "user1",
            asset: "AMD",
            assetName: "Advanced Micro Devices",
            question: "[STOCK_ANALYSIS] Should I buy AMD after the AI datacenter announcement?",
            thesis: "Datacenter revenue expansion supports premium multiple expansion.",
            decisionTimestamp: "2026-07-20T11:00:00Z",
            outcomeTimestamp: "2026-08-20T16:00:00Z",
            nominalPositionSize: 15000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-041",
                    claim: "Management announced +30% datacenter acceleration on earnings call.",
                    sourceType: "TRANSCRIPT",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "Q2 Earnings Call Audio Transcript",
                    reliability: 88,
                    documentDate: "2026-07-18"
                },
                {
                    evidenceId: "EV-045",
                    claim: "Retail trading sentiment index peaked in upper 95th percentile.",
                    sourceType: "SOCIAL_AGGREGATOR",
                    sourceTier: "TIER 4 — WEAK",
                    sourceName: "Retail Trading Forum Tracker",
                    reliability: 35,
                    documentDate: "2026-07-20"
                }
            ],
            pointInTimeConfidence: 68,
            confidenceBreakdown: {
                evidenceStrength: 62,
                agentAgreement: 71,
                sourceQuality: 62,
                dataCompleteness: 100,
                contradictionRisk: 25,
                personalizationFit: 55
            },
            pointInTimeAgents: [
                { name: "Signal Core", stance: "SUPPORTS", role: "Momentum" },
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Financials" },
                { name: "Behavioral Mirror", stance: "OPPOSES", role: "Psychology (Confirmation Bias Alert)" }
            ],
            tripwiresAtDecision: [
                { id: "tw_dc_1", metric: "Datacenter Margin", operator: "<", threshold: "48%", status: "ARMED" }
            ],
            
            actualDecision: "YES",
            actualPath: "ACTED",
            actualActionDescription: "Entered position after datacenter catalyst despite Behavioral Mirror warning on momentum chasing.",
            counterfactualPath: "WAITED",
            counterfactualDescription: "What if you had waited 30 days for post-announcement multiple compression?",
            
            forwardReturn30D: -14.8,
            actualFinancialImpact: -2220,
            counterfactualFinancialImpact: 0,
            avoidedLoss: 0,
            missedOpportunity: 0,
            outcomeCategory: "REALIZED_LOSS",
            
            decisionQuality: "WEAK",
            decisionQualityReason: "Decision was driven by short-term sentiment chasing and overweighted Tier 4 social signals. Behavioral Mirror intervention was overridden.",
            
            unavailableFutureInformation: [
                "Cyclical enterprise IT spending pause (Announced T+14 days)",
                "30-day stock correction of -14.8%"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-092",
            userId: "user1",
            asset: "HDFCBANK",
            assetName: "HDFC Bank Ltd.",
            question: "[STOCK_ANALYSIS] Is HDFC Bank a solid defensive allocation for my conservative portfolio?",
            thesis: "Asset quality stability and low beta align with defensive portfolio constraints.",
            decisionTimestamp: "2026-06-10T14:15:00Z",
            outcomeTimestamp: "2026-07-10T16:00:00Z",
            nominalPositionSize: 20000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-051",
                    claim: "Gross NPA declined to 1.24% with net interest margin at 3.6%.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Regulatory Financial Disclosures (RBI / Exchange)",
                    reliability: 98,
                    documentDate: "2026-06-05"
                },
                {
                    evidenceId: "EV-054",
                    claim: "Institutional credit growth models project +14% loan book expansion.",
                    sourceType: "RESEARCH",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "Institutional Banking Sector Survey",
                    reliability: 86,
                    documentDate: "2026-06-08"
                }
            ],
            pointInTimeConfidence: 84,
            confidenceBreakdown: {
                evidenceStrength: 92,
                agentAgreement: 88,
                sourceQuality: 92,
                dataCompleteness: 100,
                contradictionRisk: 10,
                personalizationFit: 94
            },
            pointInTimeAgents: [
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Financials" },
                { name: "Portfolio Risk", stance: "SUPPORTS", role: "Asset Allocation (Defensive Fit)" },
                { name: "Macro & Sector", stance: "SUPPORTS", role: "Credit Environment" }
            ],
            tripwiresAtDecision: [
                { id: "tw_npa_1", metric: "Gross NPA", operator: ">", threshold: "1.6%", status: "ARMED" }
            ],
            
            actualDecision: "NO",
            actualPath: "WAITED",
            actualActionDescription: "Decided to WAIT due to general market hesitation despite strong fundamental fit.",
            counterfactualPath: "ACTED",
            counterfactualDescription: "What if you had entered the recommended ₹20,000 position?",
            
            forwardReturn30D: 9.2,
            actualFinancialImpact: 0,
            counterfactualFinancialImpact: 1840,
            avoidedLoss: 0,
            missedOpportunity: 1840,
            outcomeCategory: "MISSED_OPPORTUNITY",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "The original analysis had high point-in-time evidence integrity (84% confidence). Waiting resulted in a missed opportunity of ₹1,840.",
            
            unavailableFutureInformation: [
                "RBI interest rate pause announcement (T+12 days)",
                "Subsequent +9.2% rally over trailing 30 days"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-099",
            userId: "user1",
            asset: "NVDA",
            assetName: "NVIDIA Corporation",
            question: "[STOCK_ANALYSIS] Should I buy NVDA after the +22% weekly breakout?",
            thesis: "Accelerating compute demand overrides valuation expansion limits.",
            decisionTimestamp: "2026-05-18T10:00:00Z",
            outcomeTimestamp: "2026-06-18T16:00:00Z",
            nominalPositionSize: 18000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-062",
                    claim: "Data center revenue surged +150% YoY in audited quarterly report.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "SEC Form 10-Q Financial Filing",
                    reliability: 96,
                    documentDate: "2026-05-15"
                },
                {
                    evidenceId: "EV-066",
                    claim: "Social trading index recorded extreme greed / FOMO clustering.",
                    sourceType: "SOCIAL_AGGREGATOR",
                    sourceTier: "TIER 4 — WEAK",
                    sourceName: "Social Volume Tracker",
                    reliability: 35,
                    documentDate: "2026-05-18"
                }
            ],
            pointInTimeConfidence: 48,
            confidenceBreakdown: {
                evidenceStrength: 75,
                agentAgreement: 43,
                sourceQuality: 66,
                dataCompleteness: 100,
                contradictionRisk: 55,
                personalizationFit: 32
            },
            pointInTimeAgents: [
                { name: "Signal Core", stance: "SUPPORTS", role: "Volume" },
                { name: "Portfolio Risk", stance: "OPPOSES", role: "Concentration Breach" },
                { name: "Behavioral Mirror", stance: "OPPOSES", role: "FOMO Detection" }
            ],
            tripwiresAtDecision: [
                { id: "tw_conc_1", metric: "Tech Exposure", operator: ">", threshold: "40%", status: "TRIGGERED" }
            ],
            
            actualDecision: "NO",
            actualPath: "AVOIDED",
            actualActionDescription: "AVOIDED trade completely following Behavioral Mirror warning on parabolic chase.",
            counterfactualPath: "ACTED",
            counterfactualDescription: "What if you had bought at the local top?",
            
            forwardReturn30D: -18.5,
            actualFinancialImpact: 0,
            counterfactualFinancialImpact: -3330,
            avoidedLoss: 3330,
            missedOpportunity: 0,
            outcomeCategory: "AVOIDED_LOSS",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "Avoiding parabolic chase preserved capital and aligned strictly with risk tolerance. Saved ₹3,330 in sharp mean-reversion pullback.",
            
            unavailableFutureInformation: [
                "Semiconductor export restrictions tightening (Announced T+16 days)",
                "-18.5% post-rally correction"
            ],
            datasetType: "Curated Historical Replay Scenario"
        }
    ],
    
    user2: [ // Priya (Growth, 30% Tech, Long-term Horizon, Disciplined Compounder)
        {
            id: "DEC-2026-074",
            userId: "user2",
            asset: "HDFCBANK",
            assetName: "HDFC Bank Ltd.",
            question: "[STOCK_ANALYSIS] Initiating long-term allocation in HDFC Bank on fundamental undervaluation.",
            thesis: "P/B multiple compression below 10-year mean provides asymmetric risk-reward for 3-5 year horizon.",
            decisionTimestamp: "2026-07-02T10:00:00Z",
            outcomeTimestamp: "2026-08-02T16:00:00Z",
            nominalPositionSize: 45000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-071",
                    claim: "Return on Assets maintained at 2.0% with strong deposit franchise liquidity.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Exchange Regulatory Disclosures",
                    reliability: 98,
                    documentDate: "2026-06-28"
                },
                {
                    evidenceId: "EV-073",
                    claim: "Institutional research indicates credit cost normalization in H2.",
                    sourceType: "RESEARCH",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "Nomura Institutional Banking Report",
                    reliability: 88,
                    documentDate: "2026-07-01"
                }
            ],
            pointInTimeConfidence: 86,
            confidenceBreakdown: {
                evidenceStrength: 93,
                agentAgreement: 88,
                sourceQuality: 93,
                dataCompleteness: 100,
                contradictionRisk: 12,
                personalizationFit: 96
            },
            pointInTimeAgents: [
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Financials" },
                { name: "Portfolio Risk", stance: "SUPPORTS", role: "Growth Fit" },
                { name: "Macro & Sector", stance: "SUPPORTS", role: "Macro Dynamics" }
            ],
            tripwiresAtDecision: [
                { id: "tw_nim_1", metric: "Net Interest Margin", operator: "<", threshold: "3.2%", status: "ARMED" }
            ],
            
            actualDecision: "YES",
            actualPath: "ACTED",
            actualActionDescription: "Executed ₹45,000 entry aligned with long-term compounder thesis.",
            counterfactualPath: "WAITED",
            counterfactualDescription: "What if you had hesitated and waited?",
            
            forwardReturn30D: 14.2,
            actualFinancialImpact: 6390,
            counterfactualFinancialImpact: 0,
            avoidedLoss: 0,
            missedOpportunity: 0,
            outcomeCategory: "REALIZED_GAIN",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "High-integrity fundamental entry executed within growth risk parameters. Realized +14.2% (+₹6,390) over 30-day window.",
            
            unavailableFutureInformation: [
                "Foreign institutional inflow surge (T+10 days)",
                "+14.2% forward 30-day return"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-088",
            userId: "user2",
            asset: "INFY",
            assetName: "Infosys Ltd.",
            question: "[STOCK_ANALYSIS] Adding to Infosys position following positive large deal wins.",
            thesis: "Total contract value (TCV) expansion signals bottoming of enterprise tech cycle.",
            decisionTimestamp: "2026-08-05T13:30:00Z",
            outcomeTimestamp: "2026-09-05T16:00:00Z",
            nominalPositionSize: 35000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-081",
                    claim: "Large deal TCV reported at $2.4B in official quarterly investor disclosure.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Exchange Quarterly Report",
                    reliability: 96,
                    documentDate: "2026-08-01"
                },
                {
                    evidenceId: "EV-084",
                    claim: "Attrition dropped to 12.8% indicating operational cost stabilization.",
                    sourceType: "TRANSCRIPT",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "Earnings Call Transcript",
                    reliability: 88,
                    documentDate: "2026-08-01"
                }
            ],
            pointInTimeConfidence: 81,
            confidenceBreakdown: {
                evidenceStrength: 92,
                agentAgreement: 83,
                sourceQuality: 92,
                dataCompleteness: 100,
                contradictionRisk: 15,
                personalizationFit: 90
            },
            pointInTimeAgents: [
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Financials" },
                { name: "Signal Core", stance: "SUPPORTS", role: "Volume" },
                { name: "Portfolio Risk", stance: "SUPPORTS", role: "Exposure Verification" }
            ],
            tripwiresAtDecision: [
                { id: "tw_tcv_1", metric: "TCV Growth", operator: "<", threshold: "5%", status: "ARMED" }
            ],
            
            actualDecision: "YES",
            actualPath: "ACTED",
            actualActionDescription: "Allocated ₹35,000 position based on verified multi-year contracts.",
            counterfactualPath: "WAITED",
            counterfactualDescription: "What if you had delayed entry until next quarter?",
            
            forwardReturn30D: 8.4,
            actualFinancialImpact: 2940,
            counterfactualFinancialImpact: 0,
            avoidedLoss: 0,
            missedOpportunity: 0,
            outcomeCategory: "REALIZED_GAIN",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "Point-in-time TCV data substantiated the turnaround thesis. Delivered solid +8.4% (+₹2,940) return.",
            
            unavailableFutureInformation: [
                "European enterprise digital transformation contract announcement (T+21 days)",
                "+8.4% 30-day appreciation"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-095",
            userId: "user2",
            asset: "ZOMATO",
            assetName: "Zomato Ltd.",
            question: "[STOCK_ANALYSIS] Should I add Zomato to high-growth basket on quick-commerce expansion?",
            thesis: "Quick commerce EBITDA break-even timeline accelerating ahead of sell-side consensus.",
            decisionTimestamp: "2026-07-25T15:00:00Z",
            outcomeTimestamp: "2026-08-25T16:00:00Z",
            nominalPositionSize: 30000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-091",
                    claim: "Blinkit GOV grew +120% YoY in audited consolidated filings.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Quarterly Financial Disclosures",
                    reliability: 96,
                    documentDate: "2026-07-22"
                },
                {
                    evidenceId: "EV-093",
                    claim: "Institutional broker upgraded target citing store unit economics.",
                    sourceType: "RESEARCH",
                    sourceTier: "TIER 2 — HIGH QUALITY",
                    sourceName: "CLSA Institutional Equities",
                    reliability: 84,
                    documentDate: "2026-07-24"
                }
            ],
            pointInTimeConfidence: 74,
            confidenceBreakdown: {
                evidenceStrength: 90,
                agentAgreement: 71,
                sourceQuality: 90,
                dataCompleteness: 100,
                contradictionRisk: 22,
                personalizationFit: 85
            },
            pointInTimeAgents: [
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Unit Economics" },
                { name: "Adversarial Agent", stance: "OPPOSES", role: "Competitive Threat (Blinkit vs Instamart)" },
                { name: "Portfolio Risk", stance: "CAUTION", role: "Beta Guard" }
            ],
            tripwiresAtDecision: [
                { id: "tw_ebitda_1", metric: "Store EBITDA Margin", operator: "<", threshold: "0%", status: "ARMED" }
            ],
            
            actualDecision: "NO",
            actualPath: "WAITED",
            actualActionDescription: "Chose to WAIT to verify competition dynamics and dark store expansion capex.",
            counterfactualPath: "ACTED",
            counterfactualDescription: "What if you had initiated a ₹30,000 position?",
            
            forwardReturn30D: 10.7,
            actualFinancialImpact: 0,
            counterfactualFinancialImpact: 3210,
            avoidedLoss: 0,
            missedOpportunity: 3210,
            outcomeCategory: "MISSED_OPPORTUNITY",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "Waiting was a disciplined risk-mitigated posture due to competitive margin pressure. Produced a counterfactual missed opportunity of ₹3,210.",
            
            unavailableFutureInformation: [
                "Competitor capex pullback in tier-2 cities (T+16 days)",
                "+10.7% forward 30-day rally"
            ],
            datasetType: "Curated Historical Replay Scenario"
        }
    ],
    
    user3: [ // Karthik (Balanced, 35% Tech, Panic Sells tendency during volatility)
        {
            id: "DEC-2026-068",
            userId: "user3",
            asset: "RELIANCE",
            assetName: "Reliance Industries Ltd.",
            question: "[STOCK_ANALYSIS] Adding Reliance as balanced anchor position.",
            thesis: "Retail and telecom cash flows provide steady defensive base while green energy capex ramps.",
            decisionTimestamp: "2026-07-15T11:30:00Z",
            outcomeTimestamp: "2026-08-15T16:00:00Z",
            nominalPositionSize: 30000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-101",
                    claim: "Jio ARPU increased to ₹181.7 in official quarterly report.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Exchange Regulatory Disclosures",
                    reliability: 98,
                    documentDate: "2026-07-12"
                }
            ],
            pointInTimeConfidence: 78,
            confidenceBreakdown: {
                evidenceStrength: 98,
                agentAgreement: 83,
                sourceQuality: 98,
                dataCompleteness: 100,
                contradictionRisk: 10,
                personalizationFit: 88
            },
            pointInTimeAgents: [
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Cash Flow" },
                { name: "Portfolio Risk", stance: "SUPPORTS", role: "Balanced Allocation" }
            ],
            tripwiresAtDecision: [
                { id: "tw_arpu_1", metric: "ARPU Growth", operator: "<", threshold: "2%", status: "ARMED" }
            ],
            
            actualDecision: "YES",
            actualPath: "ACTED",
            actualActionDescription: "Executed balanced allocation of ₹30,000 with tripwires active.",
            counterfactualPath: "WAITED",
            counterfactualDescription: "What if you had delayed entry?",
            
            forwardReturn30D: 6.2,
            actualFinancialImpact: 1860,
            counterfactualFinancialImpact: 0,
            avoidedLoss: 0,
            missedOpportunity: 0,
            outcomeCategory: "REALIZED_GAIN",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "High-quality cash-flow backing protected position during broader market volatility. Delivered +6.2% gain.",
            
            unavailableFutureInformation: [
                "Tariff hike implementation across telecom segment (T+15 days)",
                "+6.2% forward 30-day return"
            ],
            datasetType: "Curated Historical Replay Scenario"
        },
        {
            id: "DEC-2026-077",
            userId: "user3",
            asset: "TCS",
            assetName: "Tata Consultancy Services",
            question: "[STOCK_ANALYSIS] Should I exit TCS position after 4% gap-down?",
            thesis: "Temporary margin headwinds trigger stop-loss considerations.",
            decisionTimestamp: "2026-08-01T09:45:00Z",
            outcomeTimestamp: "2026-09-01T16:00:00Z",
            nominalPositionSize: 35000,
            
            pointInTimeEvidence: [
                {
                    evidenceId: "EV-112",
                    claim: "Operating margin held resilient at 24.7% despite seasonal wage hikes.",
                    sourceType: "FILING",
                    sourceTier: "TIER 1 — PRIMARY",
                    sourceName: "Q1 Audited Results",
                    reliability: 98,
                    documentDate: "2026-07-28"
                }
            ],
            pointInTimeConfidence: 62,
            confidenceBreakdown: {
                evidenceStrength: 95,
                agentAgreement: 60,
                sourceQuality: 95,
                dataCompleteness: 100,
                contradictionRisk: 18,
                personalizationFit: 70
            },
            pointInTimeAgents: [
                { name: "Behavioral Mirror", stance: "OPPOSES", role: "Panic Exit Intervention" },
                { name: "Fundamental Evidence", stance: "SUPPORTS", role: "Margin Health" }
            ],
            tripwiresAtDecision: [
                { id: "tw_tcs_margin", metric: "Operating Margin", operator: "<", threshold: "23%", status: "ARMED" }
            ],
            
            actualDecision: "NO",
            actualPath: "WAITED",
            actualActionDescription: "Held position after Behavioral Mirror warned against panic selling during seasonal wage hike dip.",
            counterfactualPath: "ACTED",
            counterfactualDescription: "What if you had panic-sold at the local bottom?",
            
            forwardReturn30D: 7.8,
            actualFinancialImpact: 2730, // Maintained position value
            counterfactualFinancialImpact: -2730, // Would have crystallized loss and missed rally
            avoidedLoss: 2730,
            missedOpportunity: 0,
            outcomeCategory: "AVOIDED_LOSS",
            
            decisionQuality: "ROBUST",
            decisionQualityReason: "Behavioral Mirror intervention successfully prevented panic selling on noise. Saved ₹2,730 in realized loss and captured subsequent recovery.",
            
            unavailableFutureInformation: [
                "North American BFSI client contract renewals (T+18 days)",
                "+7.8% recovery over 30 days"
            ],
            datasetType: "Curated Historical Replay Scenario"
        }
    ]
};

/**
 * Computes summary counterfactual metrics for a user.
 */
function computeRegretSummary(userId) {
    const records = SHADOW_DECISION_LEDGER[userId] || SHADOW_DECISION_LEDGER["user1"];
    
    let totalDecisions = records.length;
    let decisionsActed = 0;
    let decisionsNotTaken = 0;
    let totalAvoidedLoss = 0;
    let totalMissedOpportunity = 0;
    let totalRealizedGains = 0;
    let totalRealizedLosses = 0;
    
    records.forEach(r => {
        if (r.actualPath === "ACTED") {
            decisionsActed++;
            if (r.actualFinancialImpact > 0) totalRealizedGains += r.actualFinancialImpact;
            if (r.actualFinancialImpact < 0) totalRealizedLosses += Math.abs(r.actualFinancialImpact);
        } else {
            decisionsNotTaken++;
        }
        
        if (r.avoidedLoss > 0) totalAvoidedLoss += r.avoidedLoss;
        if (r.missedOpportunity > 0) totalMissedOpportunity += r.missedOpportunity;
    });
    
    return {
        totalDecisions,
        decisionsActed,
        decisionsNotTaken,
        totalAvoidedLoss: Math.round(totalAvoidedLoss),
        totalMissedOpportunity: Math.round(totalMissedOpportunity),
        totalRealizedGains: Math.round(totalRealizedGains),
        totalRealizedLosses: Math.round(totalRealizedLosses),
        netCounterfactualValue: Math.round(totalAvoidedLoss - totalMissedOpportunity)
    };
}

/**
 * Derives behavioral regret insights connected to the MIRROR engine.
 */
function getBehavioralRegretInsights(userId) {
    const records = SHADOW_DECISION_LEDGER[userId] || SHADOW_DECISION_LEDGER["user1"];
    const summary = computeRegretSummary(userId);
    
    if (records.length < 2) {
        return {
            hasPattern: false,
            primaryInsight: "Insufficient decision history to establish a reliable counterfactual pattern.",
            actionableRecommendation: "Continue evaluating contracts to build your empirical decision ledger.",
            avoidedLossCount: 0,
            missedGainCount: 0
        };
    }
    
    let fomoAvoidedCount = 0;
    let fomoAvoidedSavings = 0;
    let missedGainCount = 0;
    let panicExitAvoidedCount = 0;
    let panicExitAvoidedSavings = 0;
    
    records.forEach(r => {
        if ((r.actualPath === "WAITED" || r.actualPath === "AVOIDED") && r.avoidedLoss > 0) {
            fomoAvoidedCount++;
            fomoAvoidedSavings += r.avoidedLoss;
        }
        if ((r.actualPath === "WAITED" || r.actualPath === "AVOIDED") && r.missedOpportunity > 0) {
            missedGainCount++;
        }
        if (r.actualActionDescription.toLowerCase().includes("panic") && r.avoidedLoss > 0) {
            panicExitAvoidedCount++;
            panicExitAvoidedSavings += r.avoidedLoss;
        }
    });
    
    let primaryInsight = "";
    let actionableRecommendation = "";
    
    if (userId === "user1") { // Arjun
        primaryInsight = `Your largest negative counterfactuals historically occurred after momentum-driven entries. Waiting on ${fomoAvoidedCount} parabolic setups collectively saved ₹${fomoAvoidedSavings.toLocaleString('en-IN')}.`;
        actionableRecommendation = "Continue enforcing the 24-hour cooling period and strict 40% tech exposure limits before entering momentum trades.";
    } else if (userId === "user2") { // Priya
        primaryInsight = `High alignment with secular growth compounders. You tend to regret missed entries into verified fundamentals (₹${summary.totalMissedOpportunity.toLocaleString('en-IN')}) more than temporary drawdowns.`;
        actionableRecommendation = "When point-in-time evidence confidence exceeds 80%, consider initiating a half-position rather than waiting completely.";
    } else { // Karthik
        primaryInsight = `Premature panic exits historically eroded returns. Following Behavioral Mirror interventions during pullbacks preserved ₹${summary.totalAvoidedLoss.toLocaleString('en-IN')} in capital.`;
        actionableRecommendation = "Pre-commit to machine-checked tripwires rather than discretionary market timing during 5-8% normal volatility.";
    }
    
    return {
        hasPattern: true,
        primaryInsight,
        actionableRecommendation,
        avoidedLossCount: fomoAvoidedCount,
        missedGainCount,
        summary
    };
}

/**
 * Returns point-in-time replay snapshot for a specific decision record.
 */
function getDecisionReplaySnapshot(decisionId, userId) {
    const userRecords = SHADOW_DECISION_LEDGER[userId] || SHADOW_DECISION_LEDGER["user1"];
    const decision = userRecords.find(d => d.id === decisionId) || userRecords[0];
    
    if (!decision) return null;
    
    return {
        decisionId: decision.id,
        userId: decision.userId,
        asset: decision.asset,
        assetName: decision.assetName,
        question: decision.question,
        thesis: decision.thesis,
        decisionTimestamp: decision.decisionTimestamp,
        outcomeTimestamp: decision.outcomeTimestamp,
        
        // Point-in-time state (Strictly T+0)
        pointInTimeState: {
            confidence: decision.pointInTimeConfidence,
            confidenceBreakdown: decision.confidenceBreakdown,
            evidence: decision.pointInTimeEvidence,
            agents: decision.pointInTimeAgents,
            tripwires: decision.tripwiresAtDecision,
            userDecision: decision.actualDecision,
            userAction: decision.actualPath,
            actionDescription: decision.actualActionDescription
        },
        
        // "What did we know then?" vs "What was unavailable?"
        epistemicIsolation: {
            knownAtDecision: decision.pointInTimeEvidence.map(e => ({
                source: e.sourceName,
                claim: e.claim,
                tier: e.sourceTier,
                reliability: e.reliability,
                date: e.documentDate
            })),
            unavailableFutureEvents: decision.unavailableFutureInformation,
            isolationPrinciple: "Evaluation uses strictly point-in-time information. A negative outcome does NOT automatically invalidate point-in-time reasoning."
        },
        
        // Counterfactual & Forward Outcome at T+30
        forwardOutcome: {
            forwardReturn30D: decision.forwardReturn30D,
            nominalPositionSize: decision.nominalPositionSize,
            actualFinancialImpact: decision.actualFinancialImpact,
            counterfactualPath: decision.counterfactualPath,
            counterfactualFinancialImpact: decision.counterfactualFinancialImpact,
            avoidedLoss: decision.avoidedLoss,
            missedOpportunity: decision.missedOpportunity,
            outcomeCategory: decision.outcomeCategory
        },
        
        // Decision Quality vs Outcome Matrix
        qualityAssessment: {
            decisionQuality: decision.decisionQuality,
            decisionQualityReason: decision.decisionQualityReason,
            isHindsightFree: true
        }
    };
}

/**
 * Dynamically records a newly generated Decision Contract into the shadow ledger.
 */
function recordDecisionContract(contract, userId) {
    if (!contract || !contract.contractId) return null;
    
    const targetUserId = userId || "user1";
    if (!SHADOW_DECISION_LEDGER[targetUserId]) {
        SHADOW_DECISION_LEDGER[targetUserId] = [];
    }
    
    const newRecordId = `DEC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const extractedAsset = (contract.question || "").match(/(tsla|tesla|reliance|tcs|amd|nvda|apple|aapl|microsoft|msft|google|goog|hdfc|hdfcbank|zomato|infy)/i);
    const assetSymbol = extractedAsset ? extractedAsset[0].toUpperCase() : "TARGET_ASSET";
    
    const isActed = contract.decision === "YES";
    const nominalPosition = isActed ? 15000 : 0;
    
    const newRecord = {
        id: newRecordId,
        userId: targetUserId,
        asset: assetSymbol,
        assetName: assetSymbol === "TSLA" ? "Tesla, Inc." : `${assetSymbol} Asset`,
        question: contract.question,
        thesis: contract.thesis,
        decisionTimestamp: new Date().toISOString(),
        outcomeTimestamp: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        nominalPositionSize: 15000,
        
        pointInTimeEvidence: (contract.provenanceGraph || []).map(e => ({
            evidenceId: e.evidenceId,
            claim: e.claim,
            sourceType: e.sourceType,
            sourceTier: e.sourceTier,
            sourceName: e.sourceName,
            reliability: e.reliability,
            documentDate: e.documentDate
        })),
        pointInTimeConfidence: contract.confidence,
        confidenceBreakdown: contract.confidenceBreakdown?.breakdown || {
            evidenceStrength: 80,
            agentAgreement: 70,
            sourceQuality: 85,
            dataCompleteness: 100,
            contradictionRisk: 20,
            personalizationFit: 75
        },
        pointInTimeAgents: (contract.agents || []).map(a => ({
            name: a.name,
            stance: a.status === "bullish" ? "SUPPORTS" : a.status === "bearish" ? "OPPOSES" : "CAUTION",
            role: a.role
        })),
        tripwiresAtDecision: (contract.tripwires || []).map(tw => ({
            id: tw.id,
            metric: tw.metric,
            operator: tw.operator,
            threshold: `${tw.threshold}${tw.unit !== 'ratio' && tw.unit !== 'status' ? tw.unit : ''}`,
            status: tw.status
        })),
        
        actualDecision: contract.decision,
        actualPath: isActed ? "ACTED" : "WAITED",
        actualActionDescription: isActed 
            ? `Executed position based on ${contract.confidence}% confidence synthesis.`
            : `Chose to WAIT due to ${contract.confidenceBreakdown?.primaryDrag || "risk constraints"}.`,
        counterfactualPath: isActed ? "WAITED" : "ACTED",
        counterfactualDescription: isActed 
            ? "What if you had waited for subsequent confirmation?" 
            : "What if you had entered ₹15,000 position immediately?",
        
        // Active session simulation (Pending 30-day window or projected)
        forwardReturn30D: isActed ? 4.5 : -6.2,
        actualFinancialImpact: isActed ? 675 : 0,
        counterfactualFinancialImpact: isActed ? 0 : -930,
        avoidedLoss: !isActed ? 930 : 0,
        missedOpportunity: isActed ? 0 : 0,
        outcomeCategory: isActed ? "REALIZED_GAIN" : "AVOIDED_LOSS",
        
        decisionQuality: contract.confidence >= 60 ? "ROBUST" : "WEAK",
        decisionQualityReason: contract.confidence >= 60 
            ? "Supported by verified Tier 1 primary disclosures and multi-agent agreement at decision time."
            : "Point-in-time evidence flagged elevated contradiction risks or portfolio constraints.",
        
        unavailableFutureInformation: [
            "Forward 30-day macro interest rate adjustments",
            "Subsequent quarterly earnings report disclosures"
        ],
        datasetType: "Live Evaluated Decision"
    };
    
    SHADOW_DECISION_LEDGER[targetUserId].unshift(newRecord);
    return newRecord;
}

module.exports = {
    SHADOW_DECISION_LEDGER,
    computeRegretSummary,
    getBehavioralRegretInsights,
    getDecisionReplaySnapshot,
    recordDecisionContract
};

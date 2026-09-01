"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from 'recharts';
import { 
  Shield, Activity, Briefcase, User as UserIcon, Settings, LogOut,
  ChevronRight, TrendingUp, AlertTriangle, FileWarning, XCircle, Database,
  CheckCircle2, Clock, GitCommit, Search, Menu, BarChart2, RefreshCw,
  History, Undo2, Scale, ArrowRight, Eye, GitBranch, Zap, Flame, ShieldAlert, PlayCircle
} from "lucide-react";

// Mock User Data with 3 Profiles
const USERS = {
  user1: {
    name: "Arjun", profile: "Conservative", riskTolerance: "Low", horizon: "Short-term",
    portfolio: { total: "₹1,24,500", techExposure: "41%", cash: "45%" },
    activity: [
      { title: "Decision Contract Voided", subtext: "Tripwire: Revenue Miss", time: "2 hrs ago", type: "alert" },
      { title: "Position Sizing Updated", subtext: "Risk profile triggered", time: "1 day ago", type: "info" }
    ],
    mirror: {
      bias: "Recent-Performance Bias",
      desc: "You entered after strong short-term momentum 4 times. 3 of those decisions subsequently underperformed.",
      history: [
        { asset: "Bought Tech Stock A", reason: "Entered after +15% rally in 5 days", return: "-8.4%" },
        { asset: "Bought Tech Stock B", reason: "Chased earnings pop gap-up", return: "-6.1%" }
      ]
    },
    activeAgents: ['Signal Core', 'Fundamental Evidence', 'Macro & Sector', 'Portfolio Risk', 'Behavioral Mirror', 'Adversarial Agent', 'Evidence Challenger', 'Adjudicator']
  },
  user2: {
    name: "Priya", profile: "Growth", riskTolerance: "High", horizon: "Long-term",
    portfolio: { total: "₹4,82,000", techExposure: "30%", cash: "5%" },
    activity: [
      { title: "Target Achieved", subtext: "Auto-liquidated 25% of holdings", time: "5 hrs ago", type: "success" },
      { title: "New Contract Initiated", subtext: "High-growth tech play", time: "2 days ago", type: "info" }
    ],
    mirror: {
      bias: "Over-Sizing Bias",
      desc: "Your last 3 high-conviction trades were sized 50% larger than baseline. This broke your max drawdown limit twice.",
      history: [
        { asset: "Bought Crypto Asset", reason: "Sized 15% of portfolio on momentum", return: "-12.5%" },
        { asset: "Bought Small-cap Tech", reason: "Sized 12% on rumor", return: "-9.2%" }
      ]
    },
    activeAgents: ['Signal Core', 'Sentiment Analysis', 'Momentum Tracker', 'Portfolio Risk', 'Adversarial Agent', 'Evidence Challenger', 'Adjudicator']
  },
  user3: {
    name: "Karthik", profile: "Balanced", riskTolerance: "Medium", horizon: "Medium-term",
    portfolio: { total: "₹2,76,500", techExposure: "35%", cash: "15%" },
    activity: [
      { title: "Rebalancing Alert", subtext: "Tech exposure exceeded 30%", time: "1 hr ago", type: "alert" },
      { title: "Dividend Reinvested", subtext: "Added to core index fund", time: "3 days ago", type: "success" }
    ],
    mirror: {
      bias: "Loss Aversion Bias",
      desc: "You have prematurely exited winning trades 6 times this year just to lock in small 5% gains, missing out on 20%+ rallies.",
      history: [
        { asset: "Sold Index ETF", reason: "Exited early to secure +4%", return: "Missed +18%" },
        { asset: "Sold Defensive Stock", reason: "Panicked at support level", return: "Missed +12%" }
      ]
    },
    activeAgents: ['Fundamental Evidence', 'Macro & Sector', 'Dividend Tracker', 'Portfolio Risk', 'Behavioral Mirror', 'Evidence Challenger', 'Adjudicator']
  }
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState<"user1" | "user2" | "user3">("user1");
  const user = USERS[activeUser];
  
  const [currentView, setCurrentView] = useState<"dashboard" | "firewall" | "war-room" | "contracts" | "ledger" | "mirror" | "regret" | "replay">("firewall");

  const [thesis, setThesis] = useState("");
  const [analysisState, setAnalysisState] = useState<"idle" | "analyzing" | "complete" | "error">("idle");
  const [contract, setContract] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [showJudgeMode, setShowJudgeMode] = useState(false);
  const [errorState, setErrorState] = useState<any>(null);
  const [showDemoControls, setShowDemoControls] = useState(false);
  const [showWhyScore, setShowWhyScore] = useState(false);
  const [showProvenanceDetails, setShowProvenanceDetails] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  // Feature 8: Regret Ledger & Point-in-time Replay State
  const [regretData, setRegretData] = useState<any>(null);
  const [selectedReplay, setSelectedReplay] = useState<any>(null);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [loadingRegret, setLoadingRegret] = useState(false);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStage, setReplayStage] = useState(0);
  const [replayEvents, setReplayEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/dashboard/financial-intelligence?userId=${activeUser}`);
        const data = await res.json();
        if (data.success) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, [activeUser]);

  const handleStartReplay = async () => {
    if (!contract) return;
    setIsReplaying(true);
    setReplayStage(0);
    setReplayEvents([]);
    
    try {
      const res = await fetch(`http://localhost:3001/api/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, userId: activeUser })
      });
      const data = await res.json();
      if (data.success) {
        setReplayEvents(data.events);
        let stage = 0;
        const interval = setInterval(() => {
          stage++;
          setReplayStage(stage);
          if (stage === 7) {
            setContract(data.v2);
          }
          if (stage >= 8) {
            clearInterval(interval);
            setIsReplaying(false);
          }
        }, 1500);
      } else {
        setIsReplaying(false);
      }
    } catch (err) {
      console.error(err);
      setIsReplaying(false);
    }
  };

  const fetchRegretLedger = async (userIdToFetch = activeUser) => {
    try {
      setLoadingRegret(true);
      const res = await fetch(`http://localhost:3001/api/regret-ledger?userId=${userIdToFetch}`);
      const data = await res.json();
      if (data.success) {
        setRegretData(data);
      }
    } catch (err) {
      console.error("Failed to fetch regret ledger:", err);
    } finally {
      setLoadingRegret(false);
    }
  };

  const handleOpenReplay = async (decisionId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/regret-ledger/${decisionId}/replay?userId=${activeUser}`);
      const data = await res.json();
      if (data.success) {
        setSelectedReplay(data.snapshot);
        setShowReplayModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch replay snapshot:", err);
    }
  };

  // For the animated processing pipeline
  const [processingStage, setProcessingStage] = useState(0);

  // Clear contract and analysis and refetch regret when user changes
  useEffect(() => {
    setContract(null);
    setIntegrity(null);
    setAnalysisState("idle");
    setErrorState(null);
    fetchRegretLedger(activeUser);
  }, [activeUser]);

  useEffect(() => {
    if (analysisState === "analyzing") {
      const interval = setInterval(() => {
        setProcessingStage(prev => {
          if (prev >= 6) {
            clearInterval(interval);
            return 6;
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProcessingStage(0);
    }
  }, [analysisState]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!thesis) return;
    setAnalysisState("analyzing");
    setContract(null);
    setErrorState(null);
    setCurrentView("firewall");

    try {
      const isDemo = thesis === "I want to buy TSLA because earnings are accelerating and EV adoption is growing.";
      const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thesis, userId: activeUser, demoMode: isDemo })
      });
      const data = await response.json();
      
      setTimeout(async () => {
        setContract(data.contract);
        setAnalysisState("complete");
        
        // Feature 23: Fetch Integrity Score
        if (data.contract) {
            try {
                const integRes = await fetch("http://localhost:3001/api/integrity-check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contract: data.contract, userId: activeUser })
                });
                const integData = await integRes.json();
                if (integData.success) {
                    setIntegrity(integData.integrity);
                }
            } catch(e) {
                console.error("Integrity fetch failed", e);
            }
        }
      }, Math.max(0, 3500 - (6 * 500)));
      
    } catch (err) {
      console.error(err);
      setAnalysisState("idle");
    }
  };

  const triggerEvent = async (type: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, userId: activeUser })
      });
      const data = await response.json();
      if (data.success) {
        setContract(data.contract);
        setErrorState(null);
      } else {
        setContract(null);
        setAnalysisState("error");
        setErrorState(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render different views based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView user={user} dashboardData={dashboardData} contract={contract} isReplaying={isReplaying} replayStage={replayStage} handleStartReplay={handleStartReplay} />;
      case "ledger":
        return <EvidenceLedgerView citations={contract ? contract.provenanceGraph : null} onSelectEvidence={setSelectedEvidence} selectedEvidence={selectedEvidence} />;
      case "mirror":
        return <BehavioralMirrorView user={user} />;
      case "war-room":
        return <AgentWarRoomView user={user} />;
      case "regret":
      case "replay":
        return <RegretLedgerView regretData={regretData} loading={loadingRegret} user={user} onReplay={handleOpenReplay} />;
      case "firewall":
      default:
        return (
          <div className="space-y-6">
            {/* THESIS INPUT */}
            <form onSubmit={handleAnalyze} className="premium-panel rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/10 border-[var(--border-strong)]">
              <div className="p-1 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
                <div className="flex px-4 items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">Active Monitoring</span>
                </div>
              </div>
              <textarea
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Enter financial thesis or question..."
                className="w-full bg-transparent p-6 text-white text-lg resize-none focus:outline-none min-h-[120px] placeholder:text-[var(--text-muted)]"
              />
              <div className="bg-[var(--bg-surface-elevated)] p-4 flex justify-between items-center border-t border-[var(--border-subtle)]">
                <button type="button" onClick={() => setThesis("I want to buy TSLA because earnings are accelerating and EV adoption is growing.")} className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">
                  Load Demo Thesis
                </button>
                <button type="submit" disabled={analysisState === "analyzing" || !thesis} className="px-6 py-2.5 bg-[var(--accent-indigo)] hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {analysisState === "analyzing" ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : "Evaluate Thesis"}
                </button>
              </div>
            </form>

            {/* PROCESSING PIPELINE ANIMATION */}
            <AnimatePresence>
              {analysisState === "analyzing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="premium-panel rounded-xl p-6 border-[var(--border-strong)]"
                >
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--accent-indigo)]" /> Running Intelligence Network
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Signal Core', 'Fundamental Evidence', 'Macro & Sector', 'Portfolio Risk', 'Behavioral Mirror', 'Adversarial Agent', 'Evidence Challenger', 'Adjudicator'].map((agent, i) => (
                      <div key={agent} className={`p-4 rounded-lg border transition-all duration-500 ${processingStage > i ? 'bg-[var(--bg-surface-highlight)] border-[var(--border-strong)]' :
                        processingStage === i ? 'bg-indigo-950/30 border-indigo-500/50 animate-pulse-glow' :
                          'bg-[var(--bg-base)] border-[var(--border-subtle)] opacity-50'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white">{agent}</span>
                          {processingStage > i ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                            processingStage === i ? <Activity className="w-4 h-4 text-indigo-400 animate-pulse" /> :
                              <Clock className="w-4 h-4 text-[var(--text-muted)]" />}
                        </div>
                        <div className="w-full h-1 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
                          <div className={`h-full bg-indigo-500 transition-all duration-1000 ${processingStage > i ? 'w-full' : processingStage === i ? 'w-1/2 animate-pulse' : 'w-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ERROR / DEGRADED DATA STATE */}
            <AnimatePresence>
              {errorState && analysisState === "error" && (
                <motion.section
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="premium-panel rounded-xl p-8 border border-red-900/50 bg-red-950/10 relative overflow-hidden mt-6"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-500 tracking-tight">{errorState.status}</h3>
                      <p className="text-red-400/80 text-sm font-medium tracking-widest uppercase mt-1 mb-4">Data Source Degraded</p>
                      <div className="bg-[var(--bg-surface-elevated)] p-4 rounded border border-red-900/30 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {errorState.reason}
                        <div className="mt-4 pt-4 border-t border-red-900/30 font-semibold text-red-400">
                          SYSTEM ENFORCEMENT: NO UNCITED CLAIM GENERATED.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* DECISION CONTRACT & WAR ROOM RESULTS */}
            <AnimatePresence>
              {contract && analysisState === "complete" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6"
                >
                  
                  {/* LEFT COL: DECISION CONTRACT */}
                  <div className="xl:col-span-2 space-y-6">
                    <section className={`premium-panel rounded-xl p-8 transition-colors duration-500 ${contract.status === 'VOID' || contract.status === 'INVALIDATED' ? 'border-red-900/50 bg-[var(--bg-base)]' : 'glow-border-top'}`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <FileWarning className="w-5 h-5 text-[var(--text-secondary)]" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Decision Contract</h2>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] font-mono">{contract.contractId}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase border ${
                          contract.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse'
                        }`}>
                          Status: {contract.status}
                        </div>
                      </div>

                      {/* Question & Answer Section */}
                      <div className="mb-8 space-y-4">
                        {/* Decision Question */}
                        <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                          <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-1">
                            Decision Question / Input Thesis
                          </div>
                          <div className={`text-base md:text-lg font-medium ${contract.status === 'VOID' || contract.status === 'INVALIDATED' ? 'text-[var(--text-muted)] strike-through-void' : 'text-white'}`}>
                            "{contract.question || contract.thesis}"
                          </div>
                        </div>

                        {/* Actual Computed Answer (Prominent YES / NO Display) */}
                        {(contract.answer || contract.decision || contract.verdict) && (
                          <div className={`p-5 rounded-lg border transition-all ${
                            (contract.decision === 'YES' || contract.verdict === 'YES') && contract.status !== 'VOID' && contract.status !== 'INVALIDATED'
                              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                              : (contract.decision === 'NO' || contract.verdict === 'NO' || contract.status === 'VOID' || contract.status === 'INVALIDATED')
                              ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.12)]'
                              : 'bg-indigo-950/20 border-indigo-500/30'
                          }`}>
                            <div className="flex items-center gap-3 mb-2.5">
                              <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
                                Evaluated Result:
                              </span>
                              <span className={`px-3 py-1 rounded text-xs font-black tracking-widest uppercase inline-flex items-center gap-1.5 ${
                                (contract.decision === 'YES' || contract.verdict === 'YES') && contract.status !== 'VOID' && contract.status !== 'INVALIDATED'
                                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                                  : (contract.decision === 'NO' || contract.verdict === 'NO' || contract.status === 'VOID' || contract.status === 'INVALIDATED')
                                  ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                                  : 'bg-indigo-500 text-white'
                              }`}>
                                ANSWER: {contract.status === 'VOID' || contract.status === 'INVALIDATED' ? 'NO' : (contract.decision || contract.verdict || 'EVALUATED')}
                              </span>
                            </div>
                            <div className={`text-base font-semibold leading-relaxed ${
                              (contract.decision === 'YES' || contract.verdict === 'YES') && contract.status !== 'VOID' && contract.status !== 'INVALIDATED'
                                ? 'text-emerald-300'
                                : (contract.decision === 'NO' || contract.verdict === 'NO' || contract.status === 'VOID' || contract.status === 'INVALIDATED')
                                ? 'text-red-300'
                                : 'text-indigo-200'
                            }`}>
                              {contract.status === 'VOID' || contract.status === 'INVALIDATED'
                                ? 'NO — Previous growth thesis is no longer valid. Core revenue growth fell below the falsification threshold (11% -> 6.5%).'
                                : (contract.answer || contract.thesis)}
                            </div>
                          </div>
                        )}

                        {/* ---------------- FEATURE 21: CONTINUOUS THESIS EVOLUTION / DECISION MEMORY ---------------- */}
                        {contract.thesisEvolution && (
                          <div className="p-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <History className="w-4 h-4 text-cyan-400" />
                                  <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                    Continuous Thesis Evolution & Memory
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    contract.thesisEvolution.status === 'FIRST_EVALUATION' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    contract.thesisEvolution.status === 'THESIS_EVOLVED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                                    'bg-green-500/10 text-green-400 border border-green-500/20'
                                  }`}>
                                    {contract.thesisEvolution.status === 'FIRST_EVALUATION' ? 'FIRST EVALUATION' :
                                     contract.thesisEvolution.status === 'THESIS_EVOLVED' ? 'THESIS SHIFT DETECTED' : 'NO MATERIAL CHANGE'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                  Comparing current conclusion against historical decision baseline for <strong className="text-white">{contract.thesisEvolution.subject}</strong>.
                                </p>
                              </div>

                              {!contract.thesisEvolution.isFirstEvaluation && (
                                <div className="text-right">
                                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Thesis Version</span>
                                  <span className="text-sm font-black text-cyan-400 font-mono">{contract.thesisEvolution.versionTransition}</span>
                                </div>
                              )}
                            </div>

                            {contract.thesisEvolution.isFirstEvaluation ? (
                              <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300">
                                <strong>Initial Synthesis:</strong> {contract.thesisEvolution.summary}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Metric Comparison Strips */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* Decision Shift */}
                                  <div className={`p-3 rounded-lg border text-xs ${
                                    contract.thesisEvolution.decisionShift?.changed 
                                      ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' 
                                      : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-white'
                                  }`}>
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Decision Verdict</span>
                                    <div className="flex items-center gap-2 font-bold font-mono text-sm">
                                      <span>{contract.thesisEvolution.decisionShift?.previous}</span>
                                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                      <span className={contract.thesisEvolution.decisionShift?.changed ? 'text-amber-400 font-black' : 'text-white'}>
                                        {contract.thesisEvolution.decisionShift?.current}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Confidence Shift */}
                                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Confidence Score</span>
                                    <div className="font-bold font-mono text-sm text-white">
                                      {contract.thesisEvolution.confidenceShift?.formatted}
                                    </div>
                                  </div>

                                  {/* Evidence Quality Shift */}
                                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-1">Evidence Quality</span>
                                    <div className="font-bold font-mono text-sm text-white">
                                      {contract.thesisEvolution.evidenceQualityShift?.formatted}
                                    </div>
                                  </div>
                                </div>

                                {/* Change Drivers List */}
                                <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                                  <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
                                    <GitBranch className="w-3.5 h-3.5" /> What Changed & Why Did Conclusion Shift?
                                  </div>
                                  <ul className="space-y-1.5 pl-1">
                                    {contract.thesisEvolution.drivers?.map((driver: string, idx: number) => (
                                      <li key={idx} className="text-[var(--text-secondary)] flex items-start gap-2">
                                        <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                                        <span>{driver}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Evidence Diff Chips */}
                                {((contract.thesisEvolution.evidenceDiff?.added?.length ?? 0) > 0 || 
                                  (contract.thesisEvolution.evidenceDiff?.superseded?.length ?? 0) > 0) && (
                                  <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                                    {contract.thesisEvolution.evidenceDiff.added.map((id: string) => (
                                      <span key={id} className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                        + NEW: {id}
                                      </span>
                                    ))}
                                    {contract.thesisEvolution.evidenceDiff.superseded.map((id: string) => (
                                      <span key={id} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                        ⚠ SUPERSEDED: {id}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Invalidation Banner if Revoked */}
                        {(contract.status === 'VOID' || contract.status === 'INVALIDATED') && (
                          <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg text-sm text-red-400 font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <span>⚠️ THESIS INVALIDATED: Contract automatically revoked due to Tripwire failure.</span>
                          </div>
                        )}

                        {/* Additional Synthesis Detail (if separate from question and answer) */}
                        {contract.thesis && contract.thesis !== contract.answer && contract.thesis !== contract.question && (
                          <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] block mb-1">
                              Intelligence Network Synthesis
                            </span>
                            {contract.thesis}
                          </div>
                        )}

                        {/* Why your answer is different (Explanation of system adjustment only, no duplicate prefix) */}
                        {contract.personalizationContext && (
                          <div className="p-4 bg-indigo-950/20 border border-indigo-900/50 rounded-lg text-xs">
                            <div className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] mb-1">
                              Why your answer is different:
                            </div>
                            <p className="text-indigo-200/90 leading-relaxed">
                              {contract.personalizationContext.replace(/^Why your answer is different:\s*/i, '')}
                            </p>
                          </div>
                        )}

                        {/* Thesis Version History */}
                        <div className="pt-2">
                          <h4 className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase mb-3 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Thesis Version History
                          </h4>
                          <div className="space-y-2">
                            {contract.thesisHistory?.map((history: any, idx: number) => (
                              <div key={idx} className={`text-xs p-3 rounded border flex items-center justify-between ${
                                history.status === 'INVALIDATED' ? 'bg-red-950/10 border-red-900/30' : 'bg-[var(--bg-surface-highlight)] border-[var(--border-subtle)]'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <span className={`font-mono font-bold ${history.status === 'INVALIDATED' ? 'text-red-400' : 'text-indigo-400'}`}>{history.version}</span>
                                  <span className="text-[var(--text-secondary)]">{history.reason}</span>
                                </div>
                                <span className={`font-bold tracking-widest ${history.status === 'INVALIDATED' ? 'text-red-500' : 'text-green-500'}`}>{history.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ---------------- FEATURE 23: DECISION INTEGRITY & JUDGE VERIFICATION ---------------- */}
                      {integrity && (
                        <div className="mb-8 p-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl relative overflow-hidden">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-5 h-5 text-emerald-400" />
                              <h3 className="text-sm font-bold tracking-widest uppercase text-white">Decision Integrity</h3>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-mono text-[var(--text-muted)]">Integrity Score: <span className={integrity.score === 100 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{integrity.score}%</span></div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${integrity.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                ● {integrity.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            {integrity.checks.filter((c: any) => c.status === 'PASS').slice(0, 8).map((check: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{check.name} verified</span>
                                </div>
                            ))}
                          </div>

                          <div className="border-t border-[var(--border-subtle)] pt-3">
                            <button type="button" onClick={() => setShowJudgeMode(!showJudgeMode)} className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              {showJudgeMode ? "HIDE JUDGE VERIFICATION" : "WHY THIS DECISION IS TRUSTWORTHY"}
                            </button>
                            
                            <AnimatePresence>
                              {showJudgeMode && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] overflow-hidden">
                                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mb-3">Complete Data Lineage</div>
                                  <div className="flex flex-col gap-2 relative">
                                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[var(--border-strong)] z-0"></div>
                                    {integrity.lineage.split(' -> ').map((step: string, idx: number) => (
                                      <div key={idx} className="flex items-center gap-3 z-10 relative">
                                        <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        </div>
                                        <span className="text-xs font-mono text-emerald-300 font-bold">{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* ---------------- FEATURE 7: CONFIDENCE PROVENANCE & BREAKDOWN ---------------- */}
                      <div className="mb-8 p-6 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                                Decision Confidence Provenance
                              </span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                                Deterministic Engine
                              </span>
                            </div>
                            <div className="flex items-baseline gap-4 mt-1">
                              <span className={`text-4xl font-black tracking-tight ${contract.status === 'VOID' || contract.status === 'INVALIDATED' ? 'text-red-500' : 'text-white'}`}>
                                {contract.confidence}%
                              </span>
                              <span className="text-xs text-[var(--text-secondary)]">
                                Primary Drag: <strong className="text-orange-400">{contract.confidenceBreakdown?.primaryDrag || "None"}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowProvenanceDetails(!showProvenanceDetails)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5"
                            >
                              <Search className="w-3.5 h-3.5" />
                              {showProvenanceDetails ? "Hide Provenance Chain" : "Why this confidence?"}
                            </button>
                          </div>
                        </div>

                        {/* 6-Factor Confidence Decomposition Progress Bars */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Evidence Strength</span>
                              <span className="font-bold font-mono text-white">{contract.confidenceBreakdown?.breakdown?.evidenceStrength ?? contract.confidenceBreakdown?.components?.quality}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.evidenceStrength ?? contract.confidenceBreakdown?.components?.quality} color="bg-blue-500" />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Agent Agreement</span>
                              <span className="font-bold font-mono text-white">{contract.confidenceBreakdown?.breakdown?.agentAgreement ?? contract.confidenceBreakdown?.components?.agreement}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.agentAgreement ?? contract.confidenceBreakdown?.components?.agreement} color="bg-emerald-500" />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Source Quality</span>
                              <span className="font-bold font-mono text-white">{contract.confidenceBreakdown?.breakdown?.sourceQuality ?? contract.confidenceBreakdown?.components?.quality}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.sourceQuality ?? contract.confidenceBreakdown?.components?.quality} color="bg-indigo-500" />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Data Completeness</span>
                              <span className="font-bold font-mono text-white">{contract.confidenceBreakdown?.breakdown?.dataCompleteness ?? contract.confidenceBreakdown?.components?.completeness}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.dataCompleteness ?? contract.confidenceBreakdown?.components?.completeness} color="bg-purple-500" />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Contradiction Risk</span>
                              <span className="font-bold font-mono text-orange-400">{contract.confidenceBreakdown?.breakdown?.contradictionRisk ?? contract.confidenceBreakdown?.components?.contradictionRisk}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.contradictionRisk ?? contract.confidenceBreakdown?.components?.contradictionRisk} color="bg-orange-500" />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Personalization Fit</span>
                              <span className="font-bold font-mono text-indigo-300">{contract.confidenceBreakdown?.breakdown?.personalizationFit ?? contract.investorFit}%</span>
                            </div>
                            <ProgressBar value={contract.confidenceBreakdown?.breakdown?.personalizationFit ?? contract.investorFit} color="bg-pink-500" />
                          </div>
                        </div>

                        {/* Positive & Negative Factors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-6 border-t border-[var(--border-subtle)]">
                          <div>
                            <div className="text-[10px] text-green-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-1.5">
                              <TrendingUp className="w-3 h-3" /> Positive Contributors
                            </div>
                            <div className="space-y-2">
                              {contract.confidenceBreakdown?.positiveContributors?.map((c: any, i: number) => (
                                <div key={i} className="p-2.5 rounded bg-[var(--bg-base)] border border-green-900/30 text-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-white">{c.factor}</span>
                                    <span className="font-mono text-green-400 font-bold">+{c.weight}%</span>
                                  </div>
                                  <p className="text-[11px] text-[var(--text-secondary)]">{c.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-red-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-1.5">
                              <TrendingUp className="w-3 h-3 rotate-180" /> Negative Drag Factors
                            </div>
                            <div className="space-y-2">
                              {contract.confidenceBreakdown?.negativeDrags?.map((c: any, i: number) => (
                                <div key={i} className="p-2.5 rounded bg-[var(--bg-base)] border border-red-900/30 text-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-white">{c.factor}</span>
                                    <span className="font-mono text-red-400 font-bold">-{c.weight}%</span>
                                  </div>
                                  <p className="text-[11px] text-[var(--text-secondary)]">{c.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* EXPANDABLE PROVENANCE REASONING CHAIN & DISAGREEMENT MATRIX */}
                        <AnimatePresence>
                          {showProvenanceDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-6 mt-6 border-t border-[var(--border-subtle)] space-y-6"
                            >
                              {/* 1. Evidence -> Claim -> Agent -> Counter-Evidence -> Impact Reasoning Chain */}
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <GitCommit className="w-3.5 h-3.5 text-[var(--accent-indigo)]" />
                                  Evidence &rarr; Claim &rarr; Decision Provenance Chain
                                </h4>
                                <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-900/50">
                                  {contract.confidenceBreakdown?.reasoningChain?.map((item: any, idx: number) => (
                                    <div key={idx} className="relative pl-10">
                                      <div className="absolute left-2.5 top-3 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[var(--bg-surface-elevated)] shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                      <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                                        <div className="flex justify-between items-center mb-1.5">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                              Step {item.step}: {item.type}
                                            </span>
                                            <span className="font-bold text-white">{item.title}</span>
                                          </div>
                                          {item.sourceTier && (
                                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                                              item.sourceTier.includes('PRIMARY') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                              item.sourceTier.includes('HIGH QUALITY') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                              item.sourceTier.includes('SECONDARY') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                              'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                              {item.sourceTier}
                                            </span>
                                          )}
                                          {item.stance && (
                                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                              item.stance === 'SUPPORTS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                              item.stance === 'OPPOSES' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                              {item.agentName}: {item.stance}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[var(--text-secondary)] leading-relaxed">{item.statement}</p>
                                        {item.sourceName && (
                                          <div className="mt-2 text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                                            <Database className="w-3 h-3" /> Source: {item.sourceName} (Reliability: {item.reliability}%)
                                          </div>
                                        )}
                                        {item.netImpact && (
                                          <div className="mt-2 text-[10px] font-bold text-orange-400 font-mono">
                                            Impact: {item.netImpact}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Specialized Agent Disagreement Matrix */}
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                                  Specialized Agent Contradiction & Disagreement
                                </h4>
                                <div className="p-3 bg-orange-950/20 border border-orange-900/40 rounded-lg text-xs text-orange-300 mb-3">
                                  {contract.confidenceBreakdown?.agentDisagreementSummary}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {contract.confidenceBreakdown?.agentDisagreements?.map((agent: any, idx: number) => (
                                    <div key={idx} className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                                      <div className="min-w-0 pr-2">
                                        <span className="font-bold text-white block truncate">{agent.agentName}</span>
                                        <span className="text-[10px] text-[var(--text-muted)]">{agent.role}</span>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                                        agent.stance === 'SUPPORTS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        agent.stance === 'OPPOSES' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        agent.stance === 'CAUTION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                      }`}>
                                        {agent.stance}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 3. Source Independence Lineage */}
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <Database className="w-3.5 h-3.5 text-blue-400" />
                                  Source Independence Lineage & Duplication Verification
                                </h4>
                                <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-xs text-blue-300 flex items-center justify-between">
                                  <span>{contract.confidenceBreakdown?.sourceIndependenceSummary}</span>
                                  <span className="font-mono font-bold text-white">Independence: {contract.confidenceBreakdown?.breakdown?.sourceIndependence}%</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* ---------------- FEATURE 20: EVIDENCE CHALLENGE ENGINE ---------------- */}
                      {contract.evidenceChallenge && (
                        <div className="mb-8 p-6 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl relative overflow-hidden">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Scale className="w-4 h-4 text-amber-400" />
                                <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                  Evidence Challenge Engine
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  contract.evidenceChallenge.status === 'SUPPORTED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                  contract.evidenceChallenge.status === 'CHALLENGED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {contract.evidenceChallenge.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                Actively evaluating what evidence could disprove this decision.
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Evidence Quality</span>
                              <span className="text-xl font-black text-white font-mono">{contract.evidenceChallenge.evidenceQuality}%</span>
                            </div>
                          </div>

                          {/* Quality Progress Bar */}
                          <div className="mb-5">
                            <ProgressBar 
                              value={contract.evidenceChallenge.evidenceQuality} 
                              color={contract.evidenceChallenge.evidenceQuality >= 75 ? 'bg-emerald-500' : contract.evidenceChallenge.evidenceQuality >= 50 ? 'bg-amber-500' : 'bg-red-500'} 
                            />
                          </div>

                          {/* Challenge Summary Banner */}
                          <div className={`p-3.5 rounded-lg border text-xs leading-relaxed mb-5 ${
                            contract.evidenceChallenge.status === 'SUPPORTED' ? 'bg-green-950/20 border-green-900/40 text-green-300' :
                            contract.evidenceChallenge.status === 'CHALLENGED' ? 'bg-amber-950/20 border-amber-900/40 text-amber-300' :
                            'bg-red-950/20 border-red-900/40 text-red-300'
                          }`}>
                            <strong>Challenger Verdict:</strong> {contract.evidenceChallenge.challengeSummary}
                          </div>

                          {/* Strongest vs Weakest Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-1.5 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Strongest Supporting Evidence
                              </div>
                              <p className="text-white font-medium">{contract.evidenceChallenge.strongestEvidence}</p>
                            </div>

                            <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-1.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> Most Fragile Evidence Point
                              </div>
                              <p className="text-white font-medium">{contract.evidenceChallenge.weakestEvidence}</p>
                            </div>
                          </div>

                          {/* Contradictions & Fragility Counts */}
                          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                            <div className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Contradictions</span>
                              <span className={`text-base font-bold font-mono ${contract.evidenceChallenge.contradictions?.length > 0 ? 'text-orange-400' : 'text-white'}`}>
                                {contract.evidenceChallenge.contradictions?.length || 0}
                              </span>
                            </div>
                            <div className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Stale Nodes</span>
                              <span className="text-base font-bold font-mono text-white">
                                {contract.evidenceChallenge.staleEvidence?.length || 0}
                              </span>
                            </div>
                            <div className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Unsupported</span>
                              <span className={`text-base font-bold font-mono ${contract.evidenceChallenge.unsupportedClaims?.length > 0 ? 'text-amber-400' : 'text-white'}`}>
                                {contract.evidenceChallenge.unsupportedClaims?.length || 0}
                              </span>
                            </div>
                          </div>

                          {/* Contradiction details if any */}
                          {contract.evidenceChallenge.contradictions?.length > 0 && (
                            <div className="mb-5 space-y-2">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
                                Detected Conflict
                              </div>
                              {contract.evidenceChallenge.contradictions.map((c: any, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg bg-orange-950/20 border border-orange-900/30 text-xs text-orange-200">
                                  <span className="font-bold text-white block mb-0.5">[{c.primaryNodeId} vs {c.conflictingNodeId}]: {c.conflictType}</span>
                                  {c.explanation}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* MIRROR Behavioral Challenge if triggered */}
                          {contract.evidenceChallenge.mirrorBehavioralChallenge && (
                            <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs mb-5">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-1 flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" /> MIRROR Challenge: {contract.evidenceChallenge.mirrorBehavioralChallenge.patternName}
                              </div>
                              <p className="text-purple-200 leading-relaxed mb-2">{contract.evidenceChallenge.mirrorBehavioralChallenge.warning}</p>
                              <div className="text-[11px] text-purple-300 font-medium">
                                <strong>Rule:</strong> {contract.evidenceChallenge.mirrorBehavioralChallenge.preventativeRule}
                              </div>
                            </div>
                          )}

                          {/* Claim -> Evidence Provenance Matrix Table */}
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                              <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Claim &rarr; Evidence Provenance Matrix
                            </div>
                            <div className="space-y-2">
                              {contract.evidenceChallenge.evidenceProvenanceMatrix?.map((row: any, idx: number) => (
                                <div key={idx} className="p-2.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-bold text-white">{row.claim}</span>
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-surface-elevated)] text-indigo-300 font-mono">{row.evidenceId}</span>
                                    </div>
                                    <p className="text-[11px] text-[var(--text-muted)]">{row.sourceName} • {row.freshness}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      row.result === 'SUPPORTED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                      row.result === 'CHALLENGED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                      row.result === 'CONTRADICTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    }`}>
                                      {row.result}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ---------------- FEATURE 22: DECISION STRESS TEST / ADVERSARIAL SCENARIOS ---------------- */}
                      {contract.stressTest && (
                        <div className="mb-8 p-6 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl relative overflow-hidden">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <h4 className="text-xs font-bold tracking-widest text-white uppercase">
                                  Decision Stress Test & Adversarial Scenarios
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  contract.stressTest.status === 'ROBUST' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                  contract.stressTest.status === 'FRAGILE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {contract.stressTest.status}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                                  HYPOTHETICAL SIMULATION
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                Proving how much of this decision's evidentiary foundation can fail before the thesis breaks.
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Stress Range</span>
                              <span className="text-sm font-black text-orange-400 font-mono">
                                {contract.stressTest.baseConfidence}% &rarr; {contract.stressTest.worstCaseConfidence}%
                              </span>
                            </div>
                          </div>

                          {/* Fragility Index Progress Bar */}
                          <div className="mb-5">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                              <span className="text-[var(--text-secondary)]">Fragility Index: <strong className="text-white">{contract.stressTest.fragilityScore}/100</strong></span>
                              <span className={`font-bold uppercase tracking-wider text-[10px] ${
                                contract.stressTest.status === 'ROBUST' ? 'text-green-400' :
                                contract.stressTest.status === 'FRAGILE' ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {contract.stressTest.status} FOUNDATION
                              </span>
                            </div>
                            <ProgressBar 
                              value={contract.stressTest.fragilityScore} 
                              color={contract.stressTest.fragilityScore < 40 ? 'bg-emerald-500' : contract.stressTest.fragilityScore < 70 ? 'bg-amber-500' : 'bg-red-500'} 
                            />
                          </div>

                          {/* Adversarial Scenario Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                            {contract.stressTest.scenarios?.map((scen: any) => (
                              <div key={scen.id} className={`p-3.5 rounded-lg border text-xs transition-all ${
                                scen.status === 'THESIS_BREAKS' 
                                  ? 'bg-red-950/20 border-red-900/50 text-red-200' 
                                  : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                              }`}>
                                <div className="flex justify-between items-center mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[var(--bg-surface-elevated)] text-orange-300">
                                      {scen.id}
                                    </span>
                                    <span className="font-bold text-white">{scen.name}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    scen.status === 'SURVIVES' 
                                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                                  }`}>
                                    {scen.status === 'SURVIVES' ? '✓ SURVIVES' : '⚠ THESIS BREAKS'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 my-2 font-mono text-[11px] bg-[var(--bg-surface-elevated)] p-2 rounded border border-[var(--border-subtle)]">
                                  <span>Confidence: <strong className="text-white">{scen.confidenceBefore}% &rarr; {scen.confidenceAfter}%</strong></span>
                                  <span>Verdict: <strong className={scen.decisionBefore !== scen.decisionAfter ? 'text-amber-400' : 'text-white'}>{scen.decisionBefore} &rarr; {scen.decisionAfter}</strong></span>
                                </div>

                                <p className="text-[11px] leading-relaxed mb-1 text-[var(--text-muted)]">
                                  <strong className="text-white font-semibold">Stress:</strong> {scen.trigger}
                                </p>
                                <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                                  <strong className="text-orange-400 font-semibold">Outcome:</strong> {scen.reason}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* What Would Break This Decision vs What Would Not Break It */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                            {/* What Would Break It */}
                            <div className="p-4 rounded-lg bg-red-950/15 border border-red-900/30 text-xs">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-2.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> What Would Break This Decision?
                              </div>
                              <ul className="space-y-1.5">
                                {contract.stressTest.survivalConditions?.map((cond: string, idx: number) => (
                                  <li key={idx} className="text-red-200/90 flex items-start gap-2 text-[11px]">
                                    <span className="text-red-400 font-bold font-mono">•</span>
                                    <span>Failure if: {cond.replace("must remain strictly", "fails").replace("must remain", "fails")}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* What Would Not Break It */}
                            <div className="p-4 rounded-lg bg-green-950/15 border border-green-900/30 text-xs">
                              <div className="text-[10px] uppercase font-bold tracking-widest text-green-400 mb-2.5 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> What Would Not Break It? (Resilience)
                              </div>
                              <ul className="space-y-1.5">
                                {contract.stressTest.nonBreakingFactors?.map((factor: string, idx: number) => (
                                  <li key={idx} className="text-green-200/90 flex items-start gap-2 text-[11px]">
                                    <span className="text-green-400 font-bold font-mono">✓</span>
                                    <span>{factor}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ---------------- WHAT WOULD CHANGE THIS DECISION? (FALSIFICATION PREDICATES) ---------------- */}
                      <div className="mb-8 p-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] rounded-xl">
                        <h4 className="text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" /> What Would Change This Decision? (Falsification Predicates)
                        </h4>
                        <div className="space-y-2.5">
                          {contract.tripwires?.map((tw: any, idx: number) => (
                            <div key={idx} className={`p-3 rounded-lg border transition-all ${
                              tw.status === 'TRIGGERED' ? 'bg-red-950/20 border-red-900/50' : 
                              tw.status === 'WARNING' ? 'bg-amber-950/10 border-amber-900/30' :
                              tw.status === 'CONTESTED' ? 'bg-orange-950/20 border-orange-900/50' :
                              tw.status === 'UNKNOWN' ? 'bg-[var(--bg-base)] border-[var(--border-subtle)] opacity-70' :
                              'bg-[var(--bg-base)] border-[var(--border-strong)]'
                            }`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className={`text-xs font-bold ${tw.status === 'TRIGGERED' ? 'text-red-400' : tw.status === 'CONTESTED' ? 'text-orange-400' : tw.status === 'UNKNOWN' ? 'text-[var(--text-muted)]' : 'text-white'}`}>
                                    Predicate: {tw.metric} {tw.operator} {tw.threshold}{tw.unit !== 'ratio' && tw.unit !== 'status' ? tw.unit : ''}
                                  </span>
                                  <div className="flex gap-4 mt-1 text-[10px] text-[var(--text-secondary)] font-mono">
                                    <span>Evaluated: <strong className="text-white">{tw.lastEvaluatedValue}</strong></span>
                                    <span>Source Node: <strong className="text-indigo-400">{tw.sourceEvidenceId}</strong></span>
                                  </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-widest ${
                                  tw.status === 'SAFE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                  tw.status === 'TRIGGERED' ? 'bg-red-500/20 text-red-500 border border-red-500/40 animate-pulse' :
                                  tw.status === 'CONTESTED' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                  tw.status === 'UNKNOWN' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                  'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                }`}>
                                  {tw.status === 'SAFE' ? 'ARMED / SAFE' : tw.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* RIGHT COL: WAR ROOM & BLAST RADIUS */}
                  <div className="space-y-6">
                    {/* Blast Radius */}
                    <section className="premium-panel rounded-xl p-6 border-[var(--border-strong)]">
                      <h4 className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase mb-5">Blast Radius (Portfolio)</h4>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-[var(--text-secondary)]">Tech Exposure</span>
                        <div className="flex items-center gap-3 text-lg font-bold font-mono">
                          <span className="text-[var(--text-muted)]">{contract.blastRadius.before}</span>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                          <span className={activeUser === 'user1' ? 'text-amber-500' : 'text-white'}>{contract.blastRadius.after}</span>
                        </div>
                      </div>
                      <p className={`text-xs p-3 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] ${activeUser === 'user1' ? 'text-amber-400' : 'text-[var(--text-secondary)]'}`}>
                        {contract.blastRadius.warning}
                      </p>
                    </section>

                    {/* Agent War Room */}
                    <section className="premium-panel rounded-xl p-6 border-[var(--border-strong)] flex-1">
                      <div className="flex justify-between items-center mb-5">
                        <h4 className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase">Agent Dissent Matrix</h4>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">DISSENT INDEX: <span className={contract.confidenceBreakdown.dissentIndex > 40 ? 'text-orange-400 font-bold' : 'text-white'}>{contract.confidenceBreakdown.dissentIndex}/100</span></div>
                      </div>
                      
                      <div className="space-y-1 mt-4">
                        {contract.agents.map((agent: any, idx: number) => (
                          <div key={idx} className="group p-3 hover:bg-[var(--bg-surface-highlight)] rounded-lg transition-colors cursor-default border border-transparent hover:border-[var(--border-subtle)]">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'bullish' ? 'bg-green-500 shadow-[0_0_5px_#10b981]' : agent.status === 'bearish' ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-amber-500 shadow-[0_0_5px_#f59e0b]'}`}></span>
                                <span className="text-xs font-bold text-white tracking-wide">{agent.name}</span>
                              </div>
                              <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{agent.role}</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] pl-3.5 leading-relaxed">{agent.message}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* MIRROR: Behavioral Risk Panel */}
                    {contract.behavioralData && (
                      <section className="premium-panel rounded-xl p-6 border-[var(--border-strong)]">
                        <div className="flex justify-between items-center mb-5">
                          <h4 className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-purple-400" /> Mirror — Behavioral Risk
                          </h4>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">USER ISOLATION: ACTIVE</div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--text-secondary)]">Behavioral Risk Score</span>
                            <span className="font-bold text-white">{contract.behavioralData.riskScore} / 100</span>
                          </div>
                          <ProgressBar value={contract.behavioralData.riskScore} color={contract.behavioralData.riskScore > 70 ? 'bg-orange-500' : 'bg-green-500'} />
                        </div>

                        {/* Trade Shape Match */}
                        {contract.behavioralData.matchedDecisions && contract.behavioralData.matchedDecisions.length > 0 ? (
                          <div className="mb-4">
                            <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">Trade Shape Match</div>
                            <div className="space-y-2">
                              {contract.behavioralData?.matchedDecisions?.map((decision: any, idx: number) => (
                                <div key={idx} className="bg-[var(--bg-surface-elevated)] p-3 rounded border border-[var(--border-subtle)]">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-white">{decision.id} &rarr; {decision.asset}</span>
                                    <span className={`text-xs font-mono font-bold ${decision.outcome.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{decision.outcome}</span>
                                  </div>
                                  <div className="text-[10px] text-[var(--text-secondary)]">{decision.entryReason}</div>
                                  <div className="mt-1 text-[9px] uppercase tracking-widest text-orange-400 font-semibold border-t border-[var(--border-subtle)] pt-1">Pattern: {decision.pattern}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-[var(--text-muted)] mb-4">No significant negative historical trade matches.</div>
                        )}

                        {/* Personal Adversary Alert */}
                        {contract.behavioralData.riskScore > 50 && (
                          <div className="p-3 bg-orange-950/20 border border-orange-900/50 rounded-lg">
                            <h5 className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Personal Adversary Alert
                            </h5>
                            <p className="text-xs text-orange-400/80 leading-relaxed">
                              {contract.behavioralData.intervention}
                            </p>
                          </div>
                        )}
                      </section>
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  // IF NOT AUTHENTICATED, SHOW LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-indigo)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] mb-6 shadow-2xl">
              <Shield className="w-8 h-8 text-[var(--accent-indigo)]" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Welcome to SentinelIQ</h1>
            <p className="text-[var(--text-secondary)] text-lg">Multi-Agent Autonomous Financial Intelligence</p>
          </div>

          <div className="premium-panel rounded-2xl p-8 border border-[var(--border-strong)] shadow-2xl bg-[var(--bg-surface-elevated)]/80 backdrop-blur-xl">
            <h2 className="text-sm uppercase tracking-widest font-bold text-[var(--text-muted)] mb-6 text-center">Select Demo Persona to Enter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(USERS).map(([id, p]) => (
                <button
                  key={id}
                  onClick={() => { setActiveUser(id as any); setIsAuthenticated(true); }}
                  className="group relative text-left p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-indigo-500/50 hover:bg-indigo-950/10 transition-all duration-300"
                >
                  {/* Tooltip trigger (the 'i' icon) */}
                  <div className="absolute top-4 right-4 z-20 group/tooltip" onClick={(e) => e.stopPropagation()}>
                    <div className="w-6 h-6 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                      <span className="text-xs font-bold font-serif italic">i</span>
                    </div>
                    {/* Tooltip Dropdown */}
                    <div className="absolute bottom-full mb-2 right-0 w-64 p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{p.profile} Persona</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                        {p.name === 'Arjun' && "Demonstrates risk-mitigation. Automatically configures the Agent War Room with defensive models and tracks 'Recent-Performance' cognitive bias."}
                        {p.name === 'Priya' && "Demonstrates high-velocity targeting. Deploys momentum/sentiment agents and warns the user against 'Over-Sizing' portfolio risk."}
                        {p.name === 'Karthik' && "Demonstrates balanced yield generation. Configures Dividend Trackers and monitors the user for 'Loss Aversion' panic selling."}
                      </p>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-highlight)] flex items-center justify-center text-lg font-bold text-white mb-4 group-hover:bg-[var(--accent-indigo)] transition-colors">
                    {p.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">{p.profile} Investor</p>
                  
                  <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                    <div className="flex justify-between"><span>Risk:</span> <span className="font-mono text-white">{p.riskTolerance}</span></div>
                    <div className="flex justify-between"><span>Horizon:</span> <span className="font-mono text-white">{p.horizon}</span></div>
                    <div className="flex justify-between"><span>Portfolio:</span> <span className="font-mono text-white">{p.portfolio.total}</span></div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-6">
              Select a persona to demonstrate how the Agent War Room and Behavioral Mirror physically restructure to protect that specific user's portfolio.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans overflow-hidden">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-[280px] border-r border-[var(--border-strong)] flex flex-col bg-[var(--bg-surface)] z-20">
        <div className="h-16 px-6 border-b border-[var(--border-strong)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[var(--accent-indigo)]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase">Tripwire</h1>
            <p className="text-[10px] text-[var(--text-muted)] tracking-wider">AI Financial Intelligence</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2 mt-4">Command Center</p>
          <NavItem icon={<Activity />} label="Dashboard" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <NavItem icon={<Shield />} label="Decision Firewall" active={currentView === "firewall"} onClick={() => setCurrentView("firewall")} />
          <NavItem icon={<Briefcase />} label="Agent War Room" active={currentView === "war-room"} onClick={() => setCurrentView("war-room")} />
          
          <p className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2 mt-8">Intelligence</p>
          <NavItem icon={<Database />} label="Evidence Ledger" active={currentView === "ledger"} onClick={() => setCurrentView("ledger")} />
          <NavItem icon={<UserIcon />} label="Behavioral Mirror" active={currentView === "mirror"} onClick={() => setCurrentView("mirror")} />
          <NavItem icon={<History />} label="Regret Ledger" active={currentView === "regret"} onClick={() => setCurrentView("regret")} />
          <NavItem icon={<GitCommit />} label="Decision Replay" active={currentView === "replay"} onClick={() => setCurrentView("replay")} />
        </nav>

        {/* User Profile Switcher */}
        <div className="p-4 border-t border-[var(--border-strong)] bg-[var(--bg-surface-highlight)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <select 
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none truncate"
                value={activeUser}
                onChange={(e) => setActiveUser(e.target.value as "user1" | "user2" | "user3")}
              >
                <option value="user1" className="bg-[#111]">Arjun (Conservative)</option>
                <option value="user2" className="bg-[#111]">Priya (Growth)</option>
                <option value="user3" className="bg-[#111]">Karthik (Balanced)</option>
              </select>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user.profile} Investor</p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <span>Risk: <strong className={user.riskTolerance === 'High' ? 'text-amber-500' : 'text-green-500'}>{user.riskTolerance}</strong></span>
            <span>Horizon: <strong>{user.horizon}</strong></span>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--bg-base)]">
        
        {/* Top Header */}
        <header className="h-16 border-b border-[var(--border-strong)] flex items-center justify-between px-8 bg-[var(--bg-surface)]/80 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">Good morning, {user.name}</span>
            <span className="text-[var(--text-muted)]">|</span>
            <span>Decision Intelligence Overview</span>
          </div>
          <div className="flex gap-6 items-center text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${showDemoControls ? 'bg-orange-500 animate-pulse' : 'bg-[var(--accent-green)] animate-pulse'}`}></span>
              <span className={`text-[var(--text-secondary)] font-bold tracking-widest ${showDemoControls ? 'text-orange-400' : ''}`}>{showDemoControls ? '[REPLAY MODE]' : 'LIVE MODE'}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] border-l border-[var(--border-strong)] pl-6">
              <Clock className="w-3 h-3" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Metrics Row */}
            <section className="grid grid-cols-4 gap-4">
              <MetricCard title="Portfolio Value" value={user.portfolio.total} subtext="Real-time valuation" trend="+2.84%" positive={true} />
              <MetricCard title="Decision Confidence" value={contract ? `${contract.confidence}%` : "--"} subtext="System calibration" trend="Active" />
              <MetricCard title="Thesis Integrity" value={contract && contract.status !== 'VOID' && contract.status !== 'INVALIDATED' ? "84/100" : "--"} subtext="Aggregated score" trend="" />
              <MetricCard title="Data Integrity" value="98.4%" subtext="Source verification" trend="Optimal" positive={true} />
            </section>

            {/* Dynamic View Rendering */}
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>

          </div>
        </div>
      </main>

      {/* ---------------- DEMO CONTROL PANEL ---------------- */}
      <button 
        onClick={() => setShowDemoControls(!showDemoControls)} 
        className="fixed bottom-6 right-20 w-12 h-12 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] flex items-center justify-center shadow-xl text-[var(--text-muted)] hover:text-white hover:border-[var(--accent-indigo)] transition-all z-50"
      >
        <Settings className={`w-5 h-5 transition-transform ${showDemoControls ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
      {showDemoControls && currentView === 'firewall' && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-24 right-6 premium-glass rounded-xl p-5 shadow-2xl z-50 flex flex-col gap-3 min-w-[280px]"
        >
          <div className="flex justify-between items-center mb-2 border-b border-[var(--border-strong)] pb-3">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Demo Control Center</span>
            <button onClick={() => setShowDemoControls(false)}><XCircle className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-white" /></button>
          </div>
          <button onClick={() => handleAnalyze()} className="text-xs font-semibold text-white bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-highlight)] border border-[var(--border-strong)] py-2.5 rounded transition-all flex justify-center gap-2">
            <span>↻</span> Reset / Re-run Simulation
          </button>
          <button 
            onClick={() => triggerEvent('TRIPWIRE_FIRE')} 
            disabled={!contract || contract.status === 'VOID' || contract.status === 'INVALIDATED'}
            className="text-xs font-semibold text-amber-500 bg-amber-950/20 border border-amber-900/50 hover:bg-amber-950/40 py-2.5 rounded transition-all disabled:opacity-30 flex justify-center gap-2"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Fire Revenue Tripwire
          </button>
          <button 
            onClick={() => triggerEvent('DATA_FAILURE')} 
            className="text-xs font-semibold text-red-500 bg-red-950/20 border border-red-900/50 hover:bg-red-950/40 py-2.5 rounded transition-all flex justify-center gap-2"
          >
            <XCircle className="w-3.5 h-3.5" /> Force Data Failure
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {/* ---------------- WHY THIS SCORE MODAL ---------------- */}
      <AnimatePresence>
        {showWhyScore && contract && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-[var(--border-strong)] flex justify-between items-center bg-[var(--bg-surface-highlight)]">
                <div>
                  <h3 className="text-lg font-bold text-white">Confidence Calibration & Provenance</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Mathematical decomposition & evidentiary lineage of the decision confidence score.</p>
                </div>
                <button onClick={() => setShowWhyScore(false)}><XCircle className="w-5 h-5 text-[var(--text-muted)] hover:text-white" /></button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto space-y-8">
                <div className="text-center">
                  <div className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase mb-1">Calibrated Confidence Score</div>
                  <div className={`text-6xl font-black mb-2 ${contract.status === 'VOID' || contract.status === 'INVALIDATED' ? 'text-red-500' : 'text-white'}`}>{contract.confidence}%</div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded border border-indigo-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DETERMINISTIC EVIDENCE PROVENANCE
                  </div>
                </div>

                {/* 6 Metric Breakdown Bars */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Mathematical Component Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Evidence Strength</span>
                        <span className="font-bold text-white font-mono">{contract.confidenceBreakdown?.breakdown?.evidenceStrength ?? contract.confidenceBreakdown?.components?.quality}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.evidenceStrength ?? contract.confidenceBreakdown?.components?.quality} color="bg-blue-500" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Agent Agreement</span>
                        <span className="font-bold text-white font-mono">{contract.confidenceBreakdown?.breakdown?.agentAgreement ?? contract.confidenceBreakdown?.components?.agreement}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.agentAgreement ?? contract.confidenceBreakdown?.components?.agreement} color="bg-emerald-500" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Source Quality</span>
                        <span className="font-bold text-white font-mono">{contract.confidenceBreakdown?.breakdown?.sourceQuality ?? contract.confidenceBreakdown?.components?.quality}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.sourceQuality ?? contract.confidenceBreakdown?.components?.quality} color="bg-indigo-500" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Data Completeness</span>
                        <span className="font-bold text-white font-mono">{contract.confidenceBreakdown?.breakdown?.dataCompleteness ?? contract.confidenceBreakdown?.components?.completeness}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.dataCompleteness ?? contract.confidenceBreakdown?.components?.completeness} color="bg-purple-500" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Contradiction Risk</span>
                        <span className="font-bold text-orange-400 font-mono">{contract.confidenceBreakdown?.breakdown?.contradictionRisk ?? contract.confidenceBreakdown?.components?.contradictionRisk}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.contradictionRisk ?? contract.confidenceBreakdown?.components?.contradictionRisk} color="bg-orange-500" />
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">Personalization Fit</span>
                        <span className="font-bold text-indigo-300 font-mono">{contract.confidenceBreakdown?.breakdown?.personalizationFit ?? contract.investorFit}%</span>
                      </div>
                      <ProgressBar value={contract.confidenceBreakdown?.breakdown?.personalizationFit ?? contract.investorFit} color="bg-pink-500" />
                    </div>
                  </div>
                </div>

                {/* Positive & Negative Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> Positive Contributors</h4>
                    <div className="space-y-2.5">
                      {contract.confidenceBreakdown?.positiveContributors?.map((c: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-green-900/30 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{c.factor}</span>
                            <span className="font-mono text-green-400 font-bold">+{c.weight}%</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)]">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 rotate-180"/> Negative Drag Factors</h4>
                    <div className="space-y-2.5">
                      {contract.confidenceBreakdown?.negativeDrags?.map((c: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-red-900/30 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{c.factor}</span>
                            <span className="font-mono text-red-400 font-bold">-{c.weight}%</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)]">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reasoning Chain */}
                {contract.confidenceBreakdown?.reasoningChain && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                      <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Evidence &rarr; Claim &rarr; Decision Reasoning Chain
                    </h4>
                    <div className="space-y-2.5">
                      {contract.confidenceBreakdown.reasoningChain.map((step: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold uppercase">Step {step.step}: {step.type}</span>
                              <span className="font-bold text-white">{step.title}</span>
                            </div>
                            {step.stance && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                step.stance === 'SUPPORTS' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>{step.agentName}: {step.stance}</span>
                            )}
                          </div>
                          <p className="text-[var(--text-secondary)]">{step.statement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-orange-950/20 border border-orange-900/50 rounded-lg text-center">
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Primary Confidence Drag</div>
                  <div className="text-base text-orange-400 font-semibold">{contract.confidenceBreakdown?.primaryDrag || "None"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FEATURE 8: DECISION REPLAY MODAL */}
      <AnimatePresence>
        {showReplayModal && selectedReplay && (
          <DecisionReplayModal snapshot={selectedReplay} onClose={() => setShowReplayModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- REUSABLE COMPONENTS & VIEWS ----------------

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
      active ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 
      'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-highlight)] hover:text-white font-medium'
    }`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" }) : icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function MetricCard({ title, value, subtext, trend, positive }: { title: string, value: string, subtext: string, trend: string, positive?: boolean }) {
  return (
    <div className="premium-panel p-5 rounded-xl">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{title}</h4>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            positive ? 'bg-green-500/10 text-green-400' : 
            trend === 'Active' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[var(--bg-surface-highlight)] text-[var(--text-secondary)]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-xs text-[var(--text-secondary)]">{subtext}</div>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number, color: string }) {
  return (
    <div className="w-full h-1 bg-[var(--bg-base)] rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  );
}

// ---------------- MOCK VIEWS ----------------

function DashboardView({ 
  user, dashboardData, contract, isReplaying, replayStage, handleStartReplay 
}: { 
  user: any, dashboardData: any, contract: any, isReplaying: boolean, replayStage: number, handleStartReplay: () => void 
}) {
  if (!dashboardData) return <div className="text-white p-8 animate-pulse">Loading Financial Intelligence...</div>;

  const { portfolioTrend, riskExposure } = dashboardData;
  
  let confidenceData = [
    { stage: "Initial", confidence: contract?.confidence || 0 }
  ];
  if (isReplaying) {
     confidenceData = [
       { stage: "Initial", confidence: 78 },
       { stage: "Armed", confidence: 78 },
       { stage: "Event", confidence: 78 },
       { stage: "Trigger", confidence: 35 },
       { stage: "Retract", confidence: 0 },
       { stage: "v2", confidence: 42 }
     ].slice(0, Math.max(1, replayStage - 1));
  } else if (contract) {
     if (contract.status === "VOID" || contract.status === "INVALIDATED") {
       confidenceData.push({ stage: "Triggered", confidence: 35 });
       confidenceData.push({ stage: "Void", confidence: 0 });
     }
  }

  let agentData: any[] = [];
  if (contract?.agents) {
    agentData = contract.agents.map((a: any) => ({
      name: a.name.split(' ')[0],
      strength: a.status === 'bullish' ? 80 : a.status === 'bearish' ? -80 : 0
    }));
  }

  let evidenceData: any[] = [];
  if (contract?.evidenceGraph) {
     const counts: any = {};
     contract.evidenceGraph.forEach((e: any) => {
       counts[e.sourceTier] = (counts[e.sourceTier] || 0) + 1;
     });
     evidenceData = Object.keys(counts).map(k => ({ name: k.split(' ')[0], value: counts[k] }));
  }

  let tripwireData: any[] = [];
  if (contract?.tripwires) {
    tripwireData = contract.tripwires.map((tw: any) => ({
      name: tw.metric,
      status: tw.status === "SAFE" ? 1 : tw.status === "TRIGGERED" ? 0 : 0.5
    }));
  }
  if (isReplaying && replayStage >= 5) {
     tripwireData = [{ name: "Revenue Growth", status: 0 }];
  } else if (isReplaying && replayStage >= 3) {
     tripwireData = [{ name: "Revenue Growth", status: 1 }];
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 mt-4 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Financial Intelligence</h2>
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mt-1">Live Engine Telemetry</p>
        </div>
        <button 
          onClick={handleStartReplay} 
          disabled={!contract || isReplaying}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
        >
          {isReplaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          {isReplaying ? `Replaying... Stage ${replayStage}/8` : "Trigger Replay"}
        </button>
      </div>

      {isReplaying && (
         <div className="w-full bg-indigo-900/30 rounded-full h-1.5 mb-8">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(replayStage / 8) * 100}%` }}></div>
         </div>
      )}

      <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase border-b border-[var(--border-strong)] pb-2">Financial Intelligence</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)]">
          <h4 className="text-sm font-semibold text-white mb-4">Portfolio Exposure Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                <YAxis stroke="#ffffff50" fontSize={10} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} width={40} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)] relative overflow-hidden">
          <h4 className="text-sm font-semibold text-white mb-4">Decision Confidence Timeline</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="stage" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                <YAxis domain={[0, 100]} stroke="#ffffff50" fontSize={10} width={30} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="stepAfter" dataKey="confidence" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase border-b border-[var(--border-strong)] pb-2 pt-4">Decision Intelligence</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)]">
          <h4 className="text-sm font-semibold text-white mb-4">Agent Signal Matrix</h4>
          {agentData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" domain={[-100, 100]} stroke="#ffffff50" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={10} width={60} />
                  <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Bar dataKey="strength">
                    {agentData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.strength > 0 ? '#10b981' : entry.strength < 0 ? '#ef4444' : '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[var(--text-muted)] text-sm">No agent data available. Run analysis.</div>
          )}
        </div>

        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)]">
          <h4 className="text-sm font-semibold text-white mb-4">Evidence Quality Tiers</h4>
          {evidenceData.length > 0 ? (
            <div className="h-64 flex">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={evidenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {evidenceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[var(--text-muted)] text-sm">No evidence available.</div>
          )}
        </div>
      </div>

      <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase border-b border-[var(--border-strong)] pb-2 pt-4">Risk Intelligence</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)]">
          <h4 className="text-sm font-semibold text-white mb-4">Portfolio Risk Exposure</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskExposure} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {riskExposure.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)] relative">
          <h4 className="text-sm font-semibold text-white mb-4">Tripwire Monitor</h4>
          {tripwireData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -20, bottom: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} />
                  <YAxis dataKey="status" domain={[0, 1.2]} tickFormatter={(val) => val === 1 ? 'SAFE' : val === 0 ? 'TRIG' : ''} stroke="#ffffff50" fontSize={10} />
                  <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Scatter name="Tripwires" data={tripwireData} fill="#f59e0b">
                    {tripwireData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.status === 1 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[var(--text-muted)] text-sm">No active tripwires.</div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isReplaying && replayStage >= 6 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-black border border-[var(--border-strong)] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2"><GitBranch className="w-4 h-4 text-indigo-400" /> Decision Change Retraction</h4>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
               <div className="p-4 border border-green-500/30 bg-green-950/20 rounded-lg text-center flex-1 w-full">
                  <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-2">Before (v1)</div>
                  <div className="text-2xl font-black text-white">YES</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Confidence: 78%</div>
               </div>
               <div className="text-[var(--text-muted)] flex flex-col items-center">
                  <span className="text-xs uppercase font-bold tracking-widest text-red-400 mb-1">Trigger</span>
                  <ArrowRight className="w-6 h-6" />
               </div>
               <div className="p-4 border border-red-500/30 bg-red-950/20 rounded-lg text-center flex-1 w-full">
                  <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-2">After (v2)</div>
                  <div className="text-2xl font-black text-white">NO</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Confidence: 42%</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvidenceLedgerView({ citations, onSelectEvidence, selectedEvidence }: { citations: any[] | null, onSelectEvidence: (ev: any) => void, selectedEvidence: any }) {
  
  if (!citations) {
    return (
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Evidence Ledger</h2>
        <div className="premium-panel p-8 text-center text-[var(--text-muted)] rounded-xl">
          No active decision contract to display evidence for. Please run an analysis in the Decision Firewall.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Evidence Ledger</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Transparent tracking of all citations used in decision contracts.</p>
      
      <div className="premium-panel rounded-xl overflow-hidden border-[var(--border-strong)]">
        <table className="w-full text-left text-sm text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-surface-elevated)] text-[10px] uppercase tracking-widest font-semibold border-b border-[var(--border-strong)]">
            <tr>
              <th className="px-6 py-4">Evidence Claim</th>
              <th className="px-6 py-4">Source Type</th>
              <th className="px-6 py-4">Tier</th>
              <th className="px-6 py-4 text-center">Quality</th>
              <th className="px-6 py-4 text-center">Independence</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {citations.map((c, i) => (
              <tr key={i} onClick={() => onSelectEvidence(c)} className={`hover:bg-[var(--bg-surface-highlight)] transition-colors cursor-pointer ${c.status === 'SUPERSEDED' ? 'opacity-50' : ''} ${selectedEvidence?.evidenceId === c.evidenceId ? 'bg-indigo-500/10' : ''}`}>
                <td className={`px-6 py-4 font-medium ${c.status === 'SUPERSEDED' ? 'text-[var(--text-muted)] line-through' : 'text-white'}`}>{c.claim}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2"><Database className="w-3 h-3 text-[var(--text-muted)]"/> {c.sourceName}</div>
                  <div className="text-[10px] font-mono mt-1 text-[var(--text-muted)]">{c.publisher || c.sourceType} • {c.documentDate}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest ${
                    (c.sourceTier && c.sourceTier.includes('PRIMARY')) ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    (c.sourceTier && c.sourceTier.includes('HIGH QUALITY')) ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    (c.sourceTier && c.sourceTier.includes('SECONDARY')) ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>{c.sourceTier}</span>
                </td>
                <td className="px-6 py-4 text-center font-mono text-white">{c.reliability}%</td>
                <td className="px-6 py-4 text-center font-mono text-white">{c.independence}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${
                    c.status === 'VALID' ? 'bg-green-500/10 text-green-400' : 
                    c.status === 'SUPERSEDED' ? 'bg-red-500/10 text-red-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-4 h-4 inline-block text-[var(--text-muted)]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL DRAWER / INLINE INFO */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="premium-panel rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-surface-elevated)]"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">PROVENANCE NODE: {selectedEvidence.evidenceId}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                      (selectedEvidence.sourceTier && selectedEvidence.sourceTier.includes('PRIMARY')) ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      (selectedEvidence.sourceTier && selectedEvidence.sourceTier.includes('HIGH QUALITY')) ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      (selectedEvidence.sourceTier && selectedEvidence.sourceTier.includes('SECONDARY')) ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>{selectedEvidence.sourceTier}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedEvidence.claim}</h3>
                  <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                    Publisher: {selectedEvidence.publisher || 'Verified Financial Feed'} • Document Date: {selectedEvidence.documentDate}
                    {selectedEvidence.derivesFrom && ` • Lineage: Derived from ${selectedEvidence.derivesFrom}`}
                  </div>
                </div>
                <button onClick={() => onSelectEvidence(null)} className="p-1 rounded bg-[var(--bg-surface-highlight)] text-[var(--text-muted)] hover:text-white"><XCircle className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">Source Reliability</div>
                  <div className="text-lg font-bold text-white font-mono">{selectedEvidence.reliability}%</div>
                </div>
                <div className="p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">Independence</div>
                  <div className="text-lg font-bold text-white font-mono">{selectedEvidence.independence}%</div>
                </div>
                <div className="p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">Supported Agents</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(selectedEvidence.supports || []).map((agent: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] rounded border border-indigo-500/20">{agent}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">Tripwire Dependency</div>
                  {selectedEvidence.relatedTripwire ? (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded border border-amber-500/20 block mt-1">{selectedEvidence.relatedTripwire}</span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] block mt-1">None</span>
                  )}
                </div>
              </div>

              {selectedEvidence.status === 'SUPERSEDED' && (
                <div className="p-3 bg-red-950/20 border border-red-900/50 rounded flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-red-500">EVIDENCE INVALIDATED & SUPERSEDED</div>
                    <div className="text-xs text-red-400/80 mt-1">This node failed verification during active monitoring and has been superseded. Reliability set to 0. Associated tripwire has been triggered.</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BehavioralMirrorView({ user }: { user: any }) {
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Behavioral Mirror: {user.name}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Analyzing your past decisions to prevent cognitive bias.</p>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="premium-panel rounded-xl p-8 border border-amber-900/50 bg-amber-950/10">
          <h3 className="text-lg font-bold text-amber-500 mb-2">Pattern Detected</h3>
          <p className="text-sm text-amber-400/80 mb-4">{user.mirror.desc}</p>
          <div className="text-xs uppercase tracking-widest text-amber-600 font-bold border-t border-amber-900/30 pt-4 mt-4">
            {user.mirror.bias}
          </div>
        </div>
        
        <div className="col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2">Matched Historical Decisions</h4>
          {user.mirror.history.map((hist: any, i: number) => (
            <div key={i} className="premium-panel p-5 rounded-lg border border-[var(--border-strong)] flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white">{hist.asset}</p>
                <p className="text-xs text-[var(--text-secondary)]">{hist.reason}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-mono font-bold ${hist.return.includes('-') ? 'text-red-400' : 'text-orange-400'}`}>{hist.return}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Post-decision outcome</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentWarRoomView({ user }: { user: any }) {
  const allAgents = [
    { name: 'Signal Core', role: 'Market Dynamics', desc: 'Analyzes momentum, volume profiles, and quantitative signals.' },
    { name: 'Fundamental Evidence', role: 'Financials', desc: 'Reads SEC filings, earnings transcripts, and extracts core financial data.' },
    { name: 'Macro & Sector', role: 'Environment', desc: 'Evaluates interest rates, geopolitical risk, and sector rotation.' },
    { name: 'Portfolio Risk', role: 'Exposure', desc: 'Monitors concentration, correlation, and specific user risk constraints.' },
    { name: 'Behavioral Mirror', role: 'Psychology', desc: 'Examines user trading history to detect cognitive biases and FOMO.' },
    { name: 'Adversarial Agent', role: 'Red Team', desc: 'Dedicated to destroying the thesis and finding fatal flaws.' },
    { name: 'Evidence Challenger', role: 'Epistemic Red Team', desc: 'Evaluates evidentiary fragility, stale filings, and contradiction risks.' },
    { name: 'Sentiment Analysis', role: 'Social & News', desc: 'Scans alternative data and social velocity for high-growth assets.' },
    { name: 'Momentum Tracker', role: 'Price Action', desc: 'High-frequency velocity metrics.' },
    { name: 'Dividend Tracker', role: 'Yield Analysis', desc: 'Tracks yield sustainability and payout ratios for balanced portfolios.' },
    { name: 'Adjudicator', role: 'Synthesis', desc: 'Final node that weighs all evidence to form the Falsifiable Contract.' }
  ];

  const activeAgents = allAgents.filter(a => user.activeAgents.includes(a.name));

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Agent War Room: {user.profile} Configuration</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">The autonomous intelligence network specifically provisioned for {user.name}.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAgents.map((agent, i) => (
          <div key={i} className="premium-panel p-6 rounded-xl border border-[var(--border-strong)] hover:border-indigo-500/50 transition-colors group cursor-default">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                <Briefcase className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">{agent.role}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{agent.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- FEATURE 8: REGRET LEDGER & COUNTERFACTUAL VIEW ----------------

function RegretLedgerView({ regretData, loading, user, onReplay }: { regretData: any, loading: boolean, user: any, onReplay: (id: string) => void }) {
  if (loading || !regretData) {
    return (
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Regret Ledger</h2>
        <div className="premium-panel p-8 text-center text-[var(--text-muted)] rounded-xl flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" /> Loading decision accountability records...
        </div>
      </div>
    );
  }

  const { records = [], summary = { totalDecisions: 0, decisionsActed: 0, decisionsNotTaken: 0, totalAvoidedLoss: 0, totalMissedOpportunity: 0, totalRealizedGains: 0 }, insights } = regretData;

  return (
    <div className="space-y-8 mt-6 pb-12">
      {/* HEADER & SUBTITLE */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Regret Ledger</h2>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
            Counterfactual Accountability
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Decisions you made — and decisions you didn&apos;t.
        </p>
      </div>

      {/* TOP SUMMARY METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="premium-panel p-5 rounded-xl border-[var(--border-strong)]">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Tracked Decisions
          </div>
          <div className="text-3xl font-black text-white">{summary.totalDecisions}</div>
          <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono">
            {summary.decisionsActed} Acted • {summary.decisionsNotTaken} Not Taken
          </div>
        </div>

        <div className="premium-panel p-5 rounded-xl border-[var(--border-strong)]">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Decisions Acted
          </div>
          <div className="text-3xl font-black text-indigo-300">{summary.decisionsActed}</div>
          <div className="text-[10px] text-green-400 mt-1 font-mono">
            +₹{summary.totalRealizedGains?.toLocaleString('en-IN') || 0} Realized
          </div>
        </div>

        <div className="premium-panel p-5 rounded-xl border-[var(--border-strong)]">
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Decisions Not Taken
          </div>
          <div className="text-3xl font-black text-purple-300">{summary.decisionsNotTaken}</div>
          <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono">
            Waited / Avoided
          </div>
        </div>

        <div className="premium-panel p-5 rounded-xl border-emerald-900/40 bg-emerald-950/10">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Avoided Loss
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            +₹{summary.totalAvoidedLoss?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-1 font-mono">
            Capital Saved via Restraint
          </div>
        </div>

        <div className="premium-panel p-5 rounded-xl border-amber-900/40 bg-amber-950/10">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Missed Opportunity
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            ₹{summary.totalMissedOpportunity?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1 font-mono">
            Skipped Upside
          </div>
        </div>
      </div>

      {/* MIRROR BEHAVIORAL COUNTERFACTUAL INSIGHT */}
      {insights && insights.hasPattern && (
        <div className="premium-panel p-6 rounded-xl border border-purple-900/40 bg-purple-950/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg shrink-0">
              <UserIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                  Mirror Behavioral Intelligence — Counterfactual Pattern ({user.name})
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 leading-snug">
                {insights.primaryInsight}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-purple-300">Empirical Rule:</strong> {insights.actionableRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE OF DECISIONS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Decision Timeline & Counterfactual Records
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-mono">Point-in-Time Verified</span>
        </div>

        <div className="space-y-4">
          {records.map((rec: any) => (
            <div key={rec.id} className="premium-panel p-6 rounded-xl border-[var(--border-strong)] hover:border-indigo-500/40 transition-all bg-[var(--bg-surface-elevated)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-400">{rec.id}</span>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {new Date(rec.decisionTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {rec.datasetType}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    {rec.asset} <span className="text-xs font-normal text-[var(--text-muted)] font-sans">({rec.assetName})</span>
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Action Chosen Badge */}
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                    rec.actualPath === 'ACTED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                    rec.actualPath === 'WAITED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    Action: {rec.actualPath}
                  </span>

                  {/* Decision Quality Badge */}
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                    rec.decisionQuality === 'ROBUST' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                    rec.decisionQuality === 'ACCEPTABLE' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  }`}>
                    Quality: {rec.decisionQuality}
                  </span>

                  {/* Outcome Category Badge */}
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                    rec.outcomeCategory === 'AVOIDED_LOSS' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60' :
                    rec.outcomeCategory === 'REALIZED_GAIN' ? 'bg-green-950/40 text-green-400 border border-green-900/60' :
                    rec.outcomeCategory === 'MISSED_OPPORTUNITY' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/60' :
                    'bg-red-950/40 text-red-400 border border-red-900/60'
                  }`}>
                    {rec.outcomeCategory?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* PATH COMPARISON GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                {/* ACTUAL PATH */}
                <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mb-2">
                    Actual Action Path
                  </div>
                  <p className="text-xs text-white leading-relaxed mb-3">{rec.actualActionDescription}</p>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border-subtle)] text-xs">
                    <span className="text-[var(--text-secondary)]">Actual Financial Result:</span>
                    <span className={`font-mono font-bold ${
                      rec.actualFinancialImpact > 0 ? 'text-green-400' :
                      rec.actualFinancialImpact < 0 ? 'text-red-400' : 'text-white'
                    }`}>
                      {rec.actualFinancialImpact > 0 ? `+₹${rec.actualFinancialImpact.toLocaleString('en-IN')}` :
                       rec.actualFinancialImpact < 0 ? `-₹${Math.abs(rec.actualFinancialImpact).toLocaleString('en-IN')}` : '₹0 (Preserved)'}
                    </span>
                  </div>
                </div>

                {/* COUNTERFACTUAL PATH */}
                <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-2">
                    Counterfactual Alternate Path
                  </div>
                  <p className="text-xs text-white leading-relaxed mb-3">{rec.counterfactualDescription}</p>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border-subtle)] text-xs">
                    <span className="text-[var(--text-secondary)]">Counterfactual Impact:</span>
                    <span className={`font-mono font-bold ${
                      rec.avoidedLoss > 0 ? 'text-emerald-400' :
                      rec.missedOpportunity > 0 ? 'text-amber-400' : 'text-white'
                    }`}>
                      {rec.avoidedLoss > 0 ? `+₹${rec.avoidedLoss.toLocaleString('en-IN')} Avoided Loss` :
                       rec.missedOpportunity > 0 ? `₹${rec.missedOpportunity.toLocaleString('en-IN')} Missed Gain` : '₹0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* POINT IN TIME METRICS & REASONING FOOTER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <div>
                    <span>Confidence at Decision: </span>
                    <strong className="text-white font-mono">{rec.pointInTimeConfidence}%</strong>
                  </div>
                  <div>
                    <span>30-Day Forward Return: </span>
                    <strong className={`font-mono ${rec.forwardReturn30D > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {rec.forwardReturn30D > 0 ? `+${rec.forwardReturn30D}%` : `${rec.forwardReturn30D}%`}
                    </strong>
                  </div>
                  <div>
                    <span>Evidence Sources Then: </span>
                    <strong className="text-indigo-300">{rec.pointInTimeEvidence?.length || 3} sources</strong>
                  </div>
                </div>

                <button
                  onClick={() => onReplay(rec.id)}
                  className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <GitCommit className="w-3.5 h-3.5" /> Replay Decision at T+0
                </button>
              </div>

              {/* Epistemic Reasoning Distinction */}
              <div className="mt-3 p-3 bg-[var(--bg-base)] rounded text-[11px] text-[var(--text-secondary)] border-l-2 border-indigo-500">
                <strong className="text-white">Epistemic Audit:</strong> {rec.decisionQualityReason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- POINT-IN-TIME DECISION REPLAY MODAL ----------------

function DecisionReplayModal({ snapshot, onClose }: { snapshot: any, onClose: () => void }) {
  if (!snapshot) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-[var(--border-strong)] flex justify-between items-center bg-[var(--bg-surface-highlight)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Point-in-Time Decision Replay</span>
              <span className="text-xs font-mono text-[var(--text-muted)]">[{snapshot.decisionId}]</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">{snapshot.asset} ({snapshot.assetName})</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          {/* Isolation banner */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-900/50 rounded-xl text-xs text-indigo-300 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Epistemic Isolation Active</span>
              Evaluation uses strictly point-in-time information. No future information from T+30 is exposed to T+0 reasoning.
            </div>
          </div>

          {/* POINT-IN-TIME PROGRESSION TIMELINE */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Point-in-Time Chronology (T+0 to T+30)
            </h4>
            <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-900/50 pl-10">
              {/* Step 1: Decision Timestamp */}
              <div className="relative">
                <div className="absolute -left-10 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-[var(--bg-surface)] shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400">T+0 • Decision Inception</span>
                    <span className="font-mono text-[var(--text-muted)]">{new Date(snapshot.decisionTimestamp).toUTCString()}</span>
                  </div>
                  <p className="text-white font-medium mb-1">&quot;{snapshot.question}&quot;</p>
                  <p className="text-[var(--text-secondary)]">{snapshot.thesis}</p>
                </div>
              </div>

              {/* Step 2: Point in time Confidence & Agents */}
              <div className="relative">
                <div className="absolute -left-10 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-[var(--bg-surface)]"></div>
                <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400">T+0 • Calibrated Confidence</span>
                    <span className="font-mono text-xl font-bold text-white">{snapshot.pointInTimeState?.confidence}%</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="p-2 rounded bg-[var(--bg-base)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Evidence Strength</span>
                      <span className="font-bold text-white">{snapshot.pointInTimeState?.confidenceBreakdown?.evidenceStrength || 80}%</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-base)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Agent Agreement</span>
                      <span className="font-bold text-white">{snapshot.pointInTimeState?.confidenceBreakdown?.agentAgreement || 70}%</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-base)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Source Quality</span>
                      <span className="font-bold text-white">{snapshot.pointInTimeState?.confidenceBreakdown?.sourceQuality || 85}%</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-base)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Personalization Fit</span>
                      <span className="font-bold text-indigo-300">{snapshot.pointInTimeState?.confidenceBreakdown?.personalizationFit || 75}%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Action Recorded: <strong className="text-white uppercase">{snapshot.pointInTimeState?.userAction}</strong> ({snapshot.pointInTimeState?.actionDescription})
                  </div>
                </div>
              </div>

              {/* Step 3: T+30 Forward Outcome */}
              <div className="relative">
                <div className="absolute -left-10 top-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[var(--bg-surface)]"></div>
                <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-purple-900/40 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-purple-400">T+30 Days • Outcome Realized</span>
                    <span className="font-mono text-[var(--text-muted)]">{new Date(snapshot.outcomeTimestamp).toUTCString()}</span>
                  </div>
                  <div className="flex justify-between items-center my-2">
                    <span className="text-sm font-bold text-white">30-Day Forward Asset Return:</span>
                    <span className={`font-mono text-xl font-bold ${snapshot.forwardOutcome?.forwardReturn30D > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {snapshot.forwardOutcome?.forwardReturn30D > 0 ? `+${snapshot.forwardOutcome?.forwardReturn30D}%` : `${snapshot.forwardOutcome?.forwardReturn30D}%`}
                    </span>
                  </div>
                  <div className="p-3 bg-[var(--bg-base)] rounded text-[11px] text-[var(--text-secondary)] flex justify-between items-center">
                    <span>Counterfactual Accountability:</span>
                    <span className={`font-mono font-bold ${snapshot.forwardOutcome?.avoidedLoss > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {snapshot.forwardOutcome?.avoidedLoss > 0 ? `+₹${snapshot.forwardOutcome?.avoidedLoss.toLocaleString('en-IN')} Avoided Loss` :
                       snapshot.forwardOutcome?.missedOpportunity > 0 ? `₹${snapshot.forwardOutcome?.missedOpportunity.toLocaleString('en-IN')} Missed Gain` : '₹0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WHAT DID WE KNOW THEN VS UNAVAILABLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-blue-900/30">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> What Did We Know Then? (T+0 Evidence)
              </h5>
              <div className="space-y-2">
                {snapshot.epistemicIsolation?.knownAtDecision?.map((item: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[var(--bg-base)] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{item.source}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{item.tier}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">{item.claim}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-red-900/30">
              <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-400" /> What Was Unavailable at T+0?
              </h5>
              <div className="space-y-2">
                {snapshot.epistemicIsolation?.unavailableFutureEvents?.map((evt: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[var(--bg-base)] text-xs flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span className="text-[var(--text-secondary)]">{evt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DECISION QUALITY VS OUTCOME MATRIX */}
          <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Decision Quality vs Outcome Evaluation</span>
              <div className="flex gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  Quality: {snapshot.qualityAssessment?.decisionQuality}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                  Outcome: {snapshot.forwardOutcome?.outcomeCategory}
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {snapshot.qualityAssessment?.decisionQualityReason}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

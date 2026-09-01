"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from 'recharts';
import { 
  Shield, Activity, Briefcase, User as UserIcon, Settings, LogOut,
  ChevronRight, TrendingUp, AlertTriangle, FileWarning, XCircle, Database,
  CheckCircle2, Clock, GitCommit, Search, Menu, BarChart2, RefreshCw,
  History, Undo2, Scale, ArrowRight, Eye, EyeOff, GitBranch, Zap, Flame, ShieldAlert, PlayCircle, Sparkles,
  BrainCircuit, BookOpen, FileText, Lock, ChevronDown, X, Users, MessageSquare, Globe, Swords
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
    activeAgents: ['Signal Core', 'Fundamental Evidence', 'Macro & Sector', 'Portfolio Risk', 'Behavioral Mirror', 'Adversarial Agent', 'Evidence Challenger', 'Quantum Predictor', 'Adjudicator']
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
function AiSummary({ viewName, contextData }: { viewName: string, contextData: any }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const contextDataString = JSON.stringify(contextData);

  // Clear state when view changes
  useEffect(() => {
    setSummary(null);
    setError(null);
    setHasStarted(false);
  }, [viewName, contextDataString]);

  const handleGenerate = () => {
    if (!contextDataString || contextDataString === '{}' || contextDataString === 'null') return;
    
    setHasStarted(true);
    setLoading(true);
    setError(null);

    fetch("http://localhost:3001/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewName, contextData: JSON.parse(contextDataString) })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    })
    .catch(err => {
      console.error(err);
      setError("Failed to generate summary.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  if (!contextDataString || contextDataString === '{}' || contextDataString === 'null') return null;

  return (
    <div className="mb-6 premium-panel rounded-xl p-6 border border-indigo-500/30 bg-indigo-950/10 glow-border-top relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-indigo-400" />
      </div>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className="text-xs uppercase tracking-widest font-bold text-indigo-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> AI Page Summary
        </h3>
        {(!hasStarted || error) && !loading && (
          <button 
            onClick={handleGenerate}
            className="text-xs font-bold text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" /> {error ? 'Retry Generation' : 'Generate AI Summary'}
          </button>
        )}
      </div>

      {!hasStarted ? (
         <div className="text-sm text-[var(--text-muted)] italic">
           Click the button above to generate a real-time contextual AI summary for this view.
         </div>
      ) : loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-indigo-900/40 rounded w-full"></div>
          <div className="h-4 bg-indigo-900/40 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="text-sm text-red-400 bg-red-950/20 p-3 rounded border border-red-900/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      ) : (
        <p className="text-sm text-indigo-100/90 leading-relaxed relative z-10">
          {summary}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState<string>("user1");
  const [userObject, setUserObject] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Auth Screen State
  const [authMode, setAuthMode] = useState<"demo" | "login" | "signup">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRisk, setAuthRisk] = useState("Medium");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("isAuthenticated");
    const savedUserObj = sessionStorage.getItem("userObject");
    const savedUser = sessionStorage.getItem("activeUser");
    if (savedAuth === "true" && savedUserObj) {
      setIsAuthenticated(true);
      setUserObject(JSON.parse(savedUserObj));
      if (savedUser) setActiveUser(savedUser);
    }
  }, []);
  const handleDemoAuth = (id: string, userObj: any) => {
    setActiveUser(id);
    setUserObject(userObj);
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("activeUser", id);
    sessionStorage.setItem("userObject", JSON.stringify(userObj));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/login" : "/api/register";
      const payload = authMode === "login" 
        ? { username: authUsername, password: authPassword }
        : { username: authUsername, password: authPassword, name: authName, riskTolerance: authRisk };

      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      handleDemoAuth(data.userId || data.user.id || authUsername, data.user);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const user = userObject || USERS[activeUser as keyof typeof USERS] || USERS.user1;
  
  const [currentView, setCurrentView] = useState<"dashboard" | "firewall" | "war-room" | "contracts" | "ledger" | "mirror" | "regret" | "replay">("firewall");

  const [thesis, setThesis] = useState("");
  const [analysisState, setAnalysisState] = useState<"idle" | "analyzing" | "complete" | "error">("idle");
  const [contract, setContract] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [showJudgeMode, setShowJudgeMode] = useState(false);
  const [errorState, setErrorState] = useState<any>(null);
  const router = useRouter();
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
  const [finnhubQuote, setFinnhubQuote] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/live-quote?symbol=TSLA')
      .then(res => res.json())
      .then(data => {
        if (data.success) setFinnhubQuote(data);
      })
      .catch(err => console.error("Finnhub quote error:", err));
  }, []);

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

    const fetchDemoContract = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thesis: "I want to buy TSLA because earnings are accelerating and EV adoption is growing.", userId: activeUser, demoMode: true })
        });
        const data = await response.json();
        if (data.success) {
          setContract(data.contract);
        }
      } catch (err) {
        console.error("Failed to fetch demo contract:", err);
      }
    };

    fetchDashboardData();
    fetchDemoContract();
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
    
    // Route to the dedicated evaluate page
    router.push(`/evaluate?thesis=${encodeURIComponent(thesis)}&userId=${activeUser}`);
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
        return (
          <>
            <AiSummary viewName="Dashboard" contextData={dashboardData} />
            <DashboardView user={user} dashboardData={dashboardData} contract={contract} isReplaying={isReplaying} replayStage={replayStage} handleStartReplay={handleStartReplay} />
          </>
        );
      case "ledger":
        return (
          <>
            <AiSummary viewName="Evidence Ledger" contextData={contract ? contract.provenanceGraph : null} />
            <EvidenceLedgerView citations={contract ? contract.provenanceGraph : null} onSelectEvidence={setSelectedEvidence} selectedEvidence={selectedEvidence} />
          </>
        );
      case "mirror":
        return (
          <>
            <AiSummary viewName="Behavioral Mirror" contextData={user.mirror} />
            <BehavioralMirrorView user={user} />
          </>
        );
      case "war-room":
        return (
          <>
            <AiSummary viewName="Agent War Room" contextData={{ activeAgents: user.activeAgents, userProfile: user.profile }} />
            <AgentWarRoomView user={user} />
          </>
        );
      case "regret":
      case "replay":
        return (
          <>
            <AiSummary viewName="Regret Ledger" contextData={regretData} />
            <RegretLedgerView regretData={regretData} loading={loadingRegret} user={user} onReplay={handleOpenReplay} />
          </>
        );
      case "firewall":
      default:
        return (
          <div className="space-y-6">
            <AiSummary viewName="Decision Firewall" contextData={{ userProfile: user.profile, portfolio: user.portfolio, recentActivity: user.activity }} />
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
                <button type="submit" disabled={!thesis} className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-full text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Evaluate Thesis <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
          </form>
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
        
        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] mb-6 shadow-2xl">
              <Shield className="w-8 h-8 text-[var(--accent-indigo)]" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Welcome to SentinelIQ</h1>
            <p className="text-[var(--text-secondary)] text-lg">Multi-Agent Autonomous Financial Intelligence</p>
          </div>

          {/* Auth Navigation */}
          <div className="flex bg-[#111] border border-[var(--border-strong)] rounded-full p-1 mb-8">
            <button 
              onClick={() => { setAuthMode("login"); setAuthError(""); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${authMode === 'login' ? 'bg-[var(--accent-indigo)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setAuthMode("signup"); setAuthError(""); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${authMode === 'signup' ? 'bg-[var(--accent-indigo)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              Create Account
            </button>
            <button 
              onClick={() => { setAuthMode("demo"); setAuthError(""); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${authMode === 'demo' ? 'bg-[var(--accent-indigo)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              <PlayCircle className="w-4 h-4" /> Try Demo
            </button>
          </div>

          {authMode === "demo" ? (
            <div className="premium-panel rounded-2xl p-8 border border-[var(--border-strong)] shadow-2xl bg-[var(--bg-surface-elevated)]/80 backdrop-blur-xl w-full">
              <h2 className="text-sm uppercase tracking-widest font-bold text-[var(--text-muted)] mb-6 text-center">Select Demo Persona to Enter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(USERS).map(([id, p]) => (
                  <div
                    key={id}
                    className="group relative text-left p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-indigo-500/50 hover:bg-indigo-950/10 transition-all duration-300"
                  >
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

                    <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
                      <div className="relative mb-1">
                        <input 
                          type={showPasswords[id] ? "text" : "password"} 
                          placeholder="Enter password..." 
                          className="w-full bg-[#111] border border-[var(--border-strong)] rounded px-3 py-2 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-white transition-colors"
                        >
                          {showPasswords[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mb-3 text-center tracking-widest uppercase">Demo Password: admin123</p>
                      <button 
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                          if (input?.value === 'admin123') {
                            handleDemoAuth(id, p);
                          } else {
                            alert("Incorrect password. Use the demo password: admin123");
                          }
                        }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-2 rounded transition-all shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                      >
                        Secure Login
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="premium-panel w-full max-w-md rounded-2xl p-8 border border-[var(--border-strong)] shadow-2xl bg-[var(--bg-surface-elevated)]/80 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                {authMode === "login" ? "Sign In to SentinelIQ" : "Create Your Account"}
              </h2>
              
              {authError && (
                <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-500/50 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-red-200">{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-[#111] border border-[var(--border-strong)] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Risk Tolerance</label>
                      <select 
                        value={authRisk}
                        onChange={(e) => setAuthRisk(e.target.value)}
                        className="w-full bg-[#111] border border-[var(--border-strong)] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="Low">Low (Conservative)</option>
                        <option value="Medium">Medium (Balanced)</option>
                        <option value="High">High (Growth)</option>
                      </select>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Username</label>
                  <input 
                    required
                    type="text" 
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-[#111] border border-[var(--border-strong)] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Password</label>
                  <div className="relative">
                    <input 
                      required
                      type={showPasswords['main'] ? "text" : "password"} 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#111] border border-[var(--border-strong)] rounded px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, main: !prev['main'] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      {showPasswords['main'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] disabled:opacity-50"
                >
                  {authLoading ? "Authenticating..." : (authMode === "login" ? "Sign In" : "Create Account")}
                </button>
              </form>
            </div>
          )}
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
        </nav>

        {/* User Profile Switcher */}
        <div className="p-4 border-t border-[var(--border-strong)] bg-[var(--bg-surface-highlight)] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {Object.keys(USERS).includes(activeUser) ? (
                <select 
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none truncate"
                  value={activeUser}
                  onChange={(e) => {
                    handleDemoAuth(e.target.value, USERS[e.target.value as keyof typeof USERS]);
                  }}
                >
                  <option value="user1" className="bg-[#111]">Arjun (Conservative)</option>
                  <option value="user2" className="bg-[#111]">Priya (Growth)</option>
                  <option value="user3" className="bg-[#111]">Karthik (Balanced)</option>
                </select>
              ) : (
                <p className="w-full bg-transparent text-sm font-bold text-white truncate">{user.name}</p>
              )}
              <p className="text-xs text-[var(--text-secondary)] truncate">{user.profile} Investor</p>
            </div>
            <button 
              onClick={() => {
                sessionStorage.removeItem("isAuthenticated");
                sessionStorage.removeItem("activeUser");
                sessionStorage.removeItem("userObject");
                setIsAuthenticated(false);
              }}
              title="Sign Out"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
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
              <MetricCard 
                title="Live Asset Price (TSLA)" 
                value={finnhubQuote ? `$${finnhubQuote.price.toFixed(2)}` : "--"} 
                subtext={finnhubQuote ? `${finnhubQuote.change > 0 ? '+' : ''}${finnhubQuote.change.toFixed(2)} (${finnhubQuote.percentChange.toFixed(2)}%)` : "Finnhub Live Data"} 
                trend={finnhubQuote ? "Live" : ""} 
                positive={finnhubQuote ? finnhubQuote.change >= 0 : true} 
              />
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
  const [marketData, setMarketData] = useState<any[] | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/market-data?symbol=TSLA')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.chartData) {
          setMarketData(data.chartData);
        } else {
          setMarketError(data.error || 'Failed to load market data');
        }
      })
      .catch(err => setMarketError(err.message));
  }, []);

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

      <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-[0.2em] uppercase border-b border-[var(--border-strong)] pb-2 pt-4">Market Data (Real-Time)</h3>
      <div className="premium-panel p-6 rounded-xl border border-[var(--border-strong)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">TSLA Stock Price Trend</h4>
            {marketError && <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Rate Limit Exceeded - Showing Mock</span>}
          </div>
          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-widest">{marketError ? 'Mock Data Fallback' : 'Alpha Vantage'}</span>
        </div>
        <div className="h-64">
          {!marketData && !marketError ? (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm animate-pulse">Fetching live data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData || [
                { date: "Day 1", price: 180 }, { date: "Day 2", price: 185 },
                { date: "Day 3", price: 195 }, { date: "Day 4", price: 190 },
                { date: "Day 5", price: 210 }, { date: "Day 6", price: 215 },
                { date: "Day 7", price: 205 }, { date: "Day 8", price: 220 },
                { date: "Day 9", price: 240 }, { date: "Day 10", price: 235 },
                { date: "Day 11", price: 250 }, { date: "Day 12", price: 265 }
              ]}>
                <defs>
                  <linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={marketError ? "#f59e0b" : "#10b981"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={marketError ? "#f59e0b" : "#10b981"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                <YAxis domain={['auto', 'auto']} stroke="#ffffff50" fontSize={10} width={40} tickFormatter={(val) => `$${val.toFixed(0)}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="price" stroke={marketError ? "#f59e0b" : "#10b981"} fillOpacity={1} fill="url(#stockColor)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
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
    { name: 'Quantum Predictor', role: 'Probabilistic Modeling', desc: 'Simulates non-linear multi-dimensional Monte Carlo trajectories for futuristic forecasting.' },
    { name: 'Adjudicator', role: 'Synthesis', desc: 'Final node that weighs all evidence to form the Falsifiable Contract.' }
  ];

  // Default agents if not explicitly specified on the user object
  const defaultAgents = ['Signal Core', 'Fundamental Evidence', 'Macro & Sector', 'Portfolio Risk', 'Behavioral Mirror', 'Adversarial Agent', 'Quantum Predictor', 'Adjudicator'];
  const userAgents = user.activeAgents || defaultAgents;

  const activeAgents = allAgents.filter(a => userAgents.includes(a.name));

  const getAgentIcon = (name: string) => {
    switch(name) {
      case 'Signal Core': return <Activity className="w-5 h-5" />;
      case 'Fundamental Evidence': return <FileText className="w-5 h-5" />;
      case 'Macro & Sector': return <Globe className="w-5 h-5" />;
      case 'Portfolio Risk': return <ShieldAlert className="w-5 h-5" />;
      case 'Behavioral Mirror': return <Users className="w-5 h-5" />;
      case 'Adversarial Agent': return <Swords className="w-5 h-5" />;
      case 'Evidence Challenger': return <Search className="w-5 h-5" />;
      case 'Sentiment Analysis': return <MessageSquare className="w-5 h-5" />;
      case 'Momentum Tracker': return <TrendingUp className="w-5 h-5" />;
      case 'Dividend Tracker': return <PieChart className="w-5 h-5" />;
      case 'Quantum Predictor': return <Zap className="w-5 h-5" />;
      case 'Adjudicator': return <Scale className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Agent War Room: {user.profile} Configuration</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">The autonomous intelligence network specifically provisioned for {user.name}.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAgents.map((agent, i) => (
          <div key={i} className="premium-panel p-6 rounded-xl border border-[var(--border-strong)] hover:border-indigo-500/50 transition-colors group cursor-default">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors [&>svg]:text-[var(--text-secondary)] group-hover:[&>svg]:text-indigo-400 [&>svg]:transition-colors">
                {getAgentIcon(agent.name)}
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

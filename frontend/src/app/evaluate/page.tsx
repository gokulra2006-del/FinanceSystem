"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileWarning, ArrowLeft, RefreshCw, AlertTriangle, Shield, CheckCircle2,
  Activity, Sparkles, BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function EvaluateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const thesis = searchParams.get("thesis") || "";
  const userId = searchParams.get("userId") || "user1";

  const [analysisState, setAnalysisState] = useState<"analyzing" | "complete" | "error">("analyzing");
  const [contract, setContract] = useState<any>(null);
  const [errorState, setErrorState] = useState<any>(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!thesis) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setProcessingStage((prev) => (prev >= 7 ? 7 : prev + 1));
    }, 500);

    const performAnalysis = async () => {
      try {
        const isDemo = thesis === "I want to buy TSLA because earnings are accelerating and EV adoption is growing.";
        const response = await fetch("http://localhost:3001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thesis, userId, demoMode: isDemo })
        });
        const data = await response.json();
        
        setTimeout(() => {
          clearInterval(interval);
          setContract(data.contract);
          setAnalysisState("complete");
        }, Math.max(0, 4000 - (7 * 500)));
        
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setAnalysisState("error");
        setErrorState({ status: "Evaluation Failed", reason: "Network or server error occurred. Ensure backend is running on port 3001." });
      }
    };

    performAnalysis();
    return () => clearInterval(interval);
  }, [thesis, userId, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white p-6 pt-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <button onClick={() => router.push("/")} className="text-[var(--text-secondary)] hover:text-white flex items-center gap-2 text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        {/* PIPELINE ANIMATION */}
        {analysisState === "analyzing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="premium-panel rounded-xl p-8 border-[var(--border-strong)] bg-[var(--bg-surface-elevated)]"
          >
            <h3 className="text-sm uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Running Intelligence Network
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Signal Core', 'Fundamental Evidence', 'Macro & Sector', 'Portfolio Risk', 'Behavioral Mirror', 'Quantum Predictor', 'Devil\'s Advocate', 'Adjudicator'].map((agent, i) => (
                <div key={agent} className={`p-4 rounded-lg border transition-all duration-500 ${processingStage > i ? 'bg-indigo-900/20 border-indigo-500/30' :
                  processingStage === i ? 'bg-indigo-950/30 border-indigo-500/50 animate-pulse' :
                    'bg-[var(--bg-base)] border-[var(--border-subtle)] opacity-50'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white">{agent}</span>
                    {processingStage > i ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                      processingStage === i ? <Activity className="w-4 h-4 text-indigo-400 animate-pulse" /> :
                        <RefreshCw className="w-4 h-4 text-[var(--text-muted)]" />}
                  </div>
                  <div className="w-full h-1 bg-[var(--bg-base)] rounded-full overflow-hidden">
                    <div className={`h-full bg-indigo-500 transition-all duration-1000 ${processingStage > i ? 'w-full' : processingStage === i ? 'w-1/2 animate-pulse' : 'w-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {analysisState === "error" && errorState && (
          <div className="premium-panel rounded-xl p-8 border border-red-900/50 bg-red-950/10">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-2xl font-bold text-red-500">{errorState.status}</h3>
                <p className="text-[var(--text-secondary)] mt-1">{errorState.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* DECISION CONTRACT (SUCCESS) */}
        {analysisState === "complete" && contract && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            
            {/* EXECUTIVE SUMMARY */}
            <div className="premium-panel rounded-xl p-8 glow-border-top bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)]">
              <h2 className="text-sm tracking-widest font-bold uppercase text-[var(--text-muted)] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Executive Summary
              </h2>
              <h1 className="text-3xl font-bold text-white mb-6">Evaluation Complete</h1>
              
              <div className={`p-6 rounded-xl border ${
                contract.decision === 'YES' || contract.verdict === 'YES'
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : contract.decision === 'NO' || contract.verdict === 'NO'
                  ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                  : 'bg-indigo-950/20 border-indigo-500/40'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <span className={`px-4 py-2 rounded-md text-sm font-black tracking-widest uppercase inline-flex items-center justify-center min-w-[100px] ${
                    contract.decision === 'YES' || contract.verdict === 'YES'
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : contract.decision === 'NO' || contract.verdict === 'NO'
                      ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : 'bg-indigo-500 text-white'
                  }`}>
                    {contract.decision || contract.verdict}
                  </span>
                  <span className="text-xl font-medium text-white/90 leading-snug">
                    {contract.answer}
                  </span>
                  
                  {contract.mlSentiment && contract.mlSentiment.label !== "Unknown" && (
                    <div className="ml-auto px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                        ML Sentiment: <span className={contract.mlSentiment.label === 'Positive' ? 'text-green-400' : contract.mlSentiment.label === 'Negative' ? 'text-red-400' : 'text-gray-300'}>{contract.mlSentiment.label} ({contract.mlSentiment.confidence}%)</span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-[var(--text-secondary)] bg-[var(--bg-base)] p-4 rounded-lg mt-4 border border-[var(--border-subtle)]">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">EVALUATED THESIS</span> 
                  <span className="text-white">"{contract.question || contract.thesis}"</span>
                </div>
                
                {contract.aiSummary && !showSummary && (
                  <button 
                    onClick={() => setShowSummary(true)}
                    className="mt-4 w-full p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 hover:bg-indigo-900/30 hover:border-indigo-400/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 group-hover:animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-widest text-indigo-300">Generate Multi-Agent AI Summary</span>
                  </button>
                )}

                {contract.aiSummary && showSummary && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-xs uppercase tracking-widest text-indigo-300">Multi-Agent AI Summary</span>
                    </div>
                    <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">
                      {contract.aiSummary}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* DEVIL'S ADVOCATE ADVERSARIAL REVIEW */}
            {contract.adversarialReview && (
              <div className="premium-panel rounded-xl p-8 border border-orange-900/40 bg-orange-950/10 glow-border-top">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-sm tracking-widest font-bold uppercase text-orange-400 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Devil's Advocate (Adversarial Review)
                    </h2>
                    <h3 className="text-2xl font-bold text-white tracking-tight">"Try to prove this decision wrong."</h3>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Decision Robustness</span>
                      <span className={`text-2xl font-black font-mono ${contract.adversarialReview.robustnessScore > 80 ? 'text-green-400' : contract.adversarialReview.robustnessScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {contract.adversarialReview.robustnessScore} <span className="text-sm text-[var(--text-muted)]">/ 100</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Confidence Adj</span>
                      <span className="text-2xl font-black font-mono text-orange-400">
                        {contract.adversarialReview.initialConfidence}% &rarr; {contract.adversarialReview.finalConfidence}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {contract.adversarialReview.challengeLevel === "LOW" ? (
                  <div className="p-4 rounded-lg bg-green-950/20 border border-green-500/30 text-green-400 text-sm font-medium flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    Recommendation survived adversarial review. No major contradictory evidence found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-orange-950/20 border border-orange-500/30 text-orange-200 text-sm font-medium flex items-center gap-3">
                      <FileWarning className="w-5 h-5 text-orange-400" />
                      {contract.adversarialReview.counterarguments.length} significant counterarguments were identified.
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contract.adversarialReview.counterarguments.map((ca: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-orange-500/30 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white text-sm">{ca.title}</span>
                            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${ca.severity === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                              {ca.severity}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">{ca.explanation}</p>
                          {ca.evidence && ca.evidence.length > 0 && (
                            <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950/20 p-2 rounded">
                              📄 {ca.evidence[0].source}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* ASSUMPTIONS CHALLENGED */}
                {contract.adversarialReview.assumptionsChallenged?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                    <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Assumptions Behind This Decision</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contract.adversarialReview.assumptionsChallenged.map((ac: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs">
                          <span className="text-white truncate pr-2">{ac.assumption}</span>
                          <span className={`shrink-0 font-bold ${ac.status === 'Supported' ? 'text-green-400' : 'text-amber-400'}`}>{ac.status === 'Supported' ? '✓ Supported' : '⚠ Weakly supported'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* DECISION KILL SWITCH / FAILURE CONDITIONS */}
                {contract.adversarialReview.failureConditions?.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg bg-red-950/15 border border-red-900/30">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> When Should I Reconsider? (Decision Kill Switch)
                    </h4>
                    <ul className="space-y-2">
                      {contract.adversarialReview.failureConditions.map((fc: string, i: number) => (
                        <li key={i} className="text-xs text-red-200/90 flex items-start gap-2 leading-relaxed">
                          <span className="text-red-500 mt-0.5 font-bold">●</span> {fc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* DETAILED DECISION CONTRACT */}
            <section className="premium-panel rounded-xl p-8 border border-[var(--border-strong)] glow-border-top bg-[var(--bg-surface-highlight)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <FileWarning className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">Decision Contract</h2>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] font-mono">{contract.contractId}</p>
                </div>
                <div className="px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase border bg-green-500/10 text-green-400 border-green-500/20">
                  Status: {contract.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2">Actionable Intelligence</span>
                  <p className="text-sm text-indigo-300 font-medium leading-relaxed">{contract.thesis}</p>
                </div>
                <div className="p-5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-1 block">Confidence Score</span>
                    <p className="text-[11px] text-[var(--text-secondary)] max-w-[200px]">Aggregated probability metric via multi-agent consensus</p>
                  </div>
                  <div className="text-5xl font-black font-mono text-white tracking-tighter">
                    {contract.confidence}%
                  </div>
                </div>
              </div>

              {/* TRIPWIRES */}
              {contract.tripwires && contract.tripwires.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" /> Active Tripwires (Enforcement Parameters)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contract.tripwires.map((tw: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-bold text-white">{tw.metric}</span>
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] uppercase font-bold rounded border border-green-500/20">
                            {tw.status}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] font-mono">
                          Threshold: <span className="text-white font-bold">{tw.operator} {tw.threshold}{tw.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function EvaluatePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] text-white p-6 flex items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-indigo-400" /></div>}>
      <EvaluateContent />
    </Suspense>
  );
}

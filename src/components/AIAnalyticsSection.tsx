"use client";

import { useState } from "react";
import { StudentProfile } from "@/lib/types";
import { 
  Sparkles, 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Cpu, 
  BarChart3, 
  Eye, 
  Clock, 
  Building2,
  RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";

interface AIAnalyticsSectionProps {
  student: StudentProfile;
}

export default function AIAnalyticsSection({ student }: AIAnalyticsSectionProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiScore, setAiScore] = useState(96);

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiScore(98);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Score Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              <span>Portfolio Health & Performance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-display text-white">
              Portfolio Completeness & ATS Score
            </h3>
            <p className="text-xs sm:text-sm font-body text-zinc-400 leading-relaxed">
              Evaluated against modern technical hiring standards, project documentation depth, verified links, and ATS resume compatibility.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <span className="text-4xl sm:text-5xl font-black font-geometric text-white block">
                {aiScore}
                <span className="text-xl text-zinc-500 font-normal">/100</span>
              </span>
              <span className="text-[10.5px] font-mono text-zinc-400 uppercase tracking-wider block mt-1">
                Exceptional Rating
              </span>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-geometric font-bold transition-all shadow-md disabled:opacity-75 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} strokeWidth={1.5} />
              <span>{analyzing ? "Evaluating Profile..." : "Evaluate Profile"}</span>
            </button>
          </div>
        </div>

        {/* Breakdown Pills */}
        <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-zinc-400 block text-[11px]">ATS Keyword Match</span>
            <span className="text-lg font-bold font-geometric text-white">98%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-zinc-400 block text-[11px]">Quantified Impact</span>
            <span className="text-lg font-bold font-geometric text-zinc-200">94%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-zinc-400 block text-[11px]">Recruiter Retention</span>
            <span className="text-lg font-bold font-geometric text-zinc-200">3m 12s avg</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-zinc-400 block text-[11px]">Documentation Depth</span>
            <span className="text-lg font-bold font-geometric text-white">High</span>
          </div>
        </div>
      </div>

      {/* Grid: Actionable Suggestions & Recruiter Traffic Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Actionable Suggestions */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 font-geometric font-bold text-base">
            <Sparkles className="w-5 h-5 text-zinc-900" strokeWidth={1.5} />
            <h4>Optimization Recommendations</h4>
          </div>

          <div className="space-y-3 text-xs font-body">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-geometric font-bold text-zinc-900">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" strokeWidth={1.5} />
                <span>Strong Technical Case Study</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Your <strong>OmniFlow Cloud</strong> project drives 64% of total recruiter engagement. The explicit p99 latency metric (5ms) gives hiring managers concrete impact.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-geometric font-bold text-zinc-900">
                <AlertCircle className="w-4 h-4 text-zinc-700 shrink-0" strokeWidth={1.5} />
                <span>Keyword Coverage Opportunity</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Hiring managers seeking Infrastructure or Systems roles frequently scan for <strong>Docker</strong>, <strong>Terraform</strong>, and <strong>Kubernetes</strong>. Adding these tags can enhance discovery.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-geometric font-bold text-zinc-900">
                <Zap className="w-4 h-4 text-zinc-900 shrink-0" strokeWidth={1.5} />
                <span>Architecture Diagram Recommended</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Recruiters spend 2.4x longer on portfolios that feature interactive system flowcharts and architecture breakdowns in case studies.
              </p>
            </div>
          </div>
        </div>

        {/* Recruiter Traffic Analytics */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-900 font-geometric font-bold text-base">
              <Building2 className="w-5 h-5 text-zinc-900" strokeWidth={1.5} />
              <h4>Top Recruiter Inbound Locations</h4>
            </div>
            <span className="text-[11px] font-mono text-zinc-900 font-bold bg-zinc-100 px-2.5 py-1 rounded-full border border-slate-200">
              Verified Networks
            </span>
          </div>

          <div className="space-y-3">
            {[
              { company: "Google Cloud", location: "Sunnyvale, CA", views: 184, dwell: "3m 42s" },
              { company: "Stripe", location: "San Francisco, CA", views: 122, dwell: "2m 55s" },
              { company: "Cloudflare", location: "Austin, TX & SF", views: 98, dwell: "4m 10s" },
              { company: "Apple Inc.", location: "Cupertino, CA", views: 76, dwell: "2m 18s" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <span className="font-geometric font-bold text-zinc-900 block">
                    {item.company}
                  </span>
                  <span className="text-[11px] font-body text-slate-500">
                    {item.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-zinc-900 block">
                    {item.views} visits
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-500">
                    Avg dwell: {item.dwell}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Search Terms */}
          <div className="pt-2">
            <span className="text-[11px] font-geometric font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Recruiter Search Terms That Led Here:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["UC Berkeley EECS 2026", "Rust vector store", "Cloud Run low latency", "CalHacks winner", "Systems Engineer intern"].map((term, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-[10.5px] font-mono bg-white text-zinc-800 border border-slate-200 shadow-2xs"
                >
                  🔍 {term}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/lib/types";
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RotateCw,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AuditResult {
  score: number;
  scoreCategory: string;
  executiveSummary: string;
  architecturalStrengths: Array<{ title: string; explanation: string }>;
  riskAndMitigation: Array<{ risk: string; mitigation: string }>;
  interviewQuestions: string[];
}

interface GeminiArchitectureAuditorProps {
  project: Project;
}

export default function GeminiArchitectureAuditor({ project }: GeminiArchitectureAuditorProps) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project })
      });
      const data = await res.json();
      if (res.ok && data.audit) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.warn("Failed to fetch architecture audit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [project.id]);

  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-geometric font-extrabold text-sm text-slate-950">
                Gemini Systems & Code Audit
              </span>
              <span className="text-[10px] font-mono font-bold bg-zinc-950 text-white px-2 py-0.5 rounded-full">
                AI Senior Reviewer
              </span>
            </div>
            <p className="text-[11px] font-body text-slate-500">
              Evaluates architectural trade-offs, lock contention risks, and code diff forensics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs font-mono text-slate-500 animate-pulse flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              Auditing...
            </span>
          ) : audit ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-white text-xs font-mono font-bold shadow-2xs">
              <span>Score:</span>
              <span className="text-sm">{audit.score}/100</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            aria-label={isExpanded ? "Collapse audit" : "Expand audit"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          {loading && !audit ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-500">
                Gemini 2.0 analyzing architecture nodes, gRPC pipelines, and PR diffs...
              </p>
            </div>
          ) : audit ? (
            <>
              {/* Executive Summary */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Principal Engineer Assessment • {audit.scoreCategory}
                </span>
                <p className="text-xs sm:text-sm font-body text-slate-800 leading-relaxed">
                  {audit.executiveSummary}
                </p>
              </div>

              {/* Architectural Strengths */}
              <div className="space-y-2">
                <h5 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                  Key Verified Architectural Decisions
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {audit.architecturalStrengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1"
                    >
                      <h6 className="font-geometric font-bold text-xs text-slate-950">
                        {str.title}
                      </h6>
                      <p className="text-[11.5px] font-body text-slate-600 leading-snug">
                        {str.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge Case Risks & Mitigation */}
              {audit.riskAndMitigation && audit.riskAndMitigation.length > 0 && (
                <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <h5 className="text-xs font-geometric font-bold text-slate-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
                    Fault-Tolerance & Failure Mode Mitigation
                  </h5>
                  {audit.riskAndMitigation.map((rm, idx) => (
                    <div key={idx} className="text-xs font-body text-slate-600 space-y-0.5">
                      <span className="font-semibold text-slate-900">• Potential Risk: </span>
                      {rm.risk}
                      <br />
                      <span className="font-semibold text-slate-900">↳ Implemented Mitigation: </span>
                      {rm.mitigation}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Interview Probe Questions */}
              {audit.interviewQuestions && audit.interviewQuestions.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-zinc-950 text-white space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-geometric font-bold tracking-tight">
                      Recommended Recruiter & Interviewer Probes
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs font-body text-zinc-300">
                    {audit.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-zinc-500 font-bold shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { LandmarkPR } from "@/lib/types";
import { GitPullRequest, GitCommit, CheckCircle2, ChevronRight, FileCode } from "lucide-react";

interface LandmarkPRViewerProps {
  prs?: LandmarkPR[];
}

export default function LandmarkPRViewer({ prs }: LandmarkPRViewerProps) {
  if (!prs || prs.length === 0) return null;

  const [activePRId, setActivePRId] = useState<string>(prs[0].id);
  const activePR = prs.find((p) => p.id === activePRId) || prs[0];

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-zinc-950" strokeWidth={1.5} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Proof-of-Work: Landmark Pull Requests
            </h4>
          </div>
          <p className="text-sm font-geometric font-bold text-slate-950 mt-1">
            Real architectural commits and code diffs solving critical bottlenecks
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 self-start sm:self-auto">
          {prs.length} Verified PRs
        </span>
      </div>

      {/* PR Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {prs.map((pr) => {
          const isActive = pr.id === activePR.id;
          return (
            <button
              key={pr.id}
              onClick={() => setActivePRId(pr.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-geometric font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span className="font-mono text-[11px] text-zinc-400 font-normal">
                #{pr.prNumber}
              </span>
              <span>{pr.title.split(":")[0]}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-zinc-800 text-zinc-300" : "bg-white text-slate-500 border border-slate-200"}`}>
                {pr.diffSummary}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active PR Detail Card */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h5 className="font-geometric font-bold text-sm text-slate-950">
              PR #{activePR.prNumber}: {activePR.title}
            </h5>
            <span className="font-mono text-xs text-slate-500">
              branch: <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">{activePR.branch}</code>
            </span>
          </div>

          <p className="text-xs font-body text-slate-600 leading-relaxed">
            {activePR.summary}
          </p>
        </div>

        {/* Code Diff Display */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-zinc-950 text-white font-mono text-xs">
          {/* Diff Header */}
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-white font-semibold">{activePR.codeSnippet.filename}</span>
            </div>
            <span className="text-zinc-500">{activePR.diffSummary}</span>
          </div>

          {/* Diff lines */}
          <div className="p-4 overflow-x-auto space-y-3 leading-relaxed text-[11.5px]">
            {activePR.codeSnippet.oldCode && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-red-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block mb-1">
                  - Before (Previous Implementation)
                </span>
                <pre className="overflow-x-auto">
                  <code>{activePR.codeSnippet.oldCode}</code>
                </pre>
              </div>
            )}

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                + After (Optimized Solution)
              </span>
              <pre className="overflow-x-auto">
                <code>{activePR.codeSnippet.newCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

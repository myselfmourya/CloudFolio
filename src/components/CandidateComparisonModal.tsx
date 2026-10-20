"use client";

import React from "react";
import { StudentProfile } from "@/lib/types";
import { 
  X, 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  Download, 
  ExternalLink, 
  FolderGit2,
  CheckCircle2,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface CandidateComparisonModalProps {
  candidates: StudentProfile[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCandidate?: (id: string) => void;
}

export default function CandidateComparisonModal({
  candidates,
  isOpen,
  onClose,
  onRemoveCandidate
}: CandidateComparisonModalProps) {
  if (!isOpen || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-950" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Recruiter Talent Workbench
              </span>
            </div>
            <h3 className="text-2xl font-serif-display text-slate-950 mt-1">
              Side-by-Side Candidate Comparison ({candidates.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Grid */}
        <div className={`mt-6 grid grid-cols-1 md:grid-cols-${Math.min(candidates.length, 3)} gap-6`}>
          {candidates.map((cand) => (
            <div 
              key={cand.id} 
              className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatar}
                      alt={cand.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-geometric font-extrabold text-slate-950 text-base">
                        {cand.fullName}
                      </h4>
                      <span className="text-xs font-mono text-slate-500">
                        @{cand.username}
                      </span>
                    </div>
                  </div>

                  {onRemoveCandidate && (
                    <button
                      onClick={() => onRemoveCandidate(cand.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Academic Pedigree & GPA */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Academic Pedigree
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-geometric font-bold text-slate-900">
                      {cand.university}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-slate-950 bg-slate-100 px-2 py-0.5 rounded-md">
                      GPA {cand.gpa}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-slate-500 line-clamp-1">
                    {cand.degree}
                  </p>
                </div>

                {/* Status & Availability */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Availability & Class
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-geometric font-semibold text-slate-800">
                      {cand.status}
                    </span>
                    <span className="font-mono text-slate-500">
                      {cand.gradYear}
                    </span>
                  </div>
                </div>

                {/* Flagship Technical Case Study */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Flagship Cloud Project
                  </span>
                  <h5 className="text-xs font-geometric font-extrabold text-slate-950">
                    {cand.projects[0]?.title || "Independent Research"}
                  </h5>
                  {cand.projects[0]?.metrics && (
                    <span className="inline-block text-[10.5px] font-mono bg-zinc-950 text-white px-2 py-0.5 rounded-md">
                      ⚡ {cand.projects[0].metrics}
                    </span>
                  )}
                  <p className="text-[11px] font-body text-slate-600 line-clamp-2">
                    {cand.projects[0]?.description}
                  </p>
                </div>

                {/* Top Skills Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Primary Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(cand.skills[0]?.skills || []).slice(0, 5).map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10.5px] font-mono text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
                <Link
                  href={`/portfolio/${cand.username}`}
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-geometric font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <span>Explore Folio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Verified candidate metrics powered by CloudFolio Database</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 font-geometric font-bold text-slate-800 transition-colors"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}

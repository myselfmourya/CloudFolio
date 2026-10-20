"use client";

import React, { useState } from "react";
import { StudentProfile } from "@/lib/types";
import { 
  Users, 
  X, 
  Columns, 
  Download, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface RecruiterShortlistDrawerProps {
  shortlistedStudents: StudentProfile[];
  onRemoveStudent: (id: string) => void;
  onClearAll: () => void;
  onOpenComparison: () => void;
}

export default function RecruiterShortlistDrawer({
  shortlistedStudents,
  onRemoveStudent,
  onClearAll,
  onOpenComparison,
}: RecruiterShortlistDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (shortlistedStudents.length === 0) return null;

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      platform: "CloudFolio Talent Workbench",
      candidateCount: shortlistedStudents.length,
      candidates: shortlistedStudents.map((s) => ({
        fullName: s.fullName,
        username: s.username,
        email: s.email,
        university: s.university,
        degree: s.degree,
        gpa: s.gpa,
        gradYear: s.gradYear,
        headline: s.headline,
        status: s.status,
        portfolioUrl: `https://cloudfolio.dev/@${s.username}`,
        flagshipProject: s.projects[0] ? {
          title: s.projects[0].title,
          tagline: s.projects[0].tagline,
          metrics: s.projects[0].metrics,
          liveUrl: s.projects[0].liveUrl,
          githubUrl: s.projects[0].githubUrl,
        } : null,
        topSkills: s.skills.flatMap((cat) => cat.skills).slice(0, 8),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloudfolio-shortlist-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-300/90 shadow-2xl rounded-3xl p-4 sm:p-5 transition-all">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-geometric font-extrabold text-sm text-slate-950">
                  Recruiter Shortlist
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-zinc-950 text-white">
                  {shortlistedStudents.length} {shortlistedStudents.length === 1 ? "candidate" : "candidates"}
                </span>
              </div>
              <p className="text-[11px] font-body text-slate-500 hidden sm:block">
                Pin candidates to compare technical architectures side-by-side or export to ATS.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenComparison}
              disabled={shortlistedStudents.length < 2}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-geometric font-bold transition-all ${
                shortlistedStudents.length >= 2
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs cursor-pointer hover:scale-102"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              title={
                shortlistedStudents.length < 2
                  ? "Select at least 2 candidates to compare"
                  : "Launch Side-by-Side Comparison"
              }
            >
              <Columns className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Compare ({shortlistedStudents.length})</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-geometric font-bold transition-colors cursor-pointer"
              title="Export candidate dossier to JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
              <span>Export</span>
            </button>

            <button
              onClick={onClearAll}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear shortlist"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isExpanded ? "Collapse shortlist" : "Expand shortlist"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Candidate Chips List (Expandable) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 overflow-x-auto pb-1 max-h-32">
            {shortlistedStudents.map((student) => (
              <div
                key={student.id}
                className="group flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/90 hover:border-slate-400 transition-all text-xs"
              >
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-400"
                />
                <span className="font-geometric font-bold text-slate-900 text-[11.5px]">
                  {student.fullName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                  {student.university.split(" ")[0]}
                </span>
                <button
                  onClick={() => onRemoveStudent(student.id)}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                  title={`Remove ${student.fullName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {shortlistedStudents.length < 2 && (
              <span className="text-[11px] font-mono text-slate-400 italic pl-1">
                + Pin 1 more candidate to unlock side-by-side comparison
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

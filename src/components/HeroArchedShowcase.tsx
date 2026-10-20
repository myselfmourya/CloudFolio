"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  Sparkles,
  ExternalLink,
  Briefcase
} from "lucide-react";
import ResumePDFModal from "./ResumePDFModal";
import StoryModeModal from "./StoryModeModal";
import { DEFAULT_STUDENT } from "@/lib/mock-data";

export default function HeroArchedShowcase() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const student = DEFAULT_STUDENT;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background Arch Shape Container (matching user uploaded reference) */}
      <div className="arch-container relative bg-slate-100/90 border border-slate-200/80 p-6 sm:p-8 overflow-hidden shadow-xl min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
        
        {/* Subtle dot matrix pattern inside the arch */}
        <div className="absolute inset-0 bg-dots-pattern opacity-40 pointer-events-none" />

        {/* Top Status Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-medium text-slate-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
            <span>cloudfolio.dev/@{student.username}</span>
          </div>

          <span className="px-3 py-0.5 rounded-full bg-slate-950 text-white text-[11px] font-mono font-medium">
            Candidate Preview
          </span>
        </div>

        {/* Floating Student Card Inside Arch */}
        <div className="relative z-10 my-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 animate-float">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-sm"
              />
              <div 
                title="Verified Student Credential"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center border-2 border-white text-[10px]"
              >
                ✓
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-geometric font-extrabold text-base text-slate-950">
                  {student.fullName}
                </h4>
                <span className="text-xs font-mono text-slate-400">@{student.username}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {student.headline}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                {student.university} • GPA {student.gpa}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Total Views
              </span>
              <span className="font-geometric font-extrabold text-slate-950 text-sm">
                {student.stats.profileViews.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Resume Downloads
              </span>
              <span className="font-geometric font-extrabold text-slate-950 text-sm">
                {student.stats.resumeDownloads.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions inside card */}
          <div className="pt-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResumeOpen(true)}
                className="flex-1 py-2 px-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-geometric font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Resume</span>
              </button>
              <Link
                href={`/portfolio/${student.username}`}
                className="py-2 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-geometric font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <span>Explore Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <button
              onClick={() => setStoryOpen(true)}
              className="w-full py-1.5 px-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-geometric font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>Launch 60-Second Recruiter Story</span>
            </button>
          </div>
        </div>

        {/* Floating Mini Pill */}
        <div className="relative z-10 flex items-center justify-between text-xs font-body text-slate-600 bg-white/90 p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
            <span className="font-medium">Active Candidate Profile</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Verified by .edu</span>
        </div>

      </div>

      {/* Resume Modal */}
      <ResumePDFModal
        student={student}
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      {/* Story Mode Modal */}
      <StoryModeModal
        student={student}
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
        onOpenContact={() => {
          if (typeof window !== "undefined") {
            window.location.href = `/portfolio/${student.username}#contact`;
          }
        }}
      />
    </div>
  );
}

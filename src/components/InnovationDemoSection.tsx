"use client";

import React, { useState } from "react";
import { DEFAULT_STUDENT } from "@/lib/mock-data";
import InteractiveArchitectureDiagram from "./InteractiveArchitectureDiagram";
import LandmarkPRViewer from "./LandmarkPRViewer";
import SkillContextGraph from "./SkillContextGraph";
import StoryModeModal from "./StoryModeModal";
import ResumePDFModal from "./ResumePDFModal";
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  GitPullRequest, 
  Zap, 
  ExternalLink,
  ArrowRight,
  Play
} from "lucide-react";
import Link from "next/link";

export default function InnovationDemoSection() {
  const [activeTab, setActiveTab] = useState<"architecture" | "diffs" | "skills">("architecture");
  const [storyOpen, setStoryOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const student = DEFAULT_STUDENT;
  const flagshipProject = student.projects[0];

  return (
    <section id="innovations" className="py-24 relative bg-black text-white border-b border-zinc-800">
      {/* Background dot matrix */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Next-Gen Engineering Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric font-extrabold text-white tracking-tight">
              Interactive Technical Features
            </h2>
            <p className="text-sm sm:text-base font-body text-zinc-400 leading-relaxed">
              Experience the tools that separate CloudFolio from static website builders: test live packet simulation, inspect production pull request diffs, and explore evidence-linked skill topologies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setStoryOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-geometric font-bold text-xs shadow-lg transition-all hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Launch 60s Story Mode</span>
            </button>
            <Link
              href="/portfolio/alexchen"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-geometric font-bold text-xs border border-zinc-700 transition-all"
            >
              <span>View Live Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>

        {/* Innovation Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-zinc-950 shadow-md"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Architecture & Traffic Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("diffs")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "diffs"
                ? "bg-white text-zinc-950 shadow-md"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Landmark Pull Requests & Code Diffs</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "skills"
                ? "bg-white text-zinc-950 shadow-md"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Evidence-Linked Skill Context Graph</span>
          </button>
        </div>

        {/* Tab 1: Architecture & Traffic Simulator */}
        {activeTab === "architecture" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Demonstration based on: <strong className="text-white">{flagshipProject.title}</strong></span>
              <span>Sub-5ms p99 latency | 12k QPS verified</span>
            </div>
            <InteractiveArchitectureDiagram nodes={flagshipProject.architectureNodes} />
          </div>
        )}

        {/* Tab 2: Landmark Code Diffs */}
        {activeTab === "diffs" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Forensic Code Diffs from <strong className="text-white">{flagshipProject.title}</strong></span>
              <span>Simulated High-Concurrency Optimizations</span>
            </div>
            <LandmarkPRViewer prs={flagshipProject.landmarkPRs} />
          </div>
        )}

        {/* Tab 3: Evidence-Linked Skill Context Graph */}
        {activeTab === "skills" && (
          <div className="space-y-4 animate-in fade-in text-slate-900">
            <SkillContextGraph
              student={student}
              onSelectProject={() => {
                setActiveTab("architecture");
              }}
            />
          </div>
        )}

      </div>

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

      {/* Resume Modal */}
      <ResumePDFModal
        student={student}
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </section>
  );
}

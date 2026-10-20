"use client";

import { 
  CloudLightning, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Terminal,
  Layers,
  GitPullRequest,
  Zap
} from "lucide-react";
import Link from "next/link";

const PROJECT_CONCEPTS = [
  {
    number: "01",
    title: "Interactive System Architecture",
    tagline: "Clickable system pipelines with real-time packet flow simulation",
    description: "Instead of static screenshots, recruiters can inspect multi-node system design topologies, see why specific tools were chosen over alternatives, and simulate live traffic packets.",
    icon: Layers,
    badge: "Live Topology",
    highlights: [
      "Clickable node-by-node pipeline topology",
      "Interactive 'Simulate Live Traffic' packet flow",
      "Explicit trade-off rationales & design decisions",
      "Real benchmark latencies (p99) and config snippets"
    ],
    actionText: "Try Architecture Simulator",
    href: "#innovations"
  },
  {
    number: "02",
    title: "Recruiter 60-Second Story Mode",
    tagline: "High-speed, distraction-free candidate pitches for hiring managers",
    description: "Recruiters spend an average of 6 to 10 seconds skimming. Story Mode gives them a high-signal 4-slide walkthrough of verified credentials, flagship projects, and 1-click scheduling.",
    icon: Sparkles,
    badge: "High-Signal Pitch",
    highlights: [
      "4-slide rapid keyboard walkthrough ([Space] / [→])",
      "Verified .edu academic pedigree & honors",
      "Flagship project with verified impact metrics",
      "1-Click interview booking and ATS resume download"
    ],
    actionText: "Launch Story Mode Demo",
    href: "#innovations"
  },
  {
    number: "03",
    title: "Integrated Developer CLI Terminal",
    tagline: "A full Unix-like shell environment for engineering hiring leads",
    description: "Engineering managers live in the terminal. CloudFolio provides an authentic floating shell (cloudfolio-sh) allowing recruiters to inspect candidates via shell commands.",
    icon: Terminal,
    badge: "Unix Shell",
    highlights: [
      "Accessible by pressing [`~`] or backtick anywhere",
      "Commands: projects, inspect [slug], skills, bio, resume",
      "Terminal command history with up/down arrows",
      "Direct API integration with verified student data"
    ],
    actionText: "Open Terminal Experience",
    href: "/portfolio/alexchen"
  },
  {
    number: "04",
    title: "Proof-of-Work & Code Diff Forensics",
    tagline: "Verifiable landmark pull requests showing before and after code changes",
    description: "Prove you actually wrote the code and solved hard engineering hurdles. Showcase milestone pull requests with side-by-side monochrome code diffs that highlight your real solutions.",
    icon: GitPullRequest,
    badge: "Code Forensics",
    highlights: [
      "Curated milestone pull requests with branch details",
      "Side-by-side monochrome before & after diffs",
      "Quantitative performance gains (e.g. +62% latency drop)",
      "Proves genuine production problem solving"
    ],
    actionText: "Inspect Code Diffs",
    href: "#innovations"
  },
  {
    number: "05",
    title: "Evidence-Linked Skill Context Graph",
    tagline: "Every skill connects directly to proof of work, projects, and coursework",
    description: "No more unverified keyword lists. Clicking any technical skill (Rust, TypeScript, Docker) instantly reveals the exact projects, internships, and university coursework where it was tested.",
    icon: Zap,
    badge: "Skill Topology",
    highlights: [
      "Interactive skill badges with immediate context",
      "Direct links to verified project implementations",
      "Connects to university curriculum (e.g. CS 162 OS)",
      "Replaces passive tags with concrete evidence"
    ],
    actionText: "Explore Skill Graph",
    href: "#innovations"
  },
  {
    number: "06",
    title: "1-Click ATS Single-Page Resume Export",
    tagline: "Vector PDF resumes generated directly from your verified profile",
    description: "Keep your portfolio and resume perfectly aligned. CloudFolio compiles your verified projects, coursework, and technical skills into a clean, ATS-compliant single-page PDF on demand.",
    icon: FileText,
    badge: "ATS Compliant",
    highlights: [
      "Dynamic data-to-PDF synchronization",
      "Standardized single-page ATS layout",
      "Print-optimized vector typography",
      "Always up to date with zero manual reformatting"
    ],
    actionText: "Download Resume Preview",
    href: "/portfolio/alexchen"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative bg-white border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-900 text-xs font-geometric font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" strokeWidth={1.5} />
            <span>Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric font-extrabold text-slate-950 tracking-tight">
            Designed for Real Technical Evaluation
          </h2>
          <p className="text-base sm:text-lg font-body text-slate-600 leading-relaxed">
            Innovative tools built to help students prove their engineering depth and help hiring managers make fast, confident decisions.
          </p>
        </div>

        {/* 6 Innovations Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECT_CONCEPTS.map((concept, idx) => {
            const Icon = concept.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-black shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="font-mono text-xl font-black text-slate-300 group-hover:text-black transition-colors">
                        {concept.number}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-200">
                      {concept.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-geometric font-extrabold text-slate-950 group-hover:text-black transition-colors">
                    {concept.title}
                  </h3>
                  <p className="text-xs font-geometric font-bold text-slate-600 mt-1">
                    {concept.tagline}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm font-body text-slate-600 leading-relaxed">
                    {concept.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="mt-6 space-y-2 pt-4 border-t border-slate-100 text-xs font-body text-slate-700">
                    {concept.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" strokeWidth={1.5} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={concept.href}
                    className="inline-flex items-center gap-1.5 text-xs font-geometric font-bold text-slate-950 hover:underline transition-all"
                  >
                    <span>{concept.actionText}</span>
                    <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </Link>

                  <span className="text-[10px] font-mono text-slate-400">
                    Production Ready
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

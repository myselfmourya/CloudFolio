"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CloudFolioMark } from "@/components/CloudFolioLogo";
import HeroArchedShowcase from "@/components/HeroArchedShowcase";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeaturesSection from "@/components/FeaturesSection";
import InnovationDemoSection from "@/components/InnovationDemoSection";
import CloudArchitectureSection from "@/components/CloudArchitectureSection";
import FAQSection from "@/components/FAQSection";
import StoryModeModal from "@/components/StoryModeModal";
import ResumePDFModal from "@/components/ResumePDFModal";
import { DEFAULT_STUDENT } from "@/lib/mock-data";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ExternalLink,
  Zap
} from "lucide-react";
import Link from "next/link";
import { UniversityMonogram } from "@/components/UniversityMonograms";

const UNIVERSITIES = [
  "UC Berkeley",
  "Stanford University",
  "MIT",
  "Carnegie Mellon",
  "Caltech",
  "Harvard",
  "Oxford",
  "Cambridge"
];

export default function HomePage() {
  const router = useRouter();
  const [handleInput, setHandleInput] = useState("");
  const [storyOpen, setStoryOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const student = DEFAULT_STUDENT;

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!clean) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#000000", "#71717a", "#ffffff"]
    });

    setTimeout(() => {
      router.push(`/signup?handle=${clean}`);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 overflow-x-hidden relative font-body">
      <Navbar />

      <main className="flex-1">
        
        {/* FLOATING APPLICATION CANVAS HERO CARD (Inspired by Reference Design) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 sm:pt-20 pb-16">
          <div className="app-canvas rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* LEFT COLUMN: Headings, Pill Search, Trust */}
              <div className="lg:col-span-7 space-y-7">
                
                {/* Status Pill & Innovation Quick Pill */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-geometric font-bold text-slate-800">
                    <CloudFolioMark size={16} />
                    <span>CloudFolio</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500 font-medium">Student Portfolio Platform</span>
                  </div>

                  <a
                    href="#innovations"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-geometric font-bold hover:bg-zinc-800 transition-all shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Explore Interactive Innovations</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-geometric font-extrabold text-slate-950 tracking-tight leading-[1.06]">
                  The Portfolio Platform Built for Engineers & Designers
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base font-body text-slate-600 leading-relaxed max-w-xl">
                  Showcase projects, technical architecture, and academic work on a fast, modern personal site. Export an ATS-compatible single-page resume with one click and track recruiter engagement.
                </p>

                {/* Sleek Pill Search / Handle Claim Form (Matching reference design) */}
                <div className="pt-2 max-w-lg">
                  <form
                    onSubmit={handleClaim}
                    className="flex items-center p-1.5 rounded-full bg-slate-50 shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white focus-within:border-black transition-all"
                  >
                    <div className="flex items-center pl-4 pr-1 text-slate-400 font-mono text-xs sm:text-sm select-none shrink-0">
                      <span className="text-slate-900 font-bold">cloudfolio.dev/@</span>
                    </div>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder="yourname..."
                      className="w-full py-2.5 px-2 text-sm font-geometric font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    />
                    <button
                      type="submit"
                      className="w-11 h-11 rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center transition-all hover:scale-105 shrink-0 shadow-sm cursor-pointer"
                      title="Claim Handle"
                    >
                      <ArrowRight className="w-4 h-4 text-white" strokeWidth={2} />
                    </button>
                  </form>
                </div>

                {/* Dotted divider line */}
                <div className="border-t border-dashed border-slate-200 pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-geometric">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-slate-950 block">Trusted by 5,000+ students & alumni.</span>
                      <span className="text-slate-500 block">Hired at leading engineering and design teams worldwide.</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 sm:border-l sm:border-slate-200 sm:pl-4">
                      <div className="flex items-center text-zinc-950">
                        <Star className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                        <Star className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                        <Star className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                        <Star className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                        <Star className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                      </div>
                      <span className="font-extrabold text-slate-950 text-base">4.9</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Arched Showcase (Matching reference design) */}
              <div className="lg:col-span-5">
                <HeroArchedShowcase />
              </div>

            </div>

          </div>
        </section>

        {/* UNIVERSITY MONOGRAM BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6">
            Used by students and alumni from top universities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {UNIVERSITIES.map((uni, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-geometric font-bold text-slate-800 shadow-2xs hover:border-black transition-all"
              >
                <UniversityMonogram name={uni} />
                <span>{uni}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CORE PLATFORM FEATURES (6 SPEC CONCEPTS) */}
        <FeaturesSection />

        {/* INTERACTIVE INNOVATIONS SHOWCASE */}
        <InnovationDemoSection />

        {/* CLOUD ARCHITECTURE SECTION */}
        <CloudArchitectureSection />

        {/* LIVE SHOWCASE SECTION */}
        <ShowcaseSection />

        {/* FAQ ACCORDION */}
        <FAQSection />

        {/* BOTTOM CTA CALLOUT */}
        <section className="py-20 relative overflow-hidden bg-slate-950 text-white border-t border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-mono font-bold uppercase tracking-wider border border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              Get Started
            </span>

            <h2 className="text-3xl sm:text-5xl font-geometric font-extrabold text-white tracking-tight">
              Ready to publish your portfolio?
            </h2>

            <p className="text-zinc-400 font-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Create your profile in minutes, showcase your projects, and share your personalized link with recruiters.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-geometric font-bold text-xs shadow-xl hover:scale-103 transition-all"
              >
                <span>Launch Your Free Portfolio</span>
                <ArrowRight className="w-4 h-4 text-black" strokeWidth={1.5} />
              </Link>
              <Link
                href="/portfolio/alexchen"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-geometric font-bold text-xs border border-zinc-800 transition-all"
              >
                <span>View Alex&apos;s Portfolio</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Story Mode Modal */}
      <StoryModeModal
        student={student}
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
        onOpenContact={() => {
          router.push(`/portfolio/${student.username}#contact`);
        }}
      />

      {/* Resume PDF Modal */}
      <ResumePDFModal
        student={student}
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Cloud, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Sparkles, 
  GraduationCap, 
  User, 
  AtSign,
  ShieldCheck,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { saveCurrentStudent } from "@/lib/portfolio-store";
import { StudentProfile } from "@/lib/types";
import CloudFolioLogo from "@/components/CloudFolioLogo";
import { apiClient } from "@/lib/api-client";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHandle = searchParams.get("handle") || "";
  const [handle, setHandle] = useState(initialHandle);
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEdu = email.toLowerCase().includes(".edu") || email.toLowerCase().includes(".ac.uk");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const cleanHandle = (handle || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");

    try {
      const res = await apiClient.auth.signup({
        username: cleanHandle,
        fullName: fullName || "Student Scholar",
        email: email.trim(),
        password: password.trim(),
        university: university.trim()
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please check your inputs.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-950 font-body selection:bg-zinc-950 selection:text-white">
      
      {/* Left Column: Registration Form */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white border-r border-slate-200 shadow-sm relative z-10">
        
        {/* Brand */}
        <div>
          <Link href="/" className="inline-block">
            <CloudFolioLogo size={32} />
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-8 max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-900 border border-slate-200">
              Get Started
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display text-slate-950 tracking-tight">
              Create your <span className="italic text-zinc-800">Portfolio</span>
            </h1>
            <p className="text-xs sm:text-sm font-body text-slate-500">
              Set up your personal engineering portfolio in under 60 seconds.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-body animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Handle reservation */}
            <div className="space-y-1">
              <label className="text-xs font-geometric font-bold text-slate-700">
                Choose Your Handle
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus-within:ring-2 focus-within:ring-slate-950">
                <span className="text-slate-500 font-bold">cloudfolio.dev/@</span>
                <input
                  type="text"
                  required
                  placeholder="alexchen"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  className="w-full bg-transparent font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-geometric font-bold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>
            </div>

            {/* University */}
            <div className="space-y-1">
              <label className="text-xs font-geometric font-bold text-slate-700">
                University / Institution
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  placeholder="e.g. UC Berkeley, Stanford, MIT"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-geometric font-bold text-slate-700">
                Email (.edu recommended)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  placeholder="alex@berkeley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>
              {isEdu && (
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" strokeWidth={1.5} />
                  <span>Eligible for Free Verified Student Badge!</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-geometric font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-geometric font-bold text-xs tracking-wide shadow-md transition-all hover:scale-101 disabled:opacity-70 cursor-pointer"
            >
              <span>{loading ? "Creating account..." : "Create Free Portfolio"}</span>
              <ArrowRight className="w-4 h-4 text-white" strokeWidth={1.5} />
            </button>
          </form>

          <p className="text-center text-xs font-body text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-geometric font-bold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" strokeWidth={1.5} />
            Free Plan Included
          </span>
          <span>No Credit Card Required</span>
        </div>
      </div>

      {/* Right Column: Hero Visual in Obsidian Monochrome */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-16 bg-zinc-950 text-white relative overflow-hidden border-l border-zinc-800">
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs font-geometric font-bold text-zinc-300">
          <span className="px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xs font-mono">
            Platform Highlights
          </span>
          <span className="text-zinc-300 font-mono">Free For Students</span>
        </div>

        <div className="relative z-10 max-w-lg space-y-4 my-auto">
          <div className="p-8 rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl space-y-4">
            <h3 className="text-2xl font-serif-display text-white leading-snug">
              Your engineering projects deserve more than a plain text document.
            </h3>
            
            <div className="space-y-3 pt-2 text-xs font-body text-zinc-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" strokeWidth={1.5} />
                <span>Personal link at <strong className="text-white font-mono">cloudfolio.dev/@yourname</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" strokeWidth={1.5} />
                <span>Interactive architecture breakdowns & live demo embeds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" strokeWidth={1.5} />
                <span>Verified .edu academic badge for hiring teams</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" strokeWidth={1.5} />
                <span>1-click ATS single-page resume export</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs font-body text-zinc-400 flex items-center justify-between">
          <span>Fast & secure edge hosting</span>
          <span>© 2026 CloudFolio Platform</span>
        </div>
      </div>

    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-geometric text-xs text-slate-500">
          Loading Sign Up...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}

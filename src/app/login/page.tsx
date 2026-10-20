"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Cloud, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { GithubIcon } from "@/components/Icons";
import CloudFolioLogo from "@/components/CloudFolioLogo";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEdu = email.toLowerCase().includes(".edu") || email.toLowerCase().includes(".ac.uk");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await apiClient.auth.login(email, password || "password123");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    setEmail("alex.chen@berkeley.edu");
    setPassword("password123");

    try {
      await apiClient.auth.login("alexchen", "password123");
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Demo login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-950 font-body selection:bg-zinc-950 selection:text-white">
      
      {/* Left Column: Auth Form */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white border-r border-slate-200 shadow-sm relative z-10">
        
        {/* Brand Header */}
        <div>
          <Link href="/" className="inline-block">
            <CloudFolioLogo size={32} />
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-8 max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif-display text-slate-950 tracking-tight">
              Sign in to <span className="italic text-zinc-800">CloudFolio</span>
            </h1>
            <p className="text-xs sm:text-sm font-body text-slate-500">
              Manage your engineering portfolio, update projects, and view visitor analytics.
            </p>
          </div>

          {/* Quick Demo Mode Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-zinc-950" strokeWidth={1.5} />
                <span className="text-xs font-geometric font-bold text-slate-900">
                  Demo Account
                </span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-3.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-geometric font-bold transition-all shadow-xs cursor-pointer"
              >
                1-Click Demo Sign In →
              </button>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="p-1 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
                role === "student"
                  ? "bg-white text-slate-950 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-zinc-900" strokeWidth={1.5} />
              <span>Student / Scholar</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
                role === "recruiter"
                  ? "bg-white text-slate-950 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
              <span>Recruiter / Faculty</span>
            </button>
          </div>

          {/* Social Auth Providers */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-geometric font-semibold text-slate-800 transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#555555"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#888888"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#333333"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Cloud</span>
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-geometric font-semibold text-slate-800 transition-all shadow-2xs cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
              <span>GitHub Git</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-geometric font-medium text-slate-400 uppercase tracking-wider">
              Or email password
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-body animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-geometric font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  placeholder={role === "student" ? "you@university.edu" : "recruiter@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                />
              </div>

              {isEdu && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 animate-in fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-900" strokeWidth={1.5} />
                  <span>Verified university domain detected: Student tier enabled!</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-[11px] font-geometric font-semibold text-slate-600 hover:text-slate-950">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-geometric font-bold text-xs tracking-wide shadow-md transition-all hover:scale-101 disabled:opacity-70 cursor-pointer"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4 text-white" strokeWidth={1.5} />
            </button>
          </form>

          <p className="text-center text-xs font-body text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="font-geometric font-bold text-slate-900 hover:underline">
              Create free portfolio
            </Link>
          </p>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" strokeWidth={1.5} />
            Encrypted & Secure
          </span>
          <span>Privacy Protected</span>
        </div>
      </div>

      {/* Right Column: Hero Visual & Testimonial in Obsidian Monochrome */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-16 bg-zinc-950 text-white relative overflow-hidden border-l border-zinc-800">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs font-geometric font-bold text-zinc-300">
          <span className="px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xs font-mono">
            CloudFolio Network
          </span>
          <span className="flex items-center gap-1.5 font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Engineers & Designers
          </span>
        </div>

        {/* Center Quote with Display Serif Font */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="p-8 rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-1 text-white">
              {"★".repeat(5)}
            </div>
            <p className="text-xl sm:text-2xl font-serif-display text-white leading-snug">
              &ldquo;CloudFolio was the single biggest reason I landed my systems engineering internship at Cloudflare. Recruiters explicitly praised the clean architecture breakdowns.&rdquo;
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center font-geometric font-bold text-sm">
                AC
              </div>
              <div>
                <h4 className="text-xs font-geometric font-bold text-white">
                  Alex Chen
                </h4>
                <p className="text-[11px] font-body text-zinc-400">
                  UC Berkeley EECS &apos;26 • Systems Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-xl font-geometric font-extrabold text-white block">
                42,800+
              </span>
              <span className="text-[10.5px] font-body text-zinc-400">
                Portfolios Hosted
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-xl font-geometric font-extrabold text-white block">
                99.9%
              </span>
              <span className="text-[10.5px] font-body text-zinc-400">
                Uptime
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-xl font-geometric font-extrabold text-white block">
                3.8M+
              </span>
              <span className="text-[10.5px] font-body text-zinc-400">
                Project Views
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs font-body text-zinc-400 flex items-center justify-between">
          <span>Privacy-first portfolio platform</span>
          <span>© 2026 CloudFolio Platform</span>
        </div>

      </div>

    </div>
  );
}

"use client";

import { use, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getStudentByUsername, sendInquiryToStudent } from "@/lib/portfolio-store";
import { StudentProfile, Project } from "@/lib/types";
import ProjectModal from "@/components/ProjectModal";
import confetti from "canvas-confetti";
import { 
  Cloud, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Globe, 
  Download, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  Award, 
  Layers, 
  Send, 
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Activity,
  Terminal,
  QrCode,
  Lock,
  Headphones
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import ResumePDFModal from "@/components/ResumePDFModal";
import { CloudFolioMark } from "@/components/CloudFolioLogo";
import { apiClient } from "@/lib/api-client";
import StoryModeModal from "@/components/StoryModeModal";
import DeveloperTerminal from "@/components/DeveloperTerminal";
import SkillContextGraph from "@/components/SkillContextGraph";
import FloatingTerminalButton from "@/components/FloatingTerminalButton";
import AttestationCard from "@/components/AttestationCard";
import CandidateAiTwinModal from "@/components/CandidateAiTwinModal";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

function PortfolioContent({ params }: PortfolioPageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [student, setStudent] = useState<StudentProfile | null>(() => getStudentByUsername(username) || null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [resumePdfOpen, setResumePdfOpen] = useState(false);
  const [storyModeOpen, setStoryModeOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [aiTwinOpen, setAiTwinOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "skills" | "education">("projects");

  // Contact form state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [company, setCompany] = useState("");
  const [roleOffered, setRoleOffered] = useState("");
  const [message, setMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiClient.students.get(username).then((data) => {
      if (isMounted && data) {
        setStudent(data);
      }
    }).catch(console.warn);
    return () => { isMounted = false; };
  }, [username]);

  useEffect(() => {
    if (student?.settings?.enableTerminal === false) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [student?.settings?.enableTerminal]);

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mb-4 border border-zinc-800">
          <Cloud className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-serif-display text-slate-950 mb-2">Student Portfolio Not Found</h1>
        <p className="text-sm font-body text-slate-500 max-w-sm mb-6">
          The handle &ldquo;@{username}&rdquo; has not been deployed to the cloud yet.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-slate-950 text-white font-geometric font-bold text-xs hover:bg-slate-800 transition-colors"
        >
          Return to CloudFolio Home
        </Link>
      </div>
    );
  }

  // Check Private Passcode Gate
  if (student.settings?.portfolioVisibility === "private" && !isUnlocked) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      const expected = student.settings?.accessCode || "berkeley2026";
      if (passcodeAttempt.trim().toLowerCase() === expected.trim().toLowerCase()) {
        setIsUnlocked(true);
        setPasscodeError(false);
      } else {
        setPasscodeError(true);
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center font-body">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-geometric font-extrabold text-slate-950">
              Private Candidate Portfolio
            </h1>
            <p className="text-xs font-body text-slate-500">
              This portfolio is protected by candidate @{student.username}. Please enter the passcode provided by the candidate to view verified projects and coursework.
            </p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              placeholder="Enter candidate passcode..."
              value={passcodeAttempt}
              onChange={(e) => {
                setPasscodeAttempt(e.target.value);
                setPasscodeError(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {passcodeError && (
              <p className="text-xs text-red-500 font-medium">
                Incorrect passcode. Please contact the candidate for access.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-geometric font-bold text-xs transition-all cursor-pointer"
            >
              Unlock Portfolio
            </button>
          </form>
          <div className="pt-2 border-t border-slate-100">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900">
              ← Return to CloudFolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResumeDownload = () => {
    setResumePdfOpen(true);
    apiClient.students.trackResumeDownload(student.username).catch(console.warn);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#a1a1aa", "#18181b"]
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.students.sendInquiry(student.username, {
        senderName,
        senderEmail,
        company,
        roleOffered,
        message
      });

      setContactSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });
      // reset fields
      setSenderName("");
      setSenderEmail("");
      setCompany("");
      setRoleOffered("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send inquiry via API:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTerminalInquiry = async (terminalMsg: string) => {
    if (!student) return;
    try {
      await apiClient.students.sendInquiry(student.username, {
        senderName: "Terminal Recruiter",
        senderEmail: "recruiter@shell.terminal",
        company: "Engineering Team",
        roleOffered: "CLI Inquiry",
        message: terminalMsg
      });
    } catch (err) {
      console.warn("Terminal inquiry failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-950 font-body selection:bg-zinc-950 selection:text-white">
      
      {/* Top Floating Action Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-geometric font-bold text-slate-800 hover:text-slate-950 transition-colors group"
          >
            <CloudFolioMark size={22} />
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
            <span className="hidden sm:inline">CloudFolio Directory</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setAiTwinOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-black bg-white text-xs font-geometric font-bold text-slate-900 transition-all hover:scale-102 cursor-pointer shadow-2xs"
              title="Interview Candidate AI Twin powered by Gemini"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Ask AI Twin</span>
            </button>

            {student.settings?.enableStoryMode !== false && (
              <button
                onClick={() => setStoryModeOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-geometric font-bold shadow-xs transition-all hover:scale-102 cursor-pointer"
                title="Launch 60-Second Recruiter Pitch"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Story Mode (60s)</span>
              </button>
            )}

            <button
              onClick={() => setQrOpen(!qrOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
              <span>QR Code</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" strokeWidth={1.5} />
                  <span className="text-zinc-950 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
                  <span>Share</span>
                </>
              )}
            </button>

            {student.settings?.enableResumeDownload !== false && (
              <button
                onClick={handleResumeDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-geometric font-bold text-slate-900 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.5} />
                <span className="hidden sm:inline">ATS Resume</span>
              </button>
            )}

            {student.settings?.enableContactForm !== false && (
              <a
                href="#contact"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-xs font-geometric font-bold text-white shadow-xs transition-all hover:scale-102"
              >
                <Mail className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                <span>Contact Student</span>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* QR Code Modal */}
      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <h3 className="font-serif-display text-xl text-slate-950">
              Share {student.fullName}&apos;s Folio
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block">
              {/* QR Mockup */}
              <div className="w-48 h-48 bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 shadow-inner">
                <QrCode className="w-36 h-36 text-slate-900" strokeWidth={1.25} />
              </div>
            </div>
            <p className="text-xs font-mono text-slate-500 break-all">
              cloudfolio.dev/@{student.username}
            </p>
            <button
              onClick={() => setQrOpen(false)}
              className="w-full py-2.5 rounded-full bg-zinc-950 text-white font-geometric font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Portfolio Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 relative">
        
        {/* HEADER HERO CARD */}
        <section className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs overflow-hidden">
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-slate-900 shadow-sm"
                />
                {student.verifiedStudent && (
                  <div 
                    title="Cloud Verified Student"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center border-2 border-white shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-serif-display text-slate-950 tracking-tight">
                    {student.fullName}
                  </h1>
                  <span className="font-mono text-xs text-slate-400">
                    @{student.username}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-geometric font-semibold text-slate-700">
                  {student.headline}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-body text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <GraduationCap className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
                    {student.university} ({student.gpa})
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                    {student.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Pill & AI Twin Trigger */}
            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-900 text-xs font-geometric font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
                <span>{student.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Graduating {student.gradYear}
                </span>
                <button
                  type="button"
                  onClick={() => setAiTwinOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-geometric font-bold shadow-xs transition-all hover:scale-103 cursor-pointer"
                  title="Ask Alex's AI Twin questions about their projects"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Interview AI Twin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bio paragraph */}
          <div className="pt-6 space-y-4">
            <h3 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400">
              About & Research Motivation
            </h3>
            <p className="text-sm sm:text-base font-body text-slate-700 leading-relaxed max-w-3xl">
              {student.bio}
            </p>

            {/* Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {student.socials.github && (
                <a
                  href={student.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-geometric font-semibold transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>GitHub</span>
                </a>
              )}
              {student.socials.linkedin && (
                <a
                  href={student.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-geometric font-semibold transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>LinkedIn</span>
                </a>
              )}
              {student.socials.website && (
                <a
                  href={student.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-geometric font-semibold transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Personal Site</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile Stats Bar */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-4">
              <span>Profile Views: <strong className="text-slate-900 font-bold">{student.stats.profileViews.toLocaleString()}</strong></span>
              <span>•</span>
              <span>Project Views: <strong className="text-slate-900 font-bold">{student.stats.projectClicks.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available for opportunities</span>
            </div>
          </div>
        </section>

        {/* SECTION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Featured Projects ({student.projects.length})
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "experience"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Work & Research ({student.experiences.length})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "skills"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Technical Stack
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "education"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Education & Attestations {student.attestations?.length ? `(${student.attestations.length})` : ""}
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer rounded-3xl bg-white border border-slate-200 hover:border-slate-400 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image */}
                    {project.imageUrl && (
                      <div className="h-44 w-full rounded-2xl overflow-hidden mb-5 border border-slate-200 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-geometric font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {project.category}
                      </span>
                      {project.metrics && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                          {project.metrics.split("|")[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-display text-xl text-slate-950 group-hover:text-black transition-colors mt-2">
                      {project.title}
                    </h3>
                    <p className="text-xs font-body text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-geometric font-bold text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Architecture
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: EXPERIENCE */}
        {activeTab === "experience" && (
          <section className="space-y-4">
            {student.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-geometric font-bold text-slate-950">
                      {exp.role}
                    </h3>
                    <p className="text-xs font-geometric font-bold text-slate-800 mt-0.5">
                      {exp.company} • <span className="text-slate-500 font-normal">{exp.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm font-body text-slate-600 leading-relaxed list-disc list-inside">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* TAB 3: TECHNICAL STACK & EVIDENCE GRAPH */}
        {activeTab === "skills" && (
          <section className="space-y-6">
            <SkillContextGraph
              student={student}
              onSelectProject={(slug) => {
                const found = student.projects.find((p) => p.slug === slug);
                if (found) setSelectedProject(found);
              }}
            />
          </section>
        )}

        {/* TAB 4: EDUCATION & CRYPTOGRAPHIC ATTESTATIONS */}
        {activeTab === "education" && (
          <section className="space-y-8">
            {/* INNOVATION FEATURE C: Cryptographic Attestations */}
            {student.attestations && student.attestations.length > 0 && student.settings?.enableAttestations !== false && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-zinc-950" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        Cryptographic Proof-of-Work & Attestations
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif-display text-slate-950 mt-1">
                      Tamper-Proof Registrar & Hackathon Ledgers
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
                    Click any card to flip & audit SHA-256 proof
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {student.attestations.map((att) => (
                    <AttestationCard key={att.id} attestation={att} />
                  ))}
                </div>
              </div>
            )}

            {/* University & Degree Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400">
                Institutional Academic Degrees & Coursework
              </h4>
              {student.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-serif-display text-slate-950">
                      {edu.institution}
                    </h3>
                    <p className="text-xs font-geometric font-bold text-slate-800 mt-0.5">
                      {edu.degree}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 block">
                      GPA: {edu.gpa}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {edu.period}
                    </span>
                  </div>
                </div>

                {edu.honors && edu.honors.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400 block">
                      Academic Honors & Fellowships
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {edu.honors.map((honor, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-900 border border-slate-200"
                        >
                          🏆 {honor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.courses && edu.courses.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400 block">
                      Key Coursework
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </section>
        )}

        {/* RECRUITER CONTACT FORM SECTION */}
        {student.settings?.enableContactForm === false ? (
          <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
            <Mail className="w-6 h-6 text-slate-400 mx-auto" />
            <h3 className="text-base font-geometric font-bold text-slate-950">
              Direct Inquiries Paused
            </h3>
            <p className="text-xs font-body text-slate-500 max-w-sm mx-auto">
              Direct interview invitations are currently paused by {student.fullName}. You may connect with them on LinkedIn or GitHub above.
            </p>
          </section>
        ) : (
          <section id="contact" className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-slate-100 text-slate-900 border border-slate-200">
                Direct Cloud Inbox
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-display text-slate-950">
                Contact <span className="italic text-zinc-800">{student.fullName}</span>
              </h2>
              <p className="text-xs sm:text-sm font-body text-slate-600 max-w-lg">
                Recruiters & hiring managers: Send an internship inquiry or interview opportunity. Your message delivers directly to the student&apos;s verified dashboard.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-zinc-950 mx-auto" strokeWidth={1.5} />
                <h4 className="font-geometric font-bold text-slate-950 text-base">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs font-body text-slate-500">
                  Your message has been delivered to {student.fullName}&apos;s CloudFolio studio and forwarded to their verified university inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-full text-xs font-geometric font-bold bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-geometric font-bold text-slate-700">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-geometric font-bold text-slate-700">
                      Your Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sjenkins@google.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-geometric font-bold text-slate-700">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google Cloud, Stripe, OpenAI"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-geometric font-bold text-slate-700">
                      Role / Opportunity
                    </label>
                    <input
                      type="text"
                      placeholder="SWE Intern Summer 2026"
                      value={roleOffered}
                      onChange={(e) => setRoleOffered(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-geometric font-bold text-slate-700">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hi Alex, we loved your OmniFlow cache project write-up and would love to interview you for our team..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-geometric font-bold text-xs tracking-wide shadow-md transition-all hover:scale-102 cursor-pointer"
                >
                  <span>Send Recruiter Message</span>
                  <Send className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                </button>
              </form>
            )}
          </section>
        )}

      </main>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Dynamic ATS Resume PDF Modal */}
      <ResumePDFModal
        student={student}
        isOpen={resumePdfOpen}
        onClose={() => setResumePdfOpen(false)}
      />

      {/* INNOVATION 2: Recruiter 60-Second Story Mode Modal */}
      <StoryModeModal
        student={student}
        isOpen={storyModeOpen}
        onClose={() => setStoryModeOpen(false)}
        onOpenResume={handleResumeDownload}
        onOpenContact={() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* INNOVATION 3: Developer Terminal CLI Modal */}
      {student.settings?.enableTerminal !== false && (
        <DeveloperTerminal
          student={student}
          isOpen={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          onOpenResume={handleResumeDownload}
          onOpenStory={() => setStoryModeOpen(true)}
          onSendInquiry={handleTerminalInquiry}
        />
      )}

      {/* INNOVATION 3: Expanding Floating CLI Terminal Toggle Button */}
      {student.settings?.enableTerminal !== false && (
        <FloatingTerminalButton
          username={student.username}
          isOpen={terminalOpen}
          onClick={() => setTerminalOpen(!terminalOpen)}
        />
      )}

      {/* GEMINI INNOVATION 1: Candidate AI Twin Live Technical Interview Modal */}
      <CandidateAiTwinModal
        student={student}
        isOpen={aiTwinOpen}
        onClose={() => setAiTwinOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white/70 text-center text-xs font-body text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-black transition-colors group">
            <CloudFolioMark size={18} />
            <span className="font-geometric font-bold text-xs tracking-tight">CloudFolio</span>
          </Link>
          <p className="text-[11px] text-slate-400">Verified Student Portfolio • Deployed via CloudFolio</p>
        </div>
      </footer>

    </div>
  );
}

export default function StudentPortfolioPage({ params }: PortfolioPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-geometric text-xs text-slate-500">
          Loading Portfolio...
        </div>
      }
    >
      <PortfolioContent params={params} />
    </Suspense>
  );
}

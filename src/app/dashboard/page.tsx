"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getStoredCurrentStudent, saveCurrentStudent } from "@/lib/portfolio-store";
import { StudentProfile, Project, Experience, RecruiterInquiry } from "@/lib/types";
import confetti from "canvas-confetti";
import { 
  Cloud, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Share2, 
  Download, 
  Eye, 
  Send, 
  ArrowUpRight, 
  Check, 
  Copy,
  Zap,
  Globe,
  Lock,
  Layers,
  Settings,
  X,
  FileText,
  Mail,
  Activity,
  Terminal,
  ShieldCheck
} from "lucide-react";
import AIAnalyticsSection from "@/components/AIAnalyticsSection";
import ResumePDFModal from "@/components/ResumePDFModal";
import CloudFolioLogo from "@/components/CloudFolioLogo";
import PortfolioSettingsSection from "@/components/PortfolioSettingsSection";
import { apiClient } from "@/lib/api-client";

function DashboardContent() {
  const searchParams = useSearchParams();
  const claimParam = searchParams.get("claim");

  const [student, setStudent] = useState<StudentProfile | null>(() => getStoredCurrentStudent());
  const [activeTab, setActiveTab] = useState<"projects" | "profile" | "experience" | "skills" | "inbox" | "analytics" | "cloud">("projects");
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [resumePdfOpen, setResumePdfOpen] = useState(false);

  // New Project Modal State
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science & AI");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newLive, setNewLive] = useState("");
  const [newArchitecture, setNewArchitecture] = useState("");
  const [newMetrics, setNewMetrics] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80");

  useEffect(() => {
    let isMounted = true;
    apiClient.auth.me().then((res) => {
      if (isMounted && res.profile) {
        if (claimParam) {
          const updated = { ...res.profile, username: claimParam };
          setStudent(updated);
          apiClient.students.update(res.profile.username, updated).catch(console.warn);
        } else {
          setStudent(res.profile);
        }
      }
    }).catch(() => {
      const current = getStoredCurrentStudent();
      if (claimParam && current) {
        const updated = { ...current, username: claimParam };
        setStudent(updated);
        saveCurrentStudent(updated);
      } else {
        setStudent(current);
      }
    });
    return () => { isMounted = false; };
  }, [claimParam]);

  if (!student) return null;

  const handlePublish = async () => {
    const updated: StudentProfile = {
      ...student,
      cloudSyncStatus: "Synced"
    };
    setStudent(updated);
    saveCurrentStudent(updated);

    try {
      await apiClient.students.update(student.username, updated);
    } catch (e) {
      console.warn("Backend sync failed, saved locally:", e);
    }

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#a1a1aa", "#18181b"]
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/portfolio/${student.username}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this cloud project?")) {
      const updated = {
        ...student,
        projects: student.projects.filter((p) => p.id !== id)
      };
      setStudent(updated);
      saveCurrentStudent(updated);

      try {
        await apiClient.students.deleteProject(student.username, id);
      } catch (e) {
        console.warn("Delete project API error:", e);
      }
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const project: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline: newTagline,
      description: newDescription || newTagline,
      category: newCategory,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl: newGithub || undefined,
      liveUrl: newLive || undefined,
      imageUrl: newImage,
      featured: true,
      architecture: newArchitecture || "Edge Serverless, Cloud Datastore",
      metrics: newMetrics || "Deployed to CloudFolio Edge",
      completionDate: "Recent"
    };

    const updated = {
      ...student,
      projects: [project, ...student.projects]
    };

    setStudent(updated);
    saveCurrentStudent(updated);
    setIsAddProjectOpen(false);

    try {
      await apiClient.students.addProject(student.username, project);
    } catch (e) {
      console.warn("Add project API error:", e);
    }

    // Reset inputs
    setNewTitle("");
    setNewTagline("");
    setNewDescription("");
    setNewTags("");
    setNewGithub("");
    setNewLive("");
    setNewArchitecture("");
    setNewMetrics("");

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#ffffff", "#a1a1aa", "#18181b"]
    });
  };

  const handleProfileFieldChange = (field: keyof StudentProfile, val: any) => {
    const updated = { ...student, [field]: val };
    setStudent(updated);
    saveCurrentStudent(updated);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-950 font-body selection:bg-zinc-950 selection:text-white">
      
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Handle Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <CloudFolioLogo size={28} textClassName="text-base" />
              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Studio
              </span>
            </Link>

            <span className="text-slate-300">|</span>

            {/* Live Handle Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-900">
              <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
              <span>@{student.username}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" strokeWidth={1.5} />
                  <span className="text-zinc-950 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
                  <span>Copy Public URL</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setResumePdfOpen(true);
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.6 },
                  colors: ["#ffffff", "#a1a1aa", "#18181b"]
                });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-xs font-geometric font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.5} />
              <span>ATS Resume PDF</span>
            </button>

            <button
              onClick={() => setActiveTab("cloud")}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-xs font-geometric font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.5} />
              <span>Domain & Settings</span>
            </button>

            <Link
              href={`/portfolio/${student.username}`}
              target="_blank"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-geometric font-bold text-slate-800 transition-colors"
            >
              <span>Live Preview</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
            </Link>

            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-geometric font-bold shadow-xs transition-all hover:scale-102 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={1.5} />
          <div>
            <h4 className="text-xs font-geometric font-bold text-white">
              Synchronized to Global Edge CDN
            </h4>
            <p className="text-[11px] font-body text-zinc-400">
              Your public portfolio is live at cloudfolio.dev/@{student.username}
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">

        {/* TOP ANALYTICS & ENGAGEMENT METRICS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-geometric font-bold uppercase tracking-wider">
                Profile Views
              </span>
              <Eye className="w-4 h-4 text-zinc-900" strokeWidth={1.5} />
            </div>
            <span className="text-2xl sm:text-3xl font-geometric font-extrabold text-slate-950">
              {student.stats.profileViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-600 font-mono block mt-1">
              +14% vs last week
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-geometric font-bold uppercase tracking-wider">
                Project Clicks
              </span>
              <FolderGit2 className="w-4 h-4 text-zinc-900" strokeWidth={1.5} />
            </div>
            <span className="text-2xl sm:text-3xl font-geometric font-extrabold text-slate-950">
              {student.stats.projectClicks.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-600 font-mono block mt-1">
              Top: {student.projects[0]?.title.split(":")[0] || "Projects"}
            </span>
          </div>

          <div 
            onClick={() => {
              setResumePdfOpen(true);
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 },
                colors: ["#ffffff", "#a1a1aa", "#18181b"]
              });
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition-all hover:scale-101 group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-geometric font-bold uppercase tracking-wider">
                Resume Downloads
              </span>
              <Download className="w-4 h-4 text-zinc-900 group-hover:translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </div>
            <span className="text-2xl sm:text-3xl font-geometric font-extrabold text-slate-950">
              {student.stats.resumeDownloads.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-800 font-geometric font-bold block mt-1 underline">
              Preview ATS PDF Generator →
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-geometric font-bold uppercase tracking-wider">
                Recruiter Messages
              </span>
              <Mail className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-2xl sm:text-3xl font-geometric font-extrabold text-white">
              {student.inquiries?.length || student.stats.recruiterPings}
            </span>
            <button
              onClick={() => setActiveTab("inbox")}
              className="text-[11px] font-geometric font-bold text-zinc-300 hover:text-white underline block mt-1 cursor-pointer"
            >
              View Recruiter Inbox →
            </button>
          </div>
        </section>

        {/* STUDIO TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Manage Projects ({student.projects.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Profile & Academics
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "experience"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Experience & Research ({student.experiences.length})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "skills"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Skills Matrix
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all cursor-pointer ${
              activeTab === "inbox"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Recruiter Inbox ({student.inquiries?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" strokeWidth={1.5} />
            <span>Analytics & Score</span>
            <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-950 text-[10px] rounded-full font-extrabold leading-none">
              96
            </span>
          </button>
          <button
            onClick={() => setActiveTab("cloud")}
            className={`px-4 py-2 rounded-full text-xs font-geometric font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "cloud"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-zinc-700" />
            <span>Settings & Controls</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGER */}
        {activeTab === "projects" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif-display text-slate-950">
                  Cloud Project Case Studies
                </h2>
                <p className="text-xs font-body text-slate-500">
                  Add interactive architectural breakdowns, live demo links, and GitHub repositories.
                </p>
              </div>

              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-geometric font-bold shadow-xs transition-all hover:scale-102 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
                <span>Add Cloud Project</span>
              </button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {proj.imageUrl && (
                      <div className="h-40 w-full rounded-2xl overflow-hidden mb-4 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {proj.category}
                      </span>
                      {proj.metrics && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {proj.metrics}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-display text-xl text-slate-950 mt-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-body text-slate-600 mt-1.5 line-clamp-2">
                      {proj.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10.5px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: PROFILE & ACADEMICS */}
        {activeTab === "profile" && (
          <section className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-serif-display text-slate-950">
                Student Profile & Academic Credentials
              </h2>
              <p className="text-xs font-body text-slate-500">
                Update your verified profile information and collegiate milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={student.fullName}
                  onChange={(e) => handleProfileFieldChange("fullName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Username Handle (@)
                </label>
                <input
                  type="text"
                  value={student.username}
                  onChange={(e) => handleProfileFieldChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={student.headline}
                  onChange={(e) => handleProfileFieldChange("headline", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  University / College
                </label>
                <input
                  type="text"
                  value={student.university}
                  onChange={(e) => handleProfileFieldChange("university", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Degree & Major
                </label>
                <input
                  type="text"
                  value={student.degree}
                  onChange={(e) => handleProfileFieldChange("degree", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  GPA / Academic Standing
                </label>
                <input
                  type="text"
                  value={student.gpa}
                  onChange={(e) => handleProfileFieldChange("gpa", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={student.gradYear}
                  onChange={(e) => handleProfileFieldChange("gradYear", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Bio & Research Motivation
                </label>
                <textarea
                  rows={4}
                  value={student.bio}
                  onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-full bg-slate-950 text-white font-geometric font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </section>
        )}

        {/* TAB 3: EXPERIENCE */}
        {activeTab === "experience" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif-display text-slate-950">
                  Internships & Campus Leadership
                </h2>
                <p className="text-xs font-body text-slate-500">
                  Manage positions, bullet points, and demonstrated skills.
                </p>
              </div>
            </div>

            {student.experiences.map((exp) => (
              <div key={exp.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-geometric font-bold text-base text-slate-950">{exp.role}</h3>
                  <span className="text-xs font-mono text-slate-500">{exp.period}</span>
                </div>
                <p className="text-xs font-geometric font-bold text-slate-800">{exp.company} • {exp.location}</p>
                <ul className="text-xs font-body text-slate-600 space-y-1 list-disc list-inside pt-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === "skills" && (
          <section className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-2xl font-serif-display text-slate-950">
              Technical Stack & Cloud Competencies
            </h2>
            <div className="space-y-6">
              {student.skills.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-xs font-geometric font-bold text-slate-400 uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-900 border border-slate-200"
                      >
                        ⚡ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: RECRUITER INBOX */}
        {activeTab === "inbox" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-serif-display text-slate-950">
                Recruiter Inquiries & Interview Requests
              </h2>
              <p className="text-xs font-body text-slate-500">
                Direct messages submitted via your public cloud portfolio.
              </p>
            </div>

            {(!student.inquiries || student.inquiries.length === 0) ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs font-body text-slate-500">
                  No recruiter messages yet. Share your portfolio link to start receiving interview invites!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-geometric font-bold text-base text-slate-950">
                            {inq.senderName}
                          </h4>
                          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {inq.company}
                          </span>
                        </div>
                        <p className="text-xs font-body text-slate-500 mt-0.5">
                          {inq.senderEmail} • {inq.roleOffered}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {inq.date}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-body text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${inq.senderEmail}?subject=Re: ${encodeURIComponent(inq.roleOffered)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 text-white font-geometric font-bold text-xs hover:bg-slate-800 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Reply to Recruiter</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 6: PORTFOLIO SETTINGS & CONTROLS */}
        {activeTab === "cloud" && (
          <PortfolioSettingsSection
            student={student}
            onUpdate={(updated) => {
              setStudent(updated);
              saveCurrentStudent(updated);
              apiClient.students.update(updated.username, updated).catch(console.warn);
            }}
            onSaveToast={() => {
              setSavedToast(true);
              setTimeout(() => setSavedToast(false), 3000);
            }}
          />
        )}

        {/* TAB 6: PORTFOLIO COMPLETENESS & RECRUITER ANALYTICS DASHBOARD */}
        {activeTab === "analytics" && (
          <AIAnalyticsSection student={student} />
        )}

      </main>

      {/* ADD NEW PROJECT MODAL */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-display text-2xl text-slate-950">
                Add New Cloud Project
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OmniFlow: Distributed In-Memory Cache in Rust"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  One-Line Hook / Tagline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Fast key-value store with LRU eviction and gRPC streaming"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-geometric font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 bg-white"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Cloud & Systems Engineering">Cloud & Systems</option>
                    <option value="Product Design & UI/UX">Design & UI/UX</option>
                    <option value="Data Science & Analytics">Data Science</option>
                    <option value="Biotech & Robotics">Robotics & Hardware</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-geometric font-bold text-slate-700">
                    Impact Metrics
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10k QPS | Sub-5ms latency"
                    value={newMetrics}
                    onChange={(e) => setNewMetrics(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Cloud Architecture & Stack
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rust, Google Cloud Run, Redis, Envoy Proxy"
                  value={newArchitecture}
                  onChange={(e) => setNewArchitecture(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Rust, Docker, gRPC, Cloud Run"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-geometric font-bold text-slate-700">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-geometric font-bold text-slate-700">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://myproject.demo.cloud"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-geometric font-bold text-slate-700">
                  Description / Case Study
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the problem you solved, architectural hurdles, and quantitative results..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-geometric font-bold text-xs shadow-md transition-all hover:scale-101 cursor-pointer"
              >
                Deploy Project to Portfolio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ATS Single-Page Resume PDF Generator Modal */}
      <ResumePDFModal
        student={student}
        isOpen={resumePdfOpen}
        onClose={() => setResumePdfOpen(false)}
      />



    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-geometric text-xs text-slate-500">
          Loading Cloud Studio...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

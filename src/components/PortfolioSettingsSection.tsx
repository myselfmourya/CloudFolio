"use client";

import React, { useState } from "react";
import { StudentProfile, PortfolioSettings } from "@/lib/types";
import { 
  Terminal, 
  Sparkles, 
  Layers, 
  GitPullRequest, 
  Zap, 
  FileText, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Bell, 
  Sliders, 
  Check, 
  ExternalLink, 
  Download, 
  Eye, 
  Key, 
  RefreshCw,
  CheckCircle2,
  Copy,
  QrCode,
  AlertTriangle,
  Server,
  HardDrive
} from "lucide-react";
import Link from "next/link";

interface PortfolioSettingsSectionProps {
  student: StudentProfile;
  onUpdate: (updated: StudentProfile) => void;
  onSaveToast: () => void;
}

export default function PortfolioSettingsSection({
  student,
  onUpdate,
  onSaveToast,
}: PortfolioSettingsSectionProps) {
  // Ensure default settings object exists with fallback defaults
  const currentSettings: PortfolioSettings = {
    enableTerminal: student.settings?.enableTerminal ?? true,
    enableStoryMode: student.settings?.enableStoryMode ?? true,
    enableArchitectureSim: student.settings?.enableArchitectureSim ?? true,
    enableLandmarkPRs: student.settings?.enableLandmarkPRs ?? true,
    enableSkillGraph: student.settings?.enableSkillGraph ?? true,
    enableResumeDownload: student.settings?.enableResumeDownload ?? true,
    enableContactForm: student.settings?.enableContactForm ?? true,
    portfolioVisibility: student.settings?.portfolioVisibility ?? "public",
    accessCode: student.settings?.accessCode ?? "berkeley2026",
    requireRecruiterCompany: student.settings?.requireRecruiterCompany ?? true,
    notifyOnView: student.settings?.notifyOnView ?? false,
    notifyOnResumeDownload: student.settings?.notifyOnResumeDownload ?? true,
    allowSearchIndexing: student.settings?.allowSearchIndexing ?? true,
    customDomain: student.settings?.customDomain ?? "",
  };

  const [settings, setSettings] = useState<PortfolioSettings>(currentSettings);
  const [handle, setHandle] = useState(student.username);
  const [customDomain, setCustomDomain] = useState(student.settings?.customDomain ?? "");
  const [domainStatus, setDomainStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [purgingCache, setPurgingCache] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRecruiterLink, setCopiedRecruiterLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof PortfolioSettings) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updatedSettings);

    const updatedProfile: StudentProfile = {
      ...student,
      settings: updatedSettings,
    };
    onUpdate(updatedProfile);
    onSaveToast();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleVisibilityChange = (visibility: "public" | "unlisted" | "private") => {
    const updatedSettings = {
      ...settings,
      portfolioVisibility: visibility,
    };
    setSettings(updatedSettings);

    const updatedProfile: StudentProfile = {
      ...student,
      settings: updatedSettings,
    };
    onUpdate(updatedProfile);
    onSaveToast();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveAll = () => {
    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const updatedProfile: StudentProfile = {
      ...student,
      username: cleanHandle || student.username,
      settings: settings,
    };
    onUpdate(updatedProfile);
    onSaveToast();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyPublicUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`https://cloudfolio.dev/@${student.username}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyRecruiterUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`https://cloudfolio.dev/@${student.username}?ref=career-fair`);
      setCopiedRecruiterLink(true);
      setTimeout(() => setCopiedRecruiterLink(false), 2000);
    }
  };

  const handleVerifyDomain = () => {
    if (!customDomain.trim()) return;
    setDomainStatus("verifying");
    setTimeout(() => {
      setDomainStatus("verified");
      const updatedSettings = {
        ...settings,
        customDomain: customDomain.trim(),
      };
      setSettings(updatedSettings);
      onUpdate({
        ...student,
        settings: updatedSettings,
      });
      onSaveToast();
    }, 1400);
  };

  const handlePurgeCache = () => {
    setPurgingCache(true);
    setTimeout(() => {
      setPurgingCache(false);
      onSaveToast();
    }, 1200);
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(student, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.username}-portfolio-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${student.fullName}
**${student.headline}**
${student.university} — ${student.degree} (Class of ${student.gradYear}, GPA: ${student.gpa})
Location: ${student.location} | Email: ${student.email}
GitHub: ${student.socials?.github || "N/A"} | LinkedIn: ${student.socials?.linkedin || "N/A"}

---

## Executive Summary
${student.bio}

---

## Technical Skills
${student.skills?.map((cat) => `- **${cat.name}**: ${cat.skills.join(", ")}`).join("\n") || "N/A"}

---

## Verified Engineering Projects
${student.projects?.map((p) => `### ${p.title}
*${p.tagline}*
- Category: ${p.category}
- Impact: ${p.description}
- Validated Metrics: ${p.metrics || "Production benchmarks verified"}
- Stack & Tools: ${p.tags.join(", ")}
${p.githubUrl ? `- Repository: ${p.githubUrl}` : ""}
${p.liveUrl ? `- Live Deployment: ${p.liveUrl}` : ""}
`).join("\n") || "N/A"}

---

## Professional & Research Experience
${student.experiences?.map((exp) => `### ${exp.role} — ${exp.company}
*${exp.period} | ${exp.location}*
${exp.bullets.map((b) => `- ${b}`).join("\n")}
- Applied Skills: ${exp.skills.join(", ")}
`).join("\n") || "N/A"}

---

## Education & Honors
- **${student.university}**: ${student.degree} (${student.gradYear})
- GPA: ${student.gpa}
- Honors: ${student.education?.[0]?.honors?.join(", ") || "Dean's Honors List"}
- Relevant Coursework: ${student.education?.[0]?.courses?.join(", ") || "Distributed Systems, Operating Systems, Cloud Computing, Database Engineering"}

---
*Generated via CloudFolio — https://cloudfolio.dev/@${student.username}*
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.username}-ats-resume.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (confirm("Restore all portfolio settings to the standard UC Berkeley engineering template defaults?")) {
      const defaultTemplateSettings: PortfolioSettings = {
        enableTerminal: true,
        enableStoryMode: true,
        enableArchitectureSim: true,
        enableLandmarkPRs: true,
        enableSkillGraph: true,
        enableResumeDownload: true,
        enableContactForm: true,
        portfolioVisibility: "public",
        accessCode: "berkeley2026",
        requireRecruiterCompany: true,
        notifyOnView: false,
        notifyOnResumeDownload: true,
        allowSearchIndexing: true,
        customDomain: "",
      };
      setSettings(defaultTemplateSettings);
      setCustomDomain("");
      setDomainStatus("idle");
      onUpdate({
        ...student,
        settings: defaultTemplateSettings,
      });
      onSaveToast();
    }
  };

  const isSitePaused = settings.portfolioVisibility === "private";
  const handleTogglePause = () => {
    const nextVis = isSitePaused ? "public" : "private";
    handleVisibilityChange(nextVis);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-white" />
            <h2 className="text-xl font-geometric font-extrabold text-white">
              Portfolio Control Center & Settings
            </h2>
          </div>
          <p className="text-xs font-body text-zinc-400 max-w-xl">
            Configure all public portfolio features, candidate evaluation tools, access permissions, and notifications in one unified place.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/portfolio/${student.username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-geometric font-bold text-xs border border-zinc-700 transition-all"
          >
            <span>View Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-geometric font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Saved & Deployed</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-black" />
                <span>Deploy Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE PLATFORM INNOVATIONS & FEATURE TOGGLES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-geometric font-extrabold text-slate-950">
            Interactive Candidate Features & Display
          </h3>
          <p className="text-xs font-body text-slate-500 mt-0.5">
            Turn features on or off on your live portfolio. Changes take effect immediately upon deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Feature 1: Developer CLI Terminal */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-geometric font-bold text-xs text-slate-950">
                    Developer CLI Terminal (`cloudfolio-sh`)
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    ` / ~
                  </span>
                </div>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Shows the expanding terminal dock button on your portfolio, allowing engineering leads to inspect projects via shell commands.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableTerminal}
              onClick={() => handleToggle("enableTerminal")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableTerminal ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableTerminal ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 2: 60-Second Story Mode */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  Recruiter 60-Second Story Mode
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  4-slide rapid keyboard walkthrough ([Space] / [→]) for fast hiring manager skimming and 1-click scheduling.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableStoryMode}
              onClick={() => handleToggle("enableStoryMode")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableStoryMode ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableStoryMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 3: Interactive System Architecture */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  System Architecture & Traffic Simulator
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Interactive multi-node topology with trade-off rationales, latency benchmarks, and animated live packet flow.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableArchitectureSim}
              onClick={() => handleToggle("enableArchitectureSim")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableArchitectureSim ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableArchitectureSim ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 4: Landmark Pull Requests */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <GitPullRequest className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  Milestone PRs & Code Diff Forensics
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Showcase milestone pull requests with side-by-side monochrome before and after code diffs.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableLandmarkPRs}
              onClick={() => handleToggle("enableLandmarkPRs")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableLandmarkPRs ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableLandmarkPRs ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 5: Evidence-Linked Skill Context Graph */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  Evidence-Linked Skill Context Graph
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Connect each technical skill directly to production projects, internships, and university coursework.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableSkillGraph}
              onClick={() => handleToggle("enableSkillGraph")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableSkillGraph ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableSkillGraph ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 6: 1-Click ATS Resume PDF Generator */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  1-Click ATS Resume PDF Generator
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Allows recruiters to download a clean, single-page vector ATS resume synchronized with your profile.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableResumeDownload}
              onClick={() => handleToggle("enableResumeDownload")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableResumeDownload ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableResumeDownload ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Feature 7: Recruiter Contact & Inquiry Form */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  Direct Recruiter Inquiry & Interview Booking Form
                </h4>
                <p className="text-[11px] font-body text-slate-600 leading-relaxed">
                  Enables hiring managers and engineering leads to send interview invites directly to your verified inbox.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableContactForm}
              onClick={() => handleToggle("enableContactForm")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableContactForm ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enableContactForm ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* SECTION 2: ACCESS CONTROL, PRIVACY & VISIBILITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-geometric font-extrabold text-slate-950">
            Access Control, Security & Privacy
          </h3>
          <p className="text-xs font-body text-slate-500 mt-0.5">
            Manage who can view your portfolio, indexing rules, and recruiter verification requirements.
          </p>
        </div>

        {/* Visibility Selector */}
        <div className="space-y-3">
          <label className="text-xs font-geometric font-bold text-slate-900 block">
            Portfolio Access Level
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Public */}
            <div
              onClick={() => handleVisibilityChange("public")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.portfolioVisibility === "public"
                  ? "border-zinc-950 bg-slate-50/80 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-4 h-4 text-slate-900" />
                {settings.portfolioVisibility === "public" && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Public Directory
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-1 leading-normal">
                Discoverable in candidate searches, university showcases, and indexable by search engines.
              </p>
            </div>

            {/* Unlisted */}
            <div
              onClick={() => handleVisibilityChange("unlisted")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.portfolioVisibility === "unlisted"
                  ? "border-zinc-950 bg-slate-50/80 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4 text-slate-900" />
                {settings.portfolioVisibility === "unlisted" && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Unlisted (Link Only)
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-1 leading-normal">
                Only people with your direct URL can access. Hidden from public directory listings.
              </p>
            </div>

            {/* Private */}
            <div
              onClick={() => handleVisibilityChange("private")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.portfolioVisibility === "private"
                  ? "border-zinc-950 bg-slate-50/80 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Lock className="w-4 h-4 text-slate-900" />
                {settings.portfolioVisibility === "private" && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Private Passcode
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-1 leading-normal">
                Requires visitors to provide a candidate access passcode before viewing projects.
              </p>
            </div>

          </div>
        </div>

        {/* Private Passcode input if private */}
        {settings.portfolioVisibility === "private" && (
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-zinc-900" />
              <label className="text-xs font-geometric font-bold text-zinc-950">
                Candidate Access Passcode
              </label>
            </div>
            <div className="flex items-center gap-3 max-w-sm">
              <input
                type="text"
                value={settings.accessCode || ""}
                onChange={(e) => {
                  const updatedSettings = { ...settings, accessCode: e.target.value };
                  setSettings(updatedSettings);
                  onUpdate({ ...student, settings: updatedSettings });
                }}
                placeholder="Enter passcode..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <p className="text-[11px] text-zinc-600 font-body">
              Share this passcode with recruiters or hiring managers when sending them your portfolio link.
            </p>
          </div>
        )}

        {/* Additional Privacy Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Require Verified Company Info
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-0.5">
                Recruiters must provide their organization and work email.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.requireRecruiterCompany}
              onClick={() => handleToggle("requireRecruiterCompany")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.requireRecruiterCompany ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.requireRecruiterCompany ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Search Engine Indexing (SEO)
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-0.5">
                Allow Google and Bing to index your candidate portfolio.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.allowSearchIndexing}
              onClick={() => handleToggle("allowSearchIndexing")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.allowSearchIndexing ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.allowSearchIndexing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>

      </div>

      {/* SECTION 3: NOTIFICATIONS & ALERTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-geometric font-extrabold text-slate-950">
            Real-Time Notifications & Email Alerts
          </h3>
          <p className="text-xs font-body text-slate-500 mt-0.5">
            Decide when CloudFolio should notify your verified email ({student.email}).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Alert on Resume PDF Downloads
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-0.5">
                Get an instant email ping when a recruiter downloads your ATS resume.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyOnResumeDownload}
              onClick={() => handleToggle("notifyOnResumeDownload")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.notifyOnResumeDownload ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.notifyOnResumeDownload ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-geometric font-bold text-xs text-slate-950">
                Alert on Profile Views
              </h4>
              <p className="text-[11px] font-body text-slate-500 mt-0.5">
                Receive notifications when recruiters visit your candidate profile.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifyOnView}
              onClick={() => handleToggle("notifyOnView")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.notifyOnView ? "bg-zinc-950" : "bg-zinc-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.notifyOnView ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* SECTION 4: DOMAIN, ROUTING & DATA CONTROLS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Card Header */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-900" />
              <h3 className="text-lg font-geometric font-extrabold text-slate-950">
                Domain, Handle & Backup Data
              </h3>
            </div>
            <p className="text-xs font-body text-slate-500 mt-1">
              Configure edge CDN delivery, manage custom domains, reserve permalinks, and export data archives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Edge CDN: Online (300+ PoPs)
            </span>
          </div>
        </div>

        {/* TIER 1: DOMAIN & ROUTING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Default Primary Subdomain */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Primary Routing Subdomain
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-slate-900" /> TLS 1.3 Active
                </span>
              </div>
              <p className="mt-2 text-sm font-mono font-bold text-slate-900 break-all select-all">
                https://cloudfolio.dev/@{student.username}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-body">
                Managed automatically with instantaneous worldwide TLS certificate renewal and HTTP/3 edge acceleration.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <button
                type="button"
                onClick={handleCopyPublicUrl}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied Link</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
              <Link
                href={`/@${student.username}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                <span>Visit Live</span>
              </Link>
            </div>
          </div>

          {/* Custom Apex / CNAME Domain */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Custom Domain Mapping
                </span>
                {domainStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-black" /> Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">
                    CNAME or Apex A Record
                  </span>
                )}
              </div>
              
              <div className="mt-3 flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:ring-2 focus-within:ring-black">
                <span className="pl-3 text-xs font-mono text-slate-400 select-none">
                  https://
                </span>
                <input
                  type="text"
                  placeholder="alex-chen.dev or portfolio.domain.com"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    if (domainStatus === "verified") setDomainStatus("idle");
                  }}
                  className="w-full px-2 py-1.5 bg-transparent font-mono text-xs font-semibold text-slate-950 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                <span>DNS Target: <strong className="text-slate-900">cname.cloudfolio.dev</strong></span>
                <span className="text-slate-400">TTL 300</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleVerifyDomain}
                disabled={!customDomain.trim() || domainStatus === "verifying"}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-geometric font-bold transition-all cursor-pointer ${
                  domainStatus === "verified"
                    ? "bg-slate-100 text-slate-900 border border-slate-300"
                    : domainStatus === "verifying"
                    ? "bg-slate-100 text-slate-400 cursor-wait"
                    : "bg-slate-950 hover:bg-slate-800 text-white"
                }`}
              >
                {domainStatus === "verifying" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying DNS...</span>
                  </>
                ) : domainStatus === "verified" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Active & Verified</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Verify & Link Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* TIER 2: HANDLE MANAGEMENT & CAREER FAIR QUICK SHARE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Handle Reservation */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  CloudFolio Handle Reservation
                </h4>
                <span className="text-[11px] font-mono text-slate-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-black" /> Available & Linked
                </span>
              </div>
              <p className="text-[11px] font-body text-slate-500 mt-1">
                Your unique permalink identifier across recruiter search, CLI terminal commands, and portfolio exports.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:ring-2 focus-within:ring-black">
                <span className="pl-3 text-xs font-mono text-slate-400 select-none">
                  cloudfolio.dev/@
                </span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-2 py-1.5 bg-transparent font-mono text-xs font-bold text-slate-950 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-geometric font-bold transition-colors cursor-pointer shrink-0"
              >
                Update Handle
              </button>
            </div>
          </div>

          {/* Career Fair Quick Share */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-geometric font-bold text-xs text-slate-950">
                  Career Fair Quick Share & QR
                </h4>
                <span className="text-[11px] font-mono text-slate-500">
                  Recruiter Outreach
                </span>
              </div>
              <p className="text-[11px] font-body text-slate-500 mt-1">
                Generate tracking links for career fair booths, on-site recruiter handshakes, or resume QR stickers.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleCopyRecruiterUrl}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                {copiedRecruiterLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied Recruiter Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Fair Link (?ref=career-fair)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(!showQrModal)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-700" />
                <span>{showQrModal ? "Hide QR" : "View QR"}</span>
              </button>
            </div>

            {showQrModal && (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="mx-auto w-32 h-32 bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <p className="text-[11px] font-mono text-slate-500">
                  Scan to open https://cloudfolio.dev/@{student.username}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TIER 3: DATA PORTABILITY & CACHE SYNC */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-geometric font-bold text-xs uppercase tracking-wider text-slate-400">
              Data Portability & CDN Sync
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Zero Lock-in | GDPR & Portability Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export JSON */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h5 className="font-geometric font-bold text-xs text-slate-950 mt-2.5">
                  Portfolio Database JSON
                </h5>
                <p className="text-[11px] font-body text-slate-500 mt-0.5">
                  Full raw export of all project nodes, PR diffs, system benchmarks, and recruiter settings.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export JSON Data</span>
              </button>
            </div>

            {/* Export ATS Markdown */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  <FileText className="w-4 h-4" />
                </div>
                <h5 className="font-geometric font-bold text-xs text-slate-950 mt-2.5">
                  ATS Resume Markdown (.md)
                </h5>
                <p className="text-[11px] font-body text-slate-500 mt-0.5">
                  Formatted Markdown text file with your education, skills, and projects ready for ATS submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Download Resume .md</span>
              </button>
            </div>

            {/* Edge CDN Cache Purge */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                  <Server className="w-4 h-4" />
                </div>
                <h5 className="font-geometric font-bold text-xs text-slate-950 mt-2.5">
                  Instant CDN Cache Purge
                </h5>
                <p className="text-[11px] font-body text-slate-500 mt-0.5">
                  Flush cached assets across worldwide edge servers to immediately reflect live updates.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePurgeCache}
                disabled={purgingCache}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-xs font-geometric font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${purgingCache ? "animate-spin" : ""}`} />
                <span>{purgingCache ? "Purging Edge POPs..." : "Purge Edge Cache"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 4: MAINTENANCE & DANGER ZONE */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-4 sm:p-5 rounded-2xl border border-rose-100 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-geometric font-bold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Portfolio Maintenance & Safety Controls</span>
              </div>
              <p className="text-[11px] font-body text-slate-500">
                Pause your live public URL temporarily for updates, or restore standard UC Berkeley template presets.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleTogglePause}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-geometric font-bold transition-colors cursor-pointer border ${
                  isSitePaused
                    ? "bg-zinc-900 text-white border-zinc-950 hover:bg-zinc-800"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isSitePaused ? "Portfolio is Paused (Resume)" : "Pause Public Portfolio"}
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3.5 py-1.5 rounded-xl text-xs font-geometric font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                Reset Template
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

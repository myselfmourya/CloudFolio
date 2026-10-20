"use client";

import React, { useState, useEffect } from "react";
import { StudentProfile, VoiceNote } from "@/lib/types";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  FileText, 
  Mail, 
  Download, 
  ExternalLink,
  Layers,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import AudioVoiceNotePlayer from "./AudioVoiceNotePlayer";

interface StoryModeModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export default function StoryModeModal({
  student,
  isOpen,
  onClose,
  onOpenResume,
  onOpenContact
}: StoryModeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>("default");
  const [personalizingPitch, setPersonalizingPitch] = useState<boolean>(false);
  const [customVoiceNote, setCustomVoiceNote] = useState<VoiceNote | null>(null);
  const totalSlides = 4;

  const handleSelectRole = async (key: string, roleName: string, company: string) => {
    setSelectedRole(key);
    if (key === "default" || !student) {
      setCustomVoiceNote(null);
      return;
    }

    setPersonalizingPitch(true);
    try {
      const res = await fetch("/api/ai/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: student.username,
          targetRole: roleName,
          targetCompany: company
        })
      });
      const data = await res.json();
      if (res.ok && data.pitch) {
        setCustomVoiceNote({
          id: `custom-pitch-${Date.now()}`,
          title: data.title || `${company} Targeted Audio Walkthrough`,
          topic: `Tailored for ${roleName}`,
          duration: "0:45",
          durationSeconds: 45,
          audioUrl: student.voiceNote?.audioUrl,
          transcript: data.pitch,
          keyTakeaway: data.keyTakeaway || "Targeted systems engineering impact"
        });
      }
    } catch (e) {
      console.warn("Failed to generate role pitch", e);
    } finally {
      setPersonalizingPitch(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const flagshipProject = student.projects[0];
  const flagshipExperience = student.experiences[0];

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#a1a1aa", "#18181b"]
      });
      onClose();
    }
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      
      {/* Container */}
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between max-h-[92vh] overflow-y-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Progress Bar & Exit */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Recruiter 60-Second Story Mode
              </span>
              <span className="text-xs font-mono text-zinc-500">
                ({currentSlide + 1} of {totalSlides})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close Story Mode (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 mb-8">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                onClick={() => setCurrentSlide(step)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  step <= currentSlide ? "bg-white" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Slide Content */}
        <div className="my-auto py-2">
          
          {/* SLIDE 1: Candidate Identity & Academics */}
          {currentSlide === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-4">
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-geometric font-extrabold text-white">
                      {student.fullName}
                    </h2>
                    {student.verifiedStudent && (
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700">
                        ✓ Verified .edu
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-body text-zinc-400">
                    {student.headline}
                  </p>
                  <p className="text-xs font-mono text-zinc-500">
                    {student.location}
                  </p>
                </div>
              </div>

              {/* Education Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-geometric font-bold text-white text-sm">
                    <GraduationCap className="w-4 h-4 text-zinc-300" />
                    <span>{student.university}</span>
                  </div>
                  <span className="font-mono text-xs text-white font-bold">
                    GPA {student.gpa}
                  </span>
                </div>
                <p className="text-xs font-body text-zinc-400">
                  {student.degree} • Graduating {student.gradYear}
                </p>
                {student.education[0]?.honors && (
                  <p className="text-[11px] font-body text-zinc-500 pt-1 border-t border-zinc-800">
                    Honors: {student.education[0].honors.slice(0, 2).join(" • ")}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm font-body text-zinc-300 leading-relaxed">
                {student.bio}
              </p>
            </div>
          )}

          {/* SLIDE 2: Flagship Engineering Project */}
          {currentSlide === 1 && flagshipProject && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Flagship Case Study
                </span>
                <h3 className="text-2xl sm:text-3xl font-geometric font-extrabold text-white">
                  {flagshipProject.title}
                </h3>
                <p className="text-xs sm:text-sm font-body text-zinc-400">
                  {flagshipProject.tagline}
                </p>
              </div>

              {/* Metric Callout */}
              {flagshipProject.metrics && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">Validated Production Metric</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-white bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                    ⚡ {flagshipProject.metrics}
                  </span>
                </div>
              )}

              <p className="text-xs sm:text-sm font-body text-zinc-300 leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                {flagshipProject.description}
              </p>

              {/* Gemini AI Role-Targeted Focus Bar */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <Sparkles className="w-3 h-3 text-white" />
                    Gemini Role-Targeted Pitch:
                  </span>
                  {personalizingPitch && (
                    <span className="text-zinc-400 animate-pulse text-[10.5px]">
                      Generating tailored pitch via Gemini...
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "default", label: "Default Pitch", company: "Top Tech", role: "Systems Engineer" },
                    { key: "google", label: "Google (Storage/Dist)", company: "Google Cloud", role: "Distributed Storage SWE" },
                    { key: "stripe", label: "Stripe (Infra/Reliability)", company: "Stripe", role: "Infrastructure & Platform Engineer" },
                    { key: "quant", label: "Low-Latency / Quant", company: "Jane Street", role: "Low-Latency Systems Developer" },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      disabled={personalizingPitch}
                      onClick={() => handleSelectRole(r.key, r.role, r.company)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedRole === r.key
                          ? "bg-white text-zinc-950 font-bold shadow-xs scale-102"
                          : "bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Audio Walkthrough Memo */}
              {(customVoiceNote || student.voiceNote) && (
                <div className="pt-1">
                  <AudioVoiceNotePlayer 
                    voiceNote={customVoiceNote || student.voiceNote} 
                    candidateName={student.fullName}
                    compact={true}
                    dark={true}
                  />
                </div>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5">
                {flagshipProject.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: Landmark Work Experience */}
          {currentSlide === 2 && flagshipExperience && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Industry & Production Experience
                </span>
                <h3 className="text-2xl sm:text-3xl font-geometric font-extrabold text-white">
                  {flagshipExperience.role}
                </h3>
                <p className="text-sm font-geometric text-zinc-300 font-semibold">
                  {flagshipExperience.company} • {flagshipExperience.location} ({flagshipExperience.period})
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-2.5">
                {flagshipExperience.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Stack Used */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono text-zinc-500">Stack:</span>
                {flagshipExperience.skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 4: Recruiter Action & Booking */}
          {currentSlide === 3 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-white text-zinc-950 flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl font-geometric font-extrabold text-white">
                  Ready to connect with {student.fullName.split(" ")[0]}?
                </h3>
                <p className="text-xs sm:text-sm font-body text-zinc-400 leading-relaxed">
                  Candidate status: <strong className="text-white font-mono">{student.status}</strong>. Export their verified resume or send an interview note directly to their verified dashboard.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenResume();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-geometric font-bold text-xs border border-zinc-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ATS Resume PDF</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-geometric font-bold text-xs shadow-xl transition-all hover:scale-102 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Recruiter Interview Note</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-geometric font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Press [Space] or [Arrow Right] to advance
          </span>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-geometric font-bold transition-all shadow-md cursor-pointer hover:scale-102"
          >
            <span>{currentSlide === totalSlides - 1 ? "Finish Story" : "Next Slide"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

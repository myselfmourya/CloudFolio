"use client";

import React, { useState } from "react";
import { StudentProfile } from "@/lib/types";
import { 
  Sparkles, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Layers
} from "lucide-react";

interface SkillContextGraphProps {
  student: StudentProfile;
  onSelectProject?: (slug: string) => void;
}

export default function SkillContextGraph({ student, onSelectProject }: SkillContextGraphProps) {
  // Default to first skill of first category
  const initialSkill = student.skills[0]?.skills[0] || "Rust";
  const [activeSkill, setActiveSkill] = useState<string>(initialSkill);

  // Find linked projects for activeSkill
  const linkedProjects = student.projects.filter((p) =>
    p.tags.some((t) => t.toLowerCase().includes(activeSkill.toLowerCase()) || activeSkill.toLowerCase().includes(t.toLowerCase()))
  );

  // Find linked experiences
  const linkedExperiences = student.experiences.filter((e) =>
    e.skills.some((s) => s.toLowerCase().includes(activeSkill.toLowerCase()) || activeSkill.toLowerCase().includes(s.toLowerCase())) ||
    e.bullets.some((b) => b.toLowerCase().includes(activeSkill.toLowerCase()))
  );

  // Find linked coursework
  const linkedCourses = student.education.flatMap((edu) =>
    edu.courses.filter((c) => {
      const lowerSkill = activeSkill.toLowerCase();
      if (lowerSkill.includes("rust") || lowerSkill.includes("c ") || lowerSkill.includes("system")) {
        return c.includes("Operating Systems") || c.includes("Programming");
      }
      if (lowerSkill.includes("ai") || lowerSkill.includes("pytorch") || lowerSkill.includes("data")) {
        return c.includes("Machine Learning") || c.includes("Probability");
      }
      if (lowerSkill.includes("cloud") || lowerSkill.includes("network") || lowerSkill.includes("grpc")) {
        return c.includes("Internet") || c.includes("Algorithms");
      }
      return false;
    })
  );

  return (
    <div className="space-y-6">
      
      {/* Top Explanation Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
            Evidence-Linked Technical Competencies
          </span>
          <p className="text-xs sm:text-sm font-geometric font-bold text-slate-900 mt-0.5">
            Click any skill to reveal verified projects, production experiences, and academic coursework
          </p>
        </div>
        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs self-start sm:self-auto">
          Active: <strong className="text-zinc-950 font-bold">{activeSkill}</strong>
        </span>
      </div>

      {/* Categorized Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {student.skills.map((category, catIdx) => (
          <div
            key={catIdx}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
          >
            <h4 className="font-geometric font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              {category.name}
            </h4>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIdx) => {
                const isActive = activeSkill === skill;
                return (
                  <button
                    key={sIdx}
                    onClick={() => setActiveSkill(skill)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-geometric font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-zinc-950 text-white shadow-xs scale-102"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-black border border-slate-200"
                    }`}
                  >
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* EVIDENCE & APPLIED CONTEXT PANEL */}
      <div className="p-6 sm:p-7 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-5 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h4 className="font-geometric font-extrabold text-base sm:text-lg text-white">
              Applied Proof of Work: <span className="underline decoration-zinc-500">{activeSkill}</span>
            </h4>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {linkedProjects.length} Projects • {linkedExperiences.length} Roles • {linkedCourses.length} Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: Associated Projects */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-geometric font-bold text-xs uppercase tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5 text-zinc-300" />
              <span>Projects ({linkedProjects.length})</span>
            </div>

            {linkedProjects.length > 0 ? (
              <div className="space-y-2">
                {linkedProjects.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-xs font-bold text-white block">{p.title}</span>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{p.tagline}</p>
                    {p.metrics && (
                      <span className="text-[10px] font-mono text-zinc-300 block pt-1">
                        ⚡ {p.metrics}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic p-3">
                Used across coursework labs and auxiliary scripts.
              </p>
            )}
          </div>

          {/* Column 2: Associated Work & Research */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-geometric font-bold text-xs uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-zinc-300" />
              <span>Industry Experience ({linkedExperiences.length})</span>
            </div>

            {linkedExperiences.length > 0 ? (
              <div className="space-y-2">
                {linkedExperiences.map((e) => (
                  <div key={e.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-xs font-bold text-white block">{e.role}</span>
                    <span className="text-[11px] font-mono text-zinc-400 block">{e.company} • {e.period}</span>
                    <p className="text-[10.5px] text-zinc-300 line-clamp-2 pt-1">{e.bullets[0]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic p-3">
                Self-directed research and open-source contributions.
              </p>
            )}
          </div>

          {/* Column 3: University Coursework */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-geometric font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-300" />
              <span>Rigorous Coursework</span>
            </div>

            {linkedCourses.length > 0 ? (
              <div className="space-y-2">
                {linkedCourses.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                    <span className="text-xs font-mono text-zinc-200 block">{c}</span>
                    <span className="text-[10.5px] text-zinc-500 block mt-0.5">UC Berkeley EECS Curriculum</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-xs font-mono text-zinc-300 block">
                  {student.education[0]?.degree}
                </span>
                <span className="text-[10.5px] text-zinc-500 block mt-0.5">Core Computer Science & Engineering</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

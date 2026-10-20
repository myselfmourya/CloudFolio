"use client";

import { StudentProfile } from "@/lib/types";
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

interface ResumePDFModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumePDFModal({ student, isOpen, onClose }: ResumePDFModalProps) {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in print:p-0 print:bg-white print:static">
      
      {/* Non-print control bar */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 print:border-none print:shadow-none print:p-0 print:max-h-none print:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Bar for Modal (hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-geometric font-bold text-slate-950 text-sm">
                  Single-Page ATS Resume Export
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black text-white font-bold">
                  ATS Ready
                </span>
              </div>
              <p className="text-[11px] font-body text-slate-500">
                Synchronized with your live portfolio experience and project data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-geometric font-bold text-xs shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Printable ATS-Compliant Resume Sheet */}
        <div id="printable-resume" className="max-w-[780px] mx-auto bg-white text-slate-900 p-6 sm:p-10 font-sans space-y-6 print:p-0 print:max-w-none">
          
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-300 space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-950 font-geometric">
              {student.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-700">
              {student.headline}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1 font-mono">
              <span>{student.email}</span>
              <span>•</span>
              <span>{student.location}</span>
              {student.socials.website && (
                <>
                  <span>•</span>
                  <span>{student.socials.website.replace("https://", "")}</span>
                </>
              )}
              <span>•</span>
              <span className="text-slate-900 font-bold">cloudfolio.dev/@{student.username}</span>
            </div>
          </div>

          {/* Education */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 border-slate-900 font-geometric">
              Education
            </h2>
            {student.education.map((edu) => (
              <div key={edu.id} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="font-mono">{edu.period}</span>
                </div>
                <div className="flex justify-between text-slate-700 italic">
                  <span>{edu.degree}</span>
                  <span className="font-semibold font-mono not-italic text-slate-900">GPA: {edu.gpa}</span>
                </div>
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">Honors:</strong> {edu.honors.join(" • ")}
                  </p>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <p className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">Key Coursework:</strong> {edu.courses.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Work & Research Experience */}
          <section className="space-y-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 border-slate-900 font-geometric">
              Experience & Research
            </h2>
            {student.experiences.map((exp) => (
              <div key={exp.id} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.role}</span>
                  <span className="font-mono text-slate-600 font-normal">{exp.period}</span>
                </div>
                <div className="flex justify-between text-slate-700 italic text-[11.5px]">
                  <span>{exp.company}</span>
                  <span className="not-italic text-slate-500">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 leading-normal text-[11px]">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Featured Technical Projects */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 border-slate-900 font-geometric">
              Featured Technical Projects
            </h2>
            {student.projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900">
                    <span>{proj.title}</span>
                    <span className="font-normal font-mono text-[11px] text-slate-500 ml-2">
                      | {proj.tags.join(", ")}
                    </span>
                  </div>
                  {proj.completionDate && (
                    <span className="font-mono text-slate-500 text-[10.5px]">
                      {proj.completionDate}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 leading-normal">
                  {proj.description}
                </p>
                {proj.metrics && (
                  <p className="text-[10.5px] font-semibold text-slate-900 font-mono">
                    Impact: {proj.metrics}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Technical Skills */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 border-slate-900 font-geometric">
              Technical Skills & Certifications
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {student.skills.map((cat, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-bold text-slate-900 shrink-0 w-36">
                    {cat.name}:
                  </span>
                  <span>{cat.skills.join(", ")}</span>
                </div>
              ))}
              {student.certifications && student.certifications.length > 0 && (
                <div className="flex gap-2 pt-0.5">
                  <span className="font-bold text-slate-900 shrink-0 w-36">
                    Certifications:
                  </span>
                  <span>
                    {student.certifications.map((c) => `${c.title} (${c.issuer})`).join(" • ")}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Resume Footer (Print watermark) */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Portfolio & Interactive Projects: cloudfolio.dev/@{student.username}</span>
            <span>Generated on CloudFolio</span>
          </div>

        </div>

      </div>
    </div>
  );
}

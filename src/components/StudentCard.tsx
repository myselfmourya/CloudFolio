"use client";

import Link from "next/link";
import { StudentProfile } from "@/lib/types";
import { CheckCircle2, GraduationCap, MapPin, ArrowRight, ExternalLink, FolderGit2, Bookmark } from "lucide-react";

interface StudentCardProps {
  student: StudentProfile;
  onQuickView?: (student: StudentProfile) => void;
  isShortlisted?: boolean;
  onToggleShortlist?: (student: StudentProfile) => void;
}

export default function StudentCard({ 
  student, 
  isShortlisted = false,
  onToggleShortlist 
}: StudentCardProps) {
  return (
    <div className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header: Avatar, Name, Verification */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-black transition-colors shadow-2xs"
              />
              {student.verifiedStudent && (
                <div 
                  title="Cloud Verified Student"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center border-2 border-white shadow-xs text-[10px]"
                >
                  ✓
                </div>
              )}
            </div>

            <div>
              <h3 className="font-geometric font-extrabold text-base text-slate-950 group-hover:text-black transition-colors">
                {student.fullName}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                @{student.username}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200">
              {student.status.includes("Internship")
                ? "Seeking Intern"
                : student.status.includes("Full-Time")
                ? "Full-Time Roles"
                : "Research Fellow"}
            </span>

            {onToggleShortlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleShortlist(student);
                }}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isShortlisted
                    ? "bg-zinc-950 border-zinc-950 text-white shadow-xs scale-105"
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300"
                }`}
                title={isShortlisted ? "Remove from candidate shortlist" : "Pin to candidate shortlist"}
                aria-label="Toggle candidate shortlist"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? "fill-white" : ""}`} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Headline */}
        <p className="mt-4 text-xs sm:text-sm font-geometric font-semibold text-slate-800 leading-snug">
          {student.headline}
        </p>

        {/* University & Location */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-body">
          <span className="flex items-center gap-1.5 font-medium text-slate-800">
            <GraduationCap className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.5} />
            {student.university} ({student.gpa})
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
            {student.location}
          </span>
        </div>

        {/* Featured Projects Count */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <FolderGit2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
          <span className="text-xs font-mono text-slate-600">
            <strong>{student.projects.length}</strong> Featured Projects
          </span>
        </div>
      </div>

      {/* Card Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          Graduating {student.gradYear}
        </span>

        <Link
          href={`/portfolio/${student.username}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-geometric font-bold transition-all hover:scale-103"
        >
          <span>View Portfolio</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

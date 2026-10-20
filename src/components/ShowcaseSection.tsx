"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllStudents } from "@/lib/portfolio-store";
import { StudentProfile, StudentCategory } from "@/lib/types";
import StudentCard from "./StudentCard";
import { Search, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import RecruiterShortlistDrawer from "./RecruiterShortlistDrawer";
import CandidateComparisonModal from "./CandidateComparisonModal";

const CATEGORIES: StudentCategory[] = [
  "All",
  "Computer Science & AI",
  "Product Design & UI/UX",
  "Data Science & Analytics",
  "Biotech & Robotics"
];

export default function ShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<StudentCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentProfile[]>(getAllStudents());
  const [shortlistedStudents, setShortlistedStudents] = useState<StudentProfile[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiClient.students.list().then((res) => {
      if (isMounted && res && res.length > 0) {
        setStudents(res);
      }
    }).catch(console.warn);

    try {
      const saved = localStorage.getItem("cloudfolio_recruiter_shortlist");
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const initialStudents = getAllStudents().filter((s) => ids.includes(s.id));
        setShortlistedStudents(initialStudents);
      }
    } catch (e) {
      console.warn("Could not load shortlist from localStorage", e);
    }

    return () => { isMounted = false; };
  }, []);

  const handleToggleShortlist = (student: StudentProfile) => {
    setShortlistedStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      const updated = exists 
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student];
      try {
        localStorage.setItem("cloudfolio_recruiter_shortlist", JSON.stringify(updated.map(s => s.id)));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleRemoveShortlist = (id: string) => {
    setShortlistedStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem("cloudfolio_recruiter_shortlist", JSON.stringify(updated.map(s => s.id)));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleClearShortlist = () => {
    setShortlistedStudents([]);
    try {
      localStorage.removeItem("cloudfolio_recruiter_shortlist");
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesCategory =
        selectedCategory === "All" || student.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.fullName.toLowerCase().includes(q) ||
        student.university.toLowerCase().includes(q) ||
        student.headline.toLowerCase().includes(q) ||
        student.skills.some((cat) =>
          cat.skills.some((s) => s.toLowerCase().includes(q))
        );
      return matchesCategory && matchesSearch;
    });
  }, [students, selectedCategory, searchQuery]);

  return (
    <section id="showcase" className="py-24 relative bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-900 text-xs font-geometric font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-slate-900" strokeWidth={1.5} />
              <span>Student Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric font-extrabold text-slate-950 tracking-tight">
              Explore Live Student Portfolios
            </h2>
            <p className="text-sm sm:text-base font-body text-slate-600 leading-relaxed">
              Discover engineering capstones, research publications, and award-winning designs from top university students actively seeking internships and full-time roles.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-geometric font-bold text-xs shadow-md transition-all shrink-0 hover:scale-102"
          >
            <span>Publish Your Portfolio</span>
            <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-geometric font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-950 text-white shadow-sm border border-black"
                    : "bg-white text-slate-600 hover:text-black border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search university, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              isShortlisted={shortlistedStudents.some((s) => s.id === student.id)}
              onToggleShortlist={handleToggleShortlist}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <p className="text-slate-500 font-medium text-sm">
              No student profiles found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-geometric font-bold bg-slate-950 text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Recruiter Shortlist Floating Drawer */}
      <RecruiterShortlistDrawer
        shortlistedStudents={shortlistedStudents}
        onRemoveStudent={handleRemoveShortlist}
        onClearAll={handleClearShortlist}
        onOpenComparison={() => setComparisonModalOpen(true)}
      />

      {/* Side-by-Side Candidate Comparison Modal */}
      <CandidateComparisonModal
        candidates={shortlistedStudents}
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onRemoveCandidate={handleRemoveShortlist}
      />
    </section>
  );
}

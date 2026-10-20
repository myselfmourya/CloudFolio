"use client";

import React from "react";

interface MonogramProps {
  name: string;
  className?: string;
}

export function UniversityMonogram({ name, className = "" }: MonogramProps) {
  // Return unique minimalist architectural monograms in high-contrast monochrome
  switch (name.toLowerCase()) {
    case "stanford":
    case "stanford university":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-950 text-white border border-zinc-800 font-serif-display font-black text-xs select-none ${className}`}>
          S
        </span>
      );
    case "mit":
    case "massachusetts institute of technology":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-zinc-100 border border-zinc-700 font-mono font-black text-[9px] tracking-tighter select-none ${className}`}>
          MIT
        </span>
      );
    case "uc berkeley":
    case "university of california, berkeley":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-950 border border-slate-300 font-serif-display font-black text-xs select-none ${className}`}>
          Cal
        </span>
      );
    case "carnegie mellon":
    case "carnegie mellon university":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-950 text-white border border-zinc-800 font-geometric font-extrabold text-[9px] select-none ${className}`}>
          CMU
        </span>
      );
    case "caltech":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-900 border border-slate-300 font-geometric font-extrabold text-[9px] select-none ${className}`}>
          CIT
        </span>
      );
    case "harvard":
    case "harvard university":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-950 text-white border border-zinc-800 font-serif-display font-black text-xs select-none ${className}`}>
          H
        </span>
      );
    case "oxford":
    case "university of oxford":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-200 text-slate-900 border border-slate-300 font-serif-display font-black text-xs select-none ${className}`}>
          OX
        </span>
      );
    case "cambridge":
    case "university of cambridge":
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-white border border-zinc-700 font-serif-display font-black text-[10px] select-none ${className}`}>
          CAM
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-900 border border-slate-300 font-geometric font-extrabold text-[9px] select-none ${className}`}>
          {name.slice(0, 2).toUpperCase()}
        </span>
      );
  }
}

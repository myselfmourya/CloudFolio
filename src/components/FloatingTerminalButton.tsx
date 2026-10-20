"use client";

import React from "react";
import { Terminal } from "lucide-react";

interface FloatingTerminalButtonProps {
  username: string;
  isOpen?: boolean;
  onClick: () => void;
  className?: string;
}

export default function FloatingTerminalButton({
  username,
  isOpen = false,
  onClick,
  className = "bottom-6 left-6",
}: FloatingTerminalButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed ${className} z-40 group flex items-center h-11 px-3 rounded-full text-white border transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 shadow-2xl ${
        isOpen
          ? "bg-zinc-900 border-white/80 ring-2 ring-white/20"
          : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
      }`}
      title="Toggle Developer Terminal (`)"
      aria-label="Toggle Developer Terminal"
    >
      {/* Terminal Logo Icon (Always Visible) */}
      <div className="relative flex items-center justify-center shrink-0 w-5 h-5">
        <Terminal className="w-5 h-5 text-white group-hover:rotate-6 transition-transform duration-200" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </div>

      {/* Expanding Label: Only visible when hovered */}
      <div className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 ml-0 group-hover:max-w-[240px] group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out flex items-center gap-2 pointer-events-none group-hover:pointer-events-auto">
        <span className="text-xs font-mono font-bold text-zinc-200">
          ~/term: {username}-sh
        </span>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
          `
        </span>
      </div>
    </button>
  );
}

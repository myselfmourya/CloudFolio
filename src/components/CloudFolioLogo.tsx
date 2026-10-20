"use client";

import React from "react";

interface CloudFolioMarkProps {
  size?: number;
  className?: string;
  variant?: "monochrome" | "cyan";
  inverted?: boolean;
}

interface CloudFolioLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  textClassName?: string;
  taglineClassName?: string;
  layout?: "inline" | "stacked";
  variant?: "monochrome" | "cyan";
  inverted?: boolean;
}

/**
 * CloudFolio Icon Mark
 * Faithfully re-engineered vector of the cloud + digital portfolio document + circuit traces + upward arrow.
 * Supports crisp monochrome rendering (black/white) and accent cyan mode.
 */
export function CloudFolioMark({
  size = 28,
  className = "",
  variant = "monochrome",
  inverted = false
}: CloudFolioMarkProps) {
  // If inverted is true, stroke is white, else stroke is black / current text color
  const strokeColor = variant === "cyan" 
    ? "#00B4D8" 
    : inverted 
      ? "#FFFFFF" 
      : "currentColor";

  const fillColor = inverted ? "#09090B" : "#FFFFFF";

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        {/* Cloud Outline */}
        <path
          d="M 18 58 C 9 52 10 37 21 32 C 22 20 35 13 47 14 C 57 7 71 10 76 21 C 78 22 81 24 81 27 M 78 35 C 85 36 90 44 88 54 C 86 64 77 68 67 68"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-Right Upper Circuit Branch */}
        <line
          x1="72"
          y1="23"
          x2="80"
          y2="15"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle
          cx="83.5"
          cy="11.5"
          r="3.2"
          stroke={strokeColor}
          strokeWidth="2.6"
          fill={fillColor}
        />

        {/* Top-Right Lower Circuit Branch */}
        <line
          x1="78"
          y1="32"
          x2="86"
          y2="32"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle
          cx="90"
          cy="32"
          r="3.2"
          stroke={strokeColor}
          strokeWidth="2.6"
          fill={fillColor}
        />

        {/* Central Document Outline with Entry Gap */}
        <path
          d="M 34 50 V 34 C 34 30.5 36.5 28 40 28 H 55 L 66 39 V 87 C 66 90.5 63.5 93 60 93 H 40 C 36.5 93 34 90.5 34 87 V 68"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Document Fold Flap */}
        <path
          d="M 55 28 V 37 C 55 39 57 39 59 39 H 66"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Vertical Circuit Stem */}
        <line
          x1="21"
          y1="52"
          x2="21"
          y2="60"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle
          cx="21"
          cy="48"
          r="3.2"
          stroke={strokeColor}
          strokeWidth="2.6"
          fill={fillColor}
        />
        <line
          x1="21"
          y1="72"
          x2="21"
          y2="83"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle
          cx="21"
          cy="87"
          r="3.2"
          stroke={strokeColor}
          strokeWidth="2.6"
          fill={fillColor}
        />

        {/* Leftmost Circuit Node */}
        <circle
          cx="9"
          cy="74"
          r="3.2"
          stroke={strokeColor}
          strokeWidth="2.6"
          fill={fillColor}
        />

        {/* Trace Entering Document */}
        <line
          x1="12.5"
          y1="74"
          x2="16"
          y2="74"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M 16 74 L 26 66 H 38 L 47 57"
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upward Diagonal Arrow Pointer */}
        <polygon
          points="44,57 54,49 50,62"
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * CloudFolio Master Brand Logo
 * Supports inline mode (for Navbar, Headers, Toolbars) and stacked mode (for Hero, Auth, Splash).
 */
export default function CloudFolioLogo({
  className = "",
  size = 32,
  showText = true,
  showTagline = false,
  textClassName = "",
  taglineClassName = "",
  layout = "inline",
  variant = "monochrome",
  inverted = false
}: CloudFolioLogoProps) {
  if (layout === "stacked") {
    return (
      <div className={`flex flex-col items-center justify-center text-center group cursor-pointer ${className}`}>
        <CloudFolioMark 
          size={size * 1.8} 
          variant={variant} 
          inverted={inverted} 
          className="mb-3.5"
        />
        {showText && (
          <div className="flex flex-col items-center">
            <span className={`font-geometric font-extrabold text-2xl tracking-tight uppercase ${inverted ? "text-white" : "text-zinc-950"} ${textClassName}`}>
              CloudFolio
            </span>
            <span className={`font-sans text-[10px] uppercase font-semibold tracking-[0.28em] mt-1 ${inverted ? "text-zinc-400" : "text-zinc-500"} ${taglineClassName}`}>
              Student Portfolio Platform
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <CloudFolioMark 
        size={size} 
        variant={variant} 
        inverted={inverted} 
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-geometric font-extrabold text-xl tracking-tight flex items-baseline ${inverted ? "text-white" : "text-zinc-950"} ${textClassName}`}>
            Cloud<span className={`font-light ml-0.5 transition-colors ${inverted ? "text-zinc-400 group-hover:text-white" : "text-zinc-500 group-hover:text-black"}`}>Folio</span>
          </span>
          {showTagline && (
            <span className={`font-sans text-[9px] uppercase font-semibold tracking-[0.2em] -mt-0.5 ${inverted ? "text-zinc-400" : "text-zinc-500"} ${taglineClassName}`}>
              Student Portfolio Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { Project } from "@/lib/types";
import { X, ExternalLink, Layers, Sparkles, CheckCircle2, Server, Cloud } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import InteractiveArchitectureDiagram from "./InteractiveArchitectureDiagram";
import LandmarkPRViewer from "./LandmarkPRViewer";
import GeminiArchitectureAuditor from "./GeminiArchitectureAuditor";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-9 animate-in zoom-in-95 duration-200 space-y-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-900 border border-slate-200">
              {project.category}
            </span>
            {project.completionDate && (
              <span className="text-xs text-slate-500 font-mono">
                Completed {project.completionDate}
              </span>
            )}
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-950 text-white border border-zinc-800">
                <Sparkles className="w-3 h-3 text-white" />
                Featured Project
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-serif-display">
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            {project.tagline}
          </p>
        </div>

        {/* Preview Image */}
        {project.imageUrl && (
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              {project.metrics && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-xs font-mono border border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-zinc-200" />
                  <span>{project.metrics}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400 mb-2">
              Project Overview & Engineering Goals
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-body">
              {project.description}
            </p>
          </div>

          {/* INNOVATION 1: Interactive System Architecture Topology with Simulate Traffic */}
          {project.architectureNodes && project.architectureNodes.length > 0 && (
            <InteractiveArchitectureDiagram nodes={project.architectureNodes} />
          )}

          {/* Standard Architecture Fallback if no detailed nodes */}
          {(!project.architectureNodes || project.architectureNodes.length === 0) &&
            (project.architecture || (project.cloudServices && project.cloudServices.length > 0)) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-geometric font-bold text-sm">
                  <Cloud className="w-4 h-4 text-slate-900" />
                  <span>Cloud Infrastructure & Systems Design</span>
                </div>
                {project.architecture && (
                  <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-xl border border-slate-200">
                    {project.architecture}
                  </p>
                )}
                {project.cloudServices && project.cloudServices.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.cloudServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white text-[11px] font-mono font-medium text-slate-800 border border-slate-200 shadow-2xs"
                      >
                        ☁️ {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>
          )}

          {/* INNOVATION 4: Landmark Pull Requests & Code Diff Forensics */}
          {project.landmarkPRs && project.landmarkPRs.length > 0 && (
            <LandmarkPRViewer prs={project.landmarkPRs} />
          )}

          {/* GEMINI INNOVATION: Technical Architecture & Code Diff Auditor */}
          <GeminiArchitectureAuditor project={project} />

          {/* Technologies & Tags */}
          <div>
            <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Technologies & Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs font-geometric shadow-xs transition-all hover:scale-102"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs font-geometric transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Inspect Code</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

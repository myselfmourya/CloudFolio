"use client";

import { useState } from "react";
import { 
  Cloud, 
  Database, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Server, 
  Terminal, 
  CheckCircle2,
  FileCode2,
  Share2
} from "lucide-react";

interface ArchNode {
  id: string;
  title: string;
  badge: string;
  icon: any;
  shortDesc: string;
  specs: string[];
  metrics: string;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: "identity",
    title: "1. Identity & Student Verification",
    badge: "Auth & SSO",
    icon: ShieldCheck,
    shortDesc: "Secure authentication supporting GitHub, Google, and student email verification.",
    specs: [
      "OAuth 2.0 with GitHub & Google Cloud",
      "Instant university email verification (.edu, .ac.uk)",
      "Granular profile privacy and public directory controls",
      "Secure encrypted session handling"
    ],
    metrics: "OAuth 2.0 / SSO"
  },
  {
    id: "database",
    title: "2. Real-Time Document Database",
    badge: "NoSQL DB",
    icon: Database,
    shortDesc: "High-speed document persistence for project updates, experience logs, and inquiries.",
    specs: [
      "Real-time synchronized data store",
      "Instant portfolio updates upon save",
      "Structured data schemas for projects, experience, and coursework",
      "Automated backups and multi-region durability"
    ],
    metrics: "99.99% Availability"
  },
  {
    id: "storage",
    title: "3. Media Storage & PDF Engine",
    badge: "Cloud Storage",
    icon: Server,
    shortDesc: "High-resolution project asset storage and on-demand ATS resume compilation.",
    specs: [
      "Server-side headless ATS resume rendering",
      "Secure media asset storage with CDN caching",
      "Automatic image optimization and responsive delivery",
      "Direct client uploads with presigned URL tokens"
    ],
    metrics: "Vector PDF Engine"
  },
  {
    id: "edge",
    title: "4. Global Edge CDN Delivery",
    badge: "Edge Network",
    icon: Globe,
    shortDesc: "Global CDN distribution ensuring rapid page loads and automatic SSL provisioning.",
    specs: [
      "Dynamic OpenGraph preview card generation",
      "Global CDN caching for portfolio assets",
      "Automated SSL/TLS certificate renewal",
      "Instant cache invalidation on deployment"
    ],
    metrics: "Global Edge Network"
  }
];

export default function CloudArchitectureSection() {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[0]);

  return (
    <section id="architecture" className="py-24 relative overflow-hidden bg-black text-white border-b border-zinc-800">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>Infrastructure & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric font-extrabold tracking-tight text-white">
            Built on Modern Cloud Infrastructure
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-body">
            Every portfolio is backed by modern cloud infrastructure: reliable database storage, automated media optimization, and fast global edge delivery.
          </p>
        </div>

        {/* Interactive Architecture Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Node Cards Column */}
          <div className="lg:col-span-7 space-y-3.5">
            {ARCH_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer p-5 sm:p-6 rounded-2xl transition-all duration-300 border ${
                    isSelected
                      ? "bg-zinc-900 border-white shadow-xl translate-x-1"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl ${isSelected ? "bg-white text-black" : "bg-zinc-800 text-zinc-300"} shadow-sm transition-colors`}>
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-geometric font-bold text-white text-base">
                            {node.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {node.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-normal font-body">
                          {node.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block shrink-0 text-right">
                      <span className="text-[11px] font-mono text-white block font-semibold">
                        {node.metrics}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Key Metric
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Architecture Spec Inspector Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white" strokeWidth={1.5} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Component Specifications
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                OPERATIONAL
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-geometric font-extrabold text-xl text-white">
                {selectedNode.title}
              </h3>
              <p className="text-xs font-body text-zinc-400 leading-relaxed">
                {selectedNode.shortDesc}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                Technical Capabilities:
              </span>
              <div className="space-y-2">
                {selectedNode.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Target Standard:</span>
              <span className="font-bold text-white bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
                {selectedNode.metrics}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

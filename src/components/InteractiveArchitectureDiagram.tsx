"use client";

import React, { useState } from "react";
import { ArchitectureNode } from "@/lib/types";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Zap, 
  FileCode, 
  ArrowRight,
  ShieldAlert,
  Server,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Activity
} from "lucide-react";

interface InteractiveArchitectureDiagramProps {
  nodes?: ArchitectureNode[];
  defaultSelectedId?: string;
}

export default function InteractiveArchitectureDiagram({
  nodes,
  defaultSelectedId
}: InteractiveArchitectureDiagramProps) {
  if (!nodes || nodes.length === 0) return null;

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    defaultSelectedId || nodes[0].id
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Chaos Engineering State
  const [chaosActive, setChaosActive] = useState(false);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);
  const [failoverResolved, setFailoverResolved] = useState(false);
  const failedNodeIndex = 1; // Primary in-memory cache/broker node

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStepIndex(0);

    nodes.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        setSelectedNodeId(nodes[idx].id);
        if (idx === nodes.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStepIndex(null);
          }, 800);
        }
      }, (idx + 1) * 650);
    });
  };

  const handleToggleChaos = () => {
    if (chaosActive) {
      // Reset chaos
      setChaosActive(false);
      setCircuitBreakerTripped(false);
      setFailoverResolved(false);
    } else {
      // Trigger node failure simulation
      setChaosActive(true);
      setCircuitBreakerTripped(false);
      setFailoverResolved(false);

      // Select the failing node so recruiter sees it immediately
      if (nodes[failedNodeIndex]) {
        setSelectedNodeId(nodes[failedNodeIndex].id);
      }

      // Step 1: Health check timeout
      setTimeout(() => {
        setCircuitBreakerTripped(true);
      }, 450);

      // Step 2: Auto-failover resolves to read replica
      setTimeout(() => {
        setFailoverResolved(true);
      }, 1100);
    }
  };

  return (
    <div className="rounded-3xl bg-zinc-950 text-white border border-zinc-800 p-6 sm:p-7 shadow-xl space-y-6">
      
      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${chaosActive ? "bg-red-400 animate-ping" : "bg-white animate-pulse"}`} />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Interactive System Architecture {chaosActive && "• [CHAOS MODE ACTIVE]"}
            </h4>
          </div>
          <p className="text-sm font-geometric font-bold text-white mt-1">
            Click any pipeline node to inspect technical trade-offs & benchmark data
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Chaos Engineering Toggle */}
          <button
            onClick={handleToggleChaos}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-geometric font-bold transition-all shadow-sm cursor-pointer border ${
              chaosActive
                ? "bg-red-500 hover:bg-red-600 text-white border-red-400 animate-pulse"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700"
            }`}
            title="Simulate node failure and watch automated circuit breaker failover"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>{chaosActive ? "Reset Chaos Mode" : "⚡ Chaos Test: Kill Node"}</span>
          </button>

          {/* Normal Traffic Simulation */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-geometric font-bold transition-all shadow-md disabled:opacity-75 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                <span>Routing Packet...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                <span>Simulate Traffic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chaos Mode Live Alert Banner */}
      {chaosActive && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-red-500/60 shadow-lg space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
              <span className="font-mono text-xs font-bold text-red-300 uppercase">
                {failoverResolved ? "✓ Resilient Failover Succeeded" : "Alert: Node 02 Injected Hardware Crash"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {failoverResolved ? "Recovered in 84ms • Zero Data Loss" : "Health checks failing..."}
            </span>
          </div>

          <p className="text-xs font-body text-zinc-300 leading-relaxed">
            {failoverResolved
              ? "Circuit breaker tripped open on Node 02. In-flight requests automatically rerouted through isolated Read Replica pool. P99 latency recovered from 504ms to 3.8ms with 0 dropped packets."
              : "Simulating simulated OOM crash on primary cache node. Envoy health checks triggered 3 failed pings; waiting for circuit breaker threshold..."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fault Tolerance: Active</span>
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              Fallback Strategy: <strong className="text-white">Degraded Read Replica + Exponential Backoff</strong>
            </span>
          </div>
        </div>
      )}

      {/* Horizontal Interactive Pipeline Nodes */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {nodes.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isStepActive = activeStepIndex === index;
            const isFailedNode = chaosActive && index === failedNodeIndex;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative ${
                  isFailedNode
                    ? "bg-red-950/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-2 ring-red-500"
                    : isSelected
                    ? "bg-zinc-900 border-white shadow-lg translate-y--0.5"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                } ${isStepActive ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : ""}`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase ${isFailedNode ? "text-red-400" : "text-zinc-500"}`}>
                    {isFailedNode ? "⚠️ Crashed Node" : `Node 0${index + 1}`}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isFailedNode
                      ? "bg-red-900/60 text-red-200 border-red-700 font-bold"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}>
                    {isFailedNode ? (failoverResolved ? "Fallback: 3.8ms" : "504 TIMEOUT") : node.latencyBenchmark}
                  </span>
                </div>

                <h5 className="font-geometric font-bold text-xs sm:text-sm text-white group-hover:text-zinc-200">
                  {node.name}
                </h5>

                <p className="text-[11px] font-body text-zinc-400 mt-1 line-clamp-2">
                  {isFailedNode && failoverResolved ? "Traffic shed to replica" : node.role}
                </p>

                {/* Packet Simulation dot */}
                {isStepActive && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Dive Details Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 block">
              Component Deep Dive
            </span>
            <h5 className="font-geometric font-extrabold text-base sm:text-lg text-white">
              {selectedNode.name}
            </h5>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 font-mono text-xs text-white">
            <Zap className="w-3.5 h-3.5" />
            <span>Benchmark: {selectedNode.latencyBenchmark}</span>
          </div>
        </div>

        {/* Technical Trade-Off Section */}
        <div className="space-y-1.5">
          <span className="text-xs font-geometric font-bold text-zinc-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Architectural Trade-Off & Design Rationale</span>
          </span>
          <p className="text-xs sm:text-sm font-body text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            {selectedNode.tradeoffRationale}
          </p>
        </div>

        {/* Config or Code snippet if available */}
        {selectedNode.configSnippet && (
          <div className="space-y-1.5">
            <span className="text-xs font-geometric font-bold text-zinc-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span>Implementation / Config Snippet</span>
            </span>
            <pre className="p-3.5 rounded-xl bg-black font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800 leading-relaxed">
              <code>{selectedNode.configSnippet}</code>
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}

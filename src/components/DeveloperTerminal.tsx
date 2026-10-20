"use client";

import React, { useState, useRef, useEffect } from "react";
import { StudentProfile } from "@/lib/types";
import { Terminal, X, Minus, Maximize2, CornerDownLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface DeveloperTerminalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenStory: () => void;
  onSendInquiry: (message: string) => void;
}

interface CommandLog {
  command?: string;
  output: React.ReactNode;
}

export default function DeveloperTerminal({
  student,
  isOpen,
  onClose,
  onOpenResume,
  onOpenStory,
  onSendInquiry
}: DeveloperTerminalProps) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      output: (
        <div className="space-y-1 text-zinc-400">
          <p className="text-white font-bold">
            CloudFolio Developer CLI [v2.4.0-release] — Connected to @{student.username}
          </p>
          <p className="text-zinc-500 text-[11px]">
            Type <span className="text-white font-bold underline">help</span> or <span className="text-white font-bold underline">ask &lt;question&gt;</span> to interview AI Twin. Press [~] or [Esc] to exit.
          </p>
        </div>
      )
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(" ");
    const action = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (action === "clear") {
      setHistory([]);
      return;
    }

    if (action === "exit" || action === "quit") {
      onClose();
      return;
    }

    if (action === "ask" || action === "ai" || action === "twin") {
      if (!args) {
        setHistory((prev) => [
          ...prev,
          {
            command: rawCmd,
            output: (
              <p className="text-zinc-400">
                Usage: <span className="text-white font-bold">ask [question]</span> — e.g.{" "}
                <span className="text-zinc-300">ask why lock-free ring buffers over Mutex in OmniFlow?</span>
              </p>
            )
          }
        ]);
        return;
      }

      setHistory((prev) => [
        ...prev,
        {
          command: rawCmd,
          output: (
            <div className="flex items-center gap-2 text-zinc-400 py-1 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Consulting Gemini AI Twin for @{student.username}...</span>
            </div>
          )
        }
      ]);

      try {
        const res = await fetch("/api/ai/twin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: student.username,
            question: args,
            history: []
          })
        });
        const data = await res.json();

        setHistory((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0) {
            next[lastIdx] = {
              command: rawCmd,
              output: (
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 mt-1">
                  <div className="flex items-center justify-between text-white font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-white font-bold">✦ {student.fullName} (AI Twin)</span>
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px]">Gemini 2.0 Flash Grounded</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">
                    {data.reply || data.answer || "No response received."}
                  </p>
                  {data.citations && data.citations.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400 border-t border-zinc-800/80">
                      <span className="text-zinc-500 font-mono">Grounded Sources:</span>
                      {data.citations.map((c: string, idx: number) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            };
          }
          return next;
        });
      } catch (err) {
        setHistory((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0) {
            next[lastIdx] = {
              command: rawCmd,
              output: <p className="text-zinc-400">Failed to query candidate AI twin. Please try again.</p>
            };
          }
          return next;
        });
      }
      return;
    }

    let resultNode: React.ReactNode = null;

    switch (action) {
      case "help":
        resultNode = (
          <div className="space-y-1 text-zinc-300">
            <p className="font-bold text-white">Available Shell Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] pt-1">
              <div><span className="text-white font-bold">ask [question]</span> - Interview Gemini Candidate AI Twin</div>
              <div><span className="text-white font-bold">bio</span> - Display student academic profile</div>
              <div><span className="text-white font-bold">projects</span> - List technical case studies & metrics</div>
              <div><span className="text-white font-bold">inspect [slug]</span> - Deep dive into project architecture</div>
              <div><span className="text-white font-bold">experience</span> - View industry and research work</div>
              <div><span className="text-white font-bold">skills</span> - Print technical competencies matrix</div>
              <div><span className="text-white font-bold">resume</span> - Open 1-Click ATS Resume Generator</div>
              <div><span className="text-white font-bold">story</span> - Launch 60-Second Recruiter Pitch</div>
              <div><span className="text-white font-bold">contact [msg]</span> - Send direct interview inquiry</div>
              <div><span className="text-white font-bold">clear</span> - Clear terminal output buffer</div>
              <div><span className="text-white font-bold">exit</span> - Close terminal window</div>
            </div>
          </div>
        );
        break;

      case "bio":
        resultNode = (
          <div className="space-y-1.5 text-zinc-300">
            <p className="text-white font-bold">{student.fullName} (@{student.username})</p>
            <p className="text-zinc-400">{student.headline}</p>
            <p className="text-zinc-500">{student.university} • {student.degree} (GPA: {student.gpa})</p>
            <p className="pt-1 text-zinc-300 text-xs italic">{student.bio}</p>
          </div>
        );
        break;

      case "projects":
        resultNode = (
          <div className="space-y-2 text-zinc-300">
            <p className="font-bold text-white">Featured Technical Projects ({student.projects.length}):</p>
            <div className="space-y-1.5 text-xs">
              {student.projects.map((p, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>{p.title}</span>
                    <span className="text-zinc-300 font-mono text-[11px]">{p.metrics || "Validated"}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{p.tagline}</p>
                  <p className="text-zinc-500 font-mono text-[10px] mt-1">slug: {p.slug} | stack: {p.tags.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "inspect": {
        const query = args.toLowerCase();
        const project = student.projects.find((p) => p.slug.toLowerCase().includes(query) || p.title.toLowerCase().includes(query)) || student.projects[0];
        resultNode = (
          <div className="space-y-2 text-zinc-300 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between text-white font-bold">
              <span>{project.title}</span>
              <span className="text-zinc-300 font-mono">{project.metrics}</span>
            </div>
            <p className="text-zinc-400 text-xs">{project.description}</p>
            {project.architecture && (
              <div className="pt-1 text-[11px] font-mono">
                <span className="text-zinc-500 block">Architecture Design:</span>
                <span className="text-zinc-200">{project.architecture}</span>
              </div>
            )}
            <div className="text-[10.5px] font-mono text-zinc-500 pt-1">
              Links: {project.liveUrl || "demo.cloud"} • {project.githubUrl || "github.com"}
            </div>
          </div>
        );
        break;
      }

      case "experience":
        resultNode = (
          <div className="space-y-2 text-zinc-300">
            <p className="font-bold text-white">Work & Research Experience:</p>
            {student.experiences.map((exp, i) => (
              <div key={i} className="text-xs p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">{exp.period}</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-zinc-400 text-[11px]">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        resultNode = (
          <div className="space-y-2 text-zinc-300">
            <p className="font-bold text-white">Technical Stack & Tools Matrix:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {student.skills.map((cat, i) => (
                <div key={i} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-white font-bold block mb-1">{cat.name}</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{cat.skills.join(" • ")}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "resume":
        resultNode = <p className="text-white font-bold">Opening ATS Resume Generator...</p>;
        onOpenResume();
        break;

      case "story":
        resultNode = <p className="text-white font-bold">Launching 60-Second Recruiter Story Mode...</p>;
        onOpenStory();
        break;

      case "contact":
        if (!args) {
          resultNode = <p className="text-zinc-400">Usage: contact [your message or job role]</p>;
        } else {
          onSendInquiry(args);
          resultNode = (
            <p className="text-white font-bold">
              ✓ Message dispatched directly to {student.fullName}&apos;s verified inbox!
            </p>
          );
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#ffffff", "#a1a1aa", "#18181b"]
          });
        }
        break;

      default:
        resultNode = (
          <p className="text-zinc-400">
            command not found: {action}. Type <span className="text-white font-bold underline">help</span> for command reference.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: rawCmd,
        output: resultNode
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Enter") {
      handleCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[580px] max-h-[80vh] flex flex-col rounded-2xl bg-zinc-950 text-white border border-zinc-700 shadow-2xl font-mono text-xs overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Title bar */}
      <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-300" />
          <span className="font-bold text-zinc-300">cloudfolio-sh ~ @{student.username}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close Terminal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="p-4 overflow-y-auto max-h-[380px] space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-400 font-bold">guest@{student.username}:~$</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
            )}
            <div>{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-zinc-400 font-bold shrink-0">guest@{student.username}:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'ask <question>', 'bio', 'projects', or 'resume'..."
          className="w-full bg-transparent text-white focus:outline-none placeholder:text-zinc-600 font-mono text-xs"
        />
        <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
      </div>
    </div>
  );
}

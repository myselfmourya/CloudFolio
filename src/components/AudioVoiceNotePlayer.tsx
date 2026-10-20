"use client";

import React, { useState, useEffect, useRef } from "react";
import { VoiceNote } from "@/lib/types";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Headphones
} from "lucide-react";

interface AudioVoiceNotePlayerProps {
  voiceNote?: VoiceNote;
  candidateName: string;
  compact?: boolean;
  dark?: boolean;
}

export default function AudioVoiceNotePlayer({
  voiceNote,
  candidateName,
  compact = false,
  dark = false
}: AudioVoiceNotePlayerProps) {
  if (!voiceNote) return null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceNote.durationSeconds || 46);
  const [playbackRate, setPlaybackRate] = useState<1.0 | 1.5>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update playback rate on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Update muted state on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Speech synthesis fallback if no audioUrl
  const speakFallback = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(voiceNote.transcript);
    
    // Pick the most natural, articulate voice available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Google US English") ||
        v.name.includes("Natural") ||
        v.name.includes("Daniel") ||
        (v.lang === "en-US" && !v.name.includes("Bad") && !v.name.includes("Bells"))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    // Conversational, human cadence (not rushed robotic TTS)
    utterance.rate = playbackRate === 1.5 ? 1.25 : 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);

      if (voiceNote.audioUrl && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("HTML5 audio playback error, falling back to speech synthesis:", err);
          speakFallback();
        });
      } else {
        speakFallback();
        timerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsPlaying(false);
              return 0;
            }
            return prev + 1;
          });
        }, 1000 / playbackRate);
      }
    }
  };

  const handleSpeedToggle = () => {
    const nextRate = playbackRate === 1.0 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
    if (isPlaying && !voiceNote.audioUrl) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      speakFallback();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSeek = (percentage: number) => {
    const targetTime = (percentage / 100) * duration;
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const progressPercent = Math.min(100, (currentTime / (duration || 1)) * 100);

  const waveHeights = [
    30, 55, 40, 75, 60, 90, 45, 70, 85, 50, 80, 95, 65, 40, 75, 55, 85, 45, 65, 40, 55, 35, 70, 45
  ];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div 
      className={`rounded-2xl transition-all duration-300 ${
        dark 
          ? "bg-zinc-900 border border-zinc-800 text-white" 
          : "bg-white border border-slate-200/90 text-slate-950 shadow-xs"
      } ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      {/* Hidden HTML5 Native Audio Element */}
      {voiceNote.audioUrl && (
        <audio
          ref={audioRef}
          src={voiceNote.audioUrl}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current && audioRef.current.duration) {
              setDuration(Math.round(audioRef.current.duration));
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Top Header Row */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
        dark ? "border-zinc-800" : "border-slate-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
          }`}>
            <Headphones className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                dark 
                  ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
                  : "bg-slate-100 border-slate-200 text-zinc-600"
              }`}>
                Candidate Walkthrough
              </span>
              <span className={`text-xs font-mono ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                {voiceNote.duration}
              </span>
            </div>
            <h4 className={`text-sm font-geometric font-extrabold mt-0.5 ${
              dark ? "text-white" : "text-slate-950"
            }`}>
              {voiceNote.title}
            </h4>
          </div>
        </div>

        {/* Speed toggle & Mute */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSpeedToggle}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold transition-colors cursor-pointer ${
              dark
                ? "border-zinc-700 bg-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white"
                : "border-slate-200 bg-slate-50 hover:border-black text-slate-700"
            }`}
            title="Toggle playback speed"
          >
            {playbackRate}x
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
              dark
                ? "border-zinc-700 bg-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white"
                : "border-slate-200 bg-slate-50 hover:border-black text-slate-600"
            }`}
            title={isMuted ? "Unmute voice" : "Mute voice"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Waveform & Scrubber */}
      <div className="py-3.5 space-y-2.5">
        <div className="flex items-center gap-3">
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayToggle}
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-104 cursor-pointer ${
              dark 
                ? "bg-white text-zinc-950 hover:bg-zinc-200" 
                : "bg-zinc-950 text-white hover:bg-zinc-800"
            }`}
            aria-label={isPlaying ? "Pause audio memo" : "Play audio memo"}
          >
            {isPlaying ? (
              <Pause className={`w-4 h-4 ${dark ? "fill-zinc-950" : "fill-white"}`} />
            ) : (
              <Play className={`w-4 h-4 ml-0.5 ${dark ? "fill-zinc-950" : "fill-white"}`} />
            )}
          </button>

          {/* Clickable Equalizer Waveform */}
          <div 
            className="flex-1 flex items-center gap-1 sm:gap-1.5 h-9 px-2 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const pct = (clickX / rect.width) * 100;
              handleSeek(pct);
            }}
            title="Click to seek"
          >
            {waveHeights.map((ht, idx) => {
              const barProgress = (idx / waveHeights.length) * 100;
              const hasPassed = barProgress <= progressPercent;

              return (
                <div
                  key={idx}
                  className="flex-1 flex items-center justify-center h-full"
                >
                  <div
                    className={`w-full rounded-full transition-all duration-150 ${
                      hasPassed
                        ? dark ? "bg-white" : "bg-zinc-950"
                        : dark ? "bg-zinc-800 group-hover:bg-zinc-700" : "bg-slate-200 group-hover:bg-slate-300"
                    } ${
                      isPlaying && hasPassed ? "animate-pulse" : ""
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(20, (ht * ((idx % 3 + 1) * 0.35)))}%`
                        : `${ht * 0.7}%`,
                      minHeight: "4px"
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              dark 
                ? "text-zinc-500 hover:text-white hover:bg-zinc-800" 
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timestamp & Topic */}
        <div className={`flex items-center justify-between text-xs font-mono pt-0.5 ${
          dark ? "text-zinc-400" : "text-slate-500"
        }`}>
          <span>{formatSeconds(currentTime)} / {formatSeconds(duration)}</span>
          
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className={`flex items-center gap-1 font-geometric font-bold text-xs cursor-pointer ${
              dark ? "text-zinc-300 hover:text-white" : "text-slate-800 hover:text-black"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTranscript ? "Hide Transcript" : "Transcript"}</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Key Takeaway Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
        dark 
          ? "bg-zinc-950/80 border-zinc-800 text-zinc-300" 
          : "bg-slate-50 border-slate-200/80 text-slate-700"
      }`}>
        <Sparkles className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${dark ? "text-white" : "text-zinc-950"}`} strokeWidth={1.5} />
        <div>
          <span className={`font-geometric font-bold ${dark ? "text-white" : "text-slate-950"}`}>
            Key Takeaway:{" "}
          </span>
          <span className="font-body">{voiceNote.keyTakeaway}</span>
        </div>
      </div>

      {/* Collapsible Full Transcript */}
      {showTranscript && (
        <div className={`mt-3 pt-3 border-t space-y-1.5 animate-in fade-in duration-200 ${
          dark ? "border-zinc-800" : "border-slate-100"
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
            dark ? "text-zinc-500" : "text-slate-400"
          }`}>
            Spoken Audio Transcript
          </span>
          <p className={`text-xs font-body leading-relaxed p-3.5 rounded-xl border italic ${
            dark 
              ? "bg-zinc-950 border-zinc-800 text-zinc-300" 
              : "bg-slate-50 border-slate-200/70 text-slate-700"
          }`}>
            &ldquo;{voiceNote.transcript}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

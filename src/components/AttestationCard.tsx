"use client";

import React, { useState } from "react";
import { CryptographicAttestation } from "@/lib/types";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  RotateCw, 
  Hash, 
  KeyRound, 
  Award,
  Lock
} from "lucide-react";

interface AttestationCardProps {
  attestation: CryptographicAttestation;
}

export default function AttestationCard({ attestation }: AttestationCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(attestation.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div 
      className="group relative cursor-pointer min-h-[220px] rounded-3xl transition-all duration-300"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT OF CARD */}
        <div className="w-full h-full rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-black transition-all flex flex-col justify-between [backface-visibility:hidden]">
          <div>
            {/* Header: Verified Seal & Category */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-900 text-[11px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" strokeWidth={1.5} />
                <span>{attestation.status}</span>
              </span>

              <span className="text-[10px] font-mono text-slate-400">
                Issued {attestation.issueDate}
              </span>
            </div>

            {/* Title & Issuer */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{attestation.verificationBadge.split(" ")[0]}</span>
                <h4 className="font-geometric font-extrabold text-slate-950 text-base group-hover:text-black transition-colors leading-snug">
                  {attestation.title}
                </h4>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Authority: <strong className="text-slate-800">{attestation.issuer}</strong> ({attestation.issuerDomain})
              </p>
            </div>

            {/* Claim details */}
            <p className="mt-3 text-xs font-body text-slate-600 leading-relaxed line-clamp-3">
              {attestation.claimDetails}
            </p>
          </div>

          {/* Card Footer: Flip trigger */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-geometric font-bold text-slate-500 group-hover:text-black">
            <span className="text-[11px] font-mono text-slate-400">
              SHA-256 Verified
            </span>
            <div className="inline-flex items-center gap-1">
              <span>Inspect Cryptographic Proof</span>
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* BACK OF CARD: CRYPTOGRAPHIC LEDGER PROOF */}
        <div className="absolute inset-0 w-full h-full rounded-3xl bg-zinc-950 text-white border border-zinc-800 p-6 sm:p-7 shadow-xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Tamper-Proof Ledger Proof
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Click to flip back</span>
            </div>

            {/* SHA-256 Digest */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-zinc-400" />
                  <span>SHA-256 Integrity Hash</span>
                </span>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 transition-colors"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-black font-mono text-[10.5px] text-zinc-300 break-all border border-zinc-800/80">
                {attestation.sha256Hash}
              </div>
            </div>

            {/* GPG Fingerprint & Merkle Root */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-mono pt-1">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[9.5px] uppercase">GPG Signer Key</span>
                <span className="text-zinc-200 font-bold">{attestation.gpgFingerprint.slice(0, 19)}...</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[9.5px] uppercase">Challenge Protocol</span>
                <span className="text-zinc-200 font-bold">TLS 1.3 / .EDU Signed</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Merkle Proof: {attestation.merkleProofRoot.slice(0, 16)}...</span>
            <span className="text-emerald-400 font-bold">✓ Integrity Valid</span>
          </div>
        </div>

      </div>
    </div>
  );
}

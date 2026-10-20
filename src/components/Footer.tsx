import Link from "next/link";
import CloudFolioLogo from "./CloudFolioLogo";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-slate-600 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <CloudFolioLogo size={32} />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              The modern portfolio platform for engineers and designers. Showcase your projects, export ATS resumes, and connect with hiring teams.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-800">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-950">
              Student Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="#features" className="hover:text-black transition-colors">
                  Edge Portfolios
                </Link>
              </li>
              <li>
                <Link href="#showcase" className="hover:text-black transition-colors">
                  Student Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black transition-colors">
                  Studio Dashboard
                </Link>
              </li>
              <li>
                <Link href="/portfolio/alexchen" className="hover:text-black transition-colors">
                  Live Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-950">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="#features" className="hover:text-black transition-colors">
                  Edge CDN Hosting
                </Link>
              </li>
              <li>
                <Link href="/portfolio/alexchen" className="hover:text-black transition-colors">
                  1-Click ATS Resumes
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black transition-colors">
                  Visitor Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black transition-colors">
                  Custom Domains
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-geometric font-bold uppercase tracking-wider text-slate-950">
              Community & Access
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/login" className="hover:text-black transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-black transition-colors">
                  Recruiter Fast Track
                </Link>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  University Partner Portal
                </span>
              </li>
              <li>
                <span className="hover:text-black transition-colors cursor-pointer">
                  Campus Ambassador Network
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© 2026 CloudFolio Platform. Built for engineers & designers.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-black" strokeWidth={1.5} />
              <span>Security & Privacy</span>
            </span>
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

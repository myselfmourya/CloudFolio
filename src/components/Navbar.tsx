"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CloudFolioLogo from "./CloudFolioLogo";
import { ArrowRight, Menu, X, ExternalLink } from "lucide-react";
import { getStoredCurrentStudent } from "@/lib/portfolio-store";
import { StudentProfile } from "@/lib/types";

import { apiClient } from "@/lib/api-client";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiClient.auth.me().then((res) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(res.authenticated));
        if (res.authenticated && res.profile) {
          setUserProfile(res.profile);
        }
      }
    }).catch(() => {
      if (isMounted) setIsAuthenticated(false);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (e) {
      console.warn("Logout failed", e);
    }
    setIsAuthenticated(false);
    setUserProfile(null);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs py-2.5"
          : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Professional Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <CloudFolioLogo size={32} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="#showcase"
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              Showcase
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#innovations"
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
              <span>Interactive Innovations</span>
            </Link>
            <Link
              href="#architecture"
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
            >
              Architecture
            </Link>
            <Link
              href="/portfolio/alexchen"
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1"
            >
              <span>Example Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-geometric font-bold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm hover:scale-102"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-geometric font-bold text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-geometric font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-all"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-geometric font-bold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm hover:scale-102"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-800 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <Link
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Showcase
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Features
            </Link>
            <Link
              href="#innovations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-between"
            >
              <span>Interactive Innovations</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-black text-white rounded-full">New</span>
            </Link>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Architecture
            </Link>
            <Link
              href="/portfolio/alexchen"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-900 font-semibold hover:bg-slate-100 rounded-lg"
            >
              Example Portfolio
            </Link>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-sm"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-sm"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../ui/logo";

/* ────────────────────────────────────────────
   Icons
──────────────────────────────────────────── */
function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Logo
──────────────────────────────────────────── */
function LogoIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h4v2h-4v-2z" />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────
   Partner logo item
──────────────────────────────────────────── */
function PartnerLogo({
  name,
  badge,
  icon,
}: {
  name: string;
  badge?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-semibold tracking-wide">
      <span className="opacity-40">{icon}</span>
      {name}
      {badge && (
        <span className="ml-1 bg-[#0f1f38] border border-[#1e2a3a] rounded text-[10px] text-gray-500 px-2 py-0.5 hidden sm:inline">
          {badge}
        </span>
      )}
    </div>
  );
}

const NAV_LINKS = ["Products", "Resources", "Solutions", "Company"] as const;

/* ────────────────────────────────────────────
   Page
──────────────────────────────────────────── */
export default function LandingPage() {
  const [experience, setExperience] = useState<"Trader" | "Analyst">("Trader");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white font-sans">
      {/* ── Announcement bar ── */}
      <div className="bg-[#0f1f38] border-b border-[#1e2a3a] py-2 px-4 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-400 text-center">
        <span className="bg-green-500 text-[#0a1628] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
          NEW
        </span>
        <span>
          Master your trading edge with AI-powered journaling and analytics.
        </span>
        <Link
          href="/signup"
          className="text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap z-50"
        >
          Start free →
        </Link>
      </div>

      {/* ── Navbar ── */}
      <nav className="bg-[#0a1628] border-b border-[#1e2a3a] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between relative z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Logo landing />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((label) => (
            <button
              key={label}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {label} <ChevronDown />
            </button>
          ))}
          <Link
            href="/pricing"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-300 border border-[#1e2a3a] hover:border-[#2a3a50] rounded-lg px-4 py-2 transition-colors">
            <SearchIcon /> Search
          </button>
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-green-500 hover:bg-green-600 text-[#0a1628] text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile: sign in + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f1f38] border-b border-[#1e2a3a] px-4 py-4 flex flex-col gap-1 z-40">
          {NAV_LINKS.map((label) => (
            <button
              key={label}
              className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white py-3 border-b border-[#1e2a3a] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label} <ChevronDown />
            </button>
          ))}
          <Link
            href="/pricing"
            className="text-sm text-gray-300 hover:text-white py-3 border-b border-[#1e2a3a] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="pt-3 flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 w-full text-sm text-gray-300 border border-[#1e2a3a] rounded-lg px-4 py-2.5 transition-colors">
              <SearchIcon /> Search
            </button>
            <Link
              href="/signup"
              className="bg-green-500 hover:bg-green-600 text-[#0a1628] text-sm font-bold text-center px-4 py-2.5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative text-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#1e2a3a 1px, transparent 1px), linear-gradient(90deg, #1e2a3a 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #0f2a4a 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Experience toggle */}
          <div className="inline-flex flex-wrap items-center justify-center bg-[#0f1f38] border border-[#1e2a3a] rounded-lg overflow-hidden mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-2 border-b sm:border-b-0 sm:border-r border-[#1e2a3a] w-full sm:w-auto text-center">
              Select Experience:
            </span>
            {(["Trader", "Analyst"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setExperience(opt)}
                className={`flex-1 sm:flex-none text-sm font-semibold px-5 py-2 transition-colors ${
                  experience === opt
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white mb-2 sm:mb-3">
            One trading journal.
          </h1>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-4 sm:mb-6"
            style={{
              background: "linear-gradient(90deg, #22c55e, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Unlimited AI insights.
          </h1>

          {/* Sub */}
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
            Combine trade logs, performance analytics, and AI coaching in a
            unified platform built for serious traders.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 sm:mb-7">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-[#0a1628] text-base font-bold px-7 py-3.5 rounded-xl transition-colors text-center"
            >
              Get Started
            </Link>
            {/*<Link
              href="/docs"
              className="w-full sm:w-auto border border-[#1e2a3a] hover:border-[#2a3a50] hover:bg-[#0f1f38] text-gray-200 text-base px-7 py-3.5 rounded-xl transition-colors text-center"
            >
              Documentation
            </Link>*/}
          </div>

          {/* AI assistant bar */}
          <div className="w-full max-w-md mx-auto bg-[#0f1f38] border border-[#1e2a3a] rounded-xl px-4 py-3 flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #22c55e)",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="flex-1 text-sm text-gray-500 text-left truncate">
              Ask AI Coach anything about your trades…
            </span>
            <div className="w-7 h-7 bg-[#1e2a3a] rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
              <ArrowRight />
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-3">
            Review answers for accuracy. See our{" "}
            <Link
              href="/ai-faq"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              AI and data usage FAQ
            </Link>
          </p>
        </div>
      </section>

      {/* ── Partner logos ── */}
      <div className="border-t border-[#1e2a3a] px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto flex justify-center gap-4 items-center">
          <PartnerLogo
            name="FOREX FACTORY"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <PartnerLogo
            name="TRADINGVIEW"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          {/*<PartnerLogo
            name="MT4 / MT5"
            badge="Integrated"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            }
          />*/}
          {/*<PartnerLogo
            name="BYBIT"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            }
          />
          <PartnerLogo
            name="BINANCE"
            badge="Case Study"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          />
          <PartnerLogo
            name="KUCOIN"
            badge="Case Study"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            }
          />*/}
        </div>
      </div>
    </div>
  );
}

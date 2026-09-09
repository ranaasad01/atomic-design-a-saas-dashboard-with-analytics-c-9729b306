"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";
import { Menu, X, Sparkles, Bell, Search } from 'lucide-react';
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function resolveHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8
          bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]
          shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_-8px_rgba(0,0,0,0.4)]"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 mr-8 shrink-0 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent)] shadow-[0_0_16px_var(--accent-glow)]">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <span className="font-semibold text-[var(--text-primary)] tracking-tight text-sm hidden sm:block group-hover:text-[var(--accent)] transition-colors duration-200">
            {BRAND.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.key}
                href={resolveHref(link.href)}
                onClick={(e) => handleAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, link.href)}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? "text-[var(--accent)] bg-[var(--accent)]/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                  }`}
              >
                {navT[link.key] ?? link.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)]
              hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            aria-label="Notifications"
            className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)]
              hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-cyan)] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_var(--accent-glow)] cursor-pointer">
            JD
          </div>
          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)]
              hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200 ml-1"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 md:hidden
                bg-[var(--glass-bg)] backdrop-blur-xl border-l border-[var(--glass-border)]
                flex flex-col pt-20 pb-8 px-4 gap-1"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.key}
                    href={resolveHref(link.href)}
                    onClick={(e) => {
                      handleAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, link.href);
                      setMobileOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${active
                        ? "text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                      }`}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
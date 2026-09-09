"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";
import { Sparkles, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

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

  const socials = [
    { icon: Github,   href: "https://github.com",   label: "GitHub" },
    { icon: Twitter,  href: "https://twitter.com",  label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-sm tracking-tight group-hover:text-[var(--accent)] transition-colors duration-200">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
              {BRAND.tagline}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={resolveHref(link.href)}
                onClick={(e) => handleAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, link.href)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                {navT[link.key] ?? link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)]
                  hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 border border-transparent
                  hover:border-[var(--accent)]/20 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2024 {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
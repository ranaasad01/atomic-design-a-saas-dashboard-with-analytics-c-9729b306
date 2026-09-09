"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const FEATURES = [
  "Real-time analytics across all channels",
  "Automated revenue and churn reporting",
  "Team collaboration with role-based access",
  "99.9% uptime SLA with 24/7 support",
];

export default function SignInPage() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    if (!email || !password) {
      setError(t("signIn.form.errorEmpty"));
      return;
    }
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] overflow-hidden">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex items-center gap-2"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[hsl(var(--foreground))]">
            {BRAND.name}
          </span>
        </motion.div>

        {/* Main copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-8"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {t("signIn.promo.eyebrow")}
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[hsl(var(--foreground))]">
              {t("signIn.promo.headline")}
            </h2>
            <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
              {t("signIn.promo.subtext")}
            </p>
          </motion.div>

          <motion.ul variants={staggerContainer} className="space-y-3">
            {FEATURES.map((feat, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "color-mix(in srgb, var(--accent) 20%, transparent)" }}
                >
                  <Check
                    className="w-3 h-3"
                    style={{ color: "var(--accent)" }}
                  />
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {feat}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Testimonial */}
          <motion.blockquote
            variants={fadeInUp}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/60 p-5 space-y-3"
          >
            <p className="text-sm italic leading-relaxed text-[hsl(var(--foreground))]">
              {t("signIn.testimonial.quote")}
            </p>
            <footer className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-bold text-[hsl(var(--foreground))]">
                SR
              </div>
              <div>
                <p className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  {t("signIn.testimonial.author")}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {t("signIn.testimonial.role")}
                </p>
              </div>
            </footer>
          </motion.blockquote>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[
            { value: "14K+", label: t("signIn.stats.companies") },
            { value: "$2.4B", label: t("signIn.stats.tracked") },
            { value: "99.9%", label: t("signIn.stats.uptime") },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp} className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Reveal className="w-full max-w-md">
          <div className="space-y-8">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[hsl(var(--foreground))]">
                {BRAND.name}
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {t("signIn.form.heading")}
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {t("signIn.form.subheading")}
              </p>
            </div>

            {/* Demo banner */}
            <div
              className="rounded-xl border px-4 py-3 flex items-start gap-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              }}
            >
              <Sparkles
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">
                  {t("signIn.demo.title")}
                </p>
                <p className="text-[hsl(var(--muted-foreground))] mt-0.5">
                  {t("signIn.demo.body")}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  {t("signIn.form.emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("signIn.form.emailPlaceholder")}
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": "var(--accent)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[hsl(var(--foreground))]"
                  >
                    {t("signIn.form.passwordLabel")}
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-medium transition-colors duration-200"
                    style={{ color: "var(--accent)" }}
                  >
                    {t("signIn.form.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("signIn.form.passwordPlaceholder")}
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-10 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 transition-all duration-200"
                    style={
                      {
                        "--tw-ring-color": "var(--accent)",
                      } as React.CSSProperties
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    aria-label={showPassword ? t("signIn.form.hidePassword") : t("signIn.form.showPassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-rose-400 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    {t("signIn.form.signingIn")}
                  </span>
                ) : (
                  <>
                    {t("signIn.form.submitButton")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Demo shortcut */}
              <button
                type="button"
                onClick={() => { window.location.href = "/dashboard"; }}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-200"
              >
                {t("signIn.form.demoButton")}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-[hsl(var(--border))]" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                {t("signIn.form.orDivider")}
              </span>
              <div className="flex-1 h-px bg-[hsl(var(--border))]" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              {t("signIn.form.noAccount")}{" "}
              <Link
                href="#"
                className="font-semibold transition-colors duration-200 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                {t("signIn.form.signUpLink")}
              </Link>
            </p>

            {/* Legal */}
            <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
              {t("signIn.form.legal")}
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
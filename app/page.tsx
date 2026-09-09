"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight, BarChart as BarChartIcon, Users, TrendingUp, Zap, Shield, Globe, Star, Check, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/data";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: "Jan", revenue: 42000, users: 1200 },
  { month: "Feb", revenue: 51000, users: 1450 },
  { month: "Mar", revenue: 47000, users: 1380 },
  { month: "Apr", revenue: 63000, users: 1720 },
  { month: "May", revenue: 71000, users: 1950 },
  { month: "Jun", revenue: 68000, users: 1880 },
  { month: "Jul", revenue: 82000, users: 2210 },
  { month: "Aug", revenue: 91000, users: 2480 },
  { month: "Sep", revenue: 87000, users: 2350 },
  { month: "Oct", revenue: 104000, users: 2790 },
  { month: "Nov", revenue: 118000, users: 3100 },
  { month: "Dec", revenue: 132000, users: 3450 },
];

const CHANNEL_DATA = [
  { name: "Organic", value: 38 },
  { name: "Paid", value: 27 },
  { name: "Referral", value: 21 },
  { name: "Direct", value: 14 },
];

const CHANNEL_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

const WEEKLY_BAR = [
  { day: "Mon", sessions: 3200 },
  { day: "Tue", sessions: 4100 },
  { day: "Wed", sessions: 3800 },
  { day: "Thu", sessions: 5200 },
  { day: "Fri", sessions: 4700 },
  { day: "Sat", sessions: 2900 },
  { day: "Sun", sessions: 2400 },
];

const HERO_STATS = [
  { value: "$132K", label: "MRR this month", up: true, delta: "+18%" },
  { value: "3,450", label: "Active users", up: true, delta: "+12%" },
  { value: "1.8%", label: "Churn rate", up: false, delta: "-0.3%" },
];

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time analytics",
    desc: "Watch your metrics update live. No refresh needed, no stale data, no guessing.",
  },
  {
    icon: BarChartIcon,
    title: "Custom dashboards",
    desc: "Drag, drop, and resize every widget. Build the view your team actually needs.",
  },
  {
    icon: Users,
    title: "User-level insights",
    desc: "Drill from aggregate trends down to individual user journeys in two clicks.",
  },
  {
    icon: TrendingUp,
    title: "Predictive forecasting",
    desc: "ML-powered revenue and churn forecasts so you can act before the trend turns.",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II certified",
    desc: "Your data stays yours. End-to-end encryption, role-based access, full audit logs.",
  },
  {
    icon: Globe,
    title: "Global CDN delivery",
    desc: "Sub-100 ms dashboard loads anywhere in the world, backed by a 99.99% SLA.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Pulsar replaced four separate tools. Our team went from weekly reporting to live decisions.",
    name: "Mia Thornton",
    role: "VP of Growth, Loopline",
    avatar: "/images/testimonial-mia-thornton.jpg",
    stars: 5,
  },
  {
    quote:
      "The forecasting model caught a churn spike two weeks before it hit. That alone paid for the year.",
    name: "Carlos Reyes",
    role: "Head of Data, Stackform",
    avatar: "/images/testimonial-carlos-reyes.jpg",
    stars: 5,
  },
  {
    quote:
      "Setup took 20 minutes. The depth of insight we got on day one was genuinely surprising.",
    name: "Priya Nair",
    role: "Co-founder, Driftly",
    avatar: "/images/testimonial-priya-nair.jpg",
    stars: 5,
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    desc: "For early-stage teams getting their first analytics in place.",
    features: [
      "Up to 5 dashboards",
      "30-day data retention",
      "3 team seats",
      "Email support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    desc: "For growing teams that need depth, speed, and collaboration.",
    features: [
      "Unlimited dashboards",
      "12-month data retention",
      "15 team seats",
      "Predictive forecasting",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large orgs with custom data pipelines and compliance needs.",
    features: [
      "Everything in Pro",
      "Unlimited retention",
      "Unlimited seats",
      "SSO + SCIM",
      "Dedicated CSM",
      "SLA guarantee",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[hsl(var(--card))] px-4 py-3 shadow-xl text-sm">
      <p className="mb-1 font-semibold text-[hsl(var(--foreground))]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[hsl(var(--muted-foreground))]">
          {p.name === "revenue"
            ? `$${(p.value / 1000).toFixed(0)}K`
            : p.value.toLocaleString("en-US")}
        </p>
      ))}
    </div>
  );
}

// ─── Hero mini-dashboard preview ─────────────────────────────────────────────

const heroChartVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay: 0.3 },
  },
};

function HeroDashboardPreview() {
  return (
    <motion.div
      variants={heroChartVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full rounded-2xl border border-white/10 bg-[hsl(var(--card))] p-5 shadow-[0_8px_48px_-8px_rgba(99,102,241,0.25)]"
    >
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Revenue — last 12 months
        </span>
        <span className="rounded-full bg-indigo-500/15 px-3 py-0.5 text-xs font-semibold text-indigo-400">
          Live
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#heroGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      {/* Stat pills */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {HERO_STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5"
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-[hsl(var(--foreground))]">{s.value}</span>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-emerald-400" : "text-rose-400"}`}
              >
                {s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {s.delta}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="flex flex-col">
      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative overflow-hidden bg-[hsl(var(--background))] px-6 pb-24 pt-20 md:pb-32 md:pt-28"
      >
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-indigo-600/10 blur-[120px]"
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Left copy */}
          <Reveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  <Zap size={12} />
                  {t("hero.badge")}
                </span>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[hsl(var(--foreground))] md:text-5xl lg:text-6xl"
              >
                {t("hero.headline")}
                <span className="block text-indigo-400">{t("hero.headlineAccent")}</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="max-w-lg text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]"
              >
                {t("hero.subheadline")}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_32px_rgba(99,102,241,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  {t("hero.cta")}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  {t("hero.secondaryCta")}
                </Link>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-xs text-[hsl(var(--muted-foreground))]">
                {t("hero.footnote")}
              </motion.p>
            </motion.div>
          </Reveal>
          {/* Right preview */}
          <div className="w-full">
            <HeroDashboardPreview />
          </div>
        </div>
      </section>

      {/* ── Logos / social proof strip ── */}
      <section
        id="social-proof"
        className="border-y border-white/6 bg-white/2 px-6 py-10"
      >
        <Reveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            {t("logos.label")}
          </p>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {(Array.isArray(t.raw("logos.names")) ? t.raw("logos.names") : []).map(
              (name: string, i: number) => (
                <span
                  key={i}
                  className="text-sm font-bold tracking-tight text-[hsl(var(--muted-foreground))] opacity-60 transition-opacity hover:opacity-100"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Analytics preview section ── */}
      <section
        id="analytics"
        className="bg-[hsl(var(--background))] px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400">
                {t("analytics.eyebrow")}
              </span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
                {t("analytics.headline")}
              </h2>
              <p className="mt-4 text-pretty text-[hsl(var(--muted-foreground))] leading-relaxed">
                {t("analytics.body")}
              </p>
            </div>
          </Reveal>

          {/* Bento grid of charts */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Wide area chart */}
            <Reveal className="md:col-span-2" delay={0}>
              <div className="h-full rounded-2xl border border-white/8 bg-[hsl(var(--card))] p-6 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.3)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {t("analytics.chart1Title")}
                  </h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("analytics.chart1Period")}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                    <Area type="monotone" dataKey="users" name="users" stroke="#8b5cf6" strokeWidth={2} fill="url(#userGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Reveal>

            {/* Pie chart */}
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-white/8 bg-[hsl(var(--card))] p-6 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.3)]">
                <h3 className="mb-4 text-sm font-semibold text-[hsl(var(--foreground))]">
                  {t("analytics.chart2Title")}
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={CHANNEL_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {CHANNEL_DATA.map((_, i) => (
                        <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, ""]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {CHANNEL_DATA.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }}
                        />
                        <span className="text-[hsl(var(--muted-foreground))]">{c.name}</span>
                      </div>
                      <span className="font-semibold text-[hsl(var(--foreground))]">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bar chart */}
            <Reveal delay={0.12} className="md:col-span-3">
              <div className="rounded-2xl border border-white/8 bg-[hsl(var(--card))] p-6 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.3)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {t("analytics.chart3Title")}
                  </h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t("analytics.chart3Period")}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={WEEKLY_BAR} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                    <Tooltip
                      formatter={(v: number) => [v.toLocaleString("en-US"), "Sessions"]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="sessions" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="bg-white/2 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400">
                {t("features.eyebrow")}
              </span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
                {t("features.headline")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-[hsl(var(--muted-foreground))] leading-relaxed">
                {t("features.body")}
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-white/8 bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_4px_32px_-4px_rgba(99,102,241,0.2)]"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-500/25">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="bg-[hsl(var(--background))] px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400">
                {t("testimonials.eyebrow")}
              </span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
                {t("testimonials.headline")}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t_, i) => (
              <Reveal key={t_.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex h-full flex-col rounded-2xl border border-white/8 bg-[hsl(var(--card))] p-6 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.25)]"
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t_.stars }).map((_, si) => (
                      <Star key={si} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    &ldquo;{t_.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={t_.avatar}
                      alt={t_.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(t_.name)}&background=6366f1&color=fff&size=64`;
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{t_.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{t_.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        className="bg-white/2 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400">
                {t("pricing.eyebrow")}
              </span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
                {t("pricing.headline")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-[hsl(var(--muted-foreground))] leading-relaxed">
                {t("pricing.body")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRICING_PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`relative flex h-full flex-col rounded-2xl border p-7 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.25)] transition-shadow duration-300 ${
                    plan.highlight
                      ? "border-indigo-500/50 bg-indigo-600/10 shadow-[0_4px_40px_-4px_rgba(99,102,241,0.3)]"
                      : "border-white/8 bg-[hsl(var(--card))]"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                      {t("pricing.popular")}
                    </span>
                  )}
                  <div className="mb-5">
                    <h3 className="text-base font-bold text-[hsl(var(--foreground))]">{plan.name}</h3>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="mb-1 text-sm text-[hsl(var(--muted-foreground))]">{plan.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{plan.desc}</p>
                  </div>
                  <ul className="mb-7 flex-1 space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-[hsl(var(--foreground))]">
                        <Check size={15} className="mt-0.5 shrink-0 text-indigo-400" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      plan.highlight
                        ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500"
                        : "border border-white/10 bg-white/5 text-[hsl(var(--foreground))] hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="cta"
        className="relative overflow-hidden bg-[hsl(var(--background))] px-6 py-24 md:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[400px] w-[700px] rounded-full bg-indigo-600/12 blur-[100px]" />
        </div>
        <Reveal>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
              {t("cta.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              {t("cta.body")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {t("cta.button")}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{t("cta.footnote")}</p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';
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
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { BRAND, KpiCard, Transaction } from "@/lib/data";
import { motion as m } from "framer-motion";

type ChartPeriod = "7d" | "30d" | "90d" | "1y";

const STATUS_COLORS: Record<Transaction["status"], string> = {
  paid: "text-emerald-400",
  pending: "text-amber-400",
  failed: "text-rose-400",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiCards: KpiCard[] = [
  { id: "mrr",     labelKey: "Monthly Recurring Revenue", value: "$48,295",  delta: 12.4,  deltaLabel: "vs last month", prefix: "$" },
  { id: "users",   labelKey: "Active Users",              value: "12,847",   delta: 8.1,   deltaLabel: "vs last month" },
  { id: "churn",   labelKey: "Churn Rate",                value: "2.4%",     delta: -0.6,  deltaLabel: "vs last month", suffix: "%" },
  { id: "revenue", labelKey: "Total Revenue",             value: "$184,920", delta: 18.7,  deltaLabel: "vs last month", prefix: "$" },
];

const revenueData = [
  { month: "Jan", revenue: 32000, users: 8200 },
  { month: "Feb", revenue: 36500, users: 8900 },
  { month: "Mar", revenue: 34200, users: 9100 },
  { month: "Apr", revenue: 39800, users: 9800 },
  { month: "May", revenue: 42100, users: 10400 },
  { month: "Jun", revenue: 44700, users: 11200 },
  { month: "Jul", revenue: 41300, users: 11600 },
  { month: "Aug", revenue: 46900, users: 12100 },
  { month: "Sep", revenue: 48295, users: 12847 },
];

const barData = [
  { day: "Mon", sessions: 3200 },
  { day: "Tue", sessions: 4100 },
  { day: "Wed", sessions: 3800 },
  { day: "Thu", sessions: 5200 },
  { day: "Fri", sessions: 4700 },
  { day: "Sat", sessions: 2900 },
  { day: "Sun", sessions: 2400 },
];

const planData = [
  { name: "Enterprise", value: 38, color: "#22d3ee" },
  { name: "Pro",        value: 45, color: "#818cf8" },
  { name: "Free",       value: 17, color: "#475569" },
];

const recentTransactions: Transaction[] = [
  { id: "txn_001", customer: "Acme Corp",       email: "billing@acme.com",       amount: 1200, status: "paid",    date: "2024-09-15", plan: "Enterprise" },
  { id: "txn_002", customer: "Nova Labs",        email: "finance@novalabs.io",    amount: 299,  status: "paid",    date: "2024-09-15", plan: "Pro" },
  { id: "txn_003", customer: "Drift Studio",     email: "hello@driftstudio.co",   amount: 299,  status: "pending", date: "2024-09-14", plan: "Pro" },
  { id: "txn_004", customer: "Beacon Health",    email: "ops@beaconhealth.com",   amount: 1200, status: "paid",    date: "2024-09-14", plan: "Enterprise" },
  { id: "txn_005", customer: "Quill Publishing", email: "accounts@quillpub.net",  amount: 299,  status: "failed",  date: "2024-09-13", plan: "Pro" },
  { id: "txn_006", customer: "Orbit Systems",    email: "pay@orbitsystems.dev",   amount: 1200, status: "paid",    date: "2024-09-13", plan: "Enterprise" },
  { id: "txn_007", customer: "Maple Analytics",  email: "billing@mapleanalytics.ca", amount: 0, status: "pending", date: "2024-09-12", plan: "Free" },
];

const PERIOD_OPTIONS: ChartPeriod[] = ["7d", "30d", "90d", "1y"];

const PERIOD_LABELS: Record<ChartPeriod, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "1y": "1 year",
};

const TX_STATUS_COLORS: Record<Transaction["status"], string> = {
  paid:    STATUS_COLORS.paid,
  pending: STATUS_COLORS.pending,
  failed:  STATUS_COLORS.failed,
};

const TX_STATUS_BG: Record<Transaction["status"], string> = {
  paid:    "bg-emerald-400/10",
  pending: "bg-amber-400/10",
  failed:  "bg-rose-400/10",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCardItem({ card, index }: { card: KpiCard; index: number }) {
  const isPositive = card.delta >= 0;
  const isChurn = card.id === "churn";
  const good = isChurn ? !isPositive : isPositive;

  const icons: Record<string, React.ReactNode> = {
    mrr:     <DollarSign className="h-5 w-5" />,
    users:   <Users className="h-5 w-5" />,
    churn:   <Activity className="h-5 w-5" />,
    revenue: <TrendingUp className="h-5 w-5" />,
  };

  return (
    <Reveal delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
            {icons[card.id]}
          </div>
          <span className={`flex items-center gap-1 text-xs font-medium ${good ? "text-emerald-400" : "text-rose-400"}`}>
            {good ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(card.delta)}%
          </span>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-white">{card.value}</div>
          <div className="mt-1 text-sm text-slate-400">{card.labelKey}</div>
          <div className="mt-1 text-xs text-slate-500">{card.deltaLabel}</div>
        </div>
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[var(--accent)]/5 blur-2xl" />
      </motion.div>
    </Reveal>
  );
}

function PeriodSelector({ value, onChange }: { value: ChartPeriod; onChange: (p: ChartPeriod) => void }) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/8 bg-white/4 p-1">
      {PERIOD_OPTIONS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            value === p
              ? "bg-[var(--accent)] text-black shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium text-slate-400">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-white">
          {entry.name === "revenue" ? `$${entry.value.toLocaleString("en-US")}` : entry.value.toLocaleString("en-US")}
          <span className="ml-1 text-xs font-normal text-slate-400">{entry.name}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const [period, setPeriod] = useState<ChartPeriod>("30d");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "users">("revenue");

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Overview
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {BRAND.name} · Welcome back. Here is what is happening today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── KPI Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {kpiCards.map((card, i) => (
            <motion.div key={card.id} variants={fadeInUp}>
              <KpiCardItem card={card} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Revenue Chart ── */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Revenue &amp; Users</h2>
                <p className="mt-0.5 text-xs text-slate-500">Monthly trend over the last 9 months</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-xl border border-white/8 bg-white/4 p-1">
                  {(["revenue", "users"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveMetric(m)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        activeMetric === m
                          ? "bg-[var(--accent)] text-black shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={48} tickFormatter={(v: number) => activeMetric === "revenue" ? `$${(v / 1000).toFixed(0)}k` : `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#colorMetric)"
                  dot={false}
                  activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Sessions bar chart */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <h2 className="mb-1 text-base font-semibold text-white">Weekly Sessions</h2>
              <p className="mb-6 text-xs text-slate-500">Daily active sessions this week</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="sessions" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Plan distribution */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <h2 className="mb-1 text-base font-semibold text-white">Plan Distribution</h2>
              <p className="mb-4 text-xs text-slate-500">Share of users per plan</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-4 space-y-2">
                {planData.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-slate-400">{p.name}</span>
                    </span>
                    <span className="font-medium text-white">{p.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ── Transactions Table ── */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                <p className="mt-0.5 text-xs text-slate-500">Latest billing activity</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    {["Customer", "Email", "Plan", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{tx.customer}</td>
                      <td className="px-6 py-4 text-slate-400">{tx.email}</td>
                      <td className="px-6 py-4 text-slate-300">{tx.plan}</td>
                      <td className="px-6 py-4 text-white font-medium">${tx.amount.toLocaleString("en-US")}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TX_STATUS_BG[tx.status]} ${TX_STATUS_COLORS[tx.status]}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}

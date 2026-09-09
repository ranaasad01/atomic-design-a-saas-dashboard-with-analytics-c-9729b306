"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import type { KpiCard, Transaction } from "@/lib/data";

// ─── Status colors (defined inline — not imported from @/lib/data) ───────────
const STATUS_COLORS = {
  paid: "text-emerald-400",
  pending: "text-amber-400",
  failed: "text-rose-400",
  active: "text-emerald-400",
  churned: "text-rose-400",
  trial: "text-sky-400",
  free: "text-slate-400",
  pro: "text-indigo-400",
  enterprise: "text-cyan-400",
} as const;

// ─── Mock KPI data ────────────────────────────────────────────────────────────
const KPI_CARDS: KpiCard[] = [
  {
    id: "revenue",
    labelKey: "Total Revenue",
    value: "284,520",
    delta: 12.4,
    deltaLabel: "vs last month",
    prefix: "$",
  },
  {
    id: "mrr",
    labelKey: "Monthly Recurring",
    value: "48,390",
    delta: 8.1,
    deltaLabel: "vs last month",
    prefix: "$",
  },
  {
    id: "users",
    labelKey: "Active Users",
    value: "14,832",
    delta: 5.7,
    deltaLabel: "vs last month",
  },
  {
    id: "churn",
    labelKey: "Churn Rate",
    value: "2.4",
    delta: -0.3,
    deltaLabel: "vs last month",
    suffix: "%",
  },
];

// ─── Mock chart data ──────────────────────────────────────────────────────────
const USER_TREND = [
  { date: "Jan", users: 9200 },
  { date: "Feb", users: 10100 },
  { date: "Mar", users: 10800 },
  { date: "Apr", users: 11400 },
  { date: "May", users: 12300 },
  { date: "Jun", users: 13100 },
  { date: "Jul", users: 13700 },
  { date: "Aug", users: 14200 },
  { date: "Sep", users: 14832 },
];

const REVENUE_TREND = [
  { month: "Jan", revenue: 31200, mrr: 28400 },
  { month: "Feb", revenue: 34800, mrr: 30100 },
  { month: "Mar", revenue: 36200, mrr: 32500 },
  { month: "Apr", revenue: 38900, mrr: 34200 },
  { month: "May", revenue: 41300, mrr: 37800 },
  { month: "Jun", revenue: 43700, mrr: 39400 },
  { month: "Jul", revenue: 46100, mrr: 41900 },
  { month: "Aug", revenue: 49200, mrr: 44600 },
  { month: "Sep", revenue: 52800, mrr: 48390 },
];

const TRAFFIC_SOURCES = [
  { name: "Organic Search", value: 38, color: "#6366f1" },
  { name: "Direct", value: 24, color: "#22d3ee" },
  { name: "Referral", value: 18, color: "#a78bfa" },
  { name: "Social", value: 13, color: "#34d399" },
  { name: "Paid Ads", value: 7, color: "#f59e0b" },
];

// ─── Mock transactions ────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    customer: "Aria Nakamura",
    email: "aria@wavefront.io",
    amount: 299,
    status: "paid",
    date: "2024-09-14",
    plan: "Enterprise",
  },
  {
    id: "txn_002",
    customer: "Marcus Chen",
    email: "m.chen@loopstack.com",
    amount: 79,
    status: "paid",
    date: "2024-09-13",
    plan: "Pro",
  },
  {
    id: "txn_003",
    customer: "Priya Sharma",
    email: "priya@nexaflow.dev",
    amount: 79,
    status: "pending",
    date: "2024-09-13",
    plan: "Pro",
  },
  {
    id: "txn_004",
    customer: "Luca Ferretti",
    email: "luca@gridlabs.eu",
    amount: 299,
    status: "failed",
    date: "2024-09-12",
    plan: "Enterprise",
  },
  {
    id: "txn_005",
    customer: "Sofia Andersen",
    email: "sofia@brightnode.dk",
    amount: 29,
    status: "paid",
    date: "2024-09-12",
    plan: "Starter",
  },
  {
    id: "txn_006",
    customer: "James Okafor",
    email: "james@vaultmetrics.ng",
    amount: 79,
    status: "paid",
    date: "2024-09-11",
    plan: "Pro",
  },
  {
    id: "txn_007",
    customer: "Elena Vasquez",
    email: "elena@pulsecrm.mx",
    amount: 299,
    status: "pending",
    date: "2024-09-11",
    plan: "Enterprise",
  },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return count;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-white/5 bg-white/5 ${className}`}
    >
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="h-8 w-1/2 rounded bg-white/10" />
        <div className="h-3 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
const KPI_ICONS: Record<string, React.ReactNode> = {
  revenue: <DollarSign className="w-4 h-4" />,
  mrr: <Activity className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  churn: <AlertCircle className="w-4 h-4" />,
};

function KpiCardComponent({ card, loading }: { card: KpiCard; loading: boolean }) {
  const rawNum = parseFloat(card.value.replace(/,/g, ""));
  const animated = useAnimatedCounter(loading ? 0 : rawNum);

  const isPositiveGood = card.id !== "churn";
  const isGood = isPositiveGood ? card.delta >= 0 : card.delta <= 0;
  const TrendIcon = card.delta >= 0 ? TrendingUp : TrendingDown;

  const displayValue = () => {
    if (loading) return "—";
    const formatted = animated.toLocaleString("en-US");
    return `${card.prefix ?? ""}${formatted}${card.suffix ?? ""}`;
  };

  if (loading) return <SkeletonCard />;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50 uppercase tracking-widest">
          {card.labelKey}
        </span>
        <span className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
          {KPI_ICONS[card.id]}
        </span>
      </div>
      <div className="text-3xl font-bold tracking-tight text-white">
        {displayValue()}
      </div>
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          isGood ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        <TrendIcon className="w-3.5 h-3.5" />
        <span>
          {card.delta > 0 ? "+" : ""}
          {card.delta}% {card.deltaLabel}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
  prefix = "",
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f1117]/90 backdrop-blur-md px-4 py-3 shadow-xl text-sm">
      <p className="text-white/50 mb-2 text-xs font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-semibold">
          {prefix}{entry.value.toLocaleString("en-US")}
          <span className="ml-1 text-xs font-normal text-white/40">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <Reveal>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Your product at a glance.</p>
          </div>
        </Reveal>

        {/* KPI Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {KPI_CARDS.map((card) => (
            <motion.div key={card.id} variants={fadeInUp}>
              <KpiCardComponent card={card} loading={loading} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Revenue trend */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <h2 className="mb-1 text-base font-semibold text-white">Revenue Trend</h2>
              <p className="mb-6 text-xs text-slate-500">Monthly revenue vs MRR</p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip prefix="$" />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#gRevenue)" dot={false} />
                  <Area type="monotone" dataKey="mrr" stroke="#22d3ee" strokeWidth={2} fill="url(#gMrr)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* User trend */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <h2 className="mb-1 text-base font-semibold text-white">User Growth</h2>
              <p className="mb-6 text-xs text-slate-500">Monthly active users</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={USER_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="users" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>

        {/* Traffic + Transactions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Traffic sources */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
              <h2 className="mb-1 text-base font-semibold text-white">Traffic Sources</h2>
              <p className="mb-4 text-xs text-slate-500">Where visitors come from</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" stroke="none">
                    {TRAFFIC_SOURCES.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-4 space-y-2">
                {TRAFFIC_SOURCES.map((s) => (
                  <li key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-400">{s.name}</span>
                    </span>
                    <span className="font-medium text-white">{s.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Transactions */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/6">
                <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                <p className="mt-0.5 text-xs text-slate-500">Latest billing activity</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6">
                      {["Customer", "Email", "Plan", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{tx.customer}</td>
                        <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{tx.email}</td>
                        <td className="px-5 py-3.5 text-slate-300">{tx.plan}</td>
                        <td className="px-5 py-3.5 text-white font-medium">${tx.amount.toLocaleString("en-US")}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-medium ${STATUS_COLORS[tx.status]}`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </main>
  );
}

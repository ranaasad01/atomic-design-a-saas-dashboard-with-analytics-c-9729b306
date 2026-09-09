"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, MousePointerClick, Clock, Percent, DollarSign, BarChart2 } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Types ───────────────────────────────────────────────────────────────────
type Period = "7d" | "30d" | "90d" | "custom";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SIGNUP_DATA: Record<Period, { label: string; signups: number }[]> = {
  "7d": [
    { label: "Mon", signups: 142 },
    { label: "Tue", signups: 198 },
    { label: "Wed", signups: 175 },
    { label: "Thu", signups: 231 },
    { label: "Fri", signups: 289 },
    { label: "Sat", signups: 164 },
    { label: "Sun", signups: 120 },
  ],
  "30d": [
    { label: "Wk 1", signups: 820 },
    { label: "Wk 2", signups: 1040 },
    { label: "Wk 3", signups: 970 },
    { label: "Wk 4", signups: 1230 },
  ],
  "90d": [
    { label: "Jan", signups: 3200 },
    { label: "Feb", signups: 4100 },
    { label: "Mar", signups: 3750 },
  ],
  custom: [
    { label: "Q1", signups: 9800 },
    { label: "Q2", signups: 12400 },
    { label: "Q3", signups: 11200 },
    { label: "Q4", signups: 15600 },
  ],
};

const REVENUE_DATA: Record<Period, { label: string; organic: number; paid: number; referral: number }[]> = {
  "7d": [
    { label: "Mon", organic: 4200, paid: 2800, referral: 1100 },
    { label: "Tue", organic: 5100, paid: 3200, referral: 1400 },
    { label: "Wed", organic: 4700, paid: 2900, referral: 1250 },
    { label: "Thu", organic: 6200, paid: 3800, referral: 1700 },
    { label: "Fri", organic: 7100, paid: 4200, referral: 2100 },
    { label: "Sat", organic: 3900, paid: 2100, referral: 900 },
    { label: "Sun", organic: 3200, paid: 1800, referral: 750 },
  ],
  "30d": [
    { label: "Wk 1", organic: 22000, paid: 14000, referral: 6200 },
    { label: "Wk 2", organic: 27000, paid: 16500, referral: 7400 },
    { label: "Wk 3", organic: 24500, paid: 15200, referral: 6800 },
    { label: "Wk 4", organic: 31000, paid: 18900, referral: 8600 },
  ],
  "90d": [
    { label: "Jan", organic: 88000, paid: 54000, referral: 24000 },
    { label: "Feb", organic: 102000, paid: 63000, referral: 28000 },
    { label: "Mar", organic: 95000, paid: 58000, referral: 26000 },
  ],
  custom: [
    { label: "Q1", organic: 280000, paid: 170000, referral: 76000 },
    { label: "Q2", organic: 340000, paid: 210000, referral: 94000 },
    { label: "Q3", organic: 310000, paid: 195000, referral: 88000 },
    { label: "Q4", organic: 420000, paid: 260000, referral: 118000 },
  ],
};

const MRR_DATA: Record<Period, { label: string; current: number; previous: number }[]> = {
  "7d": [
    { label: "Mon", current: 48200, previous: 43100 },
    { label: "Tue", current: 49100, previous: 43800 },
    { label: "Wed", current: 48700, previous: 44200 },
    { label: "Thu", current: 50200, previous: 44900 },
    { label: "Fri", current: 51800, previous: 45600 },
    { label: "Sat", current: 51200, previous: 45200 },
    { label: "Sun", current: 52400, previous: 46100 },
  ],
  "30d": [
    { label: "Wk 1", current: 48200, previous: 42000 },
    { label: "Wk 2", current: 49800, previous: 43500 },
    { label: "Wk 3", current: 51200, previous: 44800 },
    { label: "Wk 4", current: 52400, previous: 46100 },
  ],
  "90d": [
    { label: "Jan", current: 44000, previous: 38000 },
    { label: "Feb", current: 48200, previous: 41000 },
    { label: "Mar", current: 52400, previous: 44500 },
  ],
  custom: [
    { label: "Q1", current: 44000, previous: 36000 },
    { label: "Q2", current: 48200, previous: 40000 },
    { label: "Q3", current: 52400, previous: 44000 },
    { label: "Q4", current: 58900, previous: 49000 },
  ],
};

const METRICS: Record<Period, { convRate: string; avgSession: string; bounceRate: string; arpu: string }> = {
  "7d":     { convRate: "4.2%",  avgSession: "3m 42s", bounceRate: "28.4%", arpu: "$48.20" },
  "30d":    { convRate: "3.9%",  avgSession: "4m 01s", bounceRate: "30.1%", arpu: "$52.40" },
  "90d":    { convRate: "3.6%",  avgSession: "3m 55s", bounceRate: "31.8%", arpu: "$49.80" },
  "custom": { convRate: "3.4%",  avgSession: "3m 28s", bounceRate: "33.2%", arpu: "$46.10" },
};

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Last 7d",  value: "7d" },
  { label: "Last 30d", value: "30d" },
  { label: "Last 90d", value: "90d" },
  { label: "Custom",   value: "custom" },
];

// ─── Tooltip styles ───────────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  color: "hsl(var(--foreground))",
  fontSize: "13px",
};

const tooltipLabelStyle = { color: "hsl(var(--muted-foreground))", marginBottom: 4 };

// ─── Metric strip card ────────────────────────────────────────────────────────
const metricCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  index: number;
}

function MetricCard({ icon, label, value, trend, positive, index }: MetricCardProps) {
  return (
    <motion.div
      custom={index}
      variants={metricCardVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
          {icon}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trend}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">{value}</div>
        <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const signupData  = useMemo(() => SIGNUP_DATA[period],  [period]);
  const revenueData = useMemo(() => REVENUE_DATA[period], [period]);
  const mrrData     = useMemo(() => MRR_DATA[period],     [period]);
  const metrics     = useMemo(() => METRICS[period],      [period]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ── Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                Analytics
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Deep-dive into growth, revenue, and engagement across all channels.
              </p>
            </div>

            {/* Period filter pills */}
            <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    period === opt.value
                      ? "bg-[var(--accent)] text-black shadow-sm"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Metrics strip ── */}
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard
              index={0}
              icon={<Percent size={16} />}
              label="Conversion Rate"
              value={metrics.convRate}
              trend="+0.4pp"
              positive
            />
            <MetricCard
              index={1}
              icon={<Clock size={16} />}
              label="Avg. Session"
              value={metrics.avgSession}
              trend="-8s"
              positive={false}
            />
            <MetricCard
              index={2}
              icon={<MousePointerClick size={16} />}
              label="Bounce Rate"
              value={metrics.bounceRate}
              trend="-1.2pp"
              positive
            />
            <MetricCard
              index={3}
              icon={<DollarSign size={16} />}
              label="ARPU"
              value={metrics.arpu}
              trend="+$3.10"
              positive
            />
          </div>
        </Reveal>

        {/* ── User Signups Bar Chart ── */}
        <Reveal>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)]">
            <SectionHeading
              title="User Signups"
              subtitle="New accounts created per period across all acquisition sources."
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={signupData} barSize={32} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  cursor={{ fill: "hsl(var(--border))", opacity: 0.4 }}
                />
                <Bar
                  dataKey="signups"
                  name="Signups"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Revenue Breakdown Stacked Area ── */}
        <Reveal>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)]">
            <SectionHeading
              title="Revenue by Channel"
              subtitle="Stacked breakdown of organic, paid, and referral revenue streams."
            />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent)"  stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--accent)"  stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradReferral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34d399" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, undefined]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))", paddingTop: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  name="Organic"
                  stackId="1"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#gradOrganic)"
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  name="Paid"
                  stackId="1"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#gradPaid)"
                />
                <Area
                  type="monotone"
                  dataKey="referral"
                  name="Referral"
                  stackId="1"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#gradReferral)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── MRR Comparison Line Chart ── */}
        <Reveal>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)]">
            <SectionHeading
              title="MRR: Current vs. Previous Period"
              subtitle="Monthly recurring revenue trajectory compared to the equivalent prior window."
            />
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mrrData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, undefined]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))", paddingTop: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Current Period"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  name="Previous Period"
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ r: 3, fill: "#818cf8", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Insight callout strip ── */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: <BarChart2 size={18} />,
                title: "Highest-growth channel",
                body: "Organic search drove 42% of new signups this period, up 6pp from the prior window.",
              },
              {
                icon: <Users size={18} />,
                title: "Retention signal",
                body: "Trial-to-paid conversion held above 3.8% for the third consecutive period.",
              },
              {
                icon: <TrendingUp size={18} />,
                title: "MRR momentum",
                body: "Current MRR is tracking 13.6% ahead of the same window last year.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                custom={i}
                className="flex gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{item.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{item.body}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

      </div>
    </div>
  );
}
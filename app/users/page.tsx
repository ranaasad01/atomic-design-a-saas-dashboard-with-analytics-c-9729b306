"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ArrowUpDown, Users, TrendingUp, Star, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
type STATUS_COLORS = any;
const STATUS_COLORS: any = [];
type UserRow = any;
const UserRow: any = [];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: UserRow[] = [
  { id: "u1",  name: "Aria Chen",       email: "aria@novacorp.io",      plan: "enterprise", status: "active",  joined: "2023-01-12", mrr: 1200 },
  { id: "u2",  name: "Marcus Webb",     email: "m.webb@stacklabs.com",  plan: "pro",        status: "active",  joined: "2023-02-28", mrr: 79  },
  { id: "u3",  name: "Priya Nair",      email: "priya@brightpath.co",   plan: "pro",        status: "trial",   joined: "2024-03-05", mrr: 79  },
  { id: "u4",  name: "Luca Ferretti",   email: "luca@ferrettidev.it",   plan: "free",       status: "active",  joined: "2023-06-18", mrr: 0   },
  { id: "u5",  name: "Sofia Andersen",  email: "sofia@loopworks.dk",    plan: "enterprise", status: "active",  joined: "2022-11-03", mrr: 1200 },
  { id: "u6",  name: "James Okafor",    email: "james@okafor.ng",       plan: "pro",        status: "churned", joined: "2023-04-22", mrr: 0   },
  { id: "u7",  name: "Yuki Tanaka",     email: "yuki@tanaka.jp",        plan: "free",       status: "active",  joined: "2024-01-09", mrr: 0   },
  { id: "u8",  name: "Elena Vasquez",   email: "elena@vasquez.mx",      plan: "pro",        status: "active",  joined: "2023-08-14", mrr: 79  },
  { id: "u9",  name: "Noah Bergmann",   email: "noah@bergmann.de",      plan: "enterprise", status: "active",  joined: "2022-09-30", mrr: 1200 },
  { id: "u10", name: "Chloe Martin",    email: "chloe@martinco.fr",     plan: "pro",        status: "trial",   joined: "2024-04-01", mrr: 79  },
  { id: "u11", name: "Raj Patel",       email: "raj@patelsystems.in",   plan: "free",       status: "churned", joined: "2023-07-07", mrr: 0   },
  { id: "u12", name: "Amara Diallo",    email: "amara@diallo.sn",       plan: "pro",        status: "active",  joined: "2023-10-19", mrr: 79  },
  { id: "u13", name: "Tom Eriksson",    email: "tom@eriksson.se",       plan: "enterprise", status: "active",  joined: "2023-03-15", mrr: 1200 },
  { id: "u14", name: "Mei Lin",         email: "mei@lintech.cn",        plan: "pro",        status: "active",  joined: "2023-12-01", mrr: 79  },
  { id: "u15", name: "Carlos Romero",   email: "carlos@romero.es",      plan: "free",       status: "trial",   joined: "2024-02-20", mrr: 0   },
  { id: "u16", name: "Fatima Al-Rashid",email: "fatima@alrashid.ae",    plan: "enterprise", status: "active",  joined: "2022-08-11", mrr: 1200 },
  { id: "u17", name: "Oliver Hughes",   email: "oliver@hughes.co.uk",   plan: "pro",        status: "active",  joined: "2023-05-25", mrr: 79  },
  { id: "u18", name: "Zara Osei",       email: "zara@osei.gh",          plan: "free",       status: "active",  joined: "2024-01-30", mrr: 0   },
  { id: "u19", name: "Ivan Petrov",     email: "ivan@petrov.ru",        plan: "pro",        status: "churned", joined: "2023-09-08", mrr: 0   },
  { id: "u20", name: "Hana Kimura",     email: "hana@kimura.jp",        plan: "enterprise", status: "active",  joined: "2023-02-14", mrr: 1200 },
];

const USER_GROWTH = [
  { month: "Jan", users: 312 },
  { month: "Feb", users: 428 },
  { month: "Mar", users: 591 },
  { month: "Apr", users: 703 },
  { month: "May", users: 865 },
  { month: "Jun", users: 1024 },
  { month: "Jul", users: 1198 },
  { month: "Aug", users: 1401 },
  { month: "Sep", users: 1589 },
  { month: "Oct", users: 1820 },
  { month: "Nov", users: 2103 },
  { month: "Dec", users: 2471 },
];

const PLAN_DISTRIBUTION = [
  { name: "Enterprise", value: 5,  color: "#22d3ee" },
  { name: "Pro",        value: 8,  color: "#818cf8" },
  { name: "Free",       value: 7,  color: "#475569" },
];

const TOP_COUNTRIES = [
  { country: "Japan",       users: 412 },
  { country: "Germany",     users: 387 },
  { country: "France",      users: 341 },
  { country: "India",       users: 298 },
  { country: "UK",          users: 276 },
  { country: "Mexico",      users: 231 },
  { country: "Denmark",     users: 198 },
];

const PAGE_SIZE = 8;

type SortKey = keyof Pick<UserRow, "name" | "plan" | "status" | "joined" | "mrr">;
type SortDir = "asc" | "desc";

const PLAN_BADGE: Record<UserRow["plan"], string> = {
  free:       "bg-slate-800 text-slate-300",
  pro:        "bg-indigo-900/60 text-indigo-300",
  enterprise: "bg-cyan-900/60 text-cyan-300",
};

const STATUS_BADGE: Record<UserRow["status"], string> = {
  active:  "bg-emerald-900/50 text-emerald-300",
  churned: "bg-rose-900/50 text-rose-300",
  trial:   "bg-sky-900/50 text-sky-300",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarColor(id: string) {
  const colors = [
    "bg-indigo-600", "bg-cyan-600", "bg-violet-600",
    "bg-emerald-600", "bg-amber-600", "bg-rose-600",
  ];
  const idx = id.charCodeAt(id.length - 1) % colors.length;
  return colors[idx];
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold text-white">{payload[0]?.value?.toLocaleString("en-US")}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | UserRow["plan"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserRow["status"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...MOCK_USERS];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }
    if (planFilter !== "all") rows = rows.filter((r) => r.plan === planFilter);
    if (statusFilter !== "all") rows = rows.filter((r) => r.status === statusFilter);
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [search, planFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  const totalMRR = MOCK_USERS.filter((u) => u.status === "active").reduce((s, u) => s + u.mrr, 0);
  const activeCount = MOCK_USERS.filter((u) => u.status === "active").length;
  const trialCount = MOCK_USERS.filter((u) => u.status === "trial").length;
  const churnCount = MOCK_USERS.filter((u) => u.status === "churned").length;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-xl space-y-10">

        {/* ── Header ── */}
        <Reveal>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Users
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage accounts, track growth, and monitor plan distribution across your user base.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4 text-[var(--accent)]" />
              <span>
                <span className="font-semibold text-white">{MOCK_USERS.length}</span> total users
              </span>
            </div>
          </div>
        </Reveal>

        {/* ── KPI Strip ── */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { label: "Active Users",   value: activeCount,                icon: Activity,   color: "text-emerald-400" },
              { label: "Trial Users",    value: trialCount,                 icon: Star,       color: "text-sky-400"     },
              { label: "Churned",        value: churnCount,                 icon: TrendingUp, color: "text-rose-400"    },
              { label: "Active MRR",     value: `$${totalMRR.toLocaleString("en-US")}`, icon: Users, color: "text-[var(--accent)]" },
            ].map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={fadeInUp}
                className="rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    {kpi.label}
                  </p>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <p className={`mt-3 text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* User Growth Line Chart */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm">
              <h2 className="mb-1 text-base font-semibold text-white">User Growth</h2>
              <p className="mb-5 text-xs text-slate-500">Monthly cumulative signups over the past year</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={USER_GROWTH} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}${v >= 1000 ? "k" : ""}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Plan Distribution Donut */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm">
              <h2 className="mb-1 text-base font-semibold text-white">Plan Distribution</h2>
              <p className="mb-4 text-xs text-slate-500">Breakdown by subscription tier</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={PLAN_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PLAN_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as { name: string; value: number };
                      return (
                        <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 text-sm shadow-xl">
                          <p className="text-slate-400">{d?.name}</p>
                          <p className="font-semibold text-white">{d?.value} users</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {PLAN_DISTRIBUTION.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                      <span className="text-slate-400">{p.name}</span>
                    </div>
                    <span className="font-medium text-white">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Top Countries Bar Chart ── */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm">
            <h2 className="mb-1 text-base font-semibold text-white">Top Countries</h2>
            <p className="mb-5 text-xs text-slate-500">Users by geographic region</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={TOP_COUNTRIES}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="users" fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* ── Table Section ── */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm">

            {/* Filters */}
            <div className="flex flex-col gap-3 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => { setPlanFilter(e.target.value as typeof planFilter); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:border-[var(--accent)]/50 transition-all duration-200"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:border-[var(--accent)]/50 transition-all duration-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/8">
                  <tr>
                    {(
                      [
                        { label: "User",    key: "name"   },
                        { label: "Plan",    key: "plan"   },
                        { label: "Status",  key: "status" },
                        { label: "Joined",  key: "joined" },
                        { label: "MRR",     key: "mrr"    },
                      ] as { label: string; key: SortKey }[]
                    ).map((col) => (
                      <th
                        key={col.key}
                        className="p-4 text-left font-medium text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors duration-150"
                        onClick={() => toggleSort(col.key)}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className={`h-3 w-3 ${sortKey === col.key ? "text-[var(--accent)]" : "text-slate-600"}`} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No users match your filters.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((user) => (
                      <motion.tr
                        key={user.id}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        className="transition-colors duration-150"
                      >
                        {/* User cell */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(user.id)}`}
                            >
                              {initials(user.name)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* Plan */}
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${PLAN_BADGE[user.plan]}`}>
                            {user.plan}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[user.status]}`}>
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              user.status === "active" ? "bg-emerald-400" :
                              user.status === "trial"  ? "bg-sky-400"     : "bg-rose-400"
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        {/* Joined */}
                        <td className="p-4 text-slate-400">
                          {new Date(user.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        {/* MRR */}
                        <td className="p-4">
                          <span className={user.mrr > 0 ? "font-semibold text-white" : "text-slate-600"}>
                            {user.mrr > 0 ? `$${user.mrr.toLocaleString("en-US")}` : "—"}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-white/8 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-white">
                  {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of <span className="text-white">{filtered.length}</span> users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-all duration-150 hover:border-[var(--accent)]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-all duration-150 ${
                      p === page
                        ? "border-[var(--accent)]/60 bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-all duration-150 hover:border-[var(--accent)]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
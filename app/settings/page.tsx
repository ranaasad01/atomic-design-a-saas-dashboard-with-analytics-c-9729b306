"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { User, Bell, CreditCard, Sun, Moon, Monitor, Upload, Check, Download, AlertCircle, Mail, Activity } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/data";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Mock data ───────────────────────────────────────────────────────────────

const INVOICES = [
  { id: "INV-2024-041", date: "Apr 1, 2024", amount: 79, status: "paid", plan: "Pro" },
  { id: "INV-2024-040", date: "Mar 1, 2024", amount: 79, status: "paid", plan: "Pro" },
  { id: "INV-2024-039", date: "Feb 1, 2024", amount: 79, status: "paid", plan: "Pro" },
  { id: "INV-2024-038", date: "Jan 1, 2024", amount: 29, status: "paid", plan: "Starter" },
  { id: "INV-2023-037", date: "Dec 1, 2023", amount: 29, status: "paid", plan: "Starter" },
];

const PLAN_FEATURES = [
  "Up to 50 team members",
  "500K monthly events",
  "90-day data retention",
  "Priority support",
  "Custom dashboards",
  "API access",
];

const USAGE_METRICS = [
  { label: "Monthly Events", used: 312000, total: 500000, unit: "events" },
  { label: "Team Seats", used: 14, total: 50, unit: "seats" },
  { label: "Data Retention", used: 67, total: 90, unit: "days" },
];

// ─── Tab config ──────────────────────────────────────────────────────────────

type TabId = "profile" | "appearance" | "notifications" | "billing";

const TABS: { id: TabId; labelKey: string; icon: React.ReactNode }[] = [
  { id: "profile", labelKey: "settings.tabs.profile", icon: <User size={16} /> },
  { id: "appearance", labelKey: "settings.tabs.appearance", icon: <Sun size={16} /> },
  { id: "notifications", labelKey: "settings.tabs.notifications", icon: <Bell size={16} /> },
  { id: "billing", labelKey: "settings.tabs.billing", icon: <CreditCard size={16} /> },
];

// ─── Shared card wrapper ──────────────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const t = useTranslations();
  const [name, setName] = useState("Jordan Rivera");
  const [email, setEmail] = useState("jordan@pulsar.io");
  const [role, setRole] = useState("Admin");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Avatar */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.profile.avatarSection")}
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-500 flex items-center justify-center text-2xl font-bold text-black select-none">
                JR
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                <Upload size={11} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-2">{t("settings.profile.avatarHint")}</p>
              <button className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200">
                {t("settings.profile.uploadPhoto")}
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Fields */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.profile.personalInfo")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: t("settings.profile.fullName"), value: name, setter: setName, type: "text" },
              { label: t("settings.profile.email"), value: email, setter: setEmail, type: "email" },
              { label: t("settings.profile.role"), value: role, setter: setRole, type: "text" },
              { label: t("settings.profile.company"), value: BRAND.name, setter: () => {}, type: "text" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all duration-200"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-black text-sm font-semibold hover:opacity-90 transition-all duration-200"
            >
              {saved ? <Check size={14} /> : null}
              {saved ? t("settings.profile.saved") : t("settings.profile.saveChanges")}
            </motion.button>
            <button className="text-sm text-white/40 hover:text-white/70 transition-colors duration-200">
              {t("settings.profile.cancel")}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6 border-rose-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-rose-400 mb-1">{t("settings.profile.dangerZone")}</h2>
              <p className="text-xs text-white/40 mb-4">{t("settings.profile.dangerHint")}</p>
              <button className="text-xs px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-all duration-200">
                {t("settings.profile.deleteAccount")}
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark" | "system";

const THEME_OPTIONS: { id: ThemeMode; labelKey: string; descKey: string; icon: React.ReactNode }[] = [
  { id: "light", labelKey: "settings.appearance.light", descKey: "settings.appearance.lightDesc", icon: <Sun size={20} /> },
  { id: "dark", labelKey: "settings.appearance.dark", descKey: "settings.appearance.darkDesc", icon: <Moon size={20} /> },
  { id: "system", labelKey: "settings.appearance.system", descKey: "settings.appearance.systemDesc", icon: <Monitor size={20} /> },
];

const selectionRing: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

function AppearanceTab() {
  const t = useTranslations();
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [accentIdx, setAccentIdx] = useState(0);

  const ACCENTS = [
    { label: "Lime", color: "bg-[var(--accent)]" },
    { label: "Indigo", color: "bg-indigo-500" },
    { label: "Cyan", color: "bg-cyan-400" },
    { label: "Rose", color: "bg-rose-500" },
    { label: "Amber", color: "bg-amber-400" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.appearance.themeMode")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(opt.id)}
                  className={`relative rounded-xl border p-5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="ring"
                        variants={selectionRing}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute inset-0 rounded-xl ring-2 ring-[var(--accent)] ring-offset-0 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  <div className={`mb-3 ${isSelected ? "text-[var(--accent)]" : "text-white/50"}`}>
                    {opt.icon}
                  </div>
                  <div className="text-sm font-semibold text-white">{t(opt.labelKey)}</div>
                  <div className="text-xs text-white/40 mt-1">{t(opt.descKey)}</div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                      <Check size={11} className="text-black" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.appearance.accentColor")}
          </h2>
          <div className="flex items-center gap-3">
            {ACCENTS.map((a, i) => (
              <motion.button
                key={a.label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccentIdx(i)}
                className={`relative w-8 h-8 rounded-full ${a.color} transition-all duration-200`}
                title={a.label}
              >
                {accentIdx === i && (
                  <motion.div
                    layoutId="accentRing"
                    className="absolute inset-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-black/80"
                  />
                )}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-3">{t("settings.appearance.accentHint")}</p>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.appearance.density")}
          </h2>
          <div className="flex gap-3">
            {(["Compact", "Default", "Comfortable"] as const).map((d, i) => (
              <button
                key={d}
                className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                  i === 1
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        enabled ? "bg-[var(--accent)]" : "bg-white/15"
      }`}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

function NotificationsTab() {
  const t = useTranslations();
  const [toggles, setToggles] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
    productUpdates: true,
    securityAlerts: true,
    teamActivity: false,
    billingAlerts: true,
    apiErrors: false,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const GROUPS = [
    {
      titleKey: "settings.notifications.emailGroup",
      icon: <Mail size={16} />,
      items: [
        { key: "emailAlerts" as const, labelKey: "settings.notifications.emailAlerts", descKey: "settings.notifications.emailAlertsDesc" },
        { key: "weeklyDigest" as const, labelKey: "settings.notifications.weeklyDigest", descKey: "settings.notifications.weeklyDigestDesc" },
        { key: "productUpdates" as const, labelKey: "settings.notifications.productUpdates", descKey: "settings.notifications.productUpdatesDesc" },
      ],
    },
    {
      titleKey: "settings.notifications.pushGroup",
      icon: <Bell size={16} />,
      items: [
        { key: "pushNotifications" as const, labelKey: "settings.notifications.push", descKey: "settings.notifications.pushDesc" },
        { key: "teamActivity" as const, labelKey: "settings.notifications.teamActivity", descKey: "settings.notifications.teamActivityDesc" },
      ],
    },
    {
      titleKey: "settings.notifications.systemGroup",
      icon: <Activity size={16} />,
      items: [
        { key: "securityAlerts" as const, labelKey: "settings.notifications.security", descKey: "settings.notifications.securityDesc" },
        { key: "billingAlerts" as const, labelKey: "settings.notifications.billing", descKey: "settings.notifications.billingDesc" },
        { key: "apiErrors" as const, labelKey: "settings.notifications.apiErrors", descKey: "settings.notifications.apiErrorsDesc" },
      ],
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {GROUPS.map((group) => (
        <motion.div key={group.titleKey} variants={fadeInUp}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[var(--accent)]">{group.icon}</span>
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
                {t(group.titleKey)}
              </h2>
            </div>
            <div className="space-y-5">
              {group.items.map((item, idx) => (
                <div key={item.key}>
                  {idx > 0 && <div className="border-t border-white/5 mb-5" />}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-white">{t(item.labelKey)}</div>
                      <div className="text-xs text-white/40 mt-0.5">{t(item.descKey)}</div>
                    </div>
                    <Toggle enabled={toggles[item.key]} onChange={() => toggle(item.key)} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function UsageBar({ used, total, label, unit }: { used: number; total: number; label: string; unit: string }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const color = pct > 85 ? "bg-rose-500" : pct > 65 ? "bg-amber-400" : "bg-[var(--accent)]";

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-xs text-white/40">
          {fmt(used)} / {fmt(total)} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div className="text-right mt-1">
        <span className={`text-xs font-medium ${pct > 85 ? "text-rose-400" : "text-white/30"}`}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

function BillingTab() {
  const t = useTranslations();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Current plan */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6 border-[var(--accent)]/20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                  {t("settings.billing.currentPlan")}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">{t("settings.billing.planName")}</h3>
              <p className="text-white/40 text-sm mt-1">{t("settings.billing.planDesc")}</p>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {PLAN_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={13} className="text-[var(--accent)] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-3xl font-bold text-white">$79</div>
              <div className="text-xs text-white/40">{t("settings.billing.perMonth")}</div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--accent)] text-black text-sm font-semibold hover:opacity-90 transition-all duration-200"
              >
                {t("settings.billing.upgrade")}
              </motion.button>
              <div className="mt-2">
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200">
                  {t("settings.billing.cancel")}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Usage */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
            {t("settings.billing.usageTitle")}
          </h2>
          <div className="space-y-5">
            {USAGE_METRICS.map((m) => (
              <UsageBar key={m.label} used={m.used} total={m.total} label={m.label} unit={m.unit} />
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Invoice history */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
              {t("settings.billing.invoiceHistory")}
            </h2>
            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[var(--accent)] transition-colors duration-200">
              <Download size={13} />
              {t("settings.billing.exportAll")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {[
                    t("settings.billing.colInvoice"),
                    t("settings.billing.colDate"),
                    t("settings.billing.colPlan"),
                    t("settings.billing.colAmount"),
                    t("settings.billing.colStatus"),
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium text-white/40 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono text-xs text-white/60">{inv.id}</td>
                    <td className="px-5 py-3.5 text-white/70">{inv.date}</td>
                    <td className="px-5 py-3.5 text-white/70">{inv.plan}</td>
                    <td className="px-5 py-3.5 text-white font-medium">${inv.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        <Check size={10} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-white/30 hover:text-[var(--accent)] transition-colors duration-200">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  profile: <ProfileTab />,
  appearance: <AppearanceTab />,
  notifications: <NotificationsTab />,
  billing: <BillingTab />,
};

export default function SettingsPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {t("settings.heading")}
            </h1>
            <p className="mt-1.5 text-sm text-white/40">{t("settings.subheading")}</p>
          </div>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar tabs */}
          <Reveal className="md:w-52 shrink-0">
            <nav className="flex md:flex-col gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: isActive ? 0 : 3 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <span className={isActive ? "text-[var(--accent)]" : "text-white/30"}>
                      {tab.icon}
                    </span>
                    {t(tab.labelKey)}
                    {isActive && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </Reveal>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {TAB_CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
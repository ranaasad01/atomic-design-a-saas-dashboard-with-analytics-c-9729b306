export const BRAND = {
  name: "Nexus Analytics",
  tagline: "Intelligence for modern SaaS teams.",
  accentColor: "#6366F1",
  accentSecondary: "#22D3EE",
} as const;

export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home",      href: "/",          key: "home" },
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Analytics", href: "/analytics", key: "analytics" },
  { label: "Users",     href: "/users",     key: "users" },
  { label: "Settings",  href: "/settings",  key: "settings" },
];

export interface KpiCard {
  id: string;
  labelKey: string;
  value: string;
  delta: number;
  deltaLabel: string;
  positive?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
}

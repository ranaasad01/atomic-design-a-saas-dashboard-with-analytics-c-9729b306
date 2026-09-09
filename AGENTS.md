# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
Design a SaaS dashboard with analytics charts

## Goal
Build a glass-futuristic SaaS analytics dashboard with interactive Recharts visualizations, KPI cards, sidebar nav, and four complete pages.

## Project type
dashboard

## Design system — match this exactly
- Color tokens: `--bg-card: #111827`, `--glass-border: rgba(255, 255, 255, 0.07)`, `--accent: #6366F1`, `--accent-hover: #818CF8`, `--accent-glow: rgba(99, 102, 241, 0.4)`, `--accent-muted: rgba(99, 102, 241, 0.15)`, `--accent-cyan: #22D3EE`, `--accent-cyan-glow: rgba(34, 211, 238, 0.35)`, `--accent-cyan-muted: rgba(34, 211, 238, 0.12)`, `--text-primary: #F8FAFC`, `--text-secondary: #94A3B8`, `--text-muted: #475569`
- Fonts: Inter

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`analytics`, `cta`, `features`, `footer`, `hero`, `logos`, `nav`, `pricing`, `settings`, `signIn`, `testimonials`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.

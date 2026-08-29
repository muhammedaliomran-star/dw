# Impeccable Design System & Visual Guidelines for Segilly (سِجلّي)

> Integrated from [Impeccable](https://impeccable.style) — Design Language, Rules & Anti-Pattern Detection for AI Coding Agents.

---

## 1. Core Visual Identity & Lanes

- **Product Archetype**: High-density Financial & POS Management System (ERP / Cloud Point-of-Sale / Retail OS).
- **Tone & Mood**: Tactile, fast, crisp, reliable, enterprise-grade clarity, Arabic-first ergonomic flow.
- **Surface Strategy**: Precision bezel cards (`BezelCard`), tactile interactive buttons (`ActionButton`), subtle depth without muddy opacity or excessive glassmorphism.

---

## 2. Typography & Contrast Principles

- **Font Hierarchy**:
  - Arabic Display / Headings: Modern, crisp geometric typography paired with tabular figures for numbers.
  - Body Text: High legibility font at 14px-16px, line height 1.5–1.7, optimal reading measures (65–75ch).
  - Numbers & Monetary Values: Monospace / Tabular numbers with clear currency symbols (`EGP` / `ج.م`).
- **Contrast & Legibility Rules**:
  - Minimum WCAG AA contrast (4.5:1 for body, 3:1 for large display elements).
  - **NEVER** use low-contrast gray text on colored or tinted backgrounds.
  - **NEVER** use pure `#000000` or `#ffffff` — always tint neutrals with <5% hue saturation matching the theme.

---

## 3. Anti-Patterns (What NOT to do)

- **No AI Slop Gradients**: No arbitrary purple-to-blue or cyan-on-dark glowing gradients.
- **No Card Nesting Abuse**: Do not nest cards inside cards inside cards; use semantic whitespace, clear hierarchy, and subtle dividers.
- **No Side-Tab Gimmicks**: Avoid arbitrary 3px thick colored left-borders on rounded cards.
- **No Monotonous Spacing**: Ensure deliberate rhythmic grouping (compact spacing for tightly coupled inputs/metrics, generous margins between functional sections).
- **No Unnatural Animations**: Use natural easing curves and deliberate entry transitions (`motion/react`). Avoid jarring, bouncy, or slow animations that impede user workflow.

---

## 4. Spacing & Geometric Math

- **Nested Border Radius Rule**: `Inner Radius = Outer Radius - Padding`.
- **Button Padding**: Horizontal padding is strictly 2× vertical padding.
- **Touch Targets**: Minimum 44px on touch viewports and mobile drawer actions.
- **Labels**: Button, pill, and tag text must stay on a single line — no wrapping or truncation inside badges.

---

## 5. Micro-Interactions & Feedback

- **Tactile Feedback**: Clear `:hover`, `:active`, and `:focus-visible` ring states on every interactive surface.
- **Empty States**: Every table, list, and filter view must feature a context-aware empty state with helpful guidance and an immediate call to action.
- **State Feedback**: Immediate toast feedback (`sonner`), optimistic UI updates, and clear loading skeletons.

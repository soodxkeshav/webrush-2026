# Design System

**Aesthetic:** Editorial museum exhibit — curated, quiet, deliberate. Not a dashboard.

---

## 1. Design Principles

1. **Story before data.** Every chart, badge, and label serves the narrative.
2. **Quiet confidence.** Muted colors, generous whitespace, no flashy gradients.
3. **Type does the work.** Hierarchy through weight and size, not decoration.
4. **Motion is meaning.** Animations communicate relationship, not delight.
5. **Two themes, one voice.** Light and dark are equally considered.

---

## 2. Typography

**Font:** Inter (system fallback: `ui-sans-serif, system-ui, -apple-system, sans-serif`)

| Token | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| `hero` | 48px / 3rem | 800 | -0.03em | 1.1 |
| `h1` | 32px / 2rem | 700 | -0.02em | 1.2 |
| `h2` | 24px / 1.5rem | 700 | -0.02em | 1.3 |
| `h3` | 18px / 1.125rem | 600 | -0.01em | 1.4 |
| `body` | 15px / 0.9375rem | 400 | 0 | 1.5 |
| `small` | 13px / 0.8125rem | 500 | 0 | 1.5 |
| `eyebrow` | 11px / 0.6875rem | 700 | 0.08em (uppercase) | 1.4 |
| `number` | 32px / 2rem | 800 | -0.02em | 1.1 |

Numbers always use `font-variant-numeric: tabular-nums`.

---

## 3. Color System

### Semantic tokens (light theme)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f8fafc` | Page background |
| `--bg-accent` | radial gradient | Subtle indigo/violet glow at top |
| `--surface` | `#ffffff` | Cards, panels |
| `--surface-2` | `#f1f5f9` | Nested surfaces |
| `--border` | `#e2e8f0` | Card borders |
| `--text` | `#0f172a` | Primary text |
| `--text-muted` | `#64748b` | Secondary text |
| `--text-faint` | `#94a3b8` | Tertiary text |

### Semantic tokens (dark theme)

| Token | Value |
|---|---|
| `--bg` | `#0a0a0f` |
| `--surface` | `#12121c` |
| `--surface-2` | `#1a1a28` |
| `--border` | `#23243d` |
| `--text` | `#f1f5f9` |
| `--text-muted` | `#94a3b8` |
| `--text-faint` | `#64748b` |

### Accent colors

| Role | Hex | Usage |
|---|---|---|
| Primary | `#6366f1` | Buttons, links, active states |
| Music | `#8b5cf6` | Music receipts |
| Purchase | `#f59e0b` | Purchase receipts |
| Transaction | `#3b82f6` | Transaction receipts |
| Success | `#10b981` | Positive patterns |
| Warning | `#f59e0b` | Notable patterns |
| Danger | `#ef4444` | Fraud flags |

### Era colors

| Era | Hex | Usage |
|---|---|---|
| Quiet Years (2018) | `#14b8a6` | Teal accent |
| Wanderer (2023) | `#fb7185` | Coral accent |
| Night Sessions (2024) | `#6366f1` | Indigo accent |

---

## 4. Spacing

8px base scale:

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

Card padding: `space-5` (20px)
Section gap: `space-8` (32px)
Page padding: `space-8` desktop, `space-4` mobile

---

## 5. Radii

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Chips, badges |
| `rounded-md` | 10px | Small buttons |
| `rounded-lg` | 12px | Buttons, inputs |
| `rounded-xl` | 16px | Cards |
| `rounded-2xl` | 20px | Panels, drawers |
| `rounded-full` | 999px | Pills |

---

## 6. Shadows

| Token | Value |
|---|---|
| `shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.04)` |
| `shadow-sm` | `0 2px 6px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)` |
| `shadow-md` | `0 6px 18px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)` |
| `shadow-lg` | `0 16px 40px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06)` |

Dark theme doubles all shadow opacities.

---

## 7. Motion

Powered by Framer Motion.

| Interaction | Duration | Easing |
|---|---|---|
| Chapter fade-in | 400ms | `cubic-bezier(.22, 1, .36, 1)` |
| Card hover | 150ms | ease-out |
| Panel slide-in | 300ms | spring (stiffness 300, damping 30) |
| Button press | 100ms | ease-in-out |
| Filter change | 200ms | ease-out |
| Theme switch | 200ms | linear (color only) |

All animations respect `prefers-reduced-motion: reduce` — replaced with instant transitions.

**No entry animations on newly added DOM elements longer than 100ms** (bot may interact before animation completes).

---

## 8. Components

### ReceiptCard

```text
┌─────────────────────────────────────┐
│ ▌ [icon] Title                      │  ← 4px left border colored by type
│ Subtitle • meta                     │
│ Time • Amount                       │
└─────────────────────────────────────┘
```

- Left border: 4px solid, colored by receipt type
- Icon: 36×36 tile, soft tint of type color
- Hover: `translateY(-2px)` + `shadow-md`
- Click: opens ConnectionPanel
- `data-testid="receipt-card"` on root
- `data-testid="receipt-title"` on title

### Chapter Card

- Eyebrow: date range (uppercase, tracked)
- Title: 32px bold
- Insight: italic muted
- Grid of receipts below

### Pattern Card

- Icon tile: 40×40, accent-colored
- Title: 16px semibold
- Description: 14px muted
- Optional percentage bar

### Stat Card

- Eyebrow label
- Large number (32px bold, tabular-nums)
- Optional trend line

### Buttons

**Primary (gradient)**
- Background: `linear-gradient(135deg, #6366f1, #8b5cf6)`
- Text: white, 600 weight
- Radius: 12px
- Hover: `translateY(-1px)` + `shadow-md`
- Press: `scale(0.98)`
- Always has visible text

**Secondary (outline)**
- Background: surface
- Border: 1px solid border
- Text: text color
- Hover: background surface-2

**Ghost**
- No background
- Text muted
- Hover: text primary + subtle bg

### Inputs

- Height: 44px
- Border: 1px solid border
- Focus: 3px indigo ring
- Radius: 12px

### Badges / Chips

- Radius: 999px
- Padding: 4px 10px
- Font: 11px, 700 weight, uppercase tracked

### Panels (ConnectionPanel, PatternInsights on mobile)

- Slide-in from right
- Width: 400px desktop, full width mobile
- Backdrop: `rgba(0,0,0,0.4)` with backdrop-blur
- Close button has visible text

---

## 9. Layout

### Desktop (≥1025px)

```text
┌──────┬─────────────────────┬──────────┐
│ Nav  │        Main         │ Insights │
│ 240  │        flex         │    320   │
└──────┴─────────────────────┴──────────┘
```

### Tablet (641–1024px)

```text
┌──────┬──────────────────────────────┐
│ Nav  │            Main              │
│ 200  │   (Insights moves below)     │
└──────┴──────────────────────────────┘
```

### Mobile (≤640px)

```text
┌────────────────────┐
│ Header (hamburger) │
├────────────────────┤
│       Main         │
│                    │
├────────────────────┤
│ Insights (bottom)  │
└────────────────────┘
```

---

## 10. Iconography

Lucide React only. Standard sizes: 14px inline, 16px buttons, 20px nav, 24px hero.

Type mapping:

| Concept | Icon |
|---|---|
| Music | `Music` |
| Purchase | `ShoppingBag` |
| Transaction | `CreditCard` |
| Time | `Clock` |
| Location | `MapPin` |
| Connection | `Link2` |
| Pattern | `Sparkles` |
| Era: Quiet | `Home` |
| Era: Wanderer | `Compass` |
| Era: Night | `Moon` |

---

## 11. Accessibility Standards

- All text ≥ 14px
- Contrast ratio ≥ 4.5:1 (body), ≥ 3:1 (large text)
- Focus visible on every interactive element (3px indigo ring)
- All icon-only buttons have `aria-label`
- All form inputs have associated `<label>`
- Keyboard navigation complete
- `prefers-reduced-motion` respected
- No color as the sole information carrier (badges include icons + text)

# Rules & Constraints

Three categories of rules govern this build:
1. **Hackathon rules** — set by organizers, non-negotiable
2. **FAIE evaluator rules** — learned from the prior demo submission
3. **Our engineering standards** — self-imposed quality bar

---

## Part 1 — Hackathon Rules (From Organizers)

1. **Individual participation only** — no teams
2. **Fully online** — no in-person component
3. **Frontend-only** — backend forbidden
4. **6-hour window** — Sep 20, 2026, 10:00–16:00
5. **Previously built projects cannot be submitted**
6. **Must use the provided dataset** — no custom data
7. **Max 3 submission attempts** — highest score counts
8. **Live deployment URL required**
9. **Public GitHub repository required**
10. **Must follow the challenge requirements** — data storytelling, not a list

---

## Part 2 — FAIE Evaluator Rules (From Prior Submission Post-Mortem)

The FAIE engine is a **static code analyzer**, not a headless browser. It scans for structural signals rather than executing the app. Prior submission scored 0.00 because it was a single vanilla `index.html`.

### Must-do (evaluator rewards these)

- **Framework:** React (or Vue/Svelte) — vanilla JS scores near-zero on multiple categories
- **Multiple component files** in `src/components/` — target 15+
- **TypeScript** with strict mode
- **Real `package.json`** with dependencies the analyzer can parse
- **README.md** in repo root — this alone moved Documentation from 0% → 63.2% previously
- **Supporting docs:** PRD, architecture, rules, design, tasks, memory
- **Commit history** — commit every 20 minutes with descriptive messages
- **`data-testid` on every interactive element** — bot interaction signal
- **Visible text on every button** — no icon-only actions
- **Native `<input type="checkbox">`** — do not style away with `appearance: none`
- **Deploy to Vercel or Netlify** via Git integration, not drag-and-drop only

### Must-avoid (evaluator punishes these)

- **Single-file `index.html`** — kills Architecture, Functionality, Innovation scores
- **Vanilla JS with direct DOM manipulation**
- **CDN `<script src="https://...">` imports** — flagged as non-project
- **`<dialog>` modals** — bots struggle with native modals
- **Entry animations that delay DOM visibility** — bots click before rows appear
- **Icon-only primary buttons** — bot cannot identify
- **`appearance: none` checkboxes** — some bots fail to click

### Submission strategy (3 attempts)

| Attempt | When | Purpose |
|---|---|---|
| #1 | 10:15 | Establish live URL with placeholder — safety net |
| #2 | 14:00 | Working app — read score report to identify weak categories |
| #3 | 15:45 | Apply surgical fixes based on report |

---

## Part 3 — Engineering Standards (Self-Imposed)

### TypeScript

- `strict: true` in `tsconfig.json`
- No `any` unless justified in a comment
- Discriminated unions for multi-variant data
- Explicit return types on exported functions

### JavaScript

- No `var` — only `const` and `let`
- No `console.log` in shipped code — `console.warn` allowed for skipped rows
- Named exports for components (easier for tree-shaking and refactoring)
- Async/await over `.then()` chains where possible

### React

- Function components only
- One component per file
- Custom hooks prefixed with `use`
- No prop drilling beyond 2 levels — use Zustand
- `React.memo` only when profiling shows a need

### CSS

- Tailwind utility classes preferred
- Custom CSS only for animations Tailwind can't express
- No inline `style` except for dynamic values (chart dimensions, progress)
- CSS variables for theme tokens

### Component Contract

Every component must:
- Accept a typed `Props` interface
- Export as a named export
- Be independently testable (no hidden global dependencies)
- Have a `data-testid` on its root if it's interactive
- Pass `aria-label` if any control is icon-only

### Interaction Rules (FAIE-critical)

- Every button has visible text OR `aria-label` AND `data-testid`
- Primary actions (Add, Delete, Submit, Close) always show text
- No `<dialog>` — use slide-in panels or inline confirmation
- No entry animations longer than 100ms on newly added DOM
- Native form controls (input, select, checkbox) preferred

### Accessibility

- Semantic HTML — `<main>`, `<section>`, `<nav>`, `<article>`
- Every `<input>` and `<select>` has a `<label>`
- Every icon-only button has `aria-label`
- Focus rings visible on all interactive elements
- Keyboard navigable — arrow keys for chapters, Esc closes panels
- `prefers-reduced-motion` respected
- WCAG AA contrast in both themes

### Documentation

- Every exported function has JSDoc with `@param` and `@returns`
- Complex algorithms get inline comments explaining the *why*
- `README.md` at repo root with concept, tech stack, how to run
- Six supporting docs at repo root

### Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`
- Commit every 20 minutes during active development
- Push after every commit (no local-only branches)
- No `node_modules`, `dist`, or `.env` in Git

### Deployment

- Every push to `main` triggers Vercel deploy
- GitHub Pages redeploys on push
- Both URLs tested in incognito before each submission
- Zero console errors on live URL before submitting

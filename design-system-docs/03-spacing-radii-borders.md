# Design System — Spacing, Radii, Borders, Elevation (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Source of truth target:** Figma Number Variables.
**Code origin:** inline values across `src/components/` and `src/screens/` + helpers in `src/utils/ResponsiveScreen.tsx`.

---

## 1. Spacing — current reality

**30+ distinct numeric values** used for padding/margin/gap across the codebase. Many wrapped in `* widthRatio` or `* heightRatio` (from `ResponsiveScreen.tsx`, baseline 430×932).

Frequency snapshot (most common numeric values):

| Value | Padding uses | Margin uses | Likely purpose |
|---|---|---|---|
| 4 | few | 13 | Tight stack (inline chips, icon + text) |
| 6 | few | 9 | Rare — mostly drift |
| 8 | 7 | 8 | Compact stack |
| 10 | 15 | 18 | Close spacing |
| 12 | 8 | 21 | Default inner spacing |
| 14 | 7 | 19 | Drift (not a clean step) |
| 16 | 9 | 13 | Default page/card padding |
| 18 | 8 | few | Drift |
| 20 | 32 | few | Primary page padding — heaviest single value |
| 22 | 6 | few | Drift |
| 24 | 5 | few | Large padding |
| 27, 28, 32, 40 | scattered | scattered | Section spacing, headers |

Plus many one-off values: 2, 3, 5, 7, 11, 13, 15, 17, 19, 23, 26, 30, 34, 36, 38, 44, 48, 56, 64, 80, 100+.

---

## 2. Proposed spacing scale

Collapse to **9 tokens** on a 4-px base (with `2` as a micro-step).

| Token | Value (px) | Typical use |
|---|---|---|
| `space/2xs` | 2 | Icon-to-label nudge |
| `space/xs` | 4 | Tight inline |
| `space/sm` | 8 | Compact stack |
| `space/md` | 12 | Default inside components |
| `space/lg` | 16 | Default between components |
| `space/xl` | 20 | Page horizontal padding |
| `space/2xl` | 24 | Section spacing |
| `space/3xl` | 32 | Screen section breaks |
| `space/4xl` | 40 | Hero/empty-state spacing |

**Values to kill in code (odd steps):** 6, 14, 15, 17, 18, 19, 22, 26, 27. Each should migrate to the nearest scale step.

---

## 3. Responsive scaling

`src/utils/ResponsiveScreen.tsx` exposes `wp()`, `hp()`, `widthRatio`, `heightRatio`. Currently applied inconsistently — some components wrap their spacing with `* heightRatio`, others don't.

**Recommendation:** Don't bake ratios into design tokens. Keep tokens as raw numbers. Apply responsive scaling via a single `scale()` helper in code, consistently at the consumption site.

---

## 4. Border radii — current reality

17 distinct radius values. Most common: 8 (6×), 12 (3×), 20 (3×), 28 (4×), 40 (6×).

Raw inventory:
`0, 4, 6, 8, 10, 12, 13, 14, 18, 19, 20, 24, 26, 28, 40, 50, 54, 200+`.

Recommendation:

| Token | Value | Use |
|---|---|---|
| `radius/none` | 0 | Flat (toasts, full-width hits) |
| `radius/xs` | 4 | Inline code, small chips |
| `radius/sm` | 8 | Default button, input, code block |
| `radius/md` | 12 | Cards, meal rows |
| `radius/lg` | 20 | Tables, charts |
| `radius/xl` | 28 | Settings cards, empty-state containers |
| `radius/2xl` | 40 | Hero cards, progress wheels |
| `radius/pill` | 999 | Pills, circular buttons (was hardcoded 50/54/200) |

**Kill in code:** 6, 10, 13, 14, 18, 19, 24, 26, 50, 54, 200.

---

## 5. Borders (strokes)

Two widths in the wild: `1` (everywhere) and `2` (rare). One odd `4 * widthRatio` in `ConnectGarmin.tsx`.

Recommendation:

| Token | Value |
|---|---|
| `border/hairline` | 1 |
| `border/emphasis` | 2 |

Kill the `4 * widthRatio` exception.

---

## 6. Elevation / shadows

Only 6 screens/components use shadows, with inconsistent config:

| File | Opacity | Radius | Elevation (Android) |
|---|---|---|---|
| `chartStyles.ts` | 0.04 | 3 | 1 |
| `LoggingDetails.tsx`, `Logging.tsx` | 0.1 | 5 | 2 |
| `Version.tsx` | 0.1–0.2 | 3 | 3 |
| `CoachPlan/NowMarker.tsx` | 0.3 | 4 | 3 |
| `Chat.tsx` (input bar) | 1.0 | 4 | 4 |
| `Onboarding.tsx` | — | — | 20 |

Shadow color mostly `#000`, but `Chat.tsx` uses `#DAD5C7` (warm) and one uses `#007AFF`.

Recommendation — **5 elevation tokens**:

| Token | shadowColor | opacity | radius | elevation |
|---|---|---|---|---|
| `elevation/0` | — | 0 | 0 | 0 |
| `elevation/1` | `#000` | 0.04 | 3 | 1 |
| `elevation/2` | `#000` | 0.08 | 6 | 2 |
| `elevation/3` | `#000` | 0.12 | 10 | 4 |
| `elevation/modal` | `#000` | 0.24 | 24 | 20 |

Resolve the warm `#DAD5C7` shadow on Chat input — decide if it's intentional (warm surface) or drift.

---

## 7. Figma build plan

1. **Number Variables collection** with groups: `space/`, `radius/`, `border/`.
2. **Effect Styles** for elevation tokens.
3. Verify by rebuilding one real screen (e.g. Meals) in Figma using only tokens — if any value doesn't have a token, either add one or resolve the drift.

---

## 8. Decisions to answer (park in Figma sticky)

1. **Base unit: 4 or 8?** Current code has both.
2. **Is `space/2xs` (2px) worth a token**, or fold into 4px?
3. **Responsive scaling placement** — in tokens (Figma numbers wrapped) or in code only?
4. **Shadow color** — always `#000`, or does Ottavia's warm palette want a warm shadow on beige surfaces?
5. **`radius/pill` named `pill` or `full`?**

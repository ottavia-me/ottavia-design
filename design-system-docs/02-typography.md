# Design System — Typography (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Source of truth target:** Figma "In Work - Design System O" (Text Styles to be built).
**Code origin:** `src/utils/MarkdownStyles.ts` (declared scale) + screen/component drift.

---

## 1. Declared type scale (from `MarkdownStyles.ts`)

| Token (proposed) | Family | Size | Line height | Letter spacing | Current usage |
|---|---|---|---|---|---|
| `DISPLAY_1` | SFProDisplay-Semibold | 28 | 36 | 0 | h1 in markdown |
| `DISPLAY_2` | SFProDisplay-Semibold | 24 | 32 | 0 | h2 |
| `DISPLAY_3` | SFProDisplay-Semibold | 22 | 31 | 0 | h3 |
| `TITLE` | SFProDisplay-Semibold | 20 | 30 | 0 | h4–h6 |
| `BODY` | SFProDisplay-Regular | 18 | 26 | 0.2 | paragraph, user bubble |
| `BODY_EMPHASIS` | SFProDisplay-Semibold | 18 | 28 | 0 | baseText / customSentence |
| `TABLE_HEAD` | SFProDisplay-Semibold | 16 | 20 | 0 | `th` |
| `TABLE_CELL` | SFProDisplay-Regular | 16 | 18 | 0 | `td` |
| `CODE_INLINE` | Menlo | 18 | — | 0 | inline code |
| `CODE_BLOCK` | Menlo | 14 | 21 | 0 | code fence |

**Finding:** The declared scale only covers markdown output. It does NOT define Button labels, Caption, Footnote, Input, Overline — which the app uses heavily.

---

## 2. Undeclared fonts in use (major drift)

| Family | Raw uses | Status |
|---|---|---|
| `SFProDisplay-Semibold` | 47 | ✅ Declared |
| `SFProDisplay-Regular` | 16 | ✅ Declared |
| `Menlo` | 2 | ✅ Declared |
| `SFUIDisplay-SemiBold` | 39 | 🚨 Undeclared — legacy SF variant |
| `SFUIDisplay-Regular` | 33 | 🚨 Undeclared |
| `SFUIDisplay-Medium` | 18 | 🚨 Undeclared |
| `SFPro-Regular` | 28 | 🚨 Undeclared |
| `SFPro-Light` | 27 | 🚨 Undeclared — no Light in declared scale at all |
| `SFPro-Semibold` | 1 | 🚨 Undeclared |
| `SFProDisplay-Medium` | 2 | 🚨 Undeclared |
| `SFProDisplay-Bold` | 1 | 🚨 Undeclared |
| `SFProDisplay-RegularItalic` | used | ⚠️ In markdown only |
| `Poppins-*` | 7 | 🚨 Undeclared — legacy serif, probably dead code |
| `Archivo`, `Recoleta`, `New Spirit` | in `assets/fonts/` | 🚨 Installed but not referenced in src |

**Headline:** Three SF families (SFProDisplay, SFPro, SFUIDisplay) with overlapping weights are being used interchangeably. This is the #1 typography-drift issue.

---

## 3. Font sizes found — full distribution

17 distinct fontSize values in use: `10, 12, 13, 14, 15, 15.5, 16, 17, 18, 19, 20, 22, 24, 26, 28, 29, 32`.

**Top by frequency:** 16 (35x), 18 (26x), 14 (22x), 13 (20x).

**15.5 and 29 are almost certainly accidents.** No good reason for either.

---

## 4. Line heights — distribution

15 distinct values. Most sizes have 2–4 different line heights associated with them across the codebase, even when the size is identical. e.g., `fontSize: 18` appears with `lineHeight: 26, 28, 32, 24`.

**Drift cause:** no shared text-style objects; every component restates size+lineHeight inline.

---

## 5. Proposed clean scale (recommendation)

Collapse 17 sizes → **8 tokens**. One family, four weights.

| Token | Family | Weight | Size | Line height | Purpose |
|---|---|---|---|---|---|
| `display/lg` | SFProDisplay | Semibold | 28 | 36 | Screen titles, h1 |
| `display/md` | SFProDisplay | Semibold | 24 | 32 | Section titles, h2 |
| `display/sm` | SFProDisplay | Semibold | 22 | 30 | h3 |
| `title` | SFProDisplay | Semibold | 20 | 28 | h4–h6, card titles |
| `body/lg` | SFProDisplay | Regular | 18 | 26 | Default body, chat bubbles |
| `body/md` | SFProDisplay | Regular | 16 | 22 | Secondary body, table cells, inputs |
| `label` | SFProDisplay | Semibold | 14 | 20 | Buttons, labels, tags |
| `caption` | SFProDisplay | Regular | 13 | 18 | Timestamps, metadata, chart axes |

Plus **emphasis variants** (Semibold 18 → `body/lg/emphasis`) and **italic variant** for markdown `em`.

Monospace: `code/inline` (Menlo 18/22), `code/block` (Menlo 14/21).

---

## 6. Figma build plan (for when we get there)

1. Create Text Styles in Figma exactly matching the 8 tokens above. Naming: `display/lg`, `display/md`, …
2. Add emphasis/italic variants.
3. Map each COMPONENT's current font usage to a token → record remaining gaps.
4. Once tokens are live in Figma, a separate engineering ticket migrates `SFUIDisplay*` / `SFPro-*` / `Poppins-*` → `SFProDisplay-*`.

---

## 7. Decisions to answer (park in Figma sticky)

1. **One family or two?** Keep only SFProDisplay and kill SFPro/SFUIDisplay — or is one of those intentionally used for a specific role (metadata, labels)?
2. **Do we need `SFPro-Light`?** 27 uses → some real purpose, or legacy?
3. **`Poppins-*` (7 uses)** — delete entirely, or keep for a specific surface (e.g. the `Me` screen)?
4. **Unused installed fonts** — Archivo, Recoleta, New Spirit are in `assets/fonts/` but not used. Remove from bundle, or keep staged for future use?
5. **Button/Input/Tag tokens** — declared scale doesn't cover them. Confirm proposed `label` (14/20 Semibold) is right, or does a Button want its own `button/lg`, `button/md`, `button/sm`?
6. **Caption size** — 13 or 12? (13 is more common in current code; 12 is cleaner on the scale.)

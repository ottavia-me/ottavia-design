# Design System — Colors (Source of Truth)

**Status:** Audit draft, 2026-04-21
**Source of truth:** Figma file *"In Work - Design System O"* (being built). This doc is the bridge from code → Figma.
**Code origin:** `ottavia-client/src/utils/MarkdownStyles.ts` → `COLORS`

---

## How to read this doc

For every color in the system:
- ✅ **Defined** — lives in `COLORS` as a token.
- ⚠️ **Drift** — same (or near-same) hex also appears inlined in code. Needs cleanup.
- 🆕 **Undefined** — hex used in code with no matching token. Must decide: add a token, or remove/replace.

Numbers in parentheses = count of raw hex occurrences found across `src/`.

---

## 1. Neutral — Primary scale

The core text + surface scale. Warm-grey, brand-aligned.

| Token | Hex | Raw-hex uses | Status | Intent |
|---|---|---|---|---|
| `PRIMARY_80` | `#433E36` | 11 | ⚠️ Drift | Body text, headings, primary icons |
| `PRIMARY_70` | `#5C564D` | 5 | ⚠️ Drift | Inline code text |
| `PRIMARY_60` | `#766F64` | 11 | ⚠️ Drift | Secondary text, muted affordances |
| `PRIMARY_50` | `#8F897D` | 9 | ⚠️ Drift | Tertiary text |
| `PRIMARY_40` | `#A8A297` | 1 | ⚠️ Drift | Muted / very secondary |
| `PRIMARY_30` | `#C2BCB2` | 6 | ⚠️ Drift | Bullets, borders, hr |
| `PRIMARY_20` | `#DBD6CD` | 8 | ⚠️ Drift | Code bg, table header bg |
| `PRIMARY_10` | `#F5F1EA` | **123** | 🚨 Severe drift | App background |

**Finding:** `PRIMARY_10` (`#F5F1EA`) is the single biggest source of inline hex — 123 occurrences. Almost every screen sets its own background instead of consuming the token.

---

## 2. Accent — Terracotta

Ottavia's warm accent. Used sparingly for primary actions, active states.

| Token | Hex | Raw uses | Status | Intent |
|---|---|---|---|---|
| `TERRACOTTA_60` | `#A17A5B` | 1 | ⚠️ Drift | Primary accent, active states |
| `TERRACOTTA_30` | `#C4A08E` | 1 | ⚠️ Drift | Hover / muted accent |
| `TERRACOTTA_10` | `#F5E6DC` | 1 | ⚠️ Drift | Accent background |

---

## 3. Semantic — status colors

| Token | Hex | Raw uses | Status | Intent |
|---|---|---|---|---|
| `RED_60` | `#F76642` | 2 | ⚠️ Drift | Errors, destructive |
| `RED_30` | `#FBA88E` | 1 | ⚠️ Drift | Error muted |
| `RED_10` | `#FFE5E5` | 2 | ⚠️ Drift | Error background |
| `YELLOW_30` | `#FCE7B5` | 2 | ⚠️ Drift | Warnings, highlights |
| `YELLOW_10` | `#FEF6E3` | 1 | ⚠️ Drift | Warning background |
| `LINK` | `#3B82F6` | 1 | ⚠️ Drift | Hyperlinks |
| `MARK` | `#FCE7B5` | 2 | ⚠️ Drift | Highlighted text (duplicate of YELLOW_30 hex) |

**Finding:** `MARK` and `YELLOW_30` are the **same hex** (`#FCE7B5`) under two token names. Decision needed: consolidate or keep both for semantic clarity.

---

## 4. Domain — Hydration

| Token | Hex | Raw uses | Status |
|---|---|---|---|
| `HYDRATION_BG` | `#DBEFFA` | 3 | ⚠️ Drift |
| `HYDRATION_BORDER` | `#92B7CE` | 3 | ⚠️ Drift |
| `HYDRATION_TITLE` | `#3A647E` | 3 | ⚠️ Drift |
| `HYDRATION_TEXT` | `#689BBB` | 3 | ⚠️ Drift |

## 5. Domain — Activity

| Token | Hex | Raw uses | Status |
|---|---|---|---|
| `ACTIVITY_BG` | `#F9EFE0` | 3 | ⚠️ Drift |
| `ACTIVITY_BORDER` | `#E2C191` | 3 | ⚠️ Drift |
| `ACTIVITY_TITLE` | `#C08A48` | 2 | ⚠️ Drift |
| `ACTIVITY_TEXT` | `#D4A163` | 3 | ⚠️ Drift |

## 6. Domain — Nutrition

| Token | Hex | Raw uses | Status |
|---|---|---|---|
| `NUTRITION_BG` | `#D7F4E8` | 4 | ⚠️ Drift |
| `NUTRITION_BORDER` | `#83BD96` | 3 | ⚠️ Drift |
| `NUTRITION_TITLE` | `#4B8F61` | 3 | ⚠️ Drift |
| `NUTRITION_TEXT` | `#58A471` | 3 | ⚠️ Drift |

## 7. Domain — Recovery

| Token | Hex | Raw uses | Status |
|---|---|---|---|
| `RECOVERY_BG` | `#E7EBFF` | 1 | ⚠️ Drift |
| `RECOVERY_BORDER` | `#8292D5` | 4 | ⚠️ Drift |
| `RECOVERY_TITLE` | `#58669D` | 3 | ⚠️ Drift |
| `RECOVERY_TEXT` | `#8292D5` | 4 | ⚠️ Drift (same hex as border) |

**Finding:** `RECOVERY_BORDER` and `RECOVERY_TEXT` share `#8292D5` — same issue as `MARK`/`YELLOW_30`.

---

## 8. 🚨 Undefined colors — used in code, NO token

These hex values appear in code but have **no corresponding `COLORS` token**. Each needs a decision: add to tokens, or replace with an existing token.

### High-impact rogues (used 5+ times)

| Hex | Uses | Likely intent | Decision needed |
|---|---|---|---|
| `#FFFFFF` / `#FFF` | 74 | Pure white — card bg, modal bg | **Add `WHITE` token** |
| `#000000` / `#000` | 70 | Pure black — shadows, text | **Add `BLACK` token** (or token for shadows specifically) |
| `#4B4740` | 15 | Dark neutral (sits between PRIMARY_80 and PRIMARY_70) | Replace with `PRIMARY_80` or add as new step |
| `#427EF7` | 14 | Blue CTA / active — NOT the same as `LINK` (`#3B82F6`) | **Resolve: one blue or two?** |
| `#ACA391` | 13 | Mid-neutral (between PRIMARY_40 and PRIMARY_50) | Replace or add step |
| `#56B683` | 12 | Green — similar to but not matching nutrition tokens | Replace with `NUTRITION_*` or add `SUCCESS` |
| `#1E1E1E` | 9 | Near-black — shadow/overlay? | Replace with `BLACK` or add overlay token |
| `#F1F1F1` | 6 | Near-white neutral | Replace with `PRIMARY_10` or add |
| `#665B54` | 5 | Dark neutral | Replace with `PRIMARY_70` |
| `#007AFF` | 5 | iOS system blue — likely native UI | Flag as system color, keep out of brand scope |

### Medium rogues (2–4 uses)

`#E7DFD0` (4), `#E0ECFF` (4), `#DFD6C4` (4), `#6D6558` (4), `#3C3C4399` (4 — iOS system overlay), `#9B877B` (3), `#8E8E93` (3 — iOS grey), `#69A1D8` (3), `#453F33` (3), `#333` (3), `#292929` (3), `#FBF5EC`, `#F2EFE9`, `#F6EFE3`, `#F0EBE2`, `#F3EBDF`, `#EFE6D8`, `#F2E7D7`, `#F0E4D0`, `#ECE4D6` (all warm off-whites competing with `PRIMARY_10`), plus many more.

### Full tail (1 use each)

~90 additional one-off hexes found — listed in Appendix below.

**Finding:** The codebase has a **warm off-white ladder** emerging organically (10+ near-`#F5F1EA` values) that should be collapsed into the token scale or named explicitly.

---

## Summary — what we're carrying

| Category | Defined tokens | Raw hex in code (distinct) | Raw hex occurrences |
|---|---|---|---|
| Neutrals | 8 | ~25 | 300+ |
| Terracotta | 3 | 3 | 3 |
| Semantic (red/yellow/link/mark) | 7 | ~6 | 12 |
| Domain (4 scales × 4) | 16 | 16 | ~45 |
| White | 0 | 2 | 74 |
| Black | 0 | 2 | 70 |
| iOS system | 0 | ~6 | ~20 |
| Other rogues | 0 | ~70 | ~120 |
| **Total** | **34** | **~130** | **~650** |

---

## Decisions to make (before building in Figma)

1. **Add `WHITE` and `BLACK` tokens?** (Strong yes — 144 occurrences.)
2. **One blue or two?** `LINK` (`#3B82F6`) vs `#427EF7` — same purpose or different?
3. **Consolidate hex-duplicate tokens?** `MARK`==`YELLOW_30`, `RECOVERY_BORDER`==`RECOVERY_TEXT`.
4. **Warm off-white ladder** — collapse to `PRIMARY_10` or keep a layered surface scale (e.g. `SURFACE_RAISED`, `SURFACE_SUNKEN`)?
5. **Shadow/overlay token** — the many near-black values (`#000000A1`, `#1E1E1E`, `#3C3C4399`) suggest a need for a `SHADOW` or `OVERLAY` token, not raw black.
6. **Naming scheme for Figma** — match code (`PRIMARY_80`) exactly, or introduce semantic aliases (`text/body`, `surface/base`, `action/primary`)?

---

## Next step

Once you review and answer the decisions above, we:
1. Finalize the token list
2. Build the corresponding **Color Variables** in Figma ("In Work - Design System O"), grouped by scale (Neutral → Accent → Semantic → Domain → Surface → System)
3. Screenshot-verify each group
4. Move to Step 2 — Typography

---

## Appendix — full raw-hex inventory

Stored in code-audit scan: 130 distinct hex values, ~650 total occurrences. Full list available on request; top entries captured above.

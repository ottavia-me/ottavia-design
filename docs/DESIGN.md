---
version: alpha
name: Ottavia
description: Canonical design system for Ottavia — a personal reasoning system for wellbeing. This file is the source of truth. Figma, the Playground (ottavia-design), and Code (ottavia-client) are implementations of it.
status: in-progress
completeness: 45%
owners:
  decisions: Builder (Vika)
  drafting: PDA (Product Designer Agent)
  parity: PDA (weekly audit)

colors:
  # ---------- TEXT ----------
  text.primary:
    value: "#433E36"
    status: stable
    usage: Headings, body text, primary content
  text.secondary:
    value: "#A8A297"
    status: stable
    usage: Labels, subtitles, metadata, dates
  text.muted:
    value: "#8F897D"
    status: stable
    usage: Body/Muted text style, de-emphasized content
  text.tertiary:
    value: "#C2BCB2"
    status: stable
    usage: Placeholders, disabled text, hints
  text.inverse:
    value: "#FFFFFF"
    status: stable
    usage: Text on dark backgrounds
  text.link:
    value: "#427EF7"
    status: stable
    usage: Clickable links, interactive text

  # ---------- SURFACE ----------
  surface.background:
    value: "#F5F1EA"
    status: stable
    usage: Main app background (cream)
  surface.card:
    value: "#FFFFFF"
    status: stable
    usage: Card backgrounds, elevated content
  surface.subtle:
    value: "#F0EBE2"
    status: stable
    usage: Table headers, section backgrounds
  surface.dark:
    value: "#8F897D"
    status: stable
    usage: Dark headers, overlays
  surface.overlay:
    value: "rgba(0,0,0,0.5)"
    status: stable
    usage: Modal overlays, loading screens

  # ---------- DATA DOMAINS ----------
  data.hydration:
    value: "#3A647E"
    status: stable
    usage: Hydration cards, water tracking (title/icon)
  data.hydration.subtle:
    value: "#DBEFFA"
    status: stable
    usage: Hydration card backgrounds
  data.activity:
    value: "#9A6E3A"
    status: stable
    usage: Activity cards, exercise tracking (title/icon)
  data.activity.subtle:
    value: "#F9EFE0"
    status: stable
    usage: Activity card backgrounds
  data.nutrition:
    value: "#3A7A4E"
    status: stable
    usage: Nutrition cards, meal tracking (title/icon)
  data.nutrition.subtle:
    value: "#D7F4E8"
    status: stable
    usage: Nutrition card backgrounds
  data.recovery:
    value: "#58669D"
    status: stable
    usage: Recovery cards, rest tracking (title/icon)
  data.recovery.subtle:
    value: "#E7EBFF"
    status: stable
    usage: Recovery card backgrounds

  # ---------- STATUS ----------
  status.success:
    value: "#56B683"
    status: stable
    usage: Positive states, on-track
  status.success.subtle:
    value: "#E1F9EB"
    status: stable
    usage: Success backgrounds, achievement chips
  status.warning:
    value: "#E4763A"
    status: stable
    usage: Chronic conditions, attention needed
  status.warning.subtle:
    value: "#FFD1B8"
    status: stable
    usage: Warning backgrounds, condition chips
  status.error:
    value: "#FF755D"
    status: stable
    usage: Delete actions, destructive states
  status.highlight:
    value: "#FCE7B5"
    status: stable
    usage: Chat highlights, ==mark== in markdown

  # ---------- BORDER ----------
  border.default:
    value: "#E7DFD0"
    status: stable
    usage: Card borders, chart borders
  border.subtle:
    value: "#F0EBE4"
    status: stable
    usage: Dividers, light separators
  border.strong:
    value: "#CBAC9B"
    status: stable
    usage: Active borders, selected states

typography:
  font.primary:
    fontFamily: SF Pro Display
    status: stable
    usage: All UI text — headings, body, labels, metrics

  body-regular:
    fontFamily: SFProDisplay-Regular
    fontSize: 18px
    lineHeight: 26px
    letterSpacing: 0.2px
    fontWeight: "400"
    status: stable
  body-bold:
    fontFamily: SFProDisplay-Semibold
    fontSize: 18px
    lineHeight: 26px
    letterSpacing: 0.2px
    fontWeight: "600"
    status: stable
  body-muted:
    fontFamily: SFProDisplay-Regular
    fontSize: 18px
    lineHeight: 26px
    letterSpacing: 0.2px
    fontWeight: "400"
    textColor: "{colors.text.muted}"
    status: stable
  heading-h2:
    fontFamily: SFProDisplay-Semibold
    fontSize: 24px
    lineHeight: 32px
    fontWeight: "600"
    status: stable
  heading-h3:
    fontFamily: SFProDisplay-Semibold
    fontSize: 22px
    lineHeight: 31px
    fontWeight: "600"
    status: stable
  heading-h4:
    fontFamily: SFProDisplay-Semibold
    fontSize: 20px
    lineHeight: 30px
    fontWeight: "600"
    status: stable

weights:
  weight.regular:
    value: "400"
    file: SFProDisplay-Regular
    status: stable
  weight.medium:
    value: "500"
    file: SFProDisplay-Medium
    status: stable
  weight.semibold:
    value: "600"
    file: SFProDisplay-Semibold
    status: stable

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  "2xl": 24px
  "3xl": 32px
  "4xl": 48px

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 24px
  full: 9999px

shadows:
  shadow.card:
    shadowColor: "#000000"
    offset: "0 0"
    opacity: 0.1
    radius: 5
    elevation: 2
    status: stable
  shadow.elevated:
    shadowColor: "#000000"
    offset: "0 2px"
    opacity: 0.1
    radius: 3
    elevation: 3
    status: stable
  shadow.scroll:
    shadowColor: "#DAD5C7"
    offset: "0 2px"
    opacity: 1
    radius: 4
    elevation: 4
    status: stable
  shadow.action:
    shadowColor: "#007AFF"
    offset: "0 2px"
    opacity: 0.2
    radius: 3
    elevation: 3
    status: stable

motion:
  duration.fast: 150ms
  duration.base: 250ms
  duration.slow: 400ms
  easing.standard: "cubic-bezier(0.4, 0, 0.2, 1)"
  easing.decelerate: "cubic-bezier(0, 0, 0.2, 1)"
  easing.accelerate: "cubic-bezier(0.4, 0, 1, 1)"
  status: proposed

responsive:
  base.width: 430
  base.height: 932
  helpers:
    - widthRatio
    - heightRatio
    - wp
    - hp
  source: src/utils/ResponsiveScreen.tsx
  status: stable

components:
  # ---------- ATOMS ----------
  text-body:
    typography: "{typography.body-regular}"
    textColor: "{colors.text.primary}"
    status: stable
  text-link:
    typography: "{typography.body-regular}"
    textColor: "{colors.text.link}"
    textDecoration: underline
    status: stable

  # ---------- MOLECULES ----------
  stat-card:
    backgroundColor: "{colors.surface.card}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.border.default}"
    status: stable
    source: src/components/StatCard.tsx
  macros-card:
    backgroundColor: "{colors.surface.card}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    status: stable
    source: src/components/MacrosCard.tsx
  bottom-sheet:
    backgroundColor: "{colors.surface.card}"
    rounded: "{rounded.xl}"
    status: stable
    source: src/components/BottomSheet.tsx

  # ---------- COMING ----------
  conditions-card:
    status: in-progress
    source: src/components/ConditionsCard.tsx
  meal-expandable-card:
    status: in-progress
    source: src/components/MealExpandableCard.tsx
---

## Overview

Ottavia's design system serves a personal reasoning system for wellbeing. The primary interface is conversational (chat); supporting screens render structured health data (sleep, activity, nutrition, HRV, body composition). Tone is calm, premium, and grounded — health information must feel trustworthy, not alarming.

**Visual language.** Warm cream foundation with muted earth-tone domain colors. Avoid the loud "fitness app" aesthetic — Ottavia is not a coach screaming at you, it's a reasoning partner that explains what your body is doing. White cards on cream background create gentle hierarchy without harsh contrast.

**Principles.**
- **Trust over cleverness.** Never overstate. Hedge when uncertain. Cite when grounded.
- **Specificity over generic.** Every number is rooted in actual user data.
- **Consistency over novelty.** Reliable patterns over surprising gimmicks.
- **Data-aware, not data-hungry.** Use what's relevant. Don't show everything because you can.
- **No medical claims.** Never diagnose, prescribe, or use clinical-warning visual language.

## Colors

The palette is anchored in a warm neutral scale and segmented by **domain** (hydration, activity, nutrition, recovery) and **status** (success, warning, error, highlight). Domain colors carry meaning — never use `data.activity` to indicate success, or `status.warning` for a nutrition card.

### Text
Six text roles cover all UI. Default to `text.primary` for content, `text.secondary` for labels and metadata, `text.muted` for de-emphasized inline text, `text.tertiary` for placeholders and disabled states. `text.link` is the only color that signals interactive text.

### Surface
Three layers: `surface.background` (the cream app canvas), `surface.card` (white cards floating on the canvas), `surface.subtle` (table headers, secondary backgrounds). `surface.dark` is reserved for inverse surfaces. `surface.overlay` is the only legitimate use of a black-with-alpha — for modal scrims.

### Domain (data)
Each health domain has a paired token: a saturated color for titles/icons (`data.hydration`) and a desaturated background (`data.hydration.subtle`). The subtle variant is the card background; the saturated variant is for the title row and the icon. Never invert this — saturated backgrounds are reserved for alerts.

### Status
`status.success` (green) for on-track. `status.warning` (orange) for chronic conditions and attention. `status.error` (coral red) for destructive actions only. `status.highlight` (soft yellow) for `==mark==` and emphasis in chat — not for alerts.

### Border
Three weights: `border.subtle` (dividers), `border.default` (card borders), `border.strong` (selected/active states).

## Typography

**One family: SF Pro Display.** No secondary typeface. The system relies on weight (400 / 500 / 600) and size to create hierarchy — never color or font swap. Italic is reserved for `<em>` in chat markdown; never for UI labels.

**Scale (stable):**
- Body (regular, bold, muted) — 18px / 26 line height / 0.2 letter spacing
- Heading H2 — 24px semibold
- Heading H3 — 22px semibold
- Heading H4 — 20px semibold

**To define (in-progress):**
- Heading H1 (currently 28px in code; not in playground spec — decision needed)
- Label / caption / small (12-14px tier)
- Numeric display (large metric reads — needed for HRV, sleep duration, etc.)

## Layout & Spacing

**Eight-step scale.** All padding, margins, and gaps come from the scale: `xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 48`. No arbitrary values in `.tsx` files — if a value isn't on the scale, the scale is wrong.

**Defaults:**
- Card internal padding — `lg` (16px)
- Card-to-card gap — `md` (12px)
- Screen horizontal padding — `xl` (20px)
- Section separation — `2xl` (24px)
- Screen top/bottom padding — `4xl` (48px)

**Responsive.** All layout dimensions use `widthRatio` / `heightRatio` / `wp()` / `hp()` from `src/utils/ResponsiveScreen.tsx`. Base reference device: 430 × 932 (iPhone 14 Pro). Never write raw pixel values for layout.

## Elevation & Depth

Depth comes from soft white cards on cream, separated by `shadow.card` (default) or `shadow.elevated` (modals, sheets). `shadow.scroll` is a directional shadow indicating a scrollable region has content beyond the fold. `shadow.action` is reserved for primary CTAs (rare).

Avoid harsh borders. Avoid stacked shadows. Avoid dark surfaces except `surface.dark` (specific cases only).

## Shapes

Five radii: `sm 4 · md 8 · lg 12 · xl 24 · full 9999`. The system is rounded — every card uses `xl`, every button uses `md`. `full` is for pills, chips, toggles, and avatars only.

**Stroke weight.** Borders are 1px. Never 2px or thicker — that reads as alert/warning, not as structure.

## Motion

*Status: proposed — needs Builder review.*

**Duration tokens.** `fast 150ms` for micro-interactions (tap feedback, toggle). `base 250ms` for standard transitions (sheet open, screen transition). `slow 400ms` for emphasis (success confirmations, illustrative reveals).

**Easing.**
- `easing.standard` — most transitions
- `easing.decelerate` — enter / appear
- `easing.accelerate` — exit / dismiss

**Respect reduced motion.** When `prefers-reduced-motion`, replace motion with instant state changes. Lottie animations should respect the same flag.

## Components

Components live in `src/components/`. Before creating a new one, check the inventory — most needs are met by an existing component with a new variant or prop. Component additions to the system require Builder approval and entry in this file.

**Current inventory (stable):** `StatCard`, `MacrosCard`, `MacroProgressRow`, `MealRow`, `MealExpandableCard`, `BottomSheet`, `Header`, `BlurHeader`, `EmptyStateView`, `NoDataView`, `Ring`, `AnimatedProgressBar`, `ProgressBarChart`, `BarChart`, `LineChart`, `Table`, `Toast`, `OfflineBanner`, `SettingsCard`, `SettingHeader`, `ProfileList`, `List`, `CustomToggle`, `MethodChip`, `ConditionsCard`, `Collapsible`, `BottomSheet`, `BodyBasicPicker`, `WheelPicker`, `AndroidDateWheelPicker`, `OpenCamera`, `RotatingImageBackground`, `Text`, `AddEditButton`, `UpdatePrompt`, `ComposerVoiceWaveform`, `ChatMessagesSkeleton`, `ChatQueueBar`, `RenderChatFooter`, `A11yScrollView`.

**Specs per component** — to be filled in. Each component gets its own block under `components:` in the YAML front matter with `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, and any other relevant tokens — all expressed as references (`{colors.surface.card}`), never raw values.

## Chat & AI Surfaces

The chat is the primary interface. Markdown is the rendering language. The system renders `paragraph · h2 · h3 · h4 · strong · em · ==mark== · ul · ol · table · blockquote · hr · code_inline · fence · link`.

**Vertical rhythm in chat** is governed by element-to-element spacing rules (defined in the playground under "Chat — Spacing rules"). Examples:
- body → body: 12px gap
- body → H2: 26px gap (12 marginBottom on body + 14 marginTop on H2)
- H2 → body: 6px gap
- HR → H2: 30px gap

**Bubble dimensions:** max width 302px, border radius ~22px (wp(6)), horizontal padding 14px, font size 18px, line height 26px, vertical gap between bubbles 18px.

**Anti-patterns:**
- Don't open responses with "Great question!" or "Sure!"
- Don't dump raw numbers without context
- Don't use generic health advice — "drink water and get rest" is never an acceptable response
- Don't over-explain — match length to the question

## Data Visualization

*Status: tbd.*

Charts use `react-native-gifted-charts`. Domain colors apply: a hydration chart uses `data.hydration`, an activity chart uses `data.activity`. Detailed conventions for time ranges (day / 7d / 30d / 90d), axis treatment, sparklines vs detail views, annotation patterns (goal lines, today marker) — to be defined.

## Iconography

Domains covered in the playground:
- Chat — conversation (user bubble, bot markdown, suggestion chips, composer, timestamp, memory events)
- Chat — onboarding (pill stack, check list, progress bar, loading shimmer)
- Profile (app header, settings cards, toggle, preferences list)
- Meals overview (macros card, macro tag rows, chip progress, date picker, day picker)
- Daily summary (chip progress, tip/note card, data charts)
- Settings (toggle, tag metric, check mark, preferences card)
- Garmin connect (app header, check list, progress bar)

Icon style and stroke weight — to be defined.

## Platform

*Status: tbd.*

The app runs on iOS and Android via React Native. Platform divergence (sheets, back gesture, SF Symbols vs Material, haptics) is not yet codified. Default behavior follows React Native conventions until codified here.

## Do's and Don'ts

**Do**
- Use tokens via references (`{colors.text.primary}`), never raw hex.
- Extend existing components before creating new ones.
- Cover all states (empty, loading, populated, error, edge) before declaring a screen done.
- Match build to mock. If the build differs from the mock, flag it.

**Don't**
- Hardcode hex in `.tsx` / `.ts` files. Only exception: `.svg` files where the hex must match a token exactly.
- Use raw pixel values for layout — use the responsive helpers.
- Introduce a typeface other than SF Pro Display.
- Use medical-warning visual language (red flashing, alert icons) — Ottavia informs, it doesn't alarm.

---

## Migration — Old `COLORS` → New tokens

Source of old tokens: `src/utils/MarkdownStyles.ts → COLORS`. This table is the migration plan. Every entry is a candidate PR.

| Old token | New token | Notes |
|---|---|---|
| `COLORS.PRIMARY_80` (#433E36) | `text.primary` | Same hex. Rename only. |
| `COLORS.PRIMARY_70` (#5C564D) | *(no direct equivalent)* | Used for inline code text — keep as-is or fold into `text.muted`. Decision needed. |
| `COLORS.PRIMARY_60` (#766F64) | *(no direct equivalent)* | Used as secondary text in legacy. Map to `text.secondary` (#A8A297) — accept slight visual lift. |
| `COLORS.PRIMARY_50` (#8F897D) | `text.muted` / `surface.dark` | Same hex. Splits by usage. |
| `COLORS.PRIMARY_40` (#A8A297) | `text.secondary` | Same hex. Rename only. |
| `COLORS.PRIMARY_30` (#C2BCB2) | `text.tertiary` | Same hex. Rename only. |
| `COLORS.PRIMARY_20` (#DBD6CD) | *(no direct equivalent)* | Code background, table header. Map to `surface.subtle` (#F0EBE2) — slight color shift, audit required. |
| `COLORS.PRIMARY_10` (#F5F1EA) | `surface.background` | Same hex. Rename only. |
| `COLORS.TERRACOTTA_60` (#A17A5B) | `border.strong` (#CBAC9B) candidate | Terracotta-as-accent doesn't exist in new system. **Builder decision needed:** is there still a primary brand accent? |
| `COLORS.TERRACOTTA_30` (#C4A08E) | *(no direct equivalent)* | See above. |
| `COLORS.TERRACOTTA_10` (#F5E6DC) | *(no direct equivalent)* | See above. |
| `COLORS.RED_60` (#F76642) | `status.error` (#FF755D) | Slight hex shift. Update during migration. |
| `COLORS.RED_30` (#FBA88E) | *(no direct equivalent)* | Audit usage. |
| `COLORS.RED_10` (#FFE5E5) | *(no direct equivalent)* | Audit usage — may map to `status.warning.subtle`. |
| `COLORS.YELLOW_30` (#FCE7B5) | `status.highlight` | Same hex. Rename only. |
| `COLORS.YELLOW_10` (#FEF6E3) | *(no direct equivalent)* | Audit usage. |
| `COLORS.HYDRATION_BG` (#DBEFFA) | `data.hydration.subtle` | Same hex. |
| `COLORS.HYDRATION_BORDER` (#92B7CE) | *(no equivalent)* | Migration may drop or map to `border.default`. |
| `COLORS.HYDRATION_TITLE` (#3A647E) | `data.hydration` | Same hex. |
| `COLORS.HYDRATION_TEXT` (#689BBB) | *(no equivalent)* | Likely deprecated — used for body text in domain cards, replace with `text.primary`. |
| `COLORS.ACTIVITY_BG` (#F9EFE0) | `data.activity.subtle` | Same hex. |
| `COLORS.ACTIVITY_TITLE` (#C08A48) | `data.activity` (#9A6E3A) | Hex shift — audit. |
| `COLORS.NUTRITION_BG` (#D7F4E8) | `data.nutrition.subtle` | Same hex. |
| `COLORS.NUTRITION_TITLE` (#4B8F61) | `data.nutrition` (#3A7A4E) | Hex shift — audit. |
| `COLORS.RECOVERY_BG` (#E7EBFF) | `data.recovery.subtle` | Same hex. |
| `COLORS.RECOVERY_TITLE` (#58669D) | `data.recovery` | Same hex. |
| `COLORS.LINK` (#3B82F6) | `text.link` (#427EF7) | Hex shift — audit. |
| `COLORS.MARK` (#FCE7B5) | `status.highlight` | Same hex. Rename only. |

**Migration order.**
1. Generate a new `COLORS` constant in `src/utils/MarkdownStyles.ts` exposing the new token names (alongside the old ones, both aliased to the same hex where possible).
2. Migrate one component at a time. Old name stays available until all consumers are off it.
3. When a component's migration ships, mark it `status: migrated` here.
4. When zero consumers remain on the old name, delete the old `COLORS.*` alias.

---

## Open Questions (Builder decisions needed)

1. **Brand accent.** The new system has no equivalent to old `TERRACOTTA_60` as a primary accent. Is there still a brand color, or is the system intentionally accent-free?
2. **H1 typography.** Code has H1 at 28px; playground spec stops at H2. Is H1 still in use, and at what size?
3. **Numeric display.** Large metric reads (HRV "62", sleep "7h 24m") need a dedicated type token. What's the size, weight, tracking?
4. **Icon system.** Library, stroke weight, sizes? Currently scattered across screens.
5. **Motion tokens** above are proposed by PDA — Builder to confirm or adjust.
6. **Platform divergence.** What's the policy on iOS-specific patterns (sheets, SF Symbols) vs cross-platform parity?
7. **Dark mode.** Out of scope, or future state? If future, tokens need a second mode.

---

## Status Legend

- `stable` — Documented, validated, safe to use in production
- `in-progress` — Captured here but spec is incomplete; Builder still working on it
- `proposed` — PDA's recommendation, awaiting Builder approval
- `tbd` — Known gap, will be addressed in a future pass
- `deprecated` — Old, slated for removal during migration
- `migrated` — Old token whose consumers have all moved to the new token (safe to delete)

---

*This file is canonical. Figma, the Playground (`ottavia-design`), and Code (`ottavia-client`) are implementations of it. The PDA runs a weekly parity audit comparing all three against this file and reports drift to the Builder.*

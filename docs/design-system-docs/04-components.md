# Design System — Components Inventory (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Code origin:** `src/components/` (~39 files)

---

## 1. Categorization

### Atoms — single purpose, no business logic
- `Text` (font wrapper — but enforces **Poppins**, conflict with Typography scale which calls for SFProDisplay)
- `Ring` (circular progress)
- `CustomToggle` (switch)
- `Toast` / `SuccessToast` / `ErrorToastComponent`
- `OfflineBanner`
- `StatCard` (simple stat display)
- `ComposerVoiceWaveform`

### Molecules — reusable building blocks
- `Header` (simple title + close)
- `AddEditButton` (pill button)
- `AnimatedProgressBar` (linear progress)
- `BlurHeader` (iOS blur, Android plain)
- `ConditionsCard`
- `MacroProgressRow`
- `MealRow` (swipe-to-delete row)
- `NoDataView` (empty state)
- `SettingsCard` (icon + title + subtitle list row)
- `AndroidWheelPicker`
- `AndroidDateWheelPicker`

### Organisms — complex, feature-rich
- `BottomSheet` (BMSheet — photo picker)
- `BarChart`, `LineChart`, `ProgressBarChart`
- `CollapsibleCard`
- `EmptyStateView`
- `MacrosCard`
- `MealExpandableCard`
- `SettingHeader` (the 18-screens one with date nav)
- `Table`
- `UpdatePrompt`
- `RenderChatFooter`
- `ChatMessagesSkeleton`
- `OpenCamera`
- `BodyBasicPicker`
- `ProfileList` (duplicate of `List` with a value display)
- `RotatingImageBackground`
- `List`

### Utilities — non-rendering
- `TableHelper`
- `chartColors.ts`
- `chartStyles.ts`

---

## 2. Critical findings

### 🚨 Duplicates / redundancy to resolve

1. **`List` vs `ProfileList`** — ~90% identical. Merge into one with a `variant` prop.
2. **`NoDataView` vs `EmptyStateView`** — two empty-state components with overlapping purpose.
3. **`BarChart` / `LineChart` / `ProgressBarChart`** — three chart components with overlapping API and heavy duplicated animation logic. Candidate for a `ChartCard` wrapper.
4. **`Header` vs `SettingHeader`** — different headers serving different screens; decide if they can share a base.
5. **`AnimatedProgressBar` vs `ProgressBarChart` (single bar mode) vs `Ring`** — three progress components, three animation implementations.

### 🚨 Hardcoded colors inside shared components (token drift)

- `CustomToggle` → hardcoded `#4B4740` / `#D8CDBA` (off-scale)
- `ConditionsCard` → hardcoded `#FFE5E5`, `#F76642`, `#F5F1EA` (should be tokens)
- `Header` → hardcoded white bg
- `UpdatePrompt` → hardcoded `#007AFF`
- `AndroidDateWheelPicker` → hardcoded `#453F33`

### 🚨 Non-token font usage inside shared components

Components importing raw font-family strings (`'SFUIDisplay-SemiBold'`, etc.) instead of a typography token:
- `StatCard`, `ConditionsCard`, `SettingsCard`, `SettingHeader`, `Header`, `ConnectGarmin`-consumed components.

### 🚨 `Text` component forces Poppins

`src/components/Text.tsx` wraps RN Text and applies Poppins by default — which conflicts with the typography scale (SFProDisplay). Either the component lies about the actual rendered font (because downstream styles override), or Poppins is actually in use somewhere. **Needs investigation before we declare SFProDisplay as the single family.**

### ⚠️ One-offs that should NOT become Figma components (yet)

`BMSheet`, `CollapsibleCard`, `ComposerVoiceWaveform`, `RenderChatFooter`, `ChatMessagesSkeleton`, `OpenCamera`, `RotatingImageBackground` — used in 1 place each, specialized. Document as screen-level patterns instead.

---

## 3. High-priority Figma components to build (in order)

Build these as Figma components with variants + states. Skip one-offs.

### Phase A — Atoms
1. **Button** (variants: primary / secondary / tertiary / destructive; sizes: sm / md / lg; states: default / pressed / disabled / loading)
2. **Input** (text, password, number; states: default / focused / error / disabled)
3. **Toggle** (on / off / disabled)
4. **Tag / Chip** (neutral / domain-colored; selected / unselected)
5. **Icon** (sized slots: 16 / 20 / 24 / 32)
6. **Divider** (hairline, emphasis)
7. **Avatar** (sizes + fallback initials)
8. **Progress — Linear** (replaces `AnimatedProgressBar` + `ProgressBarChart` single-row)
9. **Progress — Circular / Ring**

### Phase B — Molecules
10. **Card / base** (+ elevation + padding tokens; variants: flat / raised / outlined)
11. **ListItem** (with leading icon, title, subtitle, trailing arrow/value/switch) — unifies `List` + `ProfileList` + `SettingsCard`
12. **StatCard** (icon + value + label; domain color variants)
13. **Header — screen** (back + title + optional subtitle + optional right action)
14. **Header — screen with date** (the `SettingHeader` pattern)
15. **EmptyState** (icon + message + optional CTA) — unifies `NoDataView` + `EmptyStateView`
16. **Toast** (success / error / info)
17. **Swipe-to-delete row** (pattern abstraction from `MealRow`)

### Phase C — Organisms
18. **Expandable list** (pattern from `MealExpandableCard` + `MacrosCard`)
19. **Data table** (from `Table`)
20. **Bottom sheet** (full-screen sheet; photo-picker variant)
21. **Modal — confirm** (standardize the Alert.alert/RN Modal mix)
22. **Chart — bar / line / progress** (shared card shell, variant-driven content)
23. **Picker — wheel** (platform-aware abstraction of `BodyBasicPicker` / `AndroidDateWheelPicker`)

---

## 4. Decisions to answer (park in Figma sticky)

1. **Button variants** — how many? Primary, secondary, tertiary, destructive, ghost? The code shows no unified button; we're defining this, not documenting it.
2. **`Text` component fate** — keep forcing Poppins? Change to SFProDisplay? Delete entirely and style inline?
3. **`List` + `ProfileList` + `SettingsCard` merge** — one component with variants, or two families (navigation lists vs settings lists)?
4. **Chart unification** — one `ChartCard` with `type="bar"|"line"|"progress"`, or keep them separate?
5. **Modal confirm standard** — replace `Alert.alert()` with a custom modal, or keep native alerts for destructive confirmations?
6. **Swipe-to-delete** — a component or a pattern applied to any row? (Currently baked into `MealRow`.)
7. **Icon sizing slots** — 16/20/24/32 or different?
8. **Card elevation defaults** — flat, or raised-1, by default?

# Design System — Screens & Layout Patterns (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Code origin:** `src/screens/` (~54 files), cross-referenced with `src/components/`.

---

## 1. Header patterns (4 distinct variants → consolidate to 2)

### Pattern A — `SettingHeader` with date nav (dominates)
Used in **~24 metric/data screens**: Activities, ActivityWeeklyTotals, BloodPressure, BodyComposition, BodyCompositionBaselines, Calories, Conditions, Engagement, Hrv, HrvBaselines, Lab, Movement, Recovery, SkinTemperature, Sleep, SleepBaselines, Stress, Weight, WomensHealth, Respiration, PulseOx, Nutrition, NutritionBaselines, NutritionDailyTotals.
- Back button + title (+ optional subtitle) + date picker with back/forward arrows
- BlurHeader + LinearGradient on iOS
- Responsive to screen bg via `toRgba()`

### Pattern B — `Header` simple (modal-ish)
Used in: FeedbackSupport, Support, Terms, PrivacyPolicy, ConnectGarmin, DataManagement, UnitsOfMeasurements.
- Back + title + close

### Pattern C — Chat Header (bespoke)
Only in `Chat.tsx`.
- Date button (left) + Profile icon (right, double-tap → Settings)
- Gesture swipe navigation to Profile / CoachPlan

### Pattern D — `SettingHeader` with `renderTitleContent` override
Conditions, Goals, Preferences, PersonalDetails — uses the date-header chrome but replaces the title area.

**Recommendation:** Collapse to **2 Figma Header components**:
- `Header/Screen` — back + title + (optional subtitle) + (optional right-action slot)
- `Header/Screen with date` — same + date-picker row

Pattern C stays as a chat-specific variant.

---

## 2. Scroll containers

| Pattern | Use |
|---|---|
| `ScrollView` | Forms, settings, terms-like text |
| `FlatList` | Lists of data items (Goals, Preferences, Conditions, Logging) |
| `GiftedChat` (FlatList) | Chat only; inverted, `maintainVisibleContentPosition` |
| `KeyboardAwareScrollView` | Chat + Onboarding |

No inconsistency flagged — the pattern mapping is clean.

---

## 3. Bottom sheets

**Only Chat** uses `@gorhom/bottom-sheet` (photo picker).

Every other confirmation/picker uses `Alert.alert()` or a full RN Modal. **That's the inconsistency.**

Recommendation: Define a Figma `BottomSheet` component and migrate:
- Destructive confirmations (delete goal, disconnect Garmin, clear data) → bottom sheet or custom modal
- Pickers (any wheel picker currently in full-screen modal) → bottom sheet

---

## 4. Modals

Three modal families in the wild:

| Type | Used in |
|---|---|
| Native `Alert.alert()` | Goals, Preferences, Conditions, Settings, Meals |
| RN `Modal` | Me, PersonalDetails (photo picker overlay), ChatRenderBubble (iOS ActionSheet copy menu) |
| Stack nav with `presentation: 'modal'` | Settings |

**Recommendation:** Pick one modal system, design it in Figma, migrate. My proposal:
- **Confirm dialog** — small centered modal with title, body, primary + secondary action
- **Full-screen modal** — for pickers / overlays that cover the screen
- **Bottom sheet** — for actionable menus / quick inputs

---

## 5. Tab / navigation bar

**No bottom tab bar.** All navigation is stack-based from Chat.
Chat has swipe-gesture nav (left → Profile, right → CoachPlan, 80px threshold).

**Decision flagged:** Is this permanent? Or is a bottom tab bar in the product roadmap?

---

## 6. Empty states

`NoDataView` (lightbulb icon + message + optional CTA that navigates back to Chat with a prefill) is the primary pattern. `EmptyStateView` (in `Meals.tsx`) is a second pattern with stat cards + no-data hint.

**Recommendation:** One `EmptyState` in Figma with variants:
- `empty/message` — icon + headline + body + CTA
- `empty/stats-hint` — stat cards on top + message below
- `empty/skeleton` — pre-data placeholder

---

## 7. Loading states

Three patterns today:
- `ActivityIndicator` full screen — initial load
- `ChatMessagesSkeleton` — chat initial load
- `ShimmerText` — AI response streaming

Recommendation: Keep all three but name them as formal tokens in the spec:
- `loading/initial` → skeleton
- `loading/incremental` → pull-to-refresh + inline spinner
- `loading/streaming` → shimmer

---

## 8. Card / list patterns

App-specific cards in use: `StatCard`, `GoalCard` (inline in Goals screen), `ConditionsCard`, `MealExpandableCard`, `MacrosCard`, goals/preferences `FlatList` rows.

None share a base `Card` primitive. Every one redefines its own padding, radius, shadow.

**Recommendation:** Build a Figma `Card/base` with tokens, then `Card/stat`, `Card/meal`, `Card/condition` as variants on top.

---

## 9. Onboarding pattern

`src/screens/Onboarding.tsx` — 250+ lines, 2 steps, progress bar + centered form + Next/Skip. Not reused elsewhere. Treat it as a standalone flow; still worth building the template in Figma (`Screen/Onboarding step`) so future onboarding additions stay on-pattern.

---

## 10. Table pattern

`Table` component used in 7+ screens (DailySummary, Activities, Lab, Calories, etc.). Horizontally scrollable data grid with optional delete column. Conditional logic hardcodes which screens get the delete column.

**Recommendation:** Figma `Table` component with:
- Variants: `static` / `deletable`
- Column-width array as prop
- Header row + body rows + empty state

---

## 11. Decisions to answer (park in Figma sticky)

1. **Header count:** 2 screen-header components (± chat-specific) — confirm?
2. **Modal standard:** pick one system. Alert.alert is native but breaks visual consistency.
3. **Bottom tab bar** — is one coming? Affects Chat-as-home assumption.
4. **EmptyState consolidation** — one component with variants, or two?
5. **Table flexibility** — do we really need horizontal scroll on all data tables, or should some be vertical-stacked cards on mobile?
6. **Onboarding flow** — does the same template apply to future post-onboarding flows (e.g. goal setup), or is it one-use?

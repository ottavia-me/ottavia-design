# Design System — Assets (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Source:** `ottavia-client/assets/`

---

## 1. Fonts — in bundle

`assets/fonts/` contains **43 font files across 5 families**:

| Family | Styles installed | Used in code? |
|---|---|---|
| **SFPro / SFProDisplay / SFUIDisplay** | Regular, Medium, Semibold, Bold, Italics, SF-Pro.ttf | ✅ Yes (but mixed — see Typography doc) |
| **Poppins** | Thin, Light, Regular, Medium, Semi-Bold, Bold, Extra-Bold + italics | ⚠️ Only 7 uses (likely legacy / `Text.tsx` wrapper) |
| **Archivo** | Regular, Medium, Semi-Bold, Bold | 🚨 Not referenced in `src/` |
| **Recoleta** | Light, Medium, Semi-Bold, Bold (FONTSPRINGDEMO — **demo license!**) | 🚨 Not referenced |
| **New Spirit** | Light, Regular, Medium, Semi-Bold, Bold, Condensed | 🚨 Not referenced |
| **Menlo** | System | ✅ Yes (markdown code) |

**Findings:**
- **Recoleta is a demo-license font** — should NOT ship to production.
- **Archivo, New Spirit** — bundled but dead. Bloat.
- **Poppins** — 7 uses in code; likely removable after fixing `Text.tsx`.

**Recommendation:** Keep only SFProDisplay family. Remove Poppins, Archivo, Recoleta, New Spirit from bundle.

---

## 2. Icons (SVG) — ~108 files

Grouped by semantic domain:

### Navigation / core UI (8)
`back_icon.svg`, `arrow_backward.svg`, `chevron-left.svg`, `cross_icon.svg`, `forward_icon.svg`, `backward_icon.svg`, `down_arrow_icon.svg`, `up_arrow_calendar.svg`

### Chat / messaging (4)
`chat_icon.svg`, `composer_mic_icon.svg`, `composer_plus_icon.svg`, `chat.png`

### Health domains (14)
`activity_icon.svg`, `bp_icon.svg`, `calorie_icon.svg`, `condition_icon.svg`, `engagement_icon.svg`, `goals_icon.svg`, `hrv.svg`, `lab_icon.svg`, `medication_icon.svg`, `movement.svg`, `nutrition_icon.svg`, `plan_icon.svg`, `sleep_icon.svg`, `user_metrics.svg`, `weight_icon.png`

### Settings / profile (6)
`profile_icon.svg`, `header_profile_icon.svg`, `user-profile-circle.svg`, `calendar_icon.svg`, `language_icon.svg`, `version_icon.svg`

### Hardware / wearables (3)
`garmin_icon.svg`, `healthApp_icon.svg`, `new_watch.svg`

### Media / utilities (12)
`camera-icon.svg`, `cameraIcon.png`, `camera_icon.svg`, `email.png`, `image_cross.svg`, `lightbulb_icon.svg`, `refresh.png`, `ruler.svg`, `sent_btn.svg`, `tick_icon.svg`, `trash_icon.svg`, `tick.png`

### Onboarding / illustrations (3)
`new_mountain.png`, `Ellipse.svg`, `white_ellipse.svg`

### Branding (4)
`splash-logo.svg`, `new_ottavia_logo.svg`, `Icon.svg`, `agent_icon.png`

### Document / legal (3)
`new_privacy.svg`, `new_terms.svg`, `policy_icon.svg`

### Misc (3)
`body_comps.svg`, `daily_summary.svg`, `data_manage.svg`, `book.svg`, `support_icon.svg`, `back_ellipse.svg`, `drag_icon.png`, `model_icon.png`

**Findings:**
- **PNG / SVG mix** — e.g. `camera-icon.svg` vs `cameraIcon.png` vs `camera_icon.svg` — three camera icons. Consolidate.
- **Naming inconsistency** — mix of `kebab-case`, `snake_case`, and `camelCase`. Pick one convention.
- **No sizing convention** — icons are pulled in at various dimensions per screen. Needs `icon/16|20|24|32` tokens.

**Recommendation:**
- Rename to `snake_case` + suffix by domain (e.g. `chat_mic`, `domain_hrv`, `nav_back`).
- Remove duplicates (keep one camera icon).
- Build a Figma Icon Component with a content override, backed by all SVGs.

---

## 3. Images (PNG/JPG)

Hard to inventory precisely without walking the folder; mostly:
- **Onboarding illustrations** (`new_mountain.png`)
- **Logos** (SVG)
- **User photos** — stored in S3, not bundled

Not a major design-system concern until we consolidate icons.

---

## 4. Lottie animations

`/assets/animations/` — **only 2 files**:

1. **`check-full.json`** — success checkmark (play once). Used in `ChatRenderCustomView` for Garmin / profile sync complete.
2. **`loading-spinner.json`** — rotating spinner (loop). Used during sync / loading.

**Findings:**
- Motion system is bare. No success pulse for non-onboarding contexts. No error shake. No empty-state bounce. No subtle attention motion.
- Reanimated is used in some custom animations (swipe-to-delete, progress bars), but Lottie is only in 2 places.

**Recommendation:**
- Expand Lottie set to ~5: `success`, `error`, `warning`, `empty-state`, `coach-cue-pulse` (or similar).
- Document motion durations (in / out / emphasis) as design tokens.

---

## 5. Decisions to answer (park in Figma sticky)

1. **Remove dead fonts** — Archivo, Recoleta (demo!), New Spirit — OK to delete from bundle?
2. **Poppins** — migrate all 7 uses to SFProDisplay and delete?
3. **Icon set size** — 108 SVGs is a lot. Audit which are actually used in screens vs. leftovers?
4. **Icon naming convention** — snake_case + domain prefix? Other?
5. **Icon canonical sizes** — 16 / 20 / 24 / 32 the right set?
6. **Motion tokens** — what durations (e.g. 120ms / 180ms / 240ms) and easing curves?
7. **New Lottie animations** needed? Which contexts?

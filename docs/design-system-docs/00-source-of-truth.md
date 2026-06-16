# Ottavia Design System — Source of Truth

**Owner:** Vika (Co-Founder / CPO)
**Authoritative surface:** Figma file *"In Work - Design System O"*
**Authoritative code token reference:** `ottavia-client/src/utils/MarkdownStyles.ts` (until Figma tokens are exported back to code)
**Last updated:** 2026-04-23

---

## Purpose

This folder is the **map of every design decision** that currently lives in the Ottavia codebase, organized so we can rebuild it as a single coherent design system in Figma.

Rule going forward: **Figma leads, code follows.** Every design decision is made and stored in Figma; code references tokens.

---

## Documents in this folder

| # | Doc | What's inside |
|---|---|---|
| 01 | [colors](./01-colors.md) | 34 declared color tokens + ~130 undeclared hex values found in code. Decisions needed: WHITE/BLACK tokens, which blue wins, surface scale, shadow token. |
| 02 | [typography](./02-typography.md) | Declared type scale + SF-family drift (3 families in use). Proposed 8-token clean scale. |
| 03 | [spacing-radii-borders](./03-spacing-radii-borders.md) | 30+ spacing values → propose 9 tokens; 17 radii → propose 8; 2 borders; 6 shadow patterns → propose 5 elevation tokens. |
| 04 | [components](./04-components.md) | Inventory of 39 shared components, categorized as atoms/molecules/organisms, with duplicates flagged. |
| 05 | [screens-layouts](./05-screens-layouts.md) | 54 screens → 4 header patterns, modal inconsistency, card fragmentation. |
| 06 | [chat-markdown](./06-chat-markdown.md) | Chat bubble variants, markdown rendering, coach cues, attachments, confirmation-card gap. |
| 07 | [assets](./07-assets.md) | Fonts, icons (108 SVG), Lottie animations; dead fonts bundled (Recoleta demo-license), duplicate icons. |

---

## Headline numbers

| Metric | Declared tokens | Found in code |
|---|---|---|
| Colors | 34 | ~130 distinct hex |
| Font families | 3 (2 active) | 11 |
| Font sizes | ~10 | 17 |
| Padding/margin values | 0 tokens | 30+ distinct |
| Border radii | 0 tokens | 17 distinct |
| Shadow patterns | 0 tokens | 6 |
| Shared components | — | 39 |
| Screens | — | 54 |
| Icons | — | ~108 SVG |
| Lottie | — | 2 |

**Translation:** We have a working app with real design patterns, but almost nothing is tokenized. That's what this work fixes.

---

## The 10 highest-impact decisions to make

These are the decisions that unlock the most downstream work. They're the ones to answer first.

### Tokens & scales
1. **Add `WHITE` and `BLACK` tokens.** 144 combined raw uses today. (See `01-colors`.)
2. **Resolve the blue conflict.** `#3B82F6` (declared `LINK`, 1 use) vs `#427EF7` (rogue, 14 uses). Pick one. (See `01-colors`.)
3. **Add surface scale and shadow/overlay tokens.** 123 raw uses of `#F5F1EA` + many near-black overlays need structure. (See `01-colors` + `03-spacing-radii-borders`.)
4. **One font family — SFProDisplay.** Kill `SFPro-*` and `SFUIDisplay-*`. Migrate or delete Poppins. (See `02-typography`.)
5. **Spacing base unit — 4 or 8?** Pick one, collapse the odd steps. (See `03-spacing-radii-borders`.)

### Components & patterns
6. **Merge `List` + `ProfileList` + `SettingsCard`** into one list-item component with variants. (See `04-components`.)
7. **Consolidate empty states** (`NoDataView` + `EmptyStateView`) into one. (See `04-components` + `05-screens-layouts`.)
8. **Pick a modal standard** — replace `Alert.alert()` with a consistent modal system. (See `05-screens-layouts`.)
9. **Design the coach-cue / proactive insight card.** Currently rides plain markdown; it deserves its own container. (See `06-chat-markdown`.)
10. **Delete dead fonts** — Archivo, Recoleta (demo license!), New Spirit from the bundle. (See `07-assets`.)

---

## Recommended build order in Figma

This is the sequence we execute, step by step. Each step = one working session.

### Phase 1 — Foundations (tokens only)
1. **Colors** — Neutrals → Terracotta → Semantic → Domain → Surface → Shadow → White/Black (decisions 1, 2, 3)
2. **Typography** — 8 text styles (decision 4)
3. **Spacing, radii, borders** — Number variables (decision 5)
4. **Elevation** — 5 effect styles

### Phase 2 — Atoms
5. Button, Input, Toggle, Tag, Icon, Divider, Avatar
6. Progress — Linear + Ring

### Phase 3 — Molecules
7. Card (base + variants)
8. ListItem (unifies 3 components — decision 6)
9. StatCard
10. Header — Screen + Header — Screen with date
11. EmptyState (decision 7)
12. Toast
13. Swipe-to-delete row pattern

### Phase 4 — Organisms
14. Expandable list
15. Data table
16. Bottom sheet
17. Modal — confirm (decision 8)
18. Chart (bar / line / progress — shared shell)
19. Wheel picker

### Phase 5 — Chat
20. Chat bubbles (user, Ottavia, streaming, reply, chart embed)
21. Input toolbar + attachments row
22. Suggestion chips
23. Coach cue card (decision 9)
24. Logging confirmation card (if decided)

### Phase 6 — Screen templates
25. Onboarding step
26. Metric / data screen (with SettingHeader + Table)
27. Form / settings screen
28. Chat screen

### Phase 7 — Cleanup
29. Asset cleanup — icon dedupe, naming, font removal (decision 10)
30. Icon sizing tokens
31. Motion tokens

---

## How we work

- **One Figma file, one truth.** Every visual decision is visible in *"In Work - Design System O"*.
- **Doc mirrors Figma.** These markdown docs capture what's in Figma + open questions. If the two disagree, Figma wins.
- **Decisions in Figma stickies.** Every "Decisions to answer" item in the doc is mirrored as a sticky note in Figma near the relevant swatch/component, so decisions get made in the visual context.
- **One phase per session.** Don't jump ahead.
- **Screenshot + review before moving on.** Every phase ends with a visual check.

---

## Outstanding action items (as of 2026-04-23)

- [x] Audit of code complete across all categories
- [x] Color decisions board created in Figma (Neutrals + Blue comparison)
- [ ] Vika reviews Figma color decisions board, answers blue question
- [ ] Decisions 1, 3 resolved (White/Black tokens, surface + shadow tokens)
- [ ] Phase 1 — Colors built as Figma variables
- [ ] Phase 1 — Typography built as Figma text styles
- [ ] Phase 1 — Spacing / radii / borders built as Figma number variables
- [ ] Dead font removal ticket opened in engineering repo

**Figma MCP disconnected mid-session** — resume building variables once the plugin reconnects, or build manually in Figma following the Phase 1 plan above.

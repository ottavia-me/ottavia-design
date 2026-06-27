# Markdown Rendering Style Definitions

Style configuration for rendering agent markdown output in the Ottavia mobile chat UI (React Native).
All spacing/size values are in **absolute dp** (density-independent pixels). Colors are hex.

> **Baseline reference**: Claude iOS mobile app (Feb 2025).
> **Body font size**: `20dp` (Ottavia decision — larger than Claude's 16dp for accessibility).
> All heading sizes, lineHeights, and spacing scaled proportionally.

---

## Color Palette Reference (Ottavia Design System)

All colors below are drawn from the Ottavia neutrals scale. No grays — warm browns only.

| Token | Hex | Used For |
|-------|-----|----------|
| **Primary 80** | `#433E36` | Body text, heading text, mark text, table cell text (Text Primary) |
| **Primary 70** | `#5C564D` | Inline code text |
| **Primary 60** | `#766F64` | — (reserved) |
| **Primary 50** | `#8F897D` | — (reserved) |
| **Primary 40** | `#A8A297` | Muted text, ordered list numbers, custom text (Text Secondary) |
| **Primary 30** | `#C2BCB2` | Bullet icons, blockquote border, hr, table borders |
| **Primary 20** | `#DBD6CD` | Inline code bg, code block bg, table header bg |
| **Primary 10** | `#F5F1EA` | App background (not set in markdown styles) |

**Accent colors** (outside neutral palette):
| Color | Hex | Used For |
|-------|-----|----------|
| Link blue | `#3B82F6` | Hyperlinks |
| Mark yellow | `#FCE7B5` | `==highlighted text==` background |

---

## Dependencies (Before Implementation)

| Dependency | Status | Action Required |
|-----------|--------|-----------------|
| **SF Pro Text font files** | NOT bundled | Add `SFProText-Regular.ttf`, `SFProText-Semibold.ttf`, `SFProText-Bold.ttf`, `SFProText-RegularItalic.ttf` to `assets/fonts/`, Android assets, and iOS Info.plist |
| **SF Pro Display Bold** | NOT bundled | Add `SFProDisplay-Bold.ttf` if staying with Display family (current: only Regular, RegularItalic, Semibold) |

**Immediate path**: Use existing `SFProDisplay-*` fonts with `Semibold` for headings until font files are added. All other style values apply immediately.

---

## 0. Content Container

The rendering canvas inside the chat message bubble.

| Property | Value | Notes |
|----------|-------|-------|
| `container.paddingHorizontal` | `0` | Bubble padding handled by `ChatRenderBubble.tsx` |
| `container.paddingVertical` | `0` | Same — outer bubble owns vertical padding |
| `container.maxWidth` | `100%` | Content fills available width |

> **Note**: `firstChild.marginTop = 0` and `lastChild.marginBottom = 0` cannot be set via `react-native-markdown-display` style objects. These require either: (a) wrapping the Markdown component with negative-margin compensation, or (b) accepting the first/last element's margins. In practice, this is a minor issue.

---

## 1. Base Typography

| Property | Value | RN Style Key | Notes |
|----------|-------|-------------|-------|
| `fontFamily` | `SFProText-Regular` | `body.fontFamily` | Target font. Fallback: `SFProDisplay-Regular` (currently bundled) |
| `fontSize` | `20` | `body.fontSize` | Ottavia decision: larger than Claude's 16dp |
| `color` | `#433E36` | `body.color` | Text Primary (Primary 80). Warm dark brown from design system. |
| `lineHeight` | `32` | `body.lineHeight` | Absolute px. (20 x 1.6 = 32). Generous for readability. |
| `letterSpacing` | `0.1` | `body.letterSpacing` | Slight positive tracking for body text |

> **Why `#433E36` and not pure black (#000)?** Ottavia's app background is `#F5F1EA` (Primary 10). Pure black on warm cream creates a harsh mismatch. `#433E36` is Primary 80 from the design system — the darkest neutral, warm brown. All markdown colors use the Primary 80→10 neutral scale.

---

## 2. Headings

Sizes scaled for 20dp body. Agents primarily use H2 and H3. H1 is rare.

| Property | H1 | H2 | H3 | H4 |
|----------|----|----|----|----|
| `fontSize` | `28` | `24` | `22` | `20` |
| `fontFamily` | `SFProText-Bold` | `SFProText-Bold` | `SFProText-Semibold` | `SFProText-Semibold` |
| `lineHeight` | `36` | `32` | `31` | `30` |
| `color` | `#433E36` | `#433E36` | `#433E36` | `#433E36` |
| `marginTop` | `24` | `24` | `20` | `16` |
| `marginBottom` | `12` | `8` | `8` | `4` |

RN style keys: `heading1`, `heading2`, `heading3`, `heading4`.

Font fallbacks (until Bold is bundled):
- H1/H2: use `SFProDisplay-Semibold` (currently available)
- H3/H4: use `SFProDisplay-Semibold`

Notes:
- H5/H6 fallback: use H4 values
- `marginTop > marginBottom` groups heading with content below
- When heading is first element in response, the marginTop creates minor top spacing (acceptable)

---

## 3. Paragraph

| Property | Value | RN Style Key | Notes |
|----------|-------|-------------|-------|
| `marginTop` | `0` | `paragraph.marginTop` | Spacing via previous element's marginBottom |
| `marginBottom` | `16` | `paragraph.marginBottom` | Primary inter-paragraph spacing |

---

## 4. Inline Text Styles

| Element | RN Style Key | Properties | Notes |
|---------|-------------|------------|-------|
| **Bold** | `strong` | `fontFamily: SFProText-Semibold` | Use fontFamily, not fontWeight (custom fonts in RN) |
| **Italic** | `em` | `fontFamily: SFProText-RegularItalic`, `fontStyle: italic` | Both needed in RN |
| **Strikethrough** | `s` | `textDecorationLine: line-through` | |
| **Inline code** | `code_inline` | `fontFamily: Menlo`, `fontSize: 18`, `backgroundColor: #DBD6CD` (Primary 20), `paddingHorizontal: 5`, `paddingVertical: 2`, `borderRadius: 4`, `color: #5C564D` (Primary 70) | fontSize = 90% of body. Menlo is built-in on iOS. |
| **Link** | `link` | `color: #3B82F6`, `textDecorationLine: underline` | Touch feedback handled by library |
| **Mark** | custom rule | `backgroundColor: #FCE7B5`, `color: #433E36` (Primary 80) | Requires `markdown-it-mark` plugin + custom render rule (already implemented) |

> **Note**: `pressedOpacity` is not a RN style property. Touch feedback on links is handled by the markdown library's built-in touch handlers.

---

## 5. Code Blocks (Fenced)

**Priority: Low** — Ottavia agents don't produce code blocks. Style for completeness.

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `fontFamily` | `Menlo` | `fence.fontFamily` |
| `fontSize` | `14` | `fence.fontSize` |
| `lineHeight` | `21` | `fence.lineHeight` |
| `color` | `#433E36` | `fence.color` |
| `backgroundColor` | `#DBD6CD` | `fence.backgroundColor` |
| `padding` | `16` | `fence.padding` |
| `borderRadius` | `8` | `fence.borderRadius` |
| `marginTop` | `16` | `fence.marginTop` |
| `marginBottom` | `16` | `fence.marginBottom` |

> **Not achievable via styles alone**: language labels, copy buttons, syntax highlighting, maxHeight with expand. These require custom render rules — skip for now.
>
> **`overflowX: scroll`** does not exist in RN. Horizontal scrolling for code blocks requires wrapping in a `ScrollView horizontal` via a custom render rule.

---

## 6. Blockquote

**Priority: Low** — Agents rarely produce blockquotes.

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `borderLeftWidth` | `3` | `blockquote.borderLeftWidth` |
| `borderLeftColor` | `#C2BCB2` | `blockquote.borderLeftColor` |
| `backgroundColor` | `transparent` | `blockquote.backgroundColor` |
| `paddingLeft` | `14` | `blockquote.paddingLeft` |
| `paddingVertical` | `2` | -- split into paddingTop/paddingBottom |
| `marginTop` | `16` | `blockquote.marginTop` |
| `marginBottom` | `16` | `blockquote.marginBottom` |

> **Note**: Blockquote text color (`#A8A297` / Text Secondary) needs to be applied via a custom render rule or by setting color on the blockquote style key. The `react-native-markdown-display` library applies blockquote styles to the wrapper View, not the Text inside. Test on device.

---

## 7. Unordered List

| Property | Value | RN Style Key | Notes |
|----------|-------|-------------|-------|
| `marginTop` | `8` | `bullet_list.marginTop` | Tighter than paragraph spacing |
| `marginBottom` | `16` | `bullet_list.marginBottom` | |
| `paddingLeft` | `8` | `bullet_list.paddingLeft` | Indent from left edge |

Bullet icon styling:

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `color` | `#C2BCB2` | `bullet_list_icon.color` |
| `fontSize` | `20` | `bullet_list_icon.fontSize` |
| `lineHeight` | `32` | `bullet_list_icon.lineHeight` |
| `marginRight` | `8` | `bullet_list_icon.marginRight` |

> **Not achievable via styles**: Per-level bullet characters (`•`, `◦`, `▪`) and nested padding. The library uses `•` for all levels. Custom render rules needed for differentiation — skip for now.

---

## 8. Ordered List

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `marginTop` | `8` | `ordered_list.marginTop` |
| `marginBottom` | `16` | `ordered_list.marginBottom` |
| `paddingLeft` | `8` | `ordered_list.paddingLeft` |

Number icon styling:

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `color` | `#A8A297` | `ordered_list_icon.color` |
| `fontSize` | `20` | `ordered_list_icon.fontSize` |
| `lineHeight` | `32` | `ordered_list_icon.lineHeight` |
| `marginRight` | `8` | `ordered_list_icon.marginRight` |

> **Not achievable via styles**: Nested number styles (`1.`, `a.`, `i.`) or custom suffixes. Library default is fine.

---

## 9. List Item

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `marginBottom` | `6` | `list_item.marginBottom` |
| `flexDirection` | `row` | `list_item.flexDirection` |
| `alignItems` | `flex-start` | `list_item.alignItems` |

---

## 10. Horizontal Rule

| Property | Value | RN Style Key | Notes |
|----------|-------|-------------|-------|
| `backgroundColor` | `#C2BCB2` | `hr.backgroundColor` | Primary 30 hairline |
| `height` | `1` | `hr.height` | |
| `marginTop` | `24` | `hr.marginTop` | Generous breathing room |
| `marginBottom` | `24` | `hr.marginBottom` | |

---

## 11. Table

**Priority: Medium** — Visualization agent may produce table-like data.

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `marginTop` | `16` | `table.marginTop` |
| `marginBottom` | `16` | `table.marginBottom` |
| `borderColor` | `#C2BCB2` | `table.borderColor` |
| `borderWidth` | `1` | `table.borderWidth` |

| Property | Value | RN Style Key |
|----------|-------|-------------|
| Header background | `#DBD6CD` | `thead.backgroundColor` |
| Header font | `SFProText-Semibold` | `th.fontFamily` |
| Header color | `#433E36` | `th.color` |
| Header padding | `8` | `th.padding` |
| Cell padding | `8` | `td.padding` |
| Cell fontSize | `16` | `td.fontSize` |
| Cell color | `#433E36` | `td.color` |
| Row border | `#C2BCB2` | `tr.borderBottomColor` |

> **Not achievable via styles**: Zebra striping (`alternateRowColor`), horizontal scroll, rounded outer corners. Need custom render rules.

---

## 12. Image

Images in Ottavia are handled separately by `ChatRenderBubble.tsx` (FastImage component), not by the markdown renderer. These styles are fallback only:

| Property | Value | RN Style Key |
|----------|-------|-------------|
| `width` | `100%` | `image.width` |
| `borderRadius` | `8` | `image.borderRadius` |
| `marginTop` | `12` | `image.marginTop` |
| `marginBottom` | `12` | `image.marginBottom` |

---

## 13. Dark Mode Overrides

**Phase 2** — Not implemented yet. Define when dark mode is added to the app.

Light mode values above are the current implementation target.

---

## 14. Ottavia-Specific Custom Styles

These are NOT part of `react-native-markdown-display`. They power Ottavia's `::customtext::` and `#link#` rendering in `Utils.tsx`:

| RN Key | Properties | Used For |
|--------|-----------|----------|
| `mark` | `backgroundColor: #FCE7B5`, `color: #433E36` (Primary 80), `fontFamily: SFProText-Regular`, `fontSize: 20`, `lineHeight: 32` | `==highlighted actions==` via markdown-it-mark plugin |
| `baseText` | `fontFamily: SFProText-Semibold`, `fontSize: 18`, `lineHeight: 28`, `color: #A8A297` (Text Secondary / Primary 40) | Custom text sections |
| `customSentence` | Same as baseText | Custom sentence rendering |
| `customLink` | Same as baseText + `textDecorationLine: underline` | Clickable custom links (Meals, Preferences, Conditions) |

---

## 15. What Needs Custom Render Rules (Not Style-Only)

These features from the original spec require custom `rules` in the Markdown component, not just style properties:

| Feature | Why Style Isn't Enough | Priority |
|---------|----------------------|----------|
| Mark/highlight (`==text==`) | Already implemented via `markdownRules.mark` | Done |
| Per-level bullet characters | Library uses `•` for all levels | Low |
| Code block horizontal scroll | RN needs `ScrollView horizontal` wrapper | Low (agents don't produce code) |
| Table horizontal scroll | Same — needs ScrollView wrapper | Medium |
| Language label on code blocks | Need custom component rendering | Low |
| Copy button on code blocks | Need custom component rendering | Low |
| Syntax highlighting | Need external library (e.g., react-syntax-highlighter) | Low |
| First/last child margin stripping | Need wrapper View logic | Low |

---

## 16. Spacing Scale Reference

All values above use this scale:

```
Spacing: 2  4  6  8  12  14  16  20  24  32
Fonts:   14  16  18  20  22  24  28
```

---

## Implementation Checklist

- [ ] Update `MarkdownStyles.ts` with all style keys above
- [ ] Add SF Pro Text font files to project (or use SFProDisplay-* as interim)
- [ ] Add SFProDisplay-Bold.ttf for heading weight distinction
- [ ] Visual QA on iOS device
- [ ] Visual QA on Android device
- [ ] Test with real agent responses (Type 1-4)
- [ ] Test with edge cases (long lists, nested bullets, missing data messages)

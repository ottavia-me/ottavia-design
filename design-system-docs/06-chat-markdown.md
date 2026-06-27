# Design System — Chat & Markdown (Source of Truth)

**Status:** Audit draft, 2026-04-23
**Scope:** `src/screens/Chat.tsx` + `src/components/ChatRenderBubble.tsx` + `src/components/ChatRenderCustomView.tsx` + `src/components/RenderChatFooter.tsx` + `src/components/ChatInputToolBar.tsx` + `src/utils/MarkdownStyles.ts`.

Chat is the primary interface. This doc is important.

---

## 1. Bubble variants

| Variant | Alignment | Background | Text styling | Width |
|---|---|---|---|---|
| **User** | Right | White (`#FFFFFF` — no token) | `body/lg` SFProDisplay-Regular, 18/26, `PRIMARY_80` | Max 302 (`measuredWidth` computed) |
| **Ottavia (AI)** | Left | Transparent | Markdown-rendered — see §2 | Up to 100% − 40 |
| **System — processing** | Left | Transparent | Shimmer animation | Inline |
| **Reply-to reference** | Above target bubble | Gray patch | Referenced message snippet + thumbnail | Full bubble width |
| **Chart embed** | Left | Card | Parsed `chartData` → `BarChart` / `LineChart` | Bubble width |
| **Image attachment** | Right | Transparent | `FastImage`, cache `immutable` | Bubble width |

**Drift:** user-bubble white (`#FFFFFF`) has no token. The 74 raw-white uses in the codebase include these bubbles.

---

## 2. Markdown rendering

**Config:** `src/utils/MarkdownStyles.ts` — 13 neutral/domain color tokens + 270 lines of `markdownStyles`.

Renderer: `react-native-markdown-display` wrapped by `ChatRenderBubble.tsx`; `MarkdownIt().use(mark)` parses `==highlight==`.

**Styles already defined and working:**
- h1 / h2 / h3 / h4–h6 (sizes 28 / 24 / 22 / 20)
- body (18/26 0.2 letter-spacing)
- strong, em, s
- link (underline, LINK color)
- code_inline (Menlo / 18 / PRIMARY_70 on PRIMARY_20, 5h padding, radius 4)
- fence — code block (Menlo / 14 / padding 16 / radius 8)
- bullet_list + bullet dot (7pt, PRIMARY_30)
- ordered_list + numeric marker
- blockquote (left border 3px, PRIMARY_30)
- hr (1 height, PRIMARY_20 bg)
- mark (MARK bg, PRIMARY_80 text)
- table + thead + tr + th + td (border PRIMARY_30, radius 20, bg PRIMARY_20 header)
- image (100%, radius 8, margin 12)
- baseText / customSentence / customLink (18, 28, PRIMARY_40)

**Drift inside chat:** `ChatRenderBubble` has its own `markdownRules` object for `mark` — duplicated from `MarkdownStyles.ts`. Consolidate.

---

## 3. Confirmation cards (logging, goal, etc.)

**Finding:** Logging confirmations do NOT render as a card inside the chat bubble. The flow is:
1. User logs food (photo)
2. Ottavia replies in markdown with nutrition summary
3. Meals screen is where the persistent confirmation lives (StatCard, MealExpandableCard)

**Decision needed:** is this correct product behavior, or should logging confirmations render as a distinct card component **inside** the chat bubble (like Claude's tool-use cards)? Today's behavior makes chat and Meals feel disconnected.

---

## 4. Coach cue / insight messages (proactive)

`ChatRenderCustomView.tsx` renders a **first-message header** with 2 states:

| State | Content | Motion |
|---|---|---|
| Onboarding sync in progress | "Garmin Sync…" + spinner → tick, "Building your profile…" + spinner → tick, progress bar % | Lottie `loading-spinner.json` → `check-full.json` transition at 2s |
| Completed | "Garmin Sync" + tick, "Profile Ready" + tick | Static |

Triggers: `isFirstMessage` + (`!isAnimationScreenShown` && `!isInitialFetchDone`).

**Finding:** Proactive coach cues (per `COMMUNICATION_TYPES.md` type 3/4) don't have their own visual card yet in chat — they ride the regular Ottavia markdown bubble. This is a **design gap**.

---

## 5. Suggested reply chips

**Component:** `RenderChatFooter.tsx`
- Source: `suggestionData` from Redux (populated via `fetchPendingSuggestions()`)
- Rendered when `text.length === 0 && isInitialFetchDone`
- Also renders disclaimer: "Ottavia can make mistakes" (when last message is bot + not processing)
- Tap → creates IMessage, calls `handleSend()`

---

## 6. Attachments (image upload)

Flow:
1. Plus icon in toolbar → `BottomSheetModal` (`BMSheet`)
2. Choose **Camera** (→ `CameraScreen`) or **Gallery** (system picker)
3. Up to 5 photos preview in `photoUris`
4. `uploadImageToS3()` → S3 URLs in `s3ImageUrlsRef`
5. Send → user message includes `image`/`images` prop
6. On render error: added to `failedImageUris`, skipped

**`ChatInputToolBar.tsx`** renders the photo preview strip + remove buttons.

---

## 7. Typing, sending, offline, error states

| State | Indicator | Location |
|---|---|---|
| AI typing | Shimmer text bubble | `ChatRenderBubble.tsx:182–190` |
| Sending | "Processing…" message injected, replaced by streamed text | `Chat.tsx:1104–1159` |
| Error/retry | No retry UI. Fallback to Run API (SSE) via `callbackFuncCallRunApi` | `Chat.tsx:1205` |
| Offline | System message "No internet connection"; cleared on reconnect | `Chat.tsx:392–415` |
| Agent thinking | Redux `agentThinkingMsg` streamed; updates `Processing…` in real time | `Chat.tsx:450–469` |

**Unread divider:** `ChatNewMessagesDivider` component above first unread message; also triggers scroll-to-bottom FAB with badge count.

---

## 8. Composer / input toolbar

`ChatInputToolBar.tsx`:
- Plus icon (left) → BMSheet attachments
- Text input (center)
- Mic icon (voice) + Send icon (right, context-switched)
- `ComposerVoiceWaveform` shown during recording
- Input bar has unique **warm shadow** `#DAD5C7` — drift vs. rest of app shadows (`#000`)

---

## 9. Figma build plan for chat

Build these as Figma components (all inside a `Chat/` section):

1. `Chat/Bubble/user` (white bg, right, with/without image)
2. `Chat/Bubble/ottavia` (transparent, left, markdown content slot)
3. `Chat/Bubble/reply-reference` (gray patch above)
4. `Chat/Bubble/streaming` (shimmer variant)
5. `Chat/Bubble/chart-embed`
6. `Chat/Input toolbar` (+ recording variant)
7. `Chat/Attachments preview row`
8. `Chat/Suggestion chips` footer
9. `Chat/System message` (offline, info)
10. `Chat/Unread divider`
11. `Chat/Coach cue card` — **NEW DESIGN NEEDED** (proactive insight card, doesn't exist yet)
12. `Chat/Logging confirmation card` — **DECISION NEEDED** (should it exist?)

---

## 10. Decisions to answer (park in Figma sticky)

1. **Logging confirmation card in bubble — yes or no?** Huge UX question.
2. **Coach cue / proactive insight card design** — currently rides plain markdown; should it have its own visual container?
3. **User bubble: white forever**, or warm surface that matches Ottavia's palette (e.g. very light terracotta or `PRIMARY_10` with a border)?
4. **Chat input bar shadow warm vs. black** — keep `#DAD5C7` or align with standard `#000` elevation system?
5. **Retry UI** — no retry affordance today. Add?
6. **Suggestion chips** — single-line scroll, multi-line wrap, or vertical stack?
7. **Attachment row** — max 5 photos OK, or different cap?

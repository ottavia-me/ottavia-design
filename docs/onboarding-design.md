# Onboarding Design — Session Summary

Working file for the new onboarding redesign. Started 2026-05-06, last touched 2026-05-10.
This doc is so a future you (or me in a fresh session) can pick this up without re-explaining everything.

---

## Where things live

| What | Where |
|---|---|
| **Design playground hub** | `ottavia-design/index.html` (deployed: https://ottavia-me.github.io/ottavia-design/) |
| **The onboarding prototype** | `ottavia-design/onboarding-flows.html` |
| **Brand fonts (Modern Era Trial)** | `ottavia-design/assets/ModernEra/ModernEra-{Regular,Medium,Bold}-Trial.otf` |
| **Wave SVG assets (no longer used)** | `ottavia-design/assets/onboarding-wave-orange.svg`, `ottavia-design/assets/onboarding-wave-blue.svg` |
| **Jira ticket** | OTRD-2116 — "Onboarding improvements" (sprint OTR 71) |
| **ottavia-client branch** | `feat/OTRD-2116-onboarding-improvements` (off latest develop) |
| **ottavia-design branch** | `feat/onboarding-flows-playground` (off origin/main) |

Neither branch has been pushed yet.

---

## The Tool — Ribbon Animation Playground

A live, in-browser tuning tool for the ribbon physics. **This is a deliverable in its own right** — independent of which onboarding screen ends up using it. It can be re-used to dial in any wave-based motion (loading states, transitions, error states, etc.).

### What it is

A control panel pinned to the right edge of the page (only visible when `onboarding-flows.html` is opened directly, not via the playground iframe). Sliders update ribbon parameters in real time; state persists across reloads; you can export a complete standalone HTML snippet at any moment.

### How to open it

```
open ottavia-design/onboarding-flows.html
```

Open the file directly in a browser. Do NOT open it via the playground hub — the panel is hidden in `?embed=1` mode (intentionally, so the prototype card view stays clean).

### Workflow

1. **Open** the file → control panel appears on the right.
2. **Slide things around.** The animation updates live, no reload needed. Every change auto-saves to `localStorage["ottavia-ribbons-v2"]`.
3. **Found a look you like?** Click **Copy JSON** to grab just the parameter values, or **Export code** to grab a full standalone HTML file with the animation baked in.
4. **Reload anytime** — your last state restores automatically. Click **Reset** to wipe and start fresh.

### What's exposed

See the full slider tables further down in this doc (under "Live controls panel"). Quick summary:

- **Per-ribbon (Blue and Pink, independent):** Move Speed, Wave Speed, Wave Height, Wavelength, Tail Swing, Head Height, Elasticity, Phase, Corner Radius, Direction
- **Shared:** Wave Size (stroke), Wave Width (span), Vertical Gap, Camera

### How it's structured (for extending)

The tool lives entirely inside `onboarding-flows.html`. Three logical pieces:

1. **`Ribbon` class** (~line 600) — the physics simulation. Each instance owns a chain of points and an `update(t)` method called once per frame. Properties like `waveSpeed`, `waveAmplitude`, etc., are tweaked at runtime.
2. **State + `applyState()`** (~line 760) — single source of truth. Mutations to `state.blue.*`, `state.pink.*`, `state.shared.*` flow through `applyState()` which:
   - Maps state values onto the two `Ribbon` instances
   - Updates SVG attributes (stroke-width, gradients)
   - Calls `snap(t)` on each ribbon to teleport points to their new rest positions (no spring bounce)
   - Saves to localStorage
3. **`bindSlider(id, valId, path, fmt)`** (~line 880) — generic slider-to-state binder. `path` is a dotted accessor like `"blue.waveSpeed"`. Init reads from saved state, writes to slider; on input, writes back to state and triggers `applyState`.

### To add a new slider

1. **HTML:** add a `<div class="ctl">` block in the appropriate section (Blue / Pink / Shared) with `<label>`, `<span class="v">`, and `<input type="range">`.
2. **DEFAULTS object:** add the new key with default value.
3. **`applyOne(rib, p)` or `applyState()`:** map the state key onto a Ribbon property (or any other side effect).
4. **`bindSlider(...)` call:** wire the slider to the state path.
5. **Reset block:** add the `setVal` and `setText` lines so Reset restores the new slider too.
6. **`wavCtrls` array:** add the slider's id so it gets disabled when Lottie source is active.
7. **`buildStandaloneCode()`:** if the new param needs to ship in the production export, add it to `blueOpts`/`pinkOpts`.
8. **Bump `STORAGE_KEY`** (e.g., `v2` → `v3`) if the new key fundamentally changes geometry.

### To add another ribbon (e.g., third color)

Pattern is fully repeatable: add a third `<svg>` block with its own gradient + `<path id="ribbonGreen">`, instantiate `new Ribbon({...})`, add `state.green` section, add bind calls, add to `wavCtrls`. The animation tick already iterates all ribbons.

### To reuse the tool for a different animation

The `Ribbon` class is generic — it's a chain of points with a driven head, springy body, perpendicular wave, and tail amplification. Other use cases:
- Loading-state shimmer (chain wraps in a circle)
- Audio-waveform visualizer (one ribbon, no physics, just driven by audio levels)
- Coach-card decorative element (smaller, slower, single ribbon)

For non-onboarding use, fork the file or extract the `Ribbon` class + control-panel HTML into a shared utility.

### Known limitations

- **Tuning only.** This is a design tool, not a production component. The animation runs as JS+SVG in the browser; for the React Native app we need to port the `Ribbon` class to use `react-native-svg` and ideally `react-native-reanimated` so the loop runs on the UI thread.
- **No undo.** Reset wipes everything. If you want to keep a "favorite," click Copy JSON and paste somewhere. (Could add a "save preset" / "load preset" feature later.)
- **One JS animation at a time.** The Lottie toggle replaces the JS ribbons entirely. No A/B comparison side-by-side.
- **Slider granularity.** Some sliders use `step="0.01"` which can feel coarse near zero. Tweak step values per slider if needed.

### Future improvements worth considering

- Save / load named presets (so you can switch between "calm", "energetic", "still" looks)
- A/B mode — run JS and Lottie side-by-side
- Keyboard shortcuts (e.g., space to pause animation, arrow keys to nudge selected slider)
- Export as React Native code (Reanimated `withRepeat` + `useAnimatedProps`) so it can be dropped into ottavia-client directly
- Record the animation to MP4/GIF for sharing in Figma comments
- Per-ribbon color picker (currently colors are baked into the SVG gradients)

---

## Context: where we are in the broader project

- Ottavia client onboarding currently has 3 screens after splash: **Launch → Connect Garmin → Onboarding (name/DOB, then weight/height/gender)**
- After onboarding, an animation screen plays, then the user lands on **Chat**, which has no welcome message — just an empty message area with a few suggestion chips
- Vika is exploring a new onboarding design starting from the splash screen redesign

Source files mapped (in ottavia-client repo):
- Launch: `src/screens/Launch.tsx:33`
- Connect Garmin: `src/screens/ConnectGarmin.tsx:46`
- Onboarding (name/DOB/body): `src/screens/Onboarding.tsx:36`
- Chat (post-onboarding): `src/screens/Chat.tsx:456`
- Suggestions in chat: `src/components/RenderChatFooter.tsx:64`
- Login state controlling auth → app routing: `src/redux/reducer/LoginReducer.tsx`

---

## What we built in `onboarding-flows.html`

A 430×932 iPhone-shaped prototype with:

1. Status bar (9:41 + cellular/wifi/battery)
2. "ottavia" wordmark in **Modern Era Medium** at top:70
3. **Two animated ribbons** in a wave field at top:130 / height:500 (the focus of most of this session)
4. Headline "Your wellbeing explained" at top:445 in Modern Era Medium 48px
5. Primary "Get Started" button at top:683
6. Privacy policy text + working accept toggle
7. Home indicator at the bottom
8. v1/v2/v3 version-switcher pill (top-right, dev-only)
9. **A live control panel on the right side** for tuning ribbon parameters

The prototype is added to `index.html`'s playground card grid as "Onboarding flows" (under SCREENS). Embedded in the playground via `?embed=1` (which scales 430×932 → 390×844 and hides the controls panel).

---

## The ribbon animation (the big rabbit hole)

We went through ~10 iterations of the wave/ribbon animation. The current state is a **JS physics simulation** of a chain of points with sin-driven motion. Here's the full evolution and what we ended up with.

### Iteration history (so you don't repeat dead ends)

1. **Inline SVG with exact Figma path data** — two static S-curve ribbons matching the Figma design (gradient stops, stroke-width 31). Worked but static.
2. **SMIL `<animate>` morphing the path's `d` attribute** through 4–6 keyframes ("breathing"). Felt like a static shape pulsing in place, not flowing.
3. **DNA helix attempt** with sliding masks "punching" alternating holes through the front ribbon. Visually interesting but overcomplicated and not what was wanted.
4. **Forward-motion: 3 path copies (orig | mirror | orig) translated leftward in a loop**. Mathematically seamless but visually felt like a wave-shape sliding past, not a wave being created.
5. **Periodic sine wave with translation** — same problem, perceived as a static shape moving.
6. **Side-view interpretation**: chain spread horizontally, gentle whole-ribbon sway + perpendicular wave traveling along length. Closer.
7. **Rhythmic-gymnastics keyframes** — 6 hand-crafted poses morphed via spline easing (slow drifts → fast whips). Got some "alive" feel but param-tweaking from text descriptions hit a wall.
8. **Honest pause** — recommended Lottie/Rive as more designer-friendly alternatives. Vika gave a reference Lottie URL → added a JS / Lottie toggle in the control panel.
9. **Real chain physics simulation** (current approach). Driver point on a sin path, body follows with tension+damping, perpendicular wave with per-point lag.
10. **Control panel** added so Vika can dial in the look interactively instead of describing it.

**Lesson learned for future sessions:** chasing a specific aesthetic by tweaking sin/physics constants from verbal descriptions is slow and error-prone. The control panel is the right move — let her find the values, then bake them in.

### Current physics model (JS class `Ribbon`)

Each ribbon is a chain of **110 points**. Per frame, for each point `i`:

```
restX = centerX + i*spacing - chainOffset
       + sin(t·swaySpeed + phase) · swayX · breathingMod   (lagged per point)

restY = headY → baseY linear interpolation (head=i:0, tail=i:length-1)
       + sin(t·swaySpeed·0.7 + phase·1.3) · swayY · breathingMod
       + tail-amplified perpendicular wave:
           sin(t·waveSpeed + i·waveFrequency + phase) · waveAmplitude · ampMod · lengthFactor

target → spring chase with tension + damping (gives elasticity, momentum, drag)
```

`breathingMod` and `ampMod` are slow sin envelopes (~22s, ~17s) that make speed/amplitude pulse so motion never feels mechanical.

`lengthFactor` ramps amplitude from head (low) to tail (high) — this is the "Tail Swing" slider. Which end is the "tail" follows the Direction toggle.

The path is drawn each frame as quadratic Béziers through point midpoints (`M ... Q ... Q ... T`).

### Live controls panel (right side of the page)

**Animation Source toggle:** JS Physics ↔ Lottie (the latter loads from `https://lottie.host/b780174c-b278-4929-9fde-6143da73d77d/Tn3DXAIZ3r.lottie`)

**Per-ribbon controls (Blue and Pink, independent):**

| Control | Range | Default Blue / Pink | What it does |
|---|---|---|---|
| Move Speed | 0–2 | 0.45 / 0.38 | Whole-ribbon sway rate |
| Wave Speed | 0–4 | 1.8 / 1.55 | Perpendicular wave oscillation rate (head-to-tail wave propagation) |
| Wave Height | 0–140 | 62 / 56 | Amplitude of the wave |
| Wavelength | 0.05–0.6 | 0.27 / 0.30 | Lower = longer stretched waves; live cycle count shown |
| Tail Swing | 0–1.5 | 0.6 / 0.6 | Amplitude gradient. 0 = uniform; higher = head swings less, tail more |
| Head Height | 0–500 | 250 / 250 | Y position of the start of the line — creates a head→tail tilt |
| Elasticity | 0–1 | 0.50 / 0.55 | 0 = stiff/snappy, 1 = floppy/floaty (controls tension+damping together) |
| Phase | 0°–360° | 0° / 180° | Wave phase. Pink at 180° = mirror of blue (peaks vs valleys) |
| Corner Radius | 0–1 | 1 / 1 | 1 = round sin peaks, 0 = sharp/square peaks (tanh saturation) |
| Direction | ← / → | → / → | Flips wave propagation direction (also flips which end is the "tail") |

**Shared controls:**

| Control | Range | Default | What it does |
|---|---|---|---|
| Wave Size (stroke) | 3–80 px | 31 | Ribbon line thickness |
| Wave Width (span) | 5–40 | 11 | Chain spacing → ribbon's horizontal extent. Read-out shows total px |
| Vertical Gap | -80 to 80 | 0 | Y distance between blue and pink baselines |
| Camera | 0–1 | 0.5 | Pan along the ribbon. 0 = beginning visible, 0.5 = middle, 1 = end |

**Footer buttons:**
- **Reset** — wipes saved state and restores factory defaults
- **Copy JSON** — copies the current state as JSON (lightweight, for sharing settings)
- **Export code** — copies a complete standalone HTML document with all current params baked in. Save as `.html`, double-click, runs immediately.

### Persistence (localStorage)

State auto-saves to `localStorage["ottavia-ribbons-v2"]` on every change. Reload restores last state. Reset clears it.

The storage key has a version suffix (`v2`). When defaults need to change in a way that breaks compatibility (like the geometry change from 280→500 height), bump to `v3` etc. The `{ ...DEFAULTS, ...saved }` merge means new keys added later automatically get default values without breaking existing saves.

### Things that fixed visible issues in past iterations

- **Bounce on slider drag** → calling `ribbon.snap(t)` in `applyState()` snaps every point directly to its rest position with zero velocity. No spring chase, no overshoot.
- **Endpoints showing in the visible window** → chain length bumped to 110 so endpoints are far off-screen regardless of camera/span values.
- **Vertical clipping when wave is tall** → `.waves` has `overflow: visible`. Final clipping happens at the phone-frame `.screen` (overflow: hidden).
- **Edge mask removed** — Vika didn't like the soft "glow" fade at left/right edges. With the long chain, endpoints stay off-screen anyway.
- **Rounded ribbon caps** → `stroke-linecap="butt"` (was "round").
- **`</script>` in Export code template literal breaking the page** → escaped to `<\/script>` so the HTML parser doesn't see it as a real close tag.

---

## Geometry (current)

- Phone screen: 430 × 932
- Wave field (`.waves`): top:130, height:500. Lots of vertical room.
- SVG inside each ribbon: `viewBox="0 0 430 500"`, `overflow="visible"`
- Default `baseY` (chain centerline): **250** (middle of the 500-tall field)
- Default `headY`: **250** (= baseY by default = no tilt)
- Wave field y range vs other elements:
  - Logo bottom: ~117 (gap of 13 above wave field)
  - Headline starts: 445 (overlaps with wave field — waves render behind text. If problematic, drop wave field height or move it up)
  - Button: 683 (well below wave field)

---

## Open questions / next steps

1. **The animation isn't done.** Vika hasn't said it looks right yet. Best approach next session: open the playground, dial in the sliders, hit "Copy JSON" or "Export code" when satisfied, then bake those values into the page (or the Ottavia client app).
2. **Lottie vs custom JS.** If Vika picks a Lottie file she's happy with, swap the SVG block for the `<dotlottie-wc>` element and we're done. Otherwise stick with the JS physics approach.
3. **Port to React Native.** When this lands in `ottavia-client`, the SVG approach needs to use `react-native-svg`. The animation loop should use `react-native-reanimated` (Animated API would also work but Reanimated runs on the UI thread). Class structure ports directly; only the path-string update mechanism changes.
4. **v2 and v3 of onboarding** — the version-switcher pill is in place but only v1 has content. Vika will design v2/v3 next. Each version is a `<section class="version" data-v="...">` — drop content inside.
5. **Versions of the splash and other onboarding screens.** Vika said "this is a large shift" — so the redesign goes beyond the splash. Other screens (post-splash) need designing too. Currently nothing is built for those.
6. **Headline font** — using Modern Era Medium (Trial). For production, need a proper license or replacement font.

---

## Workflow that's been working

- Vika has a "new task" procedure (saved in memory) — sync develop, make a Jira ticket, branch off develop, launch iOS simulator
- For the design playground: branch off `origin/main` of `ottavia-design`, edit, preview locally, push when ready
- I'm explicitly told **not to push to main** of either repo, and not to build/run the ottavia-client app to verify (Vika tests in the simulator herself, but the new task procedure includes auto-launching the simulator)

---

## Things to remember (Vika's preferences)

- Don't use em-dashes (—); use commas, periods, parentheses
- Don't use the word "health" for Ottavia; use "wellbeing"
- All design system elements should be labeled "Used in: [...]"
- Don't inline hex codes in ottavia-client; use `COLORS` tokens from `MarkdownStyles.ts`
- Always set `customfield_10020` to the active sprint when creating Jira tickets

---

## Quick recipes

**To resume tuning the animation:**
1. Open `ottavia-design/onboarding-flows.html` directly in a browser (not via the playground iframe — the panel is hidden in embed mode).
2. Play with sliders. State auto-saves.
3. When happy, click "Export code" → paste the HTML into a new file or send to me to integrate.

**To add a new onboarding version (v2/v3):**
1. In `onboarding-flows.html`, find the `<section class="version" data-v="v2">` block.
2. Drop in the new screen content (status bar + ribbons + version-specific content).
3. The version switcher pill at top-right will toggle between them.

**To swap to a different Lottie file:**
1. In the `<dotlottie-wc>` element inside `.waves`, change the `src=` URL.
2. Click "Lottie" toggle at top of the panel to view it.

**To start fresh on the parameters:**
- Click Reset (wipes localStorage) — gives factory defaults.

---

## Files modified this session

- `ottavia-design/index.html` (added Onboarding flows card)
- `ottavia-design/onboarding-flows.html` (entire prototype + control panel + JS physics)
- `ottavia-design/assets/ModernEra/*` (font files Vika placed)
- `ottavia-design/assets/onboarding-wave-{orange,blue}.svg` (initial Figma export, no longer referenced)
- `ottavia-design/onboarding-design.md` (this file)

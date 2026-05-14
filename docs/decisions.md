# Decision Log

Decisions outside the master prompt's specification. Newest first.

---

## 2026-05-14 · W1 · Foundation choices

**Decision:** Use **pnpm** as package manager (lockfile `pnpm-lock.yaml`).
**Reason:** Felix already has pnpm 11 installed; faster + deterministic; better for monorepo evolution if we ever split out a `@bachschuster/ui` package.

**Decision:** Defer Howler.js + R3F stack + d3 installation to their respective weeks (W3/W2/W4).
**Reason:** Smaller initial bundle, faster `pnpm install`, less surface to manage. SoundContext lands as a typed stub in W1; real Howler wires up in W3 when audio assets land.

**Decision:** Tailwind v3 (not v4).
**Reason:** Master prompt §4 fixes Tailwind 3.x. v4 has breaking config-as-CSS changes we don't need.

**Decision:** React Router 6.27 (not 7.x).
**Reason:** Master prompt §4 specifies "6.4+", and v6 Data Router is stable + well-documented. v7 retains compatible API but isn't required.

**Decision:** `lenis` package (not `@studio-freight/lenis`).
**Reason:** Studio Freight renamed/migrated the package; `lenis` is current canonical name.

**Decision:** GSAP installed via standard `gsap` npm package — no GSAP Club.
**Reason:** As of GSAP 3.13 (Webflow acquisition, May 2025), all plugins including the formerly Club-only ones (SplitText, DrawSVG, MorphSVG, Physics2D, Inertia, MotionPath) are free under the standard package.

**Decision:** TS `exactOptionalPropertyTypes: false`.
**Reason:** Many React + 3rd-party libs use optional props that this flag punishes. We keep `strict + noUncheckedIndexedAccess` which gives us the meaningful safety without the noise.

---

## 2026-05-14 · W1 · Motion + Cursor + Sound design

**Decision:** Lenis duration 1.4s + quartic-out easing function `t => 1 - (1-t)^4`.
**Reason:** Master prompt § 3.4 specifies `ease.cinematic = [0.16, 1, 0.3, 1]` (cubic-bezier) and § 7 W3 confirms `duration: 1.4`. Lenis takes a `(t) => number` easing — the quartic-out is the cleanest closed-form approximation of that bezier curve (both are slow-in / fast-out / decisive-arrival shapes).

**Decision:** Custom Cursor — 4px dot tracks pointer with **zero damping** (gsap.quickTo `duration: 0`), 24px ring trails with **0.18s damping** (`power3.out`).
**Reason:** Active-Theory style. Dot must feel like the "real" pointer (no lag); ring is the editorial flourish. Master prompt § 3.5 specifies "GSAP Quick-To für 60fps, **kein React-State pro Frame**" — implementation honors this (state changes only on cursor-mode transitions, not per pointermove event).

**Decision:** Magnetism radius **80px**, pull factor **0.4**, scale 1.4× at full pull. Opt-in via `[data-magnetic]` attribute (set per element).
**Reason:** Master prompt § 3.5 specifies "dezenter Magnetismus" — dezent = subtle. 80px / 0.4 lets the ring nudge toward buttons without snap-to-center violence. Opt-in attribute means body text doesn't accidentally pull the ring.

**Decision:** Custom Cursor disabled on touch devices, coarse pointers, and `prefers-reduced-motion`.
**Reason:** Browser cursor is the right primitive on those platforms. Master prompt § 3.5 says "Über Body Text: invisible (Browser-Cursor reicht)" already implies the browser-cursor fallback is acceptable.

**Decision:** Single `useUIStore` Zustand store (not multiple stores).
**Reason:** Only ~6 fields, no perf concern. Splitting later is cheap if a section's render gets noisy.

**Decision:** SoundProvider exposes stable API `{isEnabled, toggle, register, play, stop}` with no-op `register/play/stop` in W1.
**Reason:** Consumers can wire `register()` calls at section mount today; W3 swaps the implementation under the same surface (Howler instances backing the registry). No call-site changes needed in W3.

**Decision:** `data-cursor` attribute on hovered elements sets cursor mode (not React props/context).
**Reason:** Decouples cursor-state from component prop-drilling. Any element can opt in by adding `data-cursor="link"` etc. The CustomCursor's pointermove handler walks `closest('[data-cursor]')` to read the mode — fast, no listener-per-element.

---

## 2026-05-14 · W1 · 5th Werke deep-dive project

**Decision:** The 5th Werke deep-dive project (per master prompt § 6.3 placeholder slot) is **VW Hope Academy Südafrika (2006–2009)**, located in `public/projects/vw-hope-academy-suedafrika/`.
**Reason:** Master prompt § 6.3 explicitly wishes "idealerweise eines aus Johannesburg, Dubai, Indien oder Brasilien für globale Range" for the 5th project. VW Hope Academy is in South Africa and aligns with Bachschuster's existing Johannesburg office (§ 6.4). It's also socially resonant — a school for talented kids from disadvantaged families — which fits the strukturplanung narrative about resolving conflicts between stakeholders (here: industry/VW, communities, education ministry). Stronger pitch story than the Mobile Space Indien alternative (more visual experiment) or Shandong (China-overlap with EXPO Shanghai).

**How to apply:** When building `src/content/projects.ts` for W5/W6 Werke deep-dives, slot VW Hope Academy as the 5th Project entry. The four spec'd projects from § 6.3 plus VW Hope Academy = 5 deep-dive Röntgen-scrolls. The /architektur catalog projects (Forsthaus, EFH-series, Edeka, Autohaus, Kunst-Kultur Donau, etc.) become Werke-Index-Grid entries without dedicated deep-dive pages — they get a click-through to a smaller layout or a simple image carousel.

---

## 2026-05-15 · W5 · Werke Index + WestPark Röntgen-Scroll

**Decision:** Five featured Röntgen-Scroll deep-dives (master-prompt §6.3 set: WestPark, Shanghai Pavillon, Mobility Hub, Sen Friedenszentrum + Felix's 5th VW Hope Academy). Other 13 catalog projects render as grid tiles only — no `/werke/:slug` deep-dive page beyond a `PageScaffold` placeholder.
**Reason:** Master prompt §6.3 specifies four deep-dives, decisions.md 2026-05-14 nominates VW Hope Academy as the 5th. Spending bespoke layer authoring on the remaining 13 would dilute attention from the spec'd projects and inflate scope past the 11-week budget. Tile-grid cards still surface every project — they just don't unlock the X-ray sequence. The placeholder route also avoids "click into nothing" dead-ends.

**Decision:** Total project count = 18 (5 featured + 13 catalog), not 16.
**Reason:** Master prompt §6.3 names Shanghai Pavillon + Sen Friedenszentrum as deep-dive entries even though no image folders exist for them yet (MAPPING.md). They need to appear in the index so the master-prompt slate is visible end-to-end. The two image-less cards render a coordinate-grid SVG placeholder with the project's slug-code so empty cards feel intentional, not absent.

**Decision:** Röntgen-Scroll = a single pinned ~500vh ScrollTrigger with crossfade-by-progress between five stacked `<svg>` layers + an `<img>` photo overlay on layer 00 + a vertical scanner line riding the cross-fade band + an annotation rail that swaps content at a 0.55-frac threshold.
**Reason:** The metaphor of "X-ray" wants the user to perceive layer-stripping as a single continuous sweep, not five jump-cuts. A pin with scrubbed cross-fades preserves the cinematic 60fps motion budget the hero set — no react state on the hot path; all opacity writes go through `gsap.set` inside a single `onUpdate`. The 0.55 threshold for annotation-swap (rather than 0.5) makes the dominant-layer label switch FEEL definitive — the user is past the visual midpoint before the text changes.

**Decision:** 5 hand-authored SVG diagrams per WestPark layer, no full-res photography.
**Reason:** MAPPING.md flags WestPark cover-hero + full-res originals as missing — 311×233 thumbnails can't carry a Röntgen-Scroll hero. SVG diagrams (truss, flow arrows, sightline fan, stakeholder schema) are the right medium for the systems-underneath-the-skin story anyway — Strukturplanung is an idea, not a photograph. The thumbnails get used in the layer 00 photo overlay (which dissolves into the SVG elevation by frac 0.2) + the post-Röntgen context gallery.

**Decision:** Five layers' renderer set keyed by slug; non-WestPark featured projects (Shanghai, Mobility, Sen, VW Hope) reuse the WestPark renderers as W5 placeholders so navigation works end-to-end.
**Reason:** Master prompt week-cadence puts the other deep-dives in W6. Shipping their routes blank in W5 would leave 4 broken Links in the index. Reusing the renderers + clearly stubbed layer.body strings (`'Folge in W6.'`) lets Felix preview the layout end-to-end and decide W6 priorities, while the W6 task is bounded: replace 4 × 5 = 20 layer renderers and bodies.

**Decision:** `SplitText` instances are stored in a `let split` outside `gsap.context` and `split.revert()` is called from the `useEffect` cleanup BEFORE `ctx.revert()`.
**Reason:** SplitText mutates the headline's child node list by wrapping every character in a `<span>`. When React tries to unmount the headline, it walks its expected child list (the original text nodes) and calls `removeChild`, which throws `NotFoundError` because the SplitText spans replaced them. Calling `split.revert()` first restores React's expected DOM, then `ctx.revert()` kills the gsap timelines that referenced the (now disposed) span elements. Order matters.

**Decision:** Filter chip counts pre-computed in a `useMemo` over `projects`, not per-render.
**Reason:** With 18 projects + 6 filter chips, recomputing on every render would be trivial cost but the memoized count map also acts as a typed `Record<FilterId, number>` shape that protects against new categories slipping through unhandled. The count display (`"Privatbauten 04"`) is part of the editorial filter typography — chips that say `00` would be visual deadweight.

---

## 2026-05-14 · W2 · Hero particle system architecture

**Decision:** Four-tier performance system instead of single quality level: `full` (80 k particles + PostFX), `mid` (40 k + PostFX), `mobile` (15 k + no PostFX), `reduced` (static SVG, no WebGL).
**Reason:** Master prompt § 7 W2 DoD demands "60 fps on M1, 45+ fps mid-tier" plus a mobile fallback at 15 k and a `prefers-reduced-motion` variant. A single quality level would either tank on weak hardware or look anemic on strong hardware. Tiers let us hit the bar everywhere.

**Decision:** uMorph driver is a `useRef<number>` mutated directly by `ScrollTrigger.onUpdate` and `DebugLayerSlider`, read inside `useFrame`. No React state for the per-frame value.
**Reason:** With `scrub: true`, ScrollTrigger fires onUpdate on every scroll tick (60–120 Hz). React state would cause that many re-renders. The ref-based pattern keeps React out of the hot path entirely — shader uniform mutation happens in the GSAP / R3F frame loop.

**Decision:** ScrollTrigger pin for `+=400 %` extra (= 500 vh total pinned scroll), `scrub: true`, `anticipatePin: 1`.
**Reason:** Master prompt § 7 W2 task 5: "Pin für 500 vh". `anticipatePin: 1` eliminates the one-frame jump when the pin engages, matching the "smooth" requirement in DoD.

**Decision:** PostFX preset = "subtle Active Theory" — Bloom intensity 0.5 / threshold 0.85, ChromaticAberration offset 0.0008, Vignette offset 0.4 / darkness 0.6. Approved by Felix in W2 concept review.
**Reason:** Master prompt § 7 W2 task 6 specs Bloom 0.6, Vignette subtle, ChromaticAberration max 0.0015. Felix asked for "spürbar aber nicht aufdringlich" — pulled the values back from the spec's max to land closer to Active Theory's subtle-cinematic preset. ChromAb 0.0008 reads as lens, not glitch.

**Decision:** Custom 5-layer shader with attribute-array target picker, not five separate materials.
**Reason:** Switching materials mid-scroll would require disposing GPU buffers and rebuilding geometry — would induce frame drops at every layer boundary. Single material with `aTarget0..aTarget4` + `aStkColor` lets the GPU interpolate continuously. Memory cost: ~7 MB at 80 k particles. Fine.

**Decision:** Loading emergence uses `emitter = morphedPos * 0.02` (tiny per-particle starting offset derived from each particle's own target), then lerps to `morphedPos` as `uReveal` goes 0→1. Curl-noise drift scaled by `uReveal` too.
**Reason:** A single-point burst would create a giant additive-blend bloom spike at frame 1. Per-particle scaled-down emitter spreads them in a small cluster that retains the city's silhouette in miniature, so the reveal feels like growth instead of explosion. Drift gating prevents pre-reveal jitter.

**Decision:** Curl-noise idle drift uses Ashima-Arts 3D simplex + finite-difference curl (6 noise evals/particle/frame). Not simplified for mobile.
**Reason:** 15 k particles × 6 noise evals × 60 fps = 5.4 M noise calls/s. Modern phones (iPhone 12+, mid-tier Android) handle this trivially. Removing curl noise on mobile would freeze the idle motion and visibly cheapen the experience — not worth the marginal cost saving.

**Decision:** FPS watchdog via drei `<PerformanceMonitor>` with bounds [45, 60] fps, flipflops 3. Auto-downgrade only (no upgrade path).
**Reason:** Master prompt § 7 W2 DoD wants performance floor + mobile fallback. The watchdog auto-handles the case where a desktop device is weaker than its core count suggests (older GPU, integrated graphics). No-upgrade-path prevents thrash: once we've decided the device is struggling, we stay generous.

**Decision:** Camera parallax `PAN_X 1.0 / PAN_Y 0.55 / DAMPING 0.08`.
**Reason:** Master prompt § 7 W2 task 7 specifies damping 0.08, doesn't quantify pan. Values picked to give ~12° horizontal / ~7° vertical swing at canvas edges — subtle enough to feel "lens" not "swivel". Y is dampened more (0.55 vs 1.0) because vertical pan reveals the ground plane awkwardly when too pronounced.

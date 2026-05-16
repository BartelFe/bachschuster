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

## 2026-05-16 · W9 · Audio + Loading + Transitions + Micro-interactions

**Decision:** Curtain-wipe page transitions driven by GSAP timeline inside a `<PageTransition>` wrapper around `<Outlet />` — no Framer Motion.
**Reason:** GSAP is already the project's animation grammar; adding Framer Motion just for AnimatePresence would land a 60+ KB chunk for one feature. The custom timeline runs cover (0.55 s power3.in) → covered-dwell (0.18 s) → reveal (0.7 s power3.out), with the page content fading out + back in around the curtain. The dwell phase is critical: it gives R3F instances (Hero canvas, Globe) the frame budget they need to dispose cleanly before React detaches the DOM — which mitigates the long-standing R3F + Suspense + StrictMode `removeChild` error on SPA nav from Home → any other route. We can re-evaluate Framer Motion if a future week needs more declarative entry/exit timelines per route.

**Decision:** Loading screen uses plain `setInterval` + CSS transitions, NOT GSAP.
**Reason:** The loader runs BEFORE the rest of the app's RAF-driven layers (Lenis, R3F) settle. During build + verification we observed a startup race where Lenis's `gsap.ticker.add` could starve fresh GSAP tweens of frames in some throttled/inactive contexts. Plain `setInterval` + CSS `transition` is deterministic, framework-agnostic, and removes the loader from any chain of inter-library dependencies. The counter uses a manual ease-out curve (`1 - (1-t)²`) over 30 ticks to feel non-linear without an easing library.

**Decision:** Loading screen shows once per tab via `sessionStorage.bs-loaded`, NOT once per session.
**Reason:** Per-session would trigger on every route change inside the SPA (since RootLayout doesn't unmount, but a back-button to home from `/werke` might cause a re-mount). Per-tab means the visitor sees the brand mark once on first paint, and never again during their browsing session — including via SPA back-button. Cleared automatically when the tab closes.

**Decision:** Audio layer extends the existing Web-Audio drone with two new procedural layers (`paperRustle` for Manifest, `methodeTicks` for Methode + Strukturplanung).
**Reason:** The master prompt §3.6 calls out section-specific ambients (paper rustle, mechanical ticks). We have no audio assets. Procedural synthesis from the existing AudioContext produces convincing-enough layers with zero asset weight: paper = bandpass-filtered noise + chaotic LFO; ticks = sparse 120 Hz exponential-decay clicks scheduled at 1.5–4 s random intervals. Same `AmbientLayer` interface as the drone — SoundProvider mixes all three per section with `paperVolumeFor` + `tickVolumeFor` helpers parallel to `droneVolumeFor`. Felix can later swap any layer for a Howler-backed file without changing the SoundProvider call-sites.

**Decision:** ScrollProgress bar uses `gsap.quickTo` driven by a ScrollTrigger, sits at top edge (`fixed inset-x-0 top-0 z-[150] h-[2px]`), terrakotta.
**Reason:** Pitch-grade sites get a scroll-progress affordance — gives the visitor a sense of depth in long sections (Hero pin, Werke index, Stimmen timeline). 2 px is invisible until you look for it; terrakotta-on-ink reads as deliberate brand-marking, not browser-chrome. quickTo + ScrollTrigger ensures 60 fps without React state.

**Decision:** Cursor mode variants implemented in `globals.css` via attribute selectors on `[data-cursor-mode=...]`, not in the CustomCursor JSX.
**Reason:** Keeps the JSX clean (CustomCursor stays a 4 px dot + 24 px ring with the magnetism logic), and the variant styling is declarative: `link` scales the ring 1.15× + brightens border; `media` enlarges the ring to 44 px + tints accent + fills the inner dot; `data` rotates 45° into a diamond. New modes can be added with a single CSS rule.

**Decision:** Global press-feedback (`scale(0.97)` on `:active`) applied via CSS to any `[data-cursor=link]` or `[data-magnetic]` element.
**Reason:** Modern click affordance without per-component wiring — every magnetic / link-cursor element gets it for free. 120 ms `ease.punchy` matches the site's button-feedback expectations.

**Decision:** Form-field underline animation is CSS-only via `.bs-field-underline` opt-in class.
**Reason:** The Kontakt wizard inputs already use a `border-b` underline with `focus:border-accent`. The CSS class extends that with a 0%→100% horizontal sweep when the field receives focus (`background-size` transition on a gradient image). Opt-in so other inputs (e.g. the Werke filter) don't accidentally get it.

**Decision:** Vite dev server moved from default 5173 → 5180 in `vite.config.ts`.
**Reason:** Felix's sibling project (Jakob-Bader) often holds 5173/5174. Without an explicit higher port, Vite's auto-bump puts bachschuster on whichever port is free, breaking the preview-tool's launch.json pointer at 5174. 5180 is sufficiently isolated from common dev defaults. `strictPort: false` keeps the fallback intact.

---

## 2026-05-16 · W8 · Stimmen + Team + Kontakt-Wizard

**Decision:** Vorträge timeline = year-grouped, region-filterable, no separate detail pages.
**Reason:** 29 talks across 17 years is enough to fill a scroll without per-talk modals. The year-band header creates rhythm; the region filter (Deutschland / Europa / Asien) lets the visitor narrow to their relevance in one click. Per-talk detail pages would inflate scope and add dead-end nav for what is, content-wise, a 2-line vortrag entry.

**Decision:** Publikationen / Jury & Beiräte / Awards render as "in Vorbereitung — folgt"-blocks rather than getting dropped from the page.
**Reason:** Bachschuster doesn't currently publish either set; dropping the columns would leave Stimmen as "just Vorträge" and miss the master-prompt §6.6 intent of the page being the firm's curriculum. Three editorial placeholder columns signal the intended completeness while remaining honest about today's data gap. Felix can append entries to the empty arrays in `stimmen.ts` post-pitch.

**Decision:** Team portraits = stylised hand-built SVG composites, NOT photo crops.
**Reason:** Felix's brief 2026-05-16: "darauf basierend die Bilder der Team mitglieder nachkonstruierst." The team photo on `public/teamfoto.avif` is a tilted-mosswall studio composite that would look out of place if cropped into circular avatars on the dark editorial site. Stylised SVG portraits (head silhouette + hair shape + glasses + outfit-coloured torso, all on a moss-textured backdrop tile) match the rest of the site's "we draw what we mean" aesthetic — and don't claim photographic likeness, which removes any uncanny-valley risk. Each member's matchback is via outfit colour + hair shape derived from the photo (e.g. Melanie's accent-orange dress, Peter's green polo, Vera's long brown bangs).

**Decision:** Peter Bachschuster is on the Team page as Hero, not in the cards grid.
**Reason:** He's the principal — placing him in a 3-column grid alongside team members would understate the position. Split layout: principal hero band (portrait + long bio + Ewald-Kluge family-heritage) then a 5-card grid for the colleagues, then the Soziales-Engagement block.

**Decision:** Soziales Engagement (Victory Kindergarten Ukunda + Ewald Kluge e.V.) lives at the bottom of the Team page in light-mode, not as its own route.
**Reason:** Soziales attaches to Peter's biography (Rotary Ingolstadt-Kreuztor membership) and the Ewald-Kluge heritage already in the Team hero. Splitting it out would orphan it; a tonal break to bg-paper (matches the Manifest section's editorial-light pattern) frames it as the natural conclusion of "wer wir sind."

**Decision:** Kontakt-Wizard = 5-step form with mailto: submit, no backend.
**Reason:** Pitch v1 lives on Vercel without server functions. A real form would require Resend/Formspree wiring + an env var; a mailto: link lands the user one click from sending in their own client and uses zero infra. The collected briefing prefills the subject + body so info@bachschuster.de receives a structured message rather than "hi please call me." Post-pitch upgrade path: swap `window.location.href = mailto:…` for a fetch() to a Vercel function and keep the same form-state shape.

**Decision:** Kontakt-Wizard validation is local + permissive (name + valid-looking email + 10-char brief).
**Reason:** Hot leads bouncing off an over-aggressive validator is worse than a few off-spec submissions. The regex `/.+@.+\..+/` catches obvious typos without rejecting unicode TLDs or company domains. The 10-char minimum on the brief stops empty submissions without forcing essay-length copy.

**Decision:** Footer now carries live local times for all 4 standorte (re-tick every 60 s) + a real counter band citing `projects.length`, `vortraege.length`, `2026 - brand.founded`.
**Reason:** Pitch-grade footers earn their height. Live-counting numbers from the content layer means the footer can never drift from the rest of the site — adding a project bumps the footer count automatically. The local-time row reinforces the "we work across three continents simultaneously" thesis without needing the user to scroll back up to the Globe.

**Decision:** Dev server port = 5180 (not Vite default 5173 or the prior 5174).
**Reason:** Felix's other project (Jakob-Bader) often holds 5173+5174; the previous launch.json's port-5174 entry collided with it during W8 verification and stranded the preview server on Jakob-Bader's vite. 5180 is sufficiently far from common dev defaults to avoid future collisions. `strictPort: false` keeps the auto-bump fallback intact for the unlikely case 5180 is also taken.

---

## 2026-05-15 · W7 · Globe Deep Dive (/netzwerk)

**Decision:** Shader-driven wireframe-dot earth instead of textured photographic basemap.
**Reason:** No basemap textures exist in the asset pipeline and sourcing high-res ones (Blue Marble at 8 k+, properly cleaned) would balloon the bundle and the asset pipeline. The shader synthesizes a continent SDF from layered value noise + a lat/lng grid + a polar-aware dot matrix. It reads as "earth" at the editorial scale of the pitch without claiming geographic accuracy — and it matches the dot-grid blueprint motif we use in the Werke index placeholder cards, reinforcing the brand grammar.

**Decision:** Day/night terminator driven by real-time sun position (Spencer 1971 declination fit + equation-of-time correction), updated every 1 s in a parent ref consumed by the earth shader's `uSunDir` uniform.
**Reason:** A static terminator would feel like a screenshot. A wall-time-driven one means every visit shows a slightly different earth — Felix in Ingolstadt at midnight sees Asia lit, Shanghai-time visitors see Europe lit. The terminator's terrakotta dawn-glow band passes over the 4 standorte pins through the day. Cost: trivial — one Vector3 update / sec, the shader does the dot product per fragment.

**Decision:** Pins + connection arcs sit inside a `<RotatingGroup>` that mirrors Earth's autorotation rate, so they appear glued to the surface. The CameraFly component compensates by counter-rotating the group when a standort is locked.
**Reason:** Putting pins at world-fixed positions while the earth rotated beneath them would have them slide off their cities. Mounting them onto a co-rotating group keeps the geography correct. The lock mechanism in CameraFly subtracts the autorotation phase from the desired target angle each frame so the lerped destination accounts for the ongoing spin.

**Decision:** No OrbitControls — only programmatic camera flies triggered by panel/pin selection.
**Reason:** Free-drag rotation would invite the user to spin the globe and lose context. The 4 standorte are the entire interactive surface; constraining navigation to "click a standort" keeps the experience editorial rather than toy-like. The autorotation handles "wait, what's behind?" by surfacing the back side every 5 minutes.

**Decision:** Lat/lng-to-Vec3 uses `z = -sin(lng)` (negative z) so lng=0 sits at +X and increasing longitude rotates westward in three.js's right-handed system.
**Reason:** Default Vector3 mapping would have placed Ingolstadt (11°E) and Linz (14°E) on the back-right of the globe rather than the front-left. Inverting Z mirrors the projection so the standorte appear in their geographically intuitive positions when the user lands on the page facing 0°/0° (Atlantic).

**Decision:** R3F Canvas wrapped in an explicit `<div className="absolute inset-0">` AND a one-time `window.dispatchEvent('resize')` after globe mount.
**Reason:** Lazy-loading the WebGL chunk causes the canvas to mount AFTER the parent grid cell has already settled at its 805×720 px. `react-use-measure`'s initial ResizeObserver entry races with this and can leave the canvas stuck at its 300×150 intrinsic default. Firing one synthetic resize event after mount forces a re-observe — the canvas snaps to its container size on the next frame. (Bug investigated 2026-05-15, repro on cold dev-server loads.)

**Decision:** Reduced-motion fallback is an SVG equirectangular dot-grid earth with 4 static markers — no WebGL, no autorotation, no live terminator.
**Reason:** `prefers-reduced-motion` users get the same standort information (city, country, role inferred from position) without any movement. Maintains accessibility without dropping the section entirely.

**Decision:** NetzwerkTeaser on HomePage uses pure SVG (no R3F).
**Reason:** Loading the WebGL chunk on the home page just to preview the standorte would tax cold visits for a teaser. SVG teaser carries the live local times via the same `formatLocalTime` helper, so it still reads as "live" without 250 KB of three.js.

---

## 2026-05-15 · W6 · Four more Röntgen-Scroll deep dives

**Decision:** All four W6 deep dives get their own bespoke SVG layer-renderer file in `src/components/werke/roentgen/layers/` (ShanghaiLayers, MobilityHubLayers, SenLayers, VWHopeLayers). No shared base — each project authors its own visual grammar from the same 1600×900 viewBox.
**Reason:** A shared layer base would homogenize the deep dives into a templated feel. The pitch wants each project to look like its own piece of editorial — Shanghai gets a Sankey ribbon for material flow that doesn't appear anywhere else; Sen gets sacred-geometry circles instead of an engineering grid; VW Hope gets a Venn-style Trägermodell. The repetition appears only at the Strukturplanung layer (always a 4–7 node stakeholder schema around a central mediator), and that repetition IS the pitch — Strukturplanung is the throughline.

**Decision:** Pin length scales as `(total - 1) * 125vh` per project, not a fixed 500vh.
**Reason:** 5-layer projects (WestPark, Mobility Hub) get 500vh pin = 600vh total exposure. 4-layer projects (Shanghai, Sen, VW Hope) get 375vh pin = 475vh exposure. Per-transition scroll-budget stays constant at 125vh, so the feel of one layer dissolving to the next is identical across all five deep dives. Felix's user shouldn't sense "the Sen page scrolls faster than WestPark."

**Decision:** Project-specific colour palettes drawn from existing Tailwind stakeholder tokens, no new colours.
**Reason:** Shanghai pulls accent (terrakotta) + stk-citizens (gold) — EXPO-ness without a literal Chinese-red. Mobility Hub uses all five stakeholder colours simultaneously on Layer 01 to encode the five mobility modes — cyan for cars, gold for scooter, moss for bus, etc. Sen uses stk-citizens as primary gold + accent for the central seed, no cyan — it's a sacred building, blueprints would be tonally wrong. VW Hope uses stk-environment (moss) for the schoolyard + accent for trakts — earth tones for a South African campus.

**Decision:** Strukturplanung layer (always the closing layer) uses identical visual template across all five deep dives: 4–7 stakeholder nodes circling a central terrakotta mediator node labelled "STRUKTURPLANUNG".
**Reason:** This is the cognitive anchor. The user will see the Strukturplanung layer five times across the deep-dive sequence — and recognise the schema instantly the second time. The stakeholders change (Bahn vs. EXPO-Komitee vs. Sangha vs. VW), the planning method does not. Visual repetition reinforces the brand thesis "vor dem Gebäude, das System."

**Decision:** WerkContext gallery hides when `project.images.length < 3` rather than rendering broken thumbnails.
**Reason:** Shanghai + Sen have zero photographic assets. Showing the "Bildmaterial folgt" notice keeps the page coherent — better an explicit absence than three broken-image icons. Pitch-time fix is to source originals; W6 ships the structural layout without them.

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

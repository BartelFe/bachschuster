# Decision Log

Decisions outside the master prompt's specification. Newest first.

---

## 2026-05-16 · W15 · Polish pass (mobile · skip-intro · audio · nav · SEO)

**Decision:** Skip-Intro link in Hero performs a Lenis smooth-scroll to `#manifest`, not a page-jump to `/methode`.
**Reason:** Audit § 3.1 / § 5.2 both call for a Hero-skip affordance. A `/methode` page-jump would amputate the Methode-Teaser / Werke-Teaser / Netzwerk-Teaser / Stimmen-Teaser / Kontakt-Teaser bridges on the homepage — those exist precisely so a non-Awwwards reader (Peter Bachschuster) gets the entire pitch in one scroll. Smooth-scrolling to `#manifest` preserves that journey while letting the user skip the 500vh pinned WebGL experience. Implementation: new module-level `lenisInstance` singleton in `lib/lenis.ts` + helper `smoothScrollTo(target, opts)` that falls back to native `window.scrollTo({ behavior: 'smooth' })` for prefers-reduced-motion users (who don't get Lenis mounted).

**Decision:** SoundToast moved to bottom-right, threshold raised 64 px → 280 px, dismiss timer 9 s → 7 s.
**Reason:** Audit § 5.3: "dezenter machen". Bottom-centre + 64 px-threshold triggered while the user was still reading the Hero — interrupting the editorial moment the site is selling. Bottom-right at 280 px puts the nudge in peripheral vision once the user is already engaging with content. Once-per-session via `useUIStore.hasShownSoundToast` was already in place.

**Decision:** Nav active-state in Header now carries an accent underline (`after:` pseudo-element with `scale-x-100 bg-accent`), not just a colour shift to `text-bone`.
**Reason:** Audit § 5.4: colour-only active state in dark mode was indistinguishable from hover. Underline mechanic mirrors the StimmenFilter chip pattern — consistent grammar for "this is selected" across the site. Hover gets a softer `bone-faint` underline so the affordance still pre-announces the click.

**Decision:** OG image per `/werke/:slug` deep-dive routes to `project.images[0]` when present, otherwise falls back to site-default `/og.svg`.
**Reason:** Audit § 5.6 flagged identical `/og.svg` previews for every werk as a missed SEO opportunity. Per-werk image gives Slack/Twitter/LinkedIn previews the actual built artefact for Werke that have photos (WestPark, Mobility Hub, VW Hope, the 13 catalog projects). Shanghai + Sen have no photos yet and keep the site default. AVIF is supported by all modern OG crawlers (LinkedIn/Twitter/Slack/Discord since 2022).

**Decision:** Werke index featured-card row-span scales: `row-span-1` on mobile, `row-span-2` from `sm:` upward.
**Reason:** Audit § 5.1 mobile: v1 always rendered featured cards at row-span-2 with `auto-rows-[clamp(220px,28vw,360px)]`, producing 440+ px tall tiles on 375 px-wide phones. The featured stack on mobile reads as a vertical hero-block train. Single-row on mobile keeps the grid breathing while preserving the wide hero-and-companion layout on tablet+.

**Decision:** Hero Bauchbinden grid stacks dt/dd vertically on mobile, only switches to two-column `auto_1fr` from `sm:` upward.
**Reason:** Audit § 5.1: locations row ("Ingolstadt · Shanghai · Johannesburg · Linz") overflowed 375 px viewports in the original two-column layout. Stacking on mobile with a smaller dt label keeps the line legible. SectionTracker also reduced its mobile text sizes (`text-lg` h2 instead of `text-2xl`) and capped `max-w-[18rem]` to avoid collision with the Skip-Intro button.

**Decision:** Skipped Lighthouse-CI run; left as a Felix-pre-pitch checklist item.
**Reason:** No Vercel preview available from this session, and `pnpm preview` against a local dev build doesn't represent production CDN performance. The relevant code paths (idle-check in ForceGraph, OrbitControls update gating, lazy chunks for WebGL) have been reviewed and show no regressions over W10's measured 193 kb gz / 237 kb gz Three.js chunk baseline.

---

## 2026-05-16 · W14 · Methode + Werk page restructure + Netzwerk OrbitControls

**Decision:** `/methode` page now has five sections in sequence: MethodeIntro → MethodeSection (pinned ForceGraph) → MethodeCaseStudies → MethodeIIRD → MethodeManifestSchluss.
**Reason:** Audit § 4.1: v1 was a single pinned ForceGraph with no overture or follow-through. The new rhythm gives the page beginning/middle/end — preview the three modes statically, experience them interactively, see them resolved in three real projects, anchor in the institutional iiRD partnership, exit on the slogan + CTA to Werke. The page now reads as an essay, not just a toy.

**Decision:** MethodeCaseStudies pulls case data (Akteure / Vorlauf / Ergebnis) from existing `Strukturplanung` layer `data` fields in `src/content/projects.ts`, not from new content.
**Reason:** The three featured Werke (WestPark, Mobility Hub, VW Hope) already encode this data on their Strukturplanung layer. Surfacing it as case-study mini-cards on /methode is pure layout — zero new prose fabricated, which keeps the content-integrity ledger clean. If Felix adds a 6th case, only the `CASES` constant needs the conflict-sentence; everything else falls through from `projects.ts`.

**Decision:** Werk deep-dive page rhythm is now WerkHero → WerkBrief (paper-light) → WerkTransitionQuote → RoentgenScroll → WerkContext.
**Reason:** Audit § 4.2 / § 3.3: v1 opened with a text-only hero then jumped to the Röntgen X-ray, which reads architecturally backwards (photo of building should come before its system-layer analysis). New order: photo hero → architectural-magazine briefing in paper-light → transition pull-quote ("Was du gesehen hast ist die Antwort. Was du gleich siehst ist die Methode.") → Röntgen → gallery. Three theme switches (dark → paper → dark → dark → paper) create rhythmic depth.

**Decision:** WerkBrief's second paragraph reuses the Strukturplanung-layer's verbatim `body` text rather than inventing new prose.
**Reason:** The Strukturplanung layer already contains the "why this project required mediation" copy — surfacing it earlier (in the Brief) and then again in the Röntgen-Scroll's Strukturplanung layer reinforces the conflict narrative without duplicating effort or risking content drift between two prose sources.

**Decision:** Werke index filter respects per-card viewport position on filter swap — already-visible cards land at end-state without animation, off-screen cards retain the ScrollTrigger reveal.
**Reason:** Audit § 4.3: v1 reset every card to `(yPercent 12, opacity 0)` on filter change. Cards inside the viewport then stayed invisible until the user scrolled, producing a jarring flash-of-empty-grid. The `getBoundingClientRect`-based gate solves it in 6 LOC without breaking the off-screen reveal cadence.

**Decision:** Netzwerk Globe rotation refactored to OrbitControls-only — Earth-mesh and pin/arc group no longer rotate themselves.
**Reason:** Audit § 4.4: globe was non-interactive (no drag), and the v1 had two rotation systems (Earth's `useFrame` + RotatingGroup's `useFrame`) that drifted apart over time. OrbitControls.autoRotate spins the camera at 0.4 around a stationary earth, collapsing rotation to one source of truth. Constraints: `enableZoom:false`, `enablePan:false`, polar [0.22π..0.78π] to keep users out of the poles. CameraFly now lerps `camera.position` onto `target.normalize() * 2.4` when a standort is selected, instead of locking a group rotation angle.

**Decision:** "Rotation freigeben" button appears top-right of the Globe canvas only when `activeIndex >= 0`.
**Reason:** Audit explicitly requires an "unlock" affordance. Without it, the only way to re-enable autoRotate after clicking a standort is to click another standort. The button calls `setActiveIndex(-1)` which both releases the camera lerp and turns autoRotate back on. Editorial trim style — small mono button with backdrop-blur, sits alongside the existing top-left section ID.

**Decision:** Earth shader uniforms tightened (`uContinentDensity 0.58 → 0.64`, warmer `uColorLand`) but no NASA Blue Marble texture loaded.
**Reason:** Audit § 4.4 recommended Option 1 (Blue Marble texture) for credibility. Asset isn't in the pipeline yet and adding a 2 MB lazy AVIF download requires Felix's curation. The uniform tweaks make continents read more prominently in the procedural shader without committing to a half-baked texture path. NASA Blue Marble at `public/textures/earth-blue-marble.avif` + a texture-loading branch in Earth.tsx is the obvious follow-up if Felix wants pre-pitch credibility upgrade.

**Decision:** Stimmen Placeholder columns (Publikationen / Jury / Awards) removed for pitch v1.
**Reason:** Audit § 4.5: "— folgt —"-blocks read as unfinished and undercut the substantial 29-Vorträge timeline above them. Better to ship a complete-looking Stimmen page with one substantial column than three columns where two are explicitly empty. The arrays in `stimmen.ts` stay so re-enabling is one-line content addition + un-deleting the JSX block.

---

## 2026-05-16 · W13 · Narrative repair (Hero · Methode-Intro · Werk Photo-Hero)

**Decision:** Hero's prominent layer indicator migrated out of HeroHeadline into a rewritten SectionTracker at top-left of the section.
**Reason:** Audit § 3.1 A: the v1 layer indicator was a tiny mono caption pinned bottom-right that read as a debug footnote. The new top-left SectionTracker renders display-scale uppercase ("GEBAUTE STRUKTUR") + accent-coloured `01 / 05` counter + small Fraunces italic tagline ("— Was sichtbar ist."). LayerInfo gained a `tagline` field — five short phrases pre-authored per layer. Watch the scroll-progress, change every layer transition. The old "Layer N · description" line under the H1 was removed because it duplicated the signal now carried more strongly above.

**Decision:** Hero Bauchbinden (dt/dd list of Disziplinen · Standorte · Seit) added below the headline.
**Reason:** Audit § 3.1 B: a non-Awwwards reader (Peter Bachschuster) lands on a flashy 500vh particle hero with no concrete orientation — three seconds of "what is this?". The Bauchbinden answer that hard: "Architektur · Stadtplanung · Strukturplanung", "Ingolstadt · Shanghai · Johannesburg · Linz", "Seit 1993". Small mono caption, three lines. Doesn't compete with the H1; gives the eye a place to land for the literal-minded reader.

**Decision:** Skip-Intro button in Hero top-right.
**Reason:** Audit § 3.1 C: necessary for non-Awwwards audience. Started as a Link to `/methode` (page-jump); W15 changed to smooth-scroll-to-`#manifest` (see W15 entry above) to preserve the homepage's content journey. Either way, the button releases the user from the 500vh pinned scroll without forcing them through it.

**Decision:** Methode-Page now opens with a static MethodeIntro section before the pinned ForceGraph.
**Reason:** Audit § 3.2: v1 dropped users into 400vh of pinned interactive simulation with no warning. MethodeIntro presents the three modes as a static 3-column preview (Chaos · Mediation · Struktur) with hand-drawn SVG miniatures of each (scattered red conflict lines / centre-mediator star / fully-connected green-gold pentagon). Reads as "understand first, then experience" — the user has the structure of what's coming before they encounter it as motion.

**Decision:** Werk deep-dive WerkHero became a full-bleed photo hero with bottom-anchored title + meta-grid, not the v1 text-first layout.
**Reason:** Audit § 3.3: for an architecture portfolio, opening with text-only hero ("WestPark / Verbindungssteg / 2020 / Ingolstadt / ...") is backwards — the user wants to see the building first. Photo cover with ink gradient + vignette for legibility, title bottom-left in display-section size, meta-grid bottom-right with backdrop-blur. Min-height upgraded from `[80vh]` to `screen`. Image-less projects (Shanghai, Sen) fall back to a full-bleed generative engineering-grid hull with slug-code stamp.

**Decision:** Röntgen-Scroll annotation rail relocated from floating-right-overlay to full-width-below-viewer.
**Reason:** Audit § 3.3: v1's `lg:right-s5 lg:top-1/2 lg:max-w-md lg:-translate-y-1/2` annotation card occluded the right half of the viewer — exactly where the Strukturplanung layer's pentagon-arranged stakeholder nodes live. The audit endorsed Option 1 (stacked layout) as the "edukativ"-reading alternative. New layout: viewer at top in 16:9, annotation rail full-width directly below with a 12-column internal grid (identity 5/12, body+data 7/12). The "cinematic overlay" feel is gone; clarity is gained.

---

## 2026-05-16 · W12 · Audit critical-bugs batch

**Decision:** Hero pretitle "{brand.name} · Pitch v1" replaced with "{brand.name} · Strukturplanung · seit {brand.founded}".
**Reason:** Audit § 1.1: "Pitch v1" was an internal dev marker that bled into the live UI. The replacement is a real brand sub-line giving the three orientation facts (who · what · since when) without breaking the editorial silence above the H1. Other "pitch v1" occurrences in JSDoc comments stay — they're rationale for decisions, never rendered.

**Decision:** `Project` interface gained a `pullQuote?: { body: string; attribution: string }` field; the five featured deep-dives each carry their own quote.
**Reason:** Audit § 1.2: v1 hardcoded a WestPark-specific "Steg-Vertrag" quote into WerkContext, which then rendered on Shanghai / Sen / Mobility Hub / VW Hope deep-dives where it made no sense. New approach: project-typed quote, falls back to nothing rather than a generic placeholder. Five quotes pre-authored per Felix verbatim from the audit prompt:

- WestPark: "Vor dem Gebäude steht das System..."
- Shanghai: "184 Tage Welt­ausstellung. Was bleibt, ist die Methode..."
- Mobility Hub: "Mobilität nicht als Anhängsel der Stadt, sondern als Rückgrat..."
- Sen: "Drei Lotusblätter, ein Schwerpunkt..."
- VW Hope: "Vier Akteure, die 2006 nicht oft an einem Tisch saßen..."

**Decision:** Netzwerk Reduced-Fallback (prefers-reduced-motion SVG) now projects standorte from lat/lng instead of hard-coded pixel positions.
**Reason:** Audit § 1.3: v1 had Ingolstadt at `(410, 130)` and Linz at `(418, 132)` — visually indistinguishable despite the cities being 300 km apart. New code mirrors the equirectangular projection already used by `TeaserEarth` on the homepage. Ingolstadt (11.43° E) and Linz (14.29° E) now sit ~6 px apart, matching their actual geographic relationship.

**Decision:** Homepage gained a MethodeTeaser between Manifest and WerkeTeaser — the narrative bridge the v1 build was missing.
**Reason:** Audit § 1.4 / master prompt § 5: without a methode-teaser the user first encounters the word "Strukturplanung" on a deep-dive werk page where it lands as jargon. The teaser is a two-column editorial: left has the pretitle / display headline ("Bevor wir bauen, lösen wir den Konflikt.") / lead / CTA to /methode; right has a live ForceGraph with progress pinned at the Mediation/Struktur boundary (0.5) so the mediator + synergy edges dominate — the teaser shows what the methode _produces_, not the chaos it solves.

**Decision:** Homepage gained a KontaktTeaser as the final section before the footer.
**Reason:** Audit § 1.5: after StimmenTeaser the v1 landed directly in the Footer — no conversion bridge. The new section has a two-line display headline ("Sie haben einen Standort, / der mehr braucht als einen Architekten."), lead, magnetic-border CTA "Briefing starten" → /kontakt, plus secondary mailto:/tel: affordance and a live Ingolstadt clock to signal the site is alive.

**Decision:** Three Stimmen `country` values corrected: London `Deutschland → Großbritannien`, two Ingolstadt-with-foreign-delegation entries `Portugal/Indien → Deutschland`.
**Reason:** Audit § 1.6: `country` semantics were inconsistent. New JSDoc on the `Vortrag` type defines the rule: `country` = venue location, NOT audience origin. Foreign delegation info stays in the `venue` field. The lede on the Stimmen page also got an updated city list (added London, added Kaprun, removed Shanghai which had no entry).

**Decision:** Team portraits redesigned from playful cartoon avatars ("Manschgal") to editorial silhouette tiles.
**Reason:** Felix flagged the v1 portraits (eye dots, mouth lines, cute hair paths) as out of tone with the rest of the editorial design. New TeamPortrait: solid head silhouette (no facial features), hair as a distinct silhouette gesture per member, outfit as a geometric shoulder shape in the stakeholder palette, axonometric grid background, engineering-corner-marks, small mono caption underneath. Same prop API (Hair, Outfit, glasses, backdrop) so TeamSection didn't need changes. Felix confirmed the verified-team annotations stay; only the visual representation changed.

**Decision:** Content-integrity ledger sign-off — team names + Vorträge list + project numbers all flagged "good for pitch" by Felix on 2026-05-16.
**Reason:** Audit § 2 explicitly required Felix-verification before the team/Vorträge/numbers could be considered pitchable. Felix confirmed: the five team-member names + roles (Ines Wechsler, Brigitte Rudolph, Vera Härter, Melanie Friedrich, Margarete Wochnik) plus Peter's bio (Shanghai 2010 trip, Ewald-Kluge heritage) are correct as documented in `src/content/team.ts`. The 29 Vorträge are Felix-researched, not fabricated. The project numbers (92 m steg length, 184 days EXPO, 320 stellplätze, etc.) are verified or "plausibel genug für Pitch". No reductions needed.

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

## 2026-05-16 · Final audit · SPA-nav `removeChild` bug actually fixed

**Background:** From W5 through W10 we documented the SPA-nav bug as "pre-existing R3F + Suspense + StrictMode race, production unaffected." The final-audit pass (post-W10) actually reproduced + isolated + fixed it.

**Root cause:** Not StrictMode (confirmed by removing `<StrictMode>` from main.tsx — bug persisted). Not lazy/Suspense alone (confirmed by removing `lazy()` from HeroSection — bug persisted). The cause is React-Three-Fiber's WebGL `<Canvas>` removing its own DOM nodes from inside its dispose lifecycle, while React's reconciler is mid-way through `commitDeletionEffectsOnFiber` on the same subtree. When React calls `removeChild` on a node that R3F already detached, it throws `NotFoundError: Failed to execute 'removeChild' on 'Node'`. The exception bubbles past React Router's `RenderErrorBoundary` and lands on the route's `errorElement` (NotFoundPage), making SPA-nav from `/` (Hero) appear to navigate to "page not found."

**Fix:** Localised error boundary (`R3FErrorBoundary`) wrapping the entire `<PageTransition><Outlet /></PageTransition>` at the RootLayout level. The boundary catches the commit-phase removeChild exception BEFORE React Router's error boundary sees it. On catch, the destination route's render proceeds normally because the boundary's own state machine resets via `setTimeout(0)` so the next render commits the correct destination tree.

**Why outer (RootLayout) not inner (HomePage):** ErrorBoundaries catch errors in their children during render/lifecycle, but the deletion-phase error fires during the OUTGOING tree's commit. An inner boundary inside HomePage is itself being deleted at the same moment the error fires, so it can't catch it. Putting the boundary OUTSIDE the routes (in RootLayout) ensures it survives the deletion and can intercept the exception.

**Decision:** HeroSection is now imported directly (not `React.lazy`).
**Reason:** Simplifies the unmount sequence (one less moving part — no Suspense boundary to coordinate with). Three.js still ships as a separate `manualChunk` in vite.config so the main bundle stays lean (96 kB gz vs 88 kB gz, +8 kB for the HeroSection wrapper module being inline). The Three.js chunk (237 kB gz) now loads on every cold visit instead of only when Home mounts — but it's cached after first load and would have been needed for `/netzwerk` anyway. Trade-off accepted.

**Decision:** Kept `future: { v7_startTransition: true }` on RouterProvider.
**Reason:** Even though it didn't alone fix the bug, it's good upgrade-readiness for React Router 7 and silences the future-flag warning in dev. Doesn't conflict with the boundary fix.

**Decision:** Removed StrictMode wrapper on the root.
**Reason:** During root-causing we removed StrictMode to test if it was the source — it wasn't, but we left it removed. StrictMode's dev-only double-invoke is a noise source on top of the actual bug, and now that the bug is fixed via the boundary, restoring StrictMode would just put the noise back without benefit. Production behaviour unchanged either way.

**Bundle impact final:**
· Main JS: 96 kB gz (was 88 kB gz)
· React: 67 kB gz · GSAP: 28 kB gz · CSS: 10 kB gz
· Non-WebGL total: 201 kB gz (within master prompt §4 budget of 250 kB)
· Three.js chunk: 237 kB gz (no longer lazy on home; cached after first load)

---

## 2026-05-16 · W10 · Performance + a11y + SEO + cross-browser

**Decision:** `useDocumentMeta` hook that mutates `<head>` directly, NOT react-helmet-async / react-helmet.
**Reason:** React 18 doesn't ship native meta-tag support yet (that's a 19 feature). Adding a helmet library is 10+ KB gzipped for a pitch site that has 11 stable routes. A 100-line `useDocumentMeta` hook that sets title + 8 meta tags + canonical link, with a restorer-array cleanup, covers the entire surface. Per-route meta strings live in `ROUTE_META` table; the dynamic `/werke/:slug` route composes its own title from project content.

**Decision:** JSON-LD structured data embedded directly in `index.html` (Organization + Person + WebSite), NOT injected per route.
**Reason:** Schema.org Organization data is global, not per-route. Google's crawler picks it up from any page. Putting it in `index.html` means it's in the initial HTML response, available before JS executes — better for crawlers that don't render JS. The `@graph` array bundles Organization + Person Peter Bachschuster + WebSite under a single script tag with @id cross-references.

**Decision:** OG card is an SVG file (`/og.svg`), NOT a generated PNG.
**Reason:** Most modern OG crawlers (Facebook, LinkedIn, X) handle SVG since 2020. SVG-as-OG means the OG card stays editable in source and never goes stale relative to brand changes — no PNG export pipeline needed. The card uses inline Fraunces references (graceful degradation to Georgia if the platform doesn't have the variable font). For platforms that genuinely need raster, we can add a `.png` fallback later via a single Vite asset pipeline step.

**Decision:** Sitemap.xml is hand-authored, NOT generated at build time.
**Reason:** 28 URLs total (11 stable + 13 catalog + 5 featured deep-dives — but only routed via /werke/:slug). Hand-authoring is one-time cost, gives priority weights per URL (1.0 home, 0.9 featured sections, 0.5 catalog projects, 0.3 legal). When new projects land Felix appends a `<url>` block. No build plugin needed.

**Decision:** Skip-link target is `#main` with `tabIndex={-1}`, not a focus-trap or aria-region.
**Reason:** Standard a11y pattern: the skip-link is hidden until focused (`-translate-y-[200%]` + `focus-visible:translate-y-0`), then visible top-left. Click moves focus to `#main` (which needs `tabIndex={-1}` to receive programmatic focus without being a tab-stop in normal flow). Subsequent Tab presses land inside the main content rather than going back through Header.

**Decision:** Kontakt-Wizard uses soft step-focus (auto-focus first focusable on step change), NOT a hard focus-trap.
**Reason:** A hard focus-trap (`focus-trap-react`-style) is for modals — places where the user shouldn't escape to chrome. The wizard isn't modal; the user might legitimately want to nav away mid-form. Soft step-focus means each step's first option/input gets focus on advance (no Shift+Tab back-pedalling after "Weiter" click), but Tab still cycles through Header / Footer normally. Step body also gets `role=group` + `aria-label="Schritt X von 5: Vorhaben"` so screen-readers announce the step.

**Decision:** No CSP headers in vercel.json yet.
**Reason:** CSP is hard to get right with R3F (it dynamically creates inline shaders + workers in dev), and a wrong CSP breaks the site silently. Pitch v1 ships without; Felix can add a tight CSP later once Vercel-specific paths stabilise. The `meta name=robots content="index, follow"` + canonical + sitemap give the SEO bones without needing security headers in this pass.

**Decision:** Reduced-motion is checked per-component (not just via CSS blanket).
**Reason:** `globals.css` has the standard `@media (prefers-reduced-motion: reduce)` rule that flattens all CSS animations/transitions to 0.001ms. But GSAP timelines run via JavaScript and ignore CSS — each gsap.context-using component checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and either skips animation entirely or applies the static end-state. Audit 2026-05-16: 18 components use GSAP, 14 check reduced (the other 4 use gsap.context only for ScrollTrigger pin/scrub which is naturally inert without user scroll).

**Decision:** Production JS budget = 193 KB gzipped (excl. WebGL chunks).
**Reason:** Per master prompt §4: "JS < 250kb gzipped (excl. WebGL chunks)". Build 2026-05-16: main 88 kb + react 67 kb + gsap 28 kb + CSS 10 kb = 193 kb. Within budget. Three.js chunk (237 kb gz, 888 kb raw) lazy-loads only on `/` (Hero) and `/netzwerk` (Globe) — non-WebGL routes never pay for it. HeroSection (7.5 kb gz) + NetzwerkGlobe (4 kb gz) are tiny wrappers around the three.js chunk. Lighthouse Performance ≥85 expected on production (no third-party trackers, AVIF images, variable fonts subsetted, minification on).

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

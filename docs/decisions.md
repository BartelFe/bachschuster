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

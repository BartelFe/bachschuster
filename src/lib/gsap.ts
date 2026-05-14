/**
 * GSAP plugin registration.
 *
 * Since the Webflow acquisition (May 2025), all plugins (including the
 * formerly Club-only SplitText, DrawSVG, MorphSVG, Inertia, etc.) ship via
 * the standard `gsap` npm package and are free for commercial use.
 *
 * W1 only registers ScrollTrigger (used by Lenis lockstep). Other plugins
 * register lazily when their feature lands:
 *  · W2 — none additional (R3F drives the hero, GSAP just powers cursor + scroll)
 *  · W3 — SplitText (Hero headline glyph reveal)
 *  · W4 — none additional (d3-force drives the methode graph)
 *  · W5 — DrawSVGPlugin (Röntgen-Scroll wireframes)
 *  · W9 — Flip (project-card → detail page-transition)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sensible default config for our use.
gsap.config({
  nullTargetWarn: false,
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger };

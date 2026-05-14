/**
 * GSAP plugin registration.
 *
 * Since the Webflow acquisition (May 2025), all plugins (including the
 * formerly Club-only SplitText, DrawSVG, MorphSVG, Inertia, etc.) ship via
 * the standard `gsap` npm package and are free for commercial use.
 *
 * Plugin landings:
 *  · W1 — ScrollTrigger (Lenis lockstep)
 *  · W3 — SplitText (Hero headline glyph reveal)
 *  · W5 — DrawSVGPlugin (Röntgen-Scroll wireframes)
 *  · W9 — Flip (project-card → detail page-transition)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.config({
  nullTargetWarn: false,
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger, SplitText };

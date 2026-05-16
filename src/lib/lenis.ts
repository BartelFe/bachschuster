/**
 * Lenis smooth-scroll, locked to ScrollTrigger's tick.
 *
 * Lenis intercepts wheel events and animates `window.scrollTop` smoothly.
 * Our setup:
 *  · duration 1.4s + quartic-out easing (cinematic feel from § 3.4)
 *  · ScrollTrigger updates inside Lenis's RAF loop (single update per frame)
 *  · respects `prefers-reduced-motion` — bypassed entirely if set
 */
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { easeFns, durations } from './motion';

/**
 * Module-level reference to the active Lenis instance.
 *
 * Exposed via `getLenis()` so non-React-tree code (Skip-Intro link, future
 * scroll-to-anchor helpers) can drive smooth scroll without subscribing to
 * the Zustand store or threading the ref through props. Returns `null` when
 * Lenis is not mounted — that includes prefers-reduced-motion users — so
 * callers must guard for it.
 */
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Smooth-scroll to an in-page target using Lenis when available, with a
 * native fallback for reduced-motion users.
 */
export function smoothScrollTo(target: string | HTMLElement, opts: { offset?: number } = {}): void {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4, offset: opts.offset ?? 0 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * One-shot hook: mounts Lenis once on RootLayout, hands tick to ScrollTrigger,
 * tears down cleanly.
 */
export function useLenis(): void {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: durations.scroll / 1000,
      easing: easeFns.cinematic,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    lenisInstance = lenis;

    // GSAP ticker drives Lenis (single RAF source of truth).
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger needs to know when Lenis scrolls.
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, []);
}

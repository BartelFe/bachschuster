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
    };
  }, []);
}

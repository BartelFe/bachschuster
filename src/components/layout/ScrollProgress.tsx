import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Fixed-position scroll progress bar at the top edge of the viewport.
 *
 *  · Terrakotta-on-ink, 2 px tall, scales x 0..1 with document scroll.
 *  · Driven by gsap.quickTo for 60 fps without React state.
 *  · ScrollTrigger.create(scrub: true) listens to Lenis-driven scrolls so
 *    the bar stays in lockstep with the smooth-scroll engine rather than
 *    chasing it.
 *  · Hides on `prefers-reduced-motion` (the page works fine without it).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const setScale = gsap.quickTo(bar, 'scaleX', { duration: 0.18, ease: 'power2.out' });
    setScale(0);

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => setScale(self.progress),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-[2px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-accent"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}

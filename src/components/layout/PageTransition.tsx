import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '@/lib/gsap';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic curtain-wipe between routes.
 *
 * State machine the React Router Outlet sits inside of:
 *
 *   covering   (0..0.55 s)  — terrakotta panel sweeps left→right, current
 *                              route fades to 0 underneath.
 *   covered    (+0.10 s)    — page is invisible, react-router has already
 *                              swapped the Outlet to the new route, we use
 *                              this beat to scroll-to-top + let React paint.
 *   revealing  (0..0.70 s)  — curtain sweeps off to the right, new route
 *                              fades back in.
 *
 * The dwell at "covered" is critical: it gives R3F (Hero canvas, Globe) the
 * window it needs to dispose its WebGL context cleanly before React detaches
 * the DOM. Without this dwell, the long-standing R3F + Suspense + StrictMode
 * removeChild error fires when the user clicks a nav-link.
 *
 * prefers-reduced-motion: skip the animation entirely, plain instant swap.
 *
 * The curtain colour is the brand terrakotta; the timing easings match the
 * site's `ease.cinematic` curve (cubic-bezier 0.16, 1, 0.3, 1).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const lastPath = useRef(location.pathname);
  const wrapRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    // First mount: no transition.
    if (lastPath.current === location.pathname) return;
    const wrap = wrapRef.current;
    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!wrap || !curtain) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      lastPath.current = location.pathname;
      window.scrollTo(0, 0);
      return;
    }

    // Bail if a transition is already running (rapid nav clicks).
    if (animatingRef.current) return;
    animatingRef.current = true;
    lastPath.current = location.pathname;

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        gsap.set(curtain, { xPercent: -100 });
        if (label) gsap.set(label, { opacity: 0 });
      },
    });

    // ── 1. Cover ─────────────────────────────────────────────────────
    tl.to(
      curtain,
      {
        xPercent: 0,
        duration: 0.55,
        ease: 'power3.in',
      },
      0,
    );
    tl.to(
      wrap,
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      },
      0,
    );
    if (label) {
      tl.fromTo(
        label,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
        0.1,
      );
    }

    // ── 2. Covered dwell — scroll-to-top + give R3F time to dispose ──
    tl.call(
      () => {
        window.scrollTo(0, 0);
      },
      [],
      '+=0',
    );
    tl.to({}, { duration: 0.18 }); // breathing pause behind the curtain

    // ── 3. Reveal ────────────────────────────────────────────────────
    if (label) {
      tl.to(label, { opacity: 0, x: 20, duration: 0.3, ease: 'power2.in' }, '>-0.05');
    }
    tl.to(
      curtain,
      {
        xPercent: 100,
        duration: 0.7,
        ease: 'power3.out',
      },
      '>-0.1',
    );
    tl.to(
      wrap,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '<+0.15',
    );

    // Cleanup if user navigates away mid-transition
    return () => {
      tl.kill();
      animatingRef.current = false;
      gsap.set(curtain, { xPercent: -100 });
      gsap.set(wrap, { opacity: 1 });
      if (label) gsap.set(label, { opacity: 0 });
    };
  }, [location.pathname]);

  return (
    <>
      <div ref={wrapRef} className="relative w-full">
        {children}
      </div>

      {/* Curtain panel — initial off-screen left, will be tweened by useEffect */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] bg-accent"
        style={{ transform: 'translateX(-100%)', willChange: 'transform' }}
      >
        {/* Section-name label that appears with the curtain. Reads the
            destination pathname so the user knows where they're going. */}
        <div
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center opacity-0"
          style={{ willChange: 'transform, opacity' }}
        >
          <p
            className="font-mono text-data-label uppercase tracking-data text-ink"
            style={{ letterSpacing: '0.3em' }}
          >
            {prettyLabel(location.pathname)}
          </p>
        </div>
      </div>
    </>
  );
}

/** Pathname → display label for the curtain. "/werke/foo" → "WERKE · FOO". */
function prettyLabel(pathname: string): string {
  if (pathname === '/') return 'BACHSCHUSTER';
  const segments = pathname.split('/').filter(Boolean);
  return segments
    .map((s) => s.replace(/-/g, ' '))
    .join(' · ')
    .toUpperCase();
}

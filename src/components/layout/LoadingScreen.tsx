import { useEffect, useRef, useState } from 'react';
import { brand } from '@/content/brand';

/**
 * Initial app loading screen.
 *
 * Sits as a fixed-positioned overlay on first paint, animates a percentage
 * counter from 00 → 100 while the document settles, then peels away with a
 * vertical curtain reveal.
 *
 * Implementation note: this component intentionally avoids GSAP. It runs
 * BEFORE the rest of the app's RAF-driven layers (Lenis, R3F) settle, and
 * we had a startup race where Lenis's tick listener could starve fresh GSAP
 * tweens of frames. Plain setInterval + CSS transitions are deterministic,
 * trivially debuggable, and require no other moving parts.
 *
 * UX:
 *   · Brand mark (top-left), brand claim (centred, fade-up via CSS), loading
 *     percentage counter (bottom-right).
 *   · Counter advances 0 → 100 in 1.4 s using a 30-step interval — feels
 *     like real loading without requiring an animation framework.
 *   · After 100, a short hold then the panel splits vertically and slides
 *     off-screen (top half up, bottom half down), revealing the Hero behind.
 *   · prefers-reduced-motion: skip the counter, fade out in 0.3 s.
 *   · sessionStorage flag means we only show the loader once per tab — so a
 *     back-button to home doesn't re-trigger it.
 */

const COUNTER_DURATION_MS = 1400;
const HOLD_MS = 250;
const SPLIT_DURATION_MS = 900;

type Phase = 'counting' | 'splitting' | 'done';

export function LoadingScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (sessionStorage.getItem('bs-loaded') === '1') return false;
    return true;
  });
  const [counter, setCounter] = useState(0);
  const [phase, setPhase] = useState<Phase>('counting');
  const startedRef = useRef(false);

  useEffect(() => {
    if (!show) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setCounter(100);
      const fadeId = window.setTimeout(() => {
        sessionStorage.setItem('bs-loaded', '1');
        setShow(false);
      }, 300);
      return () => window.clearTimeout(fadeId);
    }

    // Counter: 30 ticks across COUNTER_DURATION_MS with ease-out curve.
    const tickCount = 30;
    const tickMs = COUNTER_DURATION_MS / tickCount;
    let i = 0;
    const counterId = window.setInterval(() => {
      i += 1;
      const t = i / tickCount;
      // Ease-out: power2 (1 - (1-t)^2)
      const eased = 1 - (1 - t) * (1 - t);
      setCounter(Math.min(100, Math.round(eased * 100)));
      if (i >= tickCount) {
        window.clearInterval(counterId);
      }
    }, tickMs);

    // After counter + hold, trigger the split-and-reveal.
    const splitId = window.setTimeout(() => {
      setPhase('splitting');
      // After the CSS split completes, set show=false and sessionStorage flag.
      window.setTimeout(() => {
        sessionStorage.setItem('bs-loaded', '1');
        setShow(false);
      }, SPLIT_DURATION_MS + 50);
    }, COUNTER_DURATION_MS + HOLD_MS);

    return () => {
      window.clearInterval(counterId);
      window.clearTimeout(splitId);
    };
  }, [show]);

  if (!show) return null;

  const words = brand.claim.split(' ');
  const splitTransform = phase === 'splitting' ? '-100%' : '0';
  const halfTransition = `transform ${SPLIT_DURATION_MS}ms cubic-bezier(0.83, 0, 0.17, 1)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[300]"
      role="presentation"
    >
      {/* Top half */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        style={{
          transform: `translateY(${phase === 'splitting' ? splitTransform : '0'})`,
          transition: halfTransition,
          willChange: 'transform',
        }}
      >
        <div className="absolute left-s5 top-s5">
          <span className="font-display text-lg tracking-tight text-bone">{brand.shortName}</span>
        </div>
      </div>

      {/* Bottom half */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        style={{
          transform: `translateY(${phase === 'splitting' ? '100%' : '0'})`,
          transition: halfTransition,
          willChange: 'transform',
        }}
      >
        <div className="absolute bottom-s5 right-s5 flex items-baseline gap-s2">
          <span className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Loading
          </span>
          <span className="font-mono text-data-label uppercase tracking-data text-accent">
            {String(counter).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Centred brand claim (sits exactly on the split-line) */}
      <div
        className="absolute inset-0 z-[1] flex items-center justify-center"
        style={{
          opacity: phase === 'splitting' ? 0 : 1,
          transition: `opacity ${SPLIT_DURATION_MS / 2}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        <h1
          className="px-s4 text-center font-display text-display-section text-bone"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden"
              style={{
                opacity: 0,
                transform: 'translateY(80%)',
                animation: `loadWordIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) both`,
                animationDelay: `${100 + i * 180}ms`,
              }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
      </div>

      {/* Inline keyframes for the brand-words entry — local so we don't have
          to wire into Tailwind config for a single use. */}
      <style>{`
        @keyframes loadWordIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

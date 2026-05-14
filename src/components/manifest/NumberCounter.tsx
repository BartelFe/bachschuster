import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface NumberCounterProps {
  /** Target number the counter resolves to. */
  to: number;
  /** Duration in seconds. */
  duration?: number;
  /** Delay before the count starts after the section enters the viewport. */
  delay?: number;
  /** Pad to at least this many digits with leading zeros. */
  pad?: number;
  /** Localized digit separator handler — German thousand-separator is a dot. */
  locale?: string;
}

/**
 * Number that counts up from 0 to `to` once its container enters the
 * viewport. Plays only once per page-load — refreshing the page resets it,
 * but scrolling past then back doesn't re-trigger.
 */
export function NumberCounter({
  to,
  duration = 1.6,
  delay = 0,
  pad,
  locale = 'de-DE',
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = format(to, pad, locale);
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: to,
            duration,
            delay,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = format(obj.v, pad, locale);
            },
            onComplete: () => {
              el.textContent = format(to, pad, locale);
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [to, duration, delay, pad, locale]);

  return (
    <span ref={ref} aria-label={String(to)}>
      {format(0, pad, locale)}
    </span>
  );
}

function format(n: number, pad?: number, locale = 'de-DE'): string {
  const rounded = Math.round(n);
  const base = rounded.toLocaleString(locale);
  if (!pad) return base;
  return base.padStart(pad, '0');
}

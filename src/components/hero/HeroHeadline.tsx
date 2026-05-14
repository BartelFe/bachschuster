import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { brand } from '@/content/brand';
import { useCurrentLayer } from './useCurrentLayer';

interface HeroHeadlineProps {
  morphRef: MutableRefObject<number>;
}

/**
 * The Hero headline with glyph-level emergence on first load.
 *
 *  · Each character is rendered as a React-owned `<span class="hero-glyph">`
 *    so HMR + StrictMode unmount cleanly (GSAP's SplitText mutates DOM
 *    directly and conflicts with React's reconciliation).
 *  · GSAP animates the spans from y+80% / opacity 0 / weight 100 to
 *    y0 / opacity 1 / weight 300 with a staggered cinematic ease.
 *  · Particles reveal over 2.5 s (W2 step 8). The headline starts 0.5 s
 *    in and resolves at ~3.0 s, so the two animations feel like one beat.
 *  · The subtitle line below the H1 swaps to the current hero layer's
 *    description as the user scrolls — short, present-tense, no scroll-
 *    cliché.
 */
export function HeroHeadline({ morphRef }: HeroHeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const layer = useCurrentLayer(morphRef);

  // Split the claim into words → words contain inline-block glyph spans.
  // Memo so we don't re-split on every render.
  const segments = useMemo(() => {
    const words = brand.claim.split(' ');
    return words.map((word, wi) => ({
      key: `${wi}-${word}`,
      chars: word.split(''),
      isLast: wi === words.length - 1,
    }));
  }, []);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.style.opacity = '1';
      return;
    }

    const chars = el.querySelectorAll<HTMLSpanElement>('.hero-glyph');
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 1 });
      gsap.set(chars, {
        yPercent: 80,
        opacity: 0,
        fontVariationSettings: '"wght" 100, "opsz" 144',
      });

      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        delay: 0.5,
        ease: 'power3.out',
        stagger: { each: 0.024, from: 'start' },
      });

      gsap.to(chars, {
        fontVariationSettings: '"wght" 300, "opsz" 144',
        duration: 1.6,
        delay: 0.9,
        ease: 'power2.inOut',
        stagger: { each: 0.02, from: 'start' },
      });
    }, headlineRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none relative z-10 flex h-full items-end px-s4 pb-s7 sm:px-s5">
      <div className="max-w-6xl">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          {brand.name} · Pitch v1
        </p>
        <h1
          ref={headlineRef}
          className="mt-s3 text-balance font-display text-display-hero text-bone opacity-0"
          style={{ fontVariationSettings: '"wght" 300, "opsz" 144' }}
        >
          {segments.map((segment) => (
            <span key={segment.key} className="inline-block whitespace-nowrap">
              {segment.chars.map((ch, i) => (
                <span
                  key={i}
                  className="hero-glyph inline-block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {ch}
                </span>
              ))}
              {!segment.isLast && ' '}
            </span>
          ))}
        </h1>
        <p
          key={layer.index}
          className="mt-s5 max-w-2xl animate-fade-in font-mono text-body-s tracking-wide text-bone-muted"
        >
          <span className="text-bone-faint">— Layer {layer.index + 1} · </span>
          {layer.description}
        </p>
      </div>
    </div>
  );
}

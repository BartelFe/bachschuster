import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { smoothScrollTo } from '@/lib/lenis';
import { brand } from '@/content/brand';

interface HeroHeadlineProps {
  /**
   * Kept on the props for parity with `HeroSection` (which threads the same
   * ref through every overlay) even though the headline no longer reads
   * morph state directly — `SectionTracker` consumes it in this section.
   */
  morphRef: MutableRefObject<number>;
}

/**
 * The Hero headline with glyph-level emergence on first load, plus the
 * Skip-Link + Bauchbinden that W13 added for narrative orientation.
 *
 *  · Each character is rendered as a React-owned `<span class="hero-glyph">`
 *    so HMR + StrictMode unmount cleanly (GSAP's SplitText mutates DOM
 *    directly and conflicts with React's reconciliation).
 *  · GSAP animates the spans from y+80% / opacity 0 / weight 100 to
 *    y0 / opacity 1 / weight 300 with a staggered cinematic ease.
 *  · The prominent layer label has migrated out of this overlay into
 *    `SectionTracker` (top-left); the v1 small "— Layer N · description"
 *    line under the H1 was removed because it duplicated that signal.
 *  · The three Bauchbinden below the headline give a non-Awwwards reader
 *    (e.g. Peter Bachschuster) a hard answer to "what is this?" in 3
 *    seconds — disciplines, locations, founding year.
 *  · Skip-Link top-right routes to /methode for users who want to bypass
 *    the 500 vh pinned scroll. `useCurrentLayer` watches the morph and
 *    `morphRef` is consumed indirectly through it.
 */
export function HeroHeadline(_props: HeroHeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

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
    <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-s4 pb-s7 pt-s7 sm:px-s5 sm:pb-s8 sm:pt-s8">
      {/* ── Top row ─────────────────────────────────────────────────────
          Empty left column (SectionTracker renders into the same region as
          an absolutely-positioned sibling). Skip-Link sits right. */}
      <div className="flex items-start justify-end">
        <button
          type="button"
          data-cursor="link"
          data-magnetic
          onClick={(e) => {
            e.preventDefault();
            // Lenis-smooth-scroll past the 500vh pinned hero into the
            // manifest section. Falls back to native scroll if Lenis isn't
            // mounted (prefers-reduced-motion users).
            smoothScrollTo('manifest');
          }}
          aria-label="Hero überspringen — zum Manifest scrollen"
          className="group pointer-events-auto inline-flex items-baseline gap-s2 border-l-2 border-bone-faint pl-s3 font-mono text-caption uppercase tracking-caption text-bone-muted transition-colors duration-hover ease-cinematic hover:border-accent hover:text-accent"
        >
          Intro überspringen
          <span
            aria-hidden="true"
            className="transition-transform duration-hover group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </button>
      </div>

      {/* ── Bottom block: pretitle + headline + bauchbinden ────────────── */}
      {/*
        Overlap-fix (post-W10 review): inherit a soft ink-coloured text-shadow
        on the entire block so the Hero's particle-field can drift behind the
        text without compromising legibility. Same pattern as SectionTracker.
        The halo is invisible against pure ink (the section's bg) but cuts a
        readable rim around glyphs when particles light up behind them.
      */}
      <div
        className="max-w-6xl"
        style={{
          textShadow:
            '0 0 22px rgba(10, 11, 14, 0.95), 0 0 8px rgba(10, 11, 14, 0.85), 0 1px 2px rgba(10, 11, 14, 0.8)',
        }}
      >
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          {brand.name} · Strukturplanung · seit {brand.founded}
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
              {!segment.isLast && ' '}
            </span>
          ))}
        </h1>

        {/* Bauchbinden — three short mono lines. Hard answer to "what is this?".
            On mobile the dt/dd pairs stack vertically with the dt as a smaller
            label so the locations row doesn't overflow the viewport width. */}
        <dl className="mt-s5 grid max-w-2xl gap-y-s2 font-mono text-caption uppercase tracking-caption text-bone-faint sm:grid-cols-[auto_1fr] sm:gap-x-s5 sm:gap-y-s1">
          <dt className="text-data-label text-bone-muted sm:text-caption">Disziplinen</dt>
          <dd className="-mt-s1 sm:mt-0">Architektur · Stadtplanung · Strukturplanung</dd>
          <dt className="text-data-label text-bone-muted sm:text-caption">Standorte</dt>
          <dd className="-mt-s1 sm:mt-0">Ingolstadt · Shanghai · Johannesburg · Linz</dd>
          <dt className="text-data-label text-bone-muted sm:text-caption">Seit</dt>
          <dd className="-mt-s1 sm:mt-0">{brand.founded}</dd>
        </dl>
      </div>
    </div>
  );
}

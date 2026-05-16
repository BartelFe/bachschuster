import { type MutableRefObject } from 'react';
import { useCurrentLayer, LAYER_COUNT } from './useCurrentLayer';
import { cn } from '@/lib/cn';

interface SectionTrackerProps {
  morphRef: MutableRefObject<number>;
  /** Hide when the hero is exiting (manifest is taking over). */
  hidden?: boolean;
}

/**
 * Prominent hero layer indicator — top-left of the viewport.
 *
 * v2 (W13 narrative-repair) — the previous tracker was a tiny mono caption
 * pinned bottom-right; in user testing it read as a debug footnote, not as
 * narration. The audit prompt requires the layer label to land as the
 * primary orientation cue. New layout:
 *
 *   01 / 05
 *   GEBAUTE STRUKTUR
 *   — Was sichtbar ist.
 *
 * Mono numerals up top, large display tracking for the layer name, a small
 * italic Fraunces tagline beneath. Anchored top-left of the section so it
 * doesn't fight the bottom-left headline for attention. Hidden during the
 * hero exit collapse so it doesn't bleed into the manifest.
 */
export function SectionTracker({ morphRef, hidden = false }: SectionTrackerProps) {
  const layer = useCurrentLayer(morphRef);
  const total = LAYER_COUNT;
  const displayIndex = (layer.index + 1).toString().padStart(2, '0');
  const displayTotal = total.toString().padStart(2, '0');

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-s4 top-s6 z-30 max-w-[18rem] transition-opacity duration-reveal ease-cinematic sm:left-s5 sm:top-s7 sm:max-w-[24rem] lg:top-s8',
        hidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      {/* Numeric position — mono, accented number, faint total */}
      <p className="font-mono text-base uppercase tracking-data sm:text-xl md:text-2xl">
        <span className="text-accent">{displayIndex}</span>
        <span className="text-bone-faint"> / {displayTotal}</span>
      </p>

      {/* Layer name — display-scale uppercase tracked. Reads like a chapter title.
          Mobile gets a tighter size so it doesn't crowd the Skip-Intro on the
          right and never wraps onto more than two lines. */}
      <h2
        key={`name-${layer.index}`}
        className="mt-s2 animate-fade-in font-mono text-lg uppercase leading-[1.1] tracking-[0.12em] text-bone sm:text-2xl sm:tracking-[0.14em] md:text-3xl lg:text-4xl"
      >
        {layer.name}
      </h2>

      {/* Tagline — small italic Fraunces. Breaks the mono rigour just enough to feel editorial. */}
      <p
        key={`tag-${layer.index}`}
        className="mt-s2 animate-fade-in font-display text-sm italic text-bone-muted sm:text-base md:text-lg"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
      >
        — {layer.tagline}
      </p>
    </div>
  );
}

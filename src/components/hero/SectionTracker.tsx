import { type MutableRefObject } from 'react';
import { useCurrentLayer, LAYER_COUNT } from './useCurrentLayer';
import { cn } from '@/lib/cn';

interface SectionTrackerProps {
  morphRef: MutableRefObject<number>;
  /** Hide when the hero is exiting (manifest is taking over). */
  hidden?: boolean;
}

/**
 * Small mono section-tracker pinned bottom-right. Shows `01 / 05 ·
 * Gebaute Struktur` style: which of the five hero layers is currently
 * dominant. Caps out at the size of a footnote so it doesn't fight the
 * headline for attention.
 *
 * Hidden during the hero exit so it doesn't bleed into the manifest.
 * Sits at z-40 — under the DebugSlider (z-50) so they can coexist in dev.
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
        'pointer-events-none fixed bottom-s4 right-s4 z-40 transition-opacity duration-reveal ease-cinematic sm:right-s5',
        hidden ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className="flex items-center gap-s3 border-l-2 border-accent pl-s3">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          <span className="text-accent">{displayIndex}</span>
          <span className="text-bone-faint"> / {displayTotal}</span>
        </p>
        <p className="font-mono text-caption uppercase tracking-caption text-bone">{layer.name}</p>
      </div>
    </div>
  );
}

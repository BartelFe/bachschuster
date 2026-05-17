import { useState, type MutableRefObject } from 'react';
import { STAKEHOLDER_COLOR, STAKEHOLDER_LABEL, type StakeholderId } from './graph-data';
import { cn } from '@/lib/cn';

interface StakeholderLegendProps {
  highlightRef: MutableRefObject<StakeholderId | null>;
}

const GROUPS: readonly StakeholderId[] = [
  'city',
  'business',
  'citizens',
  'environment',
  'institutional',
];

/**
 * Five stakeholder chips. Hovering or focusing one writes the stakeholder id
 * into `highlightRef`, which the ForceGraph reads each render frame to pulse
 * the matching nodes. Touch users tap-to-toggle.
 *
 * The bachschuster mediator is intentionally excluded — its visibility is
 * governed by the mode, not by hover.
 */
export function StakeholderLegend({ highlightRef }: StakeholderLegendProps) {
  const [active, setActive] = useState<StakeholderId | null>(null);

  function set(id: StakeholderId | null) {
    setActive(id);
    highlightRef.current = id;
  }

  return (
    // Outer container with a solid-ish ink wash + backdrop-blur so the
    // entire legend reads as a single editorial card sitting OVER the
    // force-graph rather than competing with its nodes for the same
    // pixels. Reviewer feedback 2026-05-16: previous individual-chip
    // backdrop at 65 % was not enough — nodes still bled through and
    // the chips visually merged with the moving graph in the upper-
    // right quadrant where the "business" + "city" cluster centroids
    // sit (see graph-data.ts CLUSTER_CENTROIDS).
    //
    // The vertical-stack layout (column) + max-w-[200px] caps the
    // legend's horizontal footprint at 200 px so it occupies one corner
    // band instead of an 800-px-wide row across the whole upper edge.
    <ul className="flex max-w-[200px] flex-col gap-s1 border border-border-strong bg-ink/90 p-s3 backdrop-blur-md">
      <li className="mb-s1 font-mono text-data-label uppercase tracking-data text-bone-faint">
        Stakeholder · 05
      </li>
      {GROUPS.map((id) => {
        const isActive = active === id;
        return (
          <li key={id}>
            <button
              type="button"
              data-cursor="data"
              onMouseEnter={() => set(id)}
              onMouseLeave={() => set(null)}
              onFocus={() => set(id)}
              onBlur={() => set(null)}
              onClick={() => set(isActive ? null : id)}
              className={cn(
                'group flex w-full items-center gap-s2 py-[2px] font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
                isActive ? 'text-bone' : 'text-bone-muted hover:text-bone',
              )}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor: STAKEHOLDER_COLOR[id],
                  boxShadow: isActive ? `0 0 12px ${STAKEHOLDER_COLOR[id]}` : 'none',
                }}
              />
              <span className="text-left leading-tight">{STAKEHOLDER_LABEL[id]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

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
    <ul className="flex flex-wrap items-center gap-s2">
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
                'group flex items-center gap-s2 border px-s2 py-s1 font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
                isActive
                  ? 'border-bone text-bone'
                  : 'border-border-strong text-bone-muted hover:border-border-strong hover:text-bone',
              )}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: STAKEHOLDER_COLOR[id],
                  boxShadow: isActive ? `0 0 12px ${STAKEHOLDER_COLOR[id]}` : 'none',
                }}
              />
              {STAKEHOLDER_LABEL[id]}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

import { MODES, type ModeId } from './graph-modes';
import { cn } from '@/lib/cn';

interface MethodeNarrativeProps {
  dominantMode: ModeId;
}

const ORDER: readonly ModeId[] = ['chaos', 'mediation', 'struktur'];

/**
 * Right-column long-form narrative that swaps body text by mode. All three
 * modes' copy is rendered in the DOM (for SEO + a11y) and faded in/out via
 * opacity + translate based on which one is currently dominant.
 */
export function MethodeNarrative({ dominantMode }: MethodeNarrativeProps) {
  return (
    <div className="relative flex h-full flex-col justify-end gap-s5 sm:justify-center">
      <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
        Strukturplanung · Live-Modell
      </p>
      <div className="relative min-h-[260px]">
        {ORDER.map((id) => {
          const mode = MODES[id];
          const isActive = id === dominantMode;
          return (
            <article
              key={id}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 transition-all duration-reveal ease-cinematic',
                isActive
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-3 opacity-0',
              )}
            >
              <p className="font-mono text-data-label uppercase tracking-data text-accent">
                {mode.narrative.pretitle}
              </p>
              <h3 className="mt-s3 font-display text-3xl leading-tight text-bone sm:text-4xl">
                {mode.narrative.title}
              </h3>
              <p className="mt-s4 max-w-md text-body-m text-bone-muted">{mode.narrative.body}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-s4 font-mono text-caption uppercase tracking-caption text-bone-faint">
        Hinweis · Knoten draggen ist erlaubt
      </p>
    </div>
  );
}

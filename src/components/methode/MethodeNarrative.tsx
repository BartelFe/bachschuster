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
    // Backdrop wrapper — the v1 narrative sat directly on top of the force-graph
    // canvas, so dragged stakeholder nodes drifted into the prose and made it
    // unreadable. A subtle ink-tinted backdrop-blur reclaims legibility without
    // hiding what's behind, and a left accent border ties it to the section's
    // editorial trim language.
    //
    // Post-W10 redesign: this is now the SINGLE narrative surface for the
    // section (the duplicate header h2 was removed). Body capped at
    // text-body-s + max-w-prose to fit cleanly inside the row-3 grid cell
    // without overflowing on 1440×900 viewports. min-h tracks the body's
    // natural height across modes so the card doesn't pop-resize between
    // chaos → mediation → struktur transitions.
    <div className="border-l-2 border-accent bg-ink/70 p-s4 backdrop-blur-md">
      <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
        Strukturplanung · Live-Modell
      </p>
      <div className="relative mt-s3 min-h-[200px] sm:min-h-[180px]">
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
              <h3
                className="mt-s2 font-display text-2xl leading-tight text-bone sm:text-3xl"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
              >
                {mode.narrative.title}
              </h3>
              <p className="mt-s3 text-body-s text-bone-muted">{mode.narrative.body}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-s3 font-mono text-caption uppercase tracking-caption text-bone-faint">
        Hinweis · Knoten draggen ist erlaubt
      </p>
    </div>
  );
}

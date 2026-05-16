import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { ForceGraph } from './ForceGraph';
import { STAKEHOLDER_COLOR, STAKEHOLDER_LABEL, type StakeholderId } from './graph-data';

/**
 * Homepage teaser for /methode — the narrative bridge between the Manifest
 * (paper-light) and the Werke teaser (editorial dark) that the v1 build was
 * missing. Master prompt §5 required it; without it the user reads "Method"
 * for the first time on a project deep-dive page where it lands as jargon.
 *
 * Right half is a real ForceGraph instance running with progress pinned at the
 * Mediation/Struktur boundary (0.5) — the mediator node + synergy edges are
 * dominant, so the teaser shows what Strukturplanung *produces*, not the chaos
 * it solves. Nodes remain drag-interactive so the teaser feels alive.
 */
export function MethodeTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0.5);
  const highlightRef = useRef<StakeholderId | null>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('methode-teaser'),
        onEnterBack: () => setCurrentSection('methode-teaser'),
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="methode-teaser"
      data-section="methode-teaser"
      className="relative overflow-hidden bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-s7 md:grid-cols-12">
        {/* ── Left: editorial ───────────────────────────────────────── */}
        <div className="md:col-span-5">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Methode · seit 1993
          </p>
          <h2
            className="mt-s4 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            <span>Bevor wir bauen,</span>
            <br />
            <span
              className="italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              lösen wir den Konflikt.
            </span>
          </h2>
          <p className="mt-s5 max-w-md text-body-l text-bone-muted">
            Verkehr, Klima, Wirtschaft, Bürger, Behörden — fünf Sprachen, die im klassischen
            Planungs­verfahren nebeneinander her reden. Strukturplanung ist das
            Übersetzungs-Protokoll dazwischen. Wir haben es 1993 erfunden, und seit dann steht jedes
            unserer Gebäude auf dieser Methode.
          </p>
          <Link
            to="/methode"
            data-magnetic
            data-cursor="link"
            className="mt-s5 inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Strukturplanung erleben
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── Right: mini force-graph at mediation/struktur boundary ───── */}
        <div className="md:col-span-7">
          <div className="relative aspect-[5/4] w-full overflow-hidden border border-border-subtle bg-ink">
            <ForceGraph progressRef={progressRef} highlightRef={highlightRef} />
            {/* Subtle frame ticks to read as "editorial diagram" not "decoration" */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full text-bone-faint/70"
            >
              <g stroke="currentColor" strokeWidth="0.2" fill="none">
                <path d="M 0.5 4 L 0.5 0.5 L 4 0.5" />
                <path d="M 96 0.5 L 99.5 0.5 L 99.5 4" />
                <path d="M 0.5 96 L 0.5 99.5 L 4 99.5" />
                <path d="M 96 99.5 L 99.5 99.5 L 99.5 96" />
              </g>
            </svg>
            <div className="pointer-events-none absolute left-s3 top-s3 z-10">
              <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
                Stakeholder · Mediation
              </p>
              <p className="mt-s1 font-mono text-data-label uppercase tracking-data text-bone-faint">
                Knoten ziehbar
              </p>
            </div>
            {/* Compact legend bottom-left — single column, no chip buttons */}
            <ul className="pointer-events-none absolute bottom-s3 left-s3 z-10 flex flex-col gap-[2px]">
              {(['city', 'business', 'citizens', 'environment', 'institutional'] as const).map(
                (id) => (
                  <li
                    key={id}
                    className="flex items-center gap-s2 font-mono text-data-label uppercase tracking-data text-bone-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: STAKEHOLDER_COLOR[id] }}
                    />
                    {STAKEHOLDER_LABEL[id]}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

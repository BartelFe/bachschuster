import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { findProject } from '@/content/projects';

/**
 * Three Strukturplanung-in-the-wild case studies, presented as side-by-side
 * mini-cards under the interactive Force-Graph. Each one names a concrete
 * project, summarises the conflict it had to resolve in a single sentence,
 * lists the stakeholder count and the structuring time it took, then routes
 * the reader into the werk-deep-dive.
 *
 * The cards are pulled from the existing project catalogue — WestPark,
 * Mobility Hub, and VW Hope Academy were chosen because their respective
 * Strukturplanung-layer data fields already carry the stakeholder count and
 * the "Vorlauf" duration. No new content invented; this is a layout of facts
 * that are already in `src/content/projects.ts`.
 */

interface CaseSpec {
  slug: string;
  /** Headline conflict description — one sentence. */
  conflict: string;
}

const CASES: ReadonlyArray<CaseSpec> = [
  {
    slug: 'westpark-verbindungssteg',
    conflict:
      'Bahn AG wollte Schnellbau, Anwohner wollten Lärmschutz, Stadt brauchte Klima-Statement, Radlobby drängte auf Vorrang.',
  },
  {
    slug: 'mobility-hub-ingolstadt',
    conflict:
      'Stadt, Verkehrs-Operatoren, Bürger-Initiative und Klimarat — sechs Sphären, ein gemeinsamer Auftrag: das Quartier nicht ersticken am Verkehr.',
  },
  {
    slug: 'vw-hope-academy-suedafrika',
    conflict:
      'Industrie, Bildungsministerium, Gemeinde, Schulleitung — vier Akteure, die in Südafrika 2006 nicht oft an einem Tisch saßen.',
  },
];

export function MethodeCaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('methode-cases'),
        onEnterBack: () => setCurrentSection('methode-cases'),
      });
      if (reduced) return;
      const cards = section.querySelectorAll<HTMLElement>('[data-case-card]');
      gsap.set(cards, { yPercent: 12, opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          });
        },
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="methode-cases"
      data-section="methode-cases"
      className="relative bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="grid gap-s5 pb-s7 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Methode in der Praxis · 03 Fälle
            </p>
            <h2
              className="mt-s4 font-display text-display-section text-bone"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              Drei Konflikte,
              <br />
              <span
                className="italic text-accent"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
              >
                drei strukturierte Antworten.
              </span>
            </h2>
          </div>
          <p className="self-end text-body-l text-bone-muted md:col-span-5">
            Jedes der drei Beispiele begann im Chaos der Anspruchsgruppen — und stand am Ende als
            funktionierender Gesamtorganismus. Die Methode liest sich hier nicht als Theorie,
            sondern als Bauwerk.
          </p>
        </header>

        <ul className="grid gap-s5 border-t border-border-subtle pt-s7 md:grid-cols-3 md:gap-s7">
          {CASES.map((c) => {
            const project = findProject(c.slug);
            if (!project) return null;
            // Strukturplanung-layer is the last in featured projects' arrays.
            // Pull stakeholder-count + Vorlauf-duration from its data field.
            const struk = project.layers?.find((l) => l.name === 'Strukturplanung');
            const stakeholders = struk?.data?.find((d) => d.label === 'Stakeholder')?.value;
            const vorlauf =
              struk?.data?.find((d) => d.label === 'Vorlauf')?.value ??
              struk?.data?.find((d) => d.label === 'Workshops')?.value;
            const outcome =
              struk?.data?.find((d) => d.label === 'Konsens')?.value ??
              struk?.data?.find((d) => d.label === 'Auflagen')?.value ??
              struk?.data?.find((d) => d.label === 'Eröffnung')?.value;
            return (
              <li
                key={c.slug}
                data-case-card
                className="group flex flex-col gap-s4 border border-border-subtle bg-surface/40 p-s5 transition-colors duration-hover ease-cinematic hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-s3">
                  <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                    {project.year}
                  </p>
                  <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                    {project.location}
                  </p>
                </div>

                <h3
                  className="font-display text-3xl leading-tight text-bone"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
                >
                  {project.title}
                  {project.subtitle ? (
                    <span className="block text-lg italic text-bone-muted">{project.subtitle}</span>
                  ) : null}
                </h3>

                <p className="text-body-s text-bone-muted">{c.conflict}</p>

                {/* Data row — stakeholders + duration + outcome */}
                <dl className="mt-s2 grid grid-cols-3 gap-s3 border-t border-border-subtle pt-s3">
                  <div>
                    <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                      Akteure
                    </dt>
                    <dd className="mt-s1 font-display text-lg leading-tight text-bone">
                      {stakeholders ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                      Vorlauf
                    </dt>
                    <dd className="mt-s1 font-display text-lg leading-tight text-bone">
                      {vorlauf ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                      Ergebnis
                    </dt>
                    <dd className="mt-s1 font-display text-lg leading-tight text-accent">
                      {outcome ?? 'gelöst'}
                    </dd>
                  </div>
                </dl>

                <Link
                  to={`/werke/${project.slug}`}
                  data-cursor="link"
                  data-magnetic
                  className="mt-auto inline-flex items-baseline gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
                >
                  Werk öffnen
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { STAKEHOLDER_COLOR } from './graph-data';

/**
 * Static overture to the pinned Force-Graph section.
 *
 * v1 dropped the user straight into a 400 vh pinned canvas with no warning of
 * what they were about to experience. The W13 audit demands an "understand
 * first, then experience" pass — three modes shown as a vertical preview, so
 * the user reads the structure (Chaos → Mediation → Struktur) BEFORE the
 * interactive simulation re-derives it as motion.
 *
 * Layout:
 *  · Top: pretitle + display headline.
 *  · Middle: 3-column grid, one column per mode. Each column has a small
 *    self-contained SVG diagram (Chaos = scattered dots with red conflict
 *    lines, Mediation = mediator star, Struktur = all-connected pentagon).
 *  · Bottom: scroll-hint nudging users into the interactive section.
 *
 * Editorial dark, ~80vh — short enough to read in one glance but tall enough
 * to register as a deliberate stop rather than a banner.
 */
export function MethodeIntro() {
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
        onEnter: () => setCurrentSection('methode-intro'),
        onEnterBack: () => setCurrentSection('methode-intro'),
      });
      if (reduced) return;

      // Reveal the three mode cards on entry — stagger so the eye reads them
      // left-to-right as the sequence we're about to encounter.
      const cards = section.querySelectorAll<HTMLElement>('[data-mode-card]');
      gsap.set(cards, { yPercent: 14, opacity: 0 });
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
            stagger: 0.16,
          });
        },
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="methode-intro"
      data-section="methode-intro"
      className="relative bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="grid gap-s5 pb-s7 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Methode
            </p>
            <h1
              className="mt-s4 font-display text-display-section text-bone"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              <span>Strukturplanung in</span>{' '}
              <span
                className="italic text-accent"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
              >
                drei Bewegungen.
              </span>
            </h1>
          </div>
          <p className="self-end text-body-l text-bone-muted md:col-span-5">
            Erst lesen, dann erleben. Was Sie gleich als Simulation sehen, hat eine klare Form —
            drei aufeinander folgende Zustände, die jeder unserer Mandate durchläuft.
          </p>
        </header>

        {/* ── Three-mode preview grid ──────────────────────────────── */}
        <ul className="grid gap-s5 border-t border-border-subtle pt-s7 md:grid-cols-3 md:gap-s7">
          <ModeCard
            number="01"
            title="Chaos"
            tagline="Jeder zieht in seine Richtung."
            body="Fünf Anspruchsgruppen, fünf Sprachen. Konflikt-Linien spannen sich zwischen Akteuren, die dieselben Ressourcen beanspruchen."
            diagram={<ChaosDiagram />}
          />
          <ModeCard
            number="02"
            title="Mediation"
            tagline="Strukturplanung tritt ein."
            body="Bachschuster übersetzt zwischen den Lagern. Konflikte werden zu Beziehungen umgedeutet, Synergien werden sichtbar."
            diagram={<MediationDiagram />}
            isCenter
          />
          <ModeCard
            number="03"
            title="Struktur"
            tagline="Ein funktionierender Gesamtorganismus."
            body="Konflikte aufgelöst, Synergien aktiviert. Strukturplanung steht VOR Stadtplanung und Architektur — sie entwirft das System darunter."
            diagram={<StrukturDiagram />}
          />
        </ul>

        {/* ── Scroll hint ──────────────────────────────────────────── */}
        <footer className="mt-s9 flex items-center justify-center gap-s3 border-t border-border-subtle pt-s5">
          <span className="h-px w-12 bg-bone-faint/40" aria-hidden="true" />
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Scrollen Sie weiter — die Methode wird interaktiv
          </p>
          <span className="h-px w-12 bg-bone-faint/40" aria-hidden="true" />
        </footer>
      </div>
    </section>
  );
}

interface ModeCardProps {
  number: string;
  title: string;
  tagline: string;
  body: string;
  diagram: React.ReactNode;
  /** Centre card gets a soft accent border — flags it as the pivot. */
  isCenter?: boolean;
}

function ModeCard({ number, title, tagline, body, diagram, isCenter }: ModeCardProps) {
  return (
    <li
      data-mode-card
      className={
        'flex flex-col gap-s4 border bg-surface/40 p-s5 ' +
        (isCenter ? 'border-accent/60' : 'border-border-subtle')
      }
    >
      <div className="flex items-baseline justify-between gap-s3">
        <p
          className={
            'font-mono text-data-label uppercase tracking-data ' +
            (isCenter ? 'text-accent' : 'text-bone-faint')
          }
        >
          {number} · Modus
        </p>
        <div className="h-px flex-1 bg-border-subtle" aria-hidden="true" />
      </div>

      {/* Diagram tile — keeps aspect ratio square so the three columns sit on
          one optical baseline regardless of the card text below. */}
      <div className="relative aspect-square w-full overflow-hidden border border-border-subtle bg-ink">
        {diagram}
      </div>

      <h3
        className="font-display text-3xl leading-tight text-bone sm:text-4xl"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        {number} — {title}
      </h3>
      <p
        className="font-display text-lg italic text-bone-muted"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
      >
        {tagline}
      </p>
      <p className="text-body-s text-bone-muted">{body}</p>
    </li>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Static SVG diagrams — one per mode. Hand-drawn with the stakeholder
   colour palette so they read as miniatures of the interactive graph.
   Layout: 5 stakeholder positions on a pentagon, centre reserved for
   the mediator.
   ──────────────────────────────────────────────────────────────────── */

const PENTAGON: ReadonlyArray<{ id: keyof typeof STAKEHOLDER_COLOR; x: number; y: number }> = [
  { id: 'city', x: 50, y: 14 },
  { id: 'business', x: 86, y: 38 },
  { id: 'citizens', x: 73, y: 82 },
  { id: 'environment', x: 27, y: 82 },
  { id: 'institutional', x: 14, y: 38 },
];

function ChaosDiagram() {
  // Scattered: 5 stakeholders pushed away from centre, antagonistic conflict
  // lines slashing between them.
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Conflict lines (red) — slash diagonals across the pentagon */}
      <g stroke="#DC2626" strokeWidth="0.6" opacity="0.75" strokeDasharray="3 2.4">
        <line x1="50" y1="14" x2="73" y2="82" />
        <line x1="86" y1="38" x2="27" y2="82" />
        <line x1="14" y1="38" x2="73" y2="82" />
        <line x1="50" y1="14" x2="27" y2="82" />
      </g>
      {PENTAGON.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r="4.2"
          fill={STAKEHOLDER_COLOR[p.id]}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

function MediationDiagram() {
  // Mediator emerges in the centre; mediation links radiate outward in bone.
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Mediation links (bone) from centre to each stakeholder */}
      <g stroke="#F2EDE2" strokeWidth="0.55" opacity="0.85">
        {PENTAGON.map((p) => (
          <line key={`m-${p.id}`} x1="50" y1="50" x2={p.x} y2={p.y} />
        ))}
      </g>
      {/* Residual conflict — faded, two diagonals */}
      <g stroke="#DC2626" strokeWidth="0.45" opacity="0.32" strokeDasharray="2.5 2">
        <line x1="86" y1="38" x2="27" y2="82" />
        <line x1="50" y1="14" x2="73" y2="82" />
      </g>
      {PENTAGON.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="4" fill={STAKEHOLDER_COLOR[p.id]} />
      ))}
      {/* Mediator — accent-glow halo + bone fill */}
      <circle cx="50" cy="50" r="7" fill="#F2EDE2" />
      <circle cx="50" cy="50" r="11" fill="none" stroke="#75C9D9" strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}

function StrukturDiagram() {
  // Fully-connected pentagon — synergies blooming green/gold. Mediator
  // recedes (still present but smaller).
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Synergy edges (green-gold) — every pair of stakeholders */}
      <g stroke="#D6B547" strokeWidth="0.6" opacity="0.7">
        {PENTAGON.flatMap((a, i) =>
          PENTAGON.slice(i + 1).map((b) => (
            <line key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          )),
        )}
      </g>
      {/* Mediator's residual links — quieter */}
      <g stroke="#F2EDE2" strokeWidth="0.4" opacity="0.45">
        {PENTAGON.map((p) => (
          <line key={`m-${p.id}`} x1="50" y1="50" x2={p.x} y2={p.y} />
        ))}
      </g>
      {PENTAGON.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="4.6" fill={STAKEHOLDER_COLOR[p.id]} />
      ))}
      <circle cx="50" cy="50" r="3.6" fill="#F2EDE2" opacity="0.85" />
    </svg>
  );
}

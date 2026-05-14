import { useEffect, useMemo, useRef, useState } from 'react';
import { useUIStore } from '@/lib/store';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { projects, type ProjectCategory } from '@/content/projects';
import { WerkeFilter } from './WerkeFilter';
import { WerkeGrid } from './WerkeGrid';

type FilterId = 'all' | ProjectCategory;

/**
 * Werke Index — the catalog as editorial portfolio.
 *
 *  · Pretitle + display headline (SplitText reveal on first view)
 *  · Editorial lead with selection brief
 *  · Filter row with live counts
 *  · Asymmetric 12-col grid (see WerkeGrid)
 *
 * Felix's catalog brief in §6.3 distinguishes between the five
 * master-prompt deep-dive projects (featured, gridSpan ≥ 2, "Röntgen-Scroll
 * verfügbar" badge) and the eleven catalog entries. The grid order leads
 * with the featured tiles so the page declares its highest cards first.
 */
export function WerkeIndexSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const [active, setActive] = useState<FilterId>('all');

  const counts = useMemo<Record<FilterId, number>>(() => {
    const map: Record<FilterId, number> = {
      all: projects.length,
      'oeffentlicher-raum': 0,
      geschaeftsbauten: 0,
      privatbauten: 0,
      sonderbau: 0,
      stadtplanung: 0,
    };
    for (const p of projects) {
      map[p.category] += 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    if (active === 'all') return projects;
    return projects.filter((p) => p.category === active);
  }, [active]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection('werke'),
        onEnterBack: () => setCurrentSection('werke'),
      });

      if (reduced || !headline) return;

      split = new SplitText(headline, { type: 'lines, chars' });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });

      ScrollTrigger.create({
        trigger: headline,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (!split) return;
          gsap.to(split.chars, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.012,
          });
        },
      });
    }, section);

    // Cleanup order matters:
    //  1. Revert SplitText's <span> wrappers so the <h1>'s child list returns
    //     to React-managed nodes BEFORE React tries to unmount them.
    //  2. Revert the gsap context (kills ScrollTriggers + restores tweened
    //     props).
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="werke"
      data-section="werke"
      data-theme="dark"
      className="relative min-h-screen bg-ink px-s4 pb-s9 pt-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Top meta + headline ──────────────────────────────────────── */}
        <header className="grid gap-s5 pb-s7 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Werke · Index {String(projects.length).padStart(2, '0')}
            </p>
            <h1
              ref={headlineRef}
              className="mt-s4 font-display text-display-section text-bone"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              Was du siehst, ist die Antwort.
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-s4 md:col-span-5">
            <p className="text-body-l text-bone-muted">
              Eine kuratierte Auswahl realisierter und laufender Projekte. Vier davon erlauben den{' '}
              <span className="text-accent">Röntgen-Scroll</span> — eine Sezierung der Schichten,
              die unter dem Gebäude liegen.
            </p>
            <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Klicken &nbsp;→&nbsp; Tiefe
            </p>
          </div>
        </header>

        {/* ── Filter row ───────────────────────────────────────────────── */}
        <WerkeFilter active={active} onChange={setActive} counts={counts} />

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="mt-s6">
          <WerkeGrid projects={filtered} />
        </div>

        {/* ── Footer note ──────────────────────────────────────────────── */}
        <footer className="mt-s8 flex flex-wrap items-center justify-between gap-s3 border-t border-border-subtle pt-s5">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Alle Werke · {String(projects.length).padStart(2, '0')} Projekte ·{' '}
            <span className="text-accent">5 Deep Dives</span>
          </p>
          <p className="max-w-md text-body-s text-bone-faint">
            Vor dem Bauwerk steht die Strukturplanung — die Werke sind Beleg, nicht Beweis.
          </p>
        </footer>
      </div>
    </section>
  );
}

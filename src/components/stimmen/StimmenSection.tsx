import { useEffect, useMemo, useRef, useState } from 'react';
import { useUIStore } from '@/lib/store';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import {
  REGION_FILTERS,
  REGION_LABEL,
  TOPIC_LABEL,
  vortraege,
  vortraegeByYear,
  vortraegeCounts,
  type Region,
  type Vortrag,
} from '@/content/stimmen';
import { cn } from '@/lib/cn';

type FilterId = 'all' | Region;

/**
 * Stimmen — editorial Vorträge timeline.
 *
 *  · Pretitle + display headline + lead.
 *  · Region-filter chip row with live counts.
 *  · Year-grouped timeline: each year is its own header band; entries below
 *    appear as one-line rows (date · location · topic-tag · title).
 *  · The publikationen / jury / awards sections render as editorial placeholder
 *    blocks until Felix sources data.
 *  · ScrollTrigger registers the section so the SoundProvider can dial the
 *    drone for `stimmen`.
 */
export function StimmenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);
  const [active, setActive] = useState<FilterId>('all');

  const counts = vortraegeCounts();

  const filtered = useMemo<Vortrag[]>(() => {
    if (active === 'all') return vortraege;
    return vortraege.filter((v) => v.region === active);
  }, [active]);

  // Re-group by year whenever filter changes.
  const grouped = useMemo(() => {
    if (active === 'all') return vortraegeByYear();
    const map = new Map<number, Vortrag[]>();
    for (const v of filtered) {
      const arr = map.get(v.year) ?? [];
      arr.push(v);
      map.set(v.year, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({ year, items }));
  }, [filtered, active]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection('stimmen'),
        onEnterBack: () => setCurrentSection('stimmen'),
      });
      if (reduced) return;
      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll<HTMLSpanElement>('.split-char');
        gsap.set(chars, { yPercent: 110, opacity: 0 });
        ScrollTrigger.create({
          trigger: headlineRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: 'power4.out',
              stagger: 0.015,
            });
          },
        });
      }
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  const headline = 'Stimmen — wo wir gesprochen haben.';
  const headlineChars = useMemo(() => Array.from(headline), [headline]);

  return (
    <section
      ref={sectionRef}
      id="stimmen"
      data-section="stimmen"
      className="relative min-h-screen bg-ink px-s4 pb-s9 pt-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="grid gap-s5 pb-s7 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Stimmen · {String(vortraege.length).padStart(2, '0')} Vorträge ·{' '}
              {countriesCount(vortraege)} Länder
            </p>
            <h1
              ref={headlineRef}
              className="mt-s4 font-display text-display-section text-bone"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              {headlineChars.map((c, i) => (
                <span
                  key={i}
                  className="split-char inline-block"
                  style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}
                >
                  {c}
                </span>
              ))}
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-s4 md:col-span-5">
            <p className="text-body-l text-bone-muted">
              Sechzehn Jahre Strukturplanung auf der Bühne — in Ingolstadt, Berlin, München,
              Augsburg, London, Pune, Phnom Penh, Tiflis, Ankara, Innsbruck, Kaprun und Dublin.
              Jeder Vortrag ist ein Gespräch mit einer anderen Disziplin.
            </p>
            <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Filter &nbsp;→&nbsp; Regional fokussieren
            </p>
          </div>
        </header>

        {/* ── Region filter ─────────────────────────────────────────── */}
        <nav
          aria-label="Vorträge filtern"
          className="flex flex-wrap items-baseline gap-x-s5 gap-y-s3 border-y border-border-subtle py-s4"
        >
          {REGION_FILTERS.map((f) => {
            const isActive = f.id === active;
            const count = counts[f.id] ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                data-cursor="link"
                data-magnetic
                onClick={() => setActive(f.id)}
                className={cn(
                  'group inline-flex items-baseline gap-s2 font-mono text-caption uppercase tracking-caption transition-colors duration-hover ease-cinematic',
                  isActive ? 'text-bone' : 'text-bone-faint hover:text-bone-muted',
                )}
              >
                <span
                  className={cn(
                    'relative pb-[2px] after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-hover after:ease-cinematic',
                    isActive && 'after:scale-x-100',
                    !isActive && 'group-hover:after:scale-x-100 group-hover:after:bg-bone-faint',
                  )}
                >
                  {f.label}
                </span>
                <span
                  className={cn(
                    'font-mono text-[9px] tracking-data',
                    isActive ? 'text-accent' : 'text-bone-faint/60',
                  )}
                  aria-hidden="true"
                >
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Timeline ──────────────────────────────────────────────── */}
        <ol className="mt-s7 flex flex-col gap-s8">
          {grouped.map(({ year, items }) => (
            <li key={year}>
              <YearBand year={year} count={items.length} />
              <ul className="mt-s4 flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
                {items.map((v, idx) => (
                  <VortragRow key={`${v.date}-${idx}`} v={v} />
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* Placeholder columns (Publikationen / Jury / Awards) were removed in
            W14 audit-fix — empty "— folgt —" panels read as unfinished and
            undercut the substantial Vorträge timeline above. They'll return
            once Felix sources the data. */}
      </div>
    </section>
  );
}

function YearBand({ year, count }: { year: number; count: number }) {
  return (
    <header className="flex items-baseline justify-between gap-s4 border-b border-border-strong pb-s2">
      <h2
        className="font-display text-5xl leading-none text-bone sm:text-6xl"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 340' }}
      >
        {year}
      </h2>
      <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
        {String(count).padStart(2, '0')} Vorträge
      </p>
    </header>
  );
}

function VortragRow({ v }: { v: Vortrag }) {
  return (
    <li className="grid grid-cols-12 items-baseline gap-s3 py-s4">
      <p className="col-span-12 font-mono text-caption uppercase tracking-caption text-bone-faint sm:col-span-2">
        {formatDate(v.date)}
      </p>
      <p className="col-span-12 font-mono text-caption uppercase tracking-caption text-accent sm:col-span-2">
        {v.city} · {REGION_LABEL[v.region]}
      </p>
      <p
        className="col-span-12 font-display text-xl leading-tight text-bone sm:col-span-6"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        {v.title}
        {v.venue ? (
          <span className="ml-s2 font-mono text-caption uppercase tracking-caption text-bone-muted">
            · {v.venue}
          </span>
        ) : null}
      </p>
      <p className="col-span-12 font-mono text-caption uppercase tracking-caption text-bone-muted sm:col-span-2 sm:text-right">
        {TOPIC_LABEL[v.topic]}
      </p>
    </li>
  );
}

/** Format yyyy-mm-dd → "16. NOV 2023" or fall back to year only. */
function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  const months = [
    'JAN',
    'FEB',
    'MÄR',
    'APR',
    'MAI',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OKT',
    'NOV',
    'DEZ',
  ];
  return `${parseInt(d!, 10)}. ${months[parseInt(m!, 10) - 1]} ${y}`;
}

function countriesCount(items: Vortrag[]): number {
  return new Set(items.map((v) => v.country)).size;
}

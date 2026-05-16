import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { vortraege } from '@/content/stimmen';

/**
 * Homepage teaser for `/stimmen`. Editorial: pretitle + display headline +
 * three sample year-bands (latest year, EXPO-2010 year, founding-decade
 * marker) followed by a sliding ticker of city names. The ticker reads as
 * "this office has spoken on three continents" without listing all 28 talks.
 */
export function StimmenTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('stimmen-teaser'),
        onEnterBack: () => setCurrentSection('stimmen-teaser'),
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  // Unique cities — preserve first-encounter order so the marquee reads
  // like a chronological tour.
  const cities = Array.from(new Set(vortraege.map((v) => v.city)));

  return (
    <section
      ref={sectionRef}
      id="stimmen-teaser"
      data-section="stimmen-teaser"
      className="relative overflow-hidden bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Stimmen · {String(vortraege.length).padStart(2, '0')} Vorträge
          </p>
          <h2
            className="mt-s4 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            <span>Wo Architektur</span>
            <br />
            <span
              className="italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              gesprochen wurde.
            </span>
          </h2>
          <p className="mt-s5 max-w-md text-body-l text-bone-muted">
            16 Jahre Strukturplanung auf der Bühne. Von Ingolstadt bis Pune, von Tiflis bis Phnom
            Penh — jeder Vortrag ein Gespräch mit einer anderen Disziplin.
          </p>
          <Link
            to="/stimmen"
            data-magnetic
            data-cursor="link"
            className="mt-s5 inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Zur Timeline
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── Right: city marquee tower ───────────────────────────── */}
        <div className="relative h-[60vh] overflow-hidden md:col-span-7">
          <div className="absolute inset-y-0 left-0 right-0 flex animate-[teaserScroll_50s_linear_infinite] flex-col gap-s3">
            {/* Duplicate the list once so the loop is seamless */}
            {[...cities, ...cities].map((c, i) => (
              <span
                key={i}
                className="font-display text-3xl leading-none text-bone-muted/70 sm:text-4xl"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 340' }}
              >
                {c}
              </span>
            ))}
          </div>
          {/* Top + bottom fade so the marquee dissolves into the section */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
        </div>
      </div>

      {/* Marquee keyframes — inline so we don't touch the tailwind config. */}
      <style>{`
        @keyframes teaserScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}

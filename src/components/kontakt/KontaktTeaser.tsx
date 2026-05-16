import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { brand } from '@/content/brand';
import { formatLocalTime } from '@/content/standorte';

/**
 * Final homepage band — the conversion bridge before the footer that the v1
 * build was missing entirely. Master-prompt §5 envisioned a Kontakt-Wizard
 * route but the homepage shipped without an on-ramp to it.
 *
 * Renders a two-line editorial headline, a soft lede, the magnetic primary
 * CTA toward `/kontakt`, and a quieter secondary affordance with email + phone
 * for users who'd rather skip the wizard. The live Ingolstadt time signals the
 * site is awake — Bachschuster's primary office, not a static brochure.
 */
export function KontaktTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);
  const [now, setNow] = useState(() => formatLocalTime('Europe/Berlin'));

  useEffect(() => {
    // Tick once per minute — `formatLocalTime` only resolves to minute precision.
    const id = window.setInterval(() => setNow(formatLocalTime('Europe/Berlin')), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('kontakt-teaser'),
        onEnterBack: () => setCurrentSection('kontakt-teaser'),
      });
      if (reduced) return;
      const words = section.querySelectorAll<HTMLSpanElement>('[data-headline-word]');
      gsap.set(words, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.04,
          });
        },
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  const line1 = 'Sie haben einen Standort,';
  const line2 = 'der mehr braucht als einen Architekten.';

  return (
    <section
      ref={sectionRef}
      id="kontakt-teaser"
      data-section="kontakt-teaser"
      className="relative overflow-hidden bg-ink px-s4 py-s10 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          Kontakt · Briefing
        </p>
        <h2
          className="mt-s4 max-w-[18ch] font-display text-display-section leading-[0.95] text-bone"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          <span className="block overflow-hidden">
            {line1.split(' ').map((w, i, arr) => (
              <span
                key={`l1-${i}`}
                data-headline-word
                className="inline-block whitespace-nowrap"
                style={{ willChange: 'transform, opacity' }}
              >
                {w}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
          <span
            className="block overflow-hidden italic text-accent"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
          >
            {line2.split(' ').map((w, i, arr) => (
              <span
                key={`l2-${i}`}
                data-headline-word
                className="inline-block whitespace-nowrap"
                style={{ willChange: 'transform, opacity' }}
              >
                {w}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </h2>

        <div className="mt-s7 grid gap-s7 md:grid-cols-12">
          <p className="max-w-xl text-body-l text-bone-muted md:col-span-7">
            Wir hören zu, bevor wir planen. Erzählen Sie uns vom Vorhaben — fünf kurze Fragen,
            danach antworten wir innerhalb eines Werktags.
          </p>
          <div className="flex flex-col items-start gap-s4 md:col-span-5 md:items-end md:text-right">
            <Link
              to="/kontakt"
              data-cursor="link"
              data-magnetic
              className="group inline-flex items-baseline gap-s3 border border-accent px-s4 py-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:bg-accent hover:text-bone"
            >
              Briefing starten
              <span
                aria-hidden="true"
                className="transition-transform duration-hover group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <div className="flex flex-col gap-s1 font-mono text-caption uppercase tracking-caption text-bone-muted md:items-end">
              <a
                href={`mailto:${brand.email}`}
                data-cursor="link"
                className="transition-colors duration-hover ease-cinematic hover:text-bone"
              >
                {brand.email}
              </a>
              <a
                href={`tel:${brand.phone.replace(/\s+/g, '')}`}
                data-cursor="link"
                className="transition-colors duration-hover ease-cinematic hover:text-bone"
              >
                {brand.phone}
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-s8 flex flex-wrap items-baseline justify-between gap-s3 border-t border-border-subtle pt-s4">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            {brand.address.street} · {brand.address.zip} {brand.address.city} ·{' '}
            {brand.address.country}
          </p>
          <p
            className="font-mono text-data-label uppercase tracking-data text-bone-faint"
            aria-live="off"
          >
            Jetzt: <span className="text-accent">{now}</span> in {brand.address.city}
          </p>
        </footer>
      </div>
    </section>
  );
}

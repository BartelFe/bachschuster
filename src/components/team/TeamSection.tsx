import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '@/lib/store';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { principal, team } from '@/content/team';
import { sozialesEntries } from '@/content/soziales';
import { TeamPortrait } from './TeamPortrait';

/**
 * /team — Editorial team page.
 *
 *  · Hero band: Peter Bachschuster portrait + long-bio + Ewald-Kluge heritage.
 *  · Members grid (5 colleagues) with stylised SVG portraits.
 *  · Soziales-Engagement block: Victory Kindergarten Ukunda lead + Ewald
 *    Kluge family-heritage sub-entry, light-mode for tonal break.
 *
 * Portraits are imported as SVG composites (see TeamPortrait.tsx) — no photo
 * cropping. Felix's brief 2026-05-16: build from the team photo rather than
 * paste it in.
 */
export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection('team'),
        onEnterBack: () => setCurrentSection('team'),
      });

      if (reduced) return;

      if (heroHeadlineRef.current) {
        const chars =
          heroHeadlineRef.current.querySelectorAll<HTMLSpanElement>('.team-headline-char');
        gsap.set(chars, { yPercent: 110, opacity: 0 });
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          delay: 0.15,
          ease: 'power4.out',
          stagger: 0.018,
        });
      }

      // Members grid: reveal each card on scroll
      const cards = section.querySelectorAll<HTMLElement>('[data-member-card]');
      gsap.set(cards, { yPercent: 16, opacity: 0 });
      cards.forEach((c, i) => {
        ScrollTrigger.create({
          trigger: c,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(c, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              delay: (i % 3) * 0.08,
            });
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section ref={sectionRef} id="team" data-section="team" className="relative bg-ink text-bone">
      {/* ── Hero: Peter Bachschuster ──────────────────────────────────── */}
      <div className="px-s4 pb-s9 pt-s9 sm:px-s5">
        <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Team · 06 · Hauptsitz Ingolstadt
            </p>
            <h1
              ref={heroHeadlineRef}
              className="mt-s4 font-display text-display-section text-bone"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              {Array.from('Strukturplanung hat ein Gesicht.').map((c, i) => (
                <span
                  key={i}
                  className="team-headline-char inline-block"
                  style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}
                >
                  {c}
                </span>
              ))}
            </h1>
            <p className="mt-s5 max-w-2xl text-body-l text-bone-muted">
              Sechs Personen, eine Methode. Geführt von Peter Bachschuster — Architekt, Stadtplaner
              und Erfinder der Strukturplanung. Seit 1993.
            </p>
          </div>

          {/* Principal portrait + identity card */}
          <div className="md:col-span-5">
            <div className="border-l-2 border-accent pl-s4">
              <div className="aspect-[4/5] w-full max-w-xs overflow-hidden bg-surface">
                <TeamPortrait
                  hair={principal.portrait.hair}
                  glasses={principal.portrait.glasses}
                  outfit={principal.portrait.outfit}
                  backdrop={principal.portrait.backdrop}
                  className="block h-full w-full"
                />
              </div>
              <p className="mt-s4 font-mono text-data-label uppercase tracking-data text-accent">
                Principal · seit 1993
              </p>
              <h2
                className="mt-s2 font-display text-4xl leading-tight text-bone"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
              >
                {principal.name}
              </h2>
              <p className="mt-s1 font-mono text-caption uppercase tracking-caption text-bone-muted">
                {principal.role}
              </p>
            </div>
          </div>
        </div>

        {/* Long bio split into 3 paragraphs */}
        <div className="mx-auto mt-s8 grid max-w-[1400px] gap-s5 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Profil
            </p>
            <p className="mt-s2 font-display text-pull-quote italic text-bone">
              „Das Bestmögliche tun und das Unmögliche denken."
            </p>
          </div>
          <div className="space-y-s5 md:col-span-7">
            {principal.longBio.map((paragraph, i) => (
              <p key={i} className="text-body-l text-bone-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Ewald Kluge heritage */}
        <div className="mx-auto mt-s7 grid max-w-[1400px] gap-s5 border-t border-border-subtle pt-s5 md:grid-cols-12">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint md:col-span-5">
            Familien-Erbe · {principal.heritage.title}
          </p>
          <p className="text-body-m text-bone-muted md:col-span-7">{principal.heritage.body}</p>
        </div>
      </div>

      {/* ── Members grid ──────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle bg-ink px-s4 py-s9 sm:px-s5">
        <div className="mx-auto max-w-[1400px]">
          <header className="mb-s7">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Mit­arbeitende · 05
            </p>
            <h2
              className="mt-s2 font-display text-4xl leading-tight text-bone sm:text-5xl"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              Fünf Personen, fünf Disziplinen — ein gemeinsamer Tisch.
            </h2>
          </header>
          <ul className="grid grid-cols-1 gap-s5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <li
                key={m.slug}
                data-member-card
                className="group flex flex-col gap-s3 border border-border-subtle bg-surface p-s4 transition-colors duration-hover ease-cinematic hover:border-border-strong"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-ink">
                  <TeamPortrait
                    hair={m.portrait.hair}
                    glasses={m.portrait.glasses}
                    outfit={m.portrait.outfit}
                    backdrop={m.portrait.backdrop}
                    className="block h-full w-full"
                  />
                </div>
                <p className="font-mono text-data-label uppercase tracking-data text-accent">
                  {m.discipline}
                </p>
                <h3
                  className="font-display text-2xl leading-tight text-bone"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
                >
                  {m.name}
                </h3>
                <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
                  {m.role}
                </p>
                {m.brief ? <p className="text-body-s text-bone-muted">{m.brief}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Soziales Engagement (light theme break) ───────────────────── */}
      <div data-theme="light" className="bg-paper px-s4 py-s9 text-ink-soft sm:px-s5">
        <div className="mx-auto max-w-[1400px]">
          <header className="mb-s7">
            <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
              Soziales Engagement
            </p>
            <h2
              className="mt-s2 font-display text-4xl leading-tight text-ink-soft sm:text-5xl"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
            >
              Dort helfen, wo die Menschen sind.
            </h2>
          </header>

          {sozialesEntries.map((entry, i) => (
            <article
              key={entry.slug}
              className={`grid gap-s5 border-t border-rule pt-s5 md:grid-cols-12 ${
                i > 0 ? 'mt-s7' : ''
              }`}
            >
              <div className="md:col-span-4">
                <p className="font-mono text-data-label uppercase tracking-data text-ink-faded">
                  {entry.pretitle}
                </p>
                <h3
                  className="mt-s2 font-display text-3xl leading-tight text-ink-soft sm:text-4xl"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
                >
                  {entry.title}
                </h3>
                {entry.subtitle ? (
                  <p className="mt-s1 font-display text-xl italic text-ink-faded">
                    {entry.subtitle}
                  </p>
                ) : null}
              </div>
              <div className="space-y-s4 md:col-span-8">
                <p className="text-body-l text-ink-soft">{entry.body}</p>
                {entry.pullQuote ? (
                  <p className="border-l-2 border-accent pl-s3 font-display text-pull-quote italic text-ink-soft">
                    „{entry.pullQuote}"
                  </p>
                ) : null}
                {entry.partner || entry.location ? (
                  <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
                    {entry.partner ? `Partner · ${entry.partner}` : ''}
                    {entry.partner && entry.location ? '  ·  ' : ''}
                    {entry.location ? `Ort · ${entry.location}` : ''}
                  </p>
                ) : null}
              </div>
            </article>
          ))}

          {/* Footer CTA */}
          <footer className="mt-s9 flex flex-wrap items-center justify-between gap-s3 border-t border-rule pt-s5">
            <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
              Vor dem Gebäude steht das System — vor dem System steht die Verantwortung.
            </p>
            <Link
              to="/kontakt"
              data-cursor="link"
              data-magnetic
              className="inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
            >
              Mit uns sprechen
              <span aria-hidden="true">→</span>
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}

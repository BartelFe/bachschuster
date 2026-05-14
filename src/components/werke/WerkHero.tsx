import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { categoryLabel, statusLabel, type Project } from '@/content/projects';

interface WerkHeroProps {
  project: Project;
}

/**
 * Hero header for a deep-dive page. Editorial: pretitle (Werk · slug),
 * massive Fraunces title + italic subtitle, two-column meta grid
 * (Jahr, Standort, Kategorie, Status) and a long-form lede.
 *
 * Title characters split + reveal on first mount (no scroll-trigger — this
 * is above the fold). Below-the-fold meta cascades in with a 0.4s offset.
 */
export function WerkHero({ project }: WerkHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDListElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    const meta = metaRef.current;
    const lede = ledeRef.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !headline) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(headline, { type: 'chars, words' });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.018,
      });

      if (meta) {
        gsap.fromTo(
          meta.querySelectorAll('div'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.4 },
        );
      }
      if (lede) {
        gsap.fromTo(
          lede,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.55 },
        );
      }

      // Refresh ScrollTrigger so the subsequent pinned section recalculates
      // after Fraunces lays out at its final tracking.
      ScrollTrigger.refresh();
    });

    // Revert SplitText DOM mutation first so React reconciliation finds
    // the headline's original child nodes intact on unmount.
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <header className="relative min-h-[80vh] bg-ink px-s4 pb-s8 pt-s9 text-bone sm:px-s5">
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        {/* Left column: pretitle + title + lede */}
        <div className="md:col-span-8">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Werk · {project.slug.toUpperCase()}
          </p>
          <h1
            ref={headlineRef}
            className="mt-s5 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            {project.title}
          </h1>
          {project.subtitle ? (
            <p
              className="mt-s2 font-display text-pull-quote italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              {project.subtitle}
            </p>
          ) : null}
          <p ref={ledeRef} className="mt-s6 max-w-2xl text-body-l text-bone-muted">
            {project.summary}
          </p>
        </div>

        {/* Right column: metadata grid */}
        <dl
          ref={metaRef}
          className="grid grid-cols-2 gap-s5 self-end border-l border-border-subtle pl-s5 md:col-span-4"
        >
          <div>
            <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Jahr
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-bone">{project.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Status
            </dt>
            <dd
              className={`mt-s1 font-display text-2xl leading-tight ${
                project.status === 'realisiert' ? 'text-bone' : 'text-accent'
              }`}
            >
              {statusLabel(project.status)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Standort
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-bone">
              {project.location}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
              Kategorie
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-bone">
              {categoryLabel(project.category)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute inset-x-0 bottom-s4 z-10 flex items-center justify-center gap-s2 font-mono text-caption uppercase tracking-caption text-bone-faint">
        <span className="block h-px w-12 bg-bone-faint/40" />
        Scrollen · Röntgen-Schichten
        <span className="block h-px w-12 bg-bone-faint/40" />
      </div>
    </header>
  );
}

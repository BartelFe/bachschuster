import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { categoryLabel, statusLabel, type Project } from '@/content/projects';

interface WerkHeroProps {
  project: Project;
}

/**
 * Deep-dive page hero.
 *
 * v2 (W13 narrative-repair) — the v1 was a text-first hero (big title +
 * meta-grid + lede on a flat dark backdrop) that opened a *project page*
 * with no image of the project. For an architecture portfolio that reads
 * backwards: user wants to see the built artefact first, then read the
 * explanation. The new hero is full-bleed photo, title and meta float
 * bottom-anchored over a dark ink gradient for legibility.
 *
 * For projects without photo material yet (Shanghai pavillon, Sen) the
 * hero falls back to a generative SVG hull modelled on `CardPlaceholder`
 * but rendered full-bleed.
 */
export function WerkHero({ project }: WerkHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDListElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  const hasImage = project.images.length > 0;
  const cover = hasImage ? `/projects/${project.slug}/${project.images[0]}` : null;

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
        delay: 0.2,
      });

      if (meta) {
        gsap.fromTo(
          meta.querySelectorAll('div'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.55 },
        );
      }
      if (lede) {
        gsap.fromTo(
          lede,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.7 },
        );
      }

      // Refresh ScrollTrigger so the subsequent pinned section recalculates
      // after Fraunces lays out at its final tracking.
      ScrollTrigger.refresh();
    });

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <header className="relative min-h-screen w-full overflow-hidden bg-ink text-bone">
      {/* ── Backdrop: photo or generative hull ───────────────────────── */}
      <div className="absolute inset-0">
        {cover ? (
          <img
            src={cover}
            alt={`${project.title}${project.subtitle ? ' — ' + project.subtitle : ''}`}
            className="h-full w-full object-cover"
            // Above the fold — fetch eagerly so the headline doesn't sit on a
            // visible blank canvas while waiting for the image. AVIF originals
            // average ~120kB so the perf cost is acceptable.
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <PlaceholderHull slug={project.slug} title={project.title} />
        )}
        {/* Bottom-up ink gradient for headline legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10"
        />
        {/* Subtle vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,11,14,0.55)_100%)]"
        />
      </div>

      {/* ── Top trim: pretitle ───────────────────────────────────────── */}
      <div className="relative z-10 px-s4 pt-s7 sm:px-s5 sm:pt-s8">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Werk · {project.slug.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ── Bottom block: title + lede + meta ────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-s4 pb-s9 sm:px-s5">
        <div className="mx-auto grid max-w-[1400px] gap-s5 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h1
              ref={headlineRef}
              className="font-display text-display-section leading-[0.92] text-bone"
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
            <p ref={ledeRef} className="mt-s5 max-w-2xl text-body-l text-bone-muted opacity-0">
              {project.summary}
            </p>
          </div>

          <dl
            ref={metaRef}
            className="grid grid-cols-2 gap-s4 border-l border-border-strong/60 bg-ink/40 p-s4 backdrop-blur-sm md:col-span-5 md:col-start-8"
          >
            <div>
              <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                Jahr
              </dt>
              <dd className="mt-s1 font-display text-2xl leading-tight text-bone">
                {project.year}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                Status
              </dt>
              <dd
                className={
                  'mt-s1 font-display text-2xl leading-tight ' +
                  (project.status === 'realisiert' ? 'text-bone' : 'text-accent')
                }
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
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-s4 z-20 flex items-center justify-center gap-s2 font-mono text-caption uppercase tracking-caption text-bone-faint">
        <span className="block h-px w-12 bg-bone-faint/40" aria-hidden="true" />
        Schichten freilegen
        <span aria-hidden="true">↓</span>
      </div>
    </header>
  );
}

/**
 * Full-bleed generative hull for projects without a photo. Same engineering
 * grid + slug-code stamp as `CardPlaceholder` but scaled to cover the entire
 * 100vh hero region. Keeps the visual rhythm "every werk has a hero image"
 * even before the actual project photos land.
 */
function PlaceholderHull({ slug, title }: { slug: string; title: string }) {
  const code = slug
    .split('-')
    .map((part) => part.slice(0, 2).toUpperCase())
    .join('-');

  return (
    <div className="relative h-full w-full bg-elevated">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-data-cyan"
      >
        <defs>
          <pattern id={`hero-grid-${slug}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.12" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#hero-grid-${slug})`} opacity="0.22" />
        {/* Two crossing axis lines anchored at the centre */}
        <line
          x1="0"
          y1="100"
          x2="200"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.18"
          opacity="0.3"
        />
        <line
          x1="100"
          y1="0"
          x2="100"
          y2="200"
          stroke="currentColor"
          strokeWidth="0.18"
          opacity="0.3"
        />
        {/* Diagonal crosshair for the engineering-drawing trim */}
        <line
          x1="20"
          y1="20"
          x2="180"
          y2="180"
          stroke="currentColor"
          strokeWidth="0.12"
          opacity="0.18"
        />
        <line
          x1="180"
          y1="20"
          x2="20"
          y2="180"
          stroke="currentColor"
          strokeWidth="0.12"
          opacity="0.18"
        />
      </svg>
      {/* Mono code stamp upper-left of the hull, visible behind the page header */}
      <span className="pointer-events-none absolute left-s5 top-s5 font-mono text-caption uppercase tracking-data text-data-cyan/60">
        {code} · {title}
      </span>
    </div>
  );
}

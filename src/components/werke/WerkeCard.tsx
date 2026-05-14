import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { categoryLabel, statusLabel, type Project } from '@/content/projects';
import { cn } from '@/lib/cn';

interface WerkeCardProps {
  project: Project;
  /** Per-grid asymmetric placement classes (col-span / row-span) passed from grid. */
  className?: string;
  /** Reveal delay in ms — staggers the in-view animation across the grid. */
  revealDelay?: number;
}

/**
 * One Werke card.
 *
 *  · The image is desaturated + slightly scaled at rest; hover restores both.
 *  · A monogram of the project meta (year · location · status) overlays at
 *    rest. On hover, the meta lifts and the title slides up under it.
 *  · The featured projects (master-prompt deep dives) get the terrakotta
 *    "Röntgen-Scroll verfügbar" badge.
 *  · No-image projects (Shanghai, Sen) render an editorial placeholder with
 *    the title displayed prominently — works around the §6.3 image gap.
 */
export function WerkeCard({ project, className, revealDelay = 0 }: WerkeCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const hasImage = project.images.length > 0;
  const cover = hasImage ? `/projects/${project.slug}/${project.images[0]}` : null;

  // Subtle parallax on hover — pointer position drives image x/y offset
  // through gsap.quickTo to stay off React's render cycle.
  const setX = useRef<((v: number) => void) | null>(null);
  const setY = useRef<((v: number) => void) | null>(null);

  function bindParallax(el: HTMLImageElement | null) {
    if (!el || setX.current) return;
    setX.current = gsap.quickTo(el, 'xPercent', { duration: 0.6, ease: 'power3.out' });
    setY.current = gsap.quickTo(el, 'yPercent', { duration: 0.6, ease: 'power3.out' });
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !setX.current || !setY.current) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setX.current(nx * -4);
    setY.current(ny * -4);
  }

  function onPointerLeave() {
    setX.current?.(0);
    setY.current?.(0);
  }

  return (
    <article
      ref={ref}
      data-werke-card
      data-reveal-delay={revealDelay}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'group relative overflow-hidden border border-border-subtle bg-surface',
        'transition-[border-color] duration-hover ease-cinematic hover:border-border-strong',
        className,
      )}
      style={{ willChange: 'transform' }}
    >
      <Link
        to={`/werke/${project.slug}`}
        data-cursor="media"
        aria-label={`${project.title}${project.subtitle ? ' — ' + project.subtitle : ''}, ${project.year}, ${project.location}`}
        className="block h-full w-full"
      >
        {/* Image / placeholder layer */}
        <div className="absolute inset-0">
          {cover ? (
            <>
              <img
                ref={bindParallax}
                src={cover}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.08] object-cover brightness-90 saturate-[0.4] transition-[filter,transform] duration-[700ms] ease-cinematic group-hover:scale-[1.02] group-hover:brightness-100 group-hover:saturate-100"
                style={{ willChange: 'transform, filter' }}
              />
              {/* Bottom ink gradient for legibility of meta + title text. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-ink/10"
              />
            </>
          ) : (
            <CardPlaceholder project={project} />
          )}
        </div>

        {/* Top meta — pretitle + year + status badge */}
        <div className="relative z-10 flex items-start justify-between gap-s3 p-s4">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-muted">
            {categoryLabel(project.category)}
          </p>
          <p className="font-mono text-data-label uppercase tracking-data text-bone-muted">
            {project.year}
          </p>
        </div>

        {/* Bottom content — title + location + state */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-s2 p-s4">
          <h3
            className="font-display text-2xl leading-[0.95] text-bone sm:text-3xl md:text-4xl"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 350' }}
          >
            {project.title}
            {project.subtitle ? (
              <span className="block text-base italic text-bone-muted sm:text-lg">
                {project.subtitle}
              </span>
            ) : null}
          </h3>
          <div
            className={cn(
              'flex flex-wrap items-center gap-x-s3 gap-y-s1 font-mono text-caption uppercase tracking-caption text-bone-muted',
              'translate-y-2 opacity-0 transition-[opacity,transform] duration-[500ms] ease-cinematic',
              'group-hover:translate-y-0 group-hover:opacity-100',
            )}
          >
            <span>{project.location}</span>
            <span className="text-bone-faint">·</span>
            <span className={cn(project.status === 'realisiert' ? 'text-bone' : 'text-accent')}>
              {statusLabel(project.status)}
            </span>
          </div>
        </div>

        {/* Featured "Röntgen-Scroll verfügbar" indicator + scan-line on hover */}
        {project.featured ? (
          <div
            aria-hidden="true"
            className="absolute right-s4 top-s8 z-10 flex flex-col items-end gap-s2"
          >
            <span className="font-mono text-[9px] uppercase tracking-data text-accent">
              Röntgen-Scroll
            </span>
            <span className="h-px w-12 bg-accent/60" />
          </div>
        ) : null}

        {/* Subtle scan line that sweeps the card top-to-bottom on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-px -translate-y-2 bg-accent/0 opacity-0 transition-[transform,opacity,background-color] duration-[900ms] ease-cinematic group-hover:translate-y-[120%] group-hover:bg-accent/70 group-hover:opacity-100"
        />
      </Link>
    </article>
  );
}

/** Fallback artwork for projects whose photos haven't landed yet (Shanghai, Sen). */
function CardPlaceholder({ project }: { project: Project }) {
  // Deterministic "city number" pseudo-data; presented as engineering-drawing
  // header so the missing-image cards feel intentional rather than empty.
  const code = project.slug
    .split('-')
    .map((part) => part.slice(0, 2).toUpperCase())
    .join('-');

  return (
    <div className="relative h-full w-full bg-elevated">
      {/* Coordinate grid as faint scaffold */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-data-cyan"
      >
        <defs>
          <pattern id={`grid-${project.slug}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${project.slug})`} opacity="0.18" />
        {/* Two crossing axis lines */}
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.2"
          opacity="0.3"
        />
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.2"
          opacity="0.3"
        />
      </svg>
      {/* Code stamp upper-left */}
      <span className="absolute left-s4 top-s4 font-mono text-[10px] uppercase tracking-data text-data-cyan/70">
        {code}
      </span>
    </div>
  );
}

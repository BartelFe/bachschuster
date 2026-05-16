import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { type Project } from '@/content/projects';
import { WerkeCard } from './WerkeCard';
import { cn } from '@/lib/cn';

interface WerkeGridProps {
  projects: Project[];
}

/**
 * Asymmetric 12-column grid that respects each project's `gridSpan`.
 *
 *  · Featured (gridSpan 4): col-span-12 on mobile, col-span-7 on lg → row-span-2 → tall hero card.
 *  · gridSpan 3: col-span-12 / lg:col-span-5 → wide. Pairs with a 4 above it.
 *  · gridSpan 2: col-span-6 (sm) / col-span-4 (lg) → square-ish standard tile.
 *  · gridSpan 1: col-span-6 / lg:col-span-3 → compact tile.
 *
 * Each card fades in on first viewport entry with a small y-translate. The
 * stagger uses the card's index-in-filtered-list so filter swaps re-animate
 * naturally as items unmount and remount.
 */
export function WerkeGrid({ projects }: WerkeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>('[data-werke-card]');
      if (cards.length === 0) return;

      // W14.4.3 fix — cards already in the viewport on filter swap should
      // skip the y+opacity reveal entirely. v1 reset every card to
      // (yPercent 12, opacity 0) and waited for the ScrollTrigger callback
      // to fire, which meant on-screen cards stayed invisible until the
      // user scrolled, producing a jarring flash. Now: in-view cards land
      // straight at the end state; only off-screen cards still animate
      // into view as the user reaches them.
      const viewportH = window.innerHeight;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const inView = rect.top < viewportH && rect.bottom > 0;
        if (inView) {
          gsap.set(card, { yPercent: 0, opacity: 1 });
          return;
        }
        gsap.set(card, { yPercent: 12, opacity: 0 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            gsap.to(card, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              delay: Math.min(i * 0.04, 0.32),
            });
          },
        });
      });
    }, grid);

    return () => ctx.revert();
  }, [projects]);

  return (
    <div
      ref={gridRef}
      className="grid auto-rows-[clamp(220px,28vw,360px)] grid-cols-2 gap-s3 sm:grid-cols-6 lg:grid-cols-12 lg:gap-s4"
    >
      {projects.map((project, i) => (
        <WerkeCard
          key={project.slug}
          project={project}
          className={layoutClasses(project.gridSpan, i)}
          revealDelay={i * 40}
        />
      ))}
    </div>
  );
}

/**
 * Translate a 1..4 weight into the Tailwind spans. The optional index nudges
 * featured tiles into a deliberate left/right alternation so the grid breathes.
 *
 * Mobile (W15 audit-fix): the v1 always rendered featured tiles at row-span-2
 * which stacked to ~440 px on a 375 px-wide phone — too tall, made the grid
 * feel like a vertical stack of hero blocks. Mobile now uses row-span-1 for
 * everything; row-span-2 kicks in from `sm:` upward where the wider grid can
 * absorb it.
 */
function layoutClasses(span: 1 | 2 | 3 | 4, i: number): string {
  if (span === 4) {
    // Hero card — full row on mobile, ~half on desktop, double height (sm+).
    return cn(
      'col-span-2 sm:col-span-6 sm:row-span-2 lg:col-span-7',
      i % 2 === 1 ? 'lg:col-start-6' : '',
    );
  }
  if (span === 3) {
    // Wide companion to the hero — pairs left/right depending on neighbour.
    return cn('col-span-2 sm:col-span-6 sm:row-span-2 lg:col-span-5');
  }
  if (span === 2) {
    return cn('col-span-2 sm:col-span-3 lg:col-span-4');
  }
  return cn('col-span-1 sm:col-span-3 lg:col-span-3');
}

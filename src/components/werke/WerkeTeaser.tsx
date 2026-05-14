import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { projects } from '@/content/projects';

/**
 * Homepage teaser for /werke. Editorial dark, sits below the Manifest. Three
 * featured covers float in a marquee row with the headline + CTA at left.
 * The covers tilt subtly with scroll progress (parallax) and the trailing
 * CTA chip carries the same magnetic affordance as the methode CTA.
 */
export function WerkeTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const featured = projects.filter((p) => p.featured && p.images.length > 0).slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const tiles = tilesRef.current;
    if (!section || !tiles) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('werke-teaser'),
        onEnterBack: () => setCurrentSection('werke-teaser'),
      });

      if (reduced) return;

      // Parallax: each tile drifts by a slightly different amount on scroll.
      const tileEls = tiles.querySelectorAll<HTMLElement>('[data-tile]');
      tileEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 12 + i * 4, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 30%',
              scrub: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="werke-teaser"
      data-section="werke-teaser"
      className="relative overflow-hidden bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        {/* Left: headline + CTA */}
        <div className="md:col-span-5">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Werke · {String(projects.length).padStart(2, '0')} Projekte
          </p>
          <h2
            className="mt-s4 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            <span>Sieh den Vertrag</span>
            <br />
            <span
              className="italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              im Bauwerk.
            </span>
          </h2>
          <p className="mt-s5 max-w-md text-body-l text-bone-muted">
            Vier Projekte erlauben den <span className="text-accent">Röntgen-Scroll</span> — eine
            Sezierung der Architektur in fünf Schichten, von der sichtbaren Form bis zur
            Strukturplanung darunter.
          </p>
          <Link
            to="/werke"
            data-magnetic
            data-cursor="link"
            className="mt-s5 inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Alle Werke
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right: parallax tiles */}
        <div ref={tilesRef} className="grid grid-cols-2 gap-s3 sm:gap-s4 md:col-span-7">
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              to={`/werke/${p.slug}`}
              data-tile
              data-cursor="media"
              className={`group relative block overflow-hidden border border-border-subtle bg-surface ${
                i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={`/projects/${p.slug}/${p.images[0]}`}
                alt={`${p.title} — Cover`}
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.08] object-cover saturate-[0.4] transition-[filter,transform] duration-[700ms] ease-cinematic group-hover:scale-100 group-hover:saturate-100"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-s4">
                <p className="font-mono text-data-label uppercase tracking-data text-bone-muted">
                  {p.year} · {p.location}
                </p>
                <h3
                  className="mt-s1 font-display text-2xl leading-[0.95] text-bone sm:text-3xl"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 350' }}
                >
                  {p.title}
                  {p.subtitle ? (
                    <span className="block text-base italic text-bone-muted">{p.subtitle}</span>
                  ) : null}
                </h3>
              </div>
              <span className="absolute right-s3 top-s3 font-mono text-[9px] uppercase tracking-data text-accent">
                Röntgen
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

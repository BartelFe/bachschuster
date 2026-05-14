import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { standorte, formatLocalTime } from '@/content/standorte';

/**
 * Homepage teaser for `/netzwerk`. Editorial dark. Left: pretitle + display
 * headline + lead + CTA. Right: a static SVG dot-grid earth with the four
 * pins glowing — visually previews the deep-dive without loading the WebGL
 * chunk on cold visits.
 *
 * The pin labels carry the live local time so the teaser feels live even
 * before the user clicks through.
 */
export function NetzwerkTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('netzwerk-teaser'),
        onEnterBack: () => setCurrentSection('netzwerk-teaser'),
      });
      if (reduced) return;
      const pins = section.querySelectorAll<SVGElement>('[data-pin]');
      pins.forEach((p, i) => {
        gsap.fromTo(
          p,
          { scale: 0, opacity: 0, transformOrigin: 'center' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            delay: 0.2 + i * 0.15,
            ease: 'back.out(2.2)',
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="netzwerk-teaser"
      data-section="netzwerk-teaser"
      className="relative overflow-hidden bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        {/* ── Left: editorial ───────────────────────────────────────── */}
        <div className="md:col-span-5">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Netzwerk · {String(standorte.length).padStart(2, '0')} Standorte
          </p>
          <h2
            className="mt-s4 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            <span>Drei Kontinente,</span>
            <br />
            <span
              className="italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              ein Methodenkern.
            </span>
          </h2>
          <p className="mt-s5 max-w-md text-body-l text-bone-muted">
            Ingolstadt führt — Shanghai, Johannesburg und Linz arbeiten mit. Die Strukturplanung ist
            kein Exportgut, sie ist die Sprache, in der alle vier Standorte denken.
          </p>
          <Link
            to="/netzwerk"
            data-magnetic
            data-cursor="link"
            className="mt-s5 inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Den Globus drehen
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── Right: static SVG world dot-grid teaser ───────────────── */}
        <div className="relative md:col-span-7">
          <TeaserEarth />
        </div>
      </div>
    </section>
  );
}

/**
 * Equirectangular-projection SVG earth: dot-grid backdrop, faint continent
 * blobs, four standort pins with city + live time labels.
 *
 * Pin pixel positions are derived from each standort's lat/lng mapped onto
 * an 800×400 viewBox (x = (lng+180)/360 × 800, y = (90−lat)/180 × 400).
 */
function TeaserEarth() {
  const W = 800;
  const H = 400;
  const project = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full text-data-cyan"
      role="img"
      aria-label="Globusvorschau"
    >
      <defs>
        <pattern id="teaser-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.1" fill="currentColor" />
        </pattern>
        <radialGradient id="teaser-vignette" cx="50%" cy="50%" r="65%">
          <stop offset="60%" stopColor="rgba(10,11,14,0)" />
          <stop offset="100%" stopColor="rgba(10,11,14,0.9)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#teaser-dots)" opacity="0.5" />
      {/* Faint continent ellipses as decorative shapes */}
      <g fill="#0E1822" opacity="0.85">
        <ellipse cx="200" cy="160" rx="120" ry="60" />
        <ellipse cx="430" cy="180" rx="110" ry="50" />
        <ellipse cx="550" cy="240" rx="60" ry="70" />
        <ellipse cx="630" cy="170" rx="100" ry="50" />
        <ellipse cx="280" cy="280" rx="55" ry="40" />
      </g>
      <rect width={W} height={H} fill="url(#teaser-vignette)" />
      {standorte.map((s, i) => {
        const { x, y } = project(s.lat, s.lng);
        return (
          <g key={s.city} data-pin transform={`translate(${x} ${y})`}>
            <circle r="14" fill="none" stroke="#B85C2E" strokeWidth="1" opacity="0.5" />
            <circle r="5" fill="#D97648" />
            <g transform="translate(18 5)">
              <text
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1.6"
                fill="#F2EDE2"
                style={{ textTransform: 'uppercase' }}
              >
                {s.city}
              </text>
              <text
                y="14"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1.4"
                fill="#9B9385"
                style={{ textTransform: 'uppercase' }}
              >
                {formatLocalTime(s.tz)} · seit {s.since}
              </text>
            </g>
            {/* Connection line from Ingolstadt (Hauptsitz, i=0) to the others */}
            {i > 0 ? (
              <line
                x1={0}
                y1={0}
                x2={project(standorte[0]!.lat, standorte[0]!.lng).x - x}
                y2={project(standorte[0]!.lat, standorte[0]!.lng).y - y}
                stroke="#D97648"
                strokeWidth="0.6"
                strokeDasharray="3 4"
                opacity="0.5"
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

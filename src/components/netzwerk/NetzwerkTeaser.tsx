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
 * Equirectangular-projection SVG earth — v2 (brand-CI overlap-fix).
 *
 * v1 used five decorative ellipses as "continents" that didn't read as Earth.
 * v2 hand-authored simplified continent silhouettes (North + South America,
 * Greenland, Eurasia split into Europe / Africa / Asia, Australia, an
 * Antarctic strip). Geometry is intentionally lo-fi — the goal is "I
 * recognise the planet at 200 ms glance", not cartographic accuracy.
 *
 * Pin positions still derive from lat/lng. Labels collision-aware: when two
 * pins are within `LABEL_COLLIDE_RADIUS` (default 22 px) they fan vertically
 * — one anchors above its pin, the other below — so Ingolstadt (48.77° N,
 * 11.43° E) and Linz (48.31° N, 14.29° E) don't bake into a single
 * illegible smudge as they did in v1.
 */
const CONTINENT_PATHS: ReadonlyArray<string> = [
  // North America (incl. Mexico/Central America)
  'M 90 95 L 120 78 L 170 72 L 220 78 L 250 94 L 270 122 L 268 152 L 244 184 L 228 218 L 210 246 L 188 256 L 170 246 L 154 222 L 132 200 L 108 170 L 92 138 Z',
  // Greenland
  'M 296 70 L 332 64 L 354 78 L 356 102 L 340 116 L 314 116 L 298 100 Z',
  // South America
  'M 232 232 L 270 232 L 296 250 L 308 282 L 304 318 L 290 350 L 268 364 L 248 358 L 230 332 L 222 296 L 222 260 Z',
  // Europe (cluster of small lobes)
  'M 382 108 L 408 100 L 430 102 L 446 116 L 450 132 L 442 146 L 422 156 L 398 154 L 384 142 L 376 124 Z',
  // Africa
  'M 408 168 L 444 162 L 472 174 L 488 198 L 488 232 L 476 270 L 458 296 L 434 308 L 414 296 L 402 268 L 398 232 L 400 196 Z',
  // Asia (largest landmass — extends to Kamchatka)
  'M 452 92 L 510 76 L 580 76 L 642 90 L 688 110 L 712 134 L 706 162 L 678 188 L 638 210 L 596 218 L 558 210 L 524 196 L 492 178 L 466 156 L 452 130 Z',
  // India peninsula (south of Asia)
  'M 540 180 L 568 184 L 580 208 L 570 232 L 552 226 L 542 208 Z',
  // South-East-Asia archipelago (Indonesia simplified)
  'M 620 220 L 668 218 L 690 228 L 680 240 L 642 238 L 622 232 Z',
  // Australia
  'M 656 252 L 706 252 L 728 266 L 728 286 L 710 300 L 678 304 L 658 296 L 648 278 Z',
  // Antarctica — thin strip at the bottom
  'M 30 372 L 770 372 L 770 392 L 30 392 Z',
];

const LABEL_COLLIDE_RADIUS = 26; // px in viewBox space

function TeaserEarth() {
  const W = 800;
  const H = 400;
  const project = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });

  // Resolve label-anchor offsets per pin: for each standort, check whether
  // a previously-positioned pin is within the collision radius. If so, flip
  // this one's label below; otherwise default above-right.
  const pins = standorte.map((s, i) => {
    const { x, y } = project(s.lat, s.lng);
    let labelDy = 5; // default below the pin centre
    let labelDx = 18;
    for (let j = 0; j < i; j++) {
      const prev = standorte[j]!;
      const p = project(prev.lat, prev.lng);
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < LABEL_COLLIDE_RADIUS) {
        // Push this label downward (and slightly right) so it clears the prior.
        labelDy = 32;
        labelDx = 18;
        break;
      }
    }
    return { ...s, x, y, labelDx, labelDy };
  });

  const hauptsitz = pins[0]!;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Globusvorschau mit vier Standorten"
    >
      <defs>
        <pattern id="teaser-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1" fill="#4D8FBF" fillOpacity="0.32" />
        </pattern>
        <radialGradient id="teaser-vignette" cx="50%" cy="50%" r="65%">
          <stop offset="60%" stopColor="rgba(10,11,14,0)" />
          <stop offset="100%" stopColor="rgba(10,11,14,0.92)" />
        </radialGradient>
      </defs>

      {/* Ocean: dot-grid as planet backdrop */}
      <rect width={W} height={H} fill="url(#teaser-dots)" opacity="0.55" />

      {/* Continents — filled silhouettes, very dezent, with a thin stroke
          so the outlines read even where the fill is faint. */}
      <g fill="#F2EDE2" fillOpacity="0.07" stroke="#F2EDE2" strokeOpacity="0.18" strokeWidth="0.6">
        {CONTINENT_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Edge vignette */}
      <rect width={W} height={H} fill="url(#teaser-vignette)" />

      {/* Connection arcs — drawn first so pins layer above */}
      {pins.slice(1).map((p) => (
        <line
          key={`arc-${p.city}`}
          x1={hauptsitz.x}
          y1={hauptsitz.y}
          x2={p.x}
          y2={p.y}
          stroke="#75C9D9"
          strokeWidth="0.6"
          strokeDasharray="3 4"
          opacity="0.4"
        />
      ))}

      {/* Pins + labels */}
      {pins.map((p) => (
        <g key={p.city} data-pin transform={`translate(${p.x} ${p.y})`}>
          <circle r="14" fill="none" stroke="#75C9D9" strokeWidth="1" opacity="0.5" />
          <circle r="5" fill="#A4DEEB" />
          <g transform={`translate(${p.labelDx} ${p.labelDy})`}>
            <text
              fontSize="11"
              fontFamily="ui-monospace, monospace"
              letterSpacing="1.6"
              fill="#F2EDE2"
              style={{ textTransform: 'uppercase' }}
            >
              {p.city}
            </text>
            <text
              y="14"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              letterSpacing="1.4"
              fill="#9B9385"
              style={{ textTransform: 'uppercase' }}
            >
              {formatLocalTime(p.tz)} · seit {p.since}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useUIStore } from '@/lib/store';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { StandortePanel } from './StandortePanel';

const NetzwerkGlobe = lazy(() =>
  import('./NetzwerkGlobe').then((m) => ({ default: m.NetzwerkGlobe })),
);

type Tier = 'full' | 'mid' | 'mobile' | 'reduced';

function pickTier(): Tier {
  if (typeof window === 'undefined') return 'reduced';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return 'mobile';
  const cores = navigator.hardwareConcurrency ?? 2;
  return cores >= 8 ? 'full' : 'mid';
}

/**
 * /netzwerk top-level — full-bleed globe canvas with the StandortePanel
 * docked right (panel sits below globe on small screens).
 *
 *  · Tier system mirrors Hero: full / mid / mobile / reduced. R3F dynamic
 *    chunk only loads outside `reduced`. Reduced renders a static SVG
 *    fallback that lists the four standorte without WebGL.
 *  · Section state: `activeIndex` (-1..3) shared by Globe + Panel. Click a
 *    pin or panel row → camera-fly + magnify ring.
 *  · ScrollTrigger registers section enter so the SoundProvider crossfades
 *    to the netzwerk drone volume.
 */
export function NetzwerkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const [tier, setTier] = useState<Tier>('reduced');
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setTier(pickTier());
    setCurrentSection('netzwerk');
  }, [setCurrentSection]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection('netzwerk'),
        onEnterBack: () => setCurrentSection('netzwerk'),
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="netzwerk"
      data-section="netzwerk"
      className="relative min-h-screen bg-ink text-bone"
    >
      <div className="grid h-screen w-full grid-rows-[1fr_auto] lg:grid-cols-[1fr_minmax(360px,460px)] lg:grid-rows-1">
        {/* ── Globe canvas ──────────────────────────────────────────── */}
        <div className="relative min-h-[55vh] overflow-hidden lg:h-screen">
          {/* Absolute-positioned inner wrap so the R3F Canvas inherits an
              explicit pixel-sized parent at mount time. Without this,
              R3F's ResizeObserver can resolve a grid-cell parent at
              0×0 on first paint and leave the canvas at its 300×150
              fallback dimensions. */}
          <div className="absolute inset-0">
            {tier !== 'reduced' ? (
              <Suspense fallback={<GlobeFallback />}>
                <NetzwerkGlobe
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  tier={tier}
                />
              </Suspense>
            ) : (
              <ReducedFallback />
            )}
          </div>

          {/* Floating top-left section ID — editorial trim */}
          <div className="pointer-events-none absolute left-s4 top-s4 z-10 sm:left-s5 sm:top-s5">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
              Netzwerk · Globus
            </p>
            <p className="mt-s1 font-mono text-data-label uppercase tracking-data text-bone-faint">
              Sun · Live · Day / Night
            </p>
          </div>

          {/* Floating bottom-left coordinate readout */}
          <p className="pointer-events-none absolute bottom-s4 left-s4 z-10 font-mono text-coordinates text-bone-faint sm:bottom-s5 sm:left-s5">
            48.77° N · 11.43° E &nbsp; → &nbsp; planet
          </p>
        </div>

        {/* ── Side panel ────────────────────────────────────────────── */}
        <div className="border-t border-border-subtle lg:border-l lg:border-t-0">
          <StandortePanel activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}

/** Brief skeleton while the lazy globe chunk loads. */
function GlobeFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-ink">
      <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
        Globus wird geladen …
      </p>
    </div>
  );
}

/** Static fallback for `prefers-reduced-motion`. SVG world dot-grid + 4 markers. */
function ReducedFallback() {
  return (
    <div className="relative flex h-full items-center justify-center bg-ink p-s5">
      <svg viewBox="0 0 800 400" className="h-auto w-full max-w-3xl text-data-cyan opacity-50">
        {/* Equirectangular dot-grid */}
        <defs>
          <pattern id="globe-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect x="40" y="40" width="720" height="320" fill="url(#globe-dots)" opacity="0.6" />
        <rect
          x="40"
          y="40"
          width="720"
          height="320"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.5"
        />
        {/* Four standort marks */}
        {[
          { x: 410, y: 130, label: 'Ingolstadt' },
          { x: 620, y: 170, label: 'Shanghai' },
          { x: 470, y: 300, label: 'Johannesburg' },
          { x: 418, y: 132, label: 'Linz' },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="6" fill="#D97648" />
            <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#D97648" strokeWidth="1" />
            <text
              x={p.x + 18}
              y={p.y + 4}
              fontSize="10"
              fill="#F2EDE2"
              fontFamily="ui-monospace, monospace"
              letterSpacing="1.5"
            >
              {p.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

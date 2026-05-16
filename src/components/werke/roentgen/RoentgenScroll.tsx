import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import type { ProjectLayer } from '@/content/projects';
import {
  LayerArchitektur,
  LayerTragstruktur,
  LayerMobilitaet,
  LayerSichtachsen,
  LayerStrukturplanung,
  PhotoArchitektur,
} from './layers/WestParkLayers';
import {
  PavilionArchitektur,
  PavilionMaterialfluss,
  PavilionProgramm,
  PavilionStrukturplanung,
} from './layers/ShanghaiLayers';
import {
  HubHuelle,
  HubMobilitaetsstroeme,
  HubEnergie,
  HubSozial,
  HubStrukturplanung,
} from './layers/MobilityHubLayers';
import {
  SenSymbolik,
  SenSakraleGeometrie,
  SenProgramm,
  SenStrukturplanung,
} from './layers/SenLayers';
import {
  HopeArchitektur,
  HopeBildungsraum,
  HopeTraegermodell,
  HopeStrukturplanung,
} from './layers/VWHopeLayers';

interface RoentgenScrollProps {
  /** Layer definitions (one per scroll-stage). 4 or 5 depending on project. */
  layers: ProjectLayer[];
  /** Project slug — picks the layer renderer set. */
  slug: string;
  /** Image used for the photo overlay on layer 00 (WestPark only currently). */
  photo?: string;
}

/**
 * Per-layer scroll budget — translates to PIN_EXTRA_VH = (total - 1) * 125%.
 *  · 5 layers → 500% extra → 600vh exposure (matches W5 WestPark cadence)
 *  · 4 layers → 375% extra → 475vh exposure
 * Keeps every layer-to-layer transition equal in scroll-time regardless of
 * how many layers a project has.
 */
const VH_PER_TRANSITION = 125;

interface LayerRenderer {
  /** SVG component drawn full-bleed in the viewer frame. */
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional photo overlay (only layer 00 of WestPark for now). */
  Photo?: string;
}

/**
 * Röntgen-Scroll — the project deep-dive's core interaction.
 *
 *  · Section is pinned for 5 × ~100vh of scroll. Progress 0..1 maps linearly
 *    onto the layer index 0..4.
 *  · A horizontal "scanner" line crossfades adjacent layers: the band that
 *    sits at scroll-tick `t` shows layer ⌊t⌋, with the next layer rising in
 *    opacity inside a ~30% transition zone.
 *  · The annotation rail on the right swaps content when the dominant layer
 *    changes (passes the 50% mark of its zone). Body text fades in / out
 *    rather than scrolling, so the swap reads as definitive.
 *  · DrawSVG-style animation runs on layer-enter for any path with
 *    `data-draw="true"`. Lines reveal stroke 0→1 in ~0.9s.
 *  · prefers-reduced-motion: skip the pin + crossfade, render layers as a
 *    vertical stack with static annotations alongside.
 *
 * Layer renderer set is keyed by slug — WestPark is the only one wired in W5,
 * Shanghai / Mobility / Sen / VW Hope add their own layer renderers in W6.
 */
export function RoentgenScroll({ layers, slug, photo }: RoentgenScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const annotationsRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const [activeIndex, setActiveIndex] = useState(0);

  const renderers: LayerRenderer[] = useMemo(() => buildRendererSet(slug, photo), [slug, photo]);

  // Sort layers by index defensively (the content file should already do it).
  const orderedLayers = useMemo(() => [...layers].sort((a, b) => a.index - b.index), [layers]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const layerEls = stage.querySelectorAll<HTMLElement>('[data-layer]');
    const photoEls = stage.querySelectorAll<HTMLElement>('[data-photo]');
    const total = orderedLayers.length;

    // Pre-paint: only layer 0 + photo visible.
    layerEls.forEach((el, i) => {
      gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });
    photoEls.forEach((el) => {
      gsap.set(el, { opacity: 1 });
    });

    const ctx = gsap.context(() => {
      // ── DrawSVG-equivalent: animate stroke-dashoffset on opted-in paths.
      // We pre-set every stroke to "drawn" state (dashoffset 0). On layer
      // enter, we re-trigger a 0→100% draw for that layer's paths.
      const drawAtLayer = (layerIndex: number) => {
        const el = layerEls[layerIndex];
        if (!el) return;
        const paths = el.querySelectorAll<SVGGeometryElement>('[data-draw="true"]');
        paths.forEach((p) => {
          try {
            const len = p.getTotalLength?.() ?? 0;
            if (!len) return;
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(p, {
              strokeDashoffset: 0,
              duration: 0.9,
              ease: 'power3.out',
            });
          } catch {
            /* getTotalLength can throw on text or non-geom; ignore. */
          }
        });
      };

      // Initial draw for layer 0 once the section enters viewport.
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => drawAtLayer(0),
      });

      // Section pin + scroll-driven layer cross-fade. Pin length scales
      // with layer count so the per-transition pace stays constant across
      // 4-layer and 5-layer deep dives.
      const pinExtraVh = (total - 1) * VH_PER_TRANSITION;
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${pinExtraVh}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => setCurrentSection('werk-roentgen'),
        onEnterBack: () => setCurrentSection('werk-roentgen'),
        onUpdate: (self) => {
          const t = self.progress * (total - 1); // 0..(total-1)
          const base = Math.floor(t);
          const frac = t - base;

          // Cross-fade layers
          layerEls.forEach((el, i) => {
            let opacity = 0;
            if (i === base) opacity = 1 - smoothstep(0.55, 1, frac);
            else if (i === base + 1) opacity = smoothstep(0, 0.45, frac);
            gsap.set(el, { opacity });
          });

          // Photo overlay — present at layer 0, dissolves through layer 1.
          photoEls.forEach((el) => {
            const fade = 1 - smoothstep(0, 1, t);
            gsap.set(el, { opacity: Math.max(0, fade) });
          });

          // Scanner line — moves vertically through the viewer to sell the
          // x-ray sweep. Its y-position tracks the cross-fade phase.
          const scanline = scanlineRef.current;
          if (scanline) {
            const inTransition = frac > 0.2 && frac < 0.85;
            gsap.set(scanline, {
              opacity: inTransition ? 0.9 : 0,
              yPercent: -50 + ((frac - 0.2) / 0.65) * 100,
            });
          }

          // Progress bar
          const bar = progressBarRef.current;
          if (bar) {
            gsap.set(bar, { scaleY: self.progress });
          }

          // Dominant layer for annotation swap — switch when we're past 50%
          // into the upcoming zone so labels don't flicker.
          const nextDominant = frac > 0.55 ? Math.min(base + 1, total - 1) : base;
          setActiveIndex((prev) => (prev === nextDominant ? prev : nextDominant));
        },
      });

      // Re-trigger the SVG line-draw whenever the dominant layer changes.
      // The state-based effect below handles this via a separate listener.
      stage.dataset.drawHook = 'ready';
      // Expose drawAtLayer to the React state effect via a custom event so
      // we keep the GSAP context owning the actual animation.
      const handler = (e: Event) => {
        const detail = (e as CustomEvent<number>).detail;
        if (typeof detail === 'number') drawAtLayer(detail);
      };
      stage.addEventListener('roentgen:draw', handler);
      // Capture cleanup in the gsap context's revert hook.
      return () => stage.removeEventListener('roentgen:draw', handler);
    }, section);

    return () => ctx.revert();
  }, [orderedLayers.length, setCurrentSection]);

  // Trigger a fresh draw when the dominant layer changes.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || stage.dataset.drawHook !== 'ready') return;
    stage.dispatchEvent(new CustomEvent('roentgen:draw', { detail: activeIndex }));
  }, [activeIndex]);

  const activeLayer = orderedLayers[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="roentgen-scroll"
      data-section="werk-roentgen"
      className="relative h-screen w-full overflow-hidden bg-ink text-bone"
    >
      {/* Top-of-section meta */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-s4 px-s4 py-s4 sm:px-s5 sm:py-s5">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          Röntgen-Scroll · {String(orderedLayers.length).padStart(2, '0')} Schichten
        </p>
        <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
          Scrollen → Tiefer
        </p>
      </div>

      {/* Vertical progress bar — left rail */}
      <div className="absolute left-s4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-end lg:gap-s3">
        <div className="relative h-[40vh] w-px bg-border-strong">
          <div
            ref={progressBarRef}
            aria-hidden="true"
            className="absolute inset-0 origin-top bg-accent"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>
        <ol className="flex flex-col items-end gap-s2 font-mono text-data-label uppercase tracking-data">
          {orderedLayers.map((l) => (
            <li
              key={l.index}
              className={`transition-colors duration-hover ease-cinematic ${
                l.index === activeIndex ? 'text-accent' : 'text-bone-faint'
              }`}
            >
              <span className="mr-s2 inline-block w-6 text-right">
                {String(l.index).padStart(2, '0')}
              </span>
              {l.name}
            </li>
          ))}
        </ol>
      </div>

      {/* Stage — viewer stacked above annotation panel.
           v2 (W13 narrative-repair): the v1 floated the annotation card to
           the right of the viewer at top-1/2 — on Strukturplanung layers,
           the most important stakeholder diagram content lives on the
           right half and was being occluded. The new layout stacks: viewer
           on top maintains 16:9 aspect, annotation rail full-width below
           takes the remaining vertical space. Reads as "edukativ" rather
           than "cinematic overlay" — the section is information-dense and
           benefits from the clean stack. */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex flex-col items-center gap-s4 px-s4 pb-s5 pt-s8 sm:px-s5 sm:pt-s9 lg:pl-s9"
      >
        {/* Viewer frame */}
        <div className="relative aspect-[16/9] w-full max-w-5xl flex-shrink-0 overflow-hidden bg-elevated">
          {/* Photo overlays (only when present) */}
          {renderers.map((r, i) =>
            r.Photo ? (
              <div
                key={`photo-${i}`}
                data-photo={i}
                className="pointer-events-none absolute inset-0"
              >
                <PhotoArchitektur src={r.Photo} />
              </div>
            ) : null,
          )}

          {/* SVG layers — all stacked, opacity managed by ScrollTrigger */}
          {renderers.map((r, i) => {
            const { Component } = r;
            return (
              <div
                key={`layer-${i}`}
                data-layer={i}
                className="pointer-events-none absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Component className="h-full w-full" />
              </div>
            );
          })}

          {/* Scanner line */}
          <div
            ref={scanlineRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px"
            style={{
              opacity: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(184,92,46,0.0) 10%, rgba(184,92,46,0.95) 50%, rgba(184,92,46,0.0) 90%, transparent 100%)',
              boxShadow: '0 0 24px 4px rgba(217,118,72,0.35)',
            }}
          />

          {/* Viewer frame corner ticks — engineering-drawing trim */}
          <FrameTicks />
        </div>

        {/* Annotation rail — sits directly under the viewer, full-width */}
        <aside ref={annotationsRef} className="w-full max-w-5xl flex-1 overflow-hidden">
          <div className="h-full border-l-2 border-accent bg-ink/60 p-s4 backdrop-blur-sm">
            <div className="grid gap-s4 md:grid-cols-12">
              {/* Layer identity — left col on md+, full width below */}
              <div className="md:col-span-5">
                <p className="font-mono text-data-label uppercase tracking-data text-accent">
                  Schicht {String(activeIndex).padStart(2, '0')}
                </p>
                <h3
                  className="mt-s2 font-display text-3xl leading-[0.95] text-bone sm:text-4xl"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
                >
                  {activeLayer?.name ?? ''}
                </h3>
                <p className="mt-s1 font-display text-base italic text-bone-muted">
                  {activeLayer?.tagline ?? ''}
                </p>
              </div>

              {/* Body copy + data — right col on md+ */}
              <div className="md:col-span-7">
                <p className="text-body-m text-bone-muted">{activeLayer?.body ?? ''}</p>
                {activeLayer?.data && activeLayer.data.length > 0 ? (
                  <dl className="mt-s4 grid grid-cols-3 gap-s3 border-t border-border-subtle pt-s3">
                    {activeLayer.data.map((d) => (
                      <div key={d.label}>
                        <dt className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                          {d.label}
                        </dt>
                        <dd className="mt-s1 font-display text-lg leading-tight text-bone">
                          {d.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/**
 * Returns the layer renderer set for a given project slug. All five featured
 * deep dives ship bespoke SVG diagrams (W5 WestPark, W6 Shanghai / Mobility
 * Hub / Sen / VW Hope).
 *
 * Each set's length must equal the project's `layers[]` length — they
 * cross-fade in lock-step.
 *
 * WestPark Layer 00 also takes a photo overlay (the only project where the
 * built artifact has been photographed). Other deep dives stay SVG-only;
 * their projection of the architecture happens entirely through hand-drawn
 * elevation / plan diagrams.
 */
function buildRendererSet(slug: string, photo: string | undefined): LayerRenderer[] {
  switch (slug) {
    case 'westpark-verbindungssteg':
      return [
        {
          Component: LayerArchitektur,
          Photo: photo ?? '/projects/westpark-verbindungssteg/02.avif',
        },
        { Component: LayerTragstruktur },
        { Component: LayerMobilitaet },
        { Component: LayerSichtachsen },
        { Component: LayerStrukturplanung },
      ];
    case 'shanghai-pavillion-of-innovation':
      return [
        { Component: PavilionArchitektur },
        { Component: PavilionMaterialfluss },
        { Component: PavilionProgramm },
        { Component: PavilionStrukturplanung },
      ];
    case 'mobility-hub-ingolstadt':
      return [
        { Component: HubHuelle },
        { Component: HubMobilitaetsstroeme },
        { Component: HubEnergie },
        { Component: HubSozial },
        { Component: HubStrukturplanung },
      ];
    case 'sen-friedenszentrum-thai-binh':
      return [
        { Component: SenSymbolik },
        { Component: SenSakraleGeometrie },
        { Component: SenProgramm },
        { Component: SenStrukturplanung },
      ];
    case 'vw-hope-academy-suedafrika':
      return [
        { Component: HopeArchitektur },
        { Component: HopeBildungsraum },
        { Component: HopeTraegermodell },
        { Component: HopeStrukturplanung },
      ];
    default:
      // Unknown slug — fall back to WestPark renderers so the structural
      // layout still renders rather than crashing the route.
      return [
        { Component: LayerArchitektur },
        { Component: LayerTragstruktur },
        { Component: LayerMobilitaet },
        { Component: LayerSichtachsen },
        { Component: LayerStrukturplanung },
      ];
  }
}

function FrameTicks() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-bone-faint/70"
    >
      {/* Four L-shaped corner ticks */}
      <g stroke="currentColor" strokeWidth="0.2" fill="none">
        <path d="M 0.5 4 L 0.5 0.5 L 4 0.5" />
        <path d="M 96 0.5 L 99.5 0.5 L 99.5 4" />
        <path d="M 0.5 96 L 0.5 99.5 L 4 99.5" />
        <path d="M 96 99.5 L 99.5 99.5 L 99.5 96" />
      </g>
    </svg>
  );
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

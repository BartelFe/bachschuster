import { useCallback, useEffect, useRef, useState } from 'react';
import { HeroCanvas } from './HeroCanvas';
import { DebugLayerSlider } from './DebugLayerSlider';
import { brand } from '@/content/brand';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type Tier = 'full' | 'mid' | 'mobile' | 'reduced';

function pickPerformanceTier(): Tier {
  if (typeof window === 'undefined') return 'reduced';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return 'mobile';
  const cores = navigator.hardwareConcurrency ?? 2;
  return cores >= 8 ? 'full' : 'mid';
}

const PARTICLE_COUNT: Record<Tier, number> = {
  full: 80_000,
  mid: 40_000,
  mobile: 15_000,
  reduced: 0,
};

/** Mobile + reduced tiers skip the composer for the second render pass cost. */
const POSTFX_ENABLED: Record<Tier, boolean> = {
  full: true,
  mid: true,
  mobile: false,
  reduced: false,
};

/** Extra scroll distance the section is pinned for, expressed as viewport heights. */
const PIN_EXTRA_VH = 400; // 400 % extra atop initial 100 vh ⇒ 500 vh total exposure

export default function HeroSection() {
  const [tier, setTier] = useState<Tier>('reduced');
  const sectionRef = useRef<HTMLElement>(null);
  /**
   * The single source of truth for uMorph.
   *  · ScrollTrigger writes it on every scroll tick (no React re-render).
   *  · DebugSlider writes it on user drag.
   *  · ParticleField reads it in useFrame and lerps the uniform toward it.
   */
  const morphRef = useRef(0);

  useEffect(() => {
    setTier(pickPerformanceTier());
  }, []);

  /**
   * Tier auto-downgrade on sustained FPS dips. The PerformanceMonitor in the
   * canvas calls this when frame time goes south. We never auto-upgrade —
   * once we've decided the device can't keep up, we stay generous.
   */
  const handleDecline = useCallback(() => {
    setTier((current) => {
      if (current === 'full') return 'mid';
      if (current === 'mid') return 'mobile';
      return current;
    });
  }, []);

  useEffect(() => {
    if (tier === 'reduced') return;
    const section = sectionRef.current;
    if (!section) return;

    // GSAP context auto-collects every ScrollTrigger created inside it so
    // `ctx.revert()` cleans them up — important for tier downgrade + HMR.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${PIN_EXTRA_VH}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          morphRef.current = self.progress * 4;
        },
      });
    }, section);

    // Refresh once after mount in case Lenis is still booting.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        {tier !== 'reduced' ? (
          <HeroCanvas
            particleCount={PARTICLE_COUNT[tier]}
            morphRef={morphRef}
            enablePostFx={POSTFX_ENABLED[tier]}
            onDecline={handleDecline}
          />
        ) : (
          <HeroReducedFallback />
        )}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full items-end px-s4 pb-s7 sm:px-s5">
        <div className="max-w-6xl">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            {brand.name} · Pitch v1
          </p>
          <h1 className="mt-s3 text-balance font-display text-display-hero text-bone">
            {brand.claim}
          </h1>
        </div>
      </div>

      {tier !== 'reduced' && <DebugLayerSlider morphRef={morphRef} />}
    </section>
  );
}

/**
 * Static fallback shown when the user has `prefers-reduced-motion: reduce`.
 * A flat SVG skyline silhouette evokes Layer 0 without WebGL, kept editorial
 * (stroke-only, low contrast) rather than skeuomorphic. The HeroSection's
 * headline overlay still renders on top.
 */
function HeroReducedFallback() {
  return (
    <div className="relative flex h-full items-end justify-center bg-ink" aria-hidden="true">
      <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="xMidYMax slice"
        className="h-1/2 w-full text-data-cyan opacity-30"
      >
        <line x1="0" y1="170" x2="600" y2="170" stroke="currentColor" strokeWidth="0.5" />
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="20" y="120" width="34" height="50" />
          <rect x="60" y="90" width="28" height="80" />
          <rect x="95" y="135" width="22" height="35" />
          <rect x="125" y="105" width="40" height="65" />
          <rect x="175" y="80" width="26" height="90" />
          <rect x="210" y="125" width="32" height="45" />
          <rect x="250" y="60" width="34" height="110" />
          <rect x="295" y="100" width="28" height="70" />
          <rect x="330" y="115" width="26" height="55" />
          <rect x="365" y="75" width="38" height="95" />
          <rect x="410" y="125" width="22" height="45" />
          <rect x="440" y="95" width="34" height="75" />
          <rect x="485" y="115" width="28" height="55" />
          <rect x="520" y="80" width="26" height="90" />
          <rect x="555" y="130" width="30" height="40" />
        </g>
      </svg>
    </div>
  );
}

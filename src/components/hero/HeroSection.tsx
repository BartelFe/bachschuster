import { useCallback, useEffect, useRef, useState } from 'react';
import { HeroCanvas } from './HeroCanvas';
import { HeroHeadline } from './HeroHeadline';
import { SectionTracker } from './SectionTracker';
import { DebugLayerSlider } from './DebugLayerSlider';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';

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

const POSTFX_ENABLED: Record<Tier, boolean> = {
  full: true,
  mid: true,
  mobile: false,
  reduced: false,
};

/** Extra scroll distance the section is pinned for, expressed as viewport heights. */
const PIN_EXTRA_VH = 400; // 400 % extra atop initial 100 vh ⇒ 500 vh total exposure
/**
 * Scroll progress at which the morph locks at Layer 4 and the exit-collapse
 * animation begins. The remaining 15 % of pinned scroll runs the implosion.
 */
const EXIT_THRESHOLD = 0.85;

export default function HeroSection() {
  const [tier, setTier] = useState<Tier>('reduced');
  const [exiting, setExiting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  /**
   * Drivers for the shader animation, mutated outside React's render cycle.
   *  · morphRef → uMorph (Layer 0..4)
   *  · exitRef → uExit (0..1, only in the last 15 % of pin)
   */
  const morphRef = useRef(0);
  const exitRef = useRef(0);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    setTier(pickPerformanceTier());
    setCurrentSection('hero');
  }, [setCurrentSection]);

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
          const p = self.progress;
          if (p < EXIT_THRESHOLD) {
            // Linear remap of [0, 0.85] → [0, 4] so morph reaches Conflicts
            // exactly when the collapse phase begins.
            morphRef.current = (p / EXIT_THRESHOLD) * 4;
            exitRef.current = 0;
          } else {
            morphRef.current = 4;
            exitRef.current = (p - EXIT_THRESHOLD) / (1 - EXIT_THRESHOLD);
          }
        },
      });

      // Visibility flag for headline/tracker overlays + sound-section state.
      // Duck the overlays as the exit collapse takes over, and tell the
      // SoundProvider to crossfade the drone toward `hero-exit`.
      ScrollTrigger.create({
        trigger: section,
        start: `top+=${EXIT_THRESHOLD * PIN_EXTRA_VH}% top`,
        end: `+=${(1 - EXIT_THRESHOLD) * PIN_EXTRA_VH}%`,
        onEnter: () => {
          setExiting(true);
          setCurrentSection('hero-exit');
        },
        onLeaveBack: () => {
          setExiting(false);
          setCurrentSection('hero');
        },
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [tier, setCurrentSection]);

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
            exitRef={exitRef}
            enablePostFx={POSTFX_ENABLED[tier]}
            onDecline={handleDecline}
          />
        ) : (
          <HeroReducedFallback />
        )}
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-reveal ease-cinematic ${
          exiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <HeroHeadline morphRef={morphRef} />
      </div>

      {tier !== 'reduced' && <SectionTracker morphRef={morphRef} hidden={exiting} />}
      {tier !== 'reduced' && <DebugLayerSlider morphRef={morphRef} />}
    </section>
  );
}

/**
 * Static fallback shown when the user has `prefers-reduced-motion: reduce`.
 * A flat SVG skyline silhouette evokes Layer 0 without WebGL, kept editorial
 * (stroke-only, low contrast) rather than skeuomorphic. The HeroHeadline
 * overlay still renders on top via the HeroSection's normal flow.
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

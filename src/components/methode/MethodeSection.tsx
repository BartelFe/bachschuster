import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { ForceGraph } from './ForceGraph';
import { StakeholderLegend } from './StakeholderLegend';
import { MethodeNarrative } from './MethodeNarrative';
import { MODES, modeAtProgress, type ModeId } from './graph-modes';
import type { StakeholderId } from './graph-data';

const PIN_EXTRA_VH = 300;

/**
 * Methode Deep-Dive section. Pinned for 400 vh (~3 viewports of scroll) so the
 * three modes get adequate time to land. ScrollTrigger writes scroll progress
 * into `progressRef`, which the ForceGraph reads each frame to lerp force
 * parameters smoothly. Narrative copy + dominant-mode header swap discretely
 * via React state at 0.45 / 0.85 thresholds so the body text doesn't flicker
 * mid-transition.
 *
 * The CTA at the bottom links to /werke — master prompt §7 W4 task 8.
 */
export function MethodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const highlightRef = useRef<StakeholderId | null>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const [dominantMode, setDominantMode] = useState<ModeId>('chaos');

  useEffect(() => {
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
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const mode = modeAtProgress(self.progress).dominantMode;
          setDominantMode((prev) => (prev === mode ? prev : mode));
        },
        onEnter: () => setCurrentSection('methode'),
        onEnterBack: () => setCurrentSection('methode'),
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="methode"
      data-section="methode"
      className="relative h-screen w-full overflow-hidden bg-ink text-bone"
    >
      {/* Canvas occupies the section bg full-bleed. */}
      <div className="absolute inset-0">
        <ForceGraph progressRef={progressRef} highlightRef={highlightRef} />
      </div>

      {/* Foreground: pretitle + legend top, narrative right, CTA bottom. */}
      <div className="pointer-events-none relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-s5 px-s4 py-s7 sm:px-s5 sm:py-s8">
        <header className="pointer-events-auto flex flex-col gap-s3 sm:flex-row sm:items-end sm:justify-between sm:gap-s5">
          {/* Title block sits on top of the canvas — same backdrop-blur
              treatment as the right-side narrative so dragged stakeholder
              nodes can't make the headline illegible. (W14 audit overlap-fix.) */}
          <div className="border-l-2 border-accent bg-ink/55 px-s3 py-s2 backdrop-blur-md">
            <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
              Die Methode
            </p>
            <h2 className="mt-s2 max-w-2xl font-display text-3xl leading-tight text-bone sm:text-5xl">
              {MODES[dominantMode].narrative.title}
            </h2>
          </div>
          <StakeholderLegend highlightRef={highlightRef} />
        </header>

        <div className="grid h-full grid-cols-1 items-end gap-s5 sm:grid-cols-12 sm:items-stretch">
          {/* Spacer to keep the canvas visible on the left while narrative stays right. */}
          <div className="hidden sm:col-span-7 sm:block" />
          <div className="pointer-events-auto sm:col-span-5">
            <MethodeNarrative dominantMode={dominantMode} />
          </div>
        </div>

        <footer className="pointer-events-auto flex flex-wrap items-center justify-between gap-s3 border-t border-border-subtle bg-ink/55 px-s3 py-s4 backdrop-blur-md">
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Strukturplanung steht <span className="text-accent">vor</span> Stadtplanung und
            Architektur.
          </p>
          <Link
            to="/werke"
            data-magnetic
            data-cursor="link"
            className="group inline-flex items-center gap-s2 border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Erlebe Strukturplanung an einem echten Projekt
            <span
              aria-hidden="true"
              className="transition-transform duration-hover group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </footer>
      </div>
    </section>
  );
}

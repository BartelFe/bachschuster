import { useEffect, useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { brand } from '@/content/brand';
import { useUIStore } from '@/lib/store';
import { NumberCounter } from './NumberCounter';

/**
 * Manifest section — the first hard cut from the dark hero into editorial
 * light. Cream-paper background, towering Fraunces italic with the original
 * Peter-Bachschuster manifesto, three pop-up counters anchoring the brand
 * stats. ScrollTrigger lifts the headline word-by-word as the section
 * enters viewport.
 *
 * Light theme is set via `data-theme="light"` on the section wrapper so
 * semantic tokens (canvas, prose, rule) flip. Explicit paper / ink-soft
 * classes apply to the typography that should never theme-flip.
 *
 * Glyph spans are rendered by React (not GSAP SplitText) to keep React's
 * reconciliation predictable during HMR + StrictMode.
 */
export function ManifestSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const headlineWords = useMemo(() => brand.manifesto.split(' '), []);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('manifest'),
        onEnterBack: () => setCurrentSection('manifest'),
      });

      if (reduced) return;

      const words = headline.querySelectorAll<HTMLSpanElement>('.manifest-word');
      if (words.length === 0) return;

      gsap.set(words, { yPercent: 110, opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [setCurrentSection]);

  return (
    <section
      ref={sectionRef}
      id="manifest"
      data-section="manifest"
      data-theme="light"
      className="relative min-h-screen bg-paper px-s4 py-s9 sm:px-s5"
    >
      <div className="mx-auto grid max-w-7xl gap-s8 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
            Manifest · {brand.founded}
          </p>
          <h2
            ref={headlineRef}
            className="mt-s5 font-display text-display-section italic text-ink-soft"
            style={{ fontVariationSettings: '"wght" 380, "opsz" 144' }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className="manifest-word inline-block overflow-hidden"
                style={{ willChange: 'transform, opacity' }}
              >
                {word}
                {i < headlineWords.length - 1 && ' '}
              </span>
            ))}
          </h2>
          <p className="mt-s6 max-w-xl text-body-l text-ink-faded">
            <span className="font-display italic text-ink-soft">Peter Bachschuster</span> denkt
            Architektur als Methode, nicht als Produkt. Seit {brand.founded} entwerfen wir in{' '}
            {brand.address.city}, Shanghai, Johannesburg und Linz Räume, Strukturen und Zukunft —
            vor dem Gebäude steht das System.
          </p>
        </div>

        <aside className="md:col-span-5">
          <ul className="space-y-s7 border-l border-rule pl-s5">
            <Stat label="Jahre" sub={`seit ${brand.founded}`}>
              <NumberCounter to={brand.yearsActive} duration={1.8} />
            </Stat>
            <Stat label="Kontinente" sub="Europa · Asien · Afrika · Südamerika">
              <NumberCounter to={4} duration={0.9} delay={0.2} />
            </Stat>
            <Stat label="Methode" sub="Strukturplanung">
              <NumberCounter to={1} duration={0.6} delay={0.45} />
            </Stat>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Stat({ children, label, sub }: { children: React.ReactNode; label: string; sub: string }) {
  return (
    <li>
      <span className="block font-display text-display-section leading-[0.85] text-ink-soft">
        {children}
      </span>
      <p className="mt-s2 font-mono text-data-label uppercase tracking-data text-ink-faded">
        {label}
      </p>
      <p className="mt-s1 font-mono text-caption text-ink-faded/70">{sub}</p>
    </li>
  );
}

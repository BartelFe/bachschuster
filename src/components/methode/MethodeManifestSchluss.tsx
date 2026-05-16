import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';
import { brand } from '@/content/brand';

/**
 * Closing band of the /methode page — pulls the page out into a single
 * giant Fraunces italic of the methode-slogan, then routes the reader to
 * the werke index for proof-by-project.
 *
 * The slogan was already defined in `brand.methodeSlogan` but only used in
 * the principal bio. Here it lives as the page's exit punctuation — the
 * line you can quote after closing the tab.
 */
export function MethodeManifestSchluss() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

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
        onEnter: () => setCurrentSection('methode-schluss'),
        onEnterBack: () => setCurrentSection('methode-schluss'),
      });
      if (reduced) return;
      const words = headline.querySelectorAll<HTMLSpanElement>('[data-slogan-word]');
      gsap.set(words, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: headline,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.06,
          });
        },
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  const sloganWords = brand.methodeSlogan.split(' ');

  return (
    <section
      ref={sectionRef}
      id="methode-schluss"
      data-section="methode-schluss"
      className="relative bg-ink px-s4 py-s10 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          Methode · Schluss
        </p>
        <h2
          ref={headlineRef}
          className="mt-s5 max-w-[20ch] font-display text-display-section italic leading-[1.02] text-bone"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
        >
          „
          {sloganWords.map((w, i, arr) => (
            <span
              key={i}
              data-slogan-word
              className="inline-block whitespace-nowrap"
              style={{ willChange: 'transform, opacity' }}
            >
              {w}
              {i < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
          "
        </h2>
        <footer className="mt-s8 flex flex-wrap items-baseline justify-between gap-s4 border-t border-border-subtle pt-s5">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-muted">
            Peter Bachschuster
          </p>
          <Link
            to="/werke"
            data-cursor="link"
            data-magnetic
            className="group inline-flex items-baseline gap-s3 border border-accent px-s4 py-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:bg-accent hover:text-bone"
          >
            Werke anschauen
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

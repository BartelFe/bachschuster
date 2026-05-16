import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useUIStore } from '@/lib/store';

/**
 * iiRD partnership editorial block.
 *
 * The Institut für interdisziplinäre Regionalentwicklung — joint venture
 * with TUM Heilbronn — is the institutional dimension of Strukturplanung.
 * Master prompt §6.2 specifies it as the methode-supporting infrastructure;
 * the audit calls out that the v1 build mentioned it nowhere outside the
 * principal bio. This editorial band drops it on the methode page right
 * before the manifest close so it reads as legitimate scientific anchor.
 *
 * Light theme (paper) — provides a tonal pause between the dark
 * case-studies grid and the dark manifest close. Same paper/ink-soft
 * pattern Manifest already uses elsewhere.
 */
export function MethodeIIRD() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setCurrentSection('methode-iird'),
        onEnterBack: () => setCurrentSection('methode-iird'),
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  const focusAreas = ['Mobilität', 'Smart Cities', 'Kreislaufwirtschaft', 'Klimagerechtes Bauen'];

  return (
    <section
      ref={sectionRef}
      id="methode-iird"
      data-section="methode-iird"
      data-theme="light"
      className="relative bg-paper px-s4 py-s9 text-ink-soft sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        {/* Left: identity */}
        <div className="md:col-span-5">
          <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
            Partnerschaft · seit 2018
          </p>
          <h2
            className="mt-s4 font-display text-display-section leading-[0.95] text-ink-soft"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            iiRD
          </h2>
          <p
            className="mt-s2 font-display text-pull-quote italic text-ink-faded"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
          >
            Institut für interdisziplinäre Regionalentwicklung
          </p>
          <p className="mt-s5 font-mono text-data-label uppercase tracking-data text-ink-faded">
            Gemeinsam mit TUM Heilbronn
          </p>
        </div>

        {/* Right: rationale + focus areas */}
        <div className="space-y-s5 md:col-span-7">
          <p className="text-body-l text-ink-soft">
            Strukturplanung als Methode braucht eine zweite Instanz, die ihre Wirkung
            wissenschaftlich zurückprüft. Bachschuster und die TU München Heilbronn haben dafür das
            iiRD gegründet — weltweit erstes Institut für ganzheitliche Planung von Städten,
            Regionen und Unternehmen als sozio­ökonomische Funktion.
          </p>
          <p className="text-body-m text-ink-faded">
            Das Institut arbeitet projektbegleitend: jeder Mandate fließt als Datensatz zurück in
            die Forschung, jede Forschungsfrage testet sich an einem realen Projekt. Methode und
            Wissen stehen in einer Rückkopplungs­schleife, nicht nebeneinander.
          </p>

          <div className="border-t border-rule pt-s4">
            <p className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Forschungs­schwerpunkte
            </p>
            <ul className="mt-s3 flex flex-wrap gap-x-s5 gap-y-s2">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="font-display text-2xl italic text-ink-soft"
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

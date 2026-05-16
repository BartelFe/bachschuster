/**
 * Single-line pull-quote band that punctuates the move from the
 * architectural-magazine Brief into the technical Röntgen-Scroll.
 *
 * Dark theme — same backdrop as the Röntgen-Scroll it precedes, so the
 * page returns to ink before the X-ray sweep begins. The quote primes
 * the user: stop reading prose, start reading systems.
 */
export function WerkTransitionQuote() {
  return (
    <section
      data-section="werk-transition"
      className="relative bg-ink px-s4 py-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
          Übergang · Architektur → Methode
        </p>
        <p
          className="mt-s5 max-w-4xl font-display text-display-section leading-[1.05] text-bone"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          <span>Was du gesehen hast, ist die </span>
          <span
            className="italic text-accent"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
          >
            Antwort.
          </span>
          <br />
          <span>Was du gleich siehst, ist die </span>
          <span
            className="italic text-accent"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
          >
            Methode.
          </span>
        </p>
        <div className="mt-s7 flex items-center gap-s3 border-t border-border-subtle pt-s4">
          <span className="block h-px w-12 bg-accent" aria-hidden="true" />
          <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
            Scrollen · Schichten freilegen
          </p>
        </div>
      </div>
    </section>
  );
}

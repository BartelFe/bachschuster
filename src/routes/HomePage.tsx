import { lazy, Suspense } from 'react';

/**
 * Hero loads as a separate chunk — `three` + `@react-three/*` weigh ~250 KB
 * gzipped which would otherwise tax every cold visit, even non-Home routes.
 */
const HeroSection = lazy(() => import('@/components/hero/HeroSection'));

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroLoading />}>
        <HeroSection />
      </Suspense>
      {/* W3 will mount the Manifest section here.
          W4: Methode teaser · W5: Werke teaser · W7: Globe teaser · W8: Stimmen/Kontakt. */}
    </>
  );
}

function HeroLoading() {
  return (
    <section
      aria-label="Hero wird geladen"
      className="relative flex h-screen items-center justify-center bg-ink"
    >
      <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
        Lade Strukturplan …
      </p>
    </section>
  );
}

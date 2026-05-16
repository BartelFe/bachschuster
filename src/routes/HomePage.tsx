import { lazy, Suspense } from 'react';
import { ManifestSection } from '@/components/manifest/ManifestSection';
import { WerkeTeaser } from '@/components/werke/WerkeTeaser';
import { NetzwerkTeaser } from '@/components/netzwerk/NetzwerkTeaser';
import { StimmenTeaser } from '@/components/stimmen/StimmenTeaser';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * Hero loads as a separate chunk — `three` + `@react-three/*` weigh ~250 KB
 * gzipped which would otherwise tax every cold visit, even non-Home routes.
 */
const HeroSection = lazy(() => import('@/components/hero/HeroSection'));

export default function HomePage() {
  useDocumentMeta(ROUTE_META['/']!);
  return (
    <>
      <Suspense fallback={<HeroLoading />}>
        <HeroSection />
      </Suspense>
      <ManifestSection />
      <WerkeTeaser />
      <NetzwerkTeaser />
      <StimmenTeaser />
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

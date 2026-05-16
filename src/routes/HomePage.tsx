import HeroSection from '@/components/hero/HeroSection';
import { ManifestSection } from '@/components/manifest/ManifestSection';
import { WerkeTeaser } from '@/components/werke/WerkeTeaser';
import { NetzwerkTeaser } from '@/components/netzwerk/NetzwerkTeaser';
import { StimmenTeaser } from '@/components/stimmen/StimmenTeaser';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * Home page.
 *
 * HeroSection imported directly (not React.lazy) — Three.js already has
 * its own manualChunk in vite.config so the WebGL bundle is split out
 * anyway, and removing the Suspense layer simplifies the unmount sequence
 * (one less moving part in the well-known R3F + StrictMode + Suspense
 * unmount race). The remaining race-condition exception is contained by
 * the outer `<R3FErrorBoundary>` in RootLayout.
 */
export default function HomePage() {
  useDocumentMeta(ROUTE_META['/']!);
  return (
    <>
      <HeroSection />
      <ManifestSection />
      <WerkeTeaser />
      <NetzwerkTeaser />
      <StimmenTeaser />
    </>
  );
}

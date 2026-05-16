import HeroSection from '@/components/hero/HeroSection';
import { ManifestSection } from '@/components/manifest/ManifestSection';
import { MethodeTeaser } from '@/components/methode/MethodeTeaser';
import { WerkeTeaser } from '@/components/werke/WerkeTeaser';
import { NetzwerkTeaser } from '@/components/netzwerk/NetzwerkTeaser';
import { StimmenTeaser } from '@/components/stimmen/StimmenTeaser';
import { KontaktTeaser } from '@/components/kontakt/KontaktTeaser';
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
 *
 * Section rhythm: Hero (dark/WebGL) → Manifest (paper-light editorial) →
 * MethodeTeaser (dark, the narrative bridge into Strukturplanung) →
 * WerkeTeaser (dark/work-grid) → NetzwerkTeaser (dark/globe preview) →
 * StimmenTeaser (dark/voices) → KontaktTeaser (dark/conversion).
 */
export default function HomePage() {
  useDocumentMeta(ROUTE_META['/']!);
  return (
    <>
      <HeroSection />
      <ManifestSection />
      <MethodeTeaser />
      <WerkeTeaser />
      <NetzwerkTeaser />
      <StimmenTeaser />
      <KontaktTeaser />
    </>
  );
}

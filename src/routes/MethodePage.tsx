import { MethodeIntro } from '@/components/methode/MethodeIntro';
import { MethodeSection } from '@/components/methode/MethodeSection';
import { MethodeCaseStudies } from '@/components/methode/MethodeCaseStudies';
import { MethodeIIRD } from '@/components/methode/MethodeIIRD';
import { MethodeManifestSchluss } from '@/components/methode/MethodeManifestSchluss';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * /methode — Strukturplanung Deep Dive.
 *
 * Order (W13 + W14 audit-fixes):
 *  1. MethodeIntro — static 3-mode preview ("understand first").
 *  2. MethodeSection — pinned interactive Force-Graph ("experience second").
 *  3. MethodeCaseStudies — three proof-by-project mini-cards routing to /werke.
 *  4. MethodeIIRD — institutional anchor (TUM Heilbronn partnership).
 *  5. MethodeManifestSchluss — slogan + CTA into /werke.
 */
export default function MethodePage() {
  useDocumentMeta(ROUTE_META['/methode']!);
  return (
    <>
      <MethodeIntro />
      <MethodeSection />
      <MethodeCaseStudies />
      <MethodeIIRD />
      <MethodeManifestSchluss />
    </>
  );
}

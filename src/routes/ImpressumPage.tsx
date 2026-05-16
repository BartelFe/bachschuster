import { PageScaffold } from '@/components/layout/PageScaffold';
import { brand } from '@/content/brand';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * Impressum — § 5 TMG. The pitch v1 ships a structural placeholder; the
 * production-ready legal text (Vertretungs­berechtigte, Registereintrag,
 * USt-IdNr, Aufsichts­behörde / Berufs­kammer) will be filled by Felix's
 * legal review before the public launch.
 */
export default function ImpressumPage() {
  useDocumentMeta(ROUTE_META['/impressum']!);

  return (
    <PageScaffold
      pretitle="Impressum · § 5 TMG"
      title="Anbieterkennzeichnung"
      subtitle={`${brand.legalName} · ${brand.address.street} · ${brand.address.zip} ${brand.address.city} · ${brand.address.country}. Telefon: ${brand.phone}. E-Mail: ${brand.email}. Vollständige Angaben (Vertretungs­berechtigte, Registereintrag, USt-IdNr, Aufsichts­behörde) werden vor der öffentlichen Schaltung ergänzt.`}
    />
  );
}

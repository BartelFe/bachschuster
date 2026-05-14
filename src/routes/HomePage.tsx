import { PageScaffold } from '@/components/layout/PageScaffold';
import { brand } from '@/content/brand';

export default function HomePage() {
  return (
    <PageScaffold
      pretitle="Bachschuster Architektur · Pitch v1"
      title={brand.claim}
      subtitle="Strukturplanung als Methode vor Architektur. Ein integriertes Planungs-Manifest aus Ingolstadt — international tätig seit 1993."
      weekBadge="Hero R3F-Partikel-Build · Woche 2"
    />
  );
}

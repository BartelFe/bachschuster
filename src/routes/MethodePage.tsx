import { PageScaffold } from '@/components/layout/PageScaffold';
import { brand } from '@/content/brand';

export default function MethodePage() {
  return (
    <PageScaffold
      pretitle="Die Methode"
      title={brand.methodeSlogan}
      subtitle="Traditionelle Masterplanung sieht Verkehr, Umweltschutz, Architektur, Zukunft und Stadträume als separate Instanzen. Strukturplanung integriert sie zu einem funktionierenden Gesamtorganismus."
      weekBadge="Force-Graph-Simulation · Woche 4"
      theme="light"
    />
  );
}

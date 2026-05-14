import { PageScaffold } from '@/components/layout/PageScaffold';
import { brand } from '@/content/brand';

export default function ImpressumPage() {
  return (
    <PageScaffold
      pretitle="Impressum"
      title="Anbieterkennzeichnung"
      subtitle={`${brand.legalName} · ${brand.address.street} · ${brand.address.zip} ${brand.address.city} · ${brand.address.country}. Vollständige Angaben gemäß § 5 TMG folgen in Woche 10.`}
    />
  );
}

import { KontaktWizard } from '@/components/kontakt/KontaktWizard';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * /kontakt — Five-step briefing wizard. Submit composes a mailto: URL to
 * brand.email so the pitch site stays backend-free.
 */
export default function KontaktPage() {
  useDocumentMeta(ROUTE_META['/kontakt']!);
  return <KontaktWizard />;
}

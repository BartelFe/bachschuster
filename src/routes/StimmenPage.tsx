import { StimmenSection } from '@/components/stimmen/StimmenSection';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * /stimmen — Editorial Vorträge timeline. Publikationen / Jury / Awards
 * placeholders ship as "folgt"-blocks; the timeline carries 28 real talks.
 */
export default function StimmenPage() {
  useDocumentMeta(ROUTE_META['/stimmen']!);
  return <StimmenSection />;
}

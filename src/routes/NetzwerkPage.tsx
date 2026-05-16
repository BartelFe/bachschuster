import { NetzwerkSection } from '@/components/netzwerk/NetzwerkSection';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * /netzwerk — Globe Deep Dive. Full-screen R3F earth + 4 standorte panel.
 * See `NetzwerkSection` for tier picking, panel state, ScrollTrigger wiring.
 */
export default function NetzwerkPage() {
  useDocumentMeta(ROUTE_META['/netzwerk']!);
  return <NetzwerkSection />;
}

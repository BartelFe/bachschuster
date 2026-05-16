import { TeamSection } from '@/components/team/TeamSection';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * /team — Peter Bachschuster hero + 5-member grid + Soziales-Engagement.
 * Portraits are stylised SVG composites (see TeamPortrait.tsx) derived from
 * the team photo Felix placed at `public/teamfoto.avif`.
 */
export default function TeamPage() {
  useDocumentMeta(ROUTE_META['/team']!);
  return <TeamSection />;
}

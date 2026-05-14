import { useParams } from 'react-router-dom';
import { PageScaffold } from '@/components/layout/PageScaffold';

export default function WerkPage() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <PageScaffold
      pretitle={`Werk · ${slug ?? 'unbekannt'}`}
      title="Was du nicht siehst, ist die Methode."
      subtitle="Project Deep Dive mit Röntgen-Scroll. Jede Layer-Sequenz wird in Woche 5 (WestPark) und Woche 6 (Shanghai / Mobility Hub / Sen Friedenszentrum) realisiert."
      weekBadge={`Röntgen-Scroll · Woche 5${slug && slug !== 'westpark-verbindungssteg' ? '–6' : ''}`}
    />
  );
}

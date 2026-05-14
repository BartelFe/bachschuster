import { useParams } from 'react-router-dom';
import { findProject } from '@/content/projects';
import { WerkHero } from '@/components/werke/WerkHero';
import { WerkContext } from '@/components/werke/WerkContext';
import { RoentgenScroll } from '@/components/werke/roentgen/RoentgenScroll';
import { PageScaffold } from '@/components/layout/PageScaffold';

/**
 * /werke/:slug — Deep dive.
 *
 * W5 ships WestPark Verbindungssteg fully: hero → Röntgen-Scroll (5 layers
 * with bespoke SVG diagrams + photo overlay) → context gallery + pager.
 *
 * Other featured projects (Shanghai, Mobility Hub, Sen, VW Hope Academy)
 * render the same scaffold so navigation works end-to-end, but they fall
 * through to placeholder layer renderers and the W6 task is to ship their
 * bespoke diagrams + full annotation copy.
 *
 * Non-featured catalog projects render a smaller PageScaffold rather than
 * the full deep dive — the index card is the canonical surface.
 */
export default function WerkPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = findProject(slug);

  if (!project) {
    return (
      <PageScaffold
        pretitle="Werk · 404"
        title="Werk nicht gefunden."
        subtitle="Der angefragte Projekt-Slug existiert nicht im Katalog."
      />
    );
  }

  if (!project.featured || !project.layers) {
    return (
      <PageScaffold
        pretitle={`Werk · ${project.title}`}
        title={project.title}
        subtitle={project.summary}
        weekBadge="Katalog-Eintrag · Deep Dive nicht vorgesehen"
      />
    );
  }

  return (
    <article>
      <WerkHero project={project} />
      <RoentgenScroll
        layers={project.layers}
        slug={project.slug}
        photo={
          project.images.length > 0 ? `/projects/${project.slug}/${project.images[0]}` : undefined
        }
      />
      <WerkContext project={project} />
    </article>
  );
}

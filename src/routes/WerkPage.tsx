import { useParams } from 'react-router-dom';
import { findProject } from '@/content/projects';
import { WerkHero } from '@/components/werke/WerkHero';
import { WerkBrief } from '@/components/werke/WerkBrief';
import { WerkTransitionQuote } from '@/components/werke/WerkTransitionQuote';
import { WerkContext } from '@/components/werke/WerkContext';
import { RoentgenScroll } from '@/components/werke/roentgen/RoentgenScroll';
import { PageScaffold } from '@/components/layout/PageScaffold';
import { useDocumentMeta } from '@/lib/meta';

/**
 * /werke/:slug — Deep dive.
 *
 * W14 rhythm:
 *  1. WerkHero       — full-bleed photo or generative hull, title bottom-left.
 *  2. WerkBrief      — paper-light architectural-magazine briefing block.
 *  3. WerkTransition — dark single-line quote primes the move into systems.
 *  4. RoentgenScroll — pinned X-ray sweep through the project's layers.
 *  5. WerkContext    — paper-light gallery + project-specific pull-quote + pager.
 *
 * Non-featured catalog projects render a smaller PageScaffold rather than
 * the full deep dive — the index card is the canonical surface.
 */
export default function WerkPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = findProject(slug);

  // Per-project meta. For unknown slugs, fall through to generic copy so
  // the head still gets a sensible title rather than the home default.
  // W15 SEO pass: if the project has a photo on disk, point og:image at the
  // first one so link-share previews show the actual built artefact rather
  // than the generic site og.svg. We pass the path-only — `useDocumentMeta`
  // does not prefix `${SITE}` for non-absolute URLs and most crawlers
  // resolve relative URLs against the canonical link, but to be safe we
  // hand it an absolute URL anchored at the live Vercel domain.
  const ogImage =
    project && project.images.length > 0
      ? `https://bachschuster.vercel.app/projects/${project.slug}/${project.images[0]}`
      : undefined;
  useDocumentMeta({
    title: project
      ? `${project.title}${project.subtitle ? ' · ' + project.subtitle : ''}`
      : 'Werk nicht gefunden',
    description: project
      ? `${project.title}${project.subtitle ? ' — ' + project.subtitle : ''}. ${project.year} · ${project.location}. ${project.summary}`
      : 'Der angefragte Projekt-Slug existiert nicht im Katalog.',
    ogType: 'article',
    ogImage,
  });

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
      <WerkBrief project={project} />
      <WerkTransitionQuote />
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

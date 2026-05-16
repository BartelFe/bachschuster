import { Link } from 'react-router-dom';
import { projects, type Project } from '@/content/projects';

interface WerkContextProps {
  project: Project;
}

/**
 * Below-the-Röntgen-fold section:
 *  · A 3-image gallery (project.images mapped to a tall→wide→tall rhythm)
 *  · A short closing pull-quote
 *  · "Nächstes Werk" pager (next featured project in `projects[]`)
 *
 * Light theme — sets paper-tinted background to provide rhythmic relief
 * between the dark X-ray and the dark next-page transition.
 */
export function WerkContext({ project }: WerkContextProps) {
  const featuredOrder = projects.filter((p) => p.featured);
  const myIdx = featuredOrder.findIndex((p) => p.slug === project.slug);
  const next = myIdx >= 0 ? featuredOrder[(myIdx + 1) % featuredOrder.length] : undefined;

  const hasGallery = project.images.length >= 3;

  return (
    <section data-theme="light" className="relative bg-paper px-s4 py-s9 text-ink-soft sm:px-s5">
      <div className="mx-auto max-w-[1400px]">
        {/* Pull quote — project-specific. Falls back to nothing rather than
            a generic Verbindungssteg quote that misfires on every other werk. */}
        {project.pullQuote ? (
          <>
            <p className="mb-s4 max-w-3xl font-display text-pull-quote italic text-ink-soft">
              „{project.pullQuote.body}"
            </p>
            <p className="mb-s8 font-mono text-data-label uppercase tracking-data text-ink-faded">
              {project.pullQuote.attribution}
            </p>
          </>
        ) : null}

        {/* Gallery */}
        {hasGallery ? (
          <div className="grid grid-cols-12 gap-s3 sm:gap-s4">
            <figure className="col-span-12 sm:col-span-7">
              <img
                src={`/projects/${project.slug}/${project.images[0]}`}
                alt={`${project.title} — Ansicht 01`}
                loading="lazy"
                decoding="async"
                className="block h-[40vh] w-full object-cover sm:h-[60vh]"
              />
              <figcaption className="mt-s2 font-mono text-data-label uppercase tracking-data text-ink-faded">
                01 · {project.location}
              </figcaption>
            </figure>
            <figure className="col-span-6 sm:col-span-5">
              <img
                src={`/projects/${project.slug}/${project.images[1]}`}
                alt={`${project.title} — Ansicht 02`}
                loading="lazy"
                decoding="async"
                className="block h-[28vh] w-full object-cover sm:h-[36vh]"
              />
              <figcaption className="mt-s2 font-mono text-data-label uppercase tracking-data text-ink-faded">
                02 · Detail
              </figcaption>
            </figure>
            <figure className="col-span-6 sm:col-span-5 sm:col-start-8">
              <img
                src={`/projects/${project.slug}/${project.images[2]}`}
                alt={`${project.title} — Ansicht 03`}
                loading="lazy"
                decoding="async"
                className="block h-[28vh] w-full object-cover sm:h-[36vh]"
              />
              <figcaption className="mt-s2 font-mono text-data-label uppercase tracking-data text-ink-faded">
                03 · Kontext
              </figcaption>
            </figure>
          </div>
        ) : (
          <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
            Bildmaterial folgt — Originale werden in Vorbereitung der Pitch-Übergabe nachgereicht.
          </p>
        )}

        {/* Closing rail: methode CTA + next werk */}
        <footer className="mt-s9 grid gap-s5 border-t border-rule pt-s5 md:grid-cols-2">
          <div>
            <p className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Methode
            </p>
            <Link
              to="/methode"
              data-cursor="link"
              data-magnetic
              className="mt-s2 inline-flex items-baseline gap-s2 font-display text-2xl text-ink-soft transition-colors duration-hover ease-cinematic hover:text-accent"
            >
              Mehr zur Strukturplanung
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          {next ? (
            <div className="md:text-right">
              <p className="font-mono text-data-label uppercase tracking-data text-ink-faded">
                Nächstes Werk
              </p>
              <Link
                to={`/werke/${next.slug}`}
                data-cursor="link"
                data-magnetic
                className="mt-s2 inline-flex items-baseline gap-s2 font-display text-2xl text-ink-soft transition-colors duration-hover ease-cinematic hover:text-accent"
              >
                {next.title}
                {next.subtitle ? <span className="italic"> · {next.subtitle}</span> : null}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </footer>
      </div>
    </section>
  );
}

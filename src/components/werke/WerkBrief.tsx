import { type Project, categoryLabel, statusLabel } from '@/content/projects';

interface WerkBriefProps {
  project: Project;
}

/**
 * Architectural-magazine project brief. Sits between the photo hero and the
 * Röntgen-Scroll on every deep-dive page.
 *
 * Layout: two-column on md+, with a long lede paragraph (the project's
 * summary) and a second beat that distills the Strukturplanung-layer's
 * conflict description. Sidebar lists the key facts (Jahr / Standort /
 * Kategorie / Status / Akteure / Vorlauf). Light theme — provides a
 * tonal break between the dark hero and the dark X-ray section, the same
 * paper-to-ink rhythm the Manifest establishes on the homepage.
 *
 * v2 (W14): no new content invented — the second-paragraph copy reuses
 * the verbatim body of the project's Strukturplanung layer (already in
 * `src/content/projects.ts`) so we don't fabricate prose just to fill
 * the layout.
 */
export function WerkBrief({ project }: WerkBriefProps) {
  const struk = project.layers?.find((l) => l.name === 'Strukturplanung');
  const stakeholders = struk?.data?.find((d) => d.label === 'Stakeholder')?.value;
  const vorlauf =
    struk?.data?.find((d) => d.label === 'Vorlauf')?.value ??
    struk?.data?.find((d) => d.label === 'Workshops')?.value ??
    struk?.data?.find((d) => d.label === 'Protokolle')?.value;

  return (
    <section
      data-theme="light"
      data-section="werk-brief"
      className="relative bg-paper px-s4 py-s9 text-ink-soft sm:px-s5"
    >
      <div className="mx-auto grid max-w-[1400px] gap-s7 md:grid-cols-12">
        {/* Body copy */}
        <div className="space-y-s5 md:col-span-7">
          <p className="font-mono text-caption uppercase tracking-caption text-ink-faded">
            Briefing · {project.title}
            {project.subtitle ? ` · ${project.subtitle}` : ''}
          </p>
          <p
            className="font-display text-pull-quote leading-[1.15] text-ink-soft"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            {project.summary}
          </p>
          {struk?.body ? <p className="text-body-l text-ink-faded">{struk.body}</p> : null}
        </div>

        {/* Sidebar: facts grid */}
        <dl className="grid grid-cols-2 gap-s5 self-start border-l border-rule pl-s5 md:col-span-5">
          <div>
            <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Jahr
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-ink-soft">
              {project.year}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Status
            </dt>
            <dd
              className={
                'mt-s1 font-display text-2xl leading-tight ' +
                (project.status === 'realisiert' ? 'text-ink-soft' : 'text-accent')
              }
            >
              {statusLabel(project.status)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Standort
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-ink-soft">
              {project.location}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
              Kategorie
            </dt>
            <dd className="mt-s1 font-display text-2xl leading-tight text-ink-soft">
              {categoryLabel(project.category)}
            </dd>
          </div>
          {stakeholders ? (
            <div>
              <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
                Akteure
              </dt>
              <dd className="mt-s1 font-display text-2xl leading-tight text-ink-soft">
                {stakeholders}
              </dd>
            </div>
          ) : null}
          {vorlauf ? (
            <div>
              <dt className="font-mono text-data-label uppercase tracking-data text-ink-faded">
                Vorlauf
              </dt>
              <dd className="mt-s1 font-display text-2xl leading-tight text-ink-soft">{vorlauf}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}

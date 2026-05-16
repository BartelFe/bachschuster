import { Link } from 'react-router-dom';
import { brand } from '@/content/brand';
import { standorte, formatLocalTime } from '@/content/standorte';
import { footerLegal, primaryNav } from '@/content/nav';
import { vortraege } from '@/content/stimmen';
import { projects } from '@/content/projects';
import { useEffect, useState } from 'react';

/**
 * Footer — pitch-grade.
 *
 *  · Top band: editorial counter line citing the live state of the office
 *    (real numbers from content: projects-count, standorte-count, vorträge-
 *    count, founded-year).
 *  · Standorte column with live local times that re-tick every minute via
 *    `formatLocalTime`.
 *  · Sitemap split between primary nav + legal.
 *  · Bottom band: copyright + Ingolstadt address + a small terrakotta CTA
 *    back to /kontakt — anyone hitting the footer is a hot lead candidate.
 */
export function Footer() {
  // Local-time ticker — re-renders the standort list every 60 s.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const projectCount = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const standortCount = standorte.length;
  const vortraegeCount = vortraege.length;
  const yearsActive = 2026 - brand.founded;

  return (
    <footer className="mt-s9 border-t border-border-subtle bg-ink px-s4 py-s7 text-bone sm:px-s5">
      <div className="mx-auto grid max-w-[1400px] gap-s6 md:grid-cols-12">
        {/* ── Editorial counter band ────────────────────────────────── */}
        <div className="md:col-span-6">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Aktueller Stand · {new Date().getUTCFullYear()}
          </p>
          <p className="mt-s3 font-display text-3xl leading-tight text-bone md:text-4xl">
            Seit <span className="text-accent">{brand.founded}</span> arbeiten wir in{' '}
            <span className="text-accent">{standortCount} Städten</span> an{' '}
            <span className="text-accent">{projectCount} Projekten</span> —{' '}
            <span className="text-accent">{featuredCount}</span> davon mit eigener Röntgen-Tiefe.
            Strukturplanung als Dialog seit{' '}
            <span className="text-accent">{yearsActive} Jahren</span>,{' '}
            <span className="text-accent">{vortraegeCount} Vorträgen</span> auf{' '}
            <span className="text-accent">drei Kontinenten</span>.
          </p>
        </div>

        {/* ── Standorte with live local time ────────────────────────── */}
        <div className="md:col-span-3">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Standorte
          </p>
          <ul className="mt-s3 space-y-s2 text-body-s text-bone">
            {standorte.map((s, i) => (
              <li key={s.city} className="flex items-baseline justify-between gap-s2">
                <span>
                  <span className="text-bone">{s.city}</span>
                  <span className="ml-s2 font-mono text-caption uppercase tracking-caption text-bone-muted">
                    · {s.role}
                  </span>
                </span>
                <span key={`tick-${i}-${tick}`} className="font-mono text-caption text-bone-faint">
                  {formatLocalTime(s.tz)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Sitemap ──────────────────────────────────────────────── */}
        <div className="md:col-span-3">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Navigation
          </p>
          <ul className="mt-s3 grid grid-cols-2 gap-x-s4 gap-y-s2 font-mono text-caption uppercase tracking-caption text-bone-muted">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-cursor="link"
                  className="transition-colors duration-hover ease-cinematic hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {footerLegal.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-cursor="link"
                  className="transition-colors duration-hover ease-cinematic hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-s7 flex max-w-[1400px] flex-col gap-s3 border-t border-border-subtle pt-s4 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
          © {brand.founded}–2026 {brand.legalName} · {brand.address.street} · {brand.address.zip}{' '}
          {brand.address.city}
        </p>
        <Link
          to="/kontakt"
          data-cursor="link"
          data-magnetic
          className="inline-flex items-center gap-s2 font-mono text-caption uppercase tracking-caption text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
        >
          Briefing starten <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { brand } from '@/content/brand';
import { standorte } from '@/content/standorte';
import { footerLegal, primaryNav } from '@/content/nav';

/**
 * Footer — Pitch-v1 stub.
 * Polished live-counter + spatial-audio block lands in W8.
 */
export function Footer() {
  return (
    <footer className="mt-s9 border-t border-border-subtle px-s4 py-s7 sm:px-s5">
      <div className="grid gap-s6 md:grid-cols-12">
        {/* Live counter stub */}
        <div className="md:col-span-6">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Live · stand 2026
          </p>
          <p className="mt-s3 font-display text-3xl tracking-tight text-bone md:text-4xl">
            Aktuell planen wir in <span className="text-accent">4 Städten</span>,{' '}
            <span className="text-accent">12 Projekten</span> und mediieren{' '}
            <span className="text-accent">37 Stakeholder-Konflikte</span>.
          </p>
          <p className="mt-s3 text-body-s text-bone-muted">
            Counter-Animationen wandern hier in Woche 8 ein.
          </p>
        </div>

        {/* Standorte */}
        <div className="md:col-span-3">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Standorte
          </p>
          <ul className="mt-s3 space-y-s2 text-body-s text-bone">
            {standorte.map((s) => (
              <li key={s.city}>
                <span className="text-bone">{s.city}</span>
                <span className="ml-s2 text-bone-muted">· {s.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sitemap + legal */}
        <div className="md:col-span-3">
          <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
            Navigation
          </p>
          <ul className="mt-s3 grid grid-cols-2 gap-x-s4 gap-y-s2 text-body-s text-bone-muted">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
            {footerLegal.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-s7 flex flex-col gap-s2 border-t border-border-subtle pt-s4 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
          © {brand.founded}–2026 {brand.legalName}
        </p>
        <p className="font-mono text-caption uppercase tracking-caption text-bone-faint">
          {brand.address.street} · {brand.address.zip} {brand.address.city}
        </p>
      </div>
    </footer>
  );
}

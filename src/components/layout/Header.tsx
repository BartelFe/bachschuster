import { Link, NavLink } from 'react-router-dom';
import { brand } from '@/content/brand';
import { primaryNav } from '@/content/nav';
import { cn } from '@/lib/cn';
import { SoundToggle } from '@/components/sound';

/**
 * Minimal editorial header. Fixed top, transparent-over-content.
 * Sound toggle slot is reserved (right of nav) — wired in W1 Block 3.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-s4 py-s3 sm:px-s5 sm:py-s4">
        <Link
          to="/"
          data-magnetic
          data-cursor="link"
          aria-label={`${brand.name} — zur Startseite`}
          className="font-display text-lg tracking-tight text-bone transition-colors duration-hover ease-cinematic hover:text-accent"
        >
          {brand.shortName}
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-s4 font-mono text-caption uppercase tracking-caption text-bone-muted">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  data-cursor="link"
                  className={({ isActive }) =>
                    cn(
                      'transition-colors duration-hover ease-cinematic hover:text-bone',
                      isActive && 'text-bone',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-s3">
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}

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
                      // Accent underline on active route, soft bone underline on hover.
                      // The colour-shift alone (text-bone) was too subtle in dark mode
                      // and the active route blended into hover state. (W15 audit-fix.)
                      'relative pb-[2px] transition-colors duration-hover ease-cinematic',
                      'after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-hover after:ease-cinematic',
                      isActive
                        ? 'text-bone after:scale-x-100 after:bg-accent'
                        : 'hover:text-bone hover:after:scale-x-100 hover:after:bg-bone-faint',
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

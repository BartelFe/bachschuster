import { useEffect } from 'react';
import { brand } from '@/content/brand';

/**
 * Per-route document meta. Sets `<title>`, `<meta name=description>`,
 * canonical link, and Open Graph + Twitter Card meta tags. React 19 is
 * supposed to land first-class meta support, but we're on 18 — so we mutate
 * the document head ourselves on mount + restore on unmount.
 *
 * The site's `index.html` ships sensible defaults; this hook augments them
 * per route so search engines and link-share previews see route-specific
 * copy ("Werke · 18 Projekte" rather than the home title on every page).
 *
 * Usage:
 *   useDocumentMeta({
 *     title: 'Werke',
 *     description: '...',
 *   });
 */

const SITE = 'https://bachschuster.vercel.app';

export interface DocumentMeta {
  /** Will be composed as `${title} — ${brand.name}`. Pass null to keep default. */
  title?: string | null;
  /** Plain-text description, ~150 chars. */
  description?: string;
  /** OG image absolute URL. Defaults to /og.svg in repo. */
  ogImage?: string;
  /** Override Open Graph type. Default 'website'. */
  ogType?: 'website' | 'article' | 'profile';
}

/** Build the final `<title>` string. */
function composeTitle(title: string | null | undefined): string {
  if (!title) return `${brand.name} — ${brand.claim}`;
  return `${title} — ${brand.name}`;
}

/**
 * Ensures a `<meta name=foo>` or `<meta property=foo>` tag exists in the head
 * with the given content. Returns a restorer that resets to the previous
 * value (or removes the tag if it didn't exist before).
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): () => void {
  if (typeof document === 'undefined') return () => undefined;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  const created = !el;
  const previousContent = el?.getAttribute('content') ?? null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return () => {
    if (created) {
      el?.remove();
    } else if (previousContent != null) {
      el?.setAttribute('content', previousContent);
    }
  };
}

/** Manages the canonical link tag — sets it to `${SITE}${pathname}`. */
function setCanonical(pathname: string): () => void {
  if (typeof document === 'undefined') return () => undefined;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const created = !el;
  const previous = el?.getAttribute('href') ?? null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', `${SITE}${pathname}`);
  return () => {
    if (created) {
      el?.remove();
    } else if (previous != null) {
      el?.setAttribute('href', previous);
    }
  };
}

export function useDocumentMeta(meta: DocumentMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = composeTitle(meta.title);

    const restorers: Array<() => void> = [
      () => {
        document.title = previousTitle;
      },
    ];

    if (meta.description) {
      restorers.push(setMetaTag('name', 'description', meta.description));
      restorers.push(setMetaTag('property', 'og:description', meta.description));
      restorers.push(setMetaTag('name', 'twitter:description', meta.description));
    }

    restorers.push(setMetaTag('property', 'og:title', composeTitle(meta.title)));
    restorers.push(setMetaTag('name', 'twitter:title', composeTitle(meta.title)));
    restorers.push(setMetaTag('property', 'og:type', meta.ogType ?? 'website'));
    restorers.push(setMetaTag('name', 'twitter:card', 'summary_large_image'));

    const og = meta.ogImage ?? `${SITE}/og.svg`;
    restorers.push(setMetaTag('property', 'og:image', og));
    restorers.push(setMetaTag('name', 'twitter:image', og));

    restorers.push(setMetaTag('property', 'og:url', `${SITE}${window.location.pathname}`));
    restorers.push(setCanonical(window.location.pathname));

    return () => {
      restorers.forEach((r) => r());
    };
  }, [meta.title, meta.description, meta.ogImage, meta.ogType]);
}

/* ── Per-route meta tables ─────────────────────────────────────────── */

/**
 * Canonical meta for the 11 stable routes. The deep-dive route (`/werke/:slug`)
 * builds its meta dynamically from project content in `WerkPage` itself.
 */
export const ROUTE_META: Record<string, DocumentMeta> = {
  '/': {
    title: null, // home keeps the default site title
    description:
      'Bachschuster Architektur: Strukturplanung als Methode vor Architektur. Ingolstadt · Shanghai · Johannesburg · Linz. Seit 1993.',
  },
  '/methode': {
    title: 'Methode',
    description:
      'Strukturplanung als Methode vor Stadtplanung und Architektur. Fünf Stakeholder, drei Modi — von Chaos über Mediation zu Struktur.',
  },
  '/werke': {
    title: 'Werke · 18 Projekte',
    description:
      'WestPark Verbindungssteg, Pavillon EXPO Shanghai 2010, Mobility Hub Ingolstadt, Sen Friedenszentrum, VW Hope Academy — Strukturplanung in gebauter Form.',
  },
  '/netzwerk': {
    title: 'Netzwerk · 04 Standorte',
    description:
      'Ingolstadt · Shanghai · Johannesburg · Linz. Drei Kontinente, ein Methodenkern — geführt aus dem Hauptsitz Ingolstadt.',
  },
  '/stimmen': {
    title: 'Stimmen · 29 Vorträge',
    description:
      'Sechzehn Jahre Strukturplanung auf der Bühne — Vorträge, Workshops und Konferenz-Beiträge auf drei Kontinenten.',
  },
  '/team': {
    title: 'Team · Peter Bachschuster',
    description:
      'Sechs Personen, eine Methode. Geführt von Peter Bachschuster — Architekt, Stadtplaner und Erfinder der Strukturplanung.',
    ogType: 'profile',
  },
  '/kontakt': {
    title: 'Kontakt · Briefing-Wizard',
    description:
      'Fünf kurze Fragen — am Ende sind Sie einen Klick vom Senden entfernt. Wir antworten innerhalb eines Werktags.',
  },
  '/impressum': {
    title: 'Impressum',
    description: 'Impressum der Bachschuster Architektur GmbH, Ingolstadt.',
  },
  '/datenschutz': {
    title: 'Datenschutz',
    description: 'Datenschutzerklärung der Bachschuster Architektur GmbH.',
  },
};

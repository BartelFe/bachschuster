/**
 * Bachschuster office locations — mirrors master prompt § 6.4.
 *
 * Beyond the four base fields (city, country, role, coordinates) the W7
 * Globe deep dive needs:
 *  · `tz`   — IANA timezone for live local-time display in the side panel
 *  · `kind` — Hauptsitz | operations | partner, drives pin emphasis + the
 *             "Hauptsitz · alle anderen" arc topology in the globe scene
 *  · `summary` — one editorial sentence shown on hover / panel select
 *  · `since`  — year the office opened, for the panel detail block
 */

export type StandortKind = 'hauptsitz' | 'operations' | 'partner';

export interface Standort {
  city: string;
  country: string;
  role: string;
  lat: number;
  lng: number;
  tz: string;
  kind: StandortKind;
  summary: string;
  since: number;
}

export const standorte: Standort[] = [
  {
    city: 'Ingolstadt',
    country: 'Deutschland',
    role: 'Hauptsitz',
    lat: 48.7665,
    lng: 11.4258,
    tz: 'Europe/Berlin',
    kind: 'hauptsitz',
    since: 1993,
    summary:
      'Wo die Strukturplanung 1993 erfunden wurde — und wo bis heute jede Auftrags­linie zusammen­läuft.',
  },
  {
    city: 'Shanghai',
    country: 'China',
    role: 'Asien-Operations',
    lat: 31.2304,
    lng: 121.4737,
    tz: 'Asia/Shanghai',
    kind: 'operations',
    since: 2008,
    summary:
      'Pavillon EXPO 2010, Chongming, Shandong — Asien-Operationen seit 2008, dauerhaftes Büro seit dem EXPO-Jahr.',
  },
  {
    city: 'Johannesburg',
    country: 'Südafrika',
    role: 'Afrika-Operations',
    lat: -26.2041,
    lng: 28.0473,
    tz: 'Africa/Johannesburg',
    kind: 'operations',
    since: 2006,
    summary:
      'VW Hope Academy + iiRD-Pilotprojekte — Afrika-Operationen seit der Pretoria-Mandat-Phase 2006.',
  },
  {
    city: 'Linz',
    country: 'Österreich',
    role: 'DACH-Partner',
    lat: 48.3069,
    lng: 14.2858,
    tz: 'Europe/Vienna',
    kind: 'partner',
    since: 2015,
    summary:
      'Partner­büro Linz — gemeinsame Mandate im DACH-Raum, vor allem Donau-Korridor und österreichische Smart-City-Initiativen.',
  },
];

export const HAUPTSITZ_SLUG = 'ingolstadt';

/**
 * Format the current time at a given timezone with `de-DE` locale, 24-hour.
 * Used by the side panel ticker (updates every minute on mount).
 */
export function formatLocalTime(tz: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  }).format(date);
}

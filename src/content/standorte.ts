/** Bachschuster office locations — mirrors master prompt § 6.4. */
export const standorte = [
  {
    city: 'Ingolstadt',
    country: 'Deutschland',
    role: 'Hauptsitz',
    lat: 48.7665,
    lng: 11.4258,
    tz: 'Europe/Berlin',
  },
  {
    city: 'Shanghai',
    country: 'China',
    role: 'Asien-Operations',
    lat: 31.2304,
    lng: 121.4737,
    tz: 'Asia/Shanghai',
  },
  {
    city: 'Johannesburg',
    country: 'Südafrika',
    role: 'Afrika-Operations',
    lat: -26.2041,
    lng: 28.0473,
    tz: 'Africa/Johannesburg',
  },
  {
    city: 'Linz',
    country: 'Österreich',
    role: 'DACH-Partner',
    lat: 48.3069,
    lng: 14.2858,
    tz: 'Europe/Vienna',
  },
] as const;

export type Standort = (typeof standorte)[number];

/**
 * Stimmen — Vorträge / Publikationen / Awards / Jury content.
 *
 * Vorträge sourced from `bachschuster.de/profil` (Vorträge tab), provided by
 * Felix 2026-05-16. 31 talks across 17 years (2007–2023), 7 countries, three
 * continents — material for the master prompt §6.6 stub and the editorial
 * Stimmen-page timeline.
 *
 * Publikationen / Jury / Awards: no canonical source available at pitch time
 * — sections render an editorial "in Vorbereitung" notice until Felix sources
 * the data. The structure is here so wiring up later is a one-line content
 * append.
 */

export type Region = 'deutschland' | 'europa' | 'asien' | 'afrika' | 'global';

export interface Vortrag {
  /** ISO date string (yyyy-mm-dd) or yyyy when day-precision missing. */
  date: string;
  /** Display year (cached so timeline grouping doesn't reparse). */
  year: number;
  city: string;
  /**
   * Country of the **venue** (where the talk actually took place), NOT the
   * audience's home country. Talks held in Ingolstadt before a foreign
   * delegation stay `Deutschland` — record the delegation's origin in
   * `venue` if it's worth surfacing.
   */
  country: string;
  /** Geographic region for filter chips. */
  region: Region;
  /** Hosting institution / event. */
  venue?: string;
  /** Title or topic, German verbatim where given. */
  title: string;
  /** Short thematic tag for sub-grouping. */
  topic:
    | 'strukturplanung'
    | 'mobilitaet'
    | 'klima-energie'
    | 'china-asien'
    | 'standortentwicklung'
    | 'architektur-innovation';
}

const REGION_BY_COUNTRY: Record<string, Region> = {
  Deutschland: 'deutschland',
  Österreich: 'europa',
  Irland: 'europa',
  Türkei: 'europa',
  Großbritannien: 'europa',
  Georgien: 'asien',
  China: 'asien',
  Indien: 'asien',
  Kambodscha: 'asien',
  Portugal: 'europa',
};

function r(country: string): Region {
  return REGION_BY_COUNTRY[country] ?? 'global';
}

/** Vorträge — newest first, derived from the bachschuster.de Vorträge tab. */
export const vortraege: Vortrag[] = [
  {
    date: '2023-11-16',
    year: 2023,
    city: 'Erlenbach',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Workshop',
    title:
      'Transformationsregion Neckarsulm-Erlenbach: Strukturplanung für ein innovatives Wohn- und Gewerbegebiet Erlenbach',
    topic: 'strukturplanung',
  },
  {
    date: '2021-09-21',
    year: 2021,
    city: 'Heilbronn',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'TUM Heilbronn',
    title: 'Strukturplanung – Heilbronn als richtungsweisender Zukunftscampus',
    topic: 'strukturplanung',
  },
  {
    date: '2018',
    year: 2018,
    city: 'Dublin',
    country: 'Irland',
    region: r('Irland'),
    title:
      'Neue (wissenschaftliche) Herangehensweisen zur wirtschaftlich und planerischen optimierten Entwicklung von Universitäts­campusse',
    topic: 'standortentwicklung',
  },
  {
    date: '2017-07-21',
    year: 2017,
    city: 'Tiflis',
    country: 'Georgien',
    region: r('Georgien'),
    title: 'Structure planning approach for Kutaisi University Complex',
    topic: 'strukturplanung',
  },
  {
    date: '2017-02-21',
    year: 2017,
    city: 'Kaprun',
    country: 'Österreich',
    region: r('Österreich'),
    venue: 'Steuerungsausschuss',
    title: 'Ortsgestaltungs- und Strukturkonzept · Situationsanalyse',
    topic: 'strukturplanung',
  },
  {
    date: '2017-02-16',
    year: 2017,
    city: 'Augsburg',
    country: 'Deutschland',
    region: r('Deutschland'),
    title:
      'Nachhaltige städtebauliche Entwicklungs­konzepte zur erfolgreichen Wirtschaftsansiedlung — Wirtschaftsstandort China, Provinz Shandong, Stadt Jinan, Bezirk Tianqiao',
    topic: 'china-asien',
  },
  {
    date: '2015-10-19',
    year: 2015,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: '1. Bayerischer China Kongress',
    title: 'Architektur und mehr — erfolgreich in China',
    topic: 'china-asien',
  },
  {
    date: '2015-08-22',
    year: 2015,
    city: 'Phnom Penh',
    country: 'Kambodscha',
    region: r('Kambodscha'),
    venue: 'Chemiecluster Bayern / Bayern International',
    title:
      'Standort­entwicklung und Strukturplanung von Industrie- und Gewerbeparks mit integrierter Stadtentwicklung',
    topic: 'standortentwicklung',
  },
  {
    date: '2015-01-28',
    year: 2015,
    city: 'Berlin',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Außenministerium · Außenwirtschaftstag',
    title: 'Architektur, Planen und Bauen — Nachhaltigkeit in China',
    topic: 'china-asien',
  },
  {
    date: '2014-11-03',
    year: 2014,
    city: 'Ankara',
    country: 'Türkei',
    region: r('Türkei'),
    venue: 'Internationale Konferenz',
    title: 'Nachhaltige Entwicklung von Industriegebieten · Mobilität und Stadtplanung',
    topic: 'mobilitaet',
  },
  {
    date: '2013-09-19',
    year: 2013,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Technische Hochschule Ingolstadt',
    title: 'Städtebauliche Gestaltung der Zukunft — Die Antwort auf die mobile Gesellschaft',
    topic: 'mobilitaet',
  },
  {
    date: '2013-06-05',
    year: 2013,
    city: 'London',
    country: 'Großbritannien',
    region: r('Großbritannien'),
    venue: 'Unternehmer­reise des Bayerischen Wirtschafts­ministeriums · Siemens Crystal',
    title: 'Urbane Architektur und Mobilität',
    topic: 'mobilitaet',
  },
  {
    date: '2012-06-28',
    year: 2012,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'P3 Ingenieur­gesellschaft',
    title: 'Projekt­bearbeitung mit Verantwortung',
    topic: 'architektur-innovation',
  },
  {
    date: '2012-03-27',
    year: 2012,
    city: 'Garching',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'TU München · Vortragsreihe Mobilität',
    title: 'Städtebauliche Gestaltung der Zukunft — Antwort auf die mobile Gesellschaft',
    topic: 'mobilitaet',
  },
  {
    date: '2011-05-10',
    year: 2011,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Rotary Club Ingolstadt',
    title:
      'Pavillon of Innovations — Entwurf, Design und Umsetzung für die Welt­ausstellung EXPO Shanghai',
    topic: 'architektur-innovation',
  },
  {
    date: '2010-01-28',
    year: 2010,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Donaukurier · Stadttheater (H. Langer)',
    title: 'Visionen für Ingolstadt',
    topic: 'standortentwicklung',
  },
  {
    date: '2009-06-23',
    year: 2009,
    city: 'Coburg',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Fachhochschule Coburg · Fakultät Design · Dienstagsreihe „Raumnot"',
    title: 'Strukturplanung für Unternehmen, Städte und Kommunen',
    topic: 'strukturplanung',
  },
  {
    date: '2009-05-26',
    year: 2009,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'AHK Portugal · Portugiesische Delegation',
    title: 'Innovatives Hightech-Gebäude mit richtungsweisender Energietechnik',
    topic: 'klima-energie',
  },
  {
    date: '2009-04-16',
    year: 2009,
    city: 'Innsbruck',
    country: 'Österreich',
    region: r('Österreich'),
    venue: 'Expertenforum',
    title: 'Klimawandel fordert Baukonzepte — Heizen und Kühlen mit Beton',
    topic: 'klima-energie',
  },
  {
    date: '2009-01-15',
    year: 2009,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Delegation aus Pune (Indien)',
    title:
      'Innovatives Hightech Büro- und Produktions­gebäude mit richtungs­weisender Energietechnik',
    topic: 'klima-energie',
  },
  {
    date: '2009-01-13',
    year: 2009,
    city: 'München',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Baumesse · Bundesverband Solar',
    title: 'Praktische Herausforderungen beim Einsatz von Photovoltaik in der Gebäudehülle',
    topic: 'klima-energie',
  },
  {
    date: '2007-11-30',
    year: 2007,
    city: 'Pune',
    country: 'Indien',
    region: r('Indien'),
    venue: 'Constro 2007',
    title:
      'Integration von Energie­systemen in der Architektur und der Strukturplanung — städtebauliche, zukunfts­orientierte Stadtentwicklung',
    topic: 'strukturplanung',
  },
  {
    date: '2007-10-17',
    year: 2007,
    city: 'München',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Münchener Diskussionsforum · Klimaherbst',
    title: 'Herausforderung Klimawandel · Hightech-Gebäude alkiTechnik (Ingolstadt)',
    topic: 'klima-energie',
  },
  {
    date: '2007-10-08',
    year: 2007,
    city: 'München',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Expo Real',
    title: 'Innovative, richtungs­weisende, nachhaltige Architektur und Stadtplanung',
    topic: 'architektur-innovation',
  },
  {
    date: '2007-09-28',
    year: 2007,
    city: 'Augsburg',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Renexpo',
    title: 'Solarenergie und energie­effiziente Gebäude',
    topic: 'klima-energie',
  },
  {
    date: '2007-03-07',
    year: 2007,
    city: 'Thierhaupten',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Schule für Land- und Dorfentwicklung',
    title: 'Strukturentwicklung und Bestands­pflege durch aktive Zukunfts­gestaltung',
    topic: 'strukturplanung',
  },
  {
    date: '2007-03-06',
    year: 2007,
    city: 'Augsburg',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Bayerisches Landesamt für Umweltschutz',
    title: 'Strukturplanung · Flächen sparen am Beispiel der Fa. Rieter in Ingolstadt',
    topic: 'strukturplanung',
  },
  {
    date: '2007-01-29',
    year: 2007,
    city: 'Ingolstadt',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Bau- und Immobilien­messe',
    title: 'Architektur — Innovation',
    topic: 'architektur-innovation',
  },
  {
    date: '2007-01-17',
    year: 2007,
    city: 'Berlin',
    country: 'Deutschland',
    region: r('Deutschland'),
    venue: 'Bundesverband Solar',
    title: 'Innovatives Hightech Büro- und Produktions­gebäude der Firma alkiTechnik',
    topic: 'klima-energie',
  },
];

export const TOPIC_LABEL: Record<Vortrag['topic'], string> = {
  strukturplanung: 'Strukturplanung',
  mobilitaet: 'Mobilität',
  'klima-energie': 'Klima & Energie',
  'china-asien': 'China · Asien',
  standortentwicklung: 'Standortentwicklung',
  'architektur-innovation': 'Architektur · Innovation',
};

export const REGION_LABEL: Record<Region, string> = {
  deutschland: 'Deutschland',
  europa: 'Europa',
  asien: 'Asien',
  afrika: 'Afrika',
  global: 'Welt',
};

export const REGION_FILTERS: Array<{ id: Region | 'all'; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'deutschland', label: 'Deutschland' },
  { id: 'europa', label: 'Europa' },
  { id: 'asien', label: 'Asien' },
];

/** Count vortraege per region — used for filter chip badges. */
export function vortraegeCounts(): Record<Region | 'all', number> {
  const map: Record<Region | 'all', number> = {
    all: vortraege.length,
    deutschland: 0,
    europa: 0,
    asien: 0,
    afrika: 0,
    global: 0,
  };
  for (const v of vortraege) map[v.region] += 1;
  return map;
}

/**
 * Group vortraege by year (descending), preserving inner order.
 */
export function vortraegeByYear(): Array<{ year: number; items: Vortrag[] }> {
  const map = new Map<number, Vortrag[]>();
  for (const v of vortraege) {
    const arr = map.get(v.year) ?? [];
    arr.push(v);
    map.set(v.year, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Publikationen + Jury + Awards — empty until Felix sources them.           */
/* ───────────────────────────────────────────────────────────────────────── */

export interface Publikation {
  year: number;
  title: string;
  venue: string;
  url?: string;
}

export const publikationen: Publikation[] = [];

export interface JuryEntry {
  year: number;
  title: string;
  institution: string;
}

export const jury: JuryEntry[] = [];

export interface Award {
  year: number;
  title: string;
  category?: string;
}

export const awards: Award[] = [];

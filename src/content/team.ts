/**
 * Team content — names, roles, and SVG-portrait visual parameters.
 *
 * The six members come from the team composite photo Felix put at
 * `public/teamfoto.avif` (identified 2026-05-16). Rather than crop the photo
 * into circular portraits — which would feel inconsistent with the rest of
 * the site's hand-drawn editorial diagrams — each member gets a stylised
 * SVG portrait derived from observable features: hair tone & shape, glasses,
 * dominant outfit colour. The result reads as "we made this for you" rather
 * than "we found a photo".
 *
 * Peter Bachschuster's bio combines:
 *  · the bachschuster.de/profil narrative (Shanghai 2010 trip)
 *  · the Ewald-Kluge grandfather heritage (Ewald-Kluge-Straße is named
 *    after his grandfather, an Auto-Union motorcycle racer)
 *  · existing master prompt §6.5 copy
 */

export type Hair =
  | 'short-blonde'
  | 'short-balding'
  | 'long-blonde'
  | 'long-brown'
  | 'short-grey'
  | 'long-brown-bangs';
export type Outfit = 'accent' | 'cyan' | 'environment' | 'citizens' | 'bone' | 'dark';

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Short editorial line — what they bring. */
  brief?: string;
  /** Optional discipline tag in mono caption. */
  discipline?: string;
  /** SVG portrait params. */
  portrait: {
    hair: Hair;
    glasses: boolean;
    outfit: Outfit;
    /** Background tile colour matching the moss-wall studio photo. */
    backdrop: 'moss' | 'paper' | 'sky';
  };
}

export const principal = {
  slug: 'peter-bachschuster',
  name: 'Peter Bachschuster',
  role: 'Gründer · Geschäftsführer · Architekt',
  shortBio:
    'Architekt und Stadtplaner. Erfinder der Strukturplanung. Seit 1993 international tätig.',
  longBio: [
    'Mit nichts als dem puren Willen, lernen zu wollen, setzte er sich 2010 in den Flieger nach Shanghai — um in einer der dichtbesiedeltsten und sich rasant entwickelnden Welt-Metropolen Neues zu wagen. Das damals eröffnete Asien-Büro ist heute fester Bestandteil des Netzwerks.',
    'Heimat bleibt Ingolstadt. Hier trägt jedes Projekt die typische Bachschuster-Handschrift: konstruktiv genau, energetisch ehrgeizig, sozial wach. Moderator und Berater für Städte, Kommunen, Unternehmen, Banken und Institute in komplexen Standort- und Planungs­situationen — international referenziert in China, Indien, Südafrika, Brasilien.',
    'Mitgründer des iiRD (Institut für interdisziplinäre Regional­entwicklung) zusammen mit TUM Heilbronn — weltweit erstes Institut für ganz­heitliche Planung von Städten, Regionen und Unternehmen als sozio­ökonomische Funktion.',
  ],
  heritage: {
    title: 'Ewald Kluge',
    body: 'Die Ingolstädter Ewald-Kluge-Straße trägt den Namen seines Großvaters — einer der bedeutendsten und erfolgreichsten Motorrad-Renn­fahrer für die Auto Union. Peter Bachschuster ist Ehren­mitglied des Ewald Kluge Weixdorf e. V.',
  },
  portrait: {
    hair: 'short-balding' as Hair,
    glasses: true,
    outfit: 'environment' as Outfit, // green polo in photo
    backdrop: 'moss' as const,
  },
};

export const team: TeamMember[] = [
  {
    slug: 'ines-wechsler',
    name: 'Ines Wechsler',
    role: 'Assistenz Peter Bachschuster',
    discipline: 'Office Management',
    brief:
      'Hält die Schnitt­stelle zwischen Geschäfts­führung, Klienten und Standorten in Echtzeit zusammen.',
    portrait: {
      hair: 'short-blonde',
      glasses: true,
      outfit: 'dark',
      backdrop: 'moss',
    },
  },
  {
    slug: 'brigitte-rudolph',
    name: 'Brigitte Rudolph',
    role: 'Bürokoordination',
    discipline: 'Office Coordination',
    brief:
      'Verträge, Termine, Logistik, Reisen — der operative Takt des Büros läuft über ihren Schreibtisch.',
    portrait: {
      hair: 'long-blonde',
      glasses: false,
      outfit: 'bone',
      backdrop: 'moss',
    },
  },
  {
    slug: 'vera-haerter',
    name: 'Vera Härter',
    role: 'B.A. Innenarchitektur',
    discipline: 'Interior Architecture',
    brief:
      'Material, Licht, Programm — die Innensicht der Bachschuster-Räume und ihre Detailauflösung.',
    portrait: {
      hair: 'long-brown-bangs',
      glasses: false,
      outfit: 'dark',
      backdrop: 'moss',
    },
  },
  {
    slug: 'melanie-friedrich',
    name: 'Melanie Friedrich',
    role: 'M.Sc. Stadtplanung · Strukturplanung',
    discipline: 'Urban Planning · Strukturplanung',
    brief:
      'Strukturplanung als operative Methode — Workshops, Stakeholder-Karten, Bebauungs­strategien.',
    portrait: {
      hair: 'long-brown',
      glasses: false,
      outfit: 'accent', // orange dress
      backdrop: 'moss',
    },
  },
  {
    slug: 'margarete-wochnik',
    name: 'Margarete Wochnik',
    role: 'Dipl.-Ing. (TU) · Bauwesen',
    discipline: 'Civil Engineering · Bauwesen',
    brief:
      'Konstruktion, Statik, Bauphysik — die rechnerische Achse zwischen Entwurf und Realisierbarkeit.',
    portrait: {
      hair: 'short-grey',
      glasses: false,
      outfit: 'bone',
      backdrop: 'moss',
    },
  },
];

/** All team slugs in display order — Principal first, then the team. */
export function allMemberSlugs(): string[] {
  return [principal.slug, ...team.map((m) => m.slug)];
}

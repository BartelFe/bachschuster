/** Brand constants — single source of truth, mirrors master prompt § 6.1. */
export const brand = {
  name: 'Bachschuster Architektur',
  shortName: 'Bachschuster',
  claim: 'Vor dem Gebäude, das System.',
  claimAlt: 'Wir entwerfen das Unsichtbare zuerst.',
  manifesto: 'Das Bestmögliche tun und das Unmögliche denken.',
  methodeSlogan: 'Strukturplanung heißt Schritte gehen, nicht nur Schritte reden.',
  founded: 1993,
  yearsActive: 32,
  legalName: 'Bachschuster Architektur GmbH',
  address: {
    street: 'Brodmühlweg 4',
    zip: '85049',
    city: 'Ingolstadt',
    country: 'Deutschland',
  },
  phone: '+49 841 938 33 00',
  email: 'info@bachschuster.de',
} as const;

export type Brand = typeof brand;

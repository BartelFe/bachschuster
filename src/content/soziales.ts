/**
 * Soziales Engagement — sources: bachschuster.de/profil (Soziales tab).
 *
 * Two strands:
 *  · Victory Kindergarten Ukunda (Kenia) — Partnerschaft mit Rotary Club
 *    Ingolstadt-Kreuztor, Bildungs- und Versorgungs­projekt.
 *  · Ewald Kluge Weixdorf e.V. — Ehrenmitgliedschaft, Erbe des Großvaters
 *    Ewald Kluge, einer der erfolgreichsten Auto-Union-Motorrad­renn­fahrer.
 *
 * Both render on the Team-page Soziales-Block, the Victory project is the
 * lead because it ties to the firm's brand of Strukturplanung — "Wir gehen
 * dorthin, wo die Menschen sind."
 */

export interface SozialesEntry {
  slug: string;
  title: string;
  subtitle?: string;
  /** One-line label shown above the title in mono caption. */
  pretitle: string;
  /** Editorial body, ~80 words. */
  body: string;
  /** Pull-quote sourced from the project. */
  pullQuote?: string;
  /** Optional partner organisation. */
  partner?: string;
  /** Optional location. */
  location?: string;
}

export const sozialesEntries: SozialesEntry[] = [
  {
    slug: 'victory-kindergarten-ukunda',
    title: 'Victory',
    subtitle: 'Ein Kindergarten mit Schul­betrieb für Ukunda',
    pretitle: 'Soziales Engagement · Kenia',
    body: 'Ukunda, eine Küstenstadt in Kenia. Armut nimmt vielen Kindern den Zugang zu Bildung und einfachster Versorgung. In Partnerschaft mit dem Rotary Club Ingolstadt-Kreuztor entsteht hier ein Kindergarten mit angeschlossenem Schul­betrieb — finanziert, geplant und begleitet aus Ingolstadt.',
    pullQuote:
      'Menschen dort zu helfen, wo sie leben — um nicht dorthin flüchten zu müssen, wo ein vermeintlich besseres Leben auf sie wartet.',
    partner: 'Rotary Club Ingolstadt-Kreuztor',
    location: 'Ukunda, Kenia',
  },
  {
    slug: 'ewald-kluge-weixdorf',
    title: 'Ewald Kluge Weixdorf e. V.',
    pretitle: 'Familien-Erbe · Sachsen',
    body: 'Peter Bachschuster ist Ehren­mitglied des Ewald Kluge Weixdorf e. V. — zur Pflege des Andenkens an seinen Großvater Ewald Kluge, einer der berühmtesten Motorrad-Renn­fahrer der Welt und Werksfahrer der Auto Union. In Ingolstadt trägt eine Straße seinen Namen.',
    location: 'Weixdorf · Ingolstadt',
  },
];

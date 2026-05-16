import { PageScaffold } from '@/components/layout/PageScaffold';
import { useDocumentMeta, ROUTE_META } from '@/lib/meta';

/**
 * Datenschutz — DSGVO-Erklärung. Pitch v1 statement: no third-party
 * trackers, no analytics, no marketing cookies. The Kontakt wizard's
 * mailto: hand-off means no form data ever touches a server. The only
 * persisted client-side state is `sessionStorage.bs-loaded` (loader
 * once-per-tab flag) — not personal data under DSGVO Art. 4 Nr. 1.
 */
export default function DatenschutzPage() {
  useDocumentMeta(ROUTE_META['/datenschutz']!);

  return (
    <PageScaffold
      pretitle="Datenschutz · DSGVO"
      title="Verarbeitung personen­bezogener Daten"
      subtitle="Diese Pitch-Site setzt keine Analyse-Cookies, keine Werbe-Tracker und keine externen Drittanbieter-Skripte. Das Kontakt-Briefing übergibt direkt an Ihr Mail-Programm — Formular­daten verlassen Ihren Browser nicht über uns. Einziger client-seitiger Zustand: sessionStorage-Flag für die Lade-Animation. Vollständige DSGVO-Erklärung wird vor öffentlicher Schaltung ergänzt."
    />
  );
}

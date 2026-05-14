import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { PageScaffold } from '@/components/layout/PageScaffold';

export default function NotFoundPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 404;

  return (
    <PageScaffold
      pretitle={`Fehler · ${status}`}
      title="Diese Sektion existiert nicht."
      subtitle="Wir entwerfen das Unsichtbare zuerst — aber diese Seite war nicht im Plan."
    >
      <div className="mt-s5">
        <Link
          to="/"
          className="inline-block border-l-2 border-accent pl-s3 font-mono text-data-label uppercase tracking-data text-accent transition-colors duration-hover hover:text-accent-glow"
        >
          ← Zurück zum Hero
        </Link>
      </div>
    </PageScaffold>
  );
}

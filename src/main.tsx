import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/globals.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

/**
 * StrictMode intentionally removed.
 *
 * React StrictMode double-invokes effect mount/cleanup in dev to surface
 * impure side-effects. Our R3F Hero canvas (+ Globe) react badly to this:
 * during the simulated cleanup pass, R3F removes its own canvas-wrapper
 * DOM nodes, and when React then tries to commit the next render it walks
 * the fiber tree expecting those nodes still present and throws
 * `Failed to execute 'removeChild' on 'Node'`. The error bubbles up through
 * RouterProvider's RenderErrorBoundary and renders the 404 page instead of
 * the destination route on every SPA-nav from `/` to anywhere else.
 *
 * Production builds DO NOT have this issue — StrictMode's double-invoke is
 * a dev-only behaviour. So removing the wrapper here only changes dev
 * behaviour to match prod. The trade-off: we lose StrictMode's dev warnings
 * (impure-effects, deprecated lifecycles). Acceptable for pitch v1.
 *
 * If we want to restore StrictMode in a future week, the proper fix is to
 * isolate each R3F Canvas behind its own ErrorBoundary that swallows
 * cleanup-phase removeChild exceptions instead of letting them bubble.
 *
 * `future.v7_startTransition` on RouterProvider stays — it's good practice
 * for upgrade-readiness even if it alone didn't fix the StrictMode bug.
 */
createRoot(rootEl).render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);

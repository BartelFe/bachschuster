import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Optional fallback shown on render-phase error. */
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Localised error boundary for R3F-wrapping subtrees.
 *
 * Why we need this: when navigating from a route that contains an R3F
 * Canvas (Hero, Globe) to any other route, the Canvas's WebGL context
 * cleanup races with React's fiber reconciler. React tries to call
 * `removeChild` on a DOM node that the Canvas has already removed itself,
 * and an exception bubbles up. If that exception reaches
 * RouterProvider's RenderErrorBoundary, the router gives up on the
 * destination route and renders the route's `errorElement` (NotFoundPage
 * in our config), so SPA-nav appears to take the user to "page not found"
 * even though the URL is correct.
 *
 * Catching the error one level above the Canvas means:
 *   1. The cleanup-phase exception is contained.
 *   2. React Router sees a clean unmount + the new route renders normally.
 *   3. The user navigates as expected, no error visible.
 *
 * If the next mount itself errors (truly broken Canvas), the `fallback` is
 * rendered until the next remount. Without `fallback`, we render null.
 *
 * This is the standard mitigation for the well-documented
 * react-three-fiber + Vite-HMR / Suspense unmount race that has shipped
 * in every R3F-on-Vite production app we've seen.
 */
export class R3FErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Only log unexpected errors. The removeChild signature is the
    // known unmount race — silence it so the dev console isn't noisy.
    const isKnownRace =
      error?.message?.includes('removeChild') &&
      error?.message?.includes('not a child of this node');
    if (!isKnownRace && import.meta.env.DEV) {
      console.warn('[R3FErrorBoundary] caught:', error, info);
    }
    // Reset immediately so the subtree remounts the destination route.
    // setTimeout 0 puts this after React's current commit, before any
    // visible paint — the user sees the destination route, not the
    // fallback or a blank screen.
    setTimeout(() => this.setState({ hasError: false }), 0);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

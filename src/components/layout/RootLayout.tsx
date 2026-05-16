import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { LoadingScreen } from './LoadingScreen';
import { ScrollProgress } from './ScrollProgress';
import { SkipLink } from './SkipLink';
import { R3FErrorBoundary } from './R3FErrorBoundary';
import { SoundProvider, SoundToast } from '@/components/sound';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { useLenis } from '@/lib/lenis';

export function RootLayout() {
  useLenis();

  return (
    <SoundProvider>
      <LoadingScreen />
      <SkipLink />
      <div className="relative flex min-h-screen flex-col">
        <ScrollProgress />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {/* R3FErrorBoundary OUTSIDE PageTransition + Outlet so it catches
              the R3F unmount-race exception BEFORE React Router's own
              RenderErrorBoundary, which would otherwise drop the user on
              the errorElement (NotFoundPage). The boundary resets on the
              next tick so the destination route renders cleanly. */}
          <R3FErrorBoundary>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </R3FErrorBoundary>
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
      <CustomCursor />
      <SoundToast />
    </SoundProvider>
  );
}

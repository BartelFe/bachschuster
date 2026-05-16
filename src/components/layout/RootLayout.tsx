import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { LoadingScreen } from './LoadingScreen';
import { ScrollProgress } from './ScrollProgress';
import { SkipLink } from './SkipLink';
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
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
      <CustomCursor />
      <SoundToast />
    </SoundProvider>
  );
}

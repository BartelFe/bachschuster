import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SoundProvider } from '@/components/sound';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { useLenis } from '@/lib/lenis';

export function RootLayout() {
  useLenis();

  return (
    <SoundProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
      <CustomCursor />
    </SoundProvider>
  );
}

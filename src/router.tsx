import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import HomePage from '@/routes/HomePage';
import MethodePage from '@/routes/MethodePage';
import WerkeIndexPage from '@/routes/WerkeIndexPage';
import WerkPage from '@/routes/WerkPage';
import NetzwerkPage from '@/routes/NetzwerkPage';
import StimmenPage from '@/routes/StimmenPage';
import TeamPage from '@/routes/TeamPage';
import KontaktPage from '@/routes/KontaktPage';
import ImpressumPage from '@/routes/ImpressumPage';
import DatenschutzPage from '@/routes/DatenschutzPage';
import NotFoundPage from '@/routes/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'methode', element: <MethodePage /> },
      { path: 'werke', element: <WerkeIndexPage /> },
      { path: 'werke/:slug', element: <WerkPage /> },
      { path: 'netzwerk', element: <NetzwerkPage /> },
      { path: 'stimmen', element: <StimmenPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'kontakt', element: <KontaktPage /> },
      { path: 'impressum', element: <ImpressumPage /> },
      { path: 'datenschutz', element: <DatenschutzPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

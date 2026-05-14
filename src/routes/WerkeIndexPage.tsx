import { WerkeIndexSection } from '@/components/werke/WerkeIndexSection';

/**
 * /werke — Editorial portfolio index. W5 ships the asymmetric grid with
 * filter row, deep-dive badges, and live counts. Deep dives wire in via
 * /werke/:slug — WestPark complete in W5; Shanghai / Mobility / Sen / VW
 * Hope Academy ship in W6.
 */
export default function WerkeIndexPage() {
  return <WerkeIndexSection />;
}

import { createContext } from 'react';

export interface SoundContextValue {
  isEnabled: boolean;
  toggle: () => void;
  register: (
    name: string,
    options?: { src?: readonly string[]; loop?: boolean; volume?: number },
  ) => void;
  play: (name: string) => void;
  stop: (name: string) => void;
}

export const SoundContext = createContext<SoundContextValue | null>(null);

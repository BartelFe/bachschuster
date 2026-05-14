import { useContext } from 'react';
import { SoundContext, type SoundContextValue } from './sound-context';

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error('useSound() must be called inside <SoundProvider>');
  }
  return ctx;
}

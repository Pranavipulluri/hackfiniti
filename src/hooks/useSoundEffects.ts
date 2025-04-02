
import { useCallback } from 'react';
import { useSoundContext } from '@/contexts/SoundContext';

type SoundType = 'hover' | 'click' | 'success' | 'error' | 'message';

export function useSoundEffects() {
  const { playSound, isSoundEnabled } = useSoundContext();
  
  const playSoundEffect = useCallback((type: SoundType) => {
    if (isSoundEnabled) {
      playSound(type);
    }
  }, [playSound, isSoundEnabled]);
  
  return { playSound: playSoundEffect };
}

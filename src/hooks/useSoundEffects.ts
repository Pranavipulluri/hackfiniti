
import { useCallback } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'error' | 'message';

export function useSoundEffects() {
  const playSound = useCallback((type: SoundType) => {
    let sound: HTMLAudioElement;
    
    switch (type) {
      case 'hover':
        sound = new Audio('/sounds/hover.mp3');
        sound.volume = 0.2;
        break;
      case 'click':
        sound = new Audio('/sounds/click.mp3');
        sound.volume = 0.3;
        break;
      case 'success':
        sound = new Audio('/sounds/click.mp3'); // Could be replaced with a success sound
        sound.volume = 0.4;
        break;
      case 'error':
        sound = new Audio('/sounds/click.mp3'); // Could be replaced with an error sound
        sound.volume = 0.4;
        break;
      case 'message':
        sound = new Audio('/sounds/click.mp3'); // Could be replaced with a message sound
        sound.volume = 0.3;
        break;
      default:
        sound = new Audio('/sounds/click.mp3');
        sound.volume = 0.3;
    }
    
    sound.play().catch(error => {
      // Autoplay might be blocked by the browser
      console.log('Sound play prevented:', error);
    });
  }, []);
  
  return { playSound };
}

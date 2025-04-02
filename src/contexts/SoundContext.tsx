
import React, { createContext, useState, useContext, useEffect } from 'react';
import { soundManager } from '@/utils/soundUtils';
import SoundToggle from '@/components/SoundToggle';

type SoundContextType = {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundType: string) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  useEffect(() => {
    // Initialize sound when component mounts
    const currentState = soundManager.isSoundEnabled();
    setIsSoundEnabled(currentState);
    
    // Start background music
    if (currentState) {
      soundManager.playBgMusic();
    }
    
    // Clean up on unmount
    return () => {
      soundManager.pauseBgMusic();
    };
  }, []);
  
  const toggleSound = () => {
    const isEnabled = soundManager.toggleSound();
    setIsSoundEnabled(isEnabled);
    return isEnabled;
  };
  
  const playSound = (soundType: string) => {
    soundManager.playSound(soundType);
  };
  
  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>
      <SoundToggle />
      {children}
    </SoundContext.Provider>
  );
};


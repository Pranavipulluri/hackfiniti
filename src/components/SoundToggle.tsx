
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/utils/soundUtils';
import { motion } from 'framer-motion';

const SoundToggle = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  
  useEffect(() => {
    // Start background music when component mounts
    soundManager.playBgMusic();
    
    // Clean up when component unmounts
    return () => {
      soundManager.pauseBgMusic();
    };
  }, []);
  
  const toggleSound = () => {
    const isEnabled = soundManager.toggleSound();
    setIsSoundOn(isEnabled);
    // Play the click sound if we're enabling sound
    if (isEnabled) {
      soundManager.playSound('click');
    }
  };
  
  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSound}
        className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        <span className="sr-only">Toggle sound</span>
      </Button>
    </motion.div>
  );
};

export default SoundToggle;

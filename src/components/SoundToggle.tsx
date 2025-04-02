
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSoundContext } from '@/contexts/SoundContext';

const SoundToggle = () => {
  const { isSoundEnabled, toggleSound, playSound } = useSoundContext();
  
  const handleToggle = () => {
    toggleSound();
    
    // Only play the click sound if sound is enabled after toggling
    if (isSoundEnabled) {
      playSound('click');
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
        onClick={handleToggle}
        className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        <span className="sr-only">Toggle sound</span>
      </Button>
    </motion.div>
  );
};

export default SoundToggle;

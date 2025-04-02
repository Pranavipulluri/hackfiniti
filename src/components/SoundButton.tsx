
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSoundContext } from '@/contexts/SoundContext';

interface SoundButtonProps extends ButtonProps {
  soundEffect?: string;
}

const SoundButton = React.forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ soundEffect = 'click', onClick, ...props }, ref) => {
    const { playSound, isSoundEnabled } = useSoundContext();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isSoundEnabled) {
        playSound(soundEffect);
      }
      
      if (onClick) {
        onClick(e);
      }
    };

    const handleMouseEnter = () => {
      if (isSoundEnabled) {
        playSound('hover');
      }
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      />
    );
  }
);

SoundButton.displayName = 'SoundButton';

export default SoundButton;

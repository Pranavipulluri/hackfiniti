
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { soundManager } from '@/utils/soundUtils';

interface SoundButtonProps extends ButtonProps {
  soundEffect?: string;
}

const SoundButton = React.forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ soundEffect = 'click', onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      soundManager.playSound(soundEffect);
      if (onClick) {
        onClick(e);
      }
    };

    const handleMouseEnter = () => {
      soundManager.playSound('hover');
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

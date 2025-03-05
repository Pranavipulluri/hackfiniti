
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCharacterProps {
  characterType: 'explorer' | 'guide' | 'merchant';
  position?: 'left' | 'right';
  delay?: number;
}

const characterImages = {
  explorer: "/characters/explorer.png",
  guide: "/characters/guide.png",
  merchant: "/characters/merchant.png",
};

const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  characterType,
  position = 'right',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  const initialX = position === 'left' ? -100 : 100;
  
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };
  
  return (
    <motion.div
      className={`absolute bottom-0 ${position === 'left' ? 'left-4 md:left-12' : 'right-4 md:right-12'} z-10`}
      initial={{ opacity: 0, x: initialX, y: 50 }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0, ...floatAnimation } : {}}
      transition={{ duration: 0.8, delay: delay * 0.1 }}
    >
      {/* Placeholder for character image */}
      <img 
        src={characterImages[characterType]} 
        alt={`${characterType} character`}
        className="h-48 md:h-64 object-contain"
        onError={(e) => {
          // Fallback to a colored rectangle if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.backgroundColor = characterType === 'explorer' ? '#f97316' : 
                                         characterType === 'guide' ? '#14b8a6' : '#a855f7';
          target.style.width = '120px';
          target.style.height = '180px';
          target.style.borderRadius = '8px';
          target.alt = `${characterType} (placeholder)`;
        }}
      />
    </motion.div>
  );
};

export default AnimatedCharacter;

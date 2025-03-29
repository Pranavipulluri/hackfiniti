
import { motion } from "framer-motion";
import NavigationBar from "./NavigationBar";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type PageLayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
  mapBackground?: boolean;
};

const PageLayout = ({ children, fullWidth = false, mapBackground = false }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen ${mapBackground ? 'bg-slate-900' : 'bg-[url(\'/lovable-uploads/c33d1835-34b1-4ffe-9332-68c37b3b2c00.png\')] bg-cover bg-fixed'}`}>
      <div className={`absolute inset-0 ${mapBackground ? 'bg-gradient-to-b from-slate-900/70 to-slate-800/90' : 'bg-gradient-to-b from-slate-900/80 to-slate-800/90 backdrop-blur-sm'}`}></div>
      <NavigationBar />
      
      {/* Decorative sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Sparkles size={8 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>
      
      <main className={`pt-16 relative z-10 ${fullWidth ? 'overflow-x-hidden' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={fullWidth ? "w-full px-4 py-8" : "container mx-auto px-4 py-8"}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default PageLayout;

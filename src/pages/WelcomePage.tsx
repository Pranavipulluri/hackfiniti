
import { useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import WelcomeExperience from "@/components/WelcomeExperience";
import WorldGlobe from "@/components/WorldGlobe";

const WelcomePage = () => {
  const location = useLocation();
  const characterData = location.state?.characterData;
  
  // If we don't have character data, redirect to character creation
  if (!characterData) {
    return <Navigate to="/create-character" replace />;
  }
  
  return (
    <PageLayout fullWidth>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <WelcomeExperience 
            characterName={characterData.name} 
            selectedRegion={characterData.region} 
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[600px] relative rounded-2xl overflow-hidden border border-teal-500/30 shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/50 z-0"></div>
          <WorldGlobe />
          <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-teal-500/30 z-10">
            <h3 className="text-xl font-bold text-white mb-2">Interactive India Explorer</h3>
            <p className="text-gray-300">Drag to rotate the globe. Zoom in and out to explore cultural hotspots around India.</p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default WelcomePage;

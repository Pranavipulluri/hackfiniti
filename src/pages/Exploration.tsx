
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import RegionMap from "@/components/RegionMap";
import KeralaItinerary from "@/components/KeralaItinerary";
import { 
  Globe, Compass, Calendar, 
  Map as MapIcon, Info, X
} from "lucide-react";

const Exploration = () => {
  const [activeRegion, setActiveRegion] = useState("asia");
  const [showItinerary, setShowItinerary] = useState(false);
  
  return (
    <PageLayout mapBackground>
      <div className="max-w-6xl mx-auto">
        {!showItinerary ? (
          // Regular exploration view
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-white mb-2">Cultural Exploration</h1>
                <p className="text-gray-300">Discover traditions, festivals, and cultural sites from around the world</p>
              </div>
              
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-slate-800/60 text-white border-teal-500/30 hover:bg-slate-700/60"
                  onClick={() => setShowItinerary(true)}
                >
                  <MapIcon className="h-4 w-4" />
                  My Itinerary
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Start Exploring
                </Button>
              </div>
            </div>
            
            {/* World Map Explorer */}
            <Card className="mb-8 overflow-hidden bg-slate-800/60 border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="bg-slate-900/80 p-4 border-b border-teal-500/20">
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-teal-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">Interactive World Explorer</h2>
                  </div>
                  <p className="text-gray-400 mt-1 pl-9">Navigate through regions, countries, and states to discover cultural wonders</p>
                </div>
                
                <div className="p-4">
                  <RegionMap 
                    initialRegion={activeRegion} 
                    onShowItinerary={() => setShowItinerary(true)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Cultural Events Calendar - This is kept as a simpler component to focus on the map */}
            <Card className="bg-slate-800/60 border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-teal-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Upcoming Cultural Events</h2>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <Info className="h-10 w-10 mx-auto text-teal-400 mb-2" />
                  <p className="text-white">Browse through regions and countries to see their unique cultural events and festivals</p>
                  <p className="text-gray-400 text-sm mt-2">Select a region, country, or state from the map above to view related cultural events</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Kerala Itinerary Game View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800/80 border border-teal-500/30 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-slate-900/80 p-4 border-b border-teal-500/20 flex justify-between items-center">
              <div className="flex items-center">
                <MapIcon className="h-6 w-6 text-teal-400 mr-3" />
                <h2 className="text-xl font-bold text-white">Kerala Explorer</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowItinerary(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <KeralaItinerary />
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default Exploration;

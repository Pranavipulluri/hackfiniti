
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Map, Award, MessageCircle, PackageOpen } from "lucide-react";

const WelcomeExperience = ({ characterName, selectedRegion }: { characterName: string; selectedRegion: string }) => {
  const [step, setStep] = useState<"cutscene" | "hub-intro" | "guided-tour" | "dialogue" | "inventory">("cutscene");
  const [tourSection, setTourSection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-advance cutscene after 5 seconds
    if (step === "cutscene") {
      const timer = setTimeout(() => {
        setStep("hub-intro");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const regionDetails = {
    asia: {
      name: "Asian Cultural Hub",
      guide: "Mei",
      description: "Welcome to the bustling streets and ancient temples of the Asian Cultural Hub.",
      firstQuest: "collect three traditional spices from the market"
    },
    europe: {
      name: "European Cultural Hub",
      guide: "Pierre",
      description: "Welcome to the historic squares and artistic wonders of the European Cultural Hub.",
      firstQuest: "learn about three different architectural styles"
    },
    africa: {
      name: "African Cultural Hub",
      guide: "Amara",
      description: "Welcome to the vibrant villages and natural wonders of the African Cultural Hub.",
      firstQuest: "discover the meaning behind three traditional patterns"
    },
    americas: {
      name: "Americas Cultural Hub",
      guide: "Carlos",
      description: "Welcome to the diverse landscapes and rich traditions of the Americas Cultural Hub.",
      firstQuest: "sample three regional cuisines"
    }
  };

  const currentRegion = regionDetails[selectedRegion as keyof typeof regionDetails];

  const skipToHub = () => {
    setStep("hub-intro");
  };

  const handleContinue = () => {
    if (step === "hub-intro") {
      setStep("guided-tour");
    } else if (step === "guided-tour") {
      if (tourSection < 3) {
        setTourSection(prev => prev + 1);
      } else {
        setStep("dialogue");
        setTourSection(0);
      }
    } else if (step === "dialogue") {
      setStep("inventory");
    } else if (step === "inventory") {
      navigate("/"); // Navigate to the home/hub screen when finished
    }
  };

  const renderCutscene = () => (
    <motion.div 
      className="relative h-[400px] overflow-hidden rounded-lg bg-gradient-to-r from-teal-900 to-blue-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-playfair font-bold mb-4">Your Journey Begins</h2>
          <p className="text-xl mb-8">
            Welcome, {characterName}, to the world of Cultural Quest Exchange
          </p>
          <p className="mb-8">
            You've arrived at the {currentRegion.name}, eager to explore and learn...
          </p>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <Button onClick={skipToHub} variant="outline" className="bg-white/10 hover:bg-white/20 text-white">
            Skip Intro
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderHubIntro = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-3xl font-playfair font-bold text-center">The Cultural Hub</h2>
      <p className="text-center text-gray-600">
        {currentRegion.description} This is your gateway to adventure and discovery.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="p-4 bg-teal-50 hover:bg-teal-100 transition-colors">
          <div className="flex flex-col items-center text-center">
            <Map className="w-8 h-8 text-teal-600 mb-2" />
            <h3 className="font-medium">Explore Cultures</h3>
            <p className="text-sm text-gray-600">Discover traditions and customs</p>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex flex-col items-center text-center">
            <Award className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium">Join Quests</h3>
            <p className="text-sm text-gray-600">Complete cultural missions</p>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 hover:bg-purple-100 transition-colors">
          <div className="flex flex-col items-center text-center">
            <PackageOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium">Trade Market</h3>
            <p className="text-sm text-gray-600">Exchange cultural items</p>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50 hover:bg-amber-100 transition-colors">
          <div className="flex flex-col items-center text-center">
            <MessageCircle className="w-8 h-8 text-amber-600 mb-2" />
            <h3 className="font-medium">Interact</h3>
            <p className="text-sm text-gray-600">Meet locals and other players</p>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button onClick={handleContinue} className="bg-teal-500 hover:bg-teal-600">
          Take the Tour <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );

  const tourSections = [
    {
      title: "Exploration Map",
      description: "Click on regions to discover cultural wonders and complete quests.",
      icon: <Map className="w-10 h-10 text-teal-500" />
    },
    {
      title: "Quest Board",
      description: "Take on cultural missions to earn rewards and learn about traditions.",
      icon: <Award className="w-10 h-10 text-teal-500" />
    },
    {
      title: "Marketplace",
      description: "Trade cultural artifacts and collectibles with other adventurers.",
      icon: <PackageOpen className="w-10 h-10 text-teal-500" />
    },
    {
      title: "Chat System",
      description: "Connect with locals and other players from around the world.",
      icon: <MessageCircle className="w-10 h-10 text-teal-500" />
    }
  ];

  const renderGuidedTour = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-center mb-4">
        <div className="h-1 bg-gray-200 flex-1 rounded-full">
          <div 
            className="h-1 bg-teal-500 rounded-full transition-all"
            style={{ width: `${((tourSection + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Card className="p-6 border-2 border-teal-100">
        <motion.div
          key={tourSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-4 p-4 bg-teal-50 rounded-full">
            {tourSections[tourSection].icon}
          </div>
          <h3 className="text-xl font-medium mb-2">{tourSections[tourSection].title}</h3>
          <p className="text-gray-600 mb-4">{tourSections[tourSection].description}</p>
        </motion.div>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => tourSection > 0 ? setTourSection(prev => prev - 1) : null}
          disabled={tourSection === 0}
        >
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-teal-500 hover:bg-teal-600">
          {tourSection < 3 ? "Next" : "Meet Your Guide"}
        </Button>
      </div>
    </motion.div>
  );

  const renderDialogue = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-50 p-4 rounded-lg text-center italic text-gray-600 mb-4">
        A friendly local approaches you with a warm smile...
      </div>
      
      <Card className="p-6 border-2 border-amber-100">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-amber-600 font-bold">{currentRegion.guide[0]}</span>
          </div>
          <div>
            <h3 className="font-medium">{currentRegion.guide}</h3>
            <p className="text-sm text-gray-500">Local Guide</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p>"{characterName}! Welcome to the {currentRegion.name}. I'm {currentRegion.guide}, and I'll be your guide to our vibrant culture."</p>
          <p>"There's so much to explore here! I can help you learn about our traditions, foods, arts, and history."</p>
          <p>"For your first quest, I suggest you {currentRegion.firstQuest}. It's a perfect way to begin your cultural journey!"</p>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleContinue} className="bg-amber-500 hover:bg-amber-600">
          Check Your Inventory
        </Button>
      </div>
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-3xl font-playfair font-bold text-center">Your Inventory</h2>
      <p className="text-center text-gray-600">
        Here you'll store all the cultural items you collect on your journey
      </p>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
            <PackageOpen className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500">Your inventory is empty</p>
            <p className="text-sm text-gray-400">Complete quests to collect cultural items</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-teal-50 p-3 rounded-lg">
              <h4 className="font-medium text-teal-700">Cultural Points</h4>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-700">Regions Visited</h4>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">First Quest</h4>
            <div className="flex items-center bg-amber-50 p-3 rounded-lg">
              <Award className="w-5 h-5 text-amber-500 mr-2" />
              <div>
                <p className="font-medium">{currentRegion.firstQuest.charAt(0).toUpperCase() + currentRegion.firstQuest.slice(1)}</p>
                <p className="text-xs text-gray-500">Reward: Cultural knowledge and special item</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={handleContinue} className="bg-teal-500 hover:bg-teal-600">
          Begin Your Adventure!
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "cutscene" && renderCutscene()}
        {step === "hub-intro" && renderHubIntro()}
        {step === "guided-tour" && renderGuidedTour()}
        {step === "dialogue" && renderDialogue()}
        {step === "inventory" && renderInventory()}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeExperience;

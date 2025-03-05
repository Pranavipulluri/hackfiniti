
import { motion } from "framer-motion";
import { Globe, Users, ShoppingBag, GraduationCap, Gamepad, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import WorldGlobe from "@/components/WorldGlobe";
import NavigationBar from "@/components/NavigationBar";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import SoundToggle from "@/components/SoundToggle";
import SoundButton from "@/components/SoundButton";
import { soundManager } from "@/utils/soundUtils";

const Index = () => {
  useEffect(() => {
    // Preload our sounds when the component mounts
    soundManager.preloadSound('click', '/sounds/click.mp3');
    soundManager.preloadSound('hover', '/sounds/hover.mp3');
    soundManager.preloadBgMusic('/sounds/background-music.mp3');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-teal-50 overflow-x-hidden">
      <NavigationBar />
      <SoundToggle />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-32 relative">
        {/* Animated Characters */}
        <AnimatedCharacter characterType="explorer" position="right" delay={500} />
        <AnimatedCharacter characterType="guide" position="left" delay={800} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Cultural Quest Exchange
          </h1>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Explore, learn, and trade cultural elements from around the world in this
            immersive multiplayer experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <SoundButton asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
              <Link to="/create-character">Start Your Journey</Link>
            </SoundButton>
            <SoundButton asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </SoundButton>
          </div>
        </motion.div>

        {/* Interactive Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[500px] mb-20"
        >
          <WorldGlobe />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-t-[3rem] shadow-lg relative">
        {/* Merchant character in features section */}
        <AnimatedCharacter characterType="merchant" position="right" delay={1200} />
        
        <h2 className="font-playfair text-4xl font-bold text-center mb-16">
          Embark on a Cultural Adventure
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Feature
            icon={<Globe className="w-8 h-8 text-teal-500" />}
            title="Explore Cultures"
            description="Visit virtual cultural hubs and immerse yourself in traditions from around the world."
            link="/exploration"
            linkText="Start Exploring"
          />
          <Feature
            icon={<ShoppingBag className="w-8 h-8 text-teal-500" />}
            title="Trade & Collect"
            description="Exchange cultural items and build your collection of artifacts in our global marketplace."
            link="/marketplace"
            linkText="Visit Marketplace"
          />
          <Feature
            icon={<GraduationCap className="w-8 h-8 text-teal-500" />}
            title="Learn & Grow"
            description="Gain knowledge about different cultures through interactive experiences and quests."
            link="/mini-games"
            linkText="Play Mini-Games"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Feature
            icon={<Users className="w-8 h-8 text-teal-500" />}
            title="Connect"
            description="Meet players from different cultures and forge meaningful friendships across the globe."
            link="/profile"
            linkText="View Profile"
          />
          <Feature
            icon={<MessageCircle className="w-8 h-8 text-teal-500" />}
            title="Chat & Collaborate"
            description="Communicate with players worldwide through our real-time chat system with translation features."
            link="/chat"
            linkText="Open Chat"
          />
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="font-playfair text-2xl font-semibold mb-4">Ready to Begin Your Cultural Journey?</h3>
          <SoundButton asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
            <Link to="/create-character">Create Your Character</Link>
          </SoundButton>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ 
  icon, 
  title, 
  description, 
  link, 
  linkText 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  link: string;
  linkText: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="p-6 h-full border-2 border-gray-100 bg-white transition-shadow hover:shadow-lg flex flex-col">
      <div className="flex flex-col items-center text-center flex-1">
        <div className="mb-4 p-3 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
          {icon}
        </div>
        <h3 className="font-playfair text-xl font-semibold mb-2">{title}</h3>
        <p className="font-inter text-gray-600 mb-6">{description}</p>
      </div>
      <div className="mt-auto pt-4 text-center">
        <SoundButton asChild variant="outline" className="group-hover:bg-teal-50 transition-colors">
          <Link to={link}>{linkText}</Link>
        </SoundButton>
      </div>
    </Card>
  </motion.div>
);

export default Index;

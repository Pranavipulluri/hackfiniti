
import { motion } from "framer-motion";
import { Globe, Users, ShoppingBag, GraduationCap, Gamepad, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import WorldGlobe from "@/components/WorldGlobe";
import NavigationBar from "@/components/NavigationBar";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import SoundToggle from "@/components/SoundToggle";
import SoundButton from "@/components/SoundButton";
import { soundManager } from "@/utils/soundUtils";

const Index = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Preload our sounds when the component mounts
    soundManager.preloadSound('click', '/sounds/click.mp3');
    soundManager.preloadSound('hover', '/sounds/hover.mp3');
    soundManager.preloadBgMusic('/sounds/background-music.mp3');
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[url('/lovable-uploads/c33d1835-34b1-4ffe-9332-68c37b3b2c00.png')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/80 backdrop-blur-sm"></div>
      <NavigationBar />
      <SoundToggle />
      
      {/* Hero Section */}
      <section className="container relative mx-auto px-4 pt-24 pb-32">
        {/* Fantasy Sparkles Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300"
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
              <Sparkles size={10 + Math.random() * 10} />
            </motion.div>
          ))}
        </div>
      
        {/* Custom Character Images */}
        <div className="absolute bottom-0 right-0 md:w-64 w-40 opacity-90 z-10 transform translate-y-1/4">
          <img src="/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png" alt="Kerala traditional boy character" className="w-full" />
        </div>
        <div className="absolute bottom-0 left-0 md:w-64 w-40 opacity-90 z-10 transform translate-y-1/4">
          <img src="/lovable-uploads/7ea599b5-bfde-462e-b7e7-454b0a50f062.png" alt="Tour guide character" className="w-full" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <motion.h1 
            className="font-playfair text-6xl md:text-8xl font-bold mb-6 title-text"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100 
            }}
          >
            Cultural Quest
          </motion.h1>
          <motion.p 
            className="font-inter text-xl md:text-2xl text-yellow-100 max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Explore, learn, and trade cultural elements from around the world in this
            immersive adventure.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <SoundButton asChild className="fantasy-button text-lg">
              <Link to="/create-character">Start Your Journey</Link>
            </SoundButton>
            <SoundButton asChild variant="outline" size="lg" className="bg-slate-800/80 backdrop-blur-sm border-orange-500/30 hover:bg-slate-700/80 text-yellow-100">
              <Link to="/about">Learn More</Link>
            </SoundButton>
          </motion.div>
        </motion.div>

        {/* Interactive Globe with decorative frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[600px] mb-20"
          ref={globeRef}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-xl transform scale-90 -z-10"></div>
          <div className="relative z-10 h-full">
            <WorldGlobe />
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-full px-6 py-3 text-yellow-100 border border-orange-500/30 text-lg font-playfair">
            Discover Cultural Wonders
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/95 to-slate-900/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-orange-500/20 via-yellow-500/30 to-orange-500/20"></div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-r from-orange-500/20 via-yellow-500/30 to-orange-500/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-playfair text-5xl font-bold text-center mb-16 title-text">
            Embark on a Cultural Adventure
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Feature
              icon={<Globe className="w-10 h-10 text-orange-400" />}
              title="Explore Cultures"
              description="Visit virtual cultural hubs and immerse yourself in traditions from around the world."
              link="/exploration"
              linkText="Start Exploring"
              image="/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png"
            />
            <Feature
              icon={<ShoppingBag className="w-10 h-10 text-orange-400" />}
              title="Trade & Collect"
              description="Exchange cultural items and build your collection of artifacts in our global marketplace."
              link="/marketplace"
              linkText="Visit Marketplace"
              image="/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png"
            />
            <Feature
              icon={<GraduationCap className="w-10 h-10 text-orange-400" />}
              title="Learn & Grow"
              description="Gain knowledge about different cultures through interactive experiences and quests."
              link="/mini-games"
              linkText="Play Mini-Games"
              image="/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Feature
              icon={<Users className="w-10 h-10 text-orange-400" />}
              title="Connect"
              description="Meet players from different cultures and forge meaningful friendships across the globe."
              link="/profile"
              linkText="View Profile"
              image="/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png"
            />
            <Feature
              icon={<MessageCircle className="w-10 h-10 text-orange-400" />}
              title="Chat & Collaborate"
              description="Communicate with players worldwide through our real-time chat system with translation features."
              link="/chat"
              linkText="Open Chat"
              image="/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
            />
          </div>
          
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-3xl font-semibold mb-6 text-yellow-100">Ready to Begin Your Cultural Journey?</h3>
              <SoundButton asChild className="fantasy-button text-lg">
                <Link to="/create-character">Create Your Character</Link>
              </SoundButton>
            </motion.div>
          </div>
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
  linkText,
  image
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  link: string;
  linkText: string;
  image: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="game-panel h-full flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 opacity-30">
        <img src={image} alt="" className="w-full h-full object-cover object-center filter blur-sm" />
      </div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-800"></div>
      
      <div className="flex flex-col items-center text-center flex-1 relative z-10 pt-8">
        <div className="mb-4 p-4 rounded-full bg-slate-700/80 group-hover:bg-slate-600/80 transition-colors border border-orange-500/30 shadow-lg shadow-orange-500/10">
          {icon}
        </div>
        <h3 className="font-playfair text-2xl font-semibold mb-2 text-yellow-100">{title}</h3>
        <p className="font-inter text-slate-300 mb-6">{description}</p>
      </div>
      <div className="mt-auto pt-4 text-center relative z-10">
        <SoundButton asChild className="fantasy-button text-base">
          <Link to={link}>{linkText}</Link>
        </SoundButton>
      </div>
    </Card>
  </motion.div>
);

export default Index;

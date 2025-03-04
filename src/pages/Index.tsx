
import { motion } from "framer-motion";
import { Globe, Users, ShoppingBag, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorldGlobe from "@/components/WorldGlobe";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-teal-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
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
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
              <Link to="/create-character">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
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
      <section className="container mx-auto px-4 py-20 bg-white rounded-t-[3rem] shadow-lg">
        <h2 className="font-playfair text-4xl font-bold text-center mb-16">
          Embark on a Cultural Adventure
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            icon={<Globe className="w-8 h-8 text-teal-500" />}
            title="Explore Cultures"
            description="Visit virtual cultural hubs and immerse yourself in traditions from around the world."
          />
          <Feature
            icon={<Users className="w-8 h-8 text-teal-500" />}
            title="Connect"
            description="Meet players from different cultures and forge meaningful friendships."
          />
          <Feature
            icon={<ShoppingBag className="w-8 h-8 text-teal-500" />}
            title="Trade & Collect"
            description="Exchange cultural items and build your collection of artifacts."
          />
          <Feature
            icon={<GraduationCap className="w-8 h-8 text-teal-500" />}
            title="Learn & Grow"
            description="Gain knowledge about different cultures through interactive experiences."
          />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="p-6 h-full border-2 border-gray-100 bg-white transition-shadow hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
          {icon}
        </div>
        <h3 className="font-playfair text-xl font-semibold mb-2">{title}</h3>
        <p className="font-inter text-gray-600">{description}</p>
      </div>
    </Card>
  </motion.div>
);

export default Index;

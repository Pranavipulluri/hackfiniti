
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Users, ShoppingBag, GraduationCap, Trophy, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-6">
            About Cultural Quest Exchange
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            An immersive multiplayer experience designed to connect people through shared cultural exploration
          </p>

          <Card className="p-8 mb-12">
            <h2 className="font-playfair text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg mb-6">
              Cultural Quest Exchange was created with a simple yet powerful vision: to build bridges between cultures through playful, interactive learning. We believe that by experiencing the richness of global traditions, food, art, and language, players can develop a deeper appreciation for our beautiful, diverse world.
            </p>
            <p className="text-lg">
              Through exploration, collaboration, and friendly exchange, we hope to foster a community of cultural ambassadors who celebrate differences while recognizing our shared humanity.
            </p>
          </Card>

          <h2 className="font-playfair text-3xl font-semibold text-center mb-8">
            Key Game Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <FeatureCard 
              icon={<Globe />}
              title="Cultural Exploration"
              description="Visit virtual cultural hubs based on real-world regions and participate in local traditions and festivals."
            />
            <FeatureCard 
              icon={<Users />}
              title="Meaningful Connections"
              description="Connect with players worldwide, form friendships, and learn about different perspectives through cultural exchange."
            />
            <FeatureCard 
              icon={<ShoppingBag />}
              title="Cultural Marketplace"
              description="Trade traditional items, recipes, clothing, and artifacts with other players to grow your collection."
            />
            <FeatureCard 
              icon={<GraduationCap />}
              title="Playful Learning"
              description="Master new languages, cooking techniques, and cultural knowledge through engaging mini-games."
            />
          </div>

          <Separator className="my-12" />

          <div className="text-center">
            <h2 className="font-playfair text-3xl font-semibold mb-6">
              Ready to Begin Your Cultural Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of players around the world in this unique adventure of discovery and exchange.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
                <Link to="/create-character">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="p-6 h-full">
    <div className="flex flex-col h-full">
      <div className="mb-4 p-3 w-fit rounded-full bg-teal-50 text-teal-500">
        {icon}
      </div>
      <h3 className="font-playfair text-xl font-semibold mb-3">{title}</h3>
      <p className="font-inter text-gray-600">{description}</p>
    </div>
  </Card>
);

export default About;


import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Sparkles } from "lucide-react";

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-1");
  const [selectedRegion, setSelectedRegion] = useState("asia");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateCharacter = () => {
    if (!characterName.trim()) {
      toast({
        title: "Character name required",
        description: "Please enter a name for your character",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Character created!",
      description: "Your cultural journey begins now.",
      variant: "default",
    });
    
    const characterData = {
      name: characterName,
      avatar: selectedAvatar,
      region: selectedRegion,
    };
    
    navigate("/welcome", { state: { characterData } });
  };

  const avatars = [
    { id: "avatar-1", src: "/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png" },
    { id: "avatar-2", src: "/characters/explorer.png" },
    { id: "avatar-3", src: "/characters/guide.png" },
    { id: "avatar-4", src: "/characters/merchant.png" },
  ];

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-yellow-400 mr-2" size={24} />
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center title-text">
              Create Your Character
            </h1>
            <Sparkles className="text-yellow-400 ml-2" size={24} />
          </div>
          <p className="text-center text-yellow-100 mb-12">
            Customize your cultural ambassador and begin your journey around the world
          </p>
        </motion.div>

        <Card className="game-panel">
          <div className="space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Label htmlFor="character-name" className="text-yellow-100 text-lg">Character Name</Label>
              <Input
                id="character-name"
                placeholder="Enter a name for your character"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="bg-slate-800 border-orange-500/30 text-white placeholder:text-slate-400 focus:border-orange-400"
              />
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Label className="text-yellow-100 text-lg">Choose Your Avatar</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {avatars.map((avatar) => (
                  <motion.div
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-lg p-2 transition-all ${
                      selectedAvatar === avatar.id
                        ? "bg-gradient-to-b from-orange-500/30 to-yellow-500/20 border-2 border-orange-400"
                        : "hover:bg-slate-700/50 border-2 border-transparent"
                    }`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={avatar.src} alt="Avatar" />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {avatar.id.split("-")[1]}
                      </AvatarFallback>
                    </Avatar>
                    {selectedAvatar === avatar.id && (
                      <div className="mt-2 text-center text-yellow-300 text-sm">Selected</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Label className="text-yellow-100 text-lg">Starting Region</Label>
              <Tabs
                defaultValue="asia"
                value={selectedRegion}
                onValueChange={setSelectedRegion}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4 bg-slate-800 p-1">
                  <TabsTrigger 
                    value="asia" 
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    Asia
                  </TabsTrigger>
                  <TabsTrigger 
                    value="europe"
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    Europe
                  </TabsTrigger>
                  <TabsTrigger 
                    value="africa"
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    Africa
                  </TabsTrigger>
                  <TabsTrigger 
                    value="americas"
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    Americas
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="asia" className="p-4 bg-slate-800/50 rounded-md border border-orange-500/20">
                  <p className="text-yellow-100">Begin your journey in the rich and diverse cultures of Asia, from the spice markets of India to the temples of Japan.</p>
                </TabsContent>
                <TabsContent value="europe" className="p-4 bg-slate-800/50 rounded-md border border-orange-500/20">
                  <p className="text-yellow-100">Explore the historic castles, vibrant festivals, and culinary delights across the European continent.</p>
                </TabsContent>
                <TabsContent value="africa" className="p-4 bg-slate-800/50 rounded-md border border-orange-500/20">
                  <p className="text-yellow-100">Discover the rhythms, traditions, and natural wonders of Africa's many diverse cultures and landscapes.</p>
                </TabsContent>
                <TabsContent value="americas" className="p-4 bg-slate-800/50 rounded-md border border-orange-500/20">
                  <p className="text-yellow-100">Experience the melting pot of traditions from across North and South America, from carnival celebrations to indigenous heritage.</p>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div 
              className="flex justify-between pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild variant="outline" className="border-orange-500/30 text-yellow-100 hover:bg-slate-700/50">
                <Link to="/">Go Back</Link>
              </Button>
              <Button onClick={handleCreateCharacter} className="fantasy-button">
                Create Character
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreateCharacter;

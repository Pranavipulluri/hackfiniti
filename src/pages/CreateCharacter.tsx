
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-1");
  const [selectedRegion, setSelectedRegion] = useState("asia");
  const { toast } = useToast();

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
    
    // In a real app, you would save the character and redirect
    console.log("Character created:", {
      name: characterName,
      avatar: selectedAvatar,
      region: selectedRegion,
    });
  };

  const avatars = [
    { id: "avatar-1", src: "/placeholder.svg" },
    { id: "avatar-2", src: "/placeholder.svg" },
    { id: "avatar-3", src: "/placeholder.svg" },
    { id: "avatar-4", src: "/placeholder.svg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-teal-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-8">Create Your Character</h1>
          <p className="text-center text-gray-600 mb-12">
            Customize your cultural ambassador and begin your journey around the world
          </p>

          <Card className="p-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="character-name">Character Name</Label>
                <Input
                  id="character-name"
                  placeholder="Enter a name for your character"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Choose Your Avatar</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {avatars.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`cursor-pointer rounded-lg p-2 transition-all ${
                        selectedAvatar === avatar.id
                          ? "ring-2 ring-teal-500 bg-teal-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedAvatar(avatar.id)}
                    >
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage src={avatar.src} alt="Avatar" />
                        <AvatarFallback>
                          {avatar.id.split("-")[1]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Starting Region</Label>
                <Tabs
                  defaultValue="asia"
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="asia">Asia</TabsTrigger>
                    <TabsTrigger value="europe">Europe</TabsTrigger>
                    <TabsTrigger value="africa">Africa</TabsTrigger>
                    <TabsTrigger value="americas">Americas</TabsTrigger>
                  </TabsList>
                  <TabsContent value="asia" className="p-4 bg-gray-50 rounded-md">
                    <p>Begin your journey in the rich and diverse cultures of Asia, from the spice markets of India to the temples of Japan.</p>
                  </TabsContent>
                  <TabsContent value="europe" className="p-4 bg-gray-50 rounded-md">
                    <p>Explore the historic castles, vibrant festivals, and culinary delights across the European continent.</p>
                  </TabsContent>
                  <TabsContent value="africa" className="p-4 bg-gray-50 rounded-md">
                    <p>Discover the rhythms, traditions, and natural wonders of Africa's many diverse cultures and landscapes.</p>
                  </TabsContent>
                  <TabsContent value="americas" className="p-4 bg-gray-50 rounded-md">
                    <p>Experience the melting pot of traditions from across North and South America, from carnival celebrations to indigenous heritage.</p>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-between pt-4">
                <Button asChild variant="outline">
                  <Link to="/">Go Back</Link>
                </Button>
                <Button onClick={handleCreateCharacter} className="bg-teal-500 hover:bg-teal-600">
                  Create Character
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateCharacter;

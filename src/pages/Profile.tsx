
import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Heart, Star, Map, Flag, Edit, Camera, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PageLayout from "@/components/PageLayout";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data
  const profile = {
    name: "Adventurer",
    level: 12,
    xp: 2460,
    nextLevel: 3000,
    avatar: "/placeholder.svg",
    location: "Asia Hub",
    bio: "Passionate about learning new cultures and making friends around the world!",
    regionsVisited: 3,
    collectionItems: 37,
    friends: 24,
    badges: [
      { id: 1, name: "Asia Expert", icon: <Trophy className="h-6 w-6 text-yellow-500" /> },
      { id: 2, name: "Recipe Master", icon: <Award className="h-6 w-6 text-teal-500" /> },
      { id: 3, name: "Friendly", icon: <Heart className="h-6 w-6 text-red-500" /> },
      { id: 4, name: "Collector", icon: <Star className="h-6 w-6 text-purple-500" /> },
    ],
    achievements: [
      { id: 1, name: "World Traveler", description: "Visited all cultural hubs", progress: 30 },
      { id: 2, name: "Multilingual", description: "Learned phrases in 10 languages", progress: 60 },
      { id: 3, name: "Culinary Expert", description: "Mastered 50 recipes", progress: 45 },
      { id: 4, name: "Cultural Ambassador", description: "Helped 100 players", progress: 25 },
    ],
    inventory: [
      { id: 1, name: "Japanese Kimono", type: "Clothing", rarity: "Uncommon" },
      { id: 2, name: "Moroccan Tagine Recipe", type: "Recipe", rarity: "Rare" },
      { id: 3, name: "Indian Spice Collection", type: "Collectible", rarity: "Common" },
      { id: 4, name: "Brazilian Carnival Mask", type: "Clothing", rarity: "Rare" },
    ]
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-playfair text-3xl font-bold">{profile.name}</h1>
              <Button variant="outline" size="sm" className="ml-2">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Map className="h-4 w-4 mr-1" />
              <span>{profile.location}</span>
              <Badge variant="outline" className="ml-3 text-teal-600">Level {profile.level}</Badge>
            </div>
            
            <p className="text-gray-600">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.badges.map(badge => (
                <div key={badge.id} className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border">
                  {badge.icon}
                  <span className="ml-1 text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
            
            <Progress value={(profile.xp / profile.nextLevel) * 100} className="h-2 mt-2" />
            <div className="text-xs text-gray-500">
              {profile.xp} / {profile.nextLevel} XP to Level {profile.level + 1}
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <Flag className="h-8 w-8 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Regions Visited</p>
                  <p className="text-2xl font-bold">{profile.regionsVisited}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Collection Items</p>
                  <p className="text-2xl font-bold">{profile.collectionItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-teal-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Friends</p>
                  <p className="text-2xl font-bold">{profile.friends}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{profile.bio}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Current Quest</h3>
                    <p className="text-gray-600">Japanese Tea Ceremony</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Next Destination</h3>
                    <p className="text-gray-600">Europe Hub</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-teal-100 rounded-full p-2 h-fit">
                      <Trophy className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed a Quest</p>
                      <p className="text-sm text-gray-500">Earned the "Sushi Master" achievement</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-teal-100 rounded-full p-2 h-fit">
                      <Heart className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Friend</p>
                      <p className="text-sm text-gray-500">Became friends with ExplorerJane</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-teal-100 rounded-full p-2 h-fit">
                      <ShoppingBag className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Item</p>
                      <p className="text-sm text-gray-500">Acquired "Korean Hanbok"</p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.achievements.map(achievement => (
                    <div key={achievement.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                        <span className="text-sm font-medium">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.badges.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center bg-white rounded-lg p-4 shadow-sm border">
                      <div className="bg-teal-50 rounded-full p-4 mb-3">
                        {badge.icon}
                      </div>
                      <span className="text-sm font-medium text-center">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.inventory.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${item.rarity === 'Common' ? 'border-gray-500 text-gray-500' : ''}
                          ${item.rarity === 'Uncommon' ? 'border-blue-500 text-blue-500' : ''}
                          ${item.rarity === 'Rare' ? 'border-purple-500 text-purple-500' : ''}
                        `}
                      >
                        {item.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Gamepad, Trophy, Star, Clock, Utensils, Speech, 
  Music, PenTool, Sparkles, Zap, Crown, ChefHat,
  Globe, Palette, CookingPot
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageLayout from "@/components/PageLayout";
import CookingChallenge from "@/components/games/CookingChallenge";
import LanguageChallenge from "@/components/games/LanguageChallenge";
import ArtStudio from "@/components/games/ArtStudio";
import BurgerTycoon from "@/components/games/BurgerTycoon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { soundManager } from "@/utils/soundUtils";

const MiniGames = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  const categories = [
    { id: "all", label: "All Games", icon: <Gamepad className="h-5 w-5" /> },
    { id: "cooking", label: "Cooking", icon: <Utensils className="h-5 w-5" /> },
    { id: "language", label: "Language", icon: <Speech className="h-5 w-5" /> },
    { id: "music", label: "Music", icon: <Music className="h-5 w-5" /> },
    { id: "art", label: "Art", icon: <PenTool className="h-5 w-5" /> },
  ];
  
  const games = [
    {
      id: 1,
      title: "Burger Tycoon",
      category: "cooking",
      image: "/lovable-uploads/371255ec-eeef-4782-8d23-8b28ebdf92b8.png",
      difficulty: "Medium",
      timeEstimate: "15 min",
      players: 156,
      description: "Run your own burger food truck! Cook patties, prepare ingredients, and serve hungry customers.",
      rewards: ["Master Chef Badge", "Restaurant Tycoon", "30 Cultural Points"],
      featured: true
    },
    {
      id: 2,
      title: "Language Passport",
      category: "language",
      image: "/placeholder.svg",
      difficulty: "Easy",
      timeEstimate: "5 min",
      players: 246,
      description: "Learn common greetings and phrases from different cultures through interactive flashcards.",
      rewards: ["Language Certificate", "Global Communicator Badge", "15 Cultural Points"],
      featured: false
    },
    {
      id: 3,
      title: "Rhythm of Nations",
      category: "music",
      image: "/placeholder.svg",
      difficulty: "Hard",
      timeEstimate: "8 min",
      players: 98,
      description: "Identify traditional musical instruments and play along with cultural rhythms.",
      rewards: ["Music Collector Badge", "Percussion Instrument", "25 Cultural Points"],
      featured: false
    },
    {
      id: 4,
      title: "Global Art Studio",
      category: "art",
      image: "/placeholder.svg",
      difficulty: "Medium",
      timeEstimate: "15 min",
      players: 87,
      description: "Create traditional art pieces using authentic techniques from different cultures.",
      rewards: ["Art Gallery Access", "Creative Spirit Badge", "20 Cultural Points"],
      featured: false
    },
    {
      id: 5,
      title: "Sushi Master Challenge",
      category: "cooking",
      image: "/lovable-uploads/9f8e05b4-7eaf-44a7-86fe-e150958b3278.png",
      difficulty: "Hard",
      timeEstimate: "10 min",
      players: 124,
      description: "Test your culinary skills by preparing delicious sushi dishes against the clock.",
      rewards: ["Recipe Collection", "Japanese Cooking Badge", "20 Cultural Points"],
      featured: true
    },
    {
      id: 6,
      title: "Translation Quest",
      category: "language",
      image: "/placeholder.svg",
      difficulty: "Medium",
      timeEstimate: "7 min",
      players: 156,
      description: "Translate phrases between multiple languages to help a virtual traveler navigate the world.",
      rewards: ["Translator Badge", "Language Dictionary", "18 Cultural Points"],
      featured: false
    },
  ];
  
  const filteredGames = selectedCategory && selectedCategory !== "all" 
    ? games.filter(game => game.category === selectedCategory)
    : games;
  
  const featuredGames = games.filter(game => game.featured);
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleGameClick = (game: { id: number; category: string }) => {
    soundManager.playSound("click");
    if (game.id === 1) {
      setActiveGame("burger-tycoon");
    } else if (game.category === "cooking" && game.id === 5) {
      setActiveGame("cooking-challenge");
    } else if (game.category === "language") {
      setActiveGame("language-challenge");
    } else if (game.category === "art") {
      setActiveGame("art-studio");
    }
  };

  const renderGamesList = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="font-playfair text-3xl font-bold">Cultural Mini-Games</h1>
        
        <div className="flex mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2 mr-2">
            <Trophy className="h-4 w-4" />
            My Achievements
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Play
          </Button>
        </div>
      </div>
      
      <div className="mb-12 relative overflow-hidden rounded-xl">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {featuredGames.map(game => (
            <motion.div 
              key={game.id}
              className="min-w-[300px] md:min-w-[500px] relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-64 relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <Badge className="w-fit mb-2 bg-teal-500">Featured Game</Badge>
                    <h2 className="text-2xl font-bold text-white mb-2">{game.title}</h2>
                    <p className="text-white/80 mb-4">{game.description}</p>
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-white/20 text-white border-none">
                          <Clock className="mr-1 h-3 w-3" />
                          {game.timeEstimate}
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-none">
                          {game.difficulty}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-teal-500 hover:bg-teal-600"
                        onClick={() => handleGameClick(game)}
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="games" className="mb-8">
        <TabsList>
          <TabsTrigger value="games">All Games</TabsTrigger>
          <TabsTrigger value="cooking" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Cooking Challenges
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Speech className="h-4 w-4" />
            Language Games
          </TabsTrigger>
          <TabsTrigger value="art" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Art Studio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="games">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Game Categories</h2>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={selectedCategory === category.id ? "bg-teal-500 hover:bg-teal-600" : ""}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon}
                  <span className="ml-2">{category.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGames.map(game => (
              <motion.div
                key={game.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="h-40 relative">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    <Badge 
                      className={`absolute top-2 right-2 ${getDifficultyColor(game.difficulty)}`}
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                    
                    <div className="flex items-center mb-3">
                      {game.category === "cooking" && <Utensils className="h-4 w-4 text-teal-500 mr-2" />}
                      {game.category === "language" && <Speech className="h-4 w-4 text-teal-500 mr-2" />}
                      {game.category === "music" && <Music className="h-4 w-4 text-teal-500 mr-2" />}
                      {game.category === "art" && <PenTool className="h-4 w-4 text-teal-500 mr-2" />}
                      <span className="text-sm text-gray-600 capitalize">{game.category}</span>
                      <div className="ml-auto flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{game.timeEstimate}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                    
                    <div className="border-t pt-3 mt-auto">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">Rewards:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {game.rewards.slice(0, 2).map((reward, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                        {game.rewards.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{game.rewards.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {[...Array(3)].map((_, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-white">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>U{i+1}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{game.players} players</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-teal-500 hover:bg-teal-600"
                      onClick={() => handleGameClick(game)}
                    >
                      Play
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cooking">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <ChefHat className="h-6 w-6 text-teal-500" />
              Cooking Challenges
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore global cuisines and learn authentic cooking techniques through fun, interactive challenges.
            </p>
            
            <div className="mt-4 flex space-x-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setActiveGame("burger-tycoon")}
              >
                <CookingPot className="mr-2 h-5 w-5" />
                Play Burger Tycoon
              </Button>
              
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600"
                onClick={() => setActiveGame("cooking-challenge")}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Start Sushi Challenge
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.filter(game => game.category === "cooking").map(game => (
              <Card key={game.id} className="overflow-hidden">
                <div className="h-32 relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <Badge 
                    className={`absolute top-2 right-2 ${getDifficultyColor(game.difficulty)}`}
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    onClick={() => handleGameClick(game)}
                  >
                    Play
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="language">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Speech className="h-6 w-6 text-blue-500" />
              Language Games
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn common phrases from different cultures and expand your language skills through interactive challenges.
            </p>
            
            <div className="mt-4">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setActiveGame("language-challenge")}
              >
                <Globe className="mr-2 h-5 w-5" />
                Start Language Challenge
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.filter(game => game.category === "language").map(game => (
              <Card key={game.id} className="overflow-hidden">
                <div className="h-32 relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <Badge 
                    className={`absolute top-2 right-2 ${getDifficultyColor(game.difficulty)}`}
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleGameClick(game)}
                  >
                    Play
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="art">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <PenTool className="h-6 w-6 text-purple-500" />
              Art Studio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create traditional art pieces using authentic techniques from different cultures around the world.
            </p>
            
            <div className="mt-4">
              <Button 
                size="lg" 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={() => setActiveGame("art-studio")}
              >
                <Palette className="mr-2 h-5 w-5" />
                Start Art Challenge
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.filter(game => game.category === "art").map(game => (
              <Card key={game.id} className="overflow-hidden">
                <div className="h-32 relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <Badge 
                    className={`absolute top-2 right-2 ${getDifficultyColor(game.difficulty)}`}
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    onClick={() => handleGameClick(game)}
                  >
                    Play
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className={`flex items-center p-3 rounded-lg ${idx === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  idx === 1 ? 'bg-gray-100 text-gray-700' : 
                  idx === 2 ? 'bg-amber-100 text-amber-700' : 
                  'bg-white text-gray-500 border'
                }`}>
                  {idx === 0 ? <Crown className="h-4 w-4" /> : idx + 1}
                </div>
                
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U{idx+1}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="font-medium truncate">
                      {idx === 0 ? "CultureMaster" : 
                       idx === 1 ? "GlobalExplorer" : 
                       idx === 2 ? "ArtisticSoul" : 
                       idx === 3 ? "CulinaryWhiz" : 
                       "LanguageGenius"}
                    </p>
                    {idx < 3 && (
                      <Badge className={`ml-2 ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        idx === 1 ? 'bg-gray-100 text-gray-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        Top {idx + 1}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      {5000 - idx * 500} Cultural Points
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex">
                    <Badge className="mr-1 bg-teal-100 text-teal-700">
                      {30 - idx * 2} Games
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {15 - idx} Badges
                    </Badge>
                  </div>
                  <Progress 
                    value={100 - idx * 12} 
                    className="h-1.5 w-24 mt-2" 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">View Full Leaderboard</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Gaming Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Recent Achievements</h3>
              <div className="space-y-2">
                {["Sushi Expert", "Language Beginner", "Cultural Ambassador"].map((achievement, idx) => (
                  <div key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <div className="bg-teal-100 p-2 rounded-full mr-3">
                      <Trophy className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement}</p>
                      <p className="text-xs text-gray-500">Earned {idx + 1} day{idx !== 0 ? 's' : ''} ago</p>
                    </div>
                    <Badge className="ml-auto">{(idx + 1) * 10} CP</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Game Completion</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Cooking Games</span>
                    <span className="text-sm text-gray-500">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Language Games</span>
                    <span className="text-sm text-gray-500">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Music Games</span>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Art Games</span>
                    <span className="text-sm text-gray-500">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Overall Progress</p>
                    <p className="text-sm text-gray-500">Level 8 Explorer</p>
                  </div>
                  <Button variant="outline" size="sm">View All Games</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <PageLayout fullWidth={activeGame !== null}>
      {activeGame === "burger-tycoon" ? (
        <div className="mx-auto max-w-6xl">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setActiveGame(null)}
          >
            Back to Games
          </Button>
          <BurgerTycoon />
        </div>
      ) : activeGame === "cooking-challenge" ? (
        <div className="mx-auto max-w-6xl">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setActiveGame(null)}
          >
            Back to Games
          </Button>
          <CookingChallenge />
        </div>
      ) : activeGame === "language-challenge" ? (
        <div className="mx-auto max-w-6xl">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setActiveGame(null)}
          >
            Back to Games
          </Button>
          <LanguageChallenge />
        </div>
      ) : activeGame === "art-studio" ? (
        <div className="mx-auto max-w-6xl">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setActiveGame(null)}
          >
            Back to Games
          </Button>
          <ArtStudio />
        </div>
      ) : (
        renderGamesList()
      )}
    </PageLayout>
  );
};

export default MiniGames;

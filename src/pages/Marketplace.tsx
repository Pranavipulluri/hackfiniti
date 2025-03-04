
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Filter, Star, ArrowUpDown, Tag, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageLayout from "@/components/PageLayout";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Mock data
  const categories = ["all", "clothing", "recipes", "collectibles", "language", "art"];
  
  const items = [
    {
      id: 1,
      name: "Traditional Japanese Kimono",
      category: "clothing",
      price: 1200,
      seller: {
        name: "CultureExplorer",
        avatar: "/placeholder.svg",
        rating: 4.8
      },
      likes: 56,
      image: "/placeholder.svg",
      region: "Asia",
      rarity: "Rare"
    },
    {
      id: 2,
      name: "Italian Pasta Making Kit",
      category: "recipes",
      price: 850,
      seller: {
        name: "ChefAdventurer",
        avatar: "/placeholder.svg",
        rating: 4.9
      },
      likes: 42,
      image: "/placeholder.svg",
      region: "Europe",
      rarity: "Uncommon"
    },
    {
      id: 3,
      name: "African Tribal Mask",
      category: "art",
      price: 1500,
      seller: {
        name: "ArtCollector",
        avatar: "/placeholder.svg",
        rating: 4.7
      },
      likes: 75,
      image: "/placeholder.svg",
      region: "Africa",
      rarity: "Legendary"
    },
    {
      id: 4,
      name: "Traditional Mexican Phrases",
      category: "language",
      price: 600,
      seller: {
        name: "LanguageLover",
        avatar: "/placeholder.svg",
        rating: 4.5
      },
      likes: 38,
      image: "/placeholder.svg",
      region: "Americas",
      rarity: "Common"
    },
    {
      id: 5,
      name: "Indian Spice Collection",
      category: "collectibles",
      price: 950,
      seller: {
        name: "SpiceTrader",
        avatar: "/placeholder.svg",
        rating: 4.6
      },
      likes: 64,
      image: "/placeholder.svg",
      region: "Asia",
      rarity: "Uncommon"
    },
    {
      id: 6,
      name: "Nordic Winter Outfit",
      category: "clothing",
      price: 1100,
      seller: {
        name: "NordicExplorer",
        avatar: "/placeholder.svg",
        rating: 4.7
      },
      likes: 48,
      image: "/placeholder.svg",
      region: "Europe",
      rarity: "Rare"
    },
  ];
  
  const filteredItems = items.filter(item => 
    (activeCategory === "all" || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case "Common": return "bg-gray-100 text-gray-600";
      case "Uncommon": return "bg-green-100 text-green-600";
      case "Rare": return "bg-blue-100 text-blue-600";
      case "Legendary": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="font-playfair text-3xl font-bold">Cultural Marketplace</h1>
          
          <div className="flex mt-4 md:mt-0">
            <Button variant="outline" className="mr-2">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Trades
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Tag className="mr-2 h-4 w-4" />
              List Item
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search items, categories, regions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="latest">
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Categories tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="w-full flex h-auto bg-transparent p-0 overflow-x-auto">
            {categories.map(category => (
              <TabsTrigger 
                key={category}
                value={category}
                className="py-2 px-4 capitalize data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg mr-2"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Item grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Badge className={`absolute top-2 left-2 ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </Badge>
                </div>
                
                <CardContent className="p-4 flex-1">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-sm">
                      {item.region}
                    </Badge>
                    <Badge variant="outline" className="text-sm ml-2 capitalize">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                  
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={item.seller.avatar} alt={item.seller.name} />
                      <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{item.seller.name}</span>
                    <div className="ml-auto flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{item.seller.rating}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 border-t mt-auto">
                  <div className="flex justify-between items-center w-full">
                    <div className="font-bold text-xl text-teal-600">{item.price} <span className="text-sm">CP</span></div>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600">Trade</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Marketplace;

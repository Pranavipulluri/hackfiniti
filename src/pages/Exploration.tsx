
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, MapPin, Map, Compass, Users, Info, 
  Calendar, Star, ArrowRight, Trophy, ArrowLeft, 
  ArrowRight as ArrowRightIcon 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageLayout from "@/components/PageLayout";

const Exploration = () => {
  const [activeRegion, setActiveRegion] = useState("asia");
  
  // Mock data
  const regions = [
    { id: "asia", name: "Asia", color: "bg-red-500", users: 248, quests: 42, landmarks: 36 },
    { id: "europe", name: "Europe", color: "bg-blue-500", users: 184, quests: 38, landmarks: 28 },
    { id: "africa", name: "Africa", color: "bg-yellow-500", users: 126, quests: 30, landmarks: 24 },
    { id: "americas", name: "Americas", color: "bg-green-500", users: 156, quests: 35, landmarks: 30 },
    { id: "oceania", name: "Oceania", color: "bg-purple-500", users: 98, quests: 22, landmarks: 18 },
  ];
  
  const culturalSites = {
    asia: [
      { id: 1, name: "Tokyo Cultural Center", country: "Japan", visitors: 153, rating: 4.8, image: "/placeholder.svg", featured: true },
      { id: 2, name: "Seoul Heritage Village", country: "South Korea", visitors: 124, rating: 4.7, image: "/placeholder.svg" },
      { id: 3, name: "Beijing Ancient City", country: "China", visitors: 145, rating: 4.6, image: "/placeholder.svg" },
      { id: 4, name: "Thai Cooking School", country: "Thailand", visitors: 98, rating: 4.9, image: "/placeholder.svg" },
      { id: 5, name: "Indian Temple Complex", country: "India", visitors: 112, rating: 4.5, image: "/placeholder.svg" },
    ],
    europe: [
      { id: 6, name: "Paris Art District", country: "France", visitors: 178, rating: 4.9, image: "/placeholder.svg", featured: true },
      { id: 7, name: "Rome Historical Center", country: "Italy", visitors: 166, rating: 4.7, image: "/placeholder.svg" },
      { id: 8, name: "Barcelona Culture Hub", country: "Spain", visitors: 142, rating: 4.8, image: "/placeholder.svg" },
      { id: 9, name: "Swiss Alpine Village", country: "Switzerland", visitors: 87, rating: 4.6, image: "/placeholder.svg" },
      { id: 10, name: "London Museum District", country: "UK", visitors: 156, rating: 4.5, image: "/placeholder.svg" },
    ],
    africa: [
      { id: 11, name: "Marrakech Medina", country: "Morocco", visitors: 132, rating: 4.8, image: "/placeholder.svg", featured: true },
      { id: 12, name: "Cairo Pavilion", country: "Egypt", visitors: 125, rating: 4.7, image: "/placeholder.svg" },
      { id: 13, name: "Nairobi Cultural Park", country: "Kenya", visitors: 94, rating: 4.6, image: "/placeholder.svg" },
      { id: 14, name: "Cape Town Heritage Site", country: "South Africa", visitors: 106, rating: 4.5, image: "/placeholder.svg" },
      { id: 15, name: "Lagos Art Quarter", country: "Nigeria", visitors: 85, rating: 4.4, image: "/placeholder.svg" },
    ],
    americas: [
      { id: 16, name: "New York Melting Pot", country: "USA", visitors: 187, rating: 4.7, image: "/placeholder.svg", featured: true },
      { id: 17, name: "Mexico City Plaza", country: "Mexico", visitors: 145, rating: 4.8, image: "/placeholder.svg" },
      { id: 18, name: "Rio Carnival Center", country: "Brazil", visitors: 156, rating: 4.9, image: "/placeholder.svg" },
      { id: 19, name: "Peruvian Andes Village", country: "Peru", visitors: 92, rating: 4.6, image: "/placeholder.svg" },
      { id: 20, name: "Canadian Heritage Park", country: "Canada", visitors: 108, rating: 4.5, image: "/placeholder.svg" },
    ],
    oceania: [
      { id: 21, name: "Sydney Cultural Harbor", country: "Australia", visitors: 142, rating: 4.8, image: "/placeholder.svg", featured: true },
      { id: 22, name: "Maori Heritage Center", country: "New Zealand", visitors: 98, rating: 4.7, image: "/placeholder.svg" },
      { id: 23, name: "Fiji Island Village", country: "Fiji", visitors: 76, rating: 4.9, image: "/placeholder.svg" },
      { id: 24, name: "Samoan Cultural Site", country: "Samoa", visitors: 64, rating: 4.6, image: "/placeholder.svg" },
      { id: 25, name: "Tahiti Pearl Center", country: "French Polynesia", visitors: 84, rating: 4.5, image: "/placeholder.svg" },
    ]
  };
  
  const currentRegionData = regions.find(r => r.id === activeRegion);
  const currentFeaturedSite = culturalSites[activeRegion as keyof typeof culturalSites].find(site => site.featured);
  
  // Get cultural sites for the active region
  const activeSites = culturalSites[activeRegion as keyof typeof culturalSites];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="font-playfair text-3xl font-bold">Cultural Exploration</h1>
          
          <div className="flex mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2 mr-2">
              <Map className="h-4 w-4" />
              My Itinerary
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Start Exploring
            </Button>
          </div>
        </div>
        
        {/* World Map */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gray-100 p-4 relative h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-20 w-20 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Interactive World Map</h2>
              <p className="text-gray-600">Choose a region to explore cultural sites and traditions</p>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <Tabs 
              value={activeRegion} 
              onValueChange={setActiveRegion} 
              className="w-full"
            >
              <TabsList className="w-full flex h-auto bg-transparent p-0 overflow-x-auto">
                {regions.map(region => (
                  <TabsTrigger 
                    key={region.id}
                    value={region.id}
                    className="flex items-center gap-2 py-2 px-4 capitalize data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg mr-2"
                  >
                    <span className={`w-3 h-3 rounded-full ${region.color}`}></span>
                    {region.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Active Explorers</p>
                    <p className="font-bold">{currentRegionData?.users}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Cultural Quests</p>
                    <p className="font-bold">{currentRegionData?.quests}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Landmarks</p>
                    <p className="font-bold">{currentRegionData?.landmarks}</p>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </Card>
        
        {/* Featured Cultural Site */}
        {currentFeaturedSite && (
          <Card className="mb-8 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                <img 
                  src={currentFeaturedSite.image} 
                  alt={currentFeaturedSite.name} 
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-teal-500">Featured Destination</Badge>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-teal-500 mr-2" />
                  <span className="text-gray-600">{currentFeaturedSite.country}</span>
                  <Badge variant="outline" className="ml-auto flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    {currentFeaturedSite.rating}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{currentFeaturedSite.name}</h2>
                <p className="text-gray-600 mb-6">
                  Immerse yourself in the rich cultural tapestry of {currentFeaturedSite.country}. 
                  This vibrant hub offers traditional experiences, from culinary workshops to language 
                  exchange opportunities and authentic cultural performances.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{currentFeaturedSite.visitors} explorers visited</span>
                  </div>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    Explore Site
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Cultural Sites Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Cultural Sites in {currentRegionData?.name}</h2>
            <Button variant="outline" size="sm">
              See All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSites.filter(site => !site.featured).slice(0, 3).map(site => (
              <motion.div
                key={site.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="h-40 bg-gray-100 relative">
                    <img 
                      src={site.image} 
                      alt={site.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-teal-500 mr-2" />
                      <span className="text-sm text-gray-600">{site.country}</span>
                      <Badge variant="outline" className="ml-auto flex items-center text-xs">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {site.rating}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold mb-2">{site.name}</h3>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">
                        <Users className="h-3 w-3 inline mr-1" />
                        {site.visitors} visitors
                      </span>
                      <Button size="sm" variant="outline">
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Cultural Events Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                Upcoming Cultural Events
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="min-w-16 w-16 h-16 rounded-lg bg-teal-100 flex flex-col items-center justify-center text-teal-700">
                      <span className="text-lg font-bold">{15 + i}</span>
                      <span className="text-xs">June</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {activeRegion === 'asia' && "Japanese Tea Ceremony Workshop"}
                        {activeRegion === 'europe' && "Italian Pasta Making Class"}
                        {activeRegion === 'africa' && "African Drumming Circle"}
                        {activeRegion === 'americas' && "Latin Dance Festival"}
                        {activeRegion === 'oceania' && "Maori Cultural Performance"}
                      </h3>
                      
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        <Info className="h-3 w-3 mr-1" />
                        <span>
                          {activeRegion === 'asia' && "Learn the ancient art of Japanese tea preparation"}
                          {activeRegion === 'europe' && "Master traditional pasta techniques with local chefs"}
                          {activeRegion === 'africa' && "Experience rhythms and musical traditions"}
                          {activeRegion === 'americas' && "Celebrate with salsa, bachata and more"}
                          {activeRegion === 'oceania' && "Witness traditional songs and dances"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, j) => (
                            <Avatar key={j} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>U{j+1}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                            +{12 + i}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline">
                          Join Event
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Exploration;

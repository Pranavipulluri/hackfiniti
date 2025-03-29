
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  ChevronLeft, 
  Info, 
  Flag, 
  Compass, 
  Globe,
  ArrowLeft,
  Calendar  // Added the missing Calendar import
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Map image paths for different regions
const regionMapImages = {
  asia: "/lovable-uploads/30e5b83a-25ac-43e1-90d3-80a21f1a319e.png",
  europe: "/lovable-uploads/cbe5bfa0-e4c5-49b1-a687-8151662d21ea.png",
  africa: "/lovable-uploads/69fb4eb9-b78c-4c43-9918-c5aed7be4bcc.png",
  americas: "/lovable-uploads/fb03e8d4-7a19-44d4-9fc3-9dd04a6476f8.png",
  oceania: "/lovable-uploads/ca30d5b2-84a6-4e29-94f7-6ba0499996c1.png",
  india: "/lovable-uploads/81342f88-cc2b-47e3-867e-b10f1e059c2c.png",
};

// Types for region data
export type RegionData = {
  id: string;
  name: string;
  color: string;
  users: number;
  quests: number;
  landmarks: number;
  countries: CountryData[];
};

export type CountryData = {
  id: string;
  name: string;
  flagCode?: string;
  culturalSites: number;
  primaryLanguage: string;
  description: string;
  states?: StateData[];
};

export type StateData = {
  id: string;
  name: string;
  description: string;
  culturalHeritage: string[];
  culturalEvents: EventData[];
};

export type EventData = {
  id: string;
  name: string;
  description: string;
  date: string;
  image: string;
};

// Mock data
const regionData: Record<string, RegionData> = {
  asia: {
    id: "asia",
    name: "Asia",
    color: "bg-red-500",
    users: 248,
    quests: 42,
    landmarks: 36,
    countries: [
      {
        id: "india",
        name: "India",
        flagCode: "in",
        culturalSites: 35,
        primaryLanguage: "Hindi, English, and 21 other official languages",
        description: "India, known for its rich cultural heritage and diverse traditions, is one of the oldest civilizations in the world. From the majestic Himalayas to the backwaters of Kerala, India offers a potpourri of landscapes, cuisines, arts, and religions.",
        states: [
          {
            id: "kerala",
            name: "Kerala",
            description: "Kerala, known as 'God's Own Country', is famous for its picturesque backwaters, lush greenery, and unique cultural traditions. Located on the southwestern Malabar Coast of India, Kerala is known for its palm-lined beaches, backwaters, and a network of canals.",
            culturalHeritage: [
              "Kathakali - Classical dance form known for colorful makeup and costumes",
              "Theyyam - Ritual dance worship with elaborate costumes and body painting",
              "Mohiniyattam - Classical dance form with graceful, swaying movements",
              "Kalaripayattu - Ancient martial art, considered one of the oldest fighting systems",
              "Kerala Architecture - Unique temple and house designs adapted to the tropical climate"
            ],
            culturalEvents: [
              {
                id: "onam",
                name: "Onam Festival",
                description: "The harvest festival of Kerala featuring boat races, floral decorations (pookalam), feasts (Onasadya), and folk dances.",
                date: "August-September (varies yearly)",
                image: "/placeholder.svg"
              },
              {
                id: "vishu",
                name: "Vishu",
                description: "The Kerala New Year celebration featuring Vishukkani (first sight arrangements), giving of money (Vishukaineetam), and a feast.",
                date: "April 14/15",
                image: "/placeholder.svg"
              },
              {
                id: "thrissur-pooram",
                name: "Thrissur Pooram",
                description: "A spectacular temple festival featuring caparisoned elephants, traditional music, and an umbrella display competition.",
                date: "April-May",
                image: "/placeholder.svg"
              }
            ]
          },
          {
            id: "tamil-nadu",
            name: "Tamil Nadu",
            description: "Tamil Nadu, in southern India, is known for its Tamil culture, Dravidian temples, classical dance forms, and cuisine.",
            culturalHeritage: [
              "Bharatanatyam - Classical dance form",
              "Carnatic Music - Classical music tradition"
            ],
            culturalEvents: [
              {
                id: "pongal",
                name: "Pongal",
                description: "A four-day harvest festival dedicated to the Sun God.",
                date: "January 14-17",
                image: "/placeholder.svg"
              }
            ]
          }
        ]
      },
      {
        id: "japan",
        name: "Japan",
        flagCode: "jp",
        culturalSites: 24,
        primaryLanguage: "Japanese",
        description: "Japan blends ancient traditions with cutting-edge technology, from historic temples and geishas to bustling modern cities.",
        states: []
      },
      {
        id: "china",
        name: "China",
        flagCode: "cn",
        culturalSites: 28,
        primaryLanguage: "Mandarin Chinese",
        description: "China's ancient civilization spans thousands of years with rich traditions in art, philosophy, and cuisine.",
        states: []
      }
    ]
  },
  europe: {
    id: "europe",
    name: "Europe",
    color: "bg-blue-500",
    users: 184,
    quests: 38,
    landmarks: 28,
    countries: [
      {
        id: "france",
        name: "France",
        flagCode: "fr",
        culturalSites: 22,
        primaryLanguage: "French",
        description: "Known for its art, cuisine, and famous landmarks like the Eiffel Tower and Louvre Museum.",
        states: []
      },
      {
        id: "italy",
        name: "Italy",
        flagCode: "it",
        culturalSites: 25,
        primaryLanguage: "Italian",
        description: "Home to many of the world's greatest works of art, architecture, and gastronomy.",
        states: []
      }
    ]
  },
  africa: {
    id: "africa",
    name: "Africa",
    color: "bg-yellow-500",
    users: 126,
    quests: 30,
    landmarks: 24,
    countries: [
      {
        id: "egypt",
        name: "Egypt",
        flagCode: "eg",
        culturalSites: 18,
        primaryLanguage: "Arabic",
        description: "Famous for its ancient civilization, pyramids, and the Nile River.",
        states: []
      },
      {
        id: "south-africa",
        name: "South Africa",
        flagCode: "za",
        culturalSites: 15,
        primaryLanguage: "11 official languages including English, Afrikaans, Zulu",
        description: "Known for its diverse cultures, landscapes, and wildlife.",
        states: []
      }
    ]
  },
  americas: {
    id: "americas",
    name: "Americas",
    color: "bg-green-500",
    users: 156,
    quests: 35,
    landmarks: 30,
    countries: [
      {
        id: "usa",
        name: "United States",
        flagCode: "us",
        culturalSites: 24,
        primaryLanguage: "English",
        description: "A melting pot of cultures with diverse landscapes from mountains to deserts.",
        states: []
      },
      {
        id: "brazil",
        name: "Brazil",
        flagCode: "br",
        culturalSites: 20,
        primaryLanguage: "Portuguese",
        description: "Known for its carnival, soccer culture, and Amazon rainforest.",
        states: []
      }
    ]
  },
  oceania: {
    id: "oceania",
    name: "Oceania",
    color: "bg-purple-500",
    users: 98,
    quests: 22,
    landmarks: 18,
    countries: [
      {
        id: "australia",
        name: "Australia",
        flagCode: "au",
        culturalSites: 14,
        primaryLanguage: "English",
        description: "Famous for its unique wildlife, natural wonders, and vibrant cities.",
        states: []
      },
      {
        id: "new-zealand",
        name: "New Zealand",
        flagCode: "nz",
        culturalSites: 12,
        primaryLanguage: "English, Māori",
        description: "Known for its stunning landscapes, Māori culture, and outdoor adventures.",
        states: []
      }
    ]
  }
};

interface RegionMapProps {
  initialRegion?: string;
}

const RegionMap = ({ initialRegion = "asia" }: RegionMapProps) => {
  // Navigation state
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Reset state when the region changes
  useEffect(() => {
    setSelectedCountry(null);
    setSelectedState(null);
    setNavigationHistory([]);
  }, [selectedRegion]);

  // Get the current region data
  const currentRegionData = regionData[selectedRegion];
  
  // Handle navigation
  const navigateToCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setNavigationHistory([...navigationHistory, 'region']);
  };
  
  const navigateToState = (state: StateData) => {
    setSelectedState(state);
    setNavigationHistory([...navigationHistory, 'country']);
  };
  
  const navigateBack = () => {
    const lastStep = navigationHistory.pop();
    
    if (lastStep === 'country') {
      setSelectedState(null);
      setNavigationHistory([...navigationHistory]);
    } else if (lastStep === 'region') {
      setSelectedCountry(null);
      setNavigationHistory([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white"
          onClick={() => setSelectedRegion(initialRegion)}
        >
          <Globe className="h-4 w-4 mr-1" />
          World
        </Button>
        
        {selectedRegion && (
          <>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => {
                setSelectedCountry(null);
                setSelectedState(null);
                setNavigationHistory([]);
              }}
            >
              {currentRegionData.name}
            </Button>
          </>
        )}
        
        {selectedCountry && (
          <>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => {
                setSelectedState(null);
                setNavigationHistory(['region']);
              }}
            >
              {selectedCountry.name}
            </Button>
          </>
        )}
        
        {selectedState && (
          <>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
            >
              {selectedState.name}
            </Button>
          </>
        )}
      </div>

      {/* Back button (when in country or state view) */}
      {navigationHistory.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={navigateBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      {/* Region Selection Tabs (only show if not in country or state view) */}
      {!selectedCountry && (
        <NavigationMenu className="max-w-full w-full justify-start mb-6">
          <NavigationMenuList className="w-full flex h-auto bg-transparent p-0 overflow-x-auto space-x-2">
            {Object.values(regionData).map(region => (
              <NavigationMenuItem key={region.id}>
                <NavigationMenuLink
                  className={`flex items-center gap-2 py-2 px-4 capitalize rounded-lg ${
                    selectedRegion === region.id 
                      ? 'bg-teal-100 text-teal-700' 
                      : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                  }`}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  <span className={`w-3 h-3 rounded-full ${region.color}`}></span>
                  {region.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}

      {/* Region View */}
      {!selectedCountry && !selectedState && (
        <div className="space-y-6">
          {/* Map Display */}
          <Card className="overflow-hidden border-0 bg-transparent shadow-none">
            <div className="relative h-[400px] rounded-xl overflow-hidden border border-teal-500/30">
              <img 
                src={regionMapImages[selectedRegion]} 
                alt={`Map of ${currentRegionData.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                <h3 className="font-bold text-teal-400">{currentRegionData.name}</h3>
                <p className="text-xs text-gray-300">Click on countries to explore their culture</p>
              </div>
            </div>
          </Card>

          {/* Countries in Region */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Countries in {currentRegionData.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRegionData.countries.map(country => (
                <motion.div
                  key={country.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigateToCountry(country)}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden bg-slate-800/80 border border-teal-500/30 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-xl text-white">{country.name}</h3>
                        {country.flagCode && (
                          <span className="text-2xl">{country.flagCode === 'in' ? '🇮🇳' : 
                                                     country.flagCode === 'jp' ? '🇯🇵' : 
                                                     country.flagCode === 'cn' ? '🇨🇳' : 
                                                     country.flagCode === 'fr' ? '🇫🇷' : 
                                                     country.flagCode === 'it' ? '🇮🇹' : 
                                                     country.flagCode === 'eg' ? '🇪🇬' : 
                                                     country.flagCode === 'za' ? '🇿🇦' : 
                                                     country.flagCode === 'us' ? '🇺🇸' : 
                                                     country.flagCode === 'br' ? '🇧🇷' : 
                                                     country.flagCode === 'au' ? '🇦🇺' : 
                                                     country.flagCode === 'nz' ? '🇳🇿' : '🏳️'}</span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 flex-grow">{country.description.length > 120 ? `${country.description.substring(0, 120)}...` : country.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-teal-800/30 text-teal-300 border-teal-500/30">
                          <Compass className="h-3 w-3 mr-1" />
                          {country.culturalSites} sites
                        </Badge>
                        <Badge variant="outline" className="bg-teal-800/30 text-teal-300 border-teal-500/30">
                          <Info className="h-3 w-3 mr-1" />
                          {country.primaryLanguage.length > 15 ? `${country.primaryLanguage.substring(0, 15)}...` : country.primaryLanguage}
                        </Badge>
                      </div>
                      
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 mt-auto">
                        Explore Culture
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Country View */}
      {selectedCountry && !selectedState && (
        <div className="space-y-6">
          <Card className="bg-slate-800/80 border border-teal-500/30 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedCountry.name}</h2>
                  <p className="text-gray-300">{selectedCountry.description}</p>
                </div>
                {selectedCountry.flagCode && (
                  <span className="text-4xl">{selectedCountry.flagCode === 'in' ? '🇮🇳' : 
                                             selectedCountry.flagCode === 'jp' ? '🇯🇵' : 
                                             selectedCountry.flagCode === 'cn' ? '🇨🇳' : 
                                             selectedCountry.flagCode === 'fr' ? '🇫🇷' : 
                                             selectedCountry.flagCode === 'it' ? '🇮🇹' : 
                                             selectedCountry.flagCode === 'eg' ? '🇪🇬' : 
                                             selectedCountry.flagCode === 'za' ? '🇿🇦' : 
                                             selectedCountry.flagCode === 'us' ? '🇺🇸' : 
                                             selectedCountry.flagCode === 'br' ? '🇧🇷' : 
                                             selectedCountry.flagCode === 'au' ? '🇦🇺' : 
                                             selectedCountry.flagCode === 'nz' ? '🇳🇿' : '🏳️'}</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Primary Language</p>
                  <p className="font-medium text-white">{selectedCountry.primaryLanguage}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Cultural Sites</p>
                  <p className="font-medium text-white">{selectedCountry.culturalSites}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Region</p>
                  <p className="font-medium text-white">{currentRegionData.name}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Active Explorers</p>
                  <p className="font-medium text-white">{Math.floor(currentRegionData.users / currentRegionData.countries.length)}</p>
                </div>
              </div>

              {/* Map for India */}
              {selectedCountry.id === "india" && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">States of India</h3>
                  <div className="relative h-[400px] rounded-xl overflow-hidden border border-teal-500/30 mb-4">
                    <img 
                      src={regionMapImages.india} 
                      alt="Map of India"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                      <p className="text-xs text-gray-300">Click on states to explore their unique culture</p>
                    </div>
                  </div>
                </div>
              )}

              {/* States List (for India) */}
              {selectedCountry.states && selectedCountry.states.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">States & Union Territories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCountry.states.map(state => (
                      <motion.div
                        key={state.id}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigateToState(state)}
                        className="cursor-pointer"
                      >
                        <Card className="overflow-hidden bg-teal-900/20 border border-teal-500/30 h-full">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-lg text-white mb-2">{state.name}</h4>
                            <p className="text-gray-300 text-sm mb-3">{state.description.length > 100 ? `${state.description.substring(0, 100)}...` : state.description}</p>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Explore Culture
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* State View (Kerala) */}
      {selectedState && (
        <div className="space-y-6">
          <Card className="bg-slate-800/80 border border-teal-500/30 overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedState.name}</h2>
              <p className="text-gray-300 mb-6">{selectedState.description}</p>
              
              {/* Cultural Heritage */}
              <h3 className="text-xl font-semibold text-white mb-3">Cultural Heritage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedState.culturalHeritage.map((heritage, index) => (
                  <Card key={index} className="bg-slate-700/50 border border-teal-500/20">
                    <CardContent className="p-4">
                      <div className="flex">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-3">
                          {index + 1}
                        </span>
                        <p className="text-white">{heritage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Cultural Events */}
              <h3 className="text-xl font-semibold text-white mb-3">Cultural Events & Festivals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedState.culturalEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                    <div className="h-40 bg-slate-600 relative">
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">{event.name}</h4>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center text-gray-300 text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-1 text-teal-400" />
                        {event.date}
                      </div>
                      <p className="text-gray-300 text-sm">{event.description}</p>
                      <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Sadya cultural connection */}
              {selectedState.id === "kerala" && (
                <Card className="mt-6 bg-gradient-to-r from-teal-900/40 to-slate-800/60 border border-teal-500/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-1/3 h-48 bg-slate-700 rounded-lg overflow-hidden">
                        <img src="/placeholder.svg" alt="Kerala Sadya" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-full md:w-2/3">
                        <Badge className="mb-2 bg-teal-500">Cultural Experience</Badge>
                        <h3 className="text-2xl font-bold text-white mb-2">Kerala Sadya: The Traditional Feast</h3>
                        <p className="text-gray-300 mb-4">
                          The Kerala Sadya is a traditional vegetarian feast served on a banana leaf, usually during festivals like Onam and Vishu. It includes a variety of dishes like avial, sambar, olan, thoran, pachadi, and payasam, each with its specific place on the banana leaf.
                        </p>
                        <Button className="bg-teal-600 hover:bg-teal-700">
                          Try Cooking Sadya
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RegionMap;

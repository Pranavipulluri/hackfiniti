import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  ChevronLeft, 
  Info, 
  Flag, 
  Compass, 
  Globe,
  ArrowLeft,
  Calendar,
  Music,
  Utensils,
  BookOpen,
  Paintbrush,
  Camera,
  Building,
  Palmtree,
  Heart,
  MapIcon,
  Users,
  Home,
  Sparkles,
  Waves,
  Mountain,
  TreePine,
  Wind
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Import custom colored map images
const regionMapImages = {
  asia: "/lovable-uploads/30e5b83a-25ac-43e1-90d3-80a21f1a319e.png",
  europe: "/lovable-uploads/cbe5bfa0-e4c5-49b1-a687-8151662d21ea.png",
  africa: "/lovable-uploads/69fb4eb9-b78c-4c43-9918-c5aed7be4bcc.png",
  americas: "/lovable-uploads/fb03e8d4-7a19-44d4-9fc3-9dd04a6476f8.png",
  oceania: "/lovable-uploads/ca30d5b2-84a6-4e29-94f7-6ba0499996c1.png",
  india: "/lovable-uploads/81342f88-cc2b-47e3-867e-b10f1e059c2c.png",
  // Use pixelated custom map images provided by the user
  custom_kerala: "/lovable-uploads/1f104cbb-67b3-4754-a071-d0c178ce0177.png",
  custom_world: "/lovable-uploads/967ab145-1ae8-4e98-9e6a-b690373881f1.png",
  custom_fantasy: "/lovable-uploads/141a3eed-d5dc-4e0d-933d-b9dcf29c3f90.png"
};

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
  artForms?: ArtFormData[];
  cuisine?: CuisineData[];
  landmarks?: LandmarkData[];
};

export type EventData = {
  id: string;
  name: string;
  description: string;
  date: string;
  image: string;
};

export type ArtFormData = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type CuisineData = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  image: string;
};

export type LandmarkData = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
};

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
              "Kerala Architecture - Unique temple and house designs adapted to the tropical climate",
              "Malayalam Literature - Rich literary tradition with ancient works and modern masters",
              "Traditional Clothing - Kasavu sarees and mundus with golden borders"
            ],
            culturalEvents: [
              {
                id: "onam",
                name: "Onam Festival",
                description: "The harvest festival of Kerala featuring boat races, floral decorations (pookalam), feasts (Onasadya), and folk dances. Onam commemorates the return of King Mahabali, and is celebrated with great enthusiasm across Kerala.",
                date: "August-September (varies yearly)",
                image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png"
              },
              {
                id: "vishu",
                name: "Vishu",
                description: "The Kerala New Year celebration featuring Vishukkani (first sight arrangements), giving of money (Vishukaineetam), and a feast. Families arrange a ritualistic display of auspicious items to be viewed first thing in the morning.",
                date: "April 14/15",
                image: "/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png"
              },
              {
                id: "thrissur-pooram",
                name: "Thrissur Pooram",
                description: "A spectacular temple festival featuring caparisoned elephants, traditional music, and an umbrella display competition. It's considered the mother of all temple festivals in Kerala.",
                date: "April-May",
                image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
              }
            ],
            artForms: [
              {
                id: "kathakali",
                name: "Kathakali",
                description: "A highly stylized classical Indian dance-drama noted for the attractive make-up of characters, elaborate costumes, detailed gestures and well-defined body movements presented in tune with the anchor playback music and complementary percussion.",
                image: "/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png"
              },
              {
                id: "mohiniyattam",
                name: "Mohiniyattam",
                description: "A classical dance form of Kerala, known for its elegant and graceful movements that closely follow the circular path and swaying of the body, emulating the swaying of palm trees.",
                image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
              },
              {
                id: "theyyam",
                name: "Theyyam",
                description: "A ritual form of worship where performers take on the spirit of gods and ancestors. The elaborate costumes and dramatic makeup transform the artist into the deity being portrayed.",
                image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png"
              }
            ],
            cuisine: [
              {
                id: "sadya",
                name: "Kerala Sadya",
                description: "A traditional feast served on a banana leaf with a variety of vegetarian dishes. It's an elaborate meal served during special occasions and festivals.",
                ingredients: ["Rice", "Sambar", "Avial", "Thoran", "Olan", "Pachadi", "Payasam"],
                image: "/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png"
              },
              {
                id: "appam-stew",
                name: "Appam with Stew",
                description: "Lacy, soft hoppers made from fermented rice batter and coconut milk, served with a mildly spiced coconut milk stew made with vegetables or meat.",
                ingredients: ["Rice flour", "Coconut milk", "Vegetables/Meat", "Spices"],
                image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
              },
              {
                id: "malabar-biryani",
                name: "Malabar Biryani",
                description: "A fragrant rice dish made with aromatic spices, meat, and a unique Kerala touch of cashews and raisins.",
                ingredients: ["Basmati rice", "Meat", "Spices", "Cashews", "Raisins"],
                image: "/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png"
              }
            ],
            landmarks: [
              {
                id: "backwaters",
                name: "Kerala Backwaters",
                description: "A network of interconnected canals, rivers, lakes, and inlets formed by more than 900 km of waterways. The backwaters are home to unique aquatic life and offer a peaceful escape through houseboat cruises.",
                location: "Alleppey and Kumarakom",
                image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png"
              },
              {
                id: "fort-kochi",
                name: "Fort Kochi",
                description: "A historic coastal area known for its colonial architecture, Chinese fishing nets, ancient churches, and multicultural heritage from Portuguese, Dutch, and British influences.",
                location: "Kochi",
                image: "/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png"
              },
              {
                id: "padmanabhaswamy",
                name: "Padmanabhaswamy Temple",
                description: "An ancient temple dedicated to Lord Vishnu. Known for its Dravidian architecture and historical significance, it gained worldwide attention for its vast treasure vaults.",
                location: "Thiruvananthapuram",
                image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png"
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
  onShowItinerary?: () => void;
  onShowCommunityHub?: () => void;
  colorfulMap?: boolean;
}

const RegionMap = ({ 
  initialRegion = "asia", 
  onShowItinerary, 
  onShowCommunityHub,
  colorfulMap = false 
}: RegionMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [zoomEffect, setZoomEffect] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<{x: number, y: number} | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCountry(null);
    setSelectedState(null);
    setNavigationHistory([]);
    setZoomEffect(false);
    setFocusedLocation(null);
  }, [selectedRegion]);

  const currentRegionData = regionData[selectedRegion];
  
  const navigateToCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setNavigationHistory([...navigationHistory, 'region']);
    setSelectedTab("overview");
    setZoomEffect(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setZoomEffect(false);
    }, 1000);
  };
  
  const navigateToState = (state: StateData) => {
    setSelectedState(state);
    setNavigationHistory([...navigationHistory, 'country']);
    setSelectedTab("overview");
    setZoomEffect(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setZoomEffect(false);
    }, 1000);
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
    setSelectedTab("overview");
    setZoomEffect(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setZoomEffect(false);
    }, 1000);
  };

  // Animated elements for the map
  const AnimatedWaves = () => {
    return (
      <motion.div 
        className="absolute left-0 right-0 top-[30%] flex space-x-16 opacity-70 pointer-events-none"
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Waves className="h-6 w-6 text-blue-300" />
        <Waves className="h-5 w-5 text-blue-400" />
        <Waves className="h-7 w-7 text-blue-200" />
      </motion.div>
    );
  };

  const AnimatedTrees = () => {
    return (
      <motion.div 
        className="absolute left-[20%] top-[40%] flex space-x-8 opacity-70 pointer-events-none"
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <TreePine className="h-6 w-6 text-green-400" />
        <TreePine className="h-5 w-5 text-green-500" />
        <TreePine className="h-7 w-7 text-green-300" />
      </motion.div>
    );
  };

  const AnimatedWind = () => {
    return (
      <motion.div 
        className="absolute right-[20%] top-[20%] opacity-50 pointer-events-none"
        animate={{ x: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <Wind className="h-8 w-8 text-blue-200" />
      </motion.div>
    );
  };

  // Kerala map hotspots
  const keralaHotspots = [
    { id: 1, name: "Fort Kochi", x: 20, y: 30, icon: Building },
    { id: 2, name: "Alleppey Backwaters", x: 40, y: 50, icon: Waves },
    { id: 3, name: "Munnar Tea Gardens", x: 70, y: 25, icon: Palmtree },
    { id: 4, name: "Thekkady Wildlife", x: 65, y: 40, icon: TreePine },
    { id: 5, name: "Kovalam Beach", x: 30, y: 80, icon: Waves },
    { id: 6, name: "Community Hub", x: 50, y: 50, icon: Users },
  ];

  return (
    <div className="space-y-6">
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

      {!selectedCountry && !selectedState && (
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 bg-transparent shadow-none">
            <div className="relative h-[450px] rounded-xl overflow-hidden border border-teal-500/30" ref={mapRef}>
              <motion.img 
                src={colorfulMap ? regionMapImages.custom_world : regionMapImages[selectedRegion]} 
                alt={`Map of ${currentRegionData.name}`}
                className="w-full h-full object-cover"
                initial={{ scale: zoomEffect ? 1.2 : 1 }}
                animate={{ scale: zoomEffect ? 1 : 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              
              {/* Animated map elements */}
              {colorfulMap && (
                <>
                  <AnimatedWaves />
                  <AnimatedTrees />
                  <AnimatedWind />
                  
                  {/* Interactive map points */}
                  <div className="absolute inset-0">
                    {currentRegionData.countries.map((country, index) => (
                      <motion.div
                        key={country.id}
                        className="absolute cursor-pointer"
                        style={{ 
                          left: `${20 + (index * 15)}%`, 
                          top: `${30 + (index * 10)}%` 
                        }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => navigateToCountry(country)}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-full bg-teal-500/80 flex items-center justify-center text-white shadow-lg"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(45, 212, 191, 0.7)",
                              "0 0 0 10px rgba(45, 212, 191, 0)",
                              "0 0 0 0 rgba(45, 212, 191, 0)"
                            ]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2,
                            ease: "easeInOut"
                          }}
                        >
                          <Flag className="h-4 w-4" />
                        </motion.div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black/70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          {country.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                <h3 className="font-bold text-teal-400">{currentRegionData.name}</h3>
                <p className="text-xs text-gray-300">Click on countries to explore their culture</p>
              </div>
            </div>
          </Card>

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

      {selectedState && (
        <div className="space-y-6">
          <Card className="bg-slate-800/80 border border-teal-500/30 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-playfair font-bold text-white mb-2">
                    {selectedState.name}
                    <span className="ml-3 text-teal-400 text-lg font-normal">God's Own Country</span>
                  </h1>
                  <p className="text-gray-300 leading-relaxed">{selectedState.description}</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png" 
                    alt="Kerala Character" 
                    className="h-32 ml-4" 
                  />
                  <div className="flex flex-col gap-2">
                    {selectedState.id === "kerala" && onShowItinerary && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 bg-slate-800/60 text-white border-teal-500/30 hover:bg-slate-700/60"
                        onClick={onShowItinerary}
                      >
                        <MapIcon className="h-4 w-4" />
                        My Itinerary
                      </Button>
                    )}
                    {selectedState.id === "kerala" && onShowCommunityHub && (
                      <Button 
                        variant="default" 
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                        onClick={onShowCommunityHub}
                      >
                        <Users className="h-4 w-4" />
                        Community Hub
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:hidden mb-4 flex flex-col gap-2">
                {selectedState.id === "kerala" && onShowItinerary && (
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2"
                    onClick={onShowItinerary}
                  >
                    <MapIcon className="h-4 w-4" />
                    Explore Kerala Itinerary
                  </Button>
                )}
                {selectedState.id === "kerala" && onShowCommunityHub && (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    onClick={onShowCommunityHub}
                  >
                    <Users className="h-4 w-4" />
                    Open Community Hub
                  </Button>
                )}
              </div>
              
              {/* Interactive Kerala Map */}
              {selectedState.id === "kerala" && (
                <div className="relative h-[400px] rounded-xl overflow-hidden border border-teal-500/30 mb-6">
                  <motion.img 
                    src={regionMapImages.custom_kerala}
                    alt="Interactive Kerala Map"
                    className="w-full h-full object-cover"
                    initial={{ scale: zoomEffect ? 1.2 : 1 }}
                    animate={{ 
                      scale: focusedLocation ? 1.2 : 1,
                      x: focusedLocation ? -focusedLocation.x * 5 : 0,
                      y: focusedLocation ? -focusedLocation.y * 3 : 0
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  
                  {/* Hotspots on map */}
                  {keralaHotspots.map((hotspot) => {
                    const isHub = hotspot.id === 6; // Community Hub
                    const IconComponent = hotspot.icon;
                    
                    return (
                      <motion.div
                        key={hotspot.id}
                        className={`absolute cursor-pointer`}
                        style={{ 
                          left: `${hotspot.x}%`, 
                          top: `${hotspot.y}%`,
                          zIndex: isHub ? 10 : 5
                        }}
                        whileHover={{ scale: 1.2 }}
                        animate={activeHotspot === hotspot.id ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: activeHotspot === hotspot.id ? Infinity : 0 }}
                        onMouseEnter={() => setActiveHotspot(hotspot.id)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        onClick={() => {
                          if (isHub && onShowCommunityHub) {
                            onShowCommunityHub();
                          } else {
                            setFocusedLocation(
                              focusedLocation ? null : { x: hotspot.x - 50, y: hotspot.y - 50 }
                            );
                          }
                        }}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            isHub ? 'bg-purple-500/90 text-white' : 'bg-teal-500/80 text-white'
                          }`}
                          animate={
                            isHub 
                              ? { 
                                  scale: [1, 1.1, 1],
                                  boxShadow: [
                                    "0 0 0 0 rgba(168, 85, 247, 0.7)",
                                    "0 0 0 10px rgba(168, 85, 247, 0)",
                                    "0 0 0 0 rgba(168, 85, 247, 0)"
                                  ] 
                                }
                              : { 
                                  scale: [1, 1.05, 1],
                                  boxShadow: [
                                    "0 0 0 0 rgba(45, 212, 191, 0.7)",
                                    "0 0 0 6px rgba(45, 212, 191, 0)",
                                    "0 0 0 0 rgba(45, 212, 191, 0)"
                                  ] 
                                }
                          }
                          transition={{ 
                            repeat: Infinity, 
                            duration: isHub ? 2.5 : 2,
                            ease: "easeInOut"
                          }}
                        >
                          <IconComponent className={`h-5 w-5 ${isHub ? 'animate-pulse' : ''}`} />
                        </motion.div>
                        
                        <AnimatePresence>
                          {(activeHotspot === hotspot.id || focusedLocation) && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 py-1 px-3 rounded whitespace-nowrap z-20 ${
                                isHub 
                                  ? 'bg-purple-900/90 text-white border border-purple-500/50' 
                                  : 'bg-black/70 text-white'
                              }`}
                            >
                              {isHub ? (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="h-3 w-3 text-purple-300" />
                                  <span>{hotspot.name}</span>
                                </div>
                              ) : (
                                <span>{hotspot.name}</span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  
                  {/* Reset zoom button */}
                  {focusedLocation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <Button 
                        size="sm" 
                        onClick={() => setFocusedLocation(null)}
                        className="bg-black/70 hover:bg-black/90"
                      >
                        <Home className="h-4 w-4 mr-1" /> Reset View
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
              
              <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="bg-slate-700/50 grid w-full grid-cols-2 md:grid-cols-5">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600">
                    <Info className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="festivals" className="data-[state=active]:bg-teal-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Festivals
                  </TabsTrigger>
                  <TabsTrigger value="arts" className="data-[state=active]:bg-teal-600">
                    <Paintbrush className="h-4 w-4 mr-2" />
                    Arts
                  </TabsTrigger>
                  <TabsTrigger value="cuisine" className="data-[state=active]:bg-teal-600">
                    <Utensils className="h-4 w-4 mr-2" />
                    Cuisine
                  </TabsTrigger>
                  <TabsTrigger value="landmarks" className="data-[state=active]:bg-teal-600">
                    <Building className="h-4 w-4 mr-2" />
                    Landmarks
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-2 bg-slate-700/30 border-teal-500/20">
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold text-white mb-3">Cultural Heritage</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedState.culturalHeritage.map((heritage, index) => (
                            <div key={index} className="flex">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-3">
                                {index + 1}
                              </span>
                              <div>
                                <p className="text-white">{heritage}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-b from-teal-900/20 to-slate-800/40 border-teal-500/20">
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold text-white mb-3">Quick Facts</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-2 mt-0.5">
                              <Palmtree className="h-3 w-3" />
                            </span>
                            <p className="text-gray-300 text-sm">Known as the land of coconuts, backwaters, and spices</p>
                          </li>
                          <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-2 mt-0.5">
                              <BookOpen className="h-3 w-3" />
                            </span>
                            <p className="text-gray-300 text-sm">High literacy rate of 96.2%, highest in India</p>
                          </li>
                          <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-2 mt-0.5">
                              <Flag className="h-3 w-3" />
                            </span>
                            <p className="text-gray-300 text-sm">Malayalam is the official language</p>
                          </li>
                          <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-2 mt-0.5">
                              <Calendar className="h-3 w-3" />
                            </span>
                            <p className="text-gray-300 text-sm">Celebrates over 10 major festivals throughout the year</p>
                          </li>
                          <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mr-2 mt-0.5">
                              <Heart className="h-3 w-3" />
                            </span>
                            <p className="text-gray-300 text-sm">Home to Ayurveda, an ancient holistic healing system</p>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mt-6 bg-gradient-to-r from-teal-900/40 to-slate-800/60 border border-teal-500/30">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/3 h-48 bg-slate-700 rounded-lg overflow-hidden">
                          <img src="/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png" alt="Kerala Sadya" className="w-full h-full object-cover" />
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
                </TabsContent>
                
                <TabsContent value="festivals" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    
                    <Card className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                      <div className="h-40 bg-slate-600 relative">
                        <img src="/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png" alt="Boat Race" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                        <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">Nehru Trophy Boat Race</h4>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center text-gray-300 text-sm mb-2">
                          <Calendar className="h-4 w-4 mr-1 text-teal-400" />
                          August (Second Saturday)
                        </div>
                        <p className="text-gray-300 text-sm">A popular snake boat race held in the Punnamada Lake near Alappuzha, featuring long boats carrying up to 100 rowers competing for the prestigious trophy.</p>
                        <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="arts" className="mt-6">
                  {selectedState.artForms && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedState.artForms.map(artForm => (
                        <Card key={artForm.id} className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                              <img src={artForm.image} alt={artForm.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="md:w-2/3 p-4">
                              <h4 className="text-xl font-bold text-white mb-2">{artForm.name}</h4>
                              <p className="text-gray-300 text-sm">{artForm.description}</p>
                              <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                                Learn More
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                      
                      <Card className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img src="/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png" alt="Kalaripayattu" className="w-full h-full object-cover" />
                          </div>
                          <div className="md:w-2/3 p-4">
                            <h4 className="text-xl font-bold text-white mb-2">Kalaripayattu</h4>
                            <p className="text-gray-300 text-sm">One of the oldest martial art forms in the world, originating in Kerala. It combines strikes, kicks, grappling, weaponry, and healing techniques, focusing on flexibility, coordination, and discipline.</p>
                            <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cuisine" className="mt-6">
                  {selectedState.cuisine && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedState.cuisine.map(dish => (
                          <Card key={dish.id} className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                            <div className="h-40 bg-slate-600 relative">
                              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                              <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">{dish.name}</h4>
                            </div>
                            <CardContent className="p-4">
                              <p className="text-gray-300 text-sm mb-3">{dish.description}</p>
                              <div>
                                <h5 className="text-teal-400 text-sm font-medium mb-1">Key Ingredients:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {dish.ingredients.map((ingredient, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-teal-900/30 text-teal-300 border-teal-500/30">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <Card className="bg-gradient-to-r from-teal-900/40 to-slate-800/60 border border-teal-500/30">
                        <CardContent className="p-6">
                          <h3 className="text-2xl font-bold text-white mb-4">Virtual Sadya Experience</h3>
                          <div className="relative h-[300px] bg-slate-700/50 rounded-xl overflow-hidden">
                            <img 
                              src="/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png" 
                              alt="Kerala Sadya on banana leaf" 
                              className="w-full h-full object-cover opacity-40" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-white text-lg px-6 text-center">Interactive banana leaf with dishes coming soon! Click on each dish to learn about its ingredients and cultural significance.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="landmarks" className="mt-6">
                  {selectedState.landmarks && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {selectedState.landmarks.map(landmark => (
                        <Card key={landmark.id} className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                          <div className="h-40 bg-slate-600 relative">
                            <img src={landmark.image} alt={landmark.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                            <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">{landmark.name}</h4>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center text-gray-300 text-sm mb-2">
                              <MapPin className="h-4 w-4 mr-1 text-teal-400" />
                              {landmark.location}
                            </div>
                            <p className="text-gray-300 text-sm">{landmark.description}</p>
                            <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                              Virtual Tour
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Card className="overflow-hidden bg-slate-700/50 border border-teal-500/20">
                        <div className="h-40 bg-slate-600 relative">
                          <img src="/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png" alt="Munnar" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                          <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">Munnar Tea Gardens</h4>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center text-gray-300 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-1 text-teal-400" />
                            Idukki District
                          </div>
                          <p className="text-gray-300 text-sm">Stunning hillstation featuring vast stretches of tea plantations, winding roads, and misty valleys. One of Kerala's most popular tourist destinations known for its natural beauty.</p>
                          <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">
                            Virtual Tour
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RegionMap;

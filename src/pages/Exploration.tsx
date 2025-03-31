
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import RegionMap from "@/components/RegionMap";
import KeralaItinerary from "@/components/KeralaItinerary";
import { 
  Globe, Compass, Calendar, 
  Map as MapIcon, Info, X,
  Users
} from "lucide-react";

const Exploration = () => {
  const [activeRegion, setActiveRegion] = useState("asia");
  const [showItinerary, setShowItinerary] = useState(false);
  const [showCommunityHub, setShowCommunityHub] = useState(false);
  
  return (
    <PageLayout mapBackground>
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {showItinerary ? (
            // Kerala Itinerary Game View
            <motion.div
              key="itinerary-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-800/80 border border-teal-500/30 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-slate-900/80 p-4 border-b border-teal-500/20 flex justify-between items-center">
                <div className="flex items-center">
                  <MapIcon className="h-6 w-6 text-teal-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Kerala Explorer</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowItinerary(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <KeralaItinerary />
              </div>
            </motion.div>
          ) : showCommunityHub ? (
            // Community Hub View
            <motion.div
              key="community-hub-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-800/80 border border-teal-500/30 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-slate-900/80 p-4 border-b border-teal-500/20 flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-teal-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Kerala Community Hub</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCommunityHub(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6">
                <CommunityHub onClose={() => setShowCommunityHub(false)} />
              </div>
            </motion.div>
          ) : (
            // Regular exploration view
            <motion.div
              key="exploration-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h1 className="font-playfair text-3xl font-bold text-white mb-2">Cultural Exploration</h1>
                  <p className="text-gray-300">Discover traditions, festivals, and cultural sites from around the world</p>
                </div>
                
                <div className="flex mt-4 md:mt-0 gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 bg-slate-800/60 text-white border-teal-500/30 hover:bg-slate-700/60"
                      onClick={() => setShowItinerary(true)}
                    >
                      <MapIcon className="h-4 w-4" />
                      My Itinerary
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
                      <Compass className="h-4 w-4" />
                      Start Exploring
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* World Map Explorer */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="mb-8 overflow-hidden bg-slate-800/60 border-0 shadow-xl">
                  <CardContent className="p-0">
                    <div className="bg-slate-900/80 p-4 border-b border-teal-500/20">
                      <div className="flex items-center">
                        <Globe className="h-6 w-6 text-teal-400 mr-3" />
                        <h2 className="text-xl font-bold text-white">Interactive World Explorer</h2>
                      </div>
                      <p className="text-gray-400 mt-1 pl-9">Navigate through regions, countries, and states to discover cultural wonders</p>
                    </div>
                    
                    <div className="p-4">
                      <RegionMap 
                        initialRegion={activeRegion} 
                        onShowItinerary={() => setShowItinerary(true)}
                        onShowCommunityHub={() => setShowCommunityHub(true)}
                        colorfulMap={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Cultural Events Calendar - This is kept as a simpler component to focus on the map */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-800/60 border-0 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-6 w-6 text-teal-400 mr-3" />
                      <h2 className="text-xl font-bold text-white">Upcoming Cultural Events</h2>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <Info className="h-10 w-10 mx-auto text-teal-400 mb-2" />
                      <p className="text-white">Browse through regions and countries to see their unique cultural events and festivals</p>
                      <p className="text-gray-400 text-sm mt-2">Select a region, country, or state from the map above to view related cultural events</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

// Community Hub Component
const CommunityHub = ({ onClose }: { onClose: () => void }) => {
  const players = [
    { id: 1, name: "Arjun", avatar: "/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png", level: 12, points: 1240, badge: "Kerala Expert" },
    { id: 2, name: "Meera", avatar: "/lovable-uploads/7ea599b5-bfde-462e-b7e7-454b0a50f062.png", level: 9, points: 920, badge: "Culture Enthusiast" },
    { id: 3, name: "Rahul", avatar: "/lovable-uploads/371255ec-eeef-4782-8d23-8b28ebdf92b8.png", level: 14, points: 1380, badge: "Master Explorer" },
    { id: 4, name: "Lakshmi", avatar: "/lovable-uploads/9f8e05b4-7eaf-44a7-86fe-e150958b3278.png", level: 7, points: 760, badge: "Backwater Navigator" },
  ];

  const [currentTab, setCurrentTab] = useState<'leaderboard' | 'chat' | 'games'>('leaderboard');
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState([
    { id: 1, user: "Arjun", message: "Has anyone visited the Kathakali Center in Fort Kochi?", time: "10:45 AM", avatar: "/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png" },
    { id: 2, user: "Meera", message: "Yes! It's amazing. The performances start at 6 PM usually.", time: "10:47 AM", avatar: "/lovable-uploads/7ea599b5-bfde-462e-b7e7-454b0a50f062.png" },
    { id: 3, user: "Rahul", message: "I recommend trying the sadya at Paragon Restaurant if you're in Kochi.", time: "10:52 AM", avatar: "/lovable-uploads/371255ec-eeef-4782-8d23-8b28ebdf92b8.png" },
  ]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChats([...chats, {
        id: chats.length + 1,
        user: "You",
        message: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png"
      }]);
      setChatInput('');
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex mb-6 bg-slate-700/30 p-1 rounded-lg">
        <Button 
          variant={currentTab === 'leaderboard' ? 'default' : 'outline'} 
          onClick={() => setCurrentTab('leaderboard')}
          className={`flex-1 ${currentTab === 'leaderboard' ? 'bg-teal-600 text-white' : 'text-gray-300'}`}
        >
          Leaderboard
        </Button>
        <Button 
          variant={currentTab === 'chat' ? 'default' : 'outline'} 
          onClick={() => setCurrentTab('chat')}
          className={`flex-1 ${currentTab === 'chat' ? 'bg-teal-600 text-white' : 'text-gray-300'}`}
        >
          Chat
        </Button>
        <Button 
          variant={currentTab === 'games' ? 'default' : 'outline'} 
          onClick={() => setCurrentTab('games')}
          className={`flex-1 ${currentTab === 'games' ? 'bg-teal-600 text-white' : 'text-gray-300'}`}
        >
          Games
        </Button>
      </div>

      {currentTab === 'leaderboard' && (
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-semibold text-white mb-4">Kerala Explorers Leaderboard</h3>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 max-h-[calc(70vh-120px)]">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center bg-slate-700/40 p-4 rounded-lg border border-teal-500/20"
              >
                <div className="flex items-center flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-400">
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {player.level}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-white">{player.name}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                        {player.badge}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center bg-slate-800/60 px-4 py-2 rounded-lg">
                  <p className="text-2xl font-bold text-teal-400">{player.points}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
                
                <div className="ml-4">
                  <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                    Challenge
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'chat' && (
        <div className="flex-1 flex flex-col h-full bg-slate-700/30 rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${chat.user === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${chat.user === 'You' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img src={chat.avatar} alt={chat.user} className="w-full h-full object-cover" />
                  </div>
                  <div className={`mx-2 p-3 rounded-lg ${chat.user === 'You' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-gray-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{chat.user}</span>
                      <span className="text-xs opacity-70">{chat.time}</span>
                    </div>
                    <p>{chat.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <form onSubmit={handleChatSubmit} className="p-3 bg-slate-800 border-t border-slate-700">
            <div className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Kerala culture..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Button type="submit" className="rounded-l-none bg-teal-600 hover:bg-teal-700">
                Send
              </Button>
            </div>
          </form>
        </div>
      )}

      {currentTab === 'games' && (
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-semibold text-white mb-4">Multiplayer Games</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 max-h-[calc(70vh-120px)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-teal-900/40 to-slate-800/60 border border-teal-500/30 rounded-lg overflow-hidden"
            >
              <div className="h-40 relative">
                <img src="/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png" alt="Kerala Backwaters" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-3 left-3 text-xl font-bold text-white">Backwater Race</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 mb-4">Race traditional boats through the Kerala backwaters against other players in real-time.</p>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {players.slice(0, 3).map(player => (
                      <div key={player.id} className="w-8 h-8 rounded-full border-2 border-slate-800 overflow-hidden">
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-teal-600 flex items-center justify-center text-xs text-white">
                      +2
                    </div>
                  </div>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Join Game
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-amber-900/40 to-slate-800/60 border border-amber-500/30 rounded-lg overflow-hidden"
            >
              <div className="h-40 relative">
                <img src="/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png" alt="Kerala Cuisine" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-3 left-3 text-xl font-bold text-white">Kerala Cuisine Quiz</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 mb-4">Test your knowledge of Kerala's famous cuisine against other players in this multiplayer quiz.</p>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {players.slice(1, 3).map(player => (
                      <div key={player.id} className="w-8 h-8 rounded-full border-2 border-slate-800 overflow-hidden">
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-amber-600 flex items-center justify-center text-xs text-white">
                      +1
                    </div>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Join Game
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-900/40 to-slate-800/60 border border-purple-500/30 rounded-lg overflow-hidden"
            >
              <div className="h-40 relative">
                <img src="/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png" alt="Kathakali" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-3 left-3 text-xl font-bold text-white">Kathakali Dance-Off</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 mb-4">Learn and perform Kathakali dance moves in this rhythm-based multiplayer game.</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Game starts in 2 min</span>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Join Game
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-900/40 to-slate-800/60 border border-blue-500/30 rounded-lg overflow-hidden"
            >
              <div className="h-40 relative">
                <img src="/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png" alt="Tea Plantation" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <h4 className="absolute bottom-3 left-3 text-xl font-bold text-white">Munnar Tea Challenge</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 mb-4">Compete to see who can harvest tea leaves the fastest in this casual multiplayer game.</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 text-sm">4 players waiting</span>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Join Game
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exploration;

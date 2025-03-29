
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CookingPot, ChefHat, Timer, Utensils, Trophy, 
  Clock, Sparkles, Plus, ArrowRight, Coins, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Game types
type IngredientType = "bun" | "patty" | "cheese" | "lettuce" | "tomato" | "onion" | "sauce" | "bacon";
type CookingStage = "idle" | "cooking" | "burnt";

interface Ingredient {
  id: IngredientType;
  name: string;
  image: string;
  prepTime: number;
  points: number;
}

interface Order {
  id: number;
  customer: {
    name: string;
    image: string;
  };
  ingredients: IngredientType[];
  timeLimit: number;
  tip: number;
  difficulty: "easy" | "medium" | "hard";
}

interface Station {
  id: string;
  type: "grill" | "prep" | "assembly";
  status: CookingStage;
  item?: IngredientType;
  progress: number;
  maxProgress: number;
}

// Game constants
const INGREDIENTS: Record<IngredientType, Ingredient> = {
  bun: {
    id: "bun",
    name: "Burger Bun",
    image: "/placeholder.svg",
    prepTime: 10,
    points: 5
  },
  patty: {
    id: "patty",
    name: "Beef Patty",
    image: "/placeholder.svg",
    prepTime: 30,
    points: 15
  },
  cheese: {
    id: "cheese",
    name: "Cheese Slice",
    image: "/placeholder.svg", 
    prepTime: 5,
    points: 10
  },
  lettuce: {
    id: "lettuce",
    name: "Lettuce",
    image: "/placeholder.svg",
    prepTime: 8,
    points: 8
  },
  tomato: {
    id: "tomato",
    name: "Tomato Slice",
    image: "/placeholder.svg",
    prepTime: 8,
    points: 8
  },
  onion: {
    id: "onion",
    name: "Onion",
    image: "/placeholder.svg",
    prepTime: 12,
    points: 10
  },
  sauce: {
    id: "sauce",
    name: "Special Sauce",
    image: "/placeholder.svg",
    prepTime: 5,
    points: 12
  },
  bacon: {
    id: "bacon",
    name: "Bacon",
    image: "/placeholder.svg",
    prepTime: 25,
    points: 18
  }
};

// Order templates
const ORDERS: Order[] = [
  {
    id: 1,
    customer: {
      name: "Alex",
      image: "/placeholder.svg"
    },
    ingredients: ["bun", "patty", "cheese", "lettuce"],
    timeLimit: 120,
    tip: 20,
    difficulty: "easy"
  },
  {
    id: 2,
    customer: {
      name: "Sam",
      image: "/placeholder.svg"
    },
    ingredients: ["bun", "patty", "cheese", "tomato", "sauce"],
    timeLimit: 100,
    tip: 30,
    difficulty: "medium"
  },
  {
    id: 3,
    customer: {
      name: "Jamie",
      image: "/placeholder.svg"
    },
    ingredients: ["bun", "patty", "cheese", "bacon", "lettuce", "tomato", "sauce"],
    timeLimit: 150,
    tip: 50,
    difficulty: "hard"
  }
];

// Initial stations setup
const INITIAL_STATIONS: Station[] = [
  { id: "grill-1", type: "grill", status: "idle", progress: 0, maxProgress: 100 },
  { id: "grill-2", type: "grill", status: "idle", progress: 0, maxProgress: 100 },
  { id: "prep-1", type: "prep", status: "idle", progress: 0, maxProgress: 100 },
  { id: "prep-2", type: "prep", status: "idle", progress: 0, maxProgress: 100 },
  { id: "assembly", type: "assembly", status: "idle", progress: 0, maxProgress: 100 }
];

type GameStatus = "start" | "playing" | "paused" | "levelComplete" | "gameOver";

const BurgerTycoon = () => {
  // Game state
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(300);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // Level time in seconds
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [preparedIngredients, setPreparedIngredients] = useState<IngredientType[]>([]);
  const [assembledIngredients, setAssembledIngredients] = useState<IngredientType[]>([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [failedOrders, setFailedOrders] = useState(0);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Game settings
  const maxOrders = 3 + Math.floor(level / 2); // Increases with level
  const orderFrequency = Math.max(30 - level * 3, 10); // Decreases with level (seconds)
  const difficultyFactor = Math.min(1 + level * 0.2, 2.5); // Increases with level
  
  // Set up new level
  useEffect(() => {
    if (gameStatus === "playing") {
      // Reset state for new level
      setStations(INITIAL_STATIONS);
      setCurrentOrders([]);
      setPreparedIngredients([]);
      setAssembledIngredients([]);
      setTimeLeft(180 + level * 30); // More time for higher levels
      setCompletedOrders(0);
      setFailedOrders(0);
      
      // Generate initial orders
      generateNewOrder();
    }
  }, [level, gameStatus]);

  // Main game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(t => t - 1);
        
        // Randomly generate new orders
        if (Math.random() < 1/orderFrequency && currentOrders.length < maxOrders) {
          generateNewOrder();
        }
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      setGameStatus("levelComplete");
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameStatus, timeLeft, currentOrders.length, maxOrders, orderFrequency]);

  // Station processing logic
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const interval = setInterval(() => {
      setStations(prevStations => {
        return prevStations.map(station => {
          if (station.status === "cooking") {
            let newProgress = station.progress + 2;
            let newStatus: CookingStage = "cooking";
            
            // Check if cooking is complete
            if (newProgress >= station.maxProgress) {
              newProgress = station.maxProgress;
              
              // Add to prepared ingredients if it's a new completion
              if (station.progress < station.maxProgress && station.item) {
                setPreparedIngredients(prev => [...prev, station.item!]);
                toast.success(`${INGREDIENTS[station.item].name} is ready!`);
              }
            }
            
            // Check if it's burning (stays at 100% too long)
            if (newProgress === station.maxProgress && Math.random() < 0.01) {
              newStatus = "burnt";
              toast.error(`${station.item ? INGREDIENTS[station.item].name : 'Item'} burnt!`);
            }
            
            return { ...station, progress: newProgress, status: newStatus };
          }
          return station;
        });
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Generate a new customer order
  const generateNewOrder = () => {
    // Higher levels have more chance of harder orders
    let orderPool = ORDERS;
    if (level >= 3) {
      orderPool = ORDERS.filter(o => o.difficulty !== "easy");
    }
    if (level >= 5) {
      orderPool = ORDERS.filter(o => o.difficulty === "hard");
    }
    
    const orderIndex = Math.floor(Math.random() * orderPool.length);
    const baseOrder = orderPool[orderIndex];
    
    // Create a new order with adjusted time and points based on level
    const newOrder: Order = {
      ...baseOrder,
      id: Date.now(),
      timeLimit: Math.floor(baseOrder.timeLimit / difficultyFactor),
      tip: Math.floor(baseOrder.tip * difficultyFactor)
    };
    
    setCurrentOrders(prev => [...prev, newOrder]);
    toast.info("New order received!");
  };

  // Start cooking an ingredient at a station
  const startCooking = (stationId: string, ingredient?: IngredientType) => {
    if (!ingredient) return;
    
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        const prepTime = INGREDIENTS[ingredient].prepTime;
        return {
          ...station,
          status: "cooking",
          item: ingredient,
          progress: 0,
          maxProgress: 100
        };
      }
      return station;
    }));
    
    setSelectedStation(null);
  };

  // Clear a station
  const clearStation = (stationId: string) => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        return {
          ...station,
          status: "idle",
          item: undefined,
          progress: 0
        };
      }
      return station;
    }));
  };

  // Select or use prepared ingredient
  const handleIngredientClick = (ingredient: IngredientType) => {
    // If we have an active order and assembly station, add to burger
    const assemblyStation = stations.find(s => s.id === "assembly");
    
    if (assemblyStation && assemblyStation.status === "idle" && activeOrder) {
      setAssembledIngredients(prev => [...prev, ingredient]);
      setPreparedIngredients(prev => prev.filter(i => i !== ingredient));
      
      // Check if burger is complete
      const newAssembled = [...assembledIngredients, ingredient];
      if (isOrderComplete(activeOrder, newAssembled)) {
        completeOrder(activeOrder);
      }
    }
  };

  // Select a station for interaction
  const handleStationClick = (stationId: string) => {
    setSelectedStation(prev => prev === stationId ? null : stationId);
  };

  // Check if an order is complete
  const isOrderComplete = (order: Order, assembledItems: IngredientType[]) => {
    // Check if all required ingredients are in the assembled items
    return order.ingredients.every(ing => assembledItems.includes(ing));
  };

  // Handle order completion
  const completeOrder = (order: Order) => {
    // Calculate points
    const basePoints = order.ingredients.reduce((total, ing) => total + INGREDIENTS[ing].points, 0);
    const orderPoints = basePoints + order.tip;
    
    setScore(prev => prev + orderPoints);
    setCoins(prev => prev + order.tip);
    setCompletedOrders(prev => prev + 1);
    
    // Remove completed order and reset assembly
    setCurrentOrders(prev => prev.filter(o => o.id !== order.id));
    setActiveOrder(null);
    setAssembledIngredients([]);
    
    // Reset assembly station
    setStations(prev => prev.map(station => {
      if (station.id === "assembly") {
        return { ...station, status: "idle", progress: 0 };
      }
      return station;
    }));
    
    toast.success(`Order completed! +${orderPoints} points`);
    
    // Check level completion
    if (completedOrders + 1 >= 5 + level) {
      setGameStatus("levelComplete");
    }
  };

  // Select an order to work on
  const selectOrder = (order: Order) => {
    setActiveOrder(order);
    setAssembledIngredients([]);
    
    // Reset assembly station
    setStations(prev => prev.map(station => {
      if (station.id === "assembly") {
        return { ...station, status: "idle", progress: 0 };
      }
      return station;
    }));
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startGame = () => {
    setGameStatus("playing");
    setLevel(1);
    setScore(0);
    setCoins(300);
  };

  const goToNextLevel = () => {
    setLevel(prev => prev + 1);
    setGameStatus("playing");
  };

  const restartGame = () => {
    startGame();
  };

  // Render the appropriate game screen
  return (
    <div className="burger-tycoon max-w-6xl mx-auto mt-4 overflow-hidden">
      {/* Start Screen */}
      {gameStatus === "start" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-full h-72 md:h-96 bg-gradient-to-b from-orange-400 to-red-600 rounded-xl overflow-hidden mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/371255ec-eeef-4782-8d23-8b28ebdf92b8.png" 
                alt="Burger Tycoon" 
                className="w-full h-full object-cover opacity-40" 
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="z-10 text-white">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Burger Tycoon</h1>
                  <p className="text-xl md:text-2xl mb-8 max-w-md mx-auto">Run your own burger restaurant! Cook, prepare and serve delicious burgers to hungry customers!</p>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-6 flex flex-col items-center">
              <div className="rounded-full bg-orange-500 p-4 mb-4">
                <CookingPot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cook Delicious Burgers</h3>
              <p className="text-gray-600 text-center">Prepare ingredients and cook patties to perfection!</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6 flex flex-col items-center">
              <div className="rounded-full bg-green-500 p-4 mb-4">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Manage Multiple Orders</h3>
              <p className="text-gray-600 text-center">Handle customer orders before they get impatient!</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6 flex flex-col items-center">
              <div className="rounded-full bg-blue-500 p-4 mb-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Earn Coins & Level Up</h3>
              <p className="text-gray-600 text-center">Complete orders to earn tips and build your burger empire!</p>
            </Card>
          </div>
          
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={startGame}
          >
            <ChefHat className="mr-2 h-6 w-6" />
            Start Cooking!
          </Button>
        </motion.div>
      )}

      {/* Main Game Screen */}
      {gameStatus === "playing" && (
        <div className="game-screen">
          {/* Game HUD */}
          <div className="game-hud bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3 mb-4 text-white flex justify-between items-center">
            <div className="flex space-x-6">
              <div className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-yellow-400" />
                <span className="text-xl font-bold">{coins}</span>
              </div>
              
              <div className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-orange-400" />
                <span className="text-xl font-bold">{score}</span>
              </div>
              
              <div className="flex items-center">
                <ChefHat className="mr-2 h-5 w-5 text-teal-400" />
                <span className="text-xl font-bold">Level {level}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Timer className="mr-2 h-5 w-5 text-red-400" />
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Game Area */}
          <div className="game-area grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Orders Column */}
            <div className="orders-column">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h3 className="font-bold mb-2 flex items-center text-blue-800">
                  <Clock className="mr-2 h-5 w-5" />
                  Current Orders ({currentOrders.length}/{maxOrders})
                </h3>
                
                <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                  {currentOrders.length === 0 ? (
                    <div className="text-center p-6 text-gray-500">
                      <p>No orders yet - customers will arrive soon!</p>
                    </div>
                  ) : (
                    currentOrders.map(order => (
                      <div 
                        key={order.id}
                        className={`order-card p-3 rounded-lg border ${activeOrder?.id === order.id 
                          ? 'bg-orange-100 border-orange-300' 
                          : 'bg-white border-gray-200'
                        } hover:border-orange-300 cursor-pointer transition-all`}
                        onClick={() => selectOrder(order)}
                      >
                        <div className="flex items-center mb-2">
                          <div className="rounded-full bg-gray-200 h-10 w-10 flex items-center justify-center mr-3 overflow-hidden">
                            <img src={order.customer.image} alt={order.customer.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold">{order.customer.name}</h4>
                            <div className="flex items-center">
                              <Badge 
                                className={`${
                                  order.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  order.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {order.difficulty}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />{order.timeLimit}s
                              </span>
                              <span className="text-xs text-green-600 ml-2 flex items-center">
                                <Coins className="h-3 w-3 mr-1" />+{order.tip}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ingredients-list flex flex-wrap gap-1">
                          {order.ingredients.map(ing => (
                            <div 
                              key={ing} 
                              className="ingredient-pill bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center"
                              title={INGREDIENTS[ing].name}
                            >
                              {activeOrder?.id === order.id && assembledIngredients.includes(ing) ? (
                                <span className="text-green-600 flex items-center">
                                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {INGREDIENTS[ing].name}
                                </span>
                              ) : (
                                <span>{INGREDIENTS[ing].name}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {activeOrder?.id === order.id && (
                          <div className="mt-2">
                            <Progress value={
                              (assembledIngredients.filter(ing => order.ingredients.includes(ing)).length / order.ingredients.length) * 100
                            } className="h-1" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Prepared Ingredients */}
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold mb-3 flex items-center text-green-800">
                  <Utensils className="mr-2 h-5 w-5" />
                  Prepared Ingredients
                </h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {preparedIngredients.length === 0 ? (
                    <div className="col-span-4 text-center p-4 text-gray-500">
                      <p>No prepared ingredients yet</p>
                    </div>
                  ) : (
                    preparedIngredients.map((ing, index) => (
                      <motion.div
                        key={`${ing}-${index}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative bg-white rounded-lg border border-gray-200 p-2 cursor-pointer hover:border-green-400 transition-all"
                        onClick={() => handleIngredientClick(ing)}
                      >
                        <div className="h-12 flex items-center justify-center mb-1">
                          <img src={INGREDIENTS[ing].image} alt={INGREDIENTS[ing].name} className="h-10 w-10 object-contain" />
                        </div>
                        <p className="text-xs text-center font-medium">{INGREDIENTS[ing].name}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Cooking Area Column */}
            <div className="cooking-area-column col-span-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-bold mb-3 flex items-center text-amber-800">
                  <CookingPot className="mr-2 h-5 w-5" />
                  Cooking Stations
                </h3>
                
                <div className="cooking-stations grid grid-cols-2 gap-4 mb-6">
                  {stations.filter(s => s.type === "grill").map(station => (
                    <div 
                      key={station.id}
                      className={`station relative rounded-lg border p-3 cursor-pointer transition-all ${
                        selectedStation === station.id ? 'bg-amber-200 border-amber-400' :
                        station.status === 'cooking' ? 'bg-amber-100 border-amber-300' :
                        station.status === 'burnt' ? 'bg-red-100 border-red-300' :
                        'bg-white border-gray-200 hover:border-amber-300'
                      }`}
                      onClick={() => handleStationClick(station.id)}
                    >
                      <h4 className="font-medium mb-1">Grill Station</h4>
                      
                      {station.status === 'idle' && !station.item && (
                        <div className="h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500 text-sm">Click to add ingredients</p>
                        </div>
                      )}
                      
                      {(station.status !== 'idle' || station.item) && (
                        <div className="relative h-16 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {station.item && (
                            <img 
                              src={INGREDIENTS[station.item].image} 
                              alt={INGREDIENTS[station.item].name} 
                              className="h-12 w-12 object-contain"
                            />
                          )}
                          
                          {station.status === 'burnt' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <p className="text-white font-bold">BURNT!</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {station.status === 'cooking' && (
                        <Progress value={station.progress} className="h-2 mt-2" />
                      )}
                      
                      {selectedStation === station.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="station-controls mt-3 flex flex-wrap gap-2"
                        >
                          {station.status === 'idle' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-amber-500 hover:bg-amber-600"
                                onClick={() => startCooking(station.id, 'patty')}
                              >
                                Cook Patty
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600"
                                onClick={() => startCooking(station.id, 'bacon')}
                              >
                                Cook Bacon
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => clearStation(station.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Clear
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
                
                <h3 className="font-bold mb-3 flex items-center text-amber-800">
                  <Utensils className="mr-2 h-5 w-5" />
                  Prep Stations
                </h3>
                
                <div className="prep-stations grid grid-cols-2 gap-4 mb-6">
                  {stations.filter(s => s.type === "prep").map(station => (
                    <div 
                      key={station.id}
                      className={`station relative rounded-lg border p-3 cursor-pointer transition-all ${
                        selectedStation === station.id ? 'bg-blue-200 border-blue-400' :
                        station.status === 'cooking' ? 'bg-blue-100 border-blue-300' :
                        station.status === 'burnt' ? 'bg-red-100 border-red-300' :
                        'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleStationClick(station.id)}
                    >
                      <h4 className="font-medium mb-1">Prep Station</h4>
                      
                      {station.status === 'idle' && !station.item && (
                        <div className="h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500 text-sm">Click to prepare ingredients</p>
                        </div>
                      )}
                      
                      {(station.status !== 'idle' || station.item) && (
                        <div className="relative h-16 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden">
                          {station.item && (
                            <img 
                              src={INGREDIENTS[station.item].image} 
                              alt={INGREDIENTS[station.item].name} 
                              className="h-12 w-12 object-contain"
                            />
                          )}
                        </div>
                      )}
                      
                      {station.status === 'cooking' && (
                        <Progress value={station.progress} className="h-2 mt-2" />
                      )}
                      
                      {selectedStation === station.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="station-controls mt-3 flex flex-wrap gap-2"
                        >
                          {station.status === 'idle' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => startCooking(station.id, 'bun')}
                              >
                                Prepare Bun
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => startCooking(station.id, 'cheese')}
                              >
                                Slice Cheese
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => startCooking(station.id, 'lettuce')}
                              >
                                Chop Lettuce
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => startCooking(station.id, 'tomato')}
                              >
                                Slice Tomato
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => startCooking(station.id, 'sauce')}
                              >
                                Add Sauce
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => clearStation(station.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Clear
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Burger Assembly */}
                <div className="burger-assembly">
                  <h3 className="font-bold mb-3 flex items-center text-purple-800">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Burger Assembly
                  </h3>
                  
                  <div className={`assembly-area rounded-lg border p-4 ${
                    activeOrder ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200' 
                    : 'bg-gray-50 border-gray-200'
                  }`}>
                    {!activeOrder ? (
                      <div className="text-center p-6">
                        <p className="text-gray-500">Select an order to start assembling the burger</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="font-bold">Assembling order for {activeOrder.customer.name}</h4>
                            <p className="text-sm text-gray-500">
                              Add ingredients in any order to complete the burger
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveOrder(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                        
                        <div className="burger-preview bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                          <div className="relative min-h-20 flex flex-col items-center justify-center">
                            {assembledIngredients.length === 0 ? (
                              <p className="text-amber-700 text-center">Select ingredients from the prepared list</p>
                            ) : (
                              <div className="flex flex-col-reverse items-center gap-1">
                                {assembledIngredients.map((ing, idx) => (
                                  <div 
                                    key={`${ing}-${idx}`}
                                    className="ingredient-layer w-32 flex items-center justify-center"
                                  >
                                    <motion.div
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <img 
                                        src={INGREDIENTS[ing].image} 
                                        alt={INGREDIENTS[ing].name} 
                                        className="h-10 w-24 object-contain" 
                                      />
                                      <p className="text-xs text-center">{INGREDIENTS[ing].name}</p>
                                    </motion.div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="order-progress">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Order Progress</span>
                            <span className="text-sm text-gray-500">
                              {assembledIngredients.filter(ing => activeOrder.ingredients.includes(ing)).length}/
                              {activeOrder.ingredients.length} ingredients
                            </span>
                          </div>
                          <Progress 
                            value={(assembledIngredients.filter(ing => 
                              activeOrder.ingredients.includes(ing)).length / activeOrder.ingredients.length) * 100
                            } 
                            className="h-2" 
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Complete Screen */}
      {gameStatus === "levelComplete" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="p-6">
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mx-auto bg-green-100 text-green-700 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center"
              >
                <Trophy className="h-10 w-10" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">Level {level} Complete!</h2>
              <p className="text-gray-600 mb-6">
                Excellent work, chef! You've completed the level.
              </p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="stats bg-white p-4 rounded-lg border border-gray-200 mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Orders Completed</p>
                    <p className="text-2xl font-bold">{completedOrders}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Orders Failed</p>
                    <p className="text-2xl font-bold">{failedOrders}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Coins Earned</p>
                    <p className="text-2xl font-bold flex items-center justify-center">
                      <Coins className="h-5 w-5 mr-1 text-yellow-500" />
                      {coins}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                  onClick={goToNextLevel}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Continue to Level {level + 1}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={restartGame}
                >
                  Restart Game
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Over Screen */}
      {gameStatus === "gameOver" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-gray-600 mb-6">
                You ran out of time! But don't worry, even the best chefs have bad days.
              </p>
              
              <div className="stats bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Final Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Level Reached</p>
                    <p className="text-2xl font-bold">{level}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Orders Completed</p>
                    <p className="text-2xl font-bold">{completedOrders}</p>
                  </div>
                  <div className="stat-item">
                    <p className="text-gray-500 text-sm">Coins Earned</p>
                    <p className="text-2xl font-bold">{coins}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={restartGame}
              >
                Play Again
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default BurgerTycoon;

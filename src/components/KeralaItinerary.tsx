
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TreePalm, Image, Gamepad, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Define the itinerary map constants
const MAP_WIDTH = 1000;  // Width of the map
const MAP_HEIGHT = 1800; // Height of the map adjusted for the image ratio
const CHARACTER_SIZE = 40;

// Landmarks for Kerala
const landmarks = [
  { 
    id: 1, 
    name: "Alleppey Backwaters", 
    x: 450, 
    y: 1200, 
    description: "Experience Kerala's famous backwaters on a traditional houseboat.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 2, 
    name: "Fort Kochi", 
    x: 300, 
    y: 950, 
    description: "Historic coastal area with colonial architecture and Chinese fishing nets.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 3, 
    name: "Munnar Tea Gardens", 
    x: 750, 
    y: 500, 
    description: "Hill station known for its vast tea plantations and cool climate.",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 4, 
    name: "Periyar Wildlife Sanctuary", 
    x: 830, 
    y: 750, 
    description: "Home to diverse wildlife, spice plantations, and boat safaris.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 5, 
    name: "Kovalam Beach", 
    x: 580, 
    y: 1500, 
    description: "Famous crescent-shaped beach with lighthouse views.",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 6, 
    name: "Wayanad Forests", 
    x: 600, 
    y: 200, 
    description: "Lush green forests with waterfalls and wildlife.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 7, 
    name: "Kumarakom Bird Sanctuary", 
    x: 350, 
    y: 1100, 
    description: "Bird watcher's paradise on the banks of Vembanad Lake.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  }
];

// Mini-games data
const miniGames = [
  {
    id: 1,
    name: "Kerala Quiz",
    x: 500,
    y: 650,
    description: "Test your knowledge about Kerala culture and landmarks.",
  },
  {
    id: 2,
    name: "Memory Match",
    x: 780,
    y: 1020,
    description: "Match Kerala's cultural symbols in this memory game.",
  },
  {
    id: 3,
    name: "Boat Race",
    x: 400,
    y: 1300,
    description: "Navigate the backwaters in a traditional boat race.",
  },
  {
    id: 4,
    name: "Spice Market",
    x: 600,
    y: 850,
    description: "Identify different spices from Kerala's famous markets.",
  }
];

// Character directions
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const KeralaItinerary = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 500, y: 1000 });
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);
  const [activeLandmark, setActiveLandmark] = useState<typeof landmarks[0] | null>(null);
  const [activeGame, setActiveGame] = useState<typeof miniGames[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playingGame, setPlayingGame] = useState(false);
  const [mapScale, setMapScale] = useState(0.5);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Center map on player position initially
  useEffect(() => {
    centerMapOnPlayer();
  }, []);

  // Function to center the map on the player
  const centerMapOnPlayer = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    
    // Calculate positions to center the player
    const centerX = (containerWidth / 2 - playerPosition.x * mapScale);
    const centerY = (containerHeight / 2 - playerPosition.y * mapScale);
    
    setMapPosition({ x: centerX, y: centerY });
  }, [playerPosition, mapScale]);

  // Handle keyboard input for movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingGame) return; // Disable movement when playing a game
      
      const moveStep = 20;
      let newDirection = playerDirection;
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      
      switch (e.key) {
        case "ArrowUp":
          newY -= moveStep;
          newDirection = Direction.UP;
          break;
        case "ArrowDown":
          newY += moveStep;
          newDirection = Direction.DOWN;
          break;
        case "ArrowLeft":
          newX -= moveStep;
          newDirection = Direction.LEFT;
          break;
        case "ArrowRight":
          newX += moveStep;
          newDirection = Direction.RIGHT;
          break;
      }
      
      // Check map boundaries
      if (newX < 0) newX = 0;
      if (newX > MAP_WIDTH) newX = MAP_WIDTH;
      if (newY < 0) newY = 0;
      if (newY > MAP_HEIGHT) newY = MAP_HEIGHT;
      
      setPlayerDirection(newDirection);
      setPlayerPosition({ x: newX, y: newY });
      
      // Check if we've reached a landmark
      checkLandmarksAndGames(newX, newY);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, playerDirection, playingGame]);
  
  // Check if player has reached a landmark or mini-game
  const checkLandmarksAndGames = (x: number, y: number) => {
    // Check landmarks
    const foundLandmark = landmarks.find(landmark => 
      Math.abs(landmark.x - x) < 50 && Math.abs(landmark.y - y) < 50
    );
    
    if (foundLandmark) {
      setActiveLandmark(foundLandmark);
      setActiveGame(null);
      return;
    }
    
    // Check mini-games
    const foundGame = miniGames.find(game => 
      Math.abs(game.x - x) < 50 && Math.abs(game.y - y) < 50
    );
    
    if (foundGame) {
      setActiveGame(foundGame);
      setActiveLandmark(null);
      return;
    }
    
    // Clear active selections if not near anything
    setActiveLandmark(null);
    setActiveGame(null);
  };

  // Mouse/touch movement controls
  const movePlayer = (dx: number, dy: number) => {
    const moveStep = 20;
    let newDirection = playerDirection;
    
    if (dx > 0) newDirection = Direction.RIGHT;
    else if (dx < 0) newDirection = Direction.LEFT;
    else if (dy > 0) newDirection = Direction.DOWN;
    else if (dy < 0) newDirection = Direction.UP;
    
    const newX = Math.max(0, Math.min(MAP_WIDTH, playerPosition.x + dx * moveStep));
    const newY = Math.max(0, Math.min(MAP_HEIGHT, playerPosition.y + dy * moveStep));
    
    setPlayerDirection(newDirection);
    setPlayerPosition({ x: newX, y: newY });
    
    // Check if we've reached a landmark
    checkLandmarksAndGames(newX, newY);
  };
  
  // Handle map zooming
  const handleZoom = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1; // Zoom in or out
    setMapScale(prevScale => {
      const newScale = prevScale * zoomFactor;
      // Limit zoom level
      return Math.max(0.3, Math.min(1.0, newScale));
    });
  };
  
  // Handle map dragging
  const handleMapDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (playingGame) return;
    
    setIsDragging(true);
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    setDragStart({ 
      x: clientX - mapPosition.x, 
      y: clientY - mapPosition.y 
    });
  };
  
  const handleMapDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    setMapPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };
  
  const handleMapDragEnd = () => {
    setIsDragging(false);
  };
  
  // Navigate to a landmark
  const navigateToLandmark = (landmark: typeof landmarks[0]) => {
    // Set player position near the landmark
    setPlayerPosition({
      x: landmark.x,
      y: landmark.y - 50 // Slightly above the landmark
    });
    
    // Center map view on landmark
    if (mapContainerRef.current) {
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;
      
      setMapPosition({
        x: containerWidth / 2 - landmark.x * mapScale,
        y: containerHeight / 2 - landmark.y * mapScale
      });
    }
    
    setActiveLandmark(landmark);
    setActiveGame(null);
  };

  // Start a mini-game
  const startGame = () => {
    if (activeGame) {
      setPlayingGame(true);
      toast.success(`Starting ${activeGame.name}!`);
    }
  };

  // End a mini-game
  const endGame = () => {
    setPlayingGame(false);
    toast.success("Game completed! Continue exploring Kerala");
  };

  // Render control buttons for mobile
  const renderControls = () => (
    <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 w-36 h-36">
      <div className="col-start-2">
        <Button 
          onClick={() => movePlayer(0, -1)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ↑
        </Button>
      </div>
      <div className="col-start-1 row-start-2">
        <Button 
          onClick={() => movePlayer(-1, 0)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ←
        </Button>
      </div>
      <div className="col-start-3 row-start-2">
        <Button 
          onClick={() => movePlayer(1, 0)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          →
        </Button>
      </div>
      <div className="col-start-2 row-start-3">
        <Button 
          onClick={() => movePlayer(0, 1)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ↓
        </Button>
      </div>
    </div>
  );

  // Render mini-game content
  const renderMiniGame = () => {
    if (!activeGame) return null;
    
    if (activeGame.id === 1) { // Kerala Quiz
      return (
        <motion.div 
          className="p-4 bg-slate-800 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Kerala Quiz</h3>
          <p className="text-gray-300 mb-4">What is Kerala often referred to as?</p>
          <div className="grid grid-cols-1 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">A) Land of Temples</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">B) God's Own Country</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">C) Spice Garden of India</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">D) Paradise on Earth</Button>
            </motion.div>
          </div>
        </motion.div>
      );
    }
    
    // Similar game patterns for other game IDs
    return (
      <motion.div 
        className="p-4 bg-slate-800 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">{activeGame.name}</h3>
        <p className="text-gray-300 mb-4">{activeGame.description}</p>
        <Button onClick={endGame} className="w-full">Complete Game</Button>
      </motion.div>
    );
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg w-full h-full overflow-hidden">
      <div className="flex items-center mb-4">
        <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h2 className="text-2xl font-bold text-white">My Kerala Itinerary</h2>
        
        {/* Zoom controls */}
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMapScale(prev => Math.max(0.3, prev - 0.1))}
            className="w-8 h-8 p-0 rounded-full"
          >
            -
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMapScale(prev => Math.min(1.0, prev + 0.1))}
            className="w-8 h-8 p-0 rounded-full"
          >
            +
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={centerMapOnPlayer}
            className="text-xs"
          >
            Center
          </Button>
        </div>
      </div>
      
      {showInstructions && (
        <motion.div 
          className="bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Kerala Explorer!</h3>
              <p className="text-sm text-gray-300 mb-2">Use arrow keys or on-screen controls to move your character.</p>
              <p className="text-sm text-gray-300">Visit landmarks and mini-games to discover Kerala's attractions and culture.</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </Button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {playingGame ? (
          <motion.div 
            key="game-mode"
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMiniGame()}
          </motion.div>
        ) : (
          <motion.div
            key="map-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Kerala Map Container */}
            <div 
              ref={mapContainerRef}
              className="relative bg-green-800 rounded-lg overflow-hidden shadow-xl border border-teal-900/50 h-[60vh]" 
              onWheel={handleZoom}
              onMouseDown={handleMapDragStart}
              onMouseMove={handleMapDragMove}
              onMouseUp={handleMapDragEnd}
              onMouseLeave={handleMapDragEnd}
              onTouchStart={handleMapDragStart}
              onTouchMove={handleMapDragMove}
              onTouchEnd={handleMapDragEnd}
            >
              {/* Map image with landmarks and character */}
              <div 
                ref={mapRef}
                className="absolute origin-top-left transition-transform duration-200"
                style={{ 
                  transform: `scale(${mapScale})`,
                  left: `${mapPosition.x}px`,
                  top: `${mapPosition.y}px`,
                }}
              >
                {/* Kerala map image */}
                <div className="relative">
                  <img 
                    src="/lovable-uploads/e662a969-2e17-4a79-9a26-70cd68bea94e.png" 
                    alt="Kerala Map" 
                    className="w-[1000px] h-[1800px] object-cover"
                  />
                  
                  {/* Landmarks */}
                  {landmarks.map(landmark => (
                    <motion.div
                      key={`landmark-${landmark.id}`}
                      className="absolute cursor-pointer"
                      style={{ 
                        left: landmark.x - 15, 
                        top: landmark.y - 15,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      onClick={() => navigateToLandmark(landmark)}
                    >
                      <div className="w-[30px] h-[30px] bg-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {landmark.name}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Mini-games */}
                  {miniGames.map(game => (
                    <motion.div
                      key={`game-${game.id}`}
                      className="absolute cursor-pointer"
                      style={{ 
                        left: game.x - 15, 
                        top: game.y - 15,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      onClick={() => {
                        setPlayerPosition({ x: game.x, y: game.y });
                        setActiveGame(game);
                        setActiveLandmark(null);
                      }}
                    >
                      <div className="w-[30px] h-[30px] bg-purple-500 rounded-lg flex items-center justify-center">
                        <Gamepad className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {game.name}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Player character */}
                  <motion.div 
                    className="absolute z-20"
                    style={{ 
                      left: playerPosition.x - CHARACTER_SIZE/2, 
                      top: playerPosition.y - CHARACTER_SIZE/2,
                      width: CHARACTER_SIZE,
                      height: CHARACTER_SIZE
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <motion.div 
                      className="w-full h-full bg-yellow-500 rounded-full relative overflow-hidden flex items-center justify-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {/* Simple character face/icon */}
                      <div className="absolute top-1/4 left-1/4 w-1/6 h-1/6 bg-black rounded-full" />
                      <div className="absolute top-1/4 right-1/4 w-1/6 h-1/6 bg-black rounded-full" />
                      <div className="absolute top-[55%] w-1/3 h-1/6 bg-black rounded-full" style={{
                        transform: playerDirection === Direction.UP ? 'rotate(180deg)' : 
                                   playerDirection === Direction.LEFT ? 'rotate(90deg)' : 
                                   playerDirection === Direction.RIGHT ? 'rotate(-90deg)' : 'rotate(0deg)'
                      }} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              
              {/* Map overlay with gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Landmark information */}
      <AnimatePresence>
        {activeLandmark && !playingGame && (
          <motion.div 
            key={`landmark-${activeLandmark.id}`}
            className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              {activeLandmark.image && (
                <motion.img 
                  src={activeLandmark.image} 
                  alt={activeLandmark.name} 
                  className="w-full md:w-40 h-32 object-cover rounded-lg"
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div>
                <motion.h3 
                  className="text-xl font-bold mb-1 flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <MapPin className="h-5 w-5 text-red-500" />
                  {activeLandmark.name}
                </motion.h3>
                <motion.p 
                  className="text-gray-300"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeLandmark.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mini-game information */}
      <AnimatePresence>
        {activeGame && !playingGame && (
          <motion.div 
            key={`game-${activeGame.id}`}
            className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start gap-3">
              <motion.div 
                className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Gamepad className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <motion.h3 
                  className="text-xl font-bold mb-1"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {activeGame.name}
                </motion.h3>
                <motion.p 
                  className="text-gray-300 mb-3"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeGame.description}
                </motion.p>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                    Start Game
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Landmark quick navigation */}
      {!playingGame && (
        <motion.div 
          className="mt-4 bg-slate-800/80 p-3 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
            Quick Travel
          </h3>
          <div className="flex flex-wrap gap-2">
            {landmarks.map(landmark => (
              <Button 
                key={landmark.id} 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => navigateToLandmark(landmark)}
              >
                <MapPin className="h-3 w-3 mr-1" /> {landmark.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Mobile controls */}
      {!playingGame && renderControls()}
    </div>
  );
};

export default KeralaItinerary;

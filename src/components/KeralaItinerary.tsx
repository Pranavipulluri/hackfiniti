import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TreePalm, Image, Gamepad, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const MAP_WIDTH = 1000;  
const MAP_HEIGHT = 1000; 
const CHARACTER_SIZE = 24;

const landmarks = [
  { 
    id: 1, 
    name: "Village Center", 
    x: 520, 
    y: 420, 
    description: "The central hub of the village with various services and shops.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 2, 
    name: "Forest Path", 
    x: 300, 
    y: 150, 
    description: "A winding path through the dense green forest.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 3, 
    name: "Farm House", 
    x: 700, 
    y: 200, 
    description: "A local farm with crops and animals.",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 4, 
    name: "Town Square", 
    x: 400, 
    y: 600, 
    description: "The main gathering place for villagers and visitors.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 5, 
    name: "Pond", 
    x: 600, 
    y: 700, 
    description: "A serene water body surrounded by greenery.",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 6, 
    name: "Garden Path", 
    x: 200, 
    y: 400, 
    description: "A beautiful pathway lined with colorful flowers.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 7, 
    name: "Market", 
    x: 800, 
    y: 500, 
    description: "A bustling marketplace with local vendors.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  }
];

const miniGames = [
  {
    id: 1,
    name: "Village Quiz",
    x: 500,
    y: 350,
    description: "Test your knowledge about the village and its surroundings.",
  },
  {
    id: 2,
    name: "Memory Match",
    x: 780,
    y: 320,
    description: "Match pairs of village items in this memory game.",
  },
  {
    id: 3,
    name: "Fishing Game",
    x: 550,
    y: 650,
    description: "Try to catch fish from the village pond.",
  },
  {
    id: 4,
    name: "Farm Harvest",
    x: 600,
    y: 250,
    description: "Help gather crops from the local farm.",
  }
];

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const KeralaItinerary = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 500, y: 400 });
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);
  const [activeLandmark, setActiveLandmark] = useState<typeof landmarks[0] | null>(null);
  const [activeGame, setActiveGame] = useState<typeof miniGames[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playingGame, setPlayingGame] = useState(false);
  const [mapScale, setMapScale] = useState(1.0);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    centerMapOnPlayer();
  }, []);

  const centerMapOnPlayer = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    
    const centerX = (containerWidth / 2 - playerPosition.x * mapScale);
    const centerY = (containerHeight / 2 - playerPosition.y * mapScale);
    
    setMapPosition({ x: centerX, y: centerY });
  }, [playerPosition, mapScale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingGame) return;
      
      const moveStep = 16;
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
      
      if (newX < 0) newX = 0;
      if (newX > MAP_WIDTH) newX = MAP_WIDTH;
      if (newY < 0) newY = 0;
      if (newY > MAP_HEIGHT) newY = MAP_HEIGHT;
      
      setPlayerDirection(newDirection);
      setPlayerPosition({ x: newX, y: newY });
      
      checkLandmarksAndGames(newX, newY);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, playerDirection, playingGame]);
  
  const checkLandmarksAndGames = (x: number, y: number) => {
    const foundLandmark = landmarks.find(landmark => 
      Math.abs(landmark.x - x) < 30 && Math.abs(landmark.y - y) < 30
    );
    
    if (foundLandmark) {
      setActiveLandmark(foundLandmark);
      setActiveGame(null);
      return;
    }
    
    const foundGame = miniGames.find(game => 
      Math.abs(game.x - x) < 30 && Math.abs(game.y - y) < 30
    );
    
    if (foundGame) {
      setActiveGame(foundGame);
      setActiveLandmark(null);
      return;
    }
    
    setActiveLandmark(null);
    setActiveGame(null);
  };

  const movePlayer = (dx: number, dy: number) => {
    const moveStep = 16;
    let newDirection = playerDirection;
    
    if (dx > 0) newDirection = Direction.RIGHT;
    else if (dx < 0) newDirection = Direction.LEFT;
    else if (dy > 0) newDirection = Direction.DOWN;
    else if (dy < 0) newDirection = Direction.UP;
    
    const newX = Math.max(0, Math.min(MAP_WIDTH, playerPosition.x + dx * moveStep));
    const newY = Math.max(0, Math.min(MAP_HEIGHT, playerPosition.y + dy * moveStep));
    
    setPlayerDirection(newDirection);
    setPlayerPosition({ x: newX, y: newY });
    
    checkLandmarksAndGames(newX, newY);
  };
  
  const handleZoom = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setMapScale(prevScale => {
      const newScale = prevScale * zoomFactor;
      return Math.max(0.5, Math.min(2.0, newScale));
    });
  };
  
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
  
  const navigateToLandmark = (landmark: typeof landmarks[0]) => {
    setPlayerPosition({
      x: landmark.x,
      y: landmark.y - 32
    });
    
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

  const startGame = () => {
    if (activeGame) {
      setPlayingGame(true);
      toast.success(`Starting ${activeGame.name}!`);
    }
  };

  const endGame = () => {
    setPlayingGame(false);
    toast.success("Game completed! Continue exploring");
  };

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

  const renderMiniGame = () => {
    if (!activeGame) return null;
    
    if (activeGame.id === 1) {
      return (
        <motion.div 
          className="p-4 bg-slate-800 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Village Quiz</h3>
          <p className="text-gray-300 mb-4">What is this village known for?</p>
          <div className="grid grid-cols-1 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">A) Fishing</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">B) Farming</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">C) Trading</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">D) Mining</Button>
            </motion.div>
          </div>
        </motion.div>
      );
    }
    
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
        <h2 className="text-2xl font-bold text-white">Village Explorer</h2>
        
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMapScale(prev => Math.max(0.5, prev - 0.1))}
            className="w-8 h-8 p-0 rounded-full"
          >
            -
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMapScale(prev => Math.min(2.0, prev + 0.1))}
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
              <h3 className="text-lg font-semibold mb-2">Welcome to Village Explorer!</h3>
              <p className="text-sm text-gray-300 mb-2">Use arrow keys or on-screen controls to move your character.</p>
              <p className="text-sm text-gray-300">Visit landmarks and mini-games to discover village attractions.</p>
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
              <div 
                ref={mapRef}
                className="absolute origin-top-left transition-transform duration-200"
                style={{ 
                  transform: `scale(${mapScale})`,
                  left: `${mapPosition.x}px`,
                  top: `${mapPosition.y}px`,
                }}
              >
                <div className="relative">
                  <img 
                    src="/lovable-uploads/f55a5bc8-b4e5-446a-9803-84768ce13250.png" 
                    alt="Village Map" 
                    className="w-[1000px] h-[1000px] object-cover pixel-art"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  
                  {landmarks.map(landmark => (
                    <motion.div
                      key={`landmark-${landmark.id}`}
                      className="absolute cursor-pointer"
                      style={{ 
                        left: landmark.x - 12, 
                        top: landmark.y - 12,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      onClick={() => navigateToLandmark(landmark)}
                    >
                      <div className="w-[24px] h-[24px] bg-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {landmark.name}
                      </div>
                    </motion.div>
                  ))}
                  
                  {miniGames.map(game => (
                    <motion.div
                      key={`game-${game.id}`}
                      className="absolute cursor-pointer"
                      style={{ 
                        left: game.x - 12, 
                        top: game.y - 12,
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
                      <div className="w-[24px] h-[24px] bg-purple-500 rounded-lg flex items-center justify-center">
                        <Gamepad className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {game.name}
                      </div>
                    </motion.div>
                  ))}
                  
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
                      className="w-full h-full bg-yellow-500 rounded-sm relative overflow-hidden flex items.center justify-center pixelated"
                      style={{ 
                        imageRendering: 'pixelated',
                        boxShadow: '0 3px 0 rgba(0,0,0,0.3)'
                      }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full relative">
                          <div className="absolute top-1/4 left-1/3 w-[4px] h-[4px] bg-black rounded-none" />
                          <div className="absolute top-1/4 right-1/3 w-[4px] h-[4px] bg-black rounded-none" />
                          <div 
                            className="absolute top-1/2 left-1/4 w-[12px] h-[4px] bg-black rounded-none"
                            style={{
                              transform: 
                                playerDirection === Direction.UP ? 'translateY(-4px)' : 
                                playerDirection === Direction.DOWN ? 'translateY(4px)' : 
                                playerDirection === Direction.LEFT ? 'translateX(-4px) rotate(90deg)' : 
                                'translateX(4px) rotate(90deg)'
                            }} 
                          />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
      
      {!playingGame && renderControls()}
      
      <style>{`
        .pixel-art {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default KeralaItinerary;

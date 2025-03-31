
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TreePalm, Image, Gamepad } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Define map tiles and landmarks
const TILE_SIZE = 40;
const MAP_WIDTH = 15;
const MAP_HEIGHT = 12;

// Tile types
enum TileType {
  GRASS = 0,
  PATH = 1,
  WATER = 2,
  TREE = 3,
  LANDMARK = 4,
  BUILDING = 5,
  TEA_FIELD = 6,
  MINIGAME = 7,
}

// Landmarks data with images
const landmarks = [
  { 
    id: 1, 
    name: "Backwaters", 
    x: 3, 
    y: 3, 
    description: "Kerala's famous backwaters, a network of canals, rivers and lakes.",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 2, 
    name: "Fort Kochi", 
    x: 2, 
    y: 8, 
    description: "Historic coastal area with colonial architecture and Chinese fishing nets.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 3, 
    name: "Munnar Tea Gardens", 
    x: 10, 
    y: 2, 
    description: "Hill station known for its vast tea plantations and cool climate.",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 4, 
    name: "Periyar Wildlife Sanctuary", 
    x: 12, 
    y: 5, 
    description: "Home to diverse wildlife, spice plantations, and boat safaris.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 5, 
    name: "Kovalam Beach", 
    x: 8, 
    y: 9, 
    description: "Famous crescent-shaped beach with lighthouse views.",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
];

// Mini-games data
const miniGames = [
  {
    id: 1,
    name: "Kerala Quiz",
    x: 5,
    y: 2,
    description: "Test your knowledge about Kerala culture and landmarks.",
  },
  {
    id: 2,
    name: "Memory Match",
    x: 13,
    y: 8,
    description: "Match Kerala's cultural symbols in this memory game.",
  }
];

// Character directions
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

// Define the game map
const createMap = () => {
  const map = Array(MAP_HEIGHT).fill(0).map(() => Array(MAP_WIDTH).fill(TileType.GRASS));
  
  // Add paths
  for (let x = 1; x < MAP_WIDTH - 1; x++) {
    map[5][x] = TileType.PATH;
  }
  
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    map[y][7] = TileType.PATH;
  }
  
  // Add water
  map[3][1] = TileType.WATER;
  map[3][2] = TileType.WATER;
  map[4][1] = TileType.WATER;
  map[4][2] = TileType.WATER;
  map[4][3] = TileType.WATER;
  
  // Add trees
  map[1][1] = TileType.TREE;
  map[1][9] = TileType.TREE;
  map[2][3] = TileType.TREE;
  map[2][12] = TileType.TREE;
  map[8][2] = TileType.TREE;
  map[8][13] = TileType.TREE;
  map[10][4] = TileType.TREE;
  map[10][10] = TileType.TREE;
  
  // Add buildings
  map[1][4] = TileType.BUILDING;
  map[9][3] = TileType.BUILDING;
  map[7][13] = TileType.BUILDING;
  
  // Add tea fields
  map[9][11] = TileType.TEA_FIELD;
  map[10][11] = TileType.TEA_FIELD;
  map[9][12] = TileType.TEA_FIELD;
  map[10][12] = TileType.TEA_FIELD;
  
  // Add landmarks
  landmarks.forEach(landmark => {
    map[landmark.y][landmark.x] = TileType.LANDMARK;
  });
  
  // Add mini-games
  miniGames.forEach(game => {
    map[game.y][game.x] = TileType.MINIGAME;
  });
  
  return map;
};

const KeralaItinerary = () => {
  const [map] = useState(createMap);
  const [playerPosition, setPlayerPosition] = useState({ x: 7, y: 5 });
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);
  const [activeLandmark, setActiveLandmark] = useState<typeof landmarks[0] | null>(null);
  const [activeGame, setActiveGame] = useState<typeof miniGames[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playingGame, setPlayingGame] = useState(false);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayerPosition(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      // Check map boundaries
      if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) {
        return prev;
      }
      
      // Check if the tile is walkable
      const tileType = map[newY][newX];
      if (tileType === TileType.TREE || tileType === TileType.WATER || tileType === TileType.BUILDING) {
        return prev;
      }
      
      // Set direction based on movement
      if (dx > 0) setPlayerDirection(Direction.RIGHT);
      else if (dx < 0) setPlayerDirection(Direction.LEFT);
      else if (dy > 0) setPlayerDirection(Direction.DOWN);
      else if (dy < 0) setPlayerDirection(Direction.UP);
      
      // If moving to a landmark, display info
      if (tileType === TileType.LANDMARK) {
        const landmark = landmarks.find(l => l.x === newX && l.y === newY);
        if (landmark) {
          setActiveLandmark(landmark);
          setActiveGame(null);
        }
      } else if (tileType === TileType.MINIGAME) {
        const game = miniGames.find(g => g.x === newX && g.y === newY);
        if (game) {
          setActiveGame(game);
          setActiveLandmark(null);
        }
      } else {
        setActiveLandmark(null);
        setActiveGame(null);
      }
      
      return { x: newX, y: newY };
    });
  }, [map]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingGame) return; // Disable movement when playing a game
      
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, playingGame]);

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

  // Render tile based on type
  const renderTile = (type: TileType, x: number, y: number) => {
    switch (type) {
      case TileType.GRASS:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute bg-green-600" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          />
        );
      case TileType.PATH:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute bg-amber-300" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          />
        );
      case TileType.WATER:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute bg-blue-500" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          />
        );
      case TileType.TREE:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          >
            <div className="w-full h-2/3 bg-green-800 rounded-full absolute bottom-0 flex items-center justify-center">
              <TreePalm className="w-5 h-5 text-green-200" />
            </div>
          </div>
        );
      case TileType.LANDMARK:
        const landmark = landmarks.find(l => l.x === x && l.y === y);
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          >
            <div className="w-full h-full bg-amber-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      case TileType.BUILDING:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          >
            <div className="w-full h-3/4 bg-gray-700 absolute bottom-0 flex items-center justify-center">
              <Image className="w-4 h-4 text-gray-300" />
            </div>
            <div className="w-full h-1/4 bg-red-800 absolute top-0 transform -translate-y-1/4" />
          </div>
        );
      case TileType.TEA_FIELD:
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute bg-green-400" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                <div className="bg-green-500 rounded-sm"></div>
                <div className="bg-green-600 rounded-sm"></div>
                <div className="bg-green-600 rounded-sm"></div>
                <div className="bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        );
      case TileType.MINIGAME:
        const game = miniGames.find(g => g.x === x && g.y === y);
        return (
          <div 
            key={`tile-${x}-${y}`} 
            className="absolute" 
            style={{ 
              width: TILE_SIZE, 
              height: TILE_SIZE, 
              left: x * TILE_SIZE, 
              top: y * TILE_SIZE 
            }}
          >
            <div className="w-full h-full bg-purple-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold animate-pulse">
                <Gamepad className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render control buttons for mobile
  const renderControls = () => (
    <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 w-36 h-36">
      <div className="col-start-2">
        <Button 
          onClick={() => movePlayer(0, -1)}
          className="w-12 h-12 bg-slate-700/70 rounded-full p-0"
          disabled={playingGame}
        >
          ↑
        </Button>
      </div>
      <div className="col-start-1 row-start-2">
        <Button 
          onClick={() => movePlayer(-1, 0)}
          className="w-12 h-12 bg-slate-700/70 rounded-full p-0"
          disabled={playingGame}
        >
          ←
        </Button>
      </div>
      <div className="col-start-3 row-start-2">
        <Button 
          onClick={() => movePlayer(1, 0)}
          className="w-12 h-12 bg-slate-700/70 rounded-full p-0"
          disabled={playingGame}
        >
          →
        </Button>
      </div>
      <div className="col-start-2 row-start-3">
        <Button 
          onClick={() => movePlayer(0, 1)}
          className="w-12 h-12 bg-slate-700/70 rounded-full p-0"
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
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Kerala Quiz</h3>
          <p className="text-gray-300 mb-4">What is Kerala often referred to as?</p>
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={endGame}>A) Land of Temples</Button>
            <Button onClick={endGame}>B) God's Own Country</Button>
            <Button onClick={endGame}>C) Spice Garden of India</Button>
            <Button onClick={endGame}>D) Paradise on Earth</Button>
          </div>
        </div>
      );
    }
    
    if (activeGame.id === 2) { // Memory Match
      return (
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Memory Match</h3>
          <div className="grid grid-cols-3 gap-2">
            {Array(9).fill(0).map((_, i) => (
              <Button 
                key={i} 
                variant="outline"
                className="h-16 bg-slate-700 hover:bg-slate-600"
                onClick={endGame}
              >
                ?
              </Button>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Character sprite based on direction
  const getCharacterStyle = () => {
    const baseStyle = {
      width: TILE_SIZE, 
      height: TILE_SIZE, 
      left: playerPosition.x * TILE_SIZE, 
      top: playerPosition.y * TILE_SIZE
    };
    
    return baseStyle;
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg w-full h-full overflow-hidden">
      <div className="flex items-center mb-4">
        <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h2 className="text-2xl font-bold text-white">My Kerala Itinerary</h2>
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

      {playingGame ? (
        <div className="mt-4">
          {renderMiniGame()}
        </div>
      ) : (
        <div className="relative bg-green-800 rounded-lg overflow-hidden shadow-xl border border-teal-900/50" 
          style={{ width: MAP_WIDTH * TILE_SIZE, height: MAP_HEIGHT * TILE_SIZE }}>
          {/* Render map tiles */}
          {map.map((row, y) => 
            row.map((tile, x) => renderTile(tile, x, y))
          )}
          
          {/* Player character */}
          <motion.div 
            className="absolute z-10 flex items-center justify-center"
            style={getCharacterStyle()}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="w-3/4 h-3/4 bg-yellow-500 rounded-full relative overflow-hidden">
              {/* Simple face */}
              <div className="absolute top-1/4 left-1/4 w-1/6 h-1/6 bg-black rounded-full" />
              <div className="absolute top-1/4 right-1/4 w-1/6 h-1/6 bg-black rounded-full" />
              {playerDirection === Direction.UP && 
                <div className="absolute top-1/2 left-[40%] w-1/5 h-1/10 bg-black rounded-full" />
              }
              {playerDirection === Direction.DOWN && 
                <div className="absolute top-[60%] left-[40%] w-1/5 h-1/10 bg-black rounded-full transform rotate-180" />
              }
              {playerDirection === Direction.LEFT && 
                <div className="absolute top-[45%] left-[30%] w-1/5 h-1/10 bg-black rounded-full" />
              }
              {playerDirection === Direction.RIGHT && 
                <div className="absolute top-[45%] right-[30%] w-1/5 h-1/10 bg-black rounded-full" />
              }
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Landmark information */}
      {activeLandmark && !playingGame && (
        <motion.div 
          className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-4">
            {activeLandmark.image && (
              <img 
                src={activeLandmark.image} 
                alt={activeLandmark.name} 
                className="w-full md:w-40 h-32 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                {activeLandmark.name}
              </h3>
              <p className="text-gray-300">{activeLandmark.description}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Mini-game information */}
      {activeGame && !playingGame && (
        <motion.div 
          className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Gamepad className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{activeGame.name}</h3>
              <p className="text-gray-300 mb-3">{activeGame.description}</p>
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                Start Game
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Legend */}
      {!playingGame && (
        <div className="mt-4 bg-slate-800/80 p-3 rounded-lg">
          <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
            Kerala Map Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-300">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-300 mr-2"></div>
              <span>Path</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span>Backwaters</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex items-center justify-center">
                <MapPin className="w-2 h-2 text-white" />
              </div>
              <span>Landmark</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 mr-2"></div>
              <span>Tea Fields</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-400 mr-2"></div>
              <span>Mini-Games</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile controls */}
      {!playingGame && renderControls()}
    </div>
  );
};

export default KeralaItinerary;

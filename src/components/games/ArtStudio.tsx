
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { shuffle } from "lodash";
import { 
  PenTool, Palette, Eraser, Save, RotateCcw, 
  CheckCircle2, Clock, Trophy, ImageIcon, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { soundManager } from "@/utils/soundUtils";

const artChallenges = [
  {
    id: 1,
    title: "Mandala Design",
    region: "India",
    description: "Create a colorful mandala pattern inspired by Indian art traditions",
    difficulty: "Medium",
    timeLimit: 120,
    example: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Chinese Calligraphy",
    region: "China",
    description: "Practice the art of Chinese calligraphy by writing characters",
    difficulty: "Hard",
    timeLimit: 90,
    example: "/placeholder.svg"
  },
  {
    id: 3,
    title: "African Patterns",
    region: "Africa",
    description: "Design geometric patterns inspired by traditional African textiles",
    difficulty: "Easy",
    timeLimit: 150,
    example: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Mexican Folk Art",
    region: "Mexico",
    description: "Create colorful illustrations inspired by Mexican folk art traditions",
    difficulty: "Medium",
    timeLimit: 120,
    example: "/placeholder.svg"
  }
];

const colors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
  "#008000", "#800000", "#008080", "#000080", "#FFC0CB"
];

const ArtStudio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [activeChallenge, setActiveChallenge] = useState(artChallenges[0]);
  const [currentTab, setCurrentTab] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [time, setTime] = useState(activeChallenge.timeLimit);
  const [gameStatus, setGameStatus] = useState<"ready" | "playing" | "finished">("ready");
  const [score, setScore] = useState(0);
  const [currentArtwork, setCurrentArtwork] = useState<string | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Set canvas size to match display size
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      // Set initial background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setCanvasContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (canvasContext) {
      canvasContext.lineJoin = 'round';
      canvasContext.lineCap = 'round';
      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = brushSize;
    }
  }, [canvasContext, color, brushSize]);

  useEffect(() => {
    let timer: number;
    
    if (gameStatus === "playing") {
      timer = window.setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [gameStatus]);

  const startChallenge = () => {
    if (!canvasRef.current || !canvasContext) return;
    
    // Reset canvas
    canvasContext.fillStyle = '#FFFFFF';
    canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    setTime(activeChallenge.timeLimit);
    setScore(0);
    setGameStatus("playing");
    setCurrentArtwork(null);
  };

  const finishChallenge = () => {
    if (!canvasRef.current) return;
    
    // Save current artwork
    const artwork = canvasRef.current.toDataURL('image/png');
    setCurrentArtwork(artwork);
    
    // Calculate score based on time remaining and challenge difficulty
    const difficultyMultiplier = 
      activeChallenge.difficulty === "Easy" ? 1 :
      activeChallenge.difficulty === "Medium" ? 1.5 : 2;
    
    const timeBonus = Math.floor(time * 0.5);
    const totalScore = Math.floor(100 * difficultyMultiplier) + timeBonus;
    
    setScore(totalScore);
    setGameStatus("finished");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameStatus !== "playing") return;
    
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    lastPosition.current = { x: offsetX, y: offsetY };
    
    soundManager.playSound("click");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || gameStatus !== "playing") return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    canvasContext.beginPath();
    canvasContext.moveTo(lastPosition.current.x, lastPosition.current.y);
    canvasContext.lineTo(offsetX, offsetY);
    canvasContext.stroke();
    
    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !canvasContext) return;
    
    canvasContext.fillStyle = '#FFFFFF';
    canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    soundManager.playSound("click");
  };

  const selectChallenge = (challenge: typeof activeChallenge) => {
    setActiveChallenge(challenge);
    setTime(challenge.timeLimit);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <PenTool className="mr-2 h-6 w-6" />
              Global Art Studio
            </CardTitle>
            <div className="flex items-center gap-3">
              {gameStatus === "playing" && (
                <>
                  <Badge variant="outline" className="bg-white/20 text-white border-none flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {time}s
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-none">
                    {activeChallenge.difficulty}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {gameStatus === "ready" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select a Cultural Art Challenge:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {artChallenges.map(challenge => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => selectChallenge(challenge)}
                  >
                    <Card className={`cursor-pointer overflow-hidden ${
                      activeChallenge.id === challenge.id ? 'ring-2 ring-purple-500' : ''
                    }`}>
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={challenge.example} 
                          alt={challenge.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{challenge.title}</h3>
                          <Badge className={
                            challenge.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                            challenge.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Region: {challenge.region}</span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {challenge.timeLimit}s
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-bold mb-2">Challenge: {activeChallenge.title}</h3>
                <p className="text-gray-600 mb-4">{activeChallenge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Time Limit: {activeChallenge.timeLimit} seconds</span>
                  <Button 
                    className="bg-purple-500 hover:bg-purple-600"
                    onClick={startChallenge}
                  >
                    Start Challenge
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {(gameStatus === "playing" || gameStatus === "finished") && (
            <div>
              {gameStatus === "playing" && (
                <div className="mb-4">
                  <h2 className="font-bold text-lg mb-1">{activeChallenge.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{activeChallenge.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-purple-500" />
                      Time Remaining: {time} seconds
                    </span>
                    <span className="text-sm text-gray-500">{activeChallenge.region} Art Style</span>
                  </div>
                  <Progress 
                    value={(time / activeChallenge.timeLimit) * 100} 
                    className="h-2 mt-2 mb-4" 
                  />
                </div>
              )}
              
              {gameStatus === "finished" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold mb-2">Art Challenge Complete!</h2>
                    <p className="text-gray-600 mb-4">
                      You earned <span className="font-bold text-purple-600">{score} points</span>!
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="font-medium mb-2">Your rewards:</h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Badge className="bg-purple-100 text-purple-700 py-1.5">+{score} Cultural Points</Badge>
                        <Badge className="bg-indigo-100 text-indigo-700 py-1.5">Creative Artist Badge</Badge>
                        <Badge className="bg-blue-100 text-blue-700 py-1.5">{activeChallenge.region} Art Style</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-3 mb-4">
                      <Button 
                        variant="outline"
                        onClick={startChallenge}
                        className="flex items-center"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                      <Button className="bg-purple-500 hover:bg-purple-600">
                        Next Challenge
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="border rounded-md overflow-hidden mb-4">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-80 touch-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
              
              {gameStatus === "playing" && (
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="draw" className="flex-1">Drawing Tools</TabsTrigger>
                    <TabsTrigger value="reference" className="flex-1">Reference Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="draw" className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Brush Size: {brushSize}px</label>
                        <Button variant="outline" size="sm" onClick={clearCanvas}>
                          <Eraser className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                      <Slider
                        value={[brushSize]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) => setBrushSize(value[0])}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Color Palette:</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((colorOption) => (
                          <button
                            key={colorOption}
                            className={`h-8 w-8 rounded-full border-2 ${
                              color === colorOption ? 'border-black' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: colorOption }}
                            onClick={() => setColor(colorOption)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setGameStatus("finished")}
                      >
                        Finish Early
                      </Button>
                      <Button 
                        className="bg-purple-500 hover:bg-purple-600"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Progress
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reference">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Reference Image</h3>
                      <div className="bg-white border rounded-md overflow-hidden mb-4">
                        <img 
                          src={activeChallenge.example}
                          alt="Reference" 
                          className="w-full h-48 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Use this reference image as inspiration for your {activeChallenge.region} art style creation.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              
              {gameStatus === "finished" && currentArtwork && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Your Artwork:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={currentArtwork}
                        alt="Your artwork" 
                        className="w-full h-48 object-contain"
                      />
                      <div className="p-2 bg-gray-50 text-center">
                        <p className="text-sm font-medium">Your Creation</p>
                      </div>
                    </div>
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={activeChallenge.example}
                        alt="Reference" 
                        className="w-full h-48 object-contain"
                      />
                      <div className="p-2 bg-gray-50 text-center">
                        <p className="text-sm font-medium">Reference</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {gameStatus === "playing" && (
          <CardFooter className="border-t p-4 flex justify-between">
            <Badge className="flex items-center">
              <ImageIcon className="mr-1 h-4 w-4" />
              {activeChallenge.region} Style
            </Badge>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{score} pts</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ArtStudio;

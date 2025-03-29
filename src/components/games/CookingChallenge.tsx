
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Timer, Check, X, ChefHat, Utensils, CookingPot, Clock, 
  Trophy, Flag, ArrowRight, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Types for our game
type Ingredient = {
  id: string;
  name: string;
  image: string;
  isCorrect: boolean;
};

type Recipe = {
  id: string;
  name: string;
  country: string;
  description: string;
  timeLimit: number;
  ingredients: Ingredient[];
  steps: string[];
  pointsValue: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

// Mock data for our recipes
const mockRecipes: Recipe[] = [
  {
    id: "kerala-sadya",
    name: "Kerala Sadya (Traditional Feast)",
    country: "India (Kerala)",
    description: "Create an authentic Kerala Sadya, a traditional vegetarian feast served on banana leaves during festivals like Onam.",
    timeLimit: 240, // 4 minutes
    difficulty: "Hard",
    pointsValue: 250,
    ingredients: [
      { id: "rice", name: "Rice", image: "/placeholder.svg", isCorrect: true },
      { id: "coconut", name: "Coconut", image: "/placeholder.svg", isCorrect: true },
      { id: "banana-leaf", name: "Banana Leaf", image: "/placeholder.svg", isCorrect: true },
      { id: "curry-leaves", name: "Curry Leaves", image: "/placeholder.svg", isCorrect: true },
      { id: "green-chili", name: "Green Chillies", image: "/placeholder.svg", isCorrect: true },
      { id: "turmeric", name: "Turmeric", image: "/placeholder.svg", isCorrect: true },
      { id: "mustard-seeds", name: "Mustard Seeds", image: "/placeholder.svg", isCorrect: true },
      { id: "yogurt", name: "Yogurt", image: "/placeholder.svg", isCorrect: true },
      { id: "jaggery", name: "Jaggery", image: "/placeholder.svg", isCorrect: true },
      { id: "ginger", name: "Ginger", image: "/placeholder.svg", isCorrect: true },
      { id: "lentils", name: "Lentils", image: "/placeholder.svg", isCorrect: true },
      { id: "vegetables", name: "Mixed Vegetables", image: "/placeholder.svg", isCorrect: true },
      { id: "tomato", name: "Tomato", image: "/placeholder.svg", isCorrect: false },
      { id: "cheese", name: "Cheese", image: "/placeholder.svg", isCorrect: false },
      { id: "pasta", name: "Pasta", image: "/placeholder.svg", isCorrect: false },
    ],
    steps: [
      "Arrange banana leaf and wash it properly",
      "Prepare rice (the centerpiece of Sadya)",
      "Cook sambar (lentil and vegetable stew)",
      "Prepare avial (mixed vegetables with coconut)",
      "Make thoran (stir-fried vegetables with coconut)",
      "Cook olan (white gourd and coconut curry)",
      "Prepare pachadi (yogurt-based side dish)",
      "Make payasam (sweet dessert) with jaggery",
      "Arrange all dishes on the banana leaf in the traditional order"
    ]
  },
  {
    id: "sushi-roll",
    name: "California Sushi Roll",
    country: "Japan",
    description: "Create a classic California sushi roll with authentic ingredients and techniques.",
    timeLimit: 180, // 3 minutes
    difficulty: "Medium",
    pointsValue: 150,
    ingredients: [
      { id: "rice", name: "Sushi Rice", image: "/placeholder.svg", isCorrect: true },
      { id: "nori", name: "Nori Seaweed", image: "/placeholder.svg", isCorrect: true },
      { id: "avocado", name: "Avocado", image: "/placeholder.svg", isCorrect: true },
      { id: "cucumber", name: "Cucumber", image: "/placeholder.svg", isCorrect: true },
      { id: "crab", name: "Crab Meat", image: "/placeholder.svg", isCorrect: true },
      { id: "mayo", name: "Japanese Mayo", image: "/placeholder.svg", isCorrect: true },
      { id: "wasabi", name: "Wasabi", image: "/placeholder.svg", isCorrect: true },
      { id: "tomato", name: "Tomato", image: "/placeholder.svg", isCorrect: false },
      { id: "cheese", name: "Cheddar Cheese", image: "/placeholder.svg", isCorrect: false },
      { id: "beef", name: "Ground Beef", image: "/placeholder.svg", isCorrect: false },
    ],
    steps: [
      "Prepare sushi rice with vinegar and salt",
      "Lay down a sheet of nori on a bamboo mat",
      "Spread a thin layer of rice on the nori",
      "Place avocado, cucumber, and crab in the center",
      "Roll tightly using the bamboo mat",
      "Slice into 6-8 pieces with a wet knife",
      "Serve with soy sauce, wasabi, and pickled ginger"
    ]
  },
  {
    id: "paella",
    name: "Seafood Paella",
    country: "Spain",
    description: "Create a traditional Spanish paella with authentic seafood and saffron rice.",
    timeLimit: 240, // 4 minutes
    difficulty: "Hard",
    pointsValue: 200,
    ingredients: [
      { id: "rice", name: "Bomba Rice", image: "/placeholder.svg", isCorrect: true },
      { id: "saffron", name: "Saffron", image: "/placeholder.svg", isCorrect: true },
      { id: "shrimp", name: "Shrimp", image: "/placeholder.svg", isCorrect: true },
      { id: "mussels", name: "Mussels", image: "/placeholder.svg", isCorrect: true },
      { id: "olive-oil", name: "Olive Oil", image: "/placeholder.svg", isCorrect: true },
      { id: "paprika", name: "Paprika", image: "/placeholder.svg", isCorrect: true },
      { id: "tomato", name: "Tomato", image: "/placeholder.svg", isCorrect: true },
      { id: "parsley", name: "Parsley", image: "/placeholder.svg", isCorrect: true },
      { id: "chicken", name: "Chicken", image: "/placeholder.svg", isCorrect: false },
      { id: "bacon", name: "Bacon", image: "/placeholder.svg", isCorrect: false },
    ],
    steps: [
      "Heat olive oil in a paella pan",
      "Sauté garlic and onions until translucent",
      "Add tomatoes and paprika, cook for 2 minutes",
      "Stir in rice and saffron, toast for 1 minute",
      "Pour in fish stock and bring to a boil",
      "Add seafood and simmer until rice is cooked",
      "Garnish with fresh parsley before serving"
    ]
  },
];

// Game states
type GameState = "start" | "playing" | "complete" | "timeout";

const CookingChallenge = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setGameState("timeout");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, timeLeft]);

  const startGame = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setSelectedIngredients([]);
    setMistakes(0);
    setTimeLeft(recipe.timeLimit);
    setGameState("playing");
  };

  const selectIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.includes(ingredient.id)) {
      setSelectedIngredients(prev => prev.filter(id => id !== ingredient.id));
      return;
    }
    
    if (ingredient.isCorrect) {
      setSelectedIngredients(prev => [...prev, ingredient.id]);
      
      // Check if all correct ingredients are selected
      if (currentRecipe) {
        const correctIngredients = currentRecipe.ingredients.filter(i => i.isCorrect);
        if (selectedIngredients.length + 1 === correctIngredients.length) {
          // Game complete - calculate score
          const baseScore = currentRecipe.pointsValue;
          const timeBonus = Math.floor(timeLeft / 10);
          const mistakePenalty = mistakes * 20;
          const finalScore = baseScore + timeBonus - mistakePenalty;
          
          setScore(finalScore);
          setGameState("complete");
        }
      }
    } else {
      // Wrong ingredient selected
      setMistakes(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setGameState("start");
    setCurrentRecipe(null);
    setSelectedIngredients([]);
    setScore(0);
    setTimeLeft(0);
    setMistakes(0);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get progress percentage for correct ingredients
  const getProgress = () => {
    if (!currentRecipe) return 0;
    const correctIngredients = currentRecipe.ingredients.filter(i => i.isCorrect);
    return (selectedIngredients.length / correctIngredients.length) * 100;
  };

  return (
    <div className="cooking-challenge max-w-5xl mx-auto my-8">
      {/* Start Screen */}
      {gameState === "start" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <ChefHat className="h-8 w-8 text-teal-500" /> 
              Cooking Challenge
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Test your culinary skills by selecting the correct ingredients for authentic global recipes.
              Work fast to earn time bonuses!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRecipes.map(recipe => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gradient-to-r from-teal-500 to-teal-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CookingPot className="h-16 w-16 text-white" />
                  </div>
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      recipe.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                      recipe.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span>{recipe.name}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      {recipe.country}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTime(recipe.timeLimit)}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{recipe.pointsValue} pts</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    onClick={() => startGame(recipe)}
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Playing Screen */}
      {gameState === "playing" && currentRecipe && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-playing"
        >
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-teal-500" />
                  {currentRecipe.name}
                </CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flag className="h-3 w-3" /> {currentRecipe.country}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-xl">Mistakes: {mistakes}</span>
                  </div>
                </div>
                <Button variant="outline" onClick={resetGame}>Cancel</Button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Progress</p>
                <Progress value={getProgress()} className="h-2" />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Instructions:</h3>
                <p className="text-gray-600 mb-4">
                  Select all the correct ingredients needed for this recipe. 
                  Be careful – choosing incorrect ingredients will cost you points!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentRecipe.ingredients.map(ingredient => (
              <motion.div
                key={ingredient.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className={`
                    cursor-pointer rounded-lg border overflow-hidden transition-all
                    ${selectedIngredients.includes(ingredient.id) 
                      ? 'border-teal-500 bg-teal-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => selectIngredient(ingredient)}
                >
                  <div className="h-24 relative bg-gray-100 flex items-center justify-center">
                    <img src={ingredient.image} alt={ingredient.name} className="h-16 w-16 object-contain" />
                    {selectedIngredients.includes(ingredient.id) && (
                      <div className="absolute top-1 right-1 bg-teal-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-medium text-sm">{ingredient.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Complete Screen */}
      {gameState === "complete" && currentRecipe && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader className="pb-2">
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mx-auto bg-teal-100 text-teal-700 p-4 rounded-full mb-4"
              >
                <Trophy className="h-12 w-12" />
              </motion.div>
              <CardTitle className="text-2xl">Challenge Complete!</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Excellent work, chef! You've successfully completed the {currentRecipe.name} challenge.
              </p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-bold text-3xl flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  {score} points
                </h3>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Base score:</span>
                    <span>{currentRecipe.pointsValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time bonus:</span>
                    <span>+{Math.floor(timeLeft / 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mistake penalty:</span>
                    <span>-{mistakes * 20}</span>
                  </div>
                </div>
              </motion.div>
              
              <div className="pt-2">
                <p className="font-medium mb-2">You've learned:</p>
                <Badge className="mr-2 mb-2">Authentic ingredients</Badge>
                <Badge className="mr-2 mb-2">Japanese cuisine</Badge>
                <Badge className="mr-2 mb-2">Culinary techniques</Badge>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center"
                onClick={resetGame}
              >
                <ChefHat className="mr-2 h-4 w-4" />
                Try Another Recipe
              </Button>
              <Button variant="outline" className="w-full" onClick={resetGame}>
                Back to Challenges
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Timeout Screen */}
      {gameState === "timeout" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader className="pb-2">
              <div className="mx-auto bg-orange-100 text-orange-700 p-4 rounded-full mb-4">
                <Timer className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl">Time's Up!</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-6">
                Don't worry, even the best chefs need practice. Try again and see if you can complete the challenge!
              </p>
              
              <div className="pt-2">
                <p className="font-medium mb-2">Tips:</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-teal-500" />
                    Look for ingredients commonly used in the cuisine.
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-teal-500" />
                    Focus on selecting the main ingredients first.
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-teal-500" />
                    Remember the ingredients from previous attempts.
                  </li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="flex-1 mr-2"
                onClick={resetGame}
              >
                Back to Challenges
              </Button>
              
              <Button 
                className="flex-1 ml-2 bg-teal-500 hover:bg-teal-600"
                onClick={() => currentRecipe && startGame(currentRecipe)}
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CookingChallenge;

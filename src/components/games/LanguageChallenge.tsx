
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { shuffle } from "lodash";
import { Check, X, Volume2, Globe, RefreshCw, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { soundManager } from "@/utils/soundUtils";

const phrases = [
  { 
    text: "Hello, how are you?", 
    language: "English",
    translations: [
      { language: "Spanish", text: "Hola, ¿cómo estás?" },
      { language: "French", text: "Bonjour, comment ça va?" },
      { language: "Japanese", text: "こんにちは、お元気ですか？" },
      { language: "Arabic", text: "مرحبا، كيف حالك؟" }
    ]
  },
  { 
    text: "Thank you very much", 
    language: "English",
    translations: [
      { language: "Spanish", text: "Muchas gracias" },
      { language: "French", text: "Merci beaucoup" },
      { language: "Japanese", text: "どうもありがとう" },
      { language: "Arabic", text: "شكرا جزيلا" }
    ]
  },
  { 
    text: "What's your name?", 
    language: "English",
    translations: [
      { language: "Spanish", text: "¿Cómo te llamas?" },
      { language: "French", text: "Comment t'appelles-tu?" },
      { language: "Japanese", text: "お名前は何ですか？" },
      { language: "Arabic", text: "ما هو اسمك؟" }
    ]
  },
  { 
    text: "I would like to order food", 
    language: "English",
    translations: [
      { language: "Spanish", text: "Me gustaría pedir comida" },
      { language: "French", text: "Je voudrais commander à manger" },
      { language: "Japanese", text: "食べ物を注文したいです" },
      { language: "Arabic", text: "أود طلب الطعام" }
    ]
  },
  { 
    text: "Where is the bathroom?", 
    language: "English",
    translations: [
      { language: "Spanish", text: "¿Dónde está el baño?" },
      { language: "French", text: "Où sont les toilettes?" },
      { language: "Japanese", text: "お手洗いはどこですか？" },
      { language: "Arabic", text: "أين الحمام؟" }
    ]
  }
];

interface Option {
  text: string;
  isCorrect: boolean;
  language: string;
}

const LanguageChallenge = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameStatus, setGameStatus] = useState<"ready" | "playing" | "finished">("ready");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("Spanish");

  const languages = ["Spanish", "French", "Japanese", "Arabic"];

  const prepareOptions = (phraseIndex: number, language: string) => {
    // Get correct answer
    const correctAnswer = phrases[phraseIndex].translations.find(t => t.language === language);
    
    // Get 3 incorrect answers from other phrases
    const otherOptions = phrases
      .filter((_, index) => index !== phraseIndex)
      .map(phrase => phrase.translations.find(t => t.language === language))
      .filter(Boolean)
      .slice(0, 3);
    
    // Combine and shuffle
    const allOptions = [
      { text: correctAnswer?.text || "", isCorrect: true, language },
      ...otherOptions.map(opt => ({ 
        text: opt?.text || "", 
        isCorrect: false, 
        language 
      }))
    ];
    
    return shuffle(allOptions);
  };

  const startGame = () => {
    setScore(0);
    setCurrentPhrase(0);
    setTime(60);
    setGameStatus("playing");
    setSelectedOption(null);
    setFeedbackVisible(false);
    
    // Prepare first set of options
    setOptions(prepareOptions(0, currentLanguage));
  };

  const handleOptionSelect = (option: Option) => {
    if (selectedOption || gameStatus !== "playing") return;
    
    soundManager.playSound("click");
    setSelectedOption(option);
    setFeedbackVisible(true);
    
    if (option.isCorrect) {
      setScore(prev => prev + 100);
    }
    
    // Move to next phrase after delay
    setTimeout(() => {
      if (currentPhrase < phrases.length - 1) {
        const nextPhraseIndex = currentPhrase + 1;
        setCurrentPhrase(nextPhraseIndex);
        setOptions(prepareOptions(nextPhraseIndex, currentLanguage));
        setSelectedOption(null);
        setFeedbackVisible(false);
      } else {
        setGameStatus("finished");
      }
    }, 1500);
  };

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    if (gameStatus === "playing") {
      setOptions(prepareOptions(currentPhrase, language));
    }
  };

  useEffect(() => {
    let timer: number;
    
    if (gameStatus === "playing") {
      timer = window.setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus("finished");
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-6 w-6" />
              Language Passport Challenge
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white/20 text-white border-none flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {time}s
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-none flex items-center">
                <Trophy className="mr-1 h-4 w-4" />
                {score} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {gameStatus === "ready" && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to Language Passport!</h2>
              <p className="mb-6 text-gray-600">
                Test your knowledge of common phrases in different languages. 
                Translate from English to other languages and earn points!
              </p>
              
              <div className="mb-8">
                <h3 className="font-medium mb-2">Select target language:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {languages.map(lang => (
                    <Button
                      key={lang}
                      variant={currentLanguage === lang ? "default" : "outline"}
                      className={currentLanguage === lang ? "bg-blue-500 hover:bg-blue-600" : ""}
                      onClick={() => changeLanguage(lang)}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={startGame}
              >
                Start Challenge
              </Button>
            </div>
          )}
          
          {gameStatus === "playing" && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Translate this phrase:</p>
                  <h3 className="text-xl font-medium flex items-center">
                    {phrases[currentPhrase].text}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Target language:</p>
                  <h3 className="text-xl font-medium">{currentLanguage}</h3>
                </div>
              </div>
              
              <Progress 
                value={((currentPhrase + 1) / phrases.length) * 100} 
                className="h-2 mb-6" 
              />
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                {options.map((option, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full p-4 h-auto justify-start text-left ${
                        selectedOption && option.isCorrect ? "border-green-500 bg-green-50" :
                        selectedOption === option && !option.isCorrect ? "border-red-500 bg-red-50" :
                        ""
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                    >
                      <span>{option.text}</span>
                      {selectedOption && option.isCorrect && (
                        <Check className="ml-auto h-5 w-5 text-green-500" />
                      )}
                      {selectedOption === option && !option.isCorrect && (
                        <X className="ml-auto h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {feedbackVisible && selectedOption && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`p-4 rounded-md mb-4 ${
                    selectedOption.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedOption.isCorrect ? 
                    <p className="flex items-center">
                      <Check className="mr-2 h-5 w-5" />
                      Correct! Well done.
                    </p> : 
                    <p className="flex items-center">
                      <X className="mr-2 h-5 w-5" />
                      Not quite right. The correct answer was: {
                        options.find(o => o.isCorrect)?.text
                      }
                    </p>
                  }
                </motion.div>
              )}
            </div>
          )}
          
          {gameStatus === "finished" && (
            <div className="text-center py-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
                <p className="text-gray-600">
                  You scored <span className="font-bold text-blue-600">{score} points</span>!
                </p>
              </motion.div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Your rewards:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 py-1.5">+{score} Cultural Points</Badge>
                  {score >= 300 && <Badge className="bg-purple-100 text-purple-700 py-1.5">Language Explorer Badge</Badge>}
                  {score >= 400 && <Badge className="bg-teal-100 text-teal-700 py-1.5">{currentLanguage} Basics Achievement</Badge>}
                </div>
              </div>
              
              <div className="flex justify-center gap-3">
                <Button 
                  variant="outline"
                  onClick={startGame}
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Next Challenge
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {gameStatus === "playing" && (
          <CardFooter className="border-t p-4 flex justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-2">
                {[...Array(3)].map((_, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U{i+1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-gray-500">246 players</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Hint
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setGameStatus("finished")}
              >
                End Game
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default LanguageChallenge;

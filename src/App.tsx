
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Index from "./pages/Index";
import About from "./pages/About";
import CreateCharacter from "./pages/CreateCharacter";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import Chat from "./pages/Chat";
import Exploration from "./pages/Exploration";
import MiniGames from "./pages/MiniGames";
import WelcomePage from "./pages/WelcomePage";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/create-character" element={<CreateCharacter />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/exploration" element={<Exploration />} />
                <Route path="/mini-games" element={<MiniGames />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

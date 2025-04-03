
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
import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/contexts/SoundContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="theme">
              <SoundProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route 
                        path="/create-character" 
                        element={
                          <ProtectedRoute>
                            <CreateCharacter />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/welcome" element={<WelcomePage />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route 
                        path="/chat" 
                        element={
                          <ProtectedRoute>
                            <Chat />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/exploration" 
                        element={
                          <ProtectedRoute>
                            <Exploration />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/mini-games" 
                        element={
                          <ProtectedRoute>
                            <MiniGames />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </TooltipProvider>
              </SoundProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

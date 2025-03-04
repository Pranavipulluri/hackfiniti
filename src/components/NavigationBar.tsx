
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, ShoppingBag, MessageCircle, Globe, Gamepad, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavigationBar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/marketplace", label: "Marketplace", icon: <ShoppingBag className="w-5 h-5" /> },
    { path: "/chat", label: "Chat", icon: <MessageCircle className="w-5 h-5" /> },
    { path: "/exploration", label: "Explore", icon: <Globe className="w-5 h-5" /> },
    { path: "/mini-games", label: "Mini-Games", icon: <Gamepad className="w-5 h-5" /> },
    { path: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-playfair font-bold text-xl text-teal-600">Cultural Quest</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "relative",
                    isActive && "bg-teal-500 hover:bg-teal-600"
                  )}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="outline" size="icon">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

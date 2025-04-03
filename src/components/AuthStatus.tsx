
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { LogOut, User, Settings } from "lucide-react";

const AuthStatus = () => {
  const { user, loading, signOut, isDemoMode } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Button variant="ghost" disabled className="h-9 w-9 rounded-full">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </Button>
    );
  }

  // If user is not authenticated and not in demo mode
  if (!user && !isDemoMode) {
    return (
      <Button onClick={() => navigate("/auth")} variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white">
        Sign In
      </Button>
    );
  }

  // If user is authenticated or in demo mode
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 rounded-full relative" aria-label="User menu">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={profile?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=default"} 
              alt="User avatar" 
            />
            <AvatarFallback>{profile?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
          {isDemoMode && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
              D
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {isDemoMode ? "Demo User" : (profile?.username || "User")}
          {isDemoMode && <span className="block text-xs text-yellow-500">Demo Mode</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {isDemoMode ? "Exit Demo" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthStatus;

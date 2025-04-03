
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-2 text-teal-600">Loading authentication...</span>
      </div>
    );
  }

  // If the user is not authenticated and not in demo mode, redirect to auth
  if (!user && !isDemoMode) {
    // Pass the current location as state so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if there are temporary user details in localStorage (for email confirmation workaround)
  const tempUserId = localStorage.getItem('tempUserId');
  if (tempUserId && !user && !isDemoMode) {
    // We have temporary user details but no authenticated user yet
    // This is likely during the email confirmation flow
    // Let's automatically enter demo mode with the stored region
    const tempRegion = localStorage.getItem('tempUserRegion') || 'Global';
    console.log('Using temporary user details to enter demo mode with region:', tempRegion);
    
    // We should call enterDemoMode here, but since we can't call hooks conditionally,
    // we'll set the localStorage values directly
    localStorage.setItem('culturalQuestDemoMode', 'true');
    localStorage.setItem('demoUserRegion', tempRegion);
    
    // We won't redirect to prevent an infinite loop, just render the children
    return <>{children}</>;
  }

  // User is authenticated or in demo mode, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;

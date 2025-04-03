
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

  // User is authenticated or in demo mode, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;

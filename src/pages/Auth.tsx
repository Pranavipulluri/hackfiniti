
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<boolean>(navigator.onLine);
  const [showDemoDialog, setShowDemoDialog] = useState(false);

  // Check for online status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const clearError = () => setError(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkStatus) {
      setError('You are offline. Please check your internet connection and try again.');
      return;
    }
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    clearError();
    try {
      setIsSubmitting(true);
      await signIn(username, password);
      // Redirection will be handled by the useEffect above
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkStatus) {
      setError('You are offline. Please check your internet connection and try again.');
      return;
    }
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    clearError();
    try {
      setIsSubmitting(true);
      await signUp(username, password);
      // The signUp function now handles the sign in automatically
      // Redirection will be handled by the useEffect above
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('Failed to create account. Please try a different username or check your internet connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const enterDemoMode = () => {
    // Store demo mode flag in localStorage
    localStorage.setItem('culturalQuestDemoMode', 'true');
    // Redirect to home page
    navigate('/');
    setShowDemoDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Cultural Quest</CardTitle>
          <CardDescription>
            Join the quest to explore cultures around the world
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!networkStatus && (
            <Alert variant="destructive" className="mb-4">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You are currently offline. Please check your internet connection or use Demo Mode.
              </AlertDescription>
            </Alert>
          )}
          
          {networkStatus && (
            <div className="flex items-center justify-center mb-4 text-sm text-green-600">
              <Wifi className="h-4 w-4 mr-2" />
              <span>Connected to network</span>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="your_username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    onClick={clearError}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    onClick={clearError}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || loading || !networkStatus}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input 
                    id="reg-username" 
                    type="text" 
                    placeholder="your_username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    onClick={clearError}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    onClick={clearError}
                  />
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || loading || !networkStatus}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => setShowDemoDialog(true)}
            >
              Try Demo Mode
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </CardFooter>
      </Card>
      
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Demo Mode</DialogTitle>
            <DialogDescription>
              Demo mode lets you explore CulturalQuest without an account. 
              Your progress won't be saved and some features may be limited.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={enterDemoMode}>
              Continue to Demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </motion.div>
  );
};

export default Auth;

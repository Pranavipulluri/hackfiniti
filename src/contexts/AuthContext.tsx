
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextProps = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, region?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
  enterDemoMode: (region?: string) => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkDemoMode = () => {
      const demoMode = localStorage.getItem('culturalQuestDemoMode') === 'true';
      setIsDemoMode(demoMode);
      
      // If in demo mode, set loading to false
      if (demoMode) {
        setLoading(false);
      }
    };
    
    // Check for demo mode first
    checkDemoMode();
    
    // Only proceed with Supabase session if not in demo mode
    if (!isDemoMode) {
      const getInitialSession = async () => {
        setLoading(true);
        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error('Error retrieving session:', error);
          }

          setSession(session);
          setUser(session?.user ?? null);
        } catch (error) {
          console.error('Failed to get initial session:', error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isDemoMode]);

  // Check for demo mode changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const demoMode = localStorage.getItem('culturalQuestDemoMode') === 'true';
      setIsDemoMode(demoMode);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // First check network connectivity
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
        throw new Error("Network unavailable");
      }
      
      setLoading(true);
      
      // Validate that username is in email format for Supabase
      const email = username.includes('@') ? username : `${username}@culturalquest.com`;
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        // Check if it's a network error
        if (error.message === 'Failed to fetch') {
          toast({
            title: "Network error",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication error",
            description: error.message,
            variant: "destructive",
          });
        }
        throw error;
      }
      
      // Clear demo mode if it was set
      localStorage.removeItem('culturalQuestDemoMode');
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string, region?: string) => {
    try {
      // First check network connectivity
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
        throw new Error("Network unavailable");
      }
      
      setLoading(true);
      
      // Ensure username is in email format for Supabase
      const email = username.includes('@') ? username : `${username}@culturalquest.com`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) {
        // Check if it's a network error
        if (error.message === 'Failed to fetch') {
          toast({
            title: "Network error",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up error",
            description: error.message,
            variant: "destructive",
          });
        }
        throw error;
      }
      
      if (data && data.user) {
        try {
          // After signup, immediately sign in
          const { error: signInError } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });
          
          if (signInError) {
            console.error('Error auto-signing in after registration:', signInError);
            toast({
              title: "Sign in error after registration",
              description: "Your account was created but we couldn't sign you in automatically. Please try signing in manually.",
              variant: "destructive",
            });
            throw signInError;
          }
          
          // Initialize user profile in the database - No email field
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: username,
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + username,
              level: 1,
              xp: 0,
              region: region || 'Global',
              created_at: new Date().toISOString()
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
          
          // Clear demo mode if it was set
          localStorage.removeItem('culturalQuestDemoMode');
          
          toast({
            title: "Account created",
            description: "Welcome to CulturalQuest! Your account has been created.",
          });
        } catch (signInError) {
          console.error('Error auto-signing in after registration:', signInError);
          toast({
            title: "Sign in error after registration",
            description: "Your account was created but we couldn't sign you in automatically. Please try signing in manually.",
            variant: "destructive",
          });
          throw signInError;
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const enterDemoMode = (region?: string) => {
    localStorage.setItem('culturalQuestDemoMode', 'true');
    localStorage.setItem('demoUserRegion', region || 'Global');
    setIsDemoMode(true);
    
    toast({
      title: "Demo Mode Activated",
      description: `You're now exploring CulturalQuest in Demo Mode. Region: ${region || 'Global'}`,
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Check if in demo mode
      if (isDemoMode) {
        // Just clear the demo mode flag
        localStorage.removeItem('culturalQuestDemoMode');
        localStorage.removeItem('demoUserRegion');
        setIsDemoMode(false);
        
        toast({
          title: "Exited demo mode",
          description: "You have exited demo mode successfully.",
        });
        
        setLoading(false);
        return;
      }
      
      // Regular sign out through Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isDemoMode,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextProps = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error retrieving session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
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

  const signIn = async (usernameOrEmail: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail, // Supabase uses email field for login identifier
        password
      });
      if (error) {
        toast({ title: "Authentication error", description: error.message, variant: "destructive", });
        throw error;
      }
      toast({ title: "Welcome back!", description: "You've successfully signed in.", });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    console.log('DEBUG (AuthContext)** Received in signUp:', { username, email, password }); // Add/keep this log

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email, // Use the email argument
        password: password,
        options: { data: { username: username } }
      });

      console.log('DEBUG (AuthContext)** Supabase signUp result Data:', data);
      console.log('DEBUG (AuthContext)** Supabase signUp result Error:', error);

      if (error) {
        throw new Error(error.message || 'Failed to sign up via Supabase.');
      }
    } catch (error) {
      console.error('DEBUG (AuthContext)** Catch block error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred.');
      }
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
        toast({ title: "Sign out error", description: error.message, variant: "destructive", });
        throw error;
      }
      toast({ title: "Signed out", description: "You have been signed out successfully.", });
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


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextProps = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
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

  const signUp = async (username: string, password: string) => {
    try {
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
          await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });
          
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

  const signOut = async () => {
    try {
      setLoading(true);
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


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
    // Get initial session
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

    // Listen for auth changes
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
      // Generate email from username for Supabase auth
      const email = `${username}@culturalquest.com`;
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
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
      // Generate email from username for Supabase auth
      const email = `${username}@culturalquest.com`;
      
      // First, create the user account with signUp
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          },
          // Disable email verification
          emailRedirectTo: null,
        },
      });
      
      if (error) {
        toast({
          title: "Sign up error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // After user creation, we don't wait for email verification
      // Instead, directly sign in the user
      if (data && data.user) {
        // Instead of waiting for email verification, sign in directly
        try {
          // We sign in directly, bypassing email verification
          await supabase.auth.signInWithPassword({ email, password });
          
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

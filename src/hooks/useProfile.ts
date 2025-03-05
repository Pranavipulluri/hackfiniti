
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Profile = {
  id: string;
  username: string;
  avatar: string;
  created_at: string;
  region: string | null;
  level: number;
  xp: number;
  bio: string | null;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfile(data as Profile);
      } catch (error) {
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    
    // Set up a realtime subscription to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // No need to update local state as the realtime subscription will handle it
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  return {
    profile,
    loading,
    updateProfile
  };
}

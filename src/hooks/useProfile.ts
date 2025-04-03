
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/types/supabase-extensions';

// Use type-only export for re-exporting types
export type { Profile };

export function useProfile() {
  const { user, isDemoMode } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isDemoMode) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    const fetchProfile = async () => {
      setLoading(true);
      
      if (isDemoMode) {
        // Create a mock profile for demo mode
        const demoRegion = localStorage.getItem('demoUserRegion') || 'Global';
        const demoProfile: Profile = {
          id: 'demo-user',
          username: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demouser',
          level: 1,
          xp: 0,
          region: demoRegion,
          created_at: new Date().toISOString(),
          bio: 'This is a demo account exploring CulturalQuest.',
        } as Profile;
        
        setProfile(demoProfile);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          // If profile doesn't exist, let's create one
          if (error.code === 'PGRST116') {
            // Make sure id is required since it's a primary key
            const newProfile = {
              id: user!.id,
              username: user!.user_metadata?.username || 'User',
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user!.id}`,
              level: 1,
              xp: 0,
              region: 'Global',
              bio: ''
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              setProfile(createdProfile as Profile);
              setLoading(false);
              return;
            }
          }
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
    if (user) {
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
    }
  }, [user, isDemoMode]);
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (isDemoMode) {
      // In demo mode, we just update the local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates,
        };
      });
      
      // If updating region, store in localStorage
      if (updates.region) {
        localStorage.setItem('demoUserRegion', updates.region);
      }
      
      toast({
        title: "Profile updated (Demo)",
        description: "Your profile has been updated in demo mode. Note that changes won't persist after you leave.",
      });
      
      return;
    }
    
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


import { Database } from '@/integrations/supabase/types';

// Extend the existing Database types without modifying the original file
export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  region?: string;
  bio?: string;
};
export type Message = Database['public']['Tables']['messages']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ChatGroup = Database['public']['Tables']['chat_groups']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];

// Additional custom types for the app
export type MessageWithSender = Message & {
  sender: Profile;
};

export type ChatContact = Contact & {
  profile: Profile;
};

export type ChatGroupWithMembers = ChatGroup & {
  members: (GroupMember & { profile: Profile })[];
};

// Add this type for the Scoreboard component
export type LeaderboardUser = Profile & {
  rank?: number;
};

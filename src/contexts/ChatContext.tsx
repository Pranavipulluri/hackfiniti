
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  group_id: string | null;
  content: string;
  created_at: string;
  read: boolean;
  message_type: string;
};

export type Contact = {
  id: string;
  user_id: string;
  contact_id: string;
  created_at: string;
  status: string;
  profile?: {
    username: string;
    avatar: string;
  };
};

export type ChatGroup = {
  id: string;
  name: string;
  avatar: string | null;
  created_at: string;
  created_by: string | null;
};

type ChatContextProps = {
  messages: Message[];
  contacts: Contact[];
  groups: ChatGroup[];
  loadingMessages: boolean;
  loadingContacts: boolean;
  loadingGroups: boolean;
  activeChat: { type: 'contact' | 'group', id: string } | null;
  setActiveChat: (chat: { type: 'contact' | 'group', id: string } | null) => void;
  sendMessage: (content: string) => Promise<void>;
  addContact: (contactId: string) => Promise<void>;
  updateContactStatus: (contactId: string, status: string) => Promise<void>;
  createGroup: (name: string, avatar?: string) => Promise<string>;
  joinGroup: (groupId: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [activeChat, setActiveChat] = useState<{ type: 'contact' | 'group', id: string } | null>(null);

  // Fetch contacts
  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        // First get the contact IDs
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'accepted');

        if (error) {
          console.error('Error fetching contacts:', error);
          return;
        }

        // Then fetch the profiles for those contacts
        const contactsList = [...data] as Contact[];
        
        for (let i = 0; i < contactsList.length; i++) {
          const contact = contactsList[i];
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar')
            .eq('id', contact.contact_id)
            .single();
            
          if (!profileError && profileData) {
            contactsList[i] = { 
              ...contact, 
              profile: {
                username: profileData.username || 'Unknown',
                avatar: profileData.avatar || '/placeholder.svg'
              }
            };
          }
        }
        
        setContacts(contactsList);
      } catch (error) {
        console.error('Error in contacts fetch:', error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [user]);

  // Fetch groups
  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const { data: memberData, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        if (memberError) {
          console.error('Error fetching group memberships:', memberError);
          return;
        }

        if (memberData.length === 0) {
          setGroups([]);
          setLoadingGroups(false);
          return;
        }

        const groupIds = memberData.map(m => m.group_id);

        const { data: groupData, error: groupError } = await supabase
          .from('chat_groups')
          .select('*')
          .in('id', groupIds);

        if (groupError) {
          console.error('Error fetching groups:', groupError);
          return;
        }

        setGroups(groupData as ChatGroup[]);
      } catch (error) {
        console.error('Error in groups fetch:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [user]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!user || !activeChat) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (activeChat.type === 'contact') {
          query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${user.id})`);
        } else {
          query = query.eq('group_id', activeChat.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setMessages(data as Message[]);
      } catch (error) {
        console.error('Error in messages fetch:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: activeChat.type === 'contact' 
            ? `or(and(sender_id=eq.${user.id},receiver_id=eq.${activeChat.id}),and(sender_id=eq.${activeChat.id},receiver_id=eq.${user.id}))`
            : `group_id=eq.${activeChat.id}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat]);

  const sendMessage = async (content: string) => {
    if (!user || !activeChat) {
      toast({
        title: "Error",
        description: "No active chat selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newMessage = {
        sender_id: user.id,
        content,
        message_type: 'text',
        ...(activeChat.type === 'contact' 
          ? { receiver_id: activeChat.id, group_id: null } 
          : { receiver_id: null, group_id: activeChat.id })
      };

      const { error } = await supabase.from('messages').insert(newMessage);

      if (error) {
        toast({
          title: "Error sending message",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const addContact = async (contactId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('contacts').insert({
        user_id: user.id,
        contact_id: contactId,
        status: 'pending'
      });

      if (error) {
        toast({
          title: "Error adding contact",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Contact request sent",
        description: "Your contact request has been sent.",
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const updateContactStatus = async (contactId: string, status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('contact_id', user.id)
        .eq('user_id', contactId);

      if (error) {
        toast({
          title: "Error updating contact",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // If accepted, create reverse relationship
      if (status === 'accepted') {
        const { error: reverseError } = await supabase.from('contacts').upsert({
          user_id: user.id,
          contact_id: contactId,
          status: 'accepted'
        });

        if (reverseError) {
          console.error('Error creating reverse contact:', reverseError);
        }
      }

      toast({
        title: "Contact updated",
        description: `Contact request ${status}.`,
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const createGroup = async (name: string, avatar?: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from('chat_groups')
        .insert({
          name,
          avatar: avatar || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating group",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Add creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id
        });

      if (memberError) {
        console.error('Error adding creator to group:', memberError);
      }

      toast({
        title: "Group created",
        description: `Your group "${name}" has been created.`,
      });

      // Update local groups list
      setGroups(prev => [...prev, data as ChatGroup]);

      return data.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });

      if (error) {
        toast({
          title: "Error joining group",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Fetch and add group to local state
      const { data, error: groupError } = await supabase
        .from('chat_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) {
        console.error('Error fetching joined group:', groupError);
      } else {
        setGroups(prev => [...prev, data as ChatGroup]);
      }

      toast({
        title: "Joined group",
        description: "You have successfully joined the group.",
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        contacts,
        groups,
        loadingMessages,
        loadingContacts,
        loadingGroups,
        activeChat,
        setActiveChat,
        sendMessage,
        addContact,
        updateContactStatus,
        createGroup,
        joinGroup
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

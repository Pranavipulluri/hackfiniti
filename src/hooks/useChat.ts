
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { Message, Contact, ChatGroup, MessageWithSender, ChatContact, ChatGroupWithMembers } from '@/types/supabase-extensions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useChat() {
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [groups, setGroups] = useState<ChatGroupWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<MessageWithSender[]>([]);
  const [activeChat, setActiveChat] = useState<{
    id: string;
    type: 'contact' | 'group';
  } | null>(null);
  const [regionUsers, setRegionUsers] = useState<any[]>([]);
  const [loadingRegionUsers, setLoadingRegionUsers] = useState(false);
  const [userRegion, setUserRegion] = useState<string>('Global');

  // Load user region
  useEffect(() => {
    const getUserRegion = async () => {
      if (isDemoMode) {
        const region = localStorage.getItem('demoUserRegion') || 'Global';
        setUserRegion(region);
        return;
      }
      
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('region')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user region:', error);
          return;
        }
        
        if (data && data.region) {
          setUserRegion(data.region);
        }
      } catch (error) {
        console.error('Error in region fetch:', error);
      }
    };
    
    getUserRegion();
  }, [user, isDemoMode]);

  // Load contacts and groups
  useEffect(() => {
    if (!user && !isDemoMode) {
      setContacts([]);
      setGroups([]);
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // For demo mode, use mock data
        if (isDemoMode) {
          // Mock contacts for demo mode
          const mockContacts = [
            {
              id: '1',
              user_id: 'demo-user',
              contact_id: 'demo-contact-1',
              status: 'accepted',
              created_at: new Date().toISOString(),
              profile: {
                id: 'demo-contact-1',
                username: 'TravelGuide',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TravelGuide',
                region: userRegion
              }
            },
            {
              id: '2',
              user_id: 'demo-user',
              contact_id: 'demo-contact-2',
              status: 'accepted',
              created_at: new Date().toISOString(),
              profile: {
                id: 'demo-contact-2',
                username: 'LocalExplorer',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LocalExplorer',
                region: userRegion
              }
            }
          ];
          
          setContacts(mockContacts as ChatContact[]);
          
          // Mock groups for demo mode
          const mockGroups = [
            {
              id: 'demo-group-1',
              name: `${userRegion} Travelers`,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userRegion} Travelers`,
              created_at: new Date().toISOString(),
              created_by: 'system',
              members: []
            }
          ];
          
          setGroups(mockGroups as ChatGroupWithMembers[]);
          setLoading(false);
          return;
        }
        
        // Fetch real data
        const userId = user?.id as string;
        
        // Get contacts
        const contactsData = await chatService.getContacts(userId);
        setContacts(contactsData);
        
        // Get groups
        const groupsData = await chatService.getGroups(userId);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up subscriptions
    if (user && !isDemoMode) {
      const messagesChannel = chatService.subscribeToMessages(
        user.id, 
        (message) => {
          // If this message is part of the current conversation, add it
          if (
            (activeChat?.type === 'contact' && 
             ((message.sender_id === user.id && message.receiver_id === activeChat.id) || 
              (message.sender_id === activeChat.id && message.receiver_id === user.id))) ||
            (activeChat?.type === 'group' && message.group_id === activeChat.id)
          ) {
            // We need to fetch the full message with sender info
            fetchMessageWithSender(message.id);
          }
        }
      );
      
      const contactsChannel = chatService.subscribeToContacts(
        user.id,
        (_contact) => {
          // Refresh contacts when there's a change
          chatService.getContacts(user.id).then(setContacts);
        }
      );
      
      return () => {
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(contactsChannel);
      };
    }
  }, [user, isDemoMode, userRegion, activeChat]);
  
  // Load users from the same region
  const loadRegionUsers = async () => {
    if (isDemoMode) {
      // Mock region users for demo mode
      setLoadingRegionUsers(true);
      
      setTimeout(() => {
        const mockUsers = [
          {
            id: 'demo-region-1',
            username: 'RegionExpert',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RegionExpert',
            region: userRegion
          },
          {
            id: 'demo-region-2',
            username: 'LocalGuide',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LocalGuide',
            region: userRegion
          },
          {
            id: 'demo-region-3',
            username: 'ExplorerJane',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ExplorerJane',
            region: userRegion
          }
        ];
        
        setRegionUsers(mockUsers);
        setLoadingRegionUsers(false);
        
        toast({
          title: "Region Users Loaded",
          description: `Found ${mockUsers.length} users from ${userRegion}`,
        });
      }, 1000);
      
      return;
    }
    
    if (!user) return;
    
    setLoadingRegionUsers(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, region')
        .eq('region', userRegion)
        .neq('id', user.id)
        .limit(20);
        
      if (error) {
        console.error('Error fetching region users:', error);
        toast({
          title: "Error",
          description: "Could not load users from your region.",
          variant: "destructive",
        });
        return;
      }
      
      setRegionUsers(data || []);
      
      toast({
        title: "Region Users Loaded",
        description: `Found ${data?.length || 0} users from ${userRegion}`,
      });
    } catch (error) {
      console.error('Error in region users fetch:', error);
    } finally {
      setLoadingRegionUsers(false);
    }
  };
  
  // Fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat || (!user && !isDemoMode)) {
      setCurrentMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      if (isDemoMode) {
        // Create mock messages for demo mode
        const mockMessages = [
          {
            id: 'demo-msg-1',
            sender_id: activeChat.id,
            receiver_id: 'demo-user',
            group_id: activeChat.type === 'group' ? activeChat.id : null,
            content: `Hello! Welcome to ${userRegion}! How can I help you today?`,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            read: true,
            message_type: 'text',
            sender: {
              id: activeChat.id,
              username: activeChat.type === 'contact' 
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.username || 'User'
                : groups.find(g => g.id === activeChat.id)?.name || 'Group',
              avatar: activeChat.type === 'contact'
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.avatar || ''
                : groups.find(g => g.id === activeChat.id)?.avatar || ''
            }
          },
          {
            id: 'demo-msg-2',
            sender_id: 'demo-user',
            receiver_id: activeChat.type === 'contact' ? activeChat.id : null,
            group_id: activeChat.type === 'group' ? activeChat.id : null,
            content: "Hi! I'm excited to explore this region. What are the must-see attractions?",
            created_at: new Date(Date.now() - 3500000).toISOString(),
            read: true,
            message_type: 'text',
            sender: {
              id: 'demo-user',
              username: 'You (Demo)',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demouser'
            }
          },
          {
            id: 'demo-msg-3',
            sender_id: activeChat.id,
            receiver_id: activeChat.type === 'contact' ? 'demo-user' : null,
            group_id: activeChat.type === 'group' ? activeChat.id : null,
            content: `I would recommend visiting the cultural sites in ${userRegion}. The local cuisine is also amazing!`,
            created_at: new Date(Date.now() - 3400000).toISOString(),
            read: true,
            message_type: 'text',
            sender: {
              id: activeChat.id,
              username: activeChat.type === 'contact' 
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.username || 'User'
                : groups.find(g => g.id === activeChat.id)?.name || 'Group',
              avatar: activeChat.type === 'contact'
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.avatar || ''
                : groups.find(g => g.id === activeChat.id)?.avatar || ''
            }
          }
        ];
        
        setCurrentMessages(mockMessages as MessageWithSender[]);
        return;
      }
      
      if (activeChat.type === 'contact') {
        const messages = await chatService.getConversation(user!.id, activeChat.id);
        setCurrentMessages(messages);
      } else {
        const messages = await chatService.getGroupMessages(activeChat.id);
        setCurrentMessages(messages);
      }
    };
    
    fetchMessages();
  }, [activeChat, user, isDemoMode, contacts, groups, userRegion]);
  
  const fetchMessageWithSender = async (messageId: string) => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(*)
      `)
      .eq('id', messageId)
      .single();
      
    if (data) {
      setCurrentMessages(prev => [...prev, data as unknown as MessageWithSender]);
    }
  };
  
  const sendMessage = useCallback(async (content: string) => {
    if ((!user && !isDemoMode) || !activeChat) return null;
    
    try {
      if (isDemoMode) {
        // Create a mock message for demo mode
        const newMessage: MessageWithSender = {
          id: `demo-msg-${Date.now()}`,
          sender_id: 'demo-user',
          receiver_id: activeChat.type === 'contact' ? activeChat.id : null,
          group_id: activeChat.type === 'group' ? activeChat.id : null,
          content,
          created_at: new Date().toISOString(),
          read: true,
          message_type: 'text',
          sender: {
            id: 'demo-user',
            username: 'You (Demo)',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demouser'
          }
        } as MessageWithSender;
        
        // Add the message to the conversation
        setCurrentMessages(prev => [...prev, newMessage]);
        
        // Create a mock response after a short delay
        setTimeout(() => {
          const responses = [
            `That's interesting! Tell me more about your experience in ${userRegion}.`,
            `Have you tried the local cuisine in ${userRegion}? It's amazing!`,
            `${userRegion} has such a rich cultural heritage. I love exploring it!`,
            `What other places in ${userRegion} are you planning to visit?`,
            `The people in ${userRegion} are so friendly and welcoming.`
          ];
          
          const responseIndex = Math.floor(Math.random() * responses.length);
          
          const responseMessage: MessageWithSender = {
            id: `demo-msg-${Date.now() + 1}`,
            sender_id: activeChat.id,
            receiver_id: activeChat.type === 'contact' ? 'demo-user' : null,
            group_id: activeChat.type === 'group' ? activeChat.id : null,
            content: responses[responseIndex],
            created_at: new Date().toISOString(),
            read: true,
            message_type: 'text',
            sender: {
              id: activeChat.id,
              username: activeChat.type === 'contact' 
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.username || 'User'
                : groups.find(g => g.id === activeChat.id)?.name || 'Group',
              avatar: activeChat.type === 'contact'
                ? contacts.find(c => c.contact_id === activeChat.id)?.profile.avatar || ''
                : groups.find(g => g.id === activeChat.id)?.avatar || ''
            }
          } as MessageWithSender;
          
          setCurrentMessages(prev => [...prev, responseMessage]);
        }, 1500);
        
        return newMessage;
      }
      
      let message: Message | null = null;
      
      if (activeChat.type === 'contact') {
        message = await chatService.sendMessage(user!.id, activeChat.id, content);
      } else {
        message = await chatService.sendGroupMessage(user!.id, activeChat.id, content);
      }
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user, activeChat, isDemoMode, contacts, groups, userRegion]);
  
  const addContact = useCallback(async (contactId: string) => {
    if (!user && !isDemoMode) return null;
    
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Contact requests are not available in demo mode.",
        variant: "default",
      });
      return null;
    }
    
    return chatService.addContact(user!.id, contactId);
  }, [user, isDemoMode, toast]);
  
  const acceptContactRequest = useCallback(async (contactId: string) => {
    if (!user && !isDemoMode) return false;
    
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Contact requests are not available in demo mode.",
        variant: "default",
      });
      return false;
    }
    
    return chatService.acceptContactRequest(user!.id, contactId);
  }, [user, isDemoMode, toast]);
  
  const createGroup = useCallback(async (name: string, memberIds: string[]) => {
    if (!user && !isDemoMode) return null;
    
    if (isDemoMode) {
      const newGroup = {
        id: `demo-group-${Date.now()}`,
        name,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        created_at: new Date().toISOString(),
        created_by: 'demo-user',
        members: []
      } as ChatGroupWithMembers;
      
      setGroups(prev => [...prev, newGroup]);
      
      toast({
        title: "Demo Group Created",
        description: `Your group "${name}" has been created in demo mode.`,
      });
      
      return newGroup;
    }
    
    return chatService.createGroup(name, user!.id, memberIds);
  }, [user, isDemoMode, toast]);
  
  return {
    contacts,
    groups,
    loading,
    currentMessages,
    activeChat,
    setActiveChat,
    sendMessage,
    addContact,
    acceptContactRequest,
    createGroup,
    regionUsers,
    loadRegionUsers,
    loadingRegionUsers,
    userRegion
  };
}


import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { Message, Contact, ChatGroup, MessageWithSender, ChatContact, ChatGroupWithMembers } from '@/types/supabase-extensions';
import { supabase } from '@/integrations/supabase/client';

export function useChat() {
  const { user, isDemoMode } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [groups, setGroups] = useState<ChatGroupWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<MessageWithSender[]>([]);
  const [activeChat, setActiveChat] = useState<{
    id: string;
    type: 'contact' | 'group';
  } | null>(null);

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
          // Mock data would go here
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
  }, [user, isDemoMode, activeChat]);
  
  // Fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat || !user) {
      setCurrentMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      if (activeChat.type === 'contact') {
        const messages = await chatService.getConversation(user.id, activeChat.id);
        setCurrentMessages(messages);
      } else {
        const messages = await chatService.getGroupMessages(activeChat.id);
        setCurrentMessages(messages);
      }
    };
    
    fetchMessages();
  }, [activeChat, user]);
  
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
    if (!user || !activeChat) return null;
    
    try {
      let message: Message | null = null;
      
      if (activeChat.type === 'contact') {
        message = await chatService.sendMessage(user.id, activeChat.id, content);
      } else {
        message = await chatService.sendGroupMessage(user.id, activeChat.id, content);
      }
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user, activeChat]);
  
  const addContact = useCallback(async (contactId: string) => {
    if (!user) return null;
    return chatService.addContact(user.id, contactId);
  }, [user]);
  
  const acceptContactRequest = useCallback(async (contactId: string) => {
    if (!user) return false;
    return chatService.acceptContactRequest(user.id, contactId);
  }, [user]);
  
  const createGroup = useCallback(async (name: string, memberIds: string[]) => {
    if (!user) return null;
    return chatService.createGroup(name, user.id, memberIds);
  }, [user]);
  
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
    createGroup
  };
}

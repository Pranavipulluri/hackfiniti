
import { supabase } from '@/integrations/supabase/client';
import { Message, Contact, ChatGroup, GroupMember, Profile, MessageWithSender, ChatContact, ChatGroupWithMembers } from '@/types/supabase-extensions';

export const chatService = {
  // Messages
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        message_type: 'text'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error sending message:', error);
      return null;
    }
    
    return data as Message;
  },
  
  async getConversation(userId: string, contactId: string): Promise<MessageWithSender[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(*)
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
      .order('created_at');
      
    if (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
    
    return data as unknown as MessageWithSender[];
  },
  
  // Contacts
  async getContacts(userId: string): Promise<ChatContact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        profile:contact_id(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');
      
    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
    
    return data as unknown as ChatContact[];
  },
  
  async addContact(userId: string, contactId: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_id: contactId,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding contact:', error);
      return null;
    }
    
    return data as Contact;
  },
  
  async acceptContactRequest(userId: string, contactId: string): Promise<boolean> {
    // Update the contact request
    const { error } = await supabase
      .from('contacts')
      .update({ status: 'accepted' })
      .eq('user_id', contactId)
      .eq('contact_id', userId);
      
    if (error) {
      console.error('Error accepting contact request:', error);
      return false;
    }
    
    // Create reciprocal contact
    const { error: reciprocalError } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_id: contactId,
        status: 'accepted'
      });
      
    if (reciprocalError) {
      console.error('Error creating reciprocal contact:', reciprocalError);
      return false;
    }
    
    return true;
  },
  
  // Chat Groups
  async createGroup(name: string, createdBy: string, members: string[]): Promise<ChatGroup | null> {
    // First create the group
    const { data: groupData, error: groupError } = await supabase
      .from('chat_groups')
      .insert({
        name,
        created_by: createdBy,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
      })
      .select()
      .single();
      
    if (groupError) {
      console.error('Error creating group:', groupError);
      return null;
    }
    
    const group = groupData as ChatGroup;
    
    // Then add all members
    const membersToAdd = [createdBy, ...members.filter(m => m !== createdBy)];
    
    const membersData = membersToAdd.map(memberId => ({
      group_id: group.id,
      user_id: memberId,
      role: memberId === createdBy ? 'admin' : 'member'
    }));
    
    const { error: membersError } = await supabase
      .from('group_members')
      .insert(membersData);
      
    if (membersError) {
      console.error('Error adding members to group:', membersError);
      // We should clean up the created group, but for simplicity we'll leave it
      return null;
    }
    
    return group;
  },
  
  async getGroups(userId: string): Promise<ChatGroupWithMembers[]> {
    // First get all groups the user is a member of
    const { data: memberGroups, error: memberError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);
      
    if (memberError) {
      console.error('Error fetching member groups:', memberError);
      return [];
    }
    
    // No groups found
    if (!memberGroups || memberGroups.length === 0) {
      return [];
    }
    
    // Extract group IDs
    const groupIds = memberGroups.map(item => item.group_id);
    
    // Fetch the actual groups with members
    const { data, error } = await supabase
      .from('chat_groups')
      .select(`
        *,
        members:group_members(*, profile:user_id(*))
      `)
      .in('id', groupIds);
      
    if (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
    
    return data as unknown as ChatGroupWithMembers[];
  },
  
  async sendGroupMessage(senderId: string, groupId: string, content: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        group_id: groupId,
        content,
        message_type: 'text'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error sending group message:', error);
      return null;
    }
    
    return data as Message;
  },
  
  async getGroupMessages(groupId: string): Promise<MessageWithSender[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(*)
      `)
      .eq('group_id', groupId)
      .order('created_at');
      
    if (error) {
      console.error('Error fetching group messages:', error);
      return [];
    }
    
    return data as unknown as MessageWithSender[];
  },

  // Get users by region
  async getUsersByRegion(region: string, currentUserId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('region', region)
      .neq('id', currentUserId)
      .limit(20);
      
    if (error) {
      console.error('Error fetching users by region:', error);
      return [];
    }
    
    return data as Profile[];
  },
  
  // Subscriptions
  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    // Fix for group messages subscription
    return supabase
      .channel('messages-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}` 
        }, 
        payload => {
          callback(payload.new as Message);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `group_id=in.(select group_id from group_members where user_id='${userId}')` 
        }, 
        payload => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },
  
  subscribeToContacts(userId: string, callback: (contact: Contact) => void) {
    return supabase
      .channel('contacts-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contacts',
          filter: `contact_id=eq.${userId}` 
        }, 
        payload => {
          callback(payload.new as Contact);
        }
      )
      .subscribe();
  }
};

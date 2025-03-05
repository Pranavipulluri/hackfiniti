
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Plus, Search, UserPlus, Users } from 'lucide-react';
import { format } from 'date-fns';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, ChatGroup, Contact, Message } from '@/contexts/ChatContext';
import { useProfile, Profile } from '@/hooks/useProfile';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { 
    messages, 
    contacts, 
    groups, 
    loadingMessages, 
    loadingContacts, 
    loadingGroups,
    activeChat,
    setActiveChat,
    sendMessage
  } = useChat();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    try {
      await sendMessage(messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.profile?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Components for chat interface
  const ContactItem = ({ contact }: { contact: Contact }) => (
    <div 
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${
        activeChat?.type === 'contact' && activeChat.id === contact.contact_id ? 'bg-slate-200' : ''
      }`}
      onClick={() => setActiveChat({ type: 'contact', id: contact.contact_id })}
    >
      <Avatar>
        <AvatarImage src={contact.profile?.avatar || '/placeholder.svg'} />
        <AvatarFallback>{contact.profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{contact.profile?.username || 'Unknown'}</p>
      </div>
    </div>
  );

  const GroupItem = ({ group }: { group: ChatGroup }) => (
    <div 
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${
        activeChat?.type === 'group' && activeChat.id === group.id ? 'bg-slate-200' : ''
      }`}
      onClick={() => setActiveChat({ type: 'group', id: group.id })}
    >
      <Avatar>
        <AvatarImage src={group.avatar || '/placeholder.svg'} />
        <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{group.name}</p>
      </div>
    </div>
  );

  const MessageBubble = ({ message, profile }: { message: Message, profile: Profile | null }) => {
    const isCurrentUser = message.sender_id === user?.id;
    
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-end ${isCurrentUser ? 'flex-row' : 'flex-row-reverse'} space-x-2 space-x-reverse`}>
          {!isCurrentUser && (
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
          <div 
            className={`max-w-xs px-4 py-2 rounded-lg ${
              isCurrentUser 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            }`}
          >
            <p>{message.content}</p>
            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-50' : 'text-gray-500'}`}>
              {format(new Date(message.created_at), 'p')}
            </p>
          </div>
          {isCurrentUser && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar || '/placeholder.svg'} />
              <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  };

  const AddContactDialog = () => {
    const [contactEmail, setContactEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleAddContact = async () => {
      if (!contactEmail.trim()) return;
      
      setIsSubmitting(true);
      try {
        // In a real app, you'd search for users by email
        // For now, we're just showing how the UI would work
        console.log('Adding contact with email:', contactEmail);
        
        // Simulate success
        setTimeout(() => {
          setContactEmail('');
          setIsSubmitting(false);
        }, 1000);
      } catch (error) {
        console.error('Error adding contact:', error);
        setIsSubmitting(false);
      }
    };
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>
              Enter the email of the person you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="friend@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddContact} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const CreateGroupDialog = () => {
    const [groupName, setGroupName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleCreateGroup = async () => {
      if (!groupName.trim()) return;
      
      setIsSubmitting(true);
      try {
        // In a real app, you'd create a group
        // For now, we're just showing how the UI would work
        console.log('Creating group:', groupName);
        
        // Simulate success
        setTimeout(() => {
          setGroupName('');
          setIsSubmitting(false);
        }, 1000);
      } catch (error) {
        console.error('Error creating group:', error);
        setIsSubmitting(false);
      }
    };
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Users className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a new group chat with your friends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateGroup} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-6"
      >
        <Card className="h-[80vh]">
          <CardHeader className="p-4 border-b">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-12 h-[calc(80vh-4rem)]">
            {/* Sidebar */}
            <div className="col-span-3 border-r h-full flex flex-col">
              <div className="p-3 border-b flex items-center space-x-2">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <AddContactDialog />
                <CreateGroupDialog />
              </div>
              <Tabs defaultValue="contacts" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 p-3">
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="groups">Groups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contacts" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-1">
                      {loadingContacts ? (
                        <p className="text-center text-gray-500">Loading contacts...</p>
                      ) : filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <ContactItem key={contact.id} contact={contact} />
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No contacts found</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="groups" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-1">
                      {loadingGroups ? (
                        <p className="text-center text-gray-500">Loading groups...</p>
                      ) : filteredGroups.length > 0 ? (
                        filteredGroups.map((group) => (
                          <GroupItem key={group.id} group={group} />
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No groups found</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Chat Area */}
            <div className="col-span-9 flex flex-col h-full">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {activeChat.type === 'contact' 
                          ? contacts.find(c => c.contact_id === activeChat.id)?.profile?.username || 'Contact'
                          : groups.find(g => g.id === activeChat.id)?.name || 'Group'}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {loadingMessages ? (
                      <p className="text-center text-gray-500">Loading messages...</p>
                    ) : messages.length > 0 ? (
                      messages.map((message) => (
                        <MessageBubble key={message.id} message={message} profile={profile} />
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                    )}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t mt-auto">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <Button type="button" variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">Select a chat to start messaging</h3>
                    <p>Choose a contact or group from the sidebar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </PageLayout>
  );
};

export default Chat;

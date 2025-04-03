
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, UserPlus, Users, Send, Plus, Map, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ChatContact, ChatGroup, MessageWithSender } from '@/types/supabase-extensions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { user, isDemoMode } = useAuth();
  const {
    contacts,
    groups,
    loading,
    currentMessages,
    activeChat,
    setActiveChat,
    sendMessage,
    createGroup,
    addContact,
    regionUsers,
    loadRegionUsers,
    loadingRegionUsers,
    userRegion
  } = useChat();
  const { toast } = useToast();
  
  const [inputValue, setInputValue] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showRegionUsers, setShowRegionUsers] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;
    
    try {
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleCreateGroup = async () => {
    if (!groupName || selectedContacts.length === 0) return;
    
    try {
      await createGroup(groupName, selectedContacts);
      setGroupName('');
      setSelectedContacts([]);
      setIsCreatingGroup(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };
  
  const handleFindPeopleClick = () => {
    setShowRegionUsers(true);
    loadRegionUsers();
  };
  
  const handleAddContact = async (contactId: string) => {
    try {
      await addContact(contactId);
      toast({
        title: "Contact Request Sent",
        description: "Your contact request has been sent. They'll need to accept it to start chatting.",
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    } else {
      setSelectedContacts(prev => [...prev, contactId]);
    }
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        
        <Card className="border rounded-lg shadow-md">
          <CardContent className="p-0">
            <div className="grid grid-cols-12 h-[75vh]">
              {/* Sidebar */}
              <div className="col-span-4 border-r">
                <Tabs defaultValue="contacts">
                  <div className="p-4 border-b">
                    <TabsList className="w-full">
                      <TabsTrigger value="contacts" className="flex-1">
                        <User className="h-4 w-4 mr-2" />
                        Contacts
                      </TabsTrigger>
                      <TabsTrigger value="groups" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Groups
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="contacts" className="p-0 m-0">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Map className="h-4 w-4 mr-2 text-teal-600" />
                        <span className="text-sm font-medium">{userRegion}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleFindPeopleClick}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Find People
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(75vh-108px)]">
                      <div className="p-4 space-y-4">
                        {loading ? (
                          Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[120px]" />
                                <Skeleton className="h-3 w-[80px]" />
                              </div>
                            </div>
                          ))
                        ) : contacts.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No contacts yet</p>
                            <Button variant="link" className="mt-2" onClick={handleFindPeopleClick}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Find people in your region
                            </Button>
                          </div>
                        ) : (
                          contacts.map((contact: ChatContact) => (
                            <div
                              key={contact.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                activeChat?.id === contact.contact_id ? 'bg-primary/10' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => setActiveChat({ id: contact.contact_id, type: 'contact' })}
                            >
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={contact.profile.avatar || ''} />
                                <AvatarFallback>{contact.profile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{contact.profile.username}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  {contact.profile.region && (
                                    <>
                                      <Map className="h-3 w-3 mr-1" />
                                      <span>{contact.profile.region}</span>
                                    </>
                                  )}
                                  {contact.status === 'pending' && (
                                    <Badge variant="outline" className="text-xs ml-2">Pending</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="groups" className="p-0 m-0">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-sm font-medium">Your Groups</h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsCreatingGroup(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        New Group
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(75vh-108px)]">
                      <div className="p-4 space-y-4">
                        {loading ? (
                          Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-3 w-[60px]" />
                              </div>
                            </div>
                          ))
                        ) : groups.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No groups yet</p>
                            <Button variant="link" className="mt-2" onClick={() => setIsCreatingGroup(true)}>
                              <Users className="h-4 w-4 mr-2" />
                              Create a group
                            </Button>
                          </div>
                        ) : (
                          groups.map((group: ChatGroup) => (
                            <div
                              key={group.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                activeChat?.id === group.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => setActiveChat({ id: group.id, type: 'group' })}
                            >
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={group.avatar || ''} />
                                <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{group.name}</p>
                                <p className="text-xs text-gray-500">
                                  {/* Show number of members */}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Chat Area */}
              <div className="col-span-8 flex flex-col">
                {activeChat ? (
                  <>
                    <div className="p-4 border-b">
                      {activeChat.type === 'contact' && 
                        contacts.find(c => c.contact_id === activeChat.id)?.profile && (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={contacts.find(c => c.contact_id === activeChat.id)?.profile.avatar || ''} />
                              <AvatarFallback>
                                {contacts.find(c => c.contact_id === activeChat.id)?.profile.username?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contacts.find(c => c.contact_id === activeChat.id)?.profile.username}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Map className="h-3 w-3 mr-1" />
                                <span>{contacts.find(c => c.contact_id === activeChat.id)?.profile.region || 'Global'}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      {activeChat.type === 'group' && 
                        groups.find(g => g.id === activeChat.id) && (
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={groups.find(g => g.id === activeChat.id)?.avatar || ''} />
                              <AvatarFallback>
                                {groups.find(g => g.id === activeChat.id)?.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{groups.find(g => g.id === activeChat.id)?.name}</p>
                          </div>
                        )
                      }
                    </div>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {loading ? (
                          Array(5).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                            >
                              <div className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start gap-2 max-w-[80%]`}>
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-[60px] mb-1" />
                                  <Skeleton className={`h-16 w-[240px] rounded-lg`} />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : currentMessages.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <p>No messages yet</p>
                            <p className="text-sm mt-1">Start the conversation!</p>
                          </div>
                        ) : (
                          currentMessages.map((message: MessageWithSender) => {
                            const isMyMessage = isDemoMode 
                              ? message.sender_id === 'demo-user'
                              : message.sender_id === user?.id;
                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender?.avatar || ''} />
                                    <AvatarFallback>
                                      {message.sender?.username?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium">
                                        {isMyMessage ? 'You' : message.sender?.username}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {message.created_at && format(new Date(message.created_at), 'p')}
                                      </span>
                                    </div>
                                    <div className={`p-3 rounded-lg ${
                                      isMyMessage 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted'
                                    }`}>
                                      {message.content}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input 
                          placeholder="Type your message..." 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={!inputValue.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-8">
                    <div>
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                      <p className="text-gray-500 mb-4">
                        Choose a contact or group from the sidebar to start chatting
                      </p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" onClick={handleFindPeopleClick}>
                          <Search className="h-4 w-4 mr-2" />
                          Find People in {userRegion}
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreatingGroup(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Group
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Add a name for your group and select contacts to include
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="group-name" className="text-sm font-medium">
                Group Name
              </label>
              <Input 
                id="group-name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">
                Select Contacts
              </label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => toggleContactSelection(contact.contact_id)}
                    >
                      <div className={`w-4 h-4 rounded border mr-2 ${
                        selectedContacts.includes(contact.contact_id) 
                          ? 'bg-primary border-primary' 
                          : 'border-gray-300'
                      }`}>
                        {selectedContacts.includes(contact.contact_id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#fff">
                            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={contact.profile.avatar || ''} />
                        <AvatarFallback>{contact.profile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <span>{contact.profile.username}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedContacts.length} contacts
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup}
              disabled={!groupName || selectedContacts.length === 0}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Find People Dialog */}
      <Dialog open={showRegionUsers} onOpenChange={setShowRegionUsers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>People in {userRegion}</DialogTitle>
            <DialogDescription>
              Connect with other travelers and locals in your region
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            {loadingRegionUsers ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-[150px] mb-1" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                ))}
              </div>
            ) : regionUsers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No users found in {userRegion}</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to explore this region!</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {regionUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Map className="h-3 w-3 mr-1" />
                            <span>{user.region || userRegion}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddContact(user.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegionUsers(false)}>
              Close
            </Button>
            <Button onClick={loadRegionUsers} disabled={loadingRegionUsers}>
              <Search className="h-4 w-4 mr-1" />
              Refresh List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Chat;

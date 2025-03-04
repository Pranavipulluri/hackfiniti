
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Send, Smile, Paperclip, MoreHorizontal, Globe, Phone, Video, User, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  
  // Mock data
  const contacts = [
    {
      id: 1,
      name: "CultureExplorer",
      avatar: "/placeholder.svg",
      status: "online",
      lastMessage: "Do you want to trade some recipes?",
      time: "10:32 AM",
      unread: 2,
      country: "Japan"
    },
    {
      id: 2,
      name: "AdventureSeeker",
      avatar: "/placeholder.svg",
      status: "offline",
      lastMessage: "I'll be visiting the Europe hub tomorrow!",
      time: "Yesterday",
      unread: 0,
      country: "Italy"
    },
    {
      id: 3,
      name: "CulinaryArtist",
      avatar: "/placeholder.svg",
      status: "online",
      lastMessage: "Thanks for teaching me that recipe!",
      time: "Yesterday",
      unread: 0,
      country: "Mexico"
    },
    {
      id: 4,
      name: "GlobalTraveler",
      avatar: "/placeholder.svg",
      status: "online",
      lastMessage: "Let's meet at the language exchange event.",
      time: "2 days ago",
      unread: 0,
      country: "Kenya"
    },
  ];
  
  const groups = [
    {
      id: 101,
      name: "Japan Cultural Society",
      avatar: "/placeholder.svg",
      members: 32,
      lastMessage: "New event: Tea Ceremony Workshop",
      time: "1 hour ago",
      unread: 5,
    },
    {
      id: 102,
      name: "Recipe Exchange",
      avatar: "/placeholder.svg",
      members: 124,
      lastMessage: "Anyone has a good pasta recipe?",
      time: "3 hours ago",
      unread: 0,
    },
    {
      id: 103,
      name: "Language Partners",
      avatar: "/placeholder.svg",
      members: 87,
      lastMessage: "French meetup this Saturday!",
      time: "Yesterday",
      unread: 0,
    },
  ];
  
  const activeChat = {
    id: 1,
    name: "CultureExplorer",
    avatar: "/placeholder.svg",
    status: "online",
    country: "Japan",
    messages: [
      { id: 1, sender: "CultureExplorer", content: "Hi there! I saw you're interested in Japanese culture.", time: "10:15 AM", avatar: "/placeholder.svg" },
      { id: 2, sender: "me", content: "Yes! I'm particularly interested in traditional tea ceremonies.", time: "10:18 AM", avatar: "/placeholder.svg" },
      { id: 3, sender: "CultureExplorer", content: "That's great! I have some materials about tea ceremonies I can share with you.", time: "10:20 AM", avatar: "/placeholder.svg" },
      { id: 4, sender: "CultureExplorer", content: "Would you also be interested in trading for some Japanese recipes?", time: "10:22 AM", avatar: "/placeholder.svg" },
      { id: 5, sender: "me", content: "Absolutely! I have some traditional recipes from my region that we could trade.", time: "10:25 AM", avatar: "/placeholder.svg" },
      { id: 6, sender: "CultureExplorer", content: "Perfect! Do you want to trade some recipes?", time: "10:32 AM", avatar: "/placeholder.svg" },
    ]
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
      // In a real app, you would add this message to the state
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Contacts Panel */}
          <Card className="md:col-span-1 overflow-hidden border">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="friends" className="flex-1">
                    <User className="mr-2 h-4 w-4" />
                    Friends
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1">
                    <Users className="mr-2 h-4 w-4" />
                    Groups
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ScrollArea className="h-[calc(100vh-275px)]">
              <TabsContent value="friends" className="m-0">
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      contact.id === activeChat.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{contact.name}</p>
                        <span className="text-xs text-gray-500">{contact.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                    </div>
                    
                    {contact.unread > 0 && (
                      <Badge className="bg-teal-500">{contact.unread}</Badge>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="groups" className="m-0">
                {groups.map(group => (
                  <div 
                    key={group.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{group.name}</p>
                        <span className="text-xs text-gray-500">{group.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-400">{group.members} members</p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{group.lastMessage}</p>
                    </div>
                    
                    {group.unread > 0 && (
                      <Badge className="bg-teal-500">{group.unread}</Badge>
                    )}
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Card>
          
          {/* Chat Panel */}
          <Card className="md:col-span-2 overflow-hidden border flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                  <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeChat.name}</h3>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      activeChat.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                    <span className="text-sm text-gray-500">{activeChat.status}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {activeChat.country}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeChat.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                    <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                      {msg.sender !== 'me' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar} alt={msg.sender} />
                          <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div className={`rounded-lg p-3 ${
                          msg.sender === 'me' 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {msg.sender === 'me' ? 'You' : msg.sender} • {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <CardContent className="p-4 border-t">
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;

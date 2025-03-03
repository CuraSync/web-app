"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  type: 'doctor' | 'lab' | 'pharmacy';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const MessagePage = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. James Bond',
      type: 'doctor',
      avatar: 'JB',
      lastMessage: 'Your prescription is ready',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      online: true,
      messages: [
        {
          id: '1-1',
          content: 'Hello Sarah, how are you feeling today?',
          sender: 'other',
          timestamp: '10:15 AM',
          status: 'read'
        },
        {
          id: '1-2',
          content: 'I\'m feeling much better, thank you doctor!',
          sender: 'me',
          timestamp: '10:20 AM',
          status: 'read'
        },
        {
          id: '1-3',
          content: 'Great to hear that. Your prescription is ready, you can pick it up from the pharmacy.',
          sender: 'other',
          timestamp: '10:30 AM',
          status: 'delivered'
        }
      ]
    },
    {
      id: '2',
      name: 'Central Lab',
      type: 'lab',
      avatar: 'CL',
      lastMessage: 'Your test results are ready',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      online: false,
      messages: [
        {
          id: '2-1',
          content: 'Hello Sarah, your blood test has been scheduled for tomorrow at 9 AM.',
          sender: 'other',
          timestamp: 'Yesterday, 2:15 PM',
          status: 'read'
        },
        {
          id: '2-2',
          content: 'Thank you, I\'ll be there.',
          sender: 'me',
          timestamp: 'Yesterday, 2:30 PM',
          status: 'read'
        },
        {
          id: '2-3',
          content: 'Your test results are ready. You can view them in your dashboard or collect the report from our center.',
          sender: 'other',
          timestamp: 'Yesterday, 5:45 PM',
          status: 'delivered'
        }
      ]
    },
    {
      id: '3',
      name: 'MedPlus Pharmacy',
      type: 'pharmacy',
      avatar: 'MP',
      lastMessage: 'Your medication is ready for pickup',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      online: true,
      messages: [
        {
          id: '3-1',
          content: 'Hello Sarah, your medication is ready for pickup.',
          sender: 'other',
          timestamp: '2 days ago, 11:20 AM',
          status: 'read'
        },
        {
          id: '3-2',
          content: 'Thank you! What are your working hours today?',
          sender: 'me',
          timestamp: '2 days ago, 11:45 AM',
          status: 'read'
        },
        {
          id: '3-3',
          content: 'We\'re open until 8 PM today. You can come anytime.',
          sender: 'other',
          timestamp: '2 days ago, 12:00 PM',
          status: 'read'
        },
        {
          id: '3-4',
          content: 'Perfect, I\'ll stop by around 5 PM.',
          sender: 'me',
          timestamp: '2 days ago, 12:15 PM',
          status: 'read'
        }
      ]
    },
    {
      id: '4',
      name: 'Dr. Sarah Jhons',
      type: 'doctor',
      avatar: 'SJ',
      lastMessage: 'Please let me know if you have any questions',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      online: false,
      messages: [
        {
          id: '4-1',
          content: 'Hello Sarah, I\'ve reviewed your latest test results.',
          sender: 'other',
          timestamp: '3 days ago, 9:30 AM',
          status: 'read'
        },
        {
          id: '4-2',
          content: 'Everything looks good. Continue with your current medication.',
          sender: 'other',
          timestamp: '3 days ago, 9:32 AM',
          status: 'read'
        },
        {
          id: '4-3',
          content: 'Thank you, Dr. Jhons. That\'s a relief!',
          sender: 'me',
          timestamp: '3 days ago, 10:15 AM',
          status: 'read'
        },
        {
          id: '4-4',
          content: 'Please let me know if you have any questions.',
          sender: 'other',
          timestamp: '3 days ago, 10:20 AM',
          status: 'read'
        }
      ]
    },
    {
      id: '5',
      name: 'City Medical Lab',
      type: 'lab',
      avatar: 'CM',
      lastMessage: 'Your appointment is confirmed',
      lastMessageTime: '1 week ago',
      unreadCount: 0,
      online: true,
      messages: [
        {
          id: '5-1',
          content: 'Hello Sarah, we\'d like to confirm your appointment for a chest X-ray tomorrow at 2 PM.',
          sender: 'other',
          timestamp: '1 week ago, 3:15 PM',
          status: 'read'
        },
        {
          id: '5-2',
          content: 'Yes, I\'ll be there. Do I need to prepare anything specific?',
          sender: 'me',
          timestamp: '1 week ago, 3:30 PM',
          status: 'read'
        },
        {
          id: '5-3',
          content: 'No special preparation needed. Just wear comfortable clothing without metal accessories.',
          sender: 'other',
          timestamp: '1 week ago, 3:45 PM',
          status: 'read'
        },
        {
          id: '5-4',
          content: 'Your appointment is confirmed. See you tomorrow.',
          sender: 'other',
          timestamp: '1 week ago, 3:46 PM',
          status: 'read'
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeContact?.messages]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort contacts by last message time (most recent first)
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // Simple sorting logic - in a real app, you'd parse the dates properly
    if (a.lastMessageTime.includes('now') || a.lastMessageTime.includes('min')) return -1;
    if (b.lastMessageTime.includes('now') || b.lastMessageTime.includes('min')) return 1;
    if (a.lastMessageTime.includes('Today')) return -1;
    if (b.lastMessageTime.includes('Today')) return 1;
    if (a.lastMessageTime.includes('Yesterday')) return -1;
    if (b.lastMessageTime.includes('Yesterday')) return 1;
    return 0;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;

    const updatedContacts = contacts.map(contact => {
      if (contact.id === activeContact.id) {
        const newMsg: Message = {
          id: `${contact.id}-${contact.messages.length + 1}`,
          content: newMessage,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        
        return {
          ...contact,
          messages: [...contact.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: 'Just now',
          unreadCount: 0
        };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    setNewMessage('');
    
    // Update active contact
    const updatedActiveContact = updatedContacts.find(c => c.id === activeContact.id);
    if (updatedActiveContact) {
      setActiveContact(updatedActiveContact);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'doctor':
        return 'bg-blue-100 text-blue-600';
      case 'lab':
        return 'bg-purple-100 text-purple-600';
      case 'pharmacy':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="flex h-full">
          {/* Contacts List - Hidden on mobile when a chat is active */}
          {(!isMobile || !activeContact) && (
            <div className="w-full md:w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {sortedContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  sortedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        activeContact?.id === contact.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setActiveContact(contact)}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${getContactTypeColor(contact.type)}`}>
                            {contact.avatar}
                          </div>
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">{contact.name}</h3>
                            <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                            {contact.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {contact.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    {isMobile && (
                      <button 
                        className="mr-2 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setActiveContact(null)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${getContactTypeColor(activeContact.type)}`}>
                        {activeContact.avatar}
                      </div>
                      {activeContact.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{activeContact.name}</h3>
                      <p className="text-xs text-gray-500">
                        {activeContact.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Phone className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Video className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {activeContact.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                          message.sender === 'me'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 text-right flex items-center justify-end ${
                          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{message.timestamp}</span>
                          {message.sender === 'me' && (
                            <span className="ml-1">{getStatusIcon(message.status)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end">
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Type a message..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    {newMessage.trim() ? (
                      <button
                        className="p-2 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600"
                        onClick={handleSendMessage}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    ) : (
                      <button className="p-2 rounded-full hover:bg-gray-100 ml-2">
                        <Mic className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Your Messages</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Select a conversation from the list to view messages or start a new conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
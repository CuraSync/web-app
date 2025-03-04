"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, Paperclip, MoreVertical, Phone, Video, Info, Search, ArrowLeft } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

const MessagesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get patientId from URL if it exists
  const patientIdFromUrl = searchParams.get('patientId');

  // Sample conversations data
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'John Doe',
      initials: 'JD',
      lastMessage: 'Hello Dr. Smith, I have a question about my prescription.',
      time: '12:15 AM',
      unread: 2,
      online: true,
      messages: [
        {
          id: 'm1',
          sender: 'patient',
          text: 'Hello Dr. Smith, I have a question about my prescription.',
          time: '12:15 AM'
        },
        {
          id: 'm2',
          sender: 'doctor',
          text: 'Of course, what would you like to know?',
          time: '12:17 AM'
        }
      ]
    },
    {
      id: '2',
      name: 'Dr. Sarah Smith',
      initials: 'SS',
      lastMessage: 'No messages yet',
      time: '1h ago',
      unread: 0,
      online: false,
      messages: []
    },
    {
      id: '3',
      name: 'Nithya Kumar',
      initials: 'NK',
      lastMessage: 'Thank you for the appointment reminder.',
      time: '2h ago',
      unread: 0,
      online: true,
      messages: [
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Hello Nithya, just a reminder about your appointment tomorrow at 2:00 PM.',
          time: '2:30 PM'
        },
        {
          id: 'm2',
          sender: 'patient',
          text: 'Thank you for the appointment reminder.',
          time: '2:45 PM'
        }
      ]
    },
    {
      id: '4',
      name: 'Varun P',
      initials: 'VP',
      lastMessage: 'I\'ll be there on time.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Hello Varun, your consultation is scheduled for tomorrow at 1:00 PM.',
          time: '10:00 AM'
        },
        {
          id: 'm2',
          sender: 'patient',
          text: 'I\'ll be there on time.',
          time: '10:15 AM'
        }
      ]
    }
  ]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
      
      // If patientId is provided in URL, find and set the active chat
      if (patientIdFromUrl) {
        const conversation = conversations.find(c => 
          c.id === patientIdFromUrl || 
          c.name.toLowerCase().includes(patientIdFromUrl.toLowerCase())
        );
        
        if (conversation) {
          setActiveChat(conversation.id);
        } else {
          // If patient not found in conversations, could add logic to create a new conversation
          toast.error("Patient conversation not found");
        }
      }
    }
  }, [router, patientIdFromUrl, conversations]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: `m${Date.now()}`,
      sender: 'doctor',
      text: message,
      time: new Date().toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      })
    };

    // Update conversations with the new message
    setConversations(conversations.map(conversation => {
      if (conversation.id === activeChat) {
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: message,
          time: 'Just now'
        };
      }
      return conversation;
    }));

    // Clear the message input
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  const activeConversation = conversations.find(c => c.id === activeChat);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
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
          
          <div className="flex border-b">
            <button className="flex-1 py-2 px-4 font-medium text-gray-800 border-b-2 border-blue-500">
              All Messages
            </button>
            <button className="flex-1 py-2 px-4 text-gray-500">
              Archived
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    activeChat === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setActiveChat(conversation.id)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {conversation.initials}
                      </div>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread}
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
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <button 
                    className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setActiveChat(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {activeConversation?.initials}
                    </div>
                    {activeConversation?.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{activeConversation?.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation?.online ? 'Online' : 'Offline'}
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
                    <Info className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {activeConversation?.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <MessageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-center">No messages yet</p>
                    <p className="text-center text-sm">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeConversation?.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                            msg.sender === 'doctor'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-white text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 text-right ${
                            msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-500 text-center max-w-md">
                Select a conversation from the list to view messages or start a new conversation with a patient.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Message icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default MessagesPage;
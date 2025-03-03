"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Paperclip, Search, ArrowLeft, Trash, Edit, Forward, X, ChevronLeft, ChevronRight } from "lucide-react"
import PharmacySidebar from "../../pharmacy/sidebar/sidebar"
import { toast } from "sonner"

interface Message {
  id: string
  sender: string
  text: string
  time: string
  edited: boolean
}

interface Conversation {
  id: string
  name: string
  initials: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  type: string
  messages: Message[]
}

const MessagesPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editMessage, setEditMessage] = useState("")
  const [resizePosition, setResizePosition] = useState(320)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all")

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      initials: "SJ",
      lastMessage: "Is my prescription ready for pickup?",
      time: "12:15 AM",
      unread: 2,
      online: true,
      type: "patient",
      messages: [
        {
          id: "m1",
          sender: "patient",
          text: "Hello, I wanted to check if my prescription is ready for pickup?",
          time: "12:10 AM",
          edited: false,
        },
        {
          id: "m2",
          sender: "pharmacy",
          text: "Yes, your prescription is ready for pickup. You can come anytime during our working hours.",
          time: "12:15 AM",
          edited: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      initials: 'SJ',
      lastMessage: 'Is my prescription ready for pickup?',
      time: '1h ago',
      unread: 1,
      online: true,
      type: 'patient',
      messages: [
        {
          id: 'm1',
          sender: 'patient',
          text: 'Is my prescription ready for pickup?',
          time: '1h ago',
          edited: false,
        }
      ]
    },
    {
      id: '3',
      name: 'Dr. Emily Parker',
      initials: 'EP',
      lastMessage: 'Please prepare the medication for John Doe.',
      time: '2h ago',
      unread: 0,
      online: false,
      type: 'doctor',
      messages: [
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Please prepare the medication for John Doe. He will be coming to pick it up tomorrow.',
          time: '2:30 PM',
          edited: false,
        },
        {
          id: 'm2',
          sender: 'pharmacy',
          text: 'We will have it ready by tomorrow morning.',
          time: '2:45 PM',
          edited: false,
        }
      ]
    },
    {
      id: '4',
      name: 'Michael Brown',
      initials: 'MB',
      lastMessage: 'Do you have any over-the-counter allergy medication?',
      time: 'Yesterday',
      unread: 0,
      online: false,
      type: 'patient',
      messages: [
        {
          id: 'm1',
          sender: 'patient',
          text: 'Do you have any over-the-counter allergy medication?',
          time: '10:00 AM',
          edited: false,
        },
        {
          id: 'm2',
          sender: 'pharmacy',
          text: 'Yes, we have several options. Would you like me to recommend one based on your symptoms?',
          time: '10:15 AM',
          edited: false,
        }
      ]
    },
  ])

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "pharmacy") {
      router.push("/auth/login/pharmacy")
    } else {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newPosition = e.clientX - containerRect.left

        // Set min and max constraints
        const minWidth = 250
        const maxWidth = Math.min(500, containerRect.width - 400)

        if (newPosition >= minWidth && newPosition <= maxWidth) {
          setResizePosition(newPosition)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const toggleFilter = (filter: "all" | "unread") => {
    setActiveFilter(filter)
  }

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearchQuery = conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilterType = activeFilter === "all" || (activeFilter === "unread" && conversation.unread > 0)
    return matchesSearchQuery && matchesFilterType
  })

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return

    const newMessage = {
      id: `m${Date.now()}`,
      sender: "pharmacy",
      text: message,
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      edited: false,
    }

    // Update conversations with the new message
    setConversations(
      conversations.map((conversation) => {
        if (conversation.id === activeChat) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
            lastMessage: message,
            time: "Just now",
          }
        }
        return conversation
      }),
    )

    // Clear the message input
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isEditing) {
        handleUpdateMessage()
      } else {
        handleSendMessage()
      }
    }
  }

  const handleMessageClick = (messageId: string, text: string) => {
    if (selectedMessage === messageId) {
      setSelectedMessage(null)
    } else {
      setSelectedMessage(messageId)
      setEditMessage(text)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!activeChat) return

    setConversations(
      conversations.map((conversation) => {
        if (conversation.id === activeChat) {
          const updatedMessages = conversation.messages.filter((msg) => msg.id !== messageId)
          const lastMsg = updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : null

          return {
            ...conversation,
            messages: updatedMessages,
            lastMessage: lastMsg ? lastMsg.text : "No messages",
            time: lastMsg ? lastMsg.time : conversation.time,
          }
        }
        return conversation
      }),
    )

    setSelectedMessage(null)
    toast.success("Message deleted")
  }

  const handleEditMessage = (messageId: string) => {
    const activeConversation = conversations.find((c) => c.id === activeChat)
    const messageToEdit = activeConversation?.messages.find((msg) => msg.id === messageId)
    
    if (messageToEdit) {
      setEditMessage(messageToEdit.text)
      setIsEditing(true)
      setSelectedMessage(messageId)
    }
  }

  const handleUpdateMessage = () => {
    if (!editMessage.trim() || !activeChat || !selectedMessage) return

    setConversations(
      conversations.map((conversation) => {
        if (conversation.id === activeChat) {
          const updatedMessages = conversation.messages.map((msg) => {
            if (msg.id === selectedMessage) {
              return {
                ...msg,
                text: editMessage,
                edited: true,
              }
            }
            return msg
          })

          return {
            ...conversation,
            messages: updatedMessages,
            lastMessage: updatedMessages[updatedMessages.length - 1].text,
          }
        }
        return conversation
      }),
    )

    setIsEditing(false)
    setSelectedMessage(null)
    setEditMessage("")
    toast.success("Message updated")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedMessage(null)
    setEditMessage("")
  }

  const handleConversationClick = (conversationId: string) => {
    setActiveChat(conversationId)
    setConversations(
      conversations.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            unread: 0,
          }
        }
        return conversation
      }),
    )
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>
  }

  const activeConversation = conversations.find((c) => c.id === activeChat)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <PharmacySidebar />

      {/* Main Content */}
      <div className="flex-1 flex" ref={containerRef}>
        {/* Conversations List */}
        <div className="border-r flex flex-col" style={{ width: `${resizePosition}px` }}>
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 font-medium text-gray-800 ${
                activeFilter === "all" ? "border-b-2 border-green-500" : ""
              }`}
              onClick={() => toggleFilter("all")}
            >
              All Messages
            </button>
            <button
              className={`flex-1 py-2 px-4 font-medium text-gray-800 ${
                activeFilter === "unread" ? "border-b-2 border-green-500" : ""
              }`}
              onClick={() => toggleFilter("unread")}
            >
              Unread
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    activeChat === conversation.id ? "bg-green-50" : ""
                  }`}
                  onClick={() => handleConversationClick(conversation.id)}
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
                          <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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

        {/* Resize handle */}
        <div
          className="w-1 bg-gray-200 hover:bg-green-400 cursor-col-resize flex items-center justify-center"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="h-8 flex flex-col items-center justify-center">
            <ChevronLeft className="w-3 h-3 text-gray-400" />
            <ChevronRight className="w-3 h-3 text-gray-400" />
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
                      {activeConversation?.online ? "Online" : "Offline"} • {activeConversation?.type}
                    </p>
                  </div>
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
                    {activeConversation?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "pharmacy" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`relative max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                            msg.sender === "pharmacy"
                              ? "bg-green-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none"
                          } ${selectedMessage === msg.id ? "ring-2 ring-blue-400" : ""}`}
                          onClick={() => msg.sender === "pharmacy" && handleMessageClick(msg.id, msg.text)}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={`text-xs mt-1 text-right ${
                              msg.sender === "pharmacy" ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {msg.time} {msg.edited && "(edited)"}
                          </p>

                          {/* Message actions popup */}
                          {selectedMessage === msg.id && msg.sender === "pharmacy" && (
                            <div className="absolute top-0 right-0 transform -translate-y-full bg-white shadow-lg rounded-lg p-2 flex space-x-2">
                              <button
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => handleEditMessage(msg.id)}
                                title="Edit message"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => handleDeleteMessage(msg.id)}
                                title="Delete message"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                {isEditing ? (
                  <div className="flex flex-col">
                    <div className="bg-yellow-50 p-2 mb-2 rounded-lg flex justify-between items-center">
                      <span className="text-sm text-yellow-700">Editing message</span>
                      <button className="text-gray-500 hover:text-gray-700" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1 relative">
                        <textarea
                          placeholder="Edit your message..."
                          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <button
                        className="p-2 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleUpdateMessage}
                        disabled={!editMessage.trim()}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Type a message..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <button
                      className="p-2 bg-green-500 text-white rounded-full ml-2 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageIcon className="w-10 h-10 text-gray-400" />
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
  )
}

// Message icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
  </svg>
)

export default MessagesPage


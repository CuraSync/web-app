"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import api from "@/utils/api";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { Menu, X, Send } from "lucide-react";

interface Message {
  doctorId: string;
  message: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "doctor" | "patient";
}

// Client component that uses useSearchParams
function MessageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const selectedDoctor = searchParams.get("doctorId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.post("/patient/doctor/messages", {
          doctorId: selectedDoctor,
        });
        setMessages(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchMessages();

    const serverUrl = "wss://curasync-backend.onrender.com/chat";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedDoctor };

    const socket = io(serverUrl, {
      auth: {
        token,
        additionalData,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("receive-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Received message:", message);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDoctor]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const doctorMessages = [...messages].sort((a, b) => {
    return (
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const now = new Date();

    try {
      const response = await api.post("/patient/doctor/sendMessage", {
        doctorId: selectedDoctor,
        message: newMessage,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5),
        sender: "patient",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Request failed:", error);
    }
    setNewMessage("");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  let lastDate = "";

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar - hidden on mobile by default */}
      <div
        className={`bg-white shadow-lg fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-64`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Messages</h2>
            <button
              className="md:hidden text-gray-500 hover:text-gray-800"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center">
          <button
            className="mr-4 text-gray-500 hover:text-gray-800 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold truncate">Chat with Doctor</h1>
        </header>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {doctorMessages.map((msg, index) => {
            const showDate = msg.addedDate !== lastDate;
            lastDate = msg.addedDate;

            return (
              <React.Fragment key={index}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm px-3 py-1 rounded-full">
                      {formatDate(msg.addedDate)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex mb-4 ${
                    msg.sender === "patient" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 rounded-lg ${
                      msg.sender === "patient"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm break-words">{msg.message}</div>
                    <div
                      className={`text-xs mt-1 text-right ${
                        msg.sender === "patient"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.addedTime}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="bg-white p-3 sm:p-4 shadow-md">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-grow px-3 py-2 sm:px-4 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 flex items-center justify-center transition-colors"
            >
              <Send size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

// Loading fallback component
function MessagingLoader() {
  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="text-lg font-medium text-gray-600">
        Loading messages...
      </div>
    </div>
  );
}

// Main page component with Suspense
const MessagesPage = () => {
  return (
    <Suspense fallback={<MessagingLoader />}>
      <MessageContent />
    </Suspense>
  );
};

export default MessagesPage;

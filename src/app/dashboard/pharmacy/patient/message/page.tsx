"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { io } from "socket.io-client";
import PharmacySidebar from "../../sidebar/sidebar";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"; 

interface Message {
  patientId: string;
  data: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "pharmacy" | "patient";
  type: "message" | "prescription";
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchMessages();

    const serverUrl = "wss://curasync-backend.onrender.com/chat";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedPatient };

    const socket = io(serverUrl, {
      auth: { token, additionalData },
    });

    socket.on("connect", () => toast.success("Connected to chat!"));
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.post("/pharmacy/patient/messages", { patientId: selectedPatient });
      setMessages(response.data);
  
    } catch (error) {
      toast.error("Failed to load messages. Please try again.");
      console.error("Request failed:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const now = new Date();

    try {
      await api.post("/pharmacy/patient/sendMessage", {
        patientId: selectedPatient,
        message: newMessage,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5),
        sender: "pharmacy",
        type: "message"
      });
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Request failed:", error);
    }
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <PharmacySidebar />
      </div>
      <div className="flex flex-col flex-1 p-4 bg-gray-100">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
          {messages.map((msg, index) => {
            let parsedData;
            try {
              parsedData = typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;
            } catch (error) {
              console.error("Error parsing msg.data:", error);
              parsedData = {};
            }

            return (
              <div key={index} className={`flex mb-4 ${msg.sender === "pharmacy" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === "pharmacy" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                  <div className="text-sm">{parsedData?.message || "No message"}</div>
                  <div className="text-xs mt-1 text-right text-white">{msg.addedTime}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

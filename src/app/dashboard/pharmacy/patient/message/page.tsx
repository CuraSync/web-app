"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { io } from "socket.io-client";

import { useSearchParams } from "next/navigation";

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
    fetchMessages();

    const serverUrl = "wss://curasync-backend.onrender.com/chat";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedPatient };

    // Connect to WebSocket server with token and additional data in the handshake
    const socket = io(serverUrl, {
      auth: {
        token,
        additionalData,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Received message:", message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.post("/pharmacy/patient/messages", {
        patientId: selectedPatient,
      });
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  // Sort messages by date and time
  const patientMessages = [...messages].sort((a, b) => {
    return (
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
    );
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Send new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const now = new Date();

    try {
      const response = await api.post("/pharmacy/patient/sendMessage", {
        patientId: selectedPatient,
        message: newMessage,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5),
        sender: "pharmacy",
        type: "message"
      });
      console.log(response.data);
    } catch (error) {
      console.error("Request failed:", error);
    }
    setNewMessage("");
  };

  let lastDate = "";

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
        {patientMessages.map((msg, index) => {
          const showDate = msg.addedDate !== lastDate;
          lastDate = msg.addedDate;

          return (
            <React.Fragment key={index}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                    {formatDate(msg.addedDate)}
                  </span>
                </div>
              )}
              <div
                className={`flex mb-4 ${
                  msg.sender === "pharmacy" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "pharmacy"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm">{msg.data.message ? msg.data.message : JSON.parse(msg.data)?.message}</div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      msg.sender === "pharmacy"
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-r-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
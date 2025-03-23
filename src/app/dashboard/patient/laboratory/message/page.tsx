"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import io from "socket.io-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../sidebar/sidebar";
import { AxiosError } from "axios"; // Import AxiosError

interface Message {
  labId: string;
  data: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "laboratory" | "patient";
  type: "message" | "labReport" | "report";
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const selectedLaboratory = searchParams.get("labId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.post("/patient/lab/messages", {
          labId: selectedLaboratory,
        });
        setMessages(response.data);
        console.log(response.data);
        await fetchReportData(response.data); // Await to ensure report data is fetched before rendering
      } catch (error: AxiosError) { // Replace 'any' with 'AxiosError'
        toast.error("Failed to load messages. Please check your connection.");
        console.error("Request failed:", error);
      }
    };

    fetchMessages();

    const serverUrl = "wss://curasync-backend.onrender.com/chat";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedLaboratory };

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
      fetchReportData([message]); // Fetch report data for the new message
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedLaboratory]); // Add selectedLaboratory as a dependency

  const fetchReportData = async (message: Message[]) => { // Replace 'any' with 'Message[]'
    for (const msg of message) {
      if (msg.type === "report") {
        try {
          const reportId = JSON.parse(msg.data)?.reportId;
          if (reportId && !reportData[reportId]) {
            const info = await getReportInfo(reportId);
            if (info) {
              setReportData((prev) => ({ ...prev, [reportId]: info.data }));
            }
          }
        } catch (error) {
          toast.warning("Unable to parse report data. Please try again.");
          console.error("Error parsing report data:", error);
        }
      }
    }
  };

  const laboratoryMessages = [...messages].sort((a, b) => {
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
    const sriLankaDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    try {
      await api.post("/patient/lab/sendMessage", {
        labId: selectedLaboratory,
        message: newMessage,
        addedDate: sriLankaDate.toISOString().split("T")[0],
        addedTime: now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "patient",
        type: "message",
      });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send the message. Please try again later.");
      console.error("Request failed:", error);
    }
  };

  const getReportInfo = async (reportId: string) => {
    if (!reportId) return null;

    try {
      const response = await api.get(`/labreport/info/${reportId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
    }
  };

  const handleReportClick = (reportId: string) => {
    setCurrentReportId(reportId);
    setIsOpen(true);
    getReport(reportId);
  };

  const getReport = async (reportId: string) => {
    if (!reportId) return null;

    try {
      const response = await api.get(`/labreport/file/${reportId}`, {
        responseType: "blob",
      });
      console.log(response.data);
      setReportFile(response.data);
      setReportUrl(URL.createObjectURL(response.data));
      console.log(URL.createObjectURL(response.data));
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
    }
  };

  let lastDate = "";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow bg-gray-100 p-4">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
          {laboratoryMessages.map((msg, index) => {
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
                {msg.type === "message" && (
                  <div
                    className={`flex mb-4 ${
                      msg.sender === "patient" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "laboratory"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm">
                        {msg.data.message
                          ? msg.data.message
                          : JSON.parse(msg.data)?.message}
                      </div>
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
                )}
                {msg.type === "report" &&
                  reportData[JSON.parse(msg.data)?.reportId] && (
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-md max-w-md mb-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600 text-2xl">📄</span>
                        <p
                          className="font-semibold text-blue-800 text-lg truncate w-3/4 cursor-pointer hover:text-blue-600 transition-all duration-300"
                          onClick={() =>
                            handleReportClick(JSON.parse(msg.data)?.reportId)
                          }
                        >
                          {reportData[JSON.parse(msg.data)?.reportId].file_name}
                        </p>
                      </div>
                    </div>
                  )}
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

      {isOpen && currentReportId && reportFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold">Report Details</h2>
            <p className="mt-2 text-gray-600"></p>
            <img src={reportUrl} alt="Report" />
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentReportId(null);
                setReportUrl(null);
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
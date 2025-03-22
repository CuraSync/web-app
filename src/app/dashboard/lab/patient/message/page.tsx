"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import LabSidebar from "../../sidebar/sidebar";
import { toast } from "sonner";

interface Message {
  patientId: string;
  data: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "laboratory" | "patient";
  type: "message" | "report";
}

const MessagesPage = () => {
  const [report, setReport] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(false);
  const [reportFile, setReportFile] = useState <File|null> (null);
  const [reportUrl , setReportUrl] = useState <string|null> (null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

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
      fetchReportData(messages);
      console.log("Received message:", message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchReportData = async (message: any) => {
    for (const msg of message) {
      if (msg.type === "report") {
        try {
          const reportId = typeof msg.data === "object" ? msg.data.reportId : JSON.parse(msg.data)?.reportId;
          if (reportId && !reportData[reportId]) {
            const info = await getReportInfo(reportId);
            if (info) {
              setReportData((prev) => ({ ...prev, [reportId]: info.data }));
              console.log("Report data fetched and added:", info.data);
            }
          }
        } catch (error) {
          toast.warning("Unable to parse report data. Please try again.");
          console.error("Error parsing report data:", error);
        }
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.post("/laboratory/patient/messages", {
        patientId: selectedPatient,
      });
      setMessages(response.data);
      console.log(response.data);
      fetchReportData(response.data);
    } catch (error) {
      toast.error("Failed to load messages. Please check your connection.");
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

  const handleSendMessage = async () => {
    let type = "message";
    let uploadedReportId = null;

    if (report) {
      uploadedReportId = await uploadReport();
      console.log("Report upload result:", uploadedReportId); 
      if (!uploadedReportId) {
        toast.error("Failed to upload the report.");
        return;
      }
      type = "report";
    }
    const now = new Date();


    try {   
      const response = await api.post("/laboratory/patient/sendMessage", {
        patientId: selectedPatient,
        message: newMessage,
        reportId: uploadedReportId,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5),
        sender: "laboratory",
        type,
      });
      toast.success("Message sent successfully");
      console.log(response.data);

      fetchMessages();

    } catch (error) {
      toast.error("Failed to send the message. Please try again later.");
      console.error("Request failed:", error);
      
    }
    setNewMessage("");
    setReport(null);
  };

  let lastDate = "";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 15 * 1024 * 1024) {
      setReport(file);
      toast.success("File selected successfully.");
    } else {
      toast.error("File size exceeds 15MB. Please select a smaller file.");
      setReport(null);
    }
  };

  const uploadReport = async (): Promise<string | null> => {
    if (!report) return null;

    const formData = new FormData();
    formData.append("file", report);
    formData.append("patientId", selectedPatient);
    formData.append("file_name", report.name);

    try {
      const response = await api.post("/labreport/upload", formData);
      console.log("Report uploaded successfully:", response.data);
      return response.data.id;
    } catch (error) {
      toast.error("Failed to upload report. Please try again later.");
      console.error("Upload failed", error);
      return null;
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
      const response = await api.get(`/labreport/file/${reportId}`,{ responseType: 'blob' });
      console.log(response.data);
      setReportFile(response.data);
      setReportUrl(URL.createObjectURL(response.data));
      console.log(URL.createObjectURL(response.data));
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
    }
  }; 

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-800 text-white">
        <LabSidebar />
      </div>
  
      {/* Main Content Area */}
      <div className="flex flex-col flex-grow bg-gray-50 p-6">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4">
          {patientMessages.map((msg, index) => {
            const showDate = msg.addedDate !== lastDate;
            lastDate = msg.addedDate;
            return (
              <React.Fragment key={index}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full shadow-md">
                      {formatDate(msg.addedDate)}
                    </span>
                  </div>
                )}
                {msg.type === "message" && (
                  <div
                    className={`flex mb-6 ${
                      msg.sender === "laboratory" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-6 py-3 rounded-lg ${
                        msg.sender === "laboratory"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      } shadow-md`}
                    >
                      <div className="text-sm">{msg.data.message || JSON.parse(msg.data)?.message}</div>
                      <div
                        className={`text-xs mt-2 text-right ${
                          msg.sender === "laboratory" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.addedTime}
                      </div>
                    </div>
                  </div>
                )}
  
                {msg.type === "report" && (() => {
                  const reportId = typeof msg.data === "object"
                    ? msg.data.reportId
                    : JSON.parse(String(msg.data))?.reportId;
  
                  return reportData[reportId] && (
                    <div className="flex flex-col bg-blue-50 p-6 rounded-lg shadow-lg max-w-md ml-auto mb-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                      {/* Report Section */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-blue-600 text-3xl">📄</span>
                        <p
                          className="font-semibold text-blue-800 text-lg truncate w-3/4 cursor-pointer hover:text-blue-600 transition-all duration-300"
                          onClick={() => handleReportClick(reportId)}
                        >
                          {reportData[reportId].file_name}
                        </p>
                      </div>
  
                      {/* Divider between Report and Message */}
                      <div className="border-t border-gray-300 my-6"></div>
  
                      {/* Message Section */}
                      <div className="text-sm text-gray-600 font-bold ml-2 mt-2 max-w-[220px] overflow-hidden text-ellipsis">
                        <p>
                          {typeof msg.data === "object" ? msg.data.message : JSON.parse(String(msg.data))?.message}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </React.Fragment>
            );
          })}
        </div>
  
        {/* Message Input Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 sm:mb-0 bg-gray-100 p-2 rounded-lg text-sm cursor-pointer"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow border border-gray-300 rounded-l-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
  
      {/* Report Modal */}
      {isOpen && currentReportId && reportFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Report Details</h2>
            <img src={reportUrl} alt="" className="w-full h-auto rounded-lg shadow-md" />
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentReportId(null);
                setReportUrl(null);
              }}
              className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
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
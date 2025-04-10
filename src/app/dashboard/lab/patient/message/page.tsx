"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import api from "@/utils/api";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import LabSidebar from "../../sidebar/sidebar";
import { toast } from "sonner";
import Image from "next/image";


interface Message {
  patientId: string;
  data: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "laboratory" | "patient";
  type: "message" | "report";
}

interface ReportData {
  file_name: string;
}

// Client component that uses useSearchParams
function MessageContent() {
  const [report, setReport] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [reportData, setReportData] = useState<Record<string, ReportData>>({});
  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");
  const [isOpen, setIsOpen] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  // Move getReportInfo outside useEffect and memoize it
  const getReportInfo = useCallback(async (reportId: string) => {
    if (!reportId) return null;

    try {
      const response = await api.get(`/labreport/info/${reportId}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
      return null;
    }
  }, []);

  // Create a memoized version of fetchReportData
  const fetchReportData = useCallback(
    async (messagesToProcess: Message[]) => {
      for (const msg of messagesToProcess) {
        if (msg.type === "report") {
          try {
            const reportId =
              typeof msg.data === "string"
                ? JSON.parse(msg.data)?.reportId
                : msg.data?.reportId;

            if (reportId && !reportData[reportId]) {
              const info = await getReportInfo(reportId);
              if (info) {
                setReportData((prev) => ({ ...prev, [reportId]: info.data }));
              }
            }
          } catch (error) {
            console.error("Error parsing report data:", error);
          }
        }
      }
    },
    [getReportInfo, reportData]
  );

  // Memoize fetchMessages to prevent unnecessary recreations
  const fetchMessages = useCallback(async () => {
    if (!selectedPatient) return;

    try {
      const response = await api.post("/laboratory/patient/messages", {
        patientId: selectedPatient,
      });
      setMessages(response.data);
      await fetchReportData(response.data);
    } catch (error) {
      toast.error("Failed to load messages. Please check your connection.");
      console.error("Request failed:", error);
    }
  }, [selectedPatient, fetchReportData]);

    useEffect(() => {
        document.title = "Message | CuraSync";
      }, []);

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
      fetchReportData([message]); // Process only the new message
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedPatient, fetchReportData, fetchMessages]);

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
    if (!selectedPatient) {
      toast.error("No patient selected");
      return;
    }

    if (!newMessage.trim() && !report) {
      toast.error("Please enter a message or select a report");
      return;
    }

    let type = "message";
    let uploadedReportId = null;

    if (report) {
      uploadedReportId = await uploadReport();
      if (!uploadedReportId) {
        toast.error("Failed to upload the report.");
        return;
      }
      type = "report";
    }

    const now = new Date();
    const sriLankaDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    try {
      await api.post("/laboratory/patient/sendMessage", {
        patientId: selectedPatient,
        message: newMessage,
        reportId: uploadedReportId,
        addedDate: sriLankaDate.toISOString().split("T")[0],
        addedTime: now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "laboratory",
        type,
      });
      toast.success("Message sent successfully");

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
    if (!report || !selectedPatient) return null;

    const formData = new FormData();
    formData.append("file", report);
    formData.append("patientId", selectedPatient);
    formData.append("file_name", report.name);

    try {
      const response = await api.post("/labreport/upload", formData);
      return response.data.id;
    } catch (error) {
      toast.error("Failed to upload report. Please try again later.");
      console.error("Upload failed", error);
      return null;
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
      setReportFile(response.data);
      setReportUrl(URL.createObjectURL(response.data));
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
    }
  };

  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0 bg-gray-800 text-white">
        <LabSidebar />
      </div>

      <div className="flex flex-col flex-grow bg-gray-50 p-6">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4">
          {patientMessages.map((msg, index) => {
            const showDate = msg.addedDate !== lastDate;
            lastDate = msg.addedDate;
            return (
              <React.Fragment key={index}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                      {formatDate(msg.addedDate)}
                    </span>
                  </div>
                )}
                {msg.type === "message" && (
                  <div
                    className={`flex mb-6 ${
                      msg.sender === "laboratory"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-6 py-3 rounded-lg ${
                        msg.sender === "laboratory"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      } shadow-md`}
                    >
                      <div className="text-sm">
                        {typeof msg.data === "string" &&
                        msg.data.startsWith("{")
                          ? JSON.parse(msg.data)?.message
                          : msg.data.message || msg.data}
                      </div>
                      <div
                        className={`text-xs mt-2 text-right ${
                          msg.sender === "laboratory"
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
                  (() => {
                    const reportId =
                      typeof msg.data === "string"
                        ? JSON.parse(msg.data)?.reportId
                        : msg.data?.reportId;

                    return (
                      reportData[reportId] && (
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
                              {typeof msg.data === "string"
                                ? JSON.parse(msg.data)?.message
                                : msg.data?.message}
                            </p>
                          </div>
                        </div>
                      )
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
            className="file:bg-gradient-to-r file:from-blue-600 file:to-blue-400 file:text-white file:px-6 file:py-3 file:rounded-lg file:shadow-md file:transition-all file:duration-300 file:ease-in-out hover:file:bg-gradient-to-r hover:file:from-blue-500 hover:file:to-blue-300 hover:file:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 p-3 rounded-xl shadow-lg cursor-pointer text-gray-700 text-sm hover:bg-gray-200 transition-colors duration-300"
          />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow border border-gray-300 rounded-lg px-6 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-300 bg-gray-50 shadow-sm hover:bg-gray-100"
          />

          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-semibold py-3 px-6 rounded-lg shadow-lg w-full sm:w-auto transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Send
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {isOpen && currentReportId && reportFile && reportUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-6 transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-3xl font-medium text-gray-900">
              Report Details
            </h2>
            <div className="relative w-full h-64">
              <Image
                src={reportUrl}
                alt="Report"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg shadow-md border border-gray-300"
                unoptimized // Important for blob URLs
              />
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentReportId(null);
                setReportUrl(null);
              }}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function MessagingLoader() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0 bg-gray-800 text-white">
        <LabSidebar />
      </div>
      <div className="flex flex-col flex-grow bg-gray-50 p-6 items-center justify-center">
        <div className="text-xl font-medium text-gray-600">
          Loading messages...
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
const MessagesPage = () => {
  return (
    <Suspense fallback={<MessagingLoader />}>
      <MessageContent />
    </Suspense>
  );
};

export default MessagesPage;

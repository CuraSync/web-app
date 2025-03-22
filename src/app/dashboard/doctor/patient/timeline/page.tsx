"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { Send, File } from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner";

interface TimelineNote {
  doctorId: string;
  data: string | object;
  addedDate: string;
  addedTime: string;
  sender: "doctor" | "laboratory";
  type: "donlynote" | "note" | "prescription" | "report";
}

const DoctorTimelinePage = () => {
  const [notes, setNotes] = useState<TimelineNote[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [noteType, setNoteType] = useState<
    "donlynote" | "note" | "prescription"
  >("note");
  const [isOpen, setIsOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const prevNotesLengthRef = useRef(0);
  const [reportData, setReportData] = useState<Record<string, any>>({});

  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchNotes();
    const serverUrl = "wss://curasync-backend.onrender.com/timeline";
    const token = localStorage.getItem("accessToken");
    const additionalData = { id: selectedPatient };

    const socket = io(serverUrl, {
      auth: {
        token,
        additionalData,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("receive-message", (message: TimelineNote) => {
      console.log("Received message:", message);
      setNotes((prevMessages) => [...prevMessages, message]);
      fetchReportData(notes);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (notes.length > 0 && notes.length > prevNotesLengthRef.current) {
      scrollToBottom();
    }
    prevNotesLengthRef.current = notes.length;
  }, [notes.length]);

  const fetchNotes = async () => {
    try {
      const response = await api.post("/doctor/timeline/notes", {
        patientId: selectedPatient,
      });
      console.log("Fetched notes:", response.data);

      await fetchReportData(response.data);
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return;
      }
      console.error("Failed to fetch notes:", error);
    }
  };

  const fetchReportData = async (message: any) => {
    for (const msg of message) {
      if (msg.type === "report") {
        try {
          const reportId =
            typeof msg.data == "object"
              ? msg.data.reportId
              : JSON.parse(msg.data)?.reportId;
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

  const handleSendNote = async () => {
    if (!newNote.trim()) return;

    const now = new Date();
    const sriLankaDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    try {
      const response = await api.post("/doctor/timeline/sendNote", {
        patientId: selectedPatient,
        note: newNote,
        type: noteType,
        addedDate: sriLankaDate.toISOString().split("T")[0],
        addedTime: now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setNewNote("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case "donlynote":
        return "bg-pink-100";
      case "note":
        return "bg-blue-100";
      case "prescription":
        return "bg-green-100";
      case "report":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    return (
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
    );
  });

  let lastDate = "";

  const handleReportClick = (reportId: string) => {
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
      setReportUrl(URL.createObjectURL(response.data));
      console.log(URL.createObjectURL(response.data));
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Timeline Area */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4 relative"
      >
        {/* Notes */}
        <div className="space-y-4 relative">
          {/* Center Line */}
          <div
            className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"
            style={{ height: "calc(100% + 16px)" }}
          />

          {/* Notes */}
          <div className="space-y-4">
            {sortedNotes.map((note, index) => {
              const showDate = note.addedDate !== lastDate;
              lastDate = note.addedDate;
              const isReport = note.type === "report";

              return (
                <React.Fragment key={index}>
                  {showDate && (
                    <div className="flex justify-center my-4 relative z-10">
                      <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                        {formatDate(note.addedDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center">
                    {/* Right side - Lab notes */}
                    <div className="w-5/12 pr-8">
                      {isReport && (
                        <div
                          className={`p-4 rounded-lg justify-start ${getNoteColor(
                            note.type
                          )}`}
                        >
                          <File
                            size={32}
                            className="hover: cursor-pointer w-[56px]"
                            onClick={() =>
                              handleReportClick(
                                typeof note.data == "object"
                                  ? note.data.reportId
                                  : JSON.parse(note.data)?.reportId
                              )
                            }
                          />
                          <p className="w-16 text-center">
                            {reportData[
                              typeof note.data == "object"
                                ? note.data.reportId
                                : JSON.parse(note.data)?.reportId
                            ]?.file_name +
                              "." +
                              reportData[
                                typeof note.data == "object"
                                  ? note.data.reportId
                                  : JSON.parse(note.data)?.reportId
                              ]?.file_type}
                          </p>

                          <p className="text-gray-800">
                            {typeof note.data == "object"
                              ? note.data?.note
                              : JSON.parse(note.data)?.note}
                          </p>
                          <div className="mt-2 text-sm text-gray-500 justify-end">
                            {note.addedTime}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Dot */}
                    <div className="w-3 h-3 bg-blue-500 rounded-full z-10" />

                    {/* Left side - Doctor notes */}

                    <div className="w-5/12 pl-8">
                      {!isReport && (
                        <div
                          className={`p-4 rounded-lg ${getNoteColor(
                            note.type
                          )}`}
                        >
                          <p className="text-gray-800">
                            {typeof note.data == "object"
                              ? note.data?.note
                              : JSON.parse(note.data)?.note}
                          </p>
                          <div className="mt-2 text-sm text-gray-500 text-right">
                            {note.addedTime}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
        <select
          value={noteType}
          onChange={(e) =>
            setNoteType(e.target.value as "donlynote" | "note" | "prescription")
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="donlynote">Doctor Note (Private)</option>
          <option value="note">General Note</option>
          <option value="prescription">Prescription</option>
        </select>

        <div className="flex gap-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your note..."
            onKeyPress={(e) => e.key === "Enter" && handleSendNote()}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendNote}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {isOpen && reportUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative z-50">
            <h2 className="text-xl font-semibold">Report View</h2>
            <p className="mt-2 text-gray-600"></p>
            <img src={reportUrl} alt="" />
            <button
              onClick={() => {
                setIsOpen(false);
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

export default DoctorTimelinePage;
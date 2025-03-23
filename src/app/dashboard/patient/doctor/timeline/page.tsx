"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { File } from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner";
import Image from "next/image";

interface TimelineNote {
  doctorId: string;
  data: string | object;
  addedDate: string;
  addedTime: string;
  sender: "doctor" | "laboratory";
  type: "donlynote" | "note" | "prescription" | "report";
}

interface ReportInfo {
  file_name: string;
  file_type: string;
}

interface ReportNoteData {
  reportId: string;
  note?: string;
}

interface ApiError {
  response?: {
    status: number;
  };
}

// Client component that uses useSearchParams
function TimelineContent() {
  const [notes, setNotes] = useState<TimelineNote[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const prevNotesLengthRef = useRef(0);
  const [reportData, setReportData] = useState<Record<string, ReportInfo>>({});
  const reportDataRef = useRef(reportData);

  const searchParams = useSearchParams();
  const selectedDoctor = searchParams.get("doctorId");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reportDataRef.current = reportData;
  }, [reportData]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  const processNote = useCallback(async (note: TimelineNote) => {
    if (note.type === "report") {
      try {
        const data =
          typeof note.data === "object"
            ? note.data
            : (JSON.parse(note.data as string) as ReportNoteData);
        const reportId = (data as ReportNoteData).reportId;
        if (reportId && !reportDataRef.current[reportId]) {
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
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.post("/patient/timeline/notes", {
        doctorId: selectedDoctor,
      });
      const notesData = response.data as TimelineNote[];
      setNotes(notesData);
      for (const note of notesData) {
        await processNote(note);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        return;
      }
      console.error("Failed to fetch notes:", error);
    }
  }, [selectedDoctor, processNote]);

  useEffect(() => {
    fetchNotes();

    const serverUrl = "wss://curasync-backend.onrender.com/timeline";
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

    socket.on("receive-message", (message: TimelineNote) => {
      setNotes((prev) => [...prev, message]);
      processNote(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDoctor, fetchNotes, processNote]);

  useEffect(() => {
    if (notes.length > prevNotesLengthRef.current) {
      scrollToBottom();
    }
    prevNotesLengthRef.current = notes.length;
  }, [notes.length]);

  const getReportInfo = async (reportId: string) => {
    try {
      const response = await api.get(`/labreport/info/${reportId}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch report details. Please try again later.");
      console.error("Request failed:", error);
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

  const handleReportClick = async (reportId: string) => {
    try {
      const response = await api.get(`/labreport/file/${reportId}`, {
        responseType: "blob",
      });
      setReportUrl(URL.createObjectURL(response.data));
      setIsOpen(true);
    } catch (error) {
      toast.error("Failed to fetch report. Please try again later.");
      console.error("Failed to fetch report:", error);
    }
  };

  const getNoteData = (note: TimelineNote) => {
    return typeof note.data === "object"
      ? note.data
      : JSON.parse(note.data as string);
  };

  const sortedNotes = [...notes].sort(
    (a, b) =>
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
  );

  let lastDate = "";

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4 relative"
      >
        <div className="space-y-4 relative">
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2" />
          <div className="space-y-4">
            {sortedNotes.map((note, index) => {
              const showDate = note.addedDate !== lastDate;
              if (showDate) lastDate = note.addedDate;
              const noteData = getNoteData(note);

              return (
                <React.Fragment key={index}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                        {formatDate(note.addedDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center">
                    <div className="w-5/12 pr-8">
                      {note.type === "note" && (
                        <div
                          className={`p-4 rounded-lg ${getNoteColor(
                            note.type
                          )}`}
                        >
                          <p className="text-gray-800">{noteData.note}</p>
                          <div className="mt-2 text-sm text-gray-500 text-right">
                            {note.addedTime}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full z-10" />
                    <div className="w-5/12 pl-8">
                      {note.type === "report" && (
                        <div
                          className={`p-4 rounded-lg ${getNoteColor(
                            note.type
                          )}`}
                        >
                          <File
                            size={32}
                            className="cursor-pointer w-14"
                            onClick={() =>
                              handleReportClick(
                                (noteData as ReportNoteData).reportId
                              )
                            }
                          />
                          <p className="w-16 text-center">
                            {
                              reportData[(noteData as ReportNoteData).reportId]
                                ?.file_name
                            }
                            .
                            {
                              reportData[(noteData as ReportNoteData).reportId]
                                ?.file_type
                            }
                          </p>
                          <p className="text-gray-800">
                            {(noteData as ReportNoteData).note}
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

      {isOpen && reportUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <h2 className="text-xl font-semibold">Report View</h2>
            <Image
              src={reportUrl}
              alt="Report"
              width={400}
              height={400}
              className="mt-4 mx-auto"
            />
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
}

// Loading fallback component
function TimelineLoader() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 items-center justify-center">
      <div className="text-lg font-medium text-gray-600">
        Loading timeline...
      </div>
    </div>
  );
}

// Main component with Suspense boundary
const DoctorTimelinePage = () => {
  return (
    <Suspense fallback={<TimelineLoader />}>
      <TimelineContent />
    </Suspense>
  );
};

export default DoctorTimelinePage;

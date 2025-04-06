"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { File, SearchSlash, X } from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner";
import Sidebar from "../../sidebar/sidebar";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TimelineNote {
  doctorId: string;
  data: string | object;
  addedDate: string;
  addedTime: string;
  sender: "doctor" | "laboratory";
  type: "donlynote" | "note" | "prescription" | "report";
}

// Separate component to use useSearchParams
const TimelineContent = () => {
  const [notes, setNotes] = useState<TimelineNote[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisualization, setIsVisualization] = useState(false);
  const [visualizationData, setVisualizationData] = useState<string | null>(
    null
  );
  const [visualizationLoading, setvisualizationLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const prevNotesLengthRef = useRef(0);
  const [reportData, setReportData] = useState<Record<string, any>>({});

  const searchParams = useSearchParams();
  const selectedDoctor = searchParams.get("doctorId");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    document.title = "Patient Timeline | CuraSync";
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
      console.log("Received message:", message);
      setNotes((prevMessages) => [...prevMessages, message]);
      fetchReportData(notes);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDoctor]); // Add selectedDoctor as dependency

  useEffect(() => {
    if (notes.length > 0 && notes.length > prevNotesLengthRef.current) {
      scrollToBottom();
    }
    prevNotesLengthRef.current = notes.length;
  }, [notes.length]);

  const fetchNotes = async () => {
    try {
      const response = await api.post("/patient/timeline/notes", {
        doctorId: selectedDoctor,
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

  const handleVisualizationClick = (reportId: string) => {
    setIsVisualization(true);
    getVisualization(reportId);
  };

  const getVisualization = async (reportId: string) => {
    if (!reportId) return null;

    setvisualizationLoading(true);
    try {
      const response = await api.post("/labreport/visualization", {
        reportId,
      });
      console.log(response.data);
      setVisualizationData(response.data.visualization);
      setvisualizationLoading(false);
    } catch (error) {
      toast.error(
        "Failed to fetch Visualization data. Please try again later."
      );
      console.error("Request failed:", error);
    }
  };

  return (
    <>
      {/* Timeline Area */}
      <div className="flex-1 ml-64 p-4 overflow-y-auto">
        <div
          ref={scrollContainerRef}
          className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-2rem)] overflow-y-auto"
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
                const isNote =
                  note.type !== "donlynote" && note.type !== "report";
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
                      {/* Left side - Doctor notes */}
                      <div className="w-5/12 pr-8">
                        {isNote && (
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

                      {/* Timeline Dot */}
                      {(isNote || isReport) && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full z-10" />
                      )}

                      {/* Right side - Lab notes */}
                      <div className="w-5/12 pl-8">
                        {isReport && (
                          <div
                            className={`p-4 rounded-lg justify-start ${getNoteColor(
                              note.type
                            )}`}
                          >
                            <div className="flex justify-center items-center gap-12 w-full">
                              <div
                                className="bg-gray-300 p-6 rounded-xl cursor-pointer"
                                onClick={() =>
                                  handleReportClick(
                                    typeof note.data == "object"
                                      ? note.data.reportId
                                      : JSON.parse(note.data)?.reportId
                                  )
                                }
                              >
                                <File size={45} className="w-[56px]" />
                                <p className="w-16 text-center mt-2">
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
                              </div>

                              <div
                                className="p-6 bg-slate-200 rounded-3xl cursor-pointer"
                                onClick={() =>
                                  handleVisualizationClick(
                                    typeof note.data == "object"
                                      ? note.data.reportId
                                      : JSON.parse(note.data)?.reportId
                                  )
                                }
                              >
                                <SearchSlash
                                  size={42}
                                  className="w-[56px] ml-3"
                                />
                                <p className="mt-2 w-24 text-center">
                                  Visualization
                                </p>
                              </div>
                            </div>

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
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
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

      {isVisualization && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => {
              setIsVisualization(false);
              setVisualizationData(null);
            }}
          />

          <div
            className={`fixed top-0 right-0 w-[90%] h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
              isVisualization ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button
                onClick={() => {
                  setIsVisualization(false);
                  setVisualizationData(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close panel"
              >
                <X size={24} />
              </button>
              <div className="ml-4 font-medium">Report Visualization</div>
            </div>

            <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
              <div className="flex flex-col md:flex-row gap-6">
                {visualizationLoading && (
                  <div className="flex flex-col items-center justify-center w-full py-16">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-700">
                      Visualization Loading
                    </h3>
                  </div>
                )}
                {visualizationData && (
                  <>
                    <div className="md:w-2/5">
                      <Image
                        src="/assets/lab/blood.avif"
                        alt="Report visualization"
                        width={500}
                        height={300}
                        className="w-full h-auto mt-12"
                      />
                    </div>

                    <div className="md:w-3/5 prose prose-sm md:prose-base lg:prose-lg max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-xl font-bold mt-4" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-lg font-bold mt-3" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 my-2" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="my-1" {...props} />
                          ),
                        }}
                      >
                        {visualizationData}
                      </ReactMarkdown>
                    </div>
                  </>
                )}

                {!visualizationData && !visualizationLoading && (
                  <div className="flex flex-col items-center justify-center w-full py-12 px-8 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="mb-6 text-gray-400">
                      <SearchSlash size={64} />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No Visualization Available
                    </h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                      Visualization is not done yet. Please generate the
                      visualization using the button below.
                    </p>
                    <button
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                      onClick={() => {}}
                    >
                      <SearchSlash size={18} />
                      Generate Visualization
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Main page component with Suspense
const DoctorTimelinePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed h-screen w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Timeline Content wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="flex-1 ml-64 p-4 flex items-center justify-center">
            <div className="text-gray-600">Loading timeline...</div>
          </div>
        }
      >
        <TimelineContent />
      </Suspense>
    </div>
  );
};

export default DoctorTimelinePage;

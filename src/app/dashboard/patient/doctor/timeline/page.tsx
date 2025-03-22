"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import Sidebar from "../../sidebar/sidebar";

interface Note {
  doctorId: string;
  message: string;
  addedDate: string; // YYYY-MM-DD format
  addedTime: string; // HH:MM format
  sender: "doctor" | "laboratory";
  reportId?: string; // Only for lab reports
}

const DoctorTimelinePage = () => {
  const [timelineItems, setTimelineItems] = useState<[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const selectedDoctor = searchParams.get("doctorId") || "";

  useEffect(() => {
    fetchNotes();
  }, [selectedDoctor]);

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes for doctorId:", selectedDoctor);
      const response = await api.post("/patient/timeline/notes", {
        doctorId: selectedDoctor,
      });
      setNotes(response.data as Note[]);
      console.log("Response data:", response.data);
    } catch (error: any) {
      console.error(
        "Request failed:",
        error.response?.status,
        error.response?.data,
        error.message
      );
    }
  };

  const handleVisualizationClick = (labId: string) => {
    router.push(`/laboratory/visualization?labId=${labId}`);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    return (
      a.addedDate.localeCompare(b.addedDate) ||
      a.addedTime.localeCompare(b.addedTime)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  let lastDate = "";

  return (
    <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex-grow bg-white rounded-lg shadow-md p-4 relative">
          <div
            className="fixed left-1/2 transform -translate-x-1/2 w-0.5 bg-black"
            style={{ top: 0, bottom: 0, height: "100vh" }}
          ></div>

          {sortedNotes.map((note, index) => {
            const showDate = note.addedDate !== lastDate;
            lastDate = note.addedDate;

            return (
              <React.Fragment key={index}>
                {showDate && (
                  <div className="flex justify-center my-4 relative">
                    <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full z-10">
                      {formatDate(note.addedDate)}
                    </span>
                  </div>
                )}
                <div className="flex items-center mb-4 relative">
                  {note.sender === "doctor" && (
                    <>
                      <div className="w-1/2 pr-4 flex justify-end">
                        <div className="bg-pink-600 text-white max-w-xs lg:max-w-md px-4 py-2 rounded-bl-none rounded-lg">
                          <div className="text-sm">{note.message}</div>
                          <div className="text-xs mt-1 text-white text-right">
                            {note.addedTime}
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2"></div>
                    </>
                  )}

                  {note.sender === "laboratory" && (
                    <>
                      <div className="w-1/2"></div>
                      <div className="w-1/2 pl-4 flex justify-start">
                        <div className="bg-green-600 text-white max-w-xs lg:max-w-md px-4 py-2 rounded-br-none rounded-lg">
                          <div className="text-sm">{note.message}</div>
                          <div className="text-xs mt-1 text-white text-right">
                            {note.addedTime}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {timelineItems.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No timeline items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default DoctorTimelinePage;

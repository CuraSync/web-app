"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import io from "socket.io-client";

interface TimelineNote {
  doctorId: string;
  data: string | object;
  addedDate: string;
  addedTime: string;
  sender: "doctor" | "laboratory";
  type: "donlynote" | "note" | "prescription";
}

const DoctorTimelinePage = () => {
  const [notes, setNotes] = useState<TimelineNote[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [noteType, setNoteType] = useState<"donlynote" | "note" | "prescription">("note");

  const searchParams = useSearchParams();
  const selectedPatient = searchParams.get("patientId");

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.post("/doctor/timeline/notes", {
        patientId: selectedPatient,
      });
      console.log("Fetched notes:", response.data);
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return;
      }
      console.error("Failed to fetch notes:", error);

    }
  };

  const handleSendNote = async () => {
    if (!newNote.trim()) return;

    const now = new Date();
    try {
      const response = await api.post("/doctor/timeline/sendNote", {
        patientId: selectedPatient,
        note: newNote,
        type: noteType,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setNotes([...notes, response.data]);
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case "donote":
        return "bg-pink-100";
      case "gnote":
        return "bg-blue-100";
      case "prescription":
        return "bg-green-100";
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

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Timeline Area */}
      <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4 relative">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2" />

        {/* Notes */}
        <div className="space-y-4">
          {notes.map((note, index) => {
            const isDoctor = note.sender === "doctor";
            return (
              <div key={index} className="flex items-center justify-center">
                {/* Left side - Doctor notes */}
                <div className={`w-5/12 ${isDoctor ? "pr-8" : ""}`}>
                  
                    <div className={`p-4 rounded-lg ${getNoteColor(note.type)}`}>
                      <p className="text-gray-800">{note.data.note}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {note.addedTime} · {formatDate(note.addedDate)}
                      </div>
                    </div>
                 
                </div>

                {/* Timeline Dot */}
                <div className="w-3 h-3 bg-blue-500 rounded-full z-10" />

                {/* Right side - Lab notes */}
                <div className={`w-5/12 ${!isDoctor ? "pl-8" : ""}`}>
                  {!isDoctor && (
                    <div className={`p-4 rounded-lg ${getNoteColor(note.type)}`}>
                      <p className="text-gray-800">{typeof note.data != "object"?JSON.parse(note.data).note:note.data.note}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {note.addedTime} · {formatDate(note.addedDate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as "donlynote" | "note" | "prescription")}
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
    </div>
  );
};

export default DoctorTimelinePage;
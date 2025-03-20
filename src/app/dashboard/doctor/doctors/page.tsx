"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, BriefcaseMedical, Search, User, X } from "lucide-react";
import DoctorSidebar from "@/components/doctor/Sidebar";
import api from "@/utils/api";
import { toast } from "sonner";

interface Doctor {
  firstName: string;
  lastName: string;
  doctorId: string;
  specialization: string;
  hospital: string;
  profilePic: string;
  yearsOfExperience: number;
}

interface Message {
  id: string;
  content: string;
  sender: 'doctor' | 'colleague';
  timestamp: string;
  addedDate: string;
  addedTime: string;
}

const DoctorsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchMessages(selectedDoctor.doctorId);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctor/doctors");
  
      // Map the data to match the Doctor interface structure
      const mappedDoctors = response.data.map((doctor: any) => ({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        doctorId: doctor.reciveDoctorId, // Fixing key name
        specialization: doctor.specialization || "Unknown", // Handle missing specialization
        hospital: doctor.hospital || "Unknown", // Handle missing hospital
        profilePic: doctor.profilePic,
        yearsOfExperience: doctor.yearsOfExperience || 0, // Handle missing yearsOfExperience
      }));
  
      setDoctors(mappedDoctors);
      console.log("Doctors fetched:", mappedDoctors); // Log doctor data to console
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchMessages = async (doctorId: string) => {
    try {
      const response = await api.post("/doctor/doctor/messages", { doctorId });
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!selectedDoctor || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const now = new Date();
      const addedDate = now.toISOString().split('T')[0];
      const addedTime = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      await api.post("/doctor/doctor/sendMessage", {
        doctorId: selectedDoctor.doctorId,
        message: newMessage,
        addedDate,
        addedTime
      });

      setMessages([...messages, {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'doctor',
        timestamp: new Date().toLocaleTimeString(),
        addedDate,
        addedTime
      }]);

      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization = selectedSpecialization === "All" || 
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  const handleMessageClick = (doctorId: string) => {
    router.push(`/dashboard/doctor/doctor/message?doctorId=${doctorId}`);
  };

  const handleProfileClick = (doctorId: string) => {
    router.push(`/dashboard/doctor/profile/${doctorId}`);
  };

  const specializations = [
    "All",
    ...new Set(doctors.map(d => d.specialization).filter(Boolean))
  ] as string[];

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-white">
        <DoctorSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Colleagues</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or hospital..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <select
            className="border rounded-lg px-4 py-2"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No doctors found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.doctorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.profilePic}
                              alt={`${doctor.firstName} ${doctor.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {doctor.firstName[0]}{doctor.lastName[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {doctor.doctorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.hospital}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.yearsOfExperience} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMessageClick(doctor.doctorId)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                        >
                          <MessageCircle className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleProfileClick(doctor.doctorId)}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <User className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Message Modal */}
        {showMessageModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {selectedDoctor.firstName[0]}{selectedDoctor.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h3>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          message.sender === 'doctor'
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-white border'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      placeholder="Type a message..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BriefcaseMedical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
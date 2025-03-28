"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";
import DoctorSidebar from "@/components/doctor/Sidebar";
import api from "@/utils/api";
import { toast } from "sonner";
import Image from "next/image";

interface Doctor {
  firstName: string;
  lastName: string;
  doctorId: string;
  profilePic: string;
  messageStatus: boolean;
}

interface ApiDoctor {
  firstName: string;
  lastName: string;
  doctorId: string;
  reciveDoctorId: string;
  profilePic: string;
  messageStatus: boolean;
}

const DoctorsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorId, setNewDoctorId] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctor/doctors");
      const mappedDoctors = response.data.map((doctor: ApiDoctor) => {
        const id = doctor.doctorId || doctor.reciveDoctorId;
        return {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          doctorId: id,
          profilePic: doctor.profilePic,
          messageStatus: doctor.messageStatus,
        };
      });
      setDoctors(mappedDoctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async () => {
    if (!newDoctorId.trim()) {
      toast.error("Please enter a valid Doctor ID");
      return;
    }

    const now = new Date();
    try {
      setIsSendingRequest(true);
      await api.post("/doctor/request", { 
        secondDoctorId: newDoctorId,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5), 
      });
      toast.success("Request sent successfully");
      setShowAddDoctorModal(false);
      setNewDoctorId("");
    } catch (error) {
      console.error("Failed to send request:", error);
      toast.error("Failed to send request. Please check the Doctor ID.");
    } finally {
      setIsSendingRequest(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchLower) ||
      doctor.doctorId.toLowerCase().includes(searchLower)
    );
  });

  const handleMessageClick = (doctorId: string) => {
    router.push(`/dashboard/doctor/doctor/message?doctorId=${doctorId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-white">
        <DoctorSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Connected Doctors</h1>
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>+</span>
            <span>Add Connection</span>
          </button>
        </div>

        <div className="mb-8 relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search doctors by name or ID..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="w-12 h-12 mx-auto text-gray-300" />
              </div>
              <p className="text-gray-600">No doctors found matching your search criteria</p>
            </div>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {doctor.profilePic ? (
                      <Image
                        className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                        src={doctor.profilePic}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        width={56}
                        height={56}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg border-2 border-white shadow-sm">
                        {doctor.firstName[0]}{doctor.lastName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {doctor.doctorId}</p>
                    <button
                      onClick={() => handleMessageClick(doctor.doctorId)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showAddDoctorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Send Connection Request</h3>
              <input
                type="text"
                placeholder="Enter Doctor ID"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newDoctorId}
                onChange={(e) => setNewDoctorId(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDoctor}
                  disabled={isSendingRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSendingRequest ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
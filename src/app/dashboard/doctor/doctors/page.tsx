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
      console.error("Failed to send request:", error); // Added error logging
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
          <h1 className="text-2xl font-bold">Doctors</h1>
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Doctor
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="Search doctors by name or ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Status
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
                filteredDoctors.map((doctor,index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.profilePic ? (
                            <Image
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.profilePic}
                              alt={`${doctor.firstName} ${doctor.lastName}`}
                              width={40}
                              height={40}
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
                      <button 
                        onClick={() => handleMessageClick(doctor.doctorId)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
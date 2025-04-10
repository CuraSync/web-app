"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageCircle, Clock, Search } from "lucide-react"; // Removed unused Send import
import DoctorSidebar from "@/components/doctor/Sidebar";
import api from "@/utils/api";
import { toast } from "sonner";

interface Patient {
  firstName: string;
  lastName: string;
  lastVisit: string;
  messageStatus: boolean;
  patientId: string;
  priority: number;
  profilePic: string;
}

const PatientsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientId, setNewPatientId] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctor/patient");
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatientId.trim()) {
      toast.error("Please enter a valid Patient ID");
      return;
    }

    const now = new Date();
    try {
      setIsSendingRequest(true);
      await api.post("/patient/request", {
        patientId: newPatientId,
        addedDate: now.toISOString().split("T")[0],
        addedTime: now.toTimeString().substring(0, 5),
      });
      toast.success("Request sent successfully");
      setShowAddPatientModal(false);
      setNewPatientId("");
    } catch (error) {
      console.error("Failed to send request:", error);
      toast.error("Failed to send request. Please check the Patient ID.");
    } finally {
      setIsSendingRequest(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      selectedPriority === "All" ||
      patient.priority.toString() === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleMessageClick = (patientId: string) => {
    router.push(`/dashboard/doctor/patient/message?patientId=${patientId}`);
  };

  const handleTimelineClick = (patientId: string) => {
    router.push(`/dashboard/doctor/patient/timeline?patientId=${patientId}`);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "Unknown";
    }
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
          <h1 className="text-2xl font-bold">Patients</h1>
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Patient
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="Search patients by name..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <select
            className="border rounded-lg px-4 py-2"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="1">High Priority</option>
            <option value="2">Medium Priority</option>
            <option value="3">Low Priority</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No patients found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.patientId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {patient.profilePic ? (
                            <Image
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                              src={patient.profilePic}
                              alt={`${patient.firstName} ${patient.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {patient.firstName[0]}
                              {patient.lastName[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.lastVisit || "Never"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          patient.priority
                        )}`}
                      >
                        {getPriorityText(patient.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMessageClick(patient.patientId)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                        >
                          <MessageCircle className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleTimelineClick(patient.patientId)}
                          className="p-2 rounded-full hover:bg-purple-100 text-purple-600 transition-colors"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showAddPatientModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Send Connection Request
              </h3>
              <input
                type="text"
                placeholder="Enter Patient ID"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newPatientId}
                onChange={(e) => setNewPatientId(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPatient}
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

export default PatientsPage;
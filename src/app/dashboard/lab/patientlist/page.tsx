"use client";
import React, { useEffect, useState } from "react";
import LabSidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import { FaRegCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";  // Add toast import for error handling

interface Patient {
  patientId: string | number;
  Id: string | number;
  firstName: string;
  lastName: string;
}

const PatientList = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Track loading state

  const fetchList = async () => {
    setLoading(true);  // Set loading to true when fetching starts
    try {
      const response = await api.get("/laboratory/patients");
      setPatients(response.data);
      console.log(response);
    } catch (error) {
      toast.error("Error fetching patient list. Please try again.");  // Show error toast
      console.error("Error fetching patient list:", error);
    } finally {
      setLoading(false);  // Set loading to false after the fetch is complete
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchList();
  }, []);

  const handleToMessage = (patientId: string | number) => {
    router.push(`/dashboard/lab/patient/message?patientId=${patientId}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <LabSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Patient List</h1>

        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <span className="text-lg text-gray-500">Loading patients...</span>
            <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-blue-50 text-gray-700">
                <tr>
                  <th className="border-b p-4 text-left font-medium">Patient ID</th>
                  <th className="border-b p-4 text-left font-medium">Patient Name</th>
                  <th className="border-b p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.patientId} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="border-t p-4 text-gray-700">{patient.patientId}</td>
                    <td className="border-t p-4 text-gray-800 font-semibold">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="border-t p-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleToMessage(patient.patientId)}
                          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaRegCommentDots className="text-xl mr-2" />
                          <span className="text-sm font-medium">Message</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6 text-lg">No patients found.</p>
        )}
      </main>
    </div>
  );
};

export default PatientList;

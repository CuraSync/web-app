"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { FaRegClock, FaRegCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

interface Patient {
  doctorId: string;
  firstName: string;
  lastName: string;
}

const DoctorList = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Patient Doctor | CuraSync";
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await api.get("/patient/doctors");
      setPatients(response.data);
      console.log(response);
      setError(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "No Doctors Found",
            text: "There are no doctors available at the moment.",
            icon: "info",
            confirmButtonText: "OK",
          });
          setPatients([]);
        } else {
          setError("Failed to load doctors. Please try again.");
          console.error("Error fetching doctor list:", error.message, error.stack);
        }
      } else {
        setError("An unexpected error occurred while fetching doctors.");
        console.error("Unexpected error:", error);
      }
    }
  };

  const messagePage = (doctorId: string) => {
    router.push(`/dashboard/patient/doctor/message?doctorId=${doctorId}`);
  };

  const timelinePage = (doctorId: string) => {
    router.push(`/dashboard/patient/doctor/timeline?doctorId=${doctorId}`);
  };

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
        <main className="flex-1 p-6 max-w-4xl mx-auto">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor List</h1>
          </div>

          {patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Doctor ID</th>
                    <th className="p-3 text-left">Doctor Name</th>
                    <th className="p-3 text-left">Actions</th>
                    <th className="p-3 text-left">TimeLine</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((doctor) => (
                    <tr key={doctor.doctorId} className="hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{doctor.doctorId}</td>
                      <td className="p-3 text-gray-800 font-semibold">
                        {doctor.firstName} {doctor.lastName}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <button
                            onClick={() => messagePage(doctor.doctorId)}
                            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <FaRegCommentDots className="text-xl mr-1" />
                            <span className="text-sm">Message</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <button
                            onClick={() => timelinePage(doctor.doctorId)}
                            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <FaRegClock className="text-xl mr-1" />
                            <span className="text-sm">TimeLine</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No doctor found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorList;
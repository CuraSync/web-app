"use client";
import React, { useEffect, useState } from "react";
import PharmacySidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import { FaRegCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

interface Patient {
    patientId: string;
    firstName: string;
    lastName: string;
}

const PatientList = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        fetchList();
    }, []);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await api.get("/pharmacy/patients");
            setPatients(response.data); 
            console.log(response);
        } catch (error) {
            toast.error("Error fetching patient list")
           console.error("Error fetching patient list:", error);
        } finally{
            setLoading(false);
        }
    };


    const messagePage = (patientId: string) => {
        router.push(`/dashboard/pharmacy/patient/message?patientId=${patientId}`);
      };

    return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
          <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
                    <PharmacySidebar />
                </div>
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
                            <thead  className="bg-blue-50 text-gray-700">
                                <tr>
                                    <th className="border-b p-4 text-left font-medium">Patient ID</th>
                                    <th className="border-b p-4 text-left font-medium">Patient Name</th>
                                    <th className="border-b p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.patientId} className="border-b hover:bg-blue-50 transition-colors">
                                        <td className="border p-3 text-gray-700">{patient.patientId}</td>
                                        <td className="border p-3 text-gray-800 font-semibold">
                                            {patient.firstName} {patient.lastName}
                                        </td>
                                        <td className="border p-3">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => messagePage(patient.patientId)}
                                                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    <FaRegCommentDots 
                                                        className="text-xl mr-2" 
                                                    />
                                                    <span className="text-sm">Message</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No patients found.</p>
                )}
            </main>
        </div>
    );
};

export default PatientList;
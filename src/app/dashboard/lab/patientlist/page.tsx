"use client";
import React, { useEffect, useState } from "react";
import LabSidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import { FaRegCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Patient {
    patientId: string | number;
    Id: string | number;
    firstName: string;
    lastName: string;
}

const PatientList = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);

    const fetchList = async () => {
        try {
            const response = await api.get("/laboratory/patients");
            setPatients(response.data); 
            console.log(response);
        } catch (error) {
            console.error("Error fetching patient list:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const handleToMessage = (patientId: string | number) => {
        router.push(`/dashboard/laboratory/messages/${patientId}`);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <LabSidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient List</h1>

                {patients.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 shadow-md">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3 text-left">Patient ID</th>
                                    <th className="border p-3 text-left">Patient Name</th>
                                    <th className="border p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.patientId} className="border hover:bg-gray-50">
                                        <td className="border p-3 text-gray-700">{patient.patientId}</td>
                                        <td className="border p-3 text-gray-800 font-semibold">
                                            {patient.firstName} {patient.lastName}
                                        </td>
                                        <td className="border p-3">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleToMessage(patient.patientId)}
                                                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    <FaRegCommentDots 
                                                        className="text-xl mr-1" 
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
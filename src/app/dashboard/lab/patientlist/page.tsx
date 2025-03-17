"use client";
import React, { useEffect, useState } from "react";
import LabSidebar from "../sidebar/sidebar";
import api from "@/utils/api";

interface Patient {
    patientId: string | number;
    id: string;
    firstName: string;
    lastName: string;
}

const PatientList = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    const fetchList = async () => {
        try {
            const response = await api.get("/laboratory/patients");
            setPatients(response.data); 
        } catch (error) {
            console.error("Error fetching patient list:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <LabSidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient List</h1>

                {patients.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {patients.map((patient) => (
                            <li 
                                key={patient.patientId} 
                                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                            >
                                <h2 className="font-semibold text-lg text-gray-700">
                                    Patient ID: {patient.patientId}
                                </h2>
                                <p className="text-gray-600">First Name: {patient.firstName}</p>
                                <p className="text-gray-600">Last Name: {patient.lastName}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No patients found.</p>
                )}
            </main>
        </div>
    );
};

export default PatientList;

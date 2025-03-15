"use client";
import React, { useEffect, useState } from "react";
import PharmacySidebar from "../sidebar/sidebar";
import api from "@/utils/api";

interface Patient {
    patientId: string | number;
    firstName: string;
    lastName: string;

}

const PatientList = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    const fetchList = async () => {
        try {
            const response = await api.get("/pharmacy/patients");
            setPatients(response.data); 
        } catch (error) {
            console.error("Error fetching patient list:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="min-h-screen flex bg-white">
            {/* Sidebar */}
            <PharmacySidebar />
            <main className="p-4">
                <h1 className="text-xl font-bold mb-4">Patient List</h1>
                {patients.length > 0 ? (
                    <ul>
                        {patients.map((patient) => (
                            <li key={patient.patientId} className="mb-2 p-2 border rounded">
                                <h2 className="font-semibold">Patient ID: {patient.patientId}</h2>
                                <p>First Name: {patient.firstName}</p>
                                <p>Last Name: {patient.lastName}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p></p>
                )}
            </main>
        </div>
    );
};

export default PatientList;

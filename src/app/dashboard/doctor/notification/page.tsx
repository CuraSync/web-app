"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner"; 
import api from "@/utils/api";
import DoctorSidebar from '@/components/doctor/Sidebar';

interface Request {
  _id: string;
  addedDate: string;
  addedTime: string;
  status: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  firstName?: string;
  lastName?: string;
  secondDoctorId: string;
}

const DoctorRequestPage = () => {
  const [patientRequests, setPatientRequests] = useState<Request[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<Request[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [acceptedPatientRequests, setAcceptedPatientRequests] = useState<Request[]>([]);
  const [acceptedDoctorRequests, setAcceptedDoctorRequests] = useState<Request[]>([]);
  const [acceptedSentRequests, setAcceptedSentRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<string>("patient");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const fetchWithFallback = async (url: string) => {
        try {
          const response = await api.get(url);
          return response.data;
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          toast.error(`Failed to load data from ${url}`);
          return [];
        }
      };

      const patientData = await fetchWithFallback("/doctor/patient/request");
      const doctorData = await fetchWithFallback("/doctor/doctor/request");
      const sentData = await fetchWithFallback("/doctor/doctor/sentrequest");
  
      console.log("Fetched Patient Requests:", patientData);
      console.log("Fetched Doctor Requests:", doctorData);
      console.log("Fetched Sent Requests:", sentData);
  
      const pendingPatient = patientData.filter((req) => req.status === "false");
      const acceptedPatient = patientData.filter((req) => req.status === "true");
      setPatientRequests(pendingPatient);
      setAcceptedPatientRequests(acceptedPatient);
  
      const pendingDoctor = doctorData.filter((req) => req.status === "false");
      const acceptedDoctor = doctorData.filter((req) => req.status === "true");
      setDoctorRequests(pendingDoctor);
      setAcceptedDoctorRequests(acceptedDoctor);
  

      const pendingSent = sentData.filter((req) => req.status === "false");
      const acceptedSent = sentData.filter((req) => req.status === "true");
      setSentRequests(pendingSent);
      setAcceptedSentRequests(acceptedSent);
    } catch (error) {
      console.error("Error in request processing:", error);
      toast.error("An error occurred while processing requests.");
    }
  };

  const handleAcceptRequest = async (_id: string, type: string) => {
    try {
      const response = await api.post("/doctor/request/accept", { requestId: _id });
      console.log(`Accepted ${type} Request Response:`, response.data);

      const moveRequest = (
        requests: Request[],
        setRequests: React.Dispatch<React.SetStateAction<Request[]>>,
        setAcceptedRequests: React.Dispatch<React.SetStateAction<Request[]>>
      ) => {
        const acceptedRequest = requests.find((req) => req._id === _id);
        if (!acceptedRequest) return;

        setRequests((prev) => prev.filter((req) => req._id !== _id));
        setAcceptedRequests((prev) => [
          ...prev,
          {
            ...acceptedRequest,
            status: "true",
            addedDate: new Date().toISOString().split("T")[0], // Current Date
            addedTime: new Date().toLocaleTimeString(), // Current Time
          } as Request,
        ]);
      };

      if (type === "patient") moveRequest(patientRequests, setPatientRequests, setAcceptedPatientRequests);
      if (type === "doctor") moveRequest(doctorRequests, setDoctorRequests, setAcceptedDoctorRequests);
      if (type === "sent") moveRequest(sentRequests, setSentRequests, setAcceptedSentRequests);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} request accepted successfully!`);
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error(`Error accepting ${type} request. Please try again.`);
    }
  };

  const renderPatientTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Patient Requests" : "Patient Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Patient ID</th>
              <th className="border p-3 text-left">Patient Name</th>
              <th className="border p-3 text-left">Added Date</th>
              <th className="border p-3 text-left">Added Time</th>
              {!isAccepted && <th className="border p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.patientId}</td>
                <td className="border p-3 text-gray-700">{request.firstName}{request.lastName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "patient")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted patient" : "patient"} requests.
        </p>
      )}
    </div>
  );

  const renderDoctorTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Doctor Requests" : "Doctor Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Doctor ID</th>
              <th className="border p-3 text-left">Doctor Name</th>
              <th className="border p-3 text-left">Added Date</th>
              <th className="border p-3 text-left">Added Time</th>
              {!isAccepted && <th className="border p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.doctorId}</td>
                <td className="border p-3 text-gray-700">{request.firstName} {request.lastName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "doctor")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted doctor" : "doctor"} requests.
        </p>
      )}
    </div>
  );

  const renderSentTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Sent Requests" : "Sent Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Added Date</th>
              <th className="border p-3 text-left">Added Time</th>
              {!isAccepted && <th className="border p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                <td className="border p-3 text-gray-700">{request.secondDoctorId}</td>
                <td className="border p-3 text-gray-700">{request.firstName} {request.lastName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="border p-3">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "sent")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No {isAccepted ? "accepted sent" : "sent"} requests.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      <DoctorSidebar />
      <div className="flex flex-col w-full h-screen bg-gray-100 p-4 overflow-y-auto">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "patient" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("patient")}
          >
            Patient Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "doctor" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "sent" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Requests
          </button>
        </div>

        {activeTab === "patient" && (
          <>
            {renderPatientTable(patientRequests, false)}
            {renderPatientTable(acceptedPatientRequests, true)}
          </>
        )}

        {activeTab === "doctor" && (
          <>
            {renderDoctorTable(doctorRequests, false)}
            {renderDoctorTable(acceptedDoctorRequests, true)}
          </>
        )}

        {activeTab === "sent" && (
          <>
            {renderSentTable(acceptedSentRequests, true)}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorRequestPage;

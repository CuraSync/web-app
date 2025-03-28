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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
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
  
      const pendingPatient = patientData.filter((req: Request) => req.status === "false");
      const acceptedPatient = patientData.filter((req: Request) => req.status === "true");
      setPatientRequests(pendingPatient);
      setAcceptedPatientRequests(acceptedPatient);
  
      const pendingDoctor = doctorData.filter((req: Request) => req.status === "false");
      const acceptedDoctor = doctorData.filter((req: Request) => req.status === "true");
      setDoctorRequests(pendingDoctor);
      setAcceptedDoctorRequests(acceptedDoctor);
  
      const pendingSent = sentData.filter((req: Request) => req.status === "false");
      const acceptedSent = sentData.filter((req: Request) => req.status === "true");
      setSentRequests(pendingSent);
      setAcceptedSentRequests(acceptedSent);
    } catch (error) {
      console.error("Error in request processing:", error);
      toast.error("An error occurred while processing requests.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <DoctorSidebar />
        <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-xl w-64 mb-4 animate-pulse"></div>
          </div>
          <div className="flex space-x-4 mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="h-8 bg-gray-200 rounded-xl w-64 mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleAcceptRequest = async (_id: string) => {
    try {
      const response = await api.post("/doctor/request/accept", { requestId: _id });
      const acceptedRequest = sentRequests.find((req) => req._id === _id);
      if (!acceptedRequest) return;

      setSentRequests((prev) => prev.filter((req) => req._id !== _id));
      setAcceptedSentRequests((prev) => [
        ...prev,
        {
          ...acceptedRequest,
          status: "accepted",
          addedDate: new Date().toISOString().split("T")[0],
          addedTime: new Date().toLocaleTimeString(),
        } as Request,
      ]);
      toast.success("Request accepted successfully!");
    } catch (error) {
      toast.error("Error accepting request. Please try again.");
      console.error("Error accepting request:", error);
    }
  };

  const renderPatientTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isAccepted ? "Accepted Patient Requests" : "Pending Patient Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Patient ID</th>
              <th className="p-4 text-left text-blue-600 font-medium">Patient Name</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Time</th>
              {!isAccepted && <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Status</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 text-gray-600">{request.patientId}</td>
                <td className="p-4 text-gray-600">{request.firstName} {request.lastName}</td>
                <td className="p-4 text-gray-600">{request.addedDate}</td>
                <td className="p-4 text-gray-600">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="p-4">
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl text-center text-sm font-medium">
                      Pending
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl">
          No {isAccepted ? "accepted patient" : "pending patient"} requests
        </div>
      )}
    </div>
  );

  const renderDoctorTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isAccepted ? "Accepted Doctor Requests" : "Pending Doctor Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Doctor ID</th>
              <th className="p-4 text-left text-blue-600 font-medium">Doctor Name</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Time</th>
              {!isAccepted && <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 text-gray-600">{request.doctorId}</td>
                <td className="p-4 text-gray-600">{request.firstName} {request.lastName}</td>
                <td className="p-4 text-gray-600">{request.addedDate}</td>
                <td className="p-4 text-gray-600">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="p-4">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Accept Request
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl">
          No {isAccepted ? "accepted doctor" : "pending doctor"} requests
        </div>
      )}
    </div>
  );

  const renderSentTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isAccepted ? "Accepted Sent Requests" : "Pending Sent Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Doctor ID</th>
              <th className="p-4 text-left text-blue-600 font-medium">Doctor Name</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Time</th>
              {!isAccepted && <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Status</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 text-gray-600">{request.secondDoctorId}</td>
                <td className="p-4 text-gray-600">{request.firstName} {request.lastName}</td>
                <td className="p-4 text-gray-600">{request.addedDate}</td>
                <td className="p-4 text-gray-600">{request.addedTime}</td>
                {!isAccepted && (
                  <td className="p-4">
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl text-center text-sm font-medium">
                      Pending
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl">
          No {isAccepted ? "accepted sent" : "pending sent"} requests
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      <DoctorSidebar />
      <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
            Request Management
          </h1>
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "patient"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("patient")}
          >
            New Patient Requests
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "doctor"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("doctor")}
          >
            New Doctor Invites
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "sent"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            New Doctor Requests
          </button>
        </div>

        {activeTab === "patient" && (
          <div className="space-y-8">
            {renderPatientTable(patientRequests, false)}
            {renderPatientTable(acceptedPatientRequests, true)}
          </div>
        )}

        {activeTab === "doctor" && (
          <div className="space-y-8">
            {renderDoctorTable(doctorRequests, false)}
            {renderDoctorTable(acceptedDoctorRequests, true)}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="space-y-8">
            {renderSentTable(sentRequests, false)}
            {renderSentTable(acceptedSentRequests, true)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRequestPage;
"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Sidebar from "../sidebar/sidebar";
import { toast } from "sonner";

interface Request {
  _id: string;
  addedDate: string;
  addedTime: string;
  status: string;
  labId?: string;
  labName?: string;
  pharmacyId?: string;
  pharmacyName?: string;
  doctorId?: string;
  firstName?: string;
  lastName?: string;
}

const PatientRequestPage = () => {
  const [labRequests, setLabRequests] = useState<Request[]>([]);
  const [pharmacyRequests, setPharmacyRequests] = useState<Request[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<Request[]>([]);
  const [acceptedLabRequests, setAcceptedLabRequests] = useState<Request[]>([]);
  const [acceptedPharmacyRequests, setAcceptedPharmacyRequests] = useState<Request[]>([]);
  const [acceptedDoctorRequests, setAcceptedDoctorRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<string>("lab");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const [labRes, pharmacyRes, doctorRes] = await Promise.all([
        api.get("/patient/laboratory/request"),
        api.get("/patient/pharmacy/request"),
        api.get("/patient/doctor/request"),
      ]);

      const pendingLab = labRes.data.filter((req: Request) => req.status === "false");
      const acceptedLab = labRes.data.filter((req: Request) => req.status === "true");

      const pendingPharmacy = pharmacyRes.data.filter((req: Request) => req.status === "false");
      const acceptedPharmacy = pharmacyRes.data.filter((req: Request) => req.status === "true");

      const pendingDoctor = doctorRes.data.filter((req: Request) => req.status === "false");
      const acceptedDoctor = doctorRes.data.filter((req: Request) => req.status === "true");

      setLabRequests(pendingLab);
      setPharmacyRequests(pendingPharmacy);
      setDoctorRequests(pendingDoctor);

      setAcceptedLabRequests(acceptedLab);
      setAcceptedPharmacyRequests(acceptedPharmacy);
      setAcceptedDoctorRequests(acceptedDoctor);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Error fetching requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (_id: string, type: string) => {
    try {
      await api.post("/patient/request/accept", { requestId: _id });
      toast.success("Request accepted successfully");
      
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
            addedDate: new Date().toISOString().split("T")[0],
            addedTime: new Date().toLocaleTimeString(),
          } as Request,
        ]);
      };

      switch (type) {
        case "lab":
          moveRequest(labRequests, setLabRequests, setAcceptedLabRequests);
          break;
        case "pharmacy":
          moveRequest(pharmacyRequests, setPharmacyRequests, setAcceptedPharmacyRequests);
          break;
        case "doctor":
          moveRequest(doctorRequests, setDoctorRequests, setAcceptedDoctorRequests);
          break;
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting request. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
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

  const renderLabTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isAccepted ? "Accepted Laboratory Requests" : "Pending Laboratory Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Lab ID</th>
              <th className="p-4 text-left text-blue-600 font-medium">Lab Name</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Time</th>
              {!isAccepted && <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 text-gray-600">{request.labId}</td>
                <td className="p-4 text-gray-600">{request.labName}</td>
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
          No {isAccepted ? "accepted laboratory" : "pending laboratory"} requests
        </div>
      )}
    </div>
  );

  const renderPharmacyTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-xl shadow-md p-6 mt-4 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isAccepted ? "Accepted Pharmacy Requests" : "Pending Pharmacy Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Pharmacy ID</th>
              <th className="p-4 text-left text-blue-600 font-medium">Pharmacy Name</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
              <th className="p-4 text-left text-blue-600 font-medium">Added Time</th>
              {!isAccepted && <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                <td className="p-4 text-gray-600">{request.pharmacyId}</td>
                <td className="p-4 text-gray-600">{request.pharmacyName}</td>
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
          No {isAccepted ? "accepted pharmacy" : "pending pharmacy"} requests
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
                      onClick={() => handleAcceptRequest(request._id, "doctor")}
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
            Request Management
          </h1>
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "lab"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("lab")}
          >
            Laboratory Requests
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "pharmacy"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("pharmacy")}
          >
            Pharmacy Requests
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "doctor"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Requests
          </button>
        </div>

        {activeTab === "lab" && (
          <div className="space-y-8">
            {renderLabTable(labRequests, false)}
            {renderLabTable(acceptedLabRequests, true)}
          </div>
        )}

        {activeTab === "pharmacy" && (
          <div className="space-y-8">
            {renderPharmacyTable(pharmacyRequests, false)}
            {renderPharmacyTable(acceptedPharmacyRequests, true)}
          </div>
        )}

        {activeTab === "doctor" && (
          <div className="space-y-8">
            {renderDoctorTable(doctorRequests, false)}
            {renderDoctorTable(acceptedDoctorRequests, true)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRequestPage;
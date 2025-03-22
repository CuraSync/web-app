"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Sidebar from "../sidebar/sidebar";

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [labRes, pharmacyRes, doctorRes] = await Promise.all([
        api.get("/patient/laboratory/request"),
        api.get("/patient/pharmacy/request"),
        api.get("/patient/doctor/request"),
      ]);
      console.log("Fetched Laboratory Requests:", labRes.data);
      console.log("Fetched Pharmacy Requests:", pharmacyRes.data);
      console.log("Fetched Doctor Requests:", doctorRes.data);

      // Adjusted for "true" and "false" status
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
    }
  };

  const handleAcceptRequest = async (_id: string, type: string) => {
    try {
      const response = await api.post("/patient/request/accept", { requestId: _id });
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

      if (type === "lab") moveRequest(labRequests, setLabRequests, setAcceptedLabRequests);
      if (type === "pharmacy") moveRequest(pharmacyRequests, setPharmacyRequests, setAcceptedPharmacyRequests);
      if (type === "doctor") moveRequest(doctorRequests, setDoctorRequests, setAcceptedDoctorRequests);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };


  const renderLabTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Laboratory Requests" : "Laboratory Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
            <th className="border p-3 text-left">Lab ID</th>
            <th className="border p-3 text-left">Lab Name</th>
              <th className="border p-3 text-left">Added Date</th>
              <th className="border p-3 text-left">Added Time</th>
            
              {!isAccepted && <th className="border p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                   <td className="border p-3 text-gray-700">{request.labId}</td>
                   <td className="border p-3 text-gray-700">{request.labName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
             
                {!isAccepted && (
                  <td className="border p-3">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "lab")}
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
          No {isAccepted ? "accepted laboratory" : "laboratory"} requests.
        </p>
      )}
    </div>
  );

 
  const renderPharmacyTable = (requests: Request[], isAccepted: boolean) => (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isAccepted ? "Accepted Pharmacy Requests" : "Pharmacy Requests"}
      </h2>
      {requests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
            <th className="border p-3 text-left">Pharmacy ID</th>
            <th className="border p-3 text-left">Pharmacy Name</th>
              <th className="border p-3 text-left">Added Date</th>
              <th className="border p-3 text-left">Added Time</th>
            
              {!isAccepted && <th className="border p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border hover:bg-gray-50">
                 <td className="border p-3 text-gray-700">{request.pharmacyId}</td>
                 <td className="border p-3 text-gray-700">{request.pharmacyName}</td>
                <td className="border p-3 text-gray-700">{request.addedDate}</td>
                <td className="border p-3 text-gray-700">{request.addedTime}</td>
               
                {!isAccepted && (
                  <td className="border p-3">
                    <button
                      onClick={() => handleAcceptRequest(request._id, "pharmacy")}
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
          No {isAccepted ? "accepted pharmacy" : "pharmacy"} requests.
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
                <td className="border p-3 text-gray-700">
                  {request.firstName} {request.lastName}
                </td>
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen bg-gray-100 p-4 overflow-y-auto">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "lab" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("lab")}
          >
            Laboratory Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "pharmacy" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("pharmacy")}
          >
            Pharmacy Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "doctor" ? "bg-blue-700" : "bg-blue-600"
            } text-white hover:bg-blue-700 transition-colors`}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Requests
          </button>
        </div>

        {activeTab === "lab" && (
          <>
            {renderLabTable(labRequests, false)}
            {renderLabTable(acceptedLabRequests, true)}
          </>
        )}

        {activeTab === "pharmacy" && (
          <>
            {renderPharmacyTable(pharmacyRequests, false)}
            {renderPharmacyTable(acceptedPharmacyRequests, true)}
          </>
        )}

        {activeTab === "doctor" && (
          <>
            {renderDoctorTable(doctorRequests, false)}
            {renderDoctorTable(acceptedDoctorRequests, true)}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientRequestPage;
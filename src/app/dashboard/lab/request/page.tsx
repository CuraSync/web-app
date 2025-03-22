"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner"; 
import api from "@/utils/api";
import LabSidebar from "../sidebar/sidebar";

interface Request {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  addedDate: string;
  addedTime: string;
  status: string;
}

const LabRequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Track loading state

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await api.get("/laboratory/patient/request");
      console.log("Fetched Requests:", response.data);

      const pending = response.data.filter(
        (req: Request) => req.status === "pending" || req.status === "false"
      );
      const accepted = response.data.filter(
        (req: Request) => req.status === "accepted" || req.status === "true"
      );

      setRequests(pending);
      setAcceptedRequests(accepted);
    } catch (error) {
      console.error("Request fetching failed:", error);
      toast.error("Error fetching requests. Please try again.");
    } finally {
      setLoading(false);  
    }
  };

  const handleAcceptRequest = async (_id: string) => {
    try {
      const response = await api.post("/laboratory/request/accept", { requestId: _id });
      console.log("Accepted Request Response:", response.data);

      const acceptedRequest = requests.find((req) => req._id === _id);
      if (!acceptedRequest) return;

      setRequests((prev) => prev.filter((req) => req._id !== _id));

      setAcceptedRequests((prev) => [
        ...prev,
        {
          ...acceptedRequest,
          status: "accepted",
          addedDate: new Date().toISOString().split("T")[0], // Current Date
          addedTime: new Date().toLocaleTimeString(), // Current Time
        } as Request,
      ]);
      toast.success("Request accepted successfully!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting request. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <LabSidebar />
      </div>
      <div className="flex flex-col w-full h-screen bg-gray-100 p-4">
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-lg text-gray-500">Loading requests...</span>
          </div>
        ) : (
          <>
            {/* Pending Requests Section */}
            <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Requests</h2>
              {requests.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200 shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Patient ID</th>
                      <th className="border p-3 text-left">Patient Name</th>
                      <th className="border p-3 text-left">Added Date</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id} className="border hover:bg-gray-50">
                        <td className="border p-3 text-gray-700">{request.patientId}</td>
                        <td className="border p-3 text-gray-700">
                          {request.firstName} {request.lastName}
                        </td>
                        <td className="border p-3 text-gray-700">{request.addedDate}</td>
                        <td className="border p-3">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center mt-4">No pending requests.</p>
              )}
            </div>

            {/* Accepted Requests Section */}
            <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Accepted Requests</h2>
              {acceptedRequests.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200 shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Patient ID</th>
                      <th className="border p-3 text-left">Patient Name</th>
                      <th className="border p-3 text-left">Accepted Date</th>
                      <th className="border p-3 text-left">Accepted Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedRequests.map((request) => (
                      <tr key={request._id} className="border hover:bg-gray-50">
                        <td className="border p-3 text-gray-700">{request.patientId}</td>
                        <td className="border p-3 text-gray-700">
                          {request.firstName} {request.lastName}
                        </td>
                        <td className="border p-3 text-gray-700">{request.addedDate}</td>
                        <td className="border p-3 text-gray-700">{request.addedTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center mt-4">No accepted requests.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LabRequestPage;

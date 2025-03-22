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
  const [loading, setLoading] = useState<boolean>(false);  

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);  
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
        <LabSidebar />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
  
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-lg text-gray-500">Loading requests...</span>
            <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Requests</h2>
              {requests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 shadow-md">
                    <thead>
                      <tr className="bg-blue-50 text-gray-700">
                        <th className="border p-4 text-left font-medium">Patient ID</th>
                        <th className="border p-4 text-left font-medium">Patient Name</th>
                        <th className="border p-4 text-left font-medium">Added Date</th>
                        <th className="border p-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request._id} className="border hover:bg-blue-50 transition-colors">
                          <td className="border p-4 text-gray-700">{request.patientId}</td>
                          <td className="border p-4 text-gray-700">
                            {request.firstName} {request.lastName}
                          </td>
                          <td className="border p-4 text-gray-700">{request.addedDate}</td>
                          <td className="border p-4">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-4">No pending requests.</p>
              )}
            </div>

            {/* Accepted Requests Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accepted Requests</h2>
              {acceptedRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 shadow-md">
                    <thead>
                      <tr className="bg-blue-50 text-gray-700">
                        <th className="border p-4 text-left font-medium">Patient ID</th>
                        <th className="border p-4 text-left font-medium">Patient Name</th>
                        <th className="border p-4 text-left font-medium">Accepted Date</th>
                        <th className="border p-4 text-left font-medium">Accepted Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptedRequests.map((request) => (
                        <tr key={request._id} className="border">
                          <td className="border p-4 text-gray-700">{request.patientId}</td>
                          <td className="border p-4 text-gray-700">
                            {request.firstName} {request.lastName}
                          </td>
                          <td className="border p-4 text-gray-700">{request.addedDate}</td>
                          <td className="border p-4 text-gray-700">{request.addedTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

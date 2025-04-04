"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import PharmacySidebar from "../sidebar/sidebar";
import { toast } from "sonner";

interface Request {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  addedDate: string;
  addedTime: string;
  status: string;
}

const PharmacyRequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Pharmacy Requests | CuraSync";
      }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pharmacy/patient/request");

      if (!response.data || !Array.isArray(response.data)) {
        setRequests([]);
        setAcceptedRequests([]);
        return;
      }

      const pending = response.data.filter(
        (req: Request) => req.status === "pending" || req.status === "false"
      );
      const accepted = response.data.filter(
        (req: Request) => req.status === "accepted" || req.status === "true"
      );

      setRequests(pending);
      setAcceptedRequests(accepted);
    } catch (error: any) {

      if (error.response && error.response.status === 404) {
        setRequests([]);
        setAcceptedRequests([]);
      } else {
        console.error("Error fetching requests:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (_id: string) => {
    try {
      await api.post("/pharmacy/request/accept", { requestId: _id });
      const acceptedRequest = requests.find((req) => req._id === _id);
      if (!acceptedRequest) return;

      setRequests((prev) => prev.filter((req) => req._id !== _id));
      setAcceptedRequests((prev) => [
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
        <PharmacySidebar />
      </div>
        <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-xl w-64 mb-4 animate-pulse"></div>
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
    <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
      <PharmacySidebar />
    </div>
      <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
            Request Management
          </h1>
        </div>

        <div className="space-y-8">
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Requests</h2>
            {requests.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Patient ID</th>
                    <th className="p-4 text-left text-blue-600 font-medium">Patient Name</th>
                    <th className="p-4 text-left text-blue-600 font-medium">Added Date</th>
                    <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="p-4 text-gray-600">{request.patientId}</td>
                      <td className="p-4 text-gray-600">{request.firstName} {request.lastName}</td>
                      <td className="p-4 text-gray-600">{request.addedDate}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                          Accept Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl">
                No pending requests
              </div>
            )}
          </div>

          {/* Accepted Requests */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Accepted Requests</h2>
            {acceptedRequests.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-4 text-left text-blue-600 font-medium rounded-tl-xl">Patient ID</th>
                    <th className="p-4 text-left text-blue-600 font-medium">Patient Name</th>
                    <th className="p-4 text-left text-blue-600 font-medium">Accepted Date</th>
                    <th className="p-4 text-left text-blue-600 font-medium rounded-tr-xl">Accepted Time</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedRequests.map((request) => (
                    <tr key={request._id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="p-4 text-gray-600">{request.patientId}</td>
                      <td className="p-4 text-gray-600">{request.firstName} {request.lastName}</td>
                      <td className="p-4 text-gray-600">{request.addedDate}</td>
                      <td className="p-4 text-gray-600">{request.addedTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl">
                No accepted requests
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRequestPage;
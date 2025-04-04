"use client";
import React, { useEffect, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

interface Laboratory {
  id: string;
  labId: string;
  labName: string;
  email: string;
  location: string;
  addedDate: string;
  addedTime: string;
}

const LaboratoryPage = () => {
  const router = useRouter();
  const [addedLaboratories, setAddedLaboratories] = useState<Laboratory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [labIdInput, setLabIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const ListFetchHomeData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/patient/laboratories");
      setLaboratories(response.data as Laboratory[]);
      console.log("Laboratories data:", response.data);
      setError(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "No Laboratories Found",
            text: "There are no laboratories available at the moment.",
            icon: "info",
            confirmButtonText: "OK",
          });
          setLaboratories([]);
        } else {
          setError("Failed to load laboratories. Please try again.");
          console.error("Error fetching laboratories:", error.message, error.stack);
        }
      } else {
        setError("An unexpected error occurred while fetching laboratories.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddedLaboratories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/patient/laboratories");
      setAddedLaboratories(response.data as Laboratory[]);
      console.log("Added laboratories:", response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "No Laboratories Found",
            text: "There are no added laboratories available.",
            icon: "info",
            confirmButtonText: "OK",
          });
          setAddedLaboratories([]);
        } else {
          setError("Failed to load added laboratories.");
          console.error("Error fetching added laboratories:", error.message, error.stack);
        }
      } else {
        setError("An unexpected error occurred while fetching added laboratories.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Patient Lab | CuraSync";
    ListFetchHomeData();
    fetchAddedLaboratories();
  }, []);

  const filteredLaboratories = laboratories.filter((laboratory) =>
    laboratory.labName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    laboratory.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLaboratory = async () => {
    if (!labIdInput) {
      setError("Please enter a valid Lab ID.");
      return;
    }

    if (addedLaboratories.some((lab) => lab.labId === labIdInput)) {
      setError("This laboratory has already been added.");
      return;
    }

    const now = new Date();
    const addedDate = now.toISOString().split("T")[0];
    const addedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    try {
      setIsLoading(true);
      const payload = {
        labId: labIdInput,
        addedDate: addedDate,
        addedTime: addedTime,
      };
      console.log("Sending request with payload:", payload);
      const response = await api.post("/laboratory/request", payload);
      console.log("Request sent successfully:", response.data);

      const newLab: Laboratory = {
        id: response.data.id || "unknown",
        labId: response.data.labId || labIdInput,
        labName: response.data.labName || "Unknown Lab",
        email: response.data.email || "N/A",
        location: response.data.location || "Unknown Location",
        addedDate: response.data.addedDate || addedDate,
        addedTime: response.data.addedTime || addedTime,
      };

      setAddedLaboratories((prev) => [...prev, newLab]);

      Swal.fire({
        title: "Request successfully sent.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setShowPopup(false);
      setLabIdInput("");
      setError(null);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error sending request:",
          error.response?.status,
          error.response?.data,
          error.message
        );
        if (error.response?.status === 409) {
          setError("This laboratory request already exists.");
        } else {
          setError(error.response?.data?.message || "Failed to send request. Please try again.");
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = (labId: string) => {
    router.push(`/dashboard/patient/laboratory/message?labId=${labId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col gap-4">
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-3 bg-blue-500 text-white font-medium rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors w-fit disabled:bg-blue-300"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5" />
              Add Laboratory
            </button>
            <input
              type="text"
              placeholder="Search laboratories by name or location..."
              className="p-2 border rounded-lg w-full max-w-md disabled:bg-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold p-4 border-b">Selected Laboratories</h2>
            {isLoading ? (
              <div className="divide-y">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : addedLaboratories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No laboratories selected yet.
              </div>
            ) : (
              <div className="divide-y">
                {filteredLaboratories.map((laboratory) => (
                  <div
                    key={laboratory.labId}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{laboratory.labName}</h3>
                      <p className="text-sm text-gray-500">{laboratory.location}</p>
                      <p className="text-xs text-gray-400">
                        Added: {laboratory.addedDate} at {laboratory.addedTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMessageClick(laboratory.labId)}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                        disabled={isLoading}
                      >
                        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Enter Laboratory ID</h2>
            <input
              type="text"
              placeholder="Lab ID"
              className="w-full p-2 border rounded-lg mb-4 disabled:bg-gray-100"
              value={labIdInput}
              onChange={(e) => setLabIdInput(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLaboratory}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryPage;
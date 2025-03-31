"use client";
import React, { useEffect, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import api from "@/utils/api";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

interface Pharmacy {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  email: string;
  location: string;
  addedDate: string;
  addedTime: string;
}

const PharmacyPage = () => {
  const router = useRouter();
  const [addedPharmacies, setAddedPharmacies] = useState<Pharmacy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pharmacyIdInput, setPharmacyIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPharmacies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/patient/pharmacies");
      setAddedPharmacies(response.data as Pharmacy[]);
      setError(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "No Pharmacies Found",
            text: "There are no pharmacies available at the moment.",
            icon: "info",
            confirmButtonText: "OK",
          });
          setAddedPharmacies([]);
        } else {
          setError("Failed to load pharmacies. Please try again.");
          console.error("Error fetching pharmacies:", error.message, error.stack);
        }
      } else {
        setError("An unexpected error occurred while fetching pharmacies.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddedPharmacies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/patient/pharmacies");
      setAddedPharmacies(response.data as Pharmacy[]);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "No Pharmacies Found",
            text: "There are no added pharmacies available.",
            icon: "info",
            confirmButtonText: "OK",
          });
          setAddedPharmacies([]);
        } else {
          setError("Failed to load added pharmacies.");
          console.error("Error fetching added pharmacies:", error.message, error.stack);
        }
      } else {
        setError("An unexpected error occurred while fetching added pharmacies.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Patient Pharmacy | CuraSync";
    fetchPharmacies();
  }, []);

  const handleAddPharmacy = async () => {
    if (!pharmacyIdInput) {
      setError("Please enter a valid Pharmacy ID.");
      return;
    }

    if (addedPharmacies.some((pharmacy) => pharmacy.pharmacyId === pharmacyIdInput)) {
      setError("This pharmacy has already been added.");
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
        pharmacyId: pharmacyIdInput,
        addedDate: addedDate,
        addedTime: addedTime,
      };
      
      await api.post("/pharmacy/request", payload);

      Swal.fire({
        title: "Request successfully sent.",
        icon: "success",
        confirmButtonText: "OK",
      });

      await fetchAddedPharmacies();
      
      setShowPopup(false);
      setPharmacyIdInput("");
      setError(null);
    } catch (error) {
      let errorMessage = "Failed to send request. Please try again.";
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          errorMessage = "This pharmacy request already exists.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
        console.error("Error adding pharmacy:", error.message, error.stack);
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Unexpected error:", error);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = (pharmacyId: string) => {
    router.push(`/dashboard/patient/pharmacy/message?pharmacyId=${pharmacyId}`);
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
          <div className="mb-8">
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-3 bg-blue-500 text-white font-medium rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5" />
              Add Pharmacy
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold p-4 border-b">Selected Pharmacies</h2>
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
            ) : addedPharmacies.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No pharmacies selected yet.
              </div>
            ) : (
              <div className="divide-y">
                {addedPharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.pharmacyId}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{pharmacy.pharmacyName}</h3>
                      <p className="text-sm text-gray-500">{pharmacy.location}</p>
                      <p className="text-xs text-gray-400">
                        Added: {pharmacy.addedDate} at {pharmacy.addedTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMessageClick(pharmacy.pharmacyId)}
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
            <h2 className="text-lg font-semibold mb-4">Enter Pharmacy ID</h2>
            <input
              type="text"
              placeholder="Pharmacy ID"
              className="w-full p-2 border rounded-lg mb-4 disabled:bg-gray-100"
              value={pharmacyIdInput}
              onChange={(e) => setPharmacyIdInput(e.target.value)}
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
                onClick={handleAddPharmacy}
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

export default PharmacyPage;
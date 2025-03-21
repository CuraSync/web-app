"use client";
import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import api from "@/utils/api";

interface Pharmacy {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  email: string;
  licenceNumber: string;
  phoneNumber: string;
  location: string;
  description: string;
  rating: string;
}

const PharmacyPage = () => {
  const router = useRouter();
  const [addedPharmacies, setAddedPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [pharmacyIdInput, setPharmacyIdInput] = useState('');

 
  const [error, setError] = useState<string | null>(null);

  const ListFetchHomeData = async () => {
    try {
      const response = await api.get("/patient/pharmacies");
     
      setPharmacies(response.data)
      console.log(response);
      setError(null);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setError("Failed to load pharmacies. Please try again.");
    }
  };

  useEffect(() => {
    ListFetchHomeData();
  }, []);

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.pharmacyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPharmacy = async () => {
    if (!pharmacyIdInput) return;

    try {
      const response = await api.post("/patient/pharmacy/request", { pharmacyId: pharmacyIdInput });
      console.log("Request sent successfully:", response.data);
      setShowPopup(false);
      setPharmacyIdInput('');
    } catch (error) {
      console.error("Error sending request:", error);
      setError("Failed to send request. Please try again.");
    }
  };

  const handleRemovePharmacy = (pharmacyId: string) => {
    setAddedPharmacies(addedPharmacies.filter(pharmacy => pharmacy.pharmacyId !== pharmacyId));
  };

  const handleMessageClick = (pharmacyId: string) => {
    router.push(`/dashboard/patient/pharmacy/message?pharmacyId=${pharmacyId}`)
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Add Pharmacy Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-3 bg-blue-500 text-white font-medium rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Pharmacy
            </button>

            {/* Available Pharmacies */}
            {/* {searchQuery && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold p-4 border-b">Search Results</h2>
                {filteredPharmacies.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No pharmacies found matching your search.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredPharmacies.map(pharmacy => (
                      <div key={pharmacy.id || pharmacy.pharmacyId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium">{pharmacy.pharmacyName}</h3>
                          <p className="text-sm text-gray-500">{pharmacy.location}</p>
                        </div>
                      
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )} */}

            {/* Selected Pharmacies */}
            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold p-4 border-b">Selected Pharmacies</h2>
              {addedPharmacies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No pharmacies selected yet.
                </div>
              ) : (
                <div className="divide-y">
                  {addedPharmacies.map(pharmacy => (
                    <div key={pharmacy.id || pharmacy.pharmacyId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-medium">{pharmacy.pharmacyName}</h3>
                        <p className="text-sm text-gray-500">{pharmacy.location}</p>
                        <p className="text-sm text-gray-500">{pharmacy.licenceNumber}</p>
                        <p className="text-sm text-gray-500">{pharmacy.phoneNumber}</p>
                        <p className="text-sm text-gray-500">{pharmacy.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMessageClick(pharmacy.pharmacyId)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                        >
                          <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleRemovePharmacy(pharmacy.pharmacyId)}
                          className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popup Form */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Enter Pharmacy ID</h2>
              <input
                type="text"
                placeholder="Pharmacy ID"
                className="w-full p-2 border rounded-lg mb-4"
                value={pharmacyIdInput}
                onChange={(e) => setPharmacyIdInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAddPharmacy}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyPage;
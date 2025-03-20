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
 
  const [error, setError] = useState<string | null>(null);

  const ListFetchHomeData = async () => {
    try {
      const response = await api.get("/patient/pharmacies");
      // const fetchedPharmacies = response.data as Pharmacy[];
      // setPharmacies(fetchedPharmacies);
      // console.log("Fetched Pharmacies:", fetchedPharmacies); // Debug: Check the data
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

  const handleAddPharmacy = (pharmacy: Pharmacy) => {
    if (pharmacy && !addedPharmacies.some(p => p.pharmacyId === pharmacy.pharmacyId)) {
      setAddedPharmacies([...addedPharmacies, pharmacy]);
      setSearchQuery('');
    }
  };

  const handleRemovePharmacy = (pharmacyId: string) => {
    setAddedPharmacies(addedPharmacies.filter(pharmacy => pharmacy.pharmacyId !== pharmacyId));
  };

  const handleMessageClick = () => {
    router.push('/dashboard/patient/message');
  };



  return (
    <div className="min-h-screen flex bg-gray-50">
    <Sidebar />
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar with Add Button */}
        <div className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search pharmacies by name or address..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              onClick={() => filteredPharmacies.length > 0 && handleAddPharmacy(filteredPharmacies[0])}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={filteredPharmacies.length === 0}
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>


        {/* Available Pharmacies */}
        {searchQuery && (
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
        )}


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
                      onClick={handleMessageClick}
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
  </div>


  );
};

export default PharmacyPage;

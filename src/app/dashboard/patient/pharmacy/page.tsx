"use client";
import React, { use, useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import api from "@/utils/api";

const PharmacyPage = () => {
  const router = useRouter();
  const [addedPharmacies, setAddedPharmacies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const[pharmacies, setpharmacies] = useState<any[]>([]);
  


  const ListFetchHomeData = async () => {
    try {
      const response = await api.get("/patient/pharmacies");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    ListFetchHomeData();
  }, []);

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPharmacy = () => {
    // Only add the first filtered pharmacy if it exists and hasn't been added yet
    if (filteredPharmacies.length > 0) {
      const pharmacyToAdd = filteredPharmacies[0];
      if (!addedPharmacies.some(p => p.id === pharmacyToAdd.id)) {
        setAddedPharmacies([...addedPharmacies, pharmacyToAdd]);
        setSearchQuery(''); // Clear search after adding
      }
    }
  };

  const handleRemovePharmacy = (pharmacyId: number) => {
    setAddedPharmacies(addedPharmacies.filter(pharmacy => pharmacy.id !== pharmacyId));
  };

  const handleMessageClick = () => {
    router.push('/dashboard/patient/message');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
                onClick={handleAddPharmacy}
                disabled={filteredPharmacies.length === 0 || addedPharmacies.some(p => p.id === filteredPharmacies[0]?.id)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  filteredPharmacies.length === 0 || addedPharmacies.some(p => p.id === filteredPharmacies[0]?.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Available Pharmacies */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="divide-y">
                {filteredPharmacies.map(pharmacy => (
                  <div key={pharmacy.id} className="p-4 hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{pharmacy.name}</h3>
                      <p className="text-sm text-gray-500">{pharmacy.address}</p>
                      <p className="text-sm text-gray-500">Owner: {pharmacy.patientName}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

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
                  <div key={pharmacy.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{pharmacy.name}</h3>
                      <p className="text-sm text-gray-500">{pharmacy.address}</p>
                      <p className="text-sm text-gray-500">Owner: {pharmacy.patientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleMessageClick}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                      >
                        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleRemovePharmacy(pharmacy.id)}
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
}

export default PharmacyPage;
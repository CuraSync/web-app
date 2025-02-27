"use client";
import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';

const PharmacyPage = () => {
  const router = useRouter();
  const [addedPharmacies, setAddedPharmacies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pharmacies = [
    {
      id: 1,
      name: "MedPlus Pharmacy",
      address: "123 Healthcare Ave, Medical District",
      patientName: "Sarah Johnson",
      hasMessage: true
    },
    {
      id: 2,
      name: "HealthCare Pharmacy",
      address: "456 Wellness Blvd, Central Square",
      patientName: "Sarah Johnson",
      hasMessage: true
    },
    {
      id: 3,
      name: "CityMed Drugstore",
      address: "789 Medicine Lane, Uptown",
      patientName: "Sarah Johnson",
      hasMessage: false
    },
    {
      id: 4,
      name: "QuickRx Pharmacy",
      address: "101 Health Street, Downtown",
      patientName: "Sarah Johnson",
      hasMessage: true
    },
    {
      id: 5,
      name: "Wellness Pharmacy",
      address: "202 Care Road, Westside",
      patientName: "Sarah Johnson",
      hasMessage: false
    }
  ];

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter added pharmacies based on search query
  const filteredAddedPharmacies = addedPharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPharmacy = (pharmacy: any) => {
    if (!addedPharmacies.some(p => p.id === pharmacy.id)) {
      setAddedPharmacies([...addedPharmacies, pharmacy]);
    }
  };

  const handleRemovePharmacy = (pharmacyId: number) => {
    setAddedPharmacies(addedPharmacies.filter(pharmacy => pharmacy.id !== pharmacyId));
  };

  const handleMessageClick = () => {
    router.push('/dashboard/patient/message');
  };

  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pharmacies by name or address..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* All Pharmacies Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Pharmacies</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
              <div>Pharmacy Name</div>
              <div>Address</div>
              <div>Owner's Name</div>
              <div className="text-center">Actions</div>
            </div>

            {filteredPharmacies.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pharmacies found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPharmacies.map((pharmacy) => (
                  <div 
                    key={pharmacy.id}
                    className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="font-medium text-gray-900">{pharmacy.name}</div>
                    <div className="text-gray-600">{pharmacy.address}</div>
                    <div className="text-gray-600">{pharmacy.patientName}</div>
                    <div className="flex justify-center space-x-2">
                      
                      <button 
                        onClick={() => handleAddPharmacy(pharmacy)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Pharmacies Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Pharmacies</h2>
          {addedPharmacies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">You haven't added any pharmacies yet.</p>
            </div>
          ) : filteredAddedPharmacies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No added pharmacies match your search.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
                <div>Pharmacy Name</div>
                <div>Address</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredAddedPharmacies.map((pharmacy) => (
                  <div 
                    key={pharmacy.id}
                    className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="font-medium text-gray-900">{pharmacy.name}</div>
                    <div className="text-gray-600">{pharmacy.address}</div>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={handleMessageClick}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                      >
                        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleRemovePharmacy(pharmacy.id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors group"
                      >
                        <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;
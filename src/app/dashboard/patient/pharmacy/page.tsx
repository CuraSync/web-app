"use client";
import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';

const PharmacyPage = () => {
  const pharmacies = [
    {
      name: "MedPlus Pharmacy",
      address: "123 Healthcare Ave, Medical District",
      patientName: "Sarah Johnson",
      hasMessage: true
    },
    {
      name: "HealthCare Pharmacy",
      address: "456 Wellness Blvd, Central Square",
      patientName: "Sarah Johnson",
      hasMessage: true
    },
    {
      name: "CityMed Drugstore",
      address: "789 Medicine Lane, Uptown",
      patientName: "Sarah Johnson",
      hasMessage: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
          <div>Pharmacy Name</div>
          <div>Address</div>
          <div>Patient's Name</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="divide-y divide-gray-200">
          {pharmacies.map((pharmacy, index) => (
            <div 
              key={index}
              className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
            >
              <div className="font-medium text-gray-900">{pharmacy.name}</div>
              <div className="text-gray-600">{pharmacy.address}</div>
              <div className="text-gray-600">{pharmacy.patientName}</div>
              <div className="flex justify-center space-x-2">
                <button className="p-2 rounded-full hover:bg-blue-100 transition-colors group">
                  <MessageSquare className={`w-5 h-5 ${
                    pharmacy.hasMessage ? 'text-blue-500' : 'text-gray-400'
                  } group-hover:text-blue-600`} />
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;
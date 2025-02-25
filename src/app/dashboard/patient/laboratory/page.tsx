"use client";
import React from 'react';
import { MessageSquare, Clock, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar'; // Ensure the import path is correct

const LaboratoryPage = () => {
  const router = useRouter();
  const laboratories = [
    {
      id: '1',
      name: 'Lab A',
      specialty: 'Pathology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '09:00 AM',
      hasMessage: true
    },
    {
      id: '2',
      name: 'Lab B',
      specialty: 'Microbiology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '10:30 AM',
      hasMessage: true
    },
    {
      id: '3',
      name: 'Lab C',
      specialty: 'Radiology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '11:45 AM',
      hasMessage: false
    },
    {
      id: '4',
      name: 'Lab D',
      specialty: 'Biochemistry',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '02:15 PM',
      hasMessage: true
    }
  ];

  const handleAddClick = () => {
    router.push('/dashboard/patient/message');
  };
  
  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar /> {/* Use the Sidebar component here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
            <div>Laboratory Name</div>
            <div>Name & Specialty</div>
            <div>Available Time</div>
            <div className="text-center">Messaging</div>
            <div className="text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {laboratories.map((laboratory) => (
              <div 
                key={laboratory.id}
                className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {laboratory.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{laboratory.name}</div>
                  <div className="text-sm text-gray-500">{laboratory.specialty}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{laboratory.availableTime}</span>
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => router.push('/dashboard/patient/message')}
                    className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                  >
                    <MessageSquare className={`w-5 h-5 ${
                      laboratory.hasMessage ? 'text-blue-500' : 'text-gray-400'
                    } group-hover:text-blue-600`} />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryPage;
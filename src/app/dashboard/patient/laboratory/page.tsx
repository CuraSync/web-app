"use client";
import React, { useState } from 'react';
import { MessageSquare, Clock, Plus, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';

const LaboratoryPage = () => {
  const router = useRouter();
  const [addedLaboratories, setAddedLaboratories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const laboratories = [
    {
      id: '1',
      name: 'Lab A',
      specialty: 'Pathology',
      address: '123 Medical Center, Downtown',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '09:00 AM',
      hasMessage: true
    },
    {
      id: '2',
      name: 'Lab B',
      specialty: 'Microbiology',
      address: '456 Health Street, Uptown',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '10:30 AM',
      hasMessage: true
    },
    {
      id: '3',
      name: 'Lab C',
      specialty: 'Radiology',
      address: '789 Wellness Avenue, Midtown',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '11:45 AM',
      hasMessage: false
    },
    {
      id: '4',
      name: 'Lab D',
      specialty: 'Biochemistry',
      address: '101 Care Boulevard, Westside',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '02:15 PM',
      hasMessage: true
    },
    {
      id: '5',
      name: 'Lab E',
      specialty: 'Hematology',
      address: '202 Treatment Road, Eastside',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '03:30 PM',
      hasMessage: false
    }
  ];

  // Filter laboratories based on search query
  const filteredLaboratories = laboratories.filter(lab => 
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter added laboratories based on search query
  const filteredAddedLaboratories = addedLaboratories.filter(lab => 
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLaboratory = (laboratory: any) => {
    if (!addedLaboratories.some(lab => lab.id === laboratory.id)) {
      setAddedLaboratories([...addedLaboratories, laboratory]);
    }
  };

  const handleRemoveLaboratory = (laboratoryId: string) => {
    setAddedLaboratories(addedLaboratories.filter(laboratory => laboratory.id !== laboratoryId));
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
              placeholder="Search laboratories by name, specialty, or address..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* All Laboratories Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Laboratories</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
              <div>Laboratory Name</div>
              <div>Name & Specialty</div>
              <div>Available Time</div>
              
              <div className="text-center">Actions</div>
            </div>

            {filteredLaboratories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No laboratories found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLaboratories.map((laboratory) => (
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
                        onClick={() => handleAddLaboratory(laboratory)}
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

        {/* My Laboratories Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Laboratories</h2>
          {addedLaboratories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">You haven't added any laboratories yet.</p>
            </div>
          ) : filteredAddedLaboratories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No added laboratories match your search.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
                <div>Laboratory Name</div>
                <div>Address</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredAddedLaboratories.map((laboratory) => (
                  <div 
                    key={laboratory.id}
                    className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{laboratory.name}</div>
                      <div className="text-sm text-gray-500">{laboratory.specialty}</div>
                    </div>
                    <div className="text-gray-600">{laboratory.address}</div>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={handleMessageClick}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                      >
                        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleRemoveLaboratory(laboratory.id)}
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

export default LaboratoryPage;
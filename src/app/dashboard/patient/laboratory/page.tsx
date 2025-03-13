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
      availableTime: '09:00 AM',
      hasMessage: true
    },
    {
      id: '2',
      name: 'Lab B',
      specialty: 'Microbiology',
      address: '456 Health Street, Uptown',
      availableTime: '10:30 AM',
      hasMessage: true
    },
    {
      id: '3',
      name: 'Lab C',
      specialty: 'Radiology',
      address: '789 Wellness Avenue, Midtown',
      availableTime: '11:45 AM',
      hasMessage: false
    },
    {
      id: '4',
      name: 'Lab D',
      specialty: 'Biochemistry',
      address: '101 Care Boulevard, Westside',
      availableTime: '02:15 PM',
      hasMessage: true
    },
    {
      id: '5',
      name: 'Lab E',
      specialty: 'Hematology',
      address: '202 Treatment Road, Eastside',
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

  const handleAddLaboratory = () => {
    // Only add the first filtered laboratory if it exists and hasn't been added yet
    if (filteredLaboratories.length > 0) {
      const labToAdd = filteredLaboratories[0];
      if (!addedLaboratories.some(lab => lab.id === labToAdd.id)) {
        setAddedLaboratories([...addedLaboratories, labToAdd]);
        setSearchQuery(''); // Clear search after adding
      }
    }
  };

  const handleRemoveLaboratory = (laboratoryId: string) => {
    setAddedLaboratories(addedLaboratories.filter(lab => lab.id !== laboratoryId));
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
                  placeholder="Search laboratories by name, specialty, or address..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
              <button
                onClick={handleAddLaboratory}
                disabled={filteredLaboratories.length === 0 || addedLaboratories.some(lab => lab.id === filteredLaboratories[0]?.id)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  filteredLaboratories.length === 0 || addedLaboratories.some(lab => lab.id === filteredLaboratories[0]?.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Available Laboratories */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold p-4 border-b">Available Laboratories</h2>
            {filteredLaboratories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No laboratories found matching your search.
              </div>
            ) : (
              <div className="divide-y">
                {filteredLaboratories.map(laboratory => (
                  <div key={laboratory.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold mr-4">
                        {laboratory.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{laboratory.name}</h3>
                            <p className="text-sm text-gray-500">{laboratory.specialty}</p>
                            <p className="text-sm text-gray-500">{laboratory.address}</p>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{laboratory.availableTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Laboratories */}
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold p-4 border-b">Selected Laboratories</h2>
            {addedLaboratories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No laboratories selected yet.
              </div>
            ) : (
              <div className="divide-y">
                {addedLaboratories.map(laboratory => (
                  <div key={laboratory.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold mr-4">
                        {laboratory.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{laboratory.name}</h3>
                        <p className="text-sm text-gray-500">{laboratory.specialty}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{laboratory.availableTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleMessageClick}
                        className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                      >
                        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveLaboratory(laboratory.id)}
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

export default LaboratoryPage;







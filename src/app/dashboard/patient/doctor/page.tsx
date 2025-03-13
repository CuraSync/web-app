"use client";
import React, { useState } from 'react';
import { MessageCircle, Calendar, User, Search, List, Grid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar'; // Import the Sidebar component


const DoctorSearch = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');

  const doctors = [
    {
      id: 1,
      name: "Dr. James Bond",
      type: "Neurologist",
      experience: "15 years experience",
      rating: 4.8,
      availability: ["Mon", "Wed", "Fri"],
      lastVisit: "04/10/2023"
    },
    {
      id: 2,
      name: "Dr. Sarah Jhons",
      type: "Surgeon",
      experience: "12 years experience",
      rating: 4.9,
      availability: ["Tue", "Thu", "Sat"],
      lastVisit: "04/10/2023"
    },
    {
      id: 3,
      name: "Dr. Aseem Naizer",
      type: "Oncologist",
      experience: "10 years experience",
      rating: 4.7,
      availability: ["Mon", "Thu", "Fri"],
      lastVisit: "04/10/2023"
    },
    {
      id: 4,
      name: "Dr. Travis Oman",
      type: "Dentist",
      experience: "8 years experience",
      rating: 4.6,
      availability: ["Wed", "Thu", "Sat"],
      lastVisit: "04/10/2023"
    },
    {
      id: 5,
      name: "Dr. Vivian Moner",
      type: "Ophthalmologist",
      experience: "14 years experience",
      rating: 4.8,
      availability: ["Mon", "Tue", "Fri"],
      lastVisit: "04/10/2023"
    }
  ];

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.experience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = () => {
    router.push('/dashboard/patient/message');
  };

  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Find a Doctor</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors by name, specialty..."
                className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded flex items-center ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded flex items-center ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No doctors found matching your search.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                    {doctor.name.split(' ')[1][0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.type}</p>
                    <p className="text-gray-500 text-sm">{doctor.experience}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">Available:</p>
                  <div className="flex space-x-2 mt-1">
                    {doctor.availability.map(day => (
                      <span key={day} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{doctor.rating}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleMessageClick}
                      className="p-2 hover:bg-gray-100 rounded-full flex items-center"
                    >
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-gray-600">Doctor's Name</th>
                  <th className="px-6 py-3 text-left text-gray-600">Doctor's Type</th>
                  <th className="px-6 py-3 text-left text-gray-600">Last Visit</th>
                  <th className="px-6 py-3 text-left text-gray-600">Messaging</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doctor => (
                  <tr key={doctor.id} className="border-t">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          {doctor.name.split(' ')[1][0]}
                        </div>
                        {doctor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{doctor.type}</td>
                    <td className="px-6 py-4">{doctor.lastVisit}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={handleMessageClick}
                        className="p-2 hover:bg-gray-100 rounded-full flex items-center"
                      >
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorSearch;
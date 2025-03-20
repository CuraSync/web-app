"use client";
import React, { useState } from 'react';
import { MessageCircle, Calendar, User, Search, List, Grid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import api from "@/utils/api";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  availability: string[];
  lastVisit: string;
  doctorId: string; // Use doctor's ID for messaging
}

const DoctorSearch = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const response = await api.get("/patient/doctors")
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };


  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (doctorId: string) => {
    router.push(`/dashboard/patient/doctor/message?doctorId=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* ... (keep the existing header and search/ui controls) ... */}
        
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
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
                {/* ... (keep the existing availability and rating section) ... */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{doctor.rating}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleMessageClick(doctor.doctorId)}
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
                  <th className="px-6 py-3 text-left text-gray-600">Specialization</th>
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
                    <td className="px-6 py-4">{doctor.specialization}</td>
                    <td className="px-6 py-4">{doctor.lastVisit}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleMessageClick(doctor.doctorId)}
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

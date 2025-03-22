"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import api from '@/utils/api';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface DoctorStats {
  totalPatients: number;
  newPatients: number;
  appointments: number;
  appointmentChange: number;
  rating: number;
  reviews: number;
}

const DoctorDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [stats, setStats] = useState<DoctorStats>({
    totalPatients: 0,
    newPatients: 0,
    appointments: 0,
    appointmentChange: 0,
    rating: 0,
    reviews: 0
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
      return;
    }

    fetchDoctorData();
  }, [router]);

  const fetchDoctorData = async () => {
    try {
      const response = await api.get('/doctor/home');
      setDoctorData(response.data);
      setStats({
        totalPatients: 24,
        newPatients: 3,
        appointments: 156,
        appointmentChange: 5,
        rating: parseFloat(response.data.rating) || 4.8,
        reviews: 450
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch doctor data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <DoctorSidebar />
      
      <div className="flex-1">
        <main className="p-6">
          {/* Added Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          </div>

          {/* Added Profile Preview Section */}
          {doctorData && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <div className="flex items-center pb-6 border-b border-gray-200">
                {doctorData.profilePic ? (
                  <img 
                    src={doctorData.profilePic} 
                    alt={doctorData.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-semibold">
                    {doctorData.firstName[0]}{doctorData.lastName[0]}
                  </div>
                )}
                <div className="ml-6">
                  <h2 className="text-2xl font-bold">{doctorData.fullName}</h2>
                  <p className="text-lg text-gray-600">{doctorData.specialization || 'General Practitioner'}</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      SLMC: {doctorData.slmcRegisterNumber}
                    </span>
                    {doctorData.rating && (
                      <span className="ml-4 flex items-center text-yellow-500">
                        ★ {doctorData.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Experience:</span> {doctorData.yearsOfExperience || 'Not specified'}</p>
                    <p><span className="font-medium">Hospitals:</span> {doctorData.currentWorkingHospitals?.join(', ') || 'Not specified'}</p>
                    <p><span className="font-medium">Availability:</span> {doctorData.availability || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Email:</span> {doctorData.email}</p>
                    <p><span className="font-medium">Phone:</span> {doctorData.phoneNumber}</p>
                    <p><span className="font-medium">NIC:</span> {doctorData.nic}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Original Quick Actions Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => router.push('/dashboard/doctor/patients')}
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>View Patients</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/doctor/notification')}
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>View Requests</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/doctor/doctors')}
                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>View Doctors</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import api from '@/utils/api';

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
      // You would typically get these stats from your backend
      // For now using placeholder stats
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
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Summary Cards */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Total Patients</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              <p className="text-sm text-gray-500 mt-2">+{stats.newPatients} new this week</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Appointments</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.appointments}</p>
              <p className="text-sm text-green-500 mt-2">+{stats.appointmentChange}% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Rating</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.rating}</p>
              <p className="text-sm text-gray-500 mt-2">Based on {stats.reviews} reviews</p>
            </div>
          </div>
          
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
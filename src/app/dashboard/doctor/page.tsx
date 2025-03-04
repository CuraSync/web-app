"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';

const DoctorDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Summary Cards */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Total Patients</h2>
              <p className="text-3xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-500 mt-2">+3 new this week</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Appointments Today</h2>
              <p className="text-3xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-500 mt-2">2 completed, 6 remaining</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Pending Reports</h2>
              <p className="text-3xl font-bold text-yellow-600">5</p>
              <p className="text-sm text-gray-500 mt-2">3 lab results, 2 prescriptions</p>
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
                onClick={() => router.push('/dashboard/doctor/messages')}
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Messages</span>
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
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      NK
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Nithya Kumar had a checkup</p>
                      <p className="text-sm text-gray-500">Today at 2:00 PM</p>
                    </div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      VP
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Varun P scheduled an appointment</p>
                      <p className="text-sm text-gray-500">Yesterday at 5:30 PM</p>
                    </div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                      RK
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Lab results received for Rahul K</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
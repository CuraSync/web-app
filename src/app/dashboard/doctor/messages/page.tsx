"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';

const MessagesPage = () => {
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
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your messages will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
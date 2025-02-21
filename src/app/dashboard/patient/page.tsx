"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PatientDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'patient') {
      router.push('/auth/login/patient');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to your dashboard</p>
    </div>
  );
};

export default PatientDashboard;
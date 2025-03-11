"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import Link from 'next/link';
import { Settings } from 'lucide-react';

const DoctorProfileView = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    doctorId: 'DOC12345',
    firstName: 'James',
    lastName: 'Martin',
    fullName: 'Dr. James Martin',
    email: 'doctor@example.com',
    slmcNumber: 'SLMC-12345',
    nic: '982760149V',
    phone: '+1 (555) 123-4567',
    specialization: 'General Practitioner',
    education: 'MD - Harvard Medical School',
    certifications: 'Board Certified in Internal Medicine',
    yearsOfExperience: '10',
    rating: '4.8',
    currentHospitals: 'City Hospital',
    availability: 'Mon, Wed, Fri: 9AM - 5PM',
    description: 'Experienced general practitioner with over 10 years of clinical experience. Specializing in preventive care and chronic disease management.',
    profilePic: '',
  });

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
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
            <Link
              href="/dashboard/doctor/settings"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            {/* Profile Header */}
            <div className="flex items-center pb-6 border-b border-gray-200">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-semibold">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                <p className="text-lg text-gray-600">{profileData.specialization}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {profileData.doctorId}
                  </span>
                  <span className="ml-4 flex items-center text-yellow-500">
                    ★ {profileData.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">SLMC Number:</span> {profileData.slmcNumber}</p>
                  <p><span className="font-medium">NIC:</span> {profileData.nic}</p>
                  <p><span className="font-medium">Experience:</span> {profileData.yearsOfExperience} years</p>
                  <p><span className="font-medium">Current Hospital:</span> {profileData.currentHospitals}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Email:</span> {profileData.email}</p>
                  <p><span className="font-medium">Phone:</span> {profileData.phone}</p>
                  <p><span className="font-medium">Availability:</span> {profileData.availability}</p>
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Education & Certifications</h3>
              <div className="space-y-3">
                <p><span className="font-medium">Education:</span> {profileData.education}</p>
                <p><span className="font-medium">Certifications:</span> {profileData.certifications}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-700">{profileData.description}</p>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Total Patients</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">1,248</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Appointments</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                <p className="text-sm text-green-600 mt-1">+5% from last month</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Average Rating</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.rating}</p>
                <p className="text-sm text-green-600 mt-1">Based on 450 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileView;
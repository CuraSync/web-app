"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';

interface DoctorProfile {
  doctorId?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  slmcRegisterNumber: string;
  nic: string;
  phoneNumber: string;
  specialization: string | null;
  education: string[];
  certifications: string[];
  yearsOfExperience: string | null;
  rating: string | null;
  currentWorkingHospitals: string[];
  availability: string | null;
  description: string | null;
  profilePic: string | null;
}

const DoctorProfileView = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
      return;
    }

    fetchDoctorProfile();
  }, [router]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await api.doctor.getProfile();
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  if (error || !profileData) {
    return <div className="min-h-screen bg-gray-50 p-8">{error || 'Failed to load profile data'}</div>;
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
              {profileData.profilePic ? (
                <img 
                  src={profileData.profilePic} 
                  alt={profileData.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-semibold">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
              )}
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                <p className="text-lg text-gray-600">{profileData.specialization || 'General Practitioner'}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {profileData.doctorId || 'ID Not Set'}
                  </span>
                  {profileData.rating && (
                    <span className="ml-4 flex items-center text-yellow-500">
                      ★ {profileData.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">SLMC Number:</span> {profileData.slmcRegisterNumber}</p>
                  <p><span className="font-medium">NIC:</span> {profileData.nic}</p>
                  <p><span className="font-medium">Experience:</span> {profileData.yearsOfExperience || 'Not specified'}</p>
                  <p><span className="font-medium">Current Hospitals:</span> {profileData.currentWorkingHospitals.join(', ') || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Email:</span> {profileData.email}</p>
                  <p><span className="font-medium">Phone:</span> {profileData.phoneNumber}</p>
                  <p><span className="font-medium">Availability:</span> {profileData.availability || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Education & Certifications</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-2">Education:</p>
                  {profileData.education.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {profileData.education.map((edu, index) => (
                        <li key={index} className="text-gray-700">{edu}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No education details provided</p>
                  )}
                </div>
                <div>
                  <p className="font-medium mb-2">Certifications:</p>
                  {profileData.certifications.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-700">{cert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No certifications provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-700">
                {profileData.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileView;
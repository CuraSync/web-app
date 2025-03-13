"use client";
import React, { useState, useEffect } from 'react';
import { Users, HelpCircle, LogOut, Settings as SettingsIcon, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';
import api from '@/utils/api';

interface DoctorProfile {
  doctorId: string;
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

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');

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
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile(prevProfile => {
      if (!prevProfile) return null;

      const newProfile = { ...prevProfile };

      if (name === 'currentWorkingHospitals') {
        newProfile[name] = value.split(',').map(item => item.trim()).filter(Boolean);
      } else {
        newProfile[name] = value;
      }

      return newProfile;
    });
  };

  const handleAddEducation = () => {
    if (!profile || !newEducation.trim()) return;

    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        education: [...prevProfile.education, newEducation.trim()]
      };
    });
    setNewEducation('');
  };

  const handleRemoveEducation = (index: number) => {
    if (!profile) return;

    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        education: prevProfile.education.filter((_, i) => i !== index)
      };
    });
  };

  const handleAddCertification = () => {
    if (!profile || !newCertification.trim()) return;

    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        certifications: [...prevProfile.certifications, newCertification.trim()]
      };
    });
    setNewCertification('');
  };

  const handleRemoveCertification = (index: number) => {
    if (!profile) return;

    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        certifications: prevProfile.certifications.filter((_, i) => i !== index)
      };
    });
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await api.doctor.uploadProfilePic(file);
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          profilePic: response.data.profilePicUrl
        };
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);

      // Create a clean copy of the data
      const updateData = {
        ...profile,
        education: profile.education.filter(Boolean),
        certifications: profile.certifications.filter(Boolean),
        currentWorkingHospitals: profile.currentWorkingHospitals.filter(Boolean),
        // Ensure fullName is updated based on first and last name
        fullName: `${profile.firstName} ${profile.lastName}`.trim()
      };

      await api.doctor.updateProfile(updateData);
      
      // Refresh the profile data
      await fetchDoctorProfile();
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id');
    router.push('/auth/login/doctor');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-gray-50 p-8">Failed to load profile data</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Picture */}
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                {profile.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-2xl font-semibold">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </span>
                )}
                <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium">{profile.fullName}</p>
                <p className="text-base text-blue-500">{profile.email}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={profile.specialization || ''}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={profile.yearsOfExperience || ''}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Hospital</label>
                  <input
                    type="text"
                    name="currentWorkingHospitals"
                    value={profile.currentWorkingHospitals.join(', ')}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={profile.availability || ''}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span>{edu}</span>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="Add new education"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddEducation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Certifications</h2>
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span>{cert}</span>
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add new certification"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddCertification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <textarea
                name="description"
                value={profile.description || ''}
                onChange={handleProfileChange}
                rows={4}
                placeholder="Tell us about yourself and your practice"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
"use client";
import React, { useState } from 'react';
import { Users, LogOut, Settings as SettingsIcon, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

const SettingsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [profileData, setProfileData] = useState({
    doctorId: 'DOC12345',
    firstName: 'James',
    lastName: 'Martin',
    fullName: 'James Martin',
    email: 'doctor@example.com',
    slmcNumber: 'SLMC-12345',
    nic: '982760149V',
    password: '********',
    phone: '+1 (555) 123-4567',
    specialization: 'General Practitioner',
    education: '',
    certifications: '',
    yearsOfExperience: '10',
    rating: '4.8',
    currentHospitals: 'City Hospital',
    contactInfo: '',
    availability: 'Mon, Wed, Fri: 9AM - 5PM',
    description: 'Experienced general practitioner with over 10 years of clinical experience. Specializing in preventive care and chronic disease management.',
    profilePic: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          profilePic: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/auth/login/doctor');
  };

  const handleInviteSend = () => {
    if (email) {
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
    } else {
      toast.error("Please enter an email address");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <SettingsIcon className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Profile Header */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-24 h-24 overflow-hidden rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
                    {profileData.profilePic ? (
                      <img
                        src={profileData.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 text-3xl font-semibold">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </span>
                    )}
                  </div>
                  <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-lg cursor-pointer shadow-md hover:bg-blue-700 transition-colors duration-200">
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
                <div className="ml-8">
                  <h2 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h2>
                  <p className="text-gray-600">{profileData.specialization}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {profileData.doctorId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="p-8">
              <div className="space-y-8">
                {/* Personal Information Section */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Read-only Fields */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                        <input
                          type="text"
                          value={profileData.doctorId}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                        <input
                          type="text"
                          value={profileData.nic}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Information Section */}
                <section className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </section>

                {/* Professional Information Section */}
                <section className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={profileData.specialization}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          type="text"
                          name="yearsOfExperience"
                          value={profileData.yearsOfExperience}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Working Hospitals/Clinics</label>
                      <input
                        type="text"
                        name="currentHospitals"
                        value={profileData.currentHospitals}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Separate multiple hospitals with commas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <input
                        type="text"
                        name="availability"
                        value={profileData.availability}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="e.g., Mon, Wed, Fri: 9AM - 5PM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                      <textarea
                        name="education"
                        value={profileData.education}
                        onChange={handleProfileChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="List your degrees, universities, and graduation years"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                      <textarea
                        name="certifications"
                        value={profileData.certifications}
                        onChange={handleProfileChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="List any relevant certifications or specialized training"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Description</label>
                      <textarea
                        name="description"
                        value={profileData.description}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Describe your practice, specialties, and approach to patient care"
                      />
                    </div>
                  </div>
                </section>

                {/* Staff Management Section */}
                <section className="pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900 ml-2">Staff Management</h3>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">Invite staff members to join your practice</p>
                    <div className="flex gap-4">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button
                        onClick={handleInviteSend}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        Send Invite
                      </button>
                    </div>
                  </div>
                </section>

                {/* Logout Section */}
                <section className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-6 py-2.5 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
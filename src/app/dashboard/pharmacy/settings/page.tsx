"use client";
import React, { useState } from 'react';
import { Users, HelpCircle, LogOut, Settings as SettingsIcon, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PharmacySidebar from '../sidebar/sidebar';
import { toast } from 'sonner';

const SettingsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [profileData, setProfileData] = useState({
    pharmacyId: 'PH12345', // Example ID
    pharmacyName: 'MedPlus Pharmacy',
    location: '123 Main St, City, Country',
    email: 'info@medpluspharmacy.com',
    password: '********', // Placeholder for password
    contactNo: '+1 (555) 123-4567',
    GovRegId: 'REG-987654',
    description: 'Your trusted local pharmacy providing quality care and medications.',
    profilePic: '', // URL or base64 string for profile picture
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken'); // Assuming you have an auth token
    toast.success("Logged out successfully");
    router.push('/auth/login/pharmacy');
  };

  const handleInviteSend = () => {
    if (email) {
      toast.success(`Invitation sent to ${email}`);
      setEmail(''); // Clear the input after sending
    } else {
      toast.error("Please enter an email address");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      socialMediaLinks: {
        ...profileData.socialMediaLinks,
        [name]: value,
      },
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
    // Here you would typically send the updated data to your backend
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen flex font-sans bg-white text-gray-900">
      <PharmacySidebar />
      <div className="p-8 flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-md bg-white border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium flex items-center">
              <SettingsIcon className="w-6 h-6 mr-2" />
              Settings
            </h2>
          </div>

          {/* Profile Section */}
          <div className="p-8">
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                {profileData.profilePic ? (
                  <img
                    src={profileData.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-green-600 text-2xl font-semibold">MP</span>
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
                <p className="text-xl font-medium">{profileData.pharmacyName}</p>
                <p className="text-base text-blue-500">{profileData.email}</p>
              </div>
            </div>

            {/* Editable Pharmacy Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                <input
                  type="text"
                  name="pharmacyName"
                  value={profileData.pharmacyName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={profileData.contactNo}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Government Registration ID</label>
                <input
                  type="text"
                  name="GovRegId"
                  value={profileData.GovRegId}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleProfileChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="facebook"
                    placeholder="Facebook"
                    value={profileData.socialMediaLinks.facebook}
                    onChange={handleSocialMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter"
                    value={profileData.socialMediaLinks.twitter}
                    onChange={handleSocialMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    name="instagram"
                    placeholder="Instagram"
                    value={profileData.socialMediaLinks.instagram}
                    onChange={handleSocialMediaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>

            {/* Invite Staff Members Section */}
            <div className="py-8 border-b border-gray-200">
              <div className="mb-4 flex items-center">
                <Users className="w-8 h-8 text-gray-500" />
                <span className="ml-4 text-base">Invite Staff Members</span>
              </div>
              <div className="flex mt-4">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white border-gray-300 text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={handleInviteSend}
                  className="ml-4 px-8 py-3 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>

            {/* Help & Support Section */}
            <div className="py-8 border-b border-gray-200">
              <button className="flex items-center justify-between w-full text-left">
                <div className="flex items-center">
                  <HelpCircle className="w-8 h-8 text-gray-500" />
                  <span className="ml-4 text-base">Help & Support</span>
                </div>
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-200">
            © 2025 CuraSync. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
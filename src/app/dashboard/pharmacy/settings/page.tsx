"use client";
import React, { useState } from 'react';
import { Users, HelpCircle, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PharmacySidebar from '../sidebar/sidebar';
import { toast } from 'sonner';

const SettingsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken'); // Assuming you have an auth token
    
    // Show success message
    toast.success("Logged out successfully");

    // Redirect to login page
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
          
          <div className="p-8">
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-2xl font-semibold">MP</span>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium">MedPlus Pharmacy</p>
                <p className="text-base text-blue-500">info@medpluspharmacy.com</p>
              </div>
            </div>
            
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
            
            <div className="py-8">
              <button 
                onClick={handleLogout}
                className="flex items-center text-base text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-8 h-8 text-gray-500" />
                <span className="ml-4">Logout</span>
              </button>
            </div>
          </div>
          
          <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-200">
            © 2025 CuraSync. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
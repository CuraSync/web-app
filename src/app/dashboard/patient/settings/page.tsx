"use client";
import React, { useState } from 'react';
import { Moon, Users, HelpCircle, LogOut, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from '../sidebar/sidebar'; // Ensure the import path is correct

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };
  
  const handleInviteSend = () => {
    if (email) {
      console.log(`Sending invite to: ${email}`);
      // Add your invite logic here
      setEmail(''); // Clear the input after sending
    }
  };
  
  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar /> {/* Use the Sidebar component here */}
      <div className="p-8 flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium flex items-center">
              <SettingsIcon className="w-6 h-6 mr-2" />
              Settings
            </h2>
          </div>
          
          <div className="p-8">
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-gray-100">
                <svg className="absolute w-24 h-24 text-gray-400 -left-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium text-gray-900">John Anderson</p>
                <p className="text-base text-blue-500">john.anderson@example.com</p>
              </div>
            </div>
            
            <div className="py-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="w-8 h-8 text-gray-500" />
                  <span className="ml-4 text-base text-gray-700">Dark Mode</span>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-16 h-8 rounded-full relative transition-colors duration-200 ease-in-out ${darkMode ? "bg-blue-500" : "bg-gray-200"}`}
                >
                  <span 
                    className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow transform transition-transform duration-200 ease-in-out ${darkMode ? "translate-x-8" : ""}`}
                  />
                </button>
              </div>
            </div>
            
            <div className="py-8 border-b border-gray-200">
              <div className="mb-4 flex items-center">
                <Users className="w-8 h-8 text-gray-500" />
                <span className="ml-4 text-base text-gray-700">Invite Friends</span>
              </div>
              <div className="flex mt-4">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={handleInviteSend}
                  className="ml-4 px-8 py-3 bg-gray-800 text-white text-base font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
            
            <div className="py-8 border-b border-gray-200">
              <button className="flex items-center justify-between w-full text-left">
                <div className="flex items-center">
                  <HelpCircle className="w-8 h-8 text-gray-500" />
                  <span className="ml-4 text-base text-gray-700">Help & Support</span>
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
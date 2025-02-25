"use client";
import React, { useState } from 'react';
import { Moon, Users, HelpCircle, LogOut, Mail, BarChart2, User, ShoppingBag, Bell, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Beaker } from 'lucide-react'; // Using Beaker instead of Flask

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
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          <div className="p-5 flex items-center">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 text-white">
                  {/* CuraSync Logo - simplified representation */}
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3C16.4183 3 20 6.58172 20 11C20 15.4183 16.4183 19 12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3Z" fill="#4F86F7" />
                    <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" fill="white" />
                    <path d="M7 8C8.10457 8 9 7.10457 9 6C9 4.89543 8.10457 4 7 4C5.89543 4 5 4.89543 5 6C5 7.10457 5.89543 8 7 8Z" fill="white" />
                    <path d="M17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-2xl font-medium text-teal-600 ml-1">CuraSync</span>
          </div>
          <div className="p-5 flex-1">
            <nav className="space-y-8">
              <div className="flex items-center p-3 rounded-lg">
                <Mail className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">TimeLine</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg">
                <BarChart2 className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">Visualization</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg">
                <User className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">Doctor</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">Pharmacy</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg">
                <Beaker className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">Laboratory</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg">
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="ml-3 text-gray-700">Notification</span>
              </div>
            </nav>
          </div>
          <div className="p-5 border-t border-gray-200">
            <div className="flex items-center p-3 rounded-full bg-gray-200">
              <SettingsIcon className="w-5 h-5 text-gray-700" />
              <span className="ml-3 text-gray-700 font-medium">Settings</span>
            </div>
          </div>
        </div>

        {/* Main Content - Settings Panel (increased size) */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-medium flex items-center">
                <SettingsIcon className="w-6 h-6 mr-2" />
                Settings
              </h2>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center pb-6 border-b border-gray-200">
                <div className="relative w-16 h-16 overflow-hidden rounded-full bg-gray-100">
                  <svg className="absolute w-20 h-20 text-gray-400 -left-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">John Anderson</p>
                  <p className="text-base text-blue-500">john.anderson@example.com</p>
                </div>
              </div>
              
              <div className="py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="w-6 h-6 text-gray-500" />
                    <span className="ml-3 text-base text-gray-700">Dark Mode</span>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`w-14 h-7 rounded-full relative transition-colors duration-200 ease-in-out ${darkMode ? "bg-blue-500" : "bg-gray-200"}`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-200 ease-in-out ${darkMode ? "translate-x-7" : ""}`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="py-6 border-b border-gray-200">
                <div className="mb-3 flex items-center">
                  <Users className="w-6 h-6 text-gray-500" />
                  <span className="ml-3 text-base text-gray-700">Invite Friends</span>
                </div>
                <div className="flex mt-3">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    onClick={handleInviteSend}
                    className="ml-3 px-6 py-3 bg-gray-800 text-white text-base font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
              
              <div className="py-6 border-b border-gray-200">
                <button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <HelpCircle className="w-6 h-6 text-gray-500" />
                    <span className="ml-3 text-base text-gray-700">Help & Support</span>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="py-6">
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-base text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-6 h-6 text-gray-500" />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
            
            <div className="p-5 text-center text-sm text-gray-500 border-t border-gray-200">
              © 2025 Your App Name. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
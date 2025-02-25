"use client";
import React from 'react';
import { Bell, Settings } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-blue-500 text-xl font-bold">CuraSync</div>
            <div className="ml-10 space-x-4">
              <a href="#" className="text-gray-500">Home</a>
              <a href="#" className="text-gray-500">About Us</a>
              <a href="#" className="text-gray-500">Our Services</a>
              <a href="#" className="text-gray-500">Contact</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-500" />
            <Settings className="w-5 h-5 text-gray-500" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                SJ
              </div>
              <span className="text-gray-700">Sarah Johnson</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
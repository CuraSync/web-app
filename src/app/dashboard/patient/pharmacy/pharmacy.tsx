"use client";
import React, { useState } from 'react';
import { Search, MessageSquare, Bell, Settings, Twitter, Facebook, Instagram, User } from 'lucide-react';

// Define interfaces for component props and data
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

interface Pharmacy {
  name: string;
  address: string;
  patientName: string;
  hasMessage: boolean;
}

const PharmacyListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pharmacy');
  
  const pharmacies: Pharmacy[] = [
    {
      name: "MedPlus Pharmacy",
      address: "123 Healthcare Ave, Medical District",
      patientName: "John Smith",
      hasMessage: true
    },
    {
      name: "HealthCare Pharmacy",
      address: "456 Wellness Blvd, Central Square",
      patientName: "Emma Davis",
      hasMessage: true
    },
    {
      name: "CityMed Drugstore",
      address: "789 Medicine Lane, Uptown",
      patientName: "Michael Brown",
      hasMessage: false
    }
  ];

  const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="text-blue-600">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l6 3.2-6 3-6-3 6-3.2zM4 16.5v-7l8 4v7l-8-4zm16 0l-8 4v-7l8-4v7z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-600">CuraSync</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About Us</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Our Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
            </nav>

            <div className="flex items-center space-x-6">
              <Twitter className="w-5 h-5 text-gray-500 hover:text-blue-400 cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-500 hover:text-pink-500 cursor-pointer" />
              <User className="w-5 h-5 text-gray-500" />
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Patient
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-1">
            <SidebarItem 
              icon={<div className="w-6 h-6">⏱️</div>}
              label="TimeLine"
              isActive={activeTab === 'timeline'}
              onClick={() => handleTabChange('timeline')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">📊</div>}
              label="Visualization"
              isActive={activeTab === 'visualization'}
              onClick={() => handleTabChange('visualization')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">👨‍⚕️</div>}
              label="Doctor"
              isActive={activeTab === 'doctor'}
              onClick={() => handleTabChange('doctor')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">💊</div>}
              label="Pharmacy"
              isActive={activeTab === 'pharmacy'}
              onClick={() => handleTabChange('pharmacy')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">🔬</div>}
              label="Laboratory"
              isActive={activeTab === 'laboratory'}
              onClick={() => handleTabChange('laboratory')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">🔔</div>}
              label="Notification"
              isActive={activeTab === 'notification'}
              onClick={() => handleTabChange('notification')}
            />
            <SidebarItem 
              icon={<div className="w-6 h-6">⚙️</div>}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => handleTabChange('settings')}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-t-xl font-medium text-gray-700">
                <div>Pharmacy Name</div>
                <div>Address</div>
                <div>Patient's Name</div>
                <div className="text-center">Messaging</div>
              </div>

              {/* Table Content */}
              <div className="divide-y divide-gray-200">
                {pharmacies.map((pharmacy, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                    <div className="font-medium text-gray-900">{pharmacy.name}</div>
                    <div className="text-gray-600">{pharmacy.address}</div>
                    <div className="text-gray-600">{pharmacy.patientName}</div>
                    <div className="flex justify-center">
                      <button 
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
                        onClick={() => console.log(`Messaging ${pharmacy.name}`)}
                      >
                        <MessageSquare className={`w-5 h-5 ${
                          pharmacy.hasMessage ? 'text-blue-500' : 'text-gray-400'
                        } group-hover:text-blue-600`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyListing;
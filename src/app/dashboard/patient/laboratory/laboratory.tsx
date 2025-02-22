"use client";
import React, { useState } from 'react';
import { MessageSquare, Clock, User, Plus, Bell, Settings, Search } from 'lucide-react';
import {
  FaUserMd,
  FaChartBar,
  FaFlask,
  FaEnvelope,
  FaBell,
  FaCog,
} from 'react-icons/fa';

interface Laboratory {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  availableTime: string;
  hasMessage: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const LaboratoryListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('laboratory');
  const [hoveredLaboratory, setHoveredLaboratory] = useState<string | null>(null);

  const laboratories: Laboratory[] = [
    {
      id: '1',
      name: 'Lab A',
      specialty: 'Pathology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '09:00 AM',
      hasMessage: true
    },
    {
      id: '2',
      name: 'Lab B',
      specialty: 'Microbiology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '10:30 AM',
      hasMessage: true
    },
    {
      id: '3',
      name: 'Lab C',
      specialty: 'Radiology',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '11:45 AM',
      hasMessage: false
    },
    {
      id: '4',
      name: 'Lab D',
      specialty: 'Biochemistry',
      imageUrl: '/api/placeholder/40/40',
      availableTime: '02:15 PM',
      hasMessage: true
    }
  ];

  const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isActive ? 'bg-blue-100 text-blue-600 scale-105' : 'hover:bg-gray-100 hover:scale-102'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen font-sans bg-white">
          {/* ========== LEFT SIDEBAR ========== */}
          <aside className="w-60 border-r border-gray-300 bg-white flex flex-col">
            {/* Logo */}
            <div className="p-4 mb-2">
              <h1 className="text-2xl font-bold text-[#00a2ad]">CuraSync</h1>
            </div>
    
            {/* Sidebar Navigation */}
            <nav className="flex flex-col space-y-4 mt-4 px-4">
              <SidebarItem icon={<FaUserMd />} label="Doctor" isActive={activeTab === 'doctor'} onClick={() => setActiveTab('doctor')} />
              <SidebarItem icon={<FaChartBar />} label="TimeLine" isActive={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
              <SidebarItem icon={<FaFlask />} label="Visualization" isActive={activeTab === 'visualization'} onClick={() => setActiveTab('visualization')} />
              <SidebarItem icon={<FaEnvelope />} label="Messaging" isActive={activeTab === 'messaging'} onClick={() => setActiveTab('messaging')} />
              <SidebarItem icon={<FaBell />} label="Notification" isActive={activeTab === 'notification'} onClick={() => setActiveTab('notification')} />
              <SidebarItem icon={<FaCog />} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              <SidebarItem icon={<FaChartBar />} label="Laboratory" isActive={activeTab === 'laboratory'} onClick={() => setActiveTab('laboratory')} />
            </nav>
          </aside>
    
          {/* ========== MAIN CONTENT ========== */}
          <div className="flex-1 bg-gray-50">
            {/* Navigation */}
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
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-gray-700">
              <div>Laboratory Name</div>
              <div>Name & Specialty</div>
              <div>Available Time</div>
              <div className="text-center">Messaging</div>
              <div className="text-center">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {laboratories.map((laboratory) => (
                <div 
                  key={laboratory.id}
                  className={`grid grid-cols-5 gap-4 p-4 transition-all duration-300 ${
                    hoveredLaboratory === laboratory.id 
                      ? 'bg-blue-50 transform scale-[1.01]' 
                      : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setHoveredLaboratory(laboratory.id)}
                  onMouseLeave={() => setHoveredLaboratory(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {laboratory.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{laboratory.name}</div>
                    <div className="text-sm text-gray-500">{laboratory.specialty}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{laboratory.availableTime}</span>
                  </div>
                  <div className="flex justify-center">
                    <button className="p-2 rounded-full hover:bg-blue-100 transition-colors group">
                      <MessageSquare className={`w-5 h-5 ${
                        laboratory.hasMessage ? 'text-blue-500' : 'text-gray-400'
                      } group-hover:text-blue-600`} />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== SIDEBAR ITEM COMPONENT ==========
interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
  }
  const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
    return (
      <a
        href="#"
        className="flex items-center space-x-3 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </a>
    );
  };

export default LaboratoryListing;
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserMd, FaChartBar, FaFlask, FaEnvelope, FaBell, FaCog, FaPrescriptionBottleAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/dashboard/patient/doctor', icon: FaUserMd, label: 'Doctor' },
    { href: '/dashboard/patient/timeline', icon: FaChartBar, label: 'Timeline' },
    { href: '/dashboard/patient/laboratory', icon: FaFlask, label: 'Laboratory' },
    { href: '/dashboard/patient/visualization', icon: FaFlask, label: 'Visualization' },
    { href: '/dashboard/patient/pharmacy', icon: FaPrescriptionBottleAlt, label: 'Pharmacy' },
    { href: '/dashboard/patient/message', icon: FaEnvelope, label: 'Messaging' },
    { href: '/dashboard/patient/notification', icon: FaBell, label: 'Notification' },
    { href: '/dashboard/patient/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10">
          <svg viewBox="0 0 40 40" className="text-blue-600 w-full h-full">
            <path d="M20 5C11.716 5 5 11.716 5 20c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z" fill="currentColor" opacity="0.2"/>
            <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-blue-600">CuraSync</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-12 space-y-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <span className="text-gray-700">Sarah Johnson</span>
      </div>
    </aside>
  );
};

export default Sidebar;
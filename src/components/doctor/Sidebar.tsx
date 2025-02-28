import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageSquare, Bell, Settings } from 'lucide-react';

const DoctorSidebar = () => {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/dashboard/doctor', icon: Users, label: 'Dashboard' },
    { href: '/dashboard/doctor/patients', icon: Users, label: 'Patients' },
    { href: '/dashboard/doctor/doctors', icon: Users, label: 'Doctors' },
    { href: '/dashboard/doctor/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/doctor/notification', icon: Bell, label: 'Notification' },
    { href: '/dashboard/doctor/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <span className="font-bold">CS</span>
          </div>
          <span className="ml-2 text-xl font-bold text-blue-600">CuraSync</span>
        </Link>
        
        <nav className="mt-10 space-y-6">
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
      </div>
    </aside>
  );
};

export default DoctorSidebar;
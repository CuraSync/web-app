import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, MessageSquare, Bell, Settings, 
  HelpCircle, LogOut
} from 'lucide-react';
import { toast } from 'sonner';

const DoctorSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { href: '/dashboard/doctor', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/doctor/patients', icon: Users, label: 'Patients' },
    { href: '/dashboard/doctor/doctors', icon: Users, label: 'Doctors' },
    { href: '/dashboard/doctor/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/doctor/notification', icon: Bell, label: 'Notifications' },
    { href: '/dashboard/doctor/settings', icon: Settings, label: 'Settings' },
  ];

  const secondaryNavItems = [
    { 
      href: '/dashboard/doctor/help', 
      icon: HelpCircle, 
      label: 'Help & Support',
      onClick: null
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/auth/login/doctor');
    toast.success("Logged out successfully");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            CS
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">CuraSync</span>
        </Link>
        
        <div className="mt-8 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
                {item.label === 'Notifications' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            More
          </h3>
          <div className="mt-2 space-y-1">
            {secondaryNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return item.onClick ? (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
            JM
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Dr. James Martin</p>
            <p className="text-xs text-gray-500">General Practitioner</p>
          </div>
        </div>
        <button 
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
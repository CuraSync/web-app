import Link from 'next/link';
import { FaChartBar, FaCog, FaEnvelope, FaFlask, FaUserMd, FaPrescriptionBottleAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner';
import { useCallback } from 'react';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userRole');
    router.push('/auth/login/lab');
    setTimeout(() => {
      toast.success("Logged out successfully");
    }, 0);
  }, [router]);
  
  
  return (
    <div>
      <aside className="w-64 border-r p-6 flex flex-col h-full">
        <nav className="mt-12 space-y-6 flex-grow">
        <Link href="/dashboard/lab" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaChartBar className="w-5 h-5" />
            <span>City Lab</span>
          </Link>
          <Link href="/dashboard/lab/message" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaEnvelope className="w-5 h-5" />
            <span>Messaging</span>
          </Link>
          <Link href="/dashboard/lab/notification" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaBell className="w-5 h-5" />
            <span>Notification</span>
          </Link>
          <Link href="/dashboard/lab/settings" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            <FaCog className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="mt-auto p-6 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center  text-purple-800 font-semibold">
                    CL
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">City Lab</p>
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
    </div>
  );
};

export default Sidebar;
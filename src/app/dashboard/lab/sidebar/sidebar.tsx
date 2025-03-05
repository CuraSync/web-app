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
        {/* Sidebar profile */}
        <div className="mt-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <Link href="/dashboard/lab" className="text-gray-700 hover:text-blue-600">
            Laboratory Profile
          </Link>
        </div>
        <button 
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
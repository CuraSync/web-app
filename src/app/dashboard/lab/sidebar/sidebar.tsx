"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FaAddressCard, FaRocketchat, FaBars, FaUser, FaListUl } from "react-icons/fa";
import { LogOut, X } from "lucide-react";
import api from "@/utils/api";

const Sidebar = () => {
  const router = useRouter();
  const [labName, setLabName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("id");
    router.push('/auth/login/lab');
    setTimeout(() => {
      toast.success("Logged out successfully");
    }, 0);
  }, [router]);
  
  const fetchHomeData = async () => {
    try {
      const response = await api.get("/laboratory/home");
      setLabName(response.data.labName);
      setProfilePic(response.data.profilePic);
    } catch (error) {
      toast.error("Error fetching lab data. Please try again.");
      console.error("Error fetching lab data:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchHomeData();
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-end items-center z-30 md:hidden">
        <button 
          className="p-3 text-gray-600 hover:text-gray-800 transition duration-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 p-6 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-72`}
      >
        {/* Close Button (Mobile) */}
        <button 
          className="absolute top-4 right-4 md:hidden text-gray-600 hover:text-gray-800 transition"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
            <Image src="/assets/logo/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900">CuraSync</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-3 flex-grow">
          <SidebarItem href="/dashboard/lab" icon={FaUser} label="Dashboard" />
          <SidebarItem href="/dashboard/lab/patientlist" icon={FaListUl} label="Patient List" />
          <SidebarItem href="/dashboard/lab/request" icon={FaRocketchat} label="Requests" />
          <SidebarItem href="/dashboard/lab/settings" icon={FaAddressCard} label="Profile" />
        </nav>

        {/* User Info & Logout */}
        <div className="mt-auto border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              {profilePic ? (
                <Image src={profilePic} alt="Profile" width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <FaUser className="text-purple-800 w-5 h-5" />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{labName || "Lab Name"}</p>
            </div>
          </div>
          <button
            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Sidebar;

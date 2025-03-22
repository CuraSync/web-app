"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FaChartBar, FaCog, FaEnvelope, FaBell, FaBars, FaUser } from "react-icons/fa";
import { LogOut, X } from "lucide-react";
import api from "@/utils/api";

const Sidebar = () => {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [patientFullName, setPatientFullName] = useState("Patient Name");

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userRole');
    router.push('/auth/login/patient');
    setTimeout(() => {
      toast.success("Logged out successfully");
    }, 0);
  }, [router]);

  const fetchHomeData = async () => {
    try {
      const response = await api.get("/patient/profile");
      setPatientFullName(response.data.fullName || "Patient Name");
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 w-full p-4 flex justify-end items-center z-30">
        <button
          className="md:hidden p-3 text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative top-0 left-0 w-64 bg-white h-full md:h-auto border-r p-6 flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <button
          className="absolute top-4 right-4 md:hidden text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="mt-12 space-y-6 flex-grow">
          <Link
            href="/dashboard/patient"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaChartBar className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/patient/doctor"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaEnvelope className="w-5 h-5" />
            <span>Doctor</span>
          </Link>

          <Link
            href="/dashboard/patient/laboratory"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaBell className="w-5 h-5" />
            <span>Laboratory</span>
          </Link>

          <Link
            href="/dashboard/patient/pharmacy"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaCog className="w-5 h-5" />
            <span>Pharmacy</span>
          </Link>

          <Link
            href="/dashboard/patient/notification"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaBell className="w-5 h-5" />
            <span>Notifications</span>
          </Link>

          <Link
            href="/dashboard/patient/settings"
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
          >
            <FaCog className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-semibold">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUser className="text-purple-800 w-5 h-5" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{patientFullName}</p>
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
    </>
  );
};

export default Sidebar;

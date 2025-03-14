"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  Upload,
  Loader2,
  X,
  Camera
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import { toast } from "sonner";
import api from "@/utils/api";

interface PatientInfo {
  firstname: string;
  lastname: string;
  address: string;
  bloodType: string;
  bmi: string;
  dateOfBirth: string;
  email: string;
  guardianContactNumber: string;
  guardianRelation: string;
  guardianName: string;
  height: string;
  medicationAllergies: { severity: string; type: string; name: string }[];
  nic: string;
  patientId: string;
  phoneNumber: string;
  profilepic: string;
  updateAt: string;
  weight: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstname: "",
    lastname: "",
    address: "",
    bloodType: "",
    bmi: "",
    dateOfBirth: "",
    email: "",
    guardianContactNumber: "",
    guardianRelation: "",
    guardianName: "",
    height: "",
    medicationAllergies: [],
    nic: "",
    patientId: "",
    phoneNumber: "",
    profilepic: "",
    updateAt: "",
    weight: "",
  });

  const fetchSettingsData = async () => {
    try {
      const response = await api.post("/patient/settings");
      setPatientInfo(response.data);
      localStorage.setItem('patientData', JSON.stringify(response.data));
      console.log("Fetched settings data:", response.data);
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Failed to load settings data");
      
      // Fallback to localStorage if API fails
      const storedData = localStorage.getItem('patientData');
      if (storedData) {
        setPatientInfo(JSON.parse(storedData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Only JPG, PNG, GIF, or WebP images are allowed");
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = () => {
      setPatientInfo(prev => ({
        ...prev,
        profilepic: reader.result as string
      }));
      setIsUploading(false);
      toast.success("Profile picture ready to save");
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the image");
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const removeProfilePic = () => {
    setPatientInfo(prev => ({
      ...prev,
      profilepic: ""
    }));
    toast.success("Profile picture removed");
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      await api.post("/patient/profile", {
        ...patientInfo,
        updateAt: new Date().toISOString()
      });

      toast.success("Profile updated successfully");
      localStorage.setItem("patientData", JSON.stringify(patientInfo));
      
      router.refresh();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("patientData");
    router.push("/auth/login/patient");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "patient") {
      router.push("/auth/login/patient");
    } else {
      fetchSettingsData();
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                {isUploading ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : patientInfo.profilepic ? (
                  <>
                    <img
                      src={patientInfo.profilepic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={removeProfilePic}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      title="Remove profile picture"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <Camera size={40} className="text-gray-400" />
                )}
                
                <label htmlFor="profile-pic" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md">
                  <Upload size={16} />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium">
                  {patientInfo.firstname} {patientInfo.lastname}
                </p>
                <p className="text-base text-blue-500">{patientInfo.email}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={patientInfo.firstname}
                  onChange={(e) => setPatientInfo({ ...patientInfo, firstname: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={patientInfo.lastname}
                  onChange={(e) => setPatientInfo({ ...patientInfo, lastname: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={patientInfo.email}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={patientInfo.phoneNumber}
                  onChange={(e) => setPatientInfo({ ...patientInfo, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={patientInfo.dateOfBirth}
                  onChange={(e) => setPatientInfo({ ...patientInfo, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <input
                  type="text"
                  value={patientInfo.bloodType}
                  onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={patientInfo.height}
                  onChange={(e) => setPatientInfo({ ...patientInfo, height: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={patientInfo.weight}
                  onChange={(e) => setPatientInfo({ ...patientInfo, weight: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={patientInfo.address}
                  onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={patientInfo.guardianName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, guardianName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Contact
                </label>
                <input
                  type="tel"
                  value={patientInfo.guardianContactNumber}
                  onChange={(e) => setPatientInfo({ ...patientInfo, guardianContactNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Relation
                </label>
                <input
                  type="text"
                  value={patientInfo.guardianRelation}
                  onChange={(e) => setPatientInfo({ ...patientInfo, guardianRelation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
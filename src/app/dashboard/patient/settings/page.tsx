"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import { toast } from "sonner";
import axios from "axios";
import api from "@/utils/api";

interface AllergyItem {
  name: string;
  severity: "Severe" | "Moderate" | "Low";
}

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
  medicationAllergies: AllergyItem[];
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
      console.log("Server Response:", response.data);
      setPatientInfo(response.data as PatientInfo);
      localStorage.setItem("patientData", JSON.stringify(response.data));
      console.log("Fetched settings data:", response.data);
    }finally {
      setIsLoading(false);
    }
  };
  const handleSaveProfile = async () => {
    try {
      await api.post("/patient/profile", {
        height: Number(patientInfo.height),
        weight: Number(patientInfo.weight),
        bmi: parseFloat(patientInfo.bmi),
        bloodType: patientInfo.bloodType,
        medicationAllergies: patientInfo.medicationAllergies,
        guardianName: patientInfo.guardianName,
        guardianContactNumber: patientInfo.guardianContactNumber,
        profilePic: patientInfo.profilepic,
      });
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };
  

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Only JPG, PNG, GIF, or WebP images are allowed");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setPatientInfo((prev) => ({
        ...prev,
        profilepic: reader.result as string,
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
    setPatientInfo((prev) => ({ ...prev, profilepic: "" }));
    toast.success("Profile picture removed");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => {
      let newValue = value;
      if ((name === "height" || name === "weight") && value !== "") {
        newValue = Math.max(0, parseFloat(value)).toString();
      }
      const newData = { ...prev, [name]: newValue };

      if (name === "height" || name === "weight") {
        const heightInMeters =
          name === "height" ? parseFloat(newValue) / 100 : parseFloat(prev.height) / 100;
        const weightInKg = name === "weight" ? parseFloat(newValue) : parseFloat(prev.weight);
        if (heightInMeters && weightInKg) {
          newData.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        }
      }
      return newData;
    });
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
    <div className="min-h-screen flex bg-white overflow-hidden">
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
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                ) : patientInfo.profilepic && patientInfo.profilepic !== "" ? (
                  <img
                    src={patientInfo.profilepic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-2xl font-semibold">
                    {patientInfo.firstname[0] || "F"}
                    {patientInfo.lastname[0] || "L"}
                  </span>
                )}
                <label
                  htmlFor="profile-pic"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/*"
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
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientInfo.patientId}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                <input
                  type="text"
                  value={patientInfo.nic}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={patientInfo.firstname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={patientInfo.lastname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
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
                  name="phoneNumber"
                  value={patientInfo.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={patientInfo.dateOfBirth}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={patientInfo.address}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={patientInfo.height}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={patientInfo.weight}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BMI (Calculated)
                </label>
                <input
                  type="text"
                  value={patientInfo.bmi}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <input
                  type="text"
                  name="bloodType"
                  value={patientInfo.bloodType}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={patientInfo.guardianName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Contact Number
                </label>
                <input
                  type="tel"
                  name="guardianContactNumber"
                  value={patientInfo.guardianContactNumber}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Allergies
                </label>
                {patientInfo.medicationAllergies.map((allergy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergy.name}
                      onChange={(e) => {
                        const updatedAllergies = [...patientInfo.medicationAllergies];
                        updatedAllergies[index].name = e.target.value;
                        setPatientInfo((prev) => ({
                          ...prev,
                          medicationAllergies: updatedAllergies,
                        }));
                      }}
                      placeholder="Allergy name"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={allergy.severity}
                      onChange={(e) => {
                        const updatedAllergies = [...patientInfo.medicationAllergies];
                        updatedAllergies[index].severity = e.target.value as "Severe" | "Moderate" | "Low";
                        setPatientInfo((prev) => ({
                          ...prev,
                          medicationAllergies: updatedAllergies,
                        }));
                      }}
                      className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Severe">Severe</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                    <button
                      onClick={() =>
                        setPatientInfo((prev) => ({
                          ...prev,
                          medicationAllergies: prev.medicationAllergies.filter((_, i) => i !== index),
                        }))
                      }
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setPatientInfo((prev) => ({
                      ...prev,
                      medicationAllergies: [
                        ...prev.medicationAllergies,
                        { name: "", severity: "Low" },
                      ],
                    }))
                  }
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Add Allergy
                </button>
              </div>
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
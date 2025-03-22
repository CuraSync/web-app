"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  Upload,
  Loader2,
  Camera,
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
  firstName: string;
  lastName: string;
  address: string;
  bloodType: string;
  bmi: string;
  dateOfBirth: string;
  email: string;
  guardianContactNumber: string;
  guardianRelation: string;
  guardianName: string;
  height: string;
  //medicationAllergies: AllergyItem[];
  nic: string;
  patientId: string;
  phoneNumber: string;
  profilePic: string;
  updateAt: string;
  weight: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
    const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstName: "",
    lastName: "",
    address: "",
    bloodType: "",
    bmi: "",
    dateOfBirth: "",
    email: "",
    guardianContactNumber: "",
    guardianRelation: "",
    guardianName: "",
    height: "",
    //medicationAllergies: [],
    nic: "",
    patientId: "",
    phoneNumber: "",
    profilePic: "",
    updateAt: "",
    weight: "",
  });

  useEffect(() => {
    const initializeSettings = async () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "patient") {
        router.push("/auth/login/patient");
        return;
      }

      try {
        const response = await api.get("/patient/profile");
        const data = response.data as PatientInfo;
        console.log("Raw API Response:", JSON.stringify(data, null, 2));

        // Normalize dateOfBirth to YYYY-MM-DD
        const normalizeDate = (date: string | null | undefined) => {
          if (!date) return "";
          const parsedDate = new Date(date);
          return isNaN(parsedDate.getTime())
            ? ""
            : parsedDate.toISOString().split("T")[0];
        };

        const normalizedData: PatientInfo = {
          firstName: String(data.firstName ?? ""),
          lastName: String(data.lastName ?? ""),
          address: String(data.address ?? ""),
          bloodType: String(data.bloodType ?? ""),
          bmi: String(data.bmi ?? ""),
          dateOfBirth: normalizeDate(data.dateOfBirth),
          email: String(data.email ?? ""),
          guardianContactNumber: String(data.guardianContactNumber ?? ""),
          guardianRelation: String(data.guardianRelation ?? ""),
          guardianName: String(data.guardianName ?? ""),
          height: String(data.height ?? ""),
          // medicationAllergies: Array.isArray(data.medicationAllergies)
          //   ? data.medicationAllergies.map((allergy: any) => ({
          //       name: String(allergy?.name ?? ""),
          //       severity: String(allergy?.severity ?? "Low") as "Severe" | "Moderate" | "Low",
          //     }))
          //   : [],
          nic: String(data.nic ?? ""),
          patientId: String(data.patientId ?? ""),
          phoneNumber: String(data.phoneNumber ?? ""),
          profilePic: String(data.profilePic ?? ""),
          updateAt: String(data.updateAt ?? ""),
          weight: String(data.weight ?? ""),
        };

        setPatientInfo(normalizedData);
        localStorage.setItem("patientData", JSON.stringify(normalizedData));
        console.log("Normalized Data:", JSON.stringify(normalizedData, null, 2));
        setImageUrl(normalizedData.profilePic || null);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, [router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const profileData = {
        firstName: patientInfo.firstName || undefined,
        lastName: patientInfo.lastName || undefined,
        address: patientInfo.address || undefined,
        phoneNumber: patientInfo.phoneNumber || undefined,
        dateOfBirth: patientInfo.dateOfBirth || undefined,
        height: patientInfo.height ? Number(patientInfo.height) : undefined,
        weight: patientInfo.weight ? Number(patientInfo.weight) : undefined,
        bmi: patientInfo.bmi ? parseFloat(patientInfo.bmi) : undefined,
        bloodType: patientInfo.bloodType || undefined,
        //medicationAllergies: patientInfo.medicationAllergies || undefined, 
        guardianName: patientInfo.guardianName || undefined,
        guardianContactNumber: patientInfo.guardianContactNumber || undefined,
        profilePic: imageUrl || undefined,
      };

      console.log("Sending to API:", JSON.stringify(profileData, null, 2));
      const response = await api.post("/patient/profile", profileData);
      setPatientInfo(response.data as PatientInfo); // Update state with backend response
      toast.success("Profile updated successfully");
      localStorage.setItem("patientData", JSON.stringify(response.data));
      router.refresh();
    } catch (error: any) {
      console.error("Save Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };


  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImage(file);
    } else {
      alert("File size should be less than 5MB");
      setImage(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }

  };

  const removeProfilePic = () => {
    setImageUrl(null);
    setPatientInfo((prev) => ({ ...prev, profilePic: "" }));
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

          <div className="p-8 flex-1 flex justify-center items-center">
        <div>
          <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80">
            <div className="relative w-32 h-32">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full object-cover border"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profilePicInput"
              onChange={handleProfilePicChange}
            />
            <label
              htmlFor="profilePicInput"
      
            >
              <Camera className="inline-block mr-2" /> Choose Image
            </label>

            <button
              onClick={handleUpload}
            
              disabled={!image || uploading}
            >
              {uploading ? "Uploading..." : <><Upload className="inline-block mr-2" /> Upload</>}
            </button>
          </div>
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
                name="firstName"
                value={patientInfo.firstName}
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
                name="lastName"
                value={patientInfo.lastName}
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
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Allergies</label>
              {patientInfo.medicationAllergies && patientInfo.medicationAllergies.length > 0 ? (
                patientInfo.medicationAllergies.map((allergy, index) => (
                  <div key={`allergy-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergy.name}
                      onChange={(e) => {
                        const updatedAllergies = [...patientInfo.medicationAllergies];
                        updatedAllergies[index] = { ...updatedAllergies[index], name: e.target.value };
                        setPatientInfo((prev) => ({ ...prev, medicationAllergies: updatedAllergies }));
                      }}
                      placeholder="Allergy name"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={allergy.severity}
                      onChange={(e) => {
                        const updatedAllergies = [...patientInfo.medicationAllergies];
                        updatedAllergies[index] = {
                          ...updatedAllergies[index],
                          severity: e.target.value as "Severe" | "Moderate" | "Low",
                        };
                        setPatientInfo((prev) => ({ ...prev, medicationAllergies: updatedAllergies }));
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
                          medicationAllergies: prev.medicationAllergies.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No allergies added yet</p>
              )}
              <button
                onClick={() =>
                  setPatientInfo((prev) => ({
                    ...prev,
                    medicationAllergies: [
                      ...(prev.medicationAllergies || []),
                      { name: "", severity: "Low" },
                    ],
                  }))
                }
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Allergy
              </button>
            </div> */}
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
    
  );
};

export default SettingsPage;

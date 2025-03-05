"use client";
import React, { useState } from 'react';
import { Users, HelpCircle, Settings as SettingsIcon, Bell, Shield, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import { toast } from 'sonner';

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return {
      patientId: 'PAT12345', // Example static ID
      firstName: savedData.firstName || 'Sarah',
      lastName: savedData.lastName || 'Johnson',
      fullName: savedData.fullName || 'Sarah Johnson',
      email: savedData.email || 'sarah.johnson@example.com',
      nic: '982760149V', // Static NIC
      password: '********', // Placeholder for password
      phone: savedData.phone || '+1 (555) 123-4567',
      address: savedData.address || '123 Main St, City, Country',
      dateOfBirth: savedData.dateOfBirth || '1990-05-15',
      height: savedData.height || '170',
      weight: savedData.weight || '65',
      bmi: savedData.bmi || '22.5',
      bloodType: savedData.bloodType || 'A+',
      medicationAllergies: savedData.medicationAllergies || '',
      guardianName: savedData.guardianName || '',
      guardianContact: savedData.guardianContact || '',
      guardianEmail: savedData.guardianEmail || '',
    };
  });

  // Calculate BMI whenever height or weight changes
  const calculateBMI = (height: string, weight: string) => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '';
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Recalculate BMI if height or weight changes
      if (name === 'height' || name === 'weight') {
        newData.bmi = calculateBMI(
          name === 'height' ? value : prev.height,
          name === 'weight' ? value : prev.weight
        );
      }
      
      return newData;
    });
  };

  const handleSaveProfile = () => {
    localStorage.setItem('patientData', JSON.stringify(profileData));
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };


  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient ID - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={profileData.patientId}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* NIC - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                <input
                  type="text"
                  value={profileData.nic}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* BMI - Calculated */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMI (Calculated)</label>
                <input
                  type="text"
                  value={profileData.bmi}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <input
                  type="text"
                  name="bloodType"
                  value={profileData.bloodType}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              {/* Medication Allergies */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication Allergies</label>
                <input
                  type="text"
                  name="medicationAllergies"
                  value={profileData.medicationAllergies}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                  placeholder="List any medication allergies, separated by commas"
                />
              </div>

              {/* Guardian Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={profileData.guardianName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact Number</label>
                <input
                  type="tel"
                  name="guardianContact"
                  value={profileData.guardianContact}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={profileData.guardianEmail}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
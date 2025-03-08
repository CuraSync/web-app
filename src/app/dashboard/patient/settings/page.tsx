"use client";
import React, { useState, useEffect } from 'react';
import { Users, HelpCircle, LogOut, Settings as SettingsIcon, Upload, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import { toast } from 'sonner';

// Define an interface for allergy items
interface AllergyItem {
  name: string;
  severity: 'Severe' | 'Moderate' | 'Low';
}

const SettingsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [allergies, setAllergies] = useState<AllergyItem[]>([]);
  const [profileData, setProfileData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return {
      patientId: 'PAT12345',
      firstName: savedData.firstName || 'Sarah',
      lastName: savedData.lastName || 'Johnson',
      fullName: savedData.fullName || 'Sarah Johnson',
      email: savedData.email || 'sarah.johnson@example.com',
      nic: '982760149V',
      password: '****',
      phone: savedData.phone || '+1 (555) 123-4567',
      address: savedData.address || '123 Main St, City, Country',
      dateOfBirth: savedData.dateOfBirth || '1990-05-15',
      height: savedData.height || '170',
      weight: savedData.weight || '65',
      bmi: savedData.bmi || '22.5',
      bloodType: savedData.bloodType || 'A+',
      guardianName: savedData.guardianName || '',
      guardianContact: savedData.guardianContact || '',
      guardianEmail: savedData.guardianEmail || '',
      profilePic: savedData.profilePic || '',
    };
  });

  // Initialize allergies from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    if (savedData.allergies && Array.isArray(savedData.allergies)) {
      setAllergies(savedData.allergies);
    } else if (typeof savedData.medicationAllergies === 'string' && savedData.medicationAllergies) {
      // Convert old format to new format
      const allergyItems = savedData.medicationAllergies.split(',').map((name: string) => ({
        name: name.trim(),
        severity: 'Moderate' as const
      }));
      setAllergies(allergyItems);
    } else {
      // Start with an empty allergy item if none exist
      setAllergies([{ name: '', severity: 'Moderate' }]);
    }
  }, []);

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
      // For height and weight, ensure value is not negative
      let newValue = value;
      if ((name === 'height' || name === 'weight') && value !== '') {
        newValue = Math.max(0, parseFloat(value)).toString();
      }

      const newData = { ...prev, [name]: newValue };
      
      // Recalculate BMI if height or weight changes
      if (name === 'height' || name === 'weight') {
        newData.bmi = calculateBMI(
          name === 'height' ? newValue : prev.height,
          name === 'weight' ? newValue : prev.weight
        );
      }
      
      return newData;
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          profilePic: reader.result as string,
        }); 
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle changes to allergy items
  const handleAllergyChange = (index: number, field: 'name' | 'severity', value: string) => {
    const newAllergies = [...allergies];
    newAllergies[index] = {
      ...newAllergies[index],
      [field]: value
    };
    setAllergies(newAllergies);
  };

  // Add a new allergy field
  const addAllergyField = () => {
    setAllergies([...allergies, { name: '', severity: 'Moderate' }]);
  };

  // Remove an allergy field
  const removeAllergyField = (index: number) => {
    if (allergies.length > 1) {
      const newAllergies = allergies.filter((_, i) => i !== index);
      setAllergies(newAllergies);
    }
  };

  const handleSaveProfile = () => {
    // Filter out empty allergy entries
    const filteredAllergies = allergies.filter(item => item.name.trim() !== '');
    
    // Save all data including the allergies array
    localStorage.setItem('patientData', JSON.stringify({
      ...profileData,
      allergies: filteredAllergies
    }));
    
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/auth/login/patient');
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Picture */}
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                {profileData.profilePic ? (
                  <img
                    src={profileData.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-2xl font-semibold">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </span>
                )}
                <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
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
                <p className="text-xl font-medium">{profileData.fullName}</p>
                <p className="text-base text-blue-500">{profileData.email}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6 mb-4">Personal Information</h2>
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
                />
              </div>

              {/* Allergies Section - Modified */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Medication Allergies</label>
                  <button 
                    type="button" 
                    onClick={addAllergyField}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Allergy
                  </button>
                </div>
                
                {allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={allergy.name}
                        onChange={(e) => handleAllergyChange(index, 'name', e.target.value)}
                        placeholder="Allergy name"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-1/3">
                      <select
                        value={allergy.severity}
                        onChange={(e) => handleAllergyChange(index, 'severity', e.target.value as any)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Severe">Severe</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeAllergyField(index)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">Add all medication allergies with their severity levels.</p>
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
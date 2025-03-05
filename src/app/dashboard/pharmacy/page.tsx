"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PharmacySidebar from './sidebar/sidebar';

const PharmacyDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state with data from localStorage or default values
  const [pharmacyInfo, setPharmacyInfo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      name: savedData.name || "MedPlus Pharmacy",
      licenseNumber: savedData.licenseNumber || "PH12345678",
      established: savedData.established || "2010",
      type: savedData.type || "Retail Pharmacy",
    };
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      address: savedData.address || "123 Healthcare Ave, Medical District",
      phone: savedData.phone || "+1 (555) 123-4567",
      email: savedData.email || "info@medpluspharmacy.com",
      website: savedData.website || "www.medpluspharmacy.com",
    };
  });

  const [operatingHours, setOperatingHours] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      weekdays: savedData.weekdays || "8:00 AM - 9:00 PM",
      saturday: savedData.saturday || "9:00 AM - 7:00 PM",
      sunday: savedData.sunday || "10:00 AM - 5:00 PM",
      holidays: savedData.holidays || "10:00 AM - 3:00 PM",
    };
  });

  const [services, setServices] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return savedData.services || [
      { id: 1, name: "Prescription Filling", description: "Quick and accurate prescription services" },
      { id: 2, name: "Medication Counseling", description: "Professional advice on medication usage" },
      { id: 3, name: "Health Screenings", description: "Blood pressure, glucose, and cholesterol tests" },
      { id: 4, name: "Vaccinations", description: "Flu shots and other immunizations" },
      { id: 5, name: "Home Delivery", description: "Free delivery for orders above $30" },
    ];
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return savedData.lastUpdated || "25 Jan 2025";
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'pharmacy') {
      router.push('/auth/login/pharmacy');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <PharmacySidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation */}
        <div className="border-b p-4">
          <div className="inline-block px-4 py-1 bg-green-100 text-green-600 rounded-md text-sm font-medium">Pharmacy</div>
        </div>

        <div className="p-6">
          {/* Pharmacy Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-semibold">{pharmacyInfo.name.split(' ').map((n: string) => n[0]).join('')}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{pharmacyInfo.name}</h2>
                <p className="text-gray-600">License: {pharmacyInfo.licenseNumber}</p>
                <p className="text-gray-600">Established: {pharmacyInfo.established}</p>
                <p className="text-gray-600">Type: {pharmacyInfo.type}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Address:</span> {contactInfo.address}</p>
                <p className="text-gray-600"><span className="font-medium">Phone:</span> {contactInfo.phone}</p>
                <p className="text-gray-600"><span className="font-medium">Email:</span> {contactInfo.email}</p>
                <p className="text-gray-600"><span className="font-medium">Website:</span> {contactInfo.website}</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
              <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Weekdays:</span> {operatingHours.weekdays}</p>
                <p className="text-gray-600"><span className="font-medium">Saturday:</span> {operatingHours.saturday}</p>
                <p className="text-gray-600"><span className="font-medium">Sunday:</span> {operatingHours.sunday}</p>
                <p className="text-gray-600"><span className="font-medium">Holidays:</span> {operatingHours.holidays}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service: { id: number; name: string; description: string }) => (
                <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-4 text-right text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Prescriptions</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">1,248</p>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">856</p>
              <p className="text-xs text-green-500 mt-1">+5% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">24</p>
              <p className="text-xs text-red-500 mt-1">+8% from yesterday</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue (Monthly)</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">$42,580</p>
              <p className="text-xs text-green-500 mt-1">+15% from last month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
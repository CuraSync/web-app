"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Sidebar from './sidebar/sidebar';

const PatientDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state with data from localStorage
  const [patientInfo, setPatientInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
      return {
        name: savedData.fullName || "Sarah Johnson",
        dob: savedData.dateOfBirth || "15 May 1985",
        bloodType: savedData.bloodType || "A+",
        nic: savedData.nic || "", // Add NIC to patient info
      };
    }
    return {
      name: "Sarah Johnson",
      dob: "15 May 1985",
      bloodType: "A+",
      nic: "",
    };
  });

  const [emergencyContact, setEmergencyContact] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
      return {
        name: savedData.emergencyContactName || "Michael Johnson",
        relation: savedData.emergencyContactRelation || "Spouse",
        phone: savedData.emergencyContactPhone || "+1 (555) 876-5432",
      };
    }
    return {
      name: "Michael Johnson",
      relation: "Spouse",
      phone: "+1 (555) 876-5432",
    };
  });

  const [allergies, setAllergies] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
      
      if (savedData.allergies && Array.isArray(savedData.allergies)) {
        return savedData.allergies;
      }
      
      const allergyText = typeof savedData.allergies === 'string' 
        ? savedData.allergies 
        : "Penicillin, Peanuts, Pollen";
        
      return allergyText.split(',').map((item: string, index: number) => ({
        severity: index === 0 ? "Severe" : index === 1 ? "Moderate" : "Mild", 
        type: item.trim().toLowerCase().includes("penicillin") 
          ? "Drug" 
          : item.trim().toLowerCase().includes("peanuts") 
            ? "Food" 
            : "Environmental",
        name: item.trim(),
      }));
    }
    return [];
  });

  const [vitalStats, setVitalStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
      return {
        height: savedData.height ? `${savedData.height} cm` : "170 cm",
        weight: savedData.weight ? `${savedData.weight} kg` : "70 kg",
        bmi: savedData.bmi || "24.2",
      };
    }
    return {
      height: "170 cm",
      weight: "70 kg",
      bmi: "24.2",
    };
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
      return savedData.lastUpdated || "25 Jan 2025";
    }
    return "25 Jan 2025";
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'patient') {
      router.push('/auth/login/patient');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4"></div>
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md">
              Patient
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {patientInfo.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patientInfo.name}</h2>
                <p className="text-gray-600">DOB: {patientInfo.dob}</p>
                <p className="text-gray-600">Blood Type: {patientInfo.bloodType}</p>
                <p className="text-gray-600">NIC: {patientInfo.nic}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">
            {/* Vital Statistics */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Vital Statistics</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Height: {vitalStats.height}</p>
                <p className="text-gray-600">Weight: {vitalStats.weight}</p>
                <p className="text-gray-600">BMI: {vitalStats.bmi}</p>
                <p className="text-gray-400 text-sm mt-4">Last updated: {lastUpdated}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">Name: {emergencyContact.name}</p>
                <p className="text-gray-600">Relation: {emergencyContact.relation}</p>
                <p className="text-gray-600">Phone: {emergencyContact.phone}</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold">Allergies</h3>
            <div className="mt-4 space-y-3">
              {allergies.map((allergy: { severity: string; type: string; name: string }, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`px-2 py-1 ${allergy.severity === 'Severe' ? 'bg-red-500' : allergy.severity === 'Moderate' ? 'bg-yellow-500' : 'bg-gray-500'} text-white text-sm rounded`}>
                    {allergy.severity}
                  </span>
                  <span className="text-gray-600">{allergy.type}: {allergy.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Tracking Dashboard Access */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <p className="text-center text-lg font-medium">Do you want to access your medical tracking Dashboard</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-red-500 text-white rounded-md">Yes</button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md">No</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
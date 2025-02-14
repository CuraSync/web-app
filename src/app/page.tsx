"use client"
import React, { useState } from 'react';
import Navbar from '../../src/app/layout/navbar'; 
import DoctorSignup from '../auth/doctor-signup';
import PatientSignup from '../app/patient-signup/patient-signup';
import PharmacySignup from '../auth/pharmacy/pharmacy-signup';
import LabSignup from '../auth/Lab/Lab-signup';
import { Stethoscope, UserCircle2, Microscope, Syringe } from 'lucide-react';

const Page = () => {
  const [activeForm, setActiveForm] = useState<string>('doctor');

  const userTypes = [
    {
      icon: <Stethoscope className="w-12 h-12 text-indigo-500" />,
      title: "Doctor",
      value: "doctor",
      description: "Access your medical practice dashboard"
    },
    {
      icon: <UserCircle2 className="w-12 h-12 text-indigo-500" />,
      title: "Patient",
      value: "patient",
      description: "Manage your health records and appointments"
    },
    {
      icon: <Microscope className="w-12 h-12 text-indigo-500" />,
      title: "Laboratory",
      value: "lab",
      description: "Manage lab tests and results"
    },
    {
      icon: <Syringe className="w-12 h-12 text-indigo-500" />,
      title: "Pharmacy",
      value: "pharmacy",
      description: "Handle prescriptions and inventory"
    }
  ];

  const renderForm = () => {
    switch (activeForm) {
      case 'doctor':
        return <DoctorSignup />;
      case 'patient':
        return <PatientSignup />;
      case 'lab':
        return <LabSignup />;
      case 'pharmacy':
        return <PharmacySignup />;
      default:
        return <DoctorSignup />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* User Type Selection Buttons */}
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to CuraSync
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {userTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setActiveForm(type.value)}
              className={`p-6 rounded-lg shadow-md transition-all duration-300 ${
                activeForm === type.value 
                  ? 'bg-indigo-50 ring-2 ring-indigo-500' 
                  : 'bg-white hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {type.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {type.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Signup Form Display */}
      <div className="flex-grow flex items-center justify-center px-4">
        {renderForm()}
      </div>
    </div>
  );
};

export default Page;
"use client"
import React from 'react';
import Navbar from '../../src/app/layout/navbar'; 
import DoctorSignup from '../auth/doctor-signup';
import PatientSignup from '../app/patient-signup/patient-signup';
import PharmacySignup from '../auth/pharmacy/pharmacy-signup';
import LabSignup from '../auth/Lab/Lab-signup';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to CuraSync
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          <DoctorSignup />
          <PatientSignup />
          <LabSignup />
          <PharmacySignup />
        </div>
      </div>
    </div>
  );
};

export default Page;

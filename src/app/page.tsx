"use client";
import React from 'react';
import Navbar from '../../src/app/layout/navbar';
import Signup from '../auth/signup';
import PatientSignup from '../app/patient-signup/patient-signup';
import LabSignup from '@/auth/Lab/Lab-signup';
import PharmacySignup from '@/auth/pharmacy/pharmacy-signup';
import UserTypeSelection from '@/auth/selection/user-selection';

const Page = () => {
  const [activeForm, setActiveForm] = React.useState<'doctor' | 'patient' | 'lab' | 'pharmacy' | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {!activeForm ? (
        <div className="flex-grow">
          <UserTypeSelection/>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          {activeForm === 'doctor' && <Signup />}
          {activeForm === 'patient' && <PatientSignup />}
          {activeForm === 'lab' && <LabSignup />}
          {activeForm === 'pharmacy' && <PharmacySignup />}
        </div>
      )}

      {activeForm && (
        <div className="text-center p-4">
          <button
            onClick={() => setActiveForm(null)}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Back to Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;

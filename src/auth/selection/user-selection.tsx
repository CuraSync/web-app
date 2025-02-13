import React from 'react';
import { Stethoscope, UserCircle2, Microscope, Syringe } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserTypeSelection = () => {
  const router = useRouter();

  const userTypes = [
    {
      icon: <Stethoscope className="w-16 h-16 text-indigo-500" />,
      title: "Doctor",
      description: "Access your medical practice dashboard",
      onClick: () => router.push('/auth/signup')
    },
    {
      icon: <UserCircle2 className="w-16 h-16 text-indigo-500" />,
      title: "Patient",
      description: "Manage your health records and appointments",
      onClick: () => router.push('/app/patient-signup/patient-signup')
    },
    {
      icon: <Microscope className="w-16 h-16 text-indigo-500" />,
      title: "Laboratory",
      description: "Manage lab tests and results",
      onClick: () => router.push('/auth/Lab/Lab-signup')
    },
    {
      icon: <Syringe className="w-16 h-16 text-indigo-500" />,
      title: "Pharmacy",
      description: "Handle prescriptions and inventory",
      onClick: () => router.push('/auth/pharmacy/pharmacy-signup')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CuraSync
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Please select your user type to continue
          </p>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4">
          {userTypes.map((type, index) => (
            <button
              key={index}
              onClick={type.onClick}
              className="flex-none w-64 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
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
    </div>
  );
};

export default UserTypeSelection;

"use client";
import React from "react";
import Link from "next/link";
//import Navbar from "../../layout/navbar";
import { FaUserMd, FaUser, FaFlask, FaPrescriptionBottleAlt } from "react-icons/fa";

const UserSelectionPage = () => {
  const accountTypes = [
    {
      href: "/auth/login/doctor",
      icon: (
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      ),
      title: "Doctor",
      description: "Medical professional account",
    },
    {
      href: "/auth/login/patient",
      icon: (
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </div>
      ),
      title: "Patient",
      description: "Patient account for appointments",
    },
    {
      href: "/auth/login/lab",
      icon: (
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 19c-1.1 0-2 .9-2 2h14c0-1.1-.9-2-2-2h-4v-2h3c1.1 0 2-.9 2-2h-8c-1.66 0-3-1.34-3-3 0-1.09.59-2.04 1.47-2.57.41.59 1.06 1 1.83 1.06.7.06 1.36-.19 1.85-.62l.59 1.61.94-.34.34.94 1.88-.68-.34-.94.94-.34-2.74-7.52-.94.34-.34-.94-1.88.68.34.94-.94.34.56 1.55c-.5.33-1.09.52-1.71.55-.23.01-.45.02-.67.07-.44.09-.87.23-1.25.41-.86.41-1.57 1.07-2.07 1.85-.43.67-.69 1.43-.78 2.21-.1.75.03 1.54.37 2 .16.22.35.42.56.6.59.47 1.35.76 2.17.76 1.82 0 3.29-1.46 3.31-3.27h3.94l.76 2.09h3.94z" />
          </svg>
        </div>
      ),
      title: "Laboratory",
      description: "Lab testing facility account",
    },
    {
      href: "/auth/login/pharmacy",
      icon:(
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 19h16v2H4zm5-4h6v3H9zm8-3H7l-3 3v3h2v-3h12v3h2v-3z M11 7h2v7h-2z M7 13h10v2H7z" />
            </svg>
          </div>
        ),
      title: "Pharmacy",
      description: "Pharmacy store account",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to CuraSync
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Choose your account type to continue
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountTypes.map((type, index) => (
            <Link href={type.href} key={index}>
              <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-center items-center mb-4">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelectionPage;

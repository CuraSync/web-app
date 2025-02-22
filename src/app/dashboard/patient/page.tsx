"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Bell, Facebook, Instagram, Mail, PenSquare, Settings, Timer, Twitter, User } from 'lucide-react';



const PatientDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
      <aside className="w-64 border-r p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10">
            <svg viewBox="0 0 40 40" className="text-blue-600 w-full h-full">
              <path d="M20 5C11.716 5 5 11.716 5 20c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z" fill="currentColor" opacity="0.2"/>
              <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-blue-600">CuraSync</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-12 space-y-6">
          <a href="#" className="flex items-center space-x-3 text-gray-600">
            <Timer className="w-5 h-5" />
            <span>TimeLine</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600">
            <BarChart3 className="w-5 h-5" />
            <span>Visualization</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <span>Messaging</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600">
            <Bell className="w-5 h-5" />
            <span>Request</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-600">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        {/* User Profile */}
        <div className="mt-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <span className="text-gray-700">Nithya Kumar</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between">
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Our Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Twitter className="w-5 h-5 text-blue-400" />
              <Facebook className="w-5 h-5 text-blue-600" />
              <Instagram className="w-5 h-5 text-pink-600" />
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <button className="px-4 py-1 border border-purple-600 text-purple-600 rounded-md">
              Patient
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">SJ</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Sarah Johnson</h2>
                <p className="text-gray-600">DOB: 15 May 1985</p>
                <p className="text-gray-600">Blood Type: A+</p>
              </div>
            </div>
            <PenSquare className="text-gray-400 w-5 h-5" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">
            {/* Vital Statistics */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Vital Statistics</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Height: 5'7" (170 cm)</p>
                <p className="text-gray-600">Weight: 145 lbs (65.8 kg)</p>
                <p className="text-gray-600">BMI: 22.7</p>
                <p className="text-gray-600">Blood Pressure: 120/80 mmHg</p>
                <p className="text-gray-600">Temperature: 98.6°F (37°C)</p>
                <p className="text-gray-600">Pulse Rate: 72 bpm</p>
                <p className="text-gray-400 text-sm mt-4">Last updated: 25 Jan 2025</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <PenSquare className="text-gray-400 w-5 h-5" />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">Name: Michael Johnson</p>
                <p className="text-gray-600">Relation: Spouse</p>
                <p className="text-gray-600">Phone: +1 (555) 876-5432</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Allergies</h3>
              <PenSquare className="text-gray-400 w-5 h-5" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">Severe</span>
                <span className="text-gray-600">Drug: Penicillin</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-yellow-500 text-black text-sm rounded">Moderate</span>
                <span className="text-gray-600">Food: Peanuts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-white text-sm rounded">Mild</span>
                <span className="text-gray-600">Environmental: Pollen</span>
              </div>
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
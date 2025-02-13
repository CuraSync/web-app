"use client"

import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';

const LaboratorySignUpForm = () => {
  const [formData, setFormData] = useState({
    laboratoryName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    labRegistration: '',
    address: '',
    workingHours: '',
    tests: {
      bloodTests: false,
      urineAnalysis: false,
      xRay: false,
      mri: false,
      ctScan: false,
      ultrasound: false,
      ecg: false,
      pathology: false,
      microbiology: false
    },
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md flex">
        {/* Left Side - Image */}
        <div className="w-1/3 bg-purple-50 flex items-center justify-center p-8 rounded-l-lg">
          <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center">
            <PlusIcon className="w-16 h-16 text-purple-500" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-2/3 p-8">
          <h2 className="text-2xl font-bold mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-6">Create your Laboratory account and start your journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Registration Number *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours *</label>
              <input
                type="text"
                placeholder="e.g., Mon-Fri 9AM-5PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tests Offered *</label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Blood Tests</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Urine Analysis</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">X-Ray</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">MRI</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">CT Scan</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Ultrasound</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">ECG</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Pathology</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Microbiology</label>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the terms & policy *
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Create Account
            </button>

            <div className="text-center text-gray-500">or</div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
              >
                <img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
              >
                <img src="/api/placeholder/20/20" alt="Apple" className="w-5 h-5" />
                Sign up with Apple
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-purple-600 hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaboratorySignUpForm;
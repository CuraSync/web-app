"use client";
import React, { useState } from 'react';
import SignUpLayout from '@/components/auth/SignUpLayout';
import { toast } from 'sonner';

const LabSignUpPage = () => {
  const [formData, setFormData] = useState({
    laboratoryName: '',
    email: '',
    password: '',
    confirmPassword: '',
    labRegistration: '',
    phone: '',
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
      microbiology: false,
    },
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      if (name.startsWith('tests.')) {
        const testName = name.split('.')[1];
        setFormData({
          ...formData,
          tests: {
            ...formData.tests,
            [testName]: (e.target as HTMLInputElement).checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: (e.target as HTMLInputElement).checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Add your form submission logic here
    toast.success("Account created successfully!");
  };

  return (
    <SignUpLayout
      title="Laboratory Portal"
      description="Join our network of diagnostic centers and provide quality testing services."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Laboratory Name *</label>
            <input
              type="text"
              name="laboratoryName"
              value={formData.laboratoryName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lab Registration Number *</label>
            <input
              type="text"
              name="labRegistration"
              value={formData.labRegistration}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Working Hours *</label>
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
            placeholder="e.g., Mon-Fri 9AM-5PM"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tests Offered *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.tests).map(([test, checked]) => (
              <div key={test} className="flex items-center">
                <input
                  type="checkbox"
                  name={`tests.${test}`}
                  checked={checked}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  {test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            required
          />
          <label className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Terms and Conditions
            </a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Account
          </button>
        </div>
      </form>
    </SignUpLayout>
  );
};

export default LabSignUpPage;
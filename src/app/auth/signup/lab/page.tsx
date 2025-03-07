"use client";
import React, { useState } from 'react';
import SignUpLayout from '@/components/auth/SignUpLayout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LabSignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    labName: '',
    email: '',
    licenceNumber: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    description: '',
    operatingHours: {
      weekdays: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 5:00 PM',
      holidays: '10:00 AM - 3:00 PM',
    },
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOperatingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [name]: value,
      },
    });
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialMediaLinks: {
        ...formData.socialMediaLinks,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate required fields
    const requiredFields = ['labName', 'email', 'licenceNumber', 'password', 'phone', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://curasync-backend.onrender.com/lab/register', {
        labName: formData.labName,
        email: formData.email,
        licenceNumber: formData.licenceNumber,
        password: formData.password,
        phoneNumber: formData.phone,
        location: formData.location
      });

      // Save lab data to localStorage
      localStorage.setItem('labData', JSON.stringify(formData));

      toast.success("Account created successfully!");
      router.push('/auth/login/lab');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("An error occurred during registration");
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpLayout
      title="Laboratory Portal"
      description="Join our network of diagnostic centers and provide quality testing services."
      userType="lab"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Laboratory Name *</label>
            <input
              type="text"
              name="labName"
              value={formData.labName}
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
            <label className="block text-sm font-medium text-gray-700">Licence Number *</label>
            <input
              type="text"
              name="licenceNumber"
              value={formData.licenceNumber}
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
          <label className="block text-sm font-medium text-gray-700">Location *</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Describe your laboratory services and specialties"
          />
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Weekdays ```jsx
              </label>
              <input
                type="text"
                name="weekdays"
                value={formData.operatingHours.weekdays}
                onChange={handleOperatingHoursChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Saturday</label>
              <input
                type="text"
                name="saturday" 
                value={formData.operatingHours.saturday}
                onChange={handleOperatingHoursChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 9:00 AM - 2:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Sunday</label>
              <input
                type="text"
                name="sunday"
                value={formData.operatingHours.sunday}
                onChange={handleOperatingHoursChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Closed"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Holidays</label>
              <input
                type="text"
                name="holidays"
                value={formData.operatingHours.holidays}
                onChange={handleOperatingHoursChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Closed"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
          <div className="space-y-3">
            <input
              type="text"
              name="facebook"
              value={formData.socialMediaLinks.facebook}
              onChange={handleSocialMediaChange}
              placeholder="Facebook URL"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="twitter"
              value={formData.socialMediaLinks.twitter}
              onChange={handleSocialMediaChange}
              placeholder="Twitter URL"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="instagram"
              value={formData.socialMediaLinks.instagram}
              onChange={handleSocialMediaChange}
              placeholder="Instagram URL"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </SignUpLayout>
  );
};

export default LabSignUpPage;
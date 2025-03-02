"use client";

import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { toast } from 'sonner';
import LoginLayout from '@/components/auth/LoginLayout';
import { validateUser } from '@/utils/auth';
import { useRouter } from 'next/navigation';

const PatientLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (validateUser(email, password, 'patient')) {
        localStorage.setItem('userRole', 'patient');
        toast.success("Login successful!");
        router.push('/dashboard/patient');
      } else {
        toast.error("Invalid email or password", {
          duration: 3000,
          position: 'top-center',
          style: { background: '#f44336', color: 'white' }
        });
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout 
      title="Patient Portal" 
      icon={<FaUser />}
      userType="patient"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-blue-500"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label className="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </LoginLayout>
  );
};

export default PatientLogin;
"use client";

import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { toast } from 'sonner';
import LoginLayout from '@/components/auth/LoginLayout';

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

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

    // Add your login logic here
    if (email === "patient@example.com" && password === "password123") {
      toast.success("Login successful!");
      // Add your redirect logic here
    } else {
      toast.error("Invalid credentials");
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
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label className="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Sign in
        </button>
      </form>
    </LoginLayout>
  );
};

export default PatientLogin;
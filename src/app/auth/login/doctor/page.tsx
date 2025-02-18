"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

const Login = () => {
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

    // Validate email and password
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Add your login logic here
    if (email === "doctor@example.com" && password === "password123") {
      toast.success("Login successful!");
      // Add your redirect logic here
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="bg-purple-200 rounded-full p-20">
          <div className="bg-purple-500 w-20 h-20 rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
        <p className="text-gray-600 mb-6">Doctor Login - Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex items-center mb-4 w-full">
            <input
              type="checkbox"
              name="remember"
              className="mr-2"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label>Remember for 30 days</label>
          </div>

          <div className="flex flex-col items-center">
          <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md mt-4 w-80">
            Login
          </button>
        </div>
        </form>

        <div className="flex flex-col items-center w-full">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup/doctor">
              <span className="text-purple-600 cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
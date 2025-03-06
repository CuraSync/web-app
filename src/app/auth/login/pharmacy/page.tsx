"use client";
import React, { useState, useCallback } from "react";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { toast } from "sonner";
import LoginLayout from "@/components/auth/LoginLayout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PharmacyLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setIsLoading(true);

    try {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
      }

      const response = await axios.post(
        "https://curasync-backend.onrender.com/login",
        {
          credential_type: "email",
          credential_data: email,
          role: "pharmacy",
          password: password,
          deviceId: deviceId,
        }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userRole", "pharmacy");
      localStorage.setItem("id", response.data.id);

      toast.success("Login successful!");
      router.push("/dashboard/pharmacy");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Authentication failed");
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  return (
    <LoginLayout title="Pharmacy Portal" icon={<FaPrescriptionBottleAlt />} userType="pharmacy">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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

export default PharmacyLogin;
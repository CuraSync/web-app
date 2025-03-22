"use client";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import Sidebar from "./sidebar/sidebar";
  import { FaUser } from "react-icons/fa";
  import api from "@/utils/api";
  
  // Define the shape of the state object and API response
  interface PatientInfo {
    firstName: string;
    lastName: string;
    fullName: string;
    address: string;
    bloodType: string;
    bmi: string;
    dateOfBirth: string;
    email: string;
    guardianContactNumber: string;
    guardianRelation: string;
    guardianName: string;
    height: string;
    nic: string;
    patientId: string;
    phoneNumber: string;
    profilePic: string;
    updateAt: string;
    weight: string;
  }
  
  interface AllergyItem {
    name: string;
    severity: "Severe" | "Moderate" | "Low";
  }
  
  const PatientDashboard = () => {
    const router = useRouter();
    const [patientInfo, setPatientInfo] = useState<PatientInfo>({
      firstName: "",
      lastName: "",
      fullName: "",
      address: "",
      bloodType: "",
      bmi: "",
      dateOfBirth: "",
      email: "",
      guardianContactNumber: "",
      guardianRelation: "",
      guardianName: "",
      height: "",
      nic: "",
      patientId: "",
      phoneNumber: "",
      profilePic: "",
      updateAt: "",
      weight: "",
    });
  
    // fetchHomeData with proper typing for the API response
    const fetchHomeData = async () => {
      try {
        const response = await api.get("/patient/profile");
        const data = response.data as PatientInfo;
        // Ensure all properties are initialized even if API returns null or undefined
        setPatientInfo({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`,
          address: data.address || "",
          bloodType: data.bloodType || "",
          bmi: data.bmi || "",
          dateOfBirth: data.dateOfBirth || "",
          email: data.email || "",
          guardianContactNumber: data.guardianContactNumber || "",
          guardianRelation: data.guardianRelation || "",
          guardianName: data.guardianName || "",
          height: data.height || "",
          nic: data.nic || "",
          patientId: data.patientId || "",
          phoneNumber: data.phoneNumber || "",
          profilePic: data.profilePic || "",
          updateAt: data.updateAt || "",
          weight: data.weight || "",
        });
      } catch (error) {
        console.error("Request failed:", error);
      }
    };
  
    useEffect(() => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "patient") {
        router.push("/auth/login/patient");
      } else {
        fetchHomeData();
      }
    }, [router]);
  
    return (
      <div className="bg-white min-h-screen flex font-sans">
        {/* Left Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <main className="flex-1">
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4"></div>
              <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
            </div>
          </header>
  
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {patientInfo.profilePic ? (
                  <img
                    src={patientInfo.profilePic}
                    alt={patientInfo.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-blue-600 text-2xl" />
                )}
              </div>
              <div>
                <div>
                  <div>
                    <h2 className="text-xl font-bold">
                      Name: {patientInfo.fullName || `${patientInfo.firstName} ${patientInfo.lastName}`}
                    </h2>
                    <p className="text-gray-600">DOB: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}</p>
                    <p className="text-gray-600">Blood Type: {patientInfo.bloodType}</p>
                    <p className="text-gray-600">NIC: {patientInfo.nic}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-6 grid grid-cols-3 gap-6">
            {/* Vital Statistics */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Vital Statistics</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Height: {patientInfo.height}</p>
                <p className="text-gray-600">Weight: {patientInfo.weight}</p>
                <p className="text-gray-600">BMI: {patientInfo.bmi}</p>
                <p className="text-gray-400 text-sm mt-4">
                  Last updated: {patientInfo.updateAt}
                </p>
              </div>
            </div>
  
            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">Name: {patientInfo.guardianName}</p>
                <p className="text-gray-600">Phone: {patientInfo.guardianContactNumber}</p>
                <p className="text-gray-600">Relation: {patientInfo.guardianRelation}</p>
              </div>
            </div>
          </div>
  
          {/* Medical Tracking Dashboard Access */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <p className="text-center text-lg font-medium">
              Do you want to access your medical tracking Dashboard?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-red-500 text-white rounded-md">
                Yes
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md">
                No
              </button>
            </div>
          </div>
  
        </main>
      </div>
    );
  };
  
  export default PatientDashboard;

  
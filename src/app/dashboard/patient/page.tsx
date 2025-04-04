"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar/sidebar";
import { FaUser } from "react-icons/fa";
import api from "@/utils/api";
import Image from "next/image";

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
  guardianName: string;
  height: string;
  nic: string;
  patientId: string;
  phoneNumber: string;
  profilePic: string;
  updateAt: string;
  weight: string;
  gender: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
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
    guardianName: "",
    height: "",
    nic: "",
    patientId: "",
    phoneNumber: "",
    profilePic: "",
    updateAt: "",
    weight: "",
    gender: "",
  });

  // Chronic disease related articles
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "The Burden of Chronic Disease",
      description: "Learn what are these Chronic Diseases.Be here and get to know about it  .",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10830426/",
      source: "National Institutes of Health"
    },
    {
      id: 2,
      title: "Heart Disease Prevention Strategies",
      description: "Learn about effective ways to prevent cardiovascular diseases.",
      url: "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease",
      source: "American Heart Association"
    },
    {
      id: 3,
      title: "Living with Chronic Pain: A Comprehensive Guide",
      description: "Understanding and managing chronic pain conditions.",
      url: "https://www.mayoclinic.org/diseases-conditions/chronic-pain/symptoms-causes/syc-20350823",
      source: "Mayo Clinic"
    },
    {
      id: 4,
      title: "Asthma Management in Adults",
      description: "Latest guidelines for controlling asthma symptoms.",
      url: "https://www.lung.org/lung-health-diseases/lung-disease-lookup/asthma",
      source: "American Lung Association"
    }
  ]);

  const fetchHomeData = async () => {
    try {
      const response = await api.get("/patient/profile");
      const data = response.data as PatientInfo;
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
        guardianName: data.guardianName || "",
        height: data.height || "",
        nic: data.nic || "",
        patientId: data.patientId || "",
        phoneNumber: data.phoneNumber || "",
        profilePic: data.profilePic || "",
        updateAt: data.updateAt || "",
        weight: data.weight || "",
        gender: data.gender || "",
      });
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    document.title = "Patient Dashboard | CuraSync";
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "patient") {
      router.push("/auth/login/patient");
    } else {
      fetchHomeData();
    }
  }, [router]);

  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Left Sidebar - Fixed Position */}
      <div className="fixed h-screen">
        <Sidebar />
      </div>

      {/* Main Content - With Left Margin to Account for Sidebar */}
      <main className="flex-1 p-6 ml-64">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4"></div>
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          </div>
        </header>

        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start mt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              {patientInfo.profilePic ? (
                <Image
                  src={patientInfo.profilePic}
                  alt={patientInfo.firstName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-blue-600 text-2xl" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Name:{" "}
                {patientInfo.fullName ||
                  `${patientInfo.firstName} ${patientInfo.lastName}`}
              </h2>
              <p className="text-gray-600">
                DOB: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Gender: {patientInfo.gender}</p>
              <p className="text-gray-600">Blood Type: {patientInfo.bloodType}</p>
              <p className="text-gray-600">NIC: {patientInfo.nic}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Vital Statistics */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm border p- niedzielica6">
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
              <p className="text-gray-600">
                Phone: {patientInfo.guardianContactNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Health Articles Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Health Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-lg shadow-sm shadow-inner shadow-blue-100 border-2 border-blue-600 p-6 hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-medium mb-2 font-serif">{article.title}</h4>
                <p className="text-gray-600 mb-4 font-serif italic">{article.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-serif">Source: {article.source}</span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium font-serif"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
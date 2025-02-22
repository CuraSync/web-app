"use client";
import React from "react";
import {
  FaUser,
  FaChartBar,
  FaFlask,
  FaEnvelope,
  FaBell,
  FaCog,
  FaDownload,
  FaSearch,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaUserMd,
} from "react-icons/fa";

const VisualizationPage: React.FC = () => {
  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* ========== LEFT SIDEBAR ========== */}
      <aside className="w-60 border-r border-gray-300 bg-white flex flex-col">
        {/* Logo */}
        <div className="p-4 mb-2">
          {/* Adjust logo or text as needed */}
          <h1 className="text-2xl font-bold text-[#00a2ad]">CuraSync</h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col space-y-4 mt-4 px-4">
          <SidebarItem icon={<FaUserMd />} label="Doctor" />
          <SidebarItem icon={<FaChartBar />} label="TimeLine" />
          <SidebarItem icon={<FaFlask />} label="Visualization" />
          <SidebarItem icon={<FaEnvelope />} label="Messaging" />
          <SidebarItem icon={<FaBell />} label="Notification" />
          <SidebarItem icon={<FaCog />} label="Settings" />
        </nav>
      </aside>

      {/* ========== MAIN CONTENT WRAPPER ========== */}
      <div className="flex-1 flex flex-col bg-[#f9f9f9]">
        {/* ========== TOP NAVBAR ========== */}
        <header className="flex items-center justify-between bg-white py-3 px-6 border-b border-gray-200 shadow-sm">
          {/* Center Nav Links */}
          <div className="flex space-x-6">
            <a className="text-gray-700 hover:text-[#00a2ad]" href="#">
              Home
            </a>
            <a className="text-gray-700 hover:text-[#00a2ad]" href="#">
              About Us
            </a>
            <a className="text-gray-700 hover:text-[#00a2ad]" href="#">
              Our Services
            </a>
            <a className="text-gray-700 hover:text-[#00a2ad]" href="#">
              Contact
            </a>
          </div>

          {/* Right Icons + Patient Button */}
          <div className="flex items-center space-x-5">
            {/* Social Icons (example) */}
            <FaTwitter className="text-gray-600 hover:text-[#00acee] cursor-pointer" />
            <FaFacebookF className="text-gray-600 hover:text-[#3b5998] cursor-pointer" />
            <FaInstagram className="text-gray-600 hover:text-pink-500 cursor-pointer" />

            {/* Patient Button */}
            <button className="px-4 py-2 bg-[#00a2ad] text-white rounded-full hover:bg-[#008a95]">
              Patient
            </button>
          </div>
        </header>

        {/* ========== MAIN CONTENT ========== */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Top row: RBC images on left, “Report Type” & controls on right */}
          <div className="flex flex-wrap items-start">
            {/* RBC Images */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center">
              <img
                src="images/bloodcell.jpg"
                alt="Blood Cells"
                className="max-h-72 object-contain"
              />
            </div>

            {/* Right side: Title, “Visualize” + Download */}
            <div className="w-full md:w-1/2 flex flex-col items-start md:items-end">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Report Type - Full Blood Report
              </h1>

              {/* “Visualize” button + icon */}
              <button className="flex items-center px-4 py-2 mb-4 bg-[#EAF6F9] text-gray-800 rounded-md hover:bg-gray-300">
                Visualize
                <FaSearch className="ml-2 text-gray-600" />
              </button>

              {/* Download your report */}
              <button className="flex items-center px-4 py-2 bg-[#a0a09d] text-white rounded-md hover:bg-[#8F8F8E]">
                <FaDownload className="mr-2" />
                Download your report
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <p className="text-gray-700 mb-4">
              This Report provided is a full blood count (FBC). This mainly shows your:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Red blood cells, which carry oxygen.</li>
              <li>White blood cells, which fight infection.</li>
              <li>Hemoglobin, the oxygen-carrying protein in red blood cells.</li>
              <li>Platelets, which help blood to clot.</li>
            </ul>
          </div>

          {/* Big “report bubble” with RBC/WBC/Hb/Platelets */}
          <div className="bg-[#EAF6F9] mt-8 p-6 rounded-lg shadow-md">
            {/* RBC */}
            <ReportItem
              title="Red Blood Cells (RBC): 4.8 million/µL"
              status="Normal"
              description="Your red blood cell count is within the normal range, indicating good capacity to carry oxygen."
            />

            {/* WBC */}
            <ReportItem
              title="White Blood Cells (WBC): 7,500 cells/µL"
              status="Normal"
              description="Your white blood cell count is normal, meaning your immune system is functioning properly."
            />

            {/* Hemoglobin */}
            <ReportItem
              title="Hemoglobin (Hb): 13.5 g/dL"
              status="Normal"
              description="Your hemoglobin level is in a healthy range, ensuring efficient oxygen transport."
            />

            {/* Platelets */}
            <ReportItem
              title="Platelets: 80,000/µL"
              status="Low"
              description="Your platelet count is on the lower side, so your blood clotting ability may be reduced."
            />
          </div>

          {/* Prompt */}
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-gray-700 mb-4">
              Would you like to add this report data to the Medical Tracking Dashboard?
            </p>
            <div className="flex justify-center space-x-6">
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-red-600">
                Yes
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-red-600">
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== SIDEBAR ITEM COMPONENT ==========
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
  return (
    <a
      href="#"
      className="flex items-center space-x-3 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </a>
  );
};

// ========== REPORT ITEM COMPONENT ==========
interface ReportItemProps {
  title: string;
  status: "Normal" | "Low" | "High" | string;
  description: string;
}
const ReportItem: React.FC<ReportItemProps> = ({ title, status, description }) => {
  // Simplified color logic
  let statusClasses = "text-white bg-gray-500";
  if (status.toLowerCase() === "normal") {
    statusClasses = "text-white bg-green-600";
  } else if (status.toLowerCase() === "low") {
    statusClasses = "text-white bg-red-600";
  } else if (status.toLowerCase() === "high") {
    statusClasses = "text-white bg-yellow-600";
  }

  return (
    <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-start bg-white p-4 rounded-lg shadow-sm">
      <div className="md:w-2/3">
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
      <div className="mt-2 md:mt-0">
        <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${statusClasses}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default VisualizationPage;

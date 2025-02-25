"use client";
import React from 'react';
import { Search, Bell, Settings, Download as FaDownload } from 'lucide-react';

const VisualizationPage = () => {
  return (
    <div className="p-8">
      {/* Top row: RBC images on left, "Report Type" & controls on right */}
      <div className="flex flex-wrap items-start">
        {/* RBC Images */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center">
          <img
            src="/assets/images/bloodcell.jpg"
            alt="Blood Cells"
            className="max-h-72 object-contain"
          />
        </div>

        {/* Right side: Title, "Visualize" + Download */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-end">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Report Type - Full Blood Report
          </h1>

          {/* "Visualize" button + icon */}
          <button className="flex items-center px-4 py-2 mb-4 bg-[#EAF6F9] text-gray-800 rounded-md hover:bg-gray-300">
            Visualize
            <Search className="ml-2 text-gray-600" />
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

      {/* Big "report bubble" with RBC/WBC/Hb/Platelets */}
      <div className="bg-[#EAF6F9] mt-8 p-6 rounded-lg shadow-md">
        <ReportItem
          title="Red Blood Cells (RBC): 4.8 million/µL"
          status="Normal"
          description="Your red blood cell count is within the normal range, indicating good capacity to carry oxygen."
        />

        <ReportItem
          title="White Blood Cells (WBC): 7,500 cells/µL"
          status="Normal"
          description="Your white blood cell count is normal, meaning your immune system is functioning properly."
        />

        <ReportItem
          title="Hemoglobin (Hb): 13.5 g/dL"
          status="Normal"
          description="Your hemoglobin level is in a healthy range, ensuring efficient oxygen transport."
        />

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
  );
};

// ========== REPORT ITEM COMPONENT ==========
interface ReportItemProps {
  title: string;
  status: "Normal" | "Low" | "High" | string;
  description: string;
}

const ReportItem: React.FC<ReportItemProps> = ({ title, status, description }) => {
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
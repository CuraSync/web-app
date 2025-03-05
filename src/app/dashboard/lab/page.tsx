"use client"

import { useState } from "react"
import { PenSquare } from "lucide-react"
import Sidebar from "../../dashboard/lab/sidebar/sidebar"

export default function LabDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation */}
        <div className="border-b p-4">
          <div className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-md text-sm font-medium">Laboratory</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Lab Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-medium text-2xl">
                CL
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-medium">City Lab</h1>
                    <p className="text-sm text-gray-600">License: LAB12345678</p>
                    <p className="text-sm text-gray-600">Accreditation: ISO 9001</p>
                    <p className="text-sm text-gray-600">Specialization: Clinical Lab</p>
                  </div>
                  <button className="text-gray-400" title="Edit">
                    <PenSquare size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Reusable Section Component Example */}
            <Section title="Contact Information">
              <p><span className="font-medium">Address:</span> 123 Medical Center, Health City</p>
              <p><span className="font-medium">Phone:</span> +1 (555) 987-6543</p>
              <p><span className="font-medium">Email:</span> info@citylab.com</p>
              <p><span className="font-medium">Website:</span> www.citylab.com</p>
            </Section>

            <Section title="Operating Hours">
              <p><span className="font-medium">Weekdays:</span> 9:00 AM - 6:00 PM</p>
              <p><span className="font-medium">Saturday:</span> 10:00 AM - 5:00 PM</p>
              <p><span className="font-medium">Sunday:</span> Closed</p>
            </Section>

            {/* Services Offered */}
            <Section title="Services Offered">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { name: "Blood Tests", desc: "Routine blood analysis and testing" },
                  { name: "X-rays", desc: "Imaging services for bone and tissue analysis" },
                  { name: "CT Scans", desc: "Detailed cross-sectional imaging" },
                ].map((service, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <div className="text-right text-xs text-gray-500 mb-4">Last updated: 25 Jan 2025</div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Total Tests", value: "2,547", trend: "+8% this month", color: "text-green-500" },
                { title: "Active Patients", value: "1,203", trend: "+3% this month", color: "text-green-500" },
                { title: "Pending Results", value: "42", trend: "-5% from yesterday", color: "text-red-500" },
                { title: "Revenue (Monthly)", value: "$78,350", trend: "+10% this month", color: "text-green-500" },
              ].map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-xs text-gray-500 mb-1">{stat.title}</h3>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Section Component
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6 border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">{title}</h2>
        <button className="text-gray-400" title="Edit">
          <PenSquare size={16} />
        </button>
      </div>
      <div className="text-sm space-y-1">{children}</div>
    </div>
  )
}

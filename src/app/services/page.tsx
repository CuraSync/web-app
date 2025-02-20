"use client";
import React from 'react';
import { FaUserMd, FaUser, FaFlask, FaPrescriptionBottleAlt } from "react-icons/fa";

const ServicesPage = () => {
  const services = [
    {
      icon: <FaUserMd className="w-12 h-12 text-purple-600" />,
      title: "For Doctors",
      description: "Streamline your practice with our comprehensive doctor portal",
      features: [
        "Patient management system",
        "Appointment scheduling",
        "Digital prescription writing",
        "Medical records management"
      ]
    },
    {
      icon: <FaUser className="w-12 h-12 text-purple-600" />,
      title: "For Patients",
      description: "Take control of your healthcare journey",
      features: [
        "Book appointments online",
        "Access medical records",
        "View prescriptions",
        "Lab test tracking"
      ]
    },
    {
      icon: <FaFlask className="w-12 h-12 text-purple-600" />,
      title: "For Laboratories",
      description: "Efficient lab management and result delivery",
      features: [
        "Test order management",
        "Digital result delivery",
        "Inventory management",
        "Patient history tracking"
      ]
    },
    {
      icon: <FaPrescriptionBottleAlt className="w-12 h-12 text-purple-600" />,
      title: "For Pharmacies",
      description: "Streamline your pharmacy operations",
      features: [
        "Digital prescription processing",
        "Inventory management",
        "Patient medication history",
        "Automated refill reminders"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Our Services</h1>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive healthcare solutions for all stakeholders
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  {service.icon}
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">{service.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Phone, Calendar } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';

const DoctorsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Williams",
      specialty: "Cardiologist",
      hospital: "Central Hospital",
      experience: "12 years",
      availability: "Mon, Wed, Fri",
      rating: 4.8,
      image: "SW"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      hospital: "City Medical Center",
      experience: "15 years",
      availability: "Tue, Thu, Sat",
      rating: 4.9,
      image: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      hospital: "Children's Hospital",
      experience: "8 years",
      availability: "Mon, Tue, Thu",
      rating: 4.7,
      image: "ER"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      hospital: "Orthopedic Institute",
      experience: "20 years",
      availability: "Wed, Fri, Sat",
      rating: 4.9,
      image: "JW"
    }
  ];

  // Filter doctors based on search query and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter dropdown
  const specialties = ['All Specialties', ...new Set(doctors.map(doctor => doctor.specialty))];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Doctors</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Add New Doctor
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-grow max-w-2xl">
              <input
                type="text"
                placeholder="Search by name, specialty, or hospital"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {doctor.image}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                    <p className="text-gray-500 text-sm">{doctor.hospital}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Experience:</span> {doctor.experience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Availability:</span> {doctor.availability}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Rating:</span> 
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>Call</span>
                  </button>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Plus, X, Filter, UserPlus } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  experience: string;
  availability: string[];
  rating: number;
  image: string;
  initials?: string;
}

interface SentRequest {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  hospital: string;
  status: string;
  timestamp: string;
}

const DoctorsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  
  // Search fields for the add doctor modal
  const [doctorNameSearch, setDoctorNameSearch] = useState('');
  const [doctorSpecialtySearch, setDoctorSpecialtySearch] = useState('');
  const [doctorHospitalSearch, setDoctorHospitalSearch] = useState('');

  // Get connected doctors from localStorage or use default
  const [connectedDoctors, setConnectedDoctors] = useState<Doctor[]>(() => {
    if (typeof window !== 'undefined') {
      const savedDoctors = localStorage.getItem('connectedDoctors');
      return savedDoctors ? JSON.parse(savedDoctors) : [];
    }
    return [];
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Save connected doctors to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectedDoctors', JSON.stringify(connectedDoctors));
    }
  }, [connectedDoctors]);

  // Sample doctors data (these are doctors already in your network)
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Williams",
      specialty: "Cardiologist",
      hospital: "Central Hospital",
      experience: "12 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.8,
      image: "SW"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      hospital: "City Medical Center",
      experience: "15 years",
      availability: ["Tue", "Thu", "Sat"],
      rating: 4.9,
      image: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      hospital: "Children's Hospital",
      experience: "8 years",
      availability: ["Mon", "Tue", "Thu"],
      rating: 4.7,
      image: "ER"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      hospital: "Orthopedic Institute",
      experience: "20 years",
      availability: ["Wed", "Fri", "Sat"],
      rating: 4.9,
      image: "JW"
    }
  ];

  // Sample database of all doctors (for search in the add doctor modal)
  const allDoctors: Doctor[] = [
    ...doctors,
    {
      id: 5,
      name: "Dr. Robert Johnson",
      specialty: "Dermatologist",
      hospital: "Skin Care Center",
      experience: "10 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.6,
      image: "RJ",
      initials: "RJ"
    },
    {
      id: 6,
      name: "Dr. Lisa Thompson",
      specialty: "Gynecologist",
      hospital: "Women's Health Clinic",
      experience: "14 years",
      availability: ["Tue", "Thu"],
      rating: 4.9,
      image: "LT",
      initials: "LT"
    },
    {
      id: 7,
      name: "Dr. David Kim",
      specialty: "Psychiatrist",
      hospital: "Mental Health Institute",
      experience: "12 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.7,
      image: "DK",
      initials: "DK"
    },
    {
      id: 8,
      name: "Dr. Maria Garcia",
      specialty: "Endocrinologist",
      hospital: "Diabetes Care Center",
      experience: "9 years",
      availability: ["Tue", "Thu", "Sat"],
      rating: 4.8,
      image: "MG",
      initials: "MG"
    },
    {
      id: 9,
      name: "Dr. John Smith",
      specialty: "Ophthalmologist",
      hospital: "Vision Care Center",
      experience: "16 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.5,
      image: "JS",
      initials: "JS"
    },
    {
      id: 10,
      name: "Dr. Amanda Lee",
      specialty: "Rheumatologist",
      hospital: "Arthritis & Rheumatology Center",
      experience: "11 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.7,
      image: "AL",
      initials: "AL"
    },
    {
      id: 11,
      name: "Dr. Thomas Wright",
      specialty: "Pulmonologist",
      hospital: "Respiratory Care Institute",
      experience: "13 years",
      availability: ["Tue", "Thu", "Sat"],
      rating: 4.8,
      image: "TW",
      initials: "TW"
    },
    {
      id: 12,
      name: "Dr. Sophia Patel",
      specialty: "Gastroenterologist",
      hospital: "Digestive Health Center",
      experience: "9 years",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.6,
      image: "SP",
      initials: "SP"
    }
  ].filter(doctor => 
    // Filter out doctors that are already in the connected doctors list
    !connectedDoctors.some(d => d.id === doctor.id) && 
    !doctors.some(d => d.id === doctor.id)
  );

  // Filter doctors based on search query and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Search results for the add doctor modal
  const searchResults = allDoctors.filter(doctor => {
    const matchesName = doctorNameSearch ? 
      doctor.name.toLowerCase().includes(doctorNameSearch.toLowerCase()) : true;
    
    const matchesSpecialty = doctorSpecialtySearch ? 
      doctor.specialty.toLowerCase().includes(doctorSpecialtySearch.toLowerCase()) : true;
    
    const matchesHospital = doctorHospitalSearch ? 
      doctor.hospital.toLowerCase().includes(doctorHospitalSearch.toLowerCase()) : true;
    
    // Return true if at least one search field is filled and matches
    return (matchesName && matchesSpecialty && matchesHospital) && 
           (doctorNameSearch || doctorSpecialtySearch || doctorHospitalSearch);
  });

  // Get unique specialties for filter dropdown
  const specialties = ['All Specialties', ...new Set(doctors.map(doctor => doctor.specialty))];

  const handleSendFriendRequest = (doctor: Doctor) => {
    // Check if request already sent
    if (sentRequests.some(req => req.doctorId === doctor.id)) {
      toast.error(`You've already sent a request to ${doctor.name}`);
      return;
    }

    // Add to sent requests
    const newRequest: SentRequest = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };

    setSentRequests([...sentRequests, newRequest]);

    // Show success message
    toast.success(`Friend request sent to ${doctor.name}`);

    // Clear search fields
    setDoctorNameSearch('');
    setDoctorSpecialtySearch('');
    setDoctorHospitalSearch('');
  };

  const handleMessageClick = (doctor: Doctor) => {
    // Navigate to messages page with doctor ID
    router.push(`/dashboard/doctor/messages?doctorId=${doctor.id}`);
  };

  const clearSearchFields = () => {
    setDoctorNameSearch('');
    setDoctorSpecialtySearch('');
    setDoctorHospitalSearch('');
  };

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
            <button 
              onClick={() => setShowAddDoctorModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
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
            {filteredDoctors.length === 0 ? (
              <div className="col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
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
                      <span className="font-medium mr-2">Availability:</span> {doctor.availability.join(', ')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Rating:</span> 
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button 
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={() => handleMessageClick(doctor)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sent Requests Section */}
          {sentRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Sent Friend Requests</h2>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="divide-y">
                  {sentRequests.map((request) => (
                    <div key={request.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-800">
                            <span className="font-medium">{request.doctorName}</span>
                          </p>
                          <p className="text-sm text-gray-600">{request.specialty} at {request.hospital}</p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Pending
                            </span>
                            <span className="text-gray-500 text-sm ml-2">{request.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Add Doctor Modal */}
          {showAddDoctorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Doctor</h2>
                  <button 
                    onClick={() => {
                      setShowAddDoctorModal(false);
                      clearSearchFields();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Search for doctors by name, specialty, or hospital. You can fill one or more fields.
                  </p>
                  
                  {/* Doctor Name Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by doctor name"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={doctorNameSearch}
                        onChange={(e) => setDoctorNameSearch(e.target.value)}
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                  
                  {/* Specialty Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by specialty"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={doctorSpecialtySearch}
                        onChange={(e) => setDoctorSpecialtySearch(e.target.value)}
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                  
                  {/* Hospital Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by hospital"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={doctorHospitalSearch}
                        onChange={(e) => setDoctorHospitalSearch(e.target.value)}
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
                
                {/* Search Results */}
                <div className="max-h-60 overflow-y-auto mb-4">
                  {searchResults.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      {doctorNameSearch || doctorSpecialtySearch || doctorHospitalSearch 
                        ? "No matching doctors found" 
                        : "Enter doctor name, specialty, or hospital to search"}
                    </p>
                  ) : (
                    <div className="divide-y">
                      {searchResults.map((doctor) => (
                        <div key={doctor.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {doctor.initials || doctor.image}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{doctor.name}</p>
                              <div className="flex flex-col text-sm text-gray-500">
                                <span>{doctor.specialty}</span>
                                <span>{doctor.hospital}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              handleSendFriendRequest(doctor);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Send Request
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddDoctorModal(false);
                      clearSearchFields();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
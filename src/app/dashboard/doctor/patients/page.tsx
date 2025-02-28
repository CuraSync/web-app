"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock, RotateCw } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';

const PatientsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [sortBy, setSortBy] = useState('Priority');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Sample patient data
  const patients = [
    {
      id: 1,
      priority: 'High',
      initials: 'NK',
      name: 'Nithya kumar',
      patientNumber: '4782640981',
      gender: 'Female',
      lastVisit: '04/10/2023',
      timeOfVisit: '02:00pm',
      reason: 'Monthly checkup',
      chatStatus: true
    },
    {
      id: 2,
      priority: 'Medium',
      initials: 'VP',
      name: 'Varun P',
      patientNumber: '4782640981',
      gender: 'Male',
      lastVisit: '04/10/2023',
      timeOfVisit: '01:00 pm',
      reason: 'Consultation',
      chatStatus: false
    }
  ];

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter(patient => {
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.patientNumber.includes(searchQuery);
    
    // Gender filter
    const matchesGender = selectedGender === 'All Genders' || patient.gender === selectedGender;
    
    // Priority filter
    const matchesPriority = selectedPriority === 'All Priorities' || patient.priority === selectedPriority;
    
    return matchesSearch && matchesGender && matchesPriority;
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Main Dashboard Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Patients</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Add New Patient
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-grow max-w-2xl">
              <input
                type="text"
                placeholder="Search by name or number"
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
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Sort by Priority</option>
              <option>Sort by Name</option>
              <option>Sort by Last Visit</option>
            </select>
          </div>
          
          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time of Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chat Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {patient.initials}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patientNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.timeOfVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-6 w-12 rounded-full flex items-center ${patient.chatStatus ? 'bg-blue-100' : 'bg-gray-200'}`}>
                          <div className={`h-5 w-5 rounded-full transform transition-transform duration-200 ease-in-out ${patient.chatStatus ? 'bg-blue-500 translate-x-6' : 'bg-gray-400 translate-x-1'}`}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {patient.chatStatus ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                        View Profile
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Clock className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <RotateCw className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientsPage;
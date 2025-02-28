"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock, ArrowRightLeft, X, Search, UserPlus } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

// Define interfaces for type safety
interface Patient {
  id: number;
  priority: string;
  initials: string;
  name: string;
  patientNumber: string;
  gender: string;
  lastVisit: string;
  timeOfVisit: string;
  reason: string;
  chatStatus: boolean;
  age?: number;
  email?: string;
  contactNumber?: string;
}

interface SentRequest {
  id: number;
  patientId: number;
  patientName: string;
  status: string;
  timestamp: string;
}

const PatientsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [sortBy, setSortBy] = useState('Priority');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientNumber, setPatientNumber] = useState('');
  
  // Track sent requests
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);

  // Default patients
  const defaultPatients: Patient[] = [
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

  // Get patients from localStorage or use default
  const [patients, setPatients] = useState<Patient[]>(() => {
    const savedPatients = localStorage.getItem('doctorPatients');
    return savedPatients ? 
      [...defaultPatients, ...JSON.parse(savedPatients)] : 
      defaultPatients;
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Check for new patients added from notifications
  useEffect(() => {
    const savedPatients = localStorage.getItem('doctorPatients');
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients);
      // Update patients list with any new patients from localStorage
      setPatients([...defaultPatients, ...parsedPatients]);
    }
  }, []);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    // Only save the non-default patients
    const nonDefaultPatients = patients.filter(
      patient => !defaultPatients.some(dp => dp.id === patient.id)
    );
    localStorage.setItem('doctorPatients', JSON.stringify(nonDefaultPatients));
  }, [patients]);

  // Sample database of all patients (for search)
  const allPatients: Patient[] = [
    ...patients,
    {
      id: 3,
      initials: 'EJ',
      name: 'Emily Johnson',
      patientNumber: '1234567890',
      gender: 'Female',
      age: 32,
      email: 'emily.johnson@example.com',
      reason: '',
      lastVisit: '',
      timeOfVisit: '',
      priority: 'Medium',
      chatStatus: false
    },
    {
      id: 4,
      initials: 'DC',
      name: 'David Chen',
      patientNumber: '9876543210',
      gender: 'Male',
      age: 45,
      email: 'david.chen@example.com',
      reason: '',
      lastVisit: '',
      timeOfVisit: '',
      priority: 'Medium',
      chatStatus: false
    },
    {
      id: 5,
      initials: 'MR',
      name: 'Maria Rodriguez',
      patientNumber: '5556667777',
      gender: 'Female',
      age: 28,
      email: 'maria.rodriguez@example.com',
      reason: '',
      lastVisit: '',
      timeOfVisit: '',
      priority: 'Medium',
      chatStatus: false
    }
  ].filter(patient => 
    // Filter out patients that are already in the patients list
    !patients.some(p => 
      p.name === patient.name && 
      p.patientNumber === patient.patientNumber
    )
  );

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter(patient => {
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (patient.patientNumber && patient.patientNumber.includes(searchQuery));
    
    // Gender filter
    const matchesGender = selectedGender === 'All Genders' || patient.gender === selectedGender;
    
    // Priority filter
    const matchesPriority = selectedPriority === 'All Priorities' || patient.priority === selectedPriority;
    
    return matchesSearch && matchesGender && matchesPriority;
  });

  // Search results for the add patient modal
  const searchResults = patientSearchQuery || patientNumber
    ? allPatients.filter(patient => {
        const matchesName = patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase());
        const matchesNumber = patient.patientNumber && patient.patientNumber.includes(patientNumber);
        return matchesName || matchesNumber;
      })
      .filter(patient => !patients.some(p => p.id === patient.id)) // Exclude existing patients
    : [];

  const handleSendInvitation = (patient: Patient) => {
    // Check if request already sent
    if (sentRequests.some(req => req.patientId === patient.id)) {
      toast.error(`You've already sent a request to ${patient.name}`);
      return;
    }

    // Add to sent requests
    setSentRequests([
      ...sentRequests,
      {
        id: Date.now(),
        patientId: patient.id,
        patientName: patient.name,
        status: 'pending',
        timestamp: new Date().toLocaleString()
      }
    ]);

    // Show success message
    toast.success(`Request sent to ${patient.name}`);

    // In a real app, this would send a notification to the patient
    // and store the request in a database
  };

  const handleMessageClick = (patient: Patient) => {
    // Navigate to messages page with patient ID
    router.push(`/dashboard/doctor/messages?patientId=${patient.id}`);
  };

  const handleTimelineClick = (patient: Patient) => {
    // Navigate to the patient's timeline page
    router.push(`/dashboard/doctor/patient-timeline/${patient.id}`);
  };

  const handleTransferClick = (patient: Patient) => {
    // In a real app, this would open a transfer request modal
    toast.info(`Preparing transfer request for ${patient.name}`);
  };

  // Toggle chat status for a patient
  const toggleChatStatus = (patientId: number) => {
    const updatedPatients = patients.map(patient => {
      if (patient.id === patientId) {
        const newStatus = !patient.chatStatus;
        // Show toast notification
        toast.success(`Chat ${newStatus ? 'enabled' : 'disabled'} for ${patient.name}`);
        return { ...patient, chatStatus: newStatus };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Dashboard Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Patients</h1>
            <button 
              onClick={() => setShowAddPatientModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
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
          
          {/* Patients Table - Responsive */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Number
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chat
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-center text-gray-500">
                      No patients found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                            {patient.initials}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.patientNumber}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.gender}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastVisit}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.timeOfVisit}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.reason}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleChatStatus(patient.id)}
                            className={`h-5 w-10 rounded-full flex items-center ${patient.chatStatus ? 'bg-blue-100' : 'bg-gray-200'}`}
                          >
                            <div className={`h-4 w-4 rounded-full transform transition-transform duration-200 ease-in-out ${patient.chatStatus ? 'bg-blue-500 translate-x-5' : 'bg-gray-400 translate-x-1'}`}></div>
                          </button>
                          <span className="ml-2 text-xs text-gray-500">
                            {patient.chatStatus ? 'On' : 'Off'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button className="px-2 py-1 text-xs border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                          View Profile
                        </button>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className={`text-gray-500 hover:text-blue-600 transition-colors ${!patient.chatStatus && 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => patient.chatStatus ? handleMessageClick(patient) : toast.error(`Chat is disabled for ${patient.name}`)}
                            title={patient.chatStatus ? "Message" : "Chat is disabled"}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-green-600 transition-colors"
                            onClick={() => handleTimelineClick(patient)}
                            title="Timeline"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-purple-600 transition-colors"
                            onClick={() => handleTransferClick(patient)}
                            title="Transfer Patient"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sent Requests Section */}
          {sentRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Sent Patient Requests</h2>
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
                            <span className="font-medium">{request.patientName}</span>
                          </p>
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
          
          {/* Add Patient Modal */}
          {showAddPatientModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Search Patient</h2>
                  <button 
                    onClick={() => setShowAddPatientModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter patient number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={patientNumber}
                    onChange={(e) => setPatientNumber(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                
                {/* Search Results */}
                <div className="max-h-60 overflow-y-auto mb-4">
                  {searchResults.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      {patientSearchQuery || patientNumber 
                        ? "No matching patients found" 
                        : "Enter patient details to search"}
                    </p>
                  ) : (
                    <div className="divide-y">
                      {searchResults.map((patient) => (
                        <div key={patient.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                              {patient.initials}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{patient.name}</p>
                              <div className="flex space-x-4 text-sm text-gray-500">
                                <span>ID: {patient.patientNumber}</span>
                                <span>{patient.gender}</span>
                                {patient.age && <span>{patient.age} years</span>}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSendInvitation(patient)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Send Invitation
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddPatientModal(false)}
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

export default PatientsPage;
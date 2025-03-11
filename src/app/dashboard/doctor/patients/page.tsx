"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock, ArrowRightLeft, X, Search, UserPlus } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  experience: string;
  availability: string[];
  rating: number;
  image: string;
}

interface TransferRequest {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  reason: string;
  details?: string;
  priority: string;
  status: string;
  timestamp: string;
  fromDoctor?: string;
  fromSpecialty?: string;
  hospital?: string;
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
  
  // Transfer patient modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [transferReason, setTransferReason] = useState('');
  const [transferDetails, setTransferDetails] = useState('');
  const [transferPriority, setTransferPriority] = useState('Medium');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  
  // Track sent requests
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [sentTransferRequests, setSentTransferRequests] = useState<TransferRequest[]>([]);

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

  // Sample doctors data
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

  // Filter doctors based on search query
  const filteredDoctors = doctorSearchQuery
    ? doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(doctorSearchQuery.toLowerCase())
      )
    : doctors;

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
    // Open the transfer modal and set the selected patient
    setSelectedPatient(patient);
    setShowTransferModal(true);
    // Set default priority based on patient's current priority
    setTransferPriority(patient.priority);
  };

  const handleSendTransferRequest = () => {
    if (!selectedPatient) return;
    if (!selectedDoctor) {
      toast.error("Please select a doctor to transfer to");
      return;
    }
    if (!transferReason.trim()) {
      toast.error("Please provide a reason for the transfer");
      return;
    }

    // Find the selected doctor
    const doctor = doctors.find(d => d.name === selectedDoctor);
    if (!doctor) return;

    // Create a new transfer request
    const newTransferRequest: TransferRequest = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      reason: transferReason,
      details: transferDetails,
      priority: transferPriority,
      status: 'pending',
      timestamp: new Date().toLocaleString(),
      fromDoctor: "Dr. James Martin",
      fromSpecialty: "General Practitioner",
      hospital: "City Hospital"
    };

    // Add to sent transfer requests
    setSentTransferRequests([...sentTransferRequests, newTransferRequest]);

    // Show success message
    toast.success(`Transfer request for ${selectedPatient.name} sent to ${doctor.name}`);

    // Close the modal and reset fields
    setShowTransferModal(false);
    setSelectedPatient(null);
    setSelectedDoctor('');
    setTransferReason('');
    setTransferDetails('');
    setDoctorSearchQuery('');
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
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

          {/* Sent Transfer Requests Section */}
          {sentTransferRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Sent Transfer Requests</h2>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="divide-y">
                  {sentTransferRequests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold text-lg">{request.patientName}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              request.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : request.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {request.priority} Priority
                            </span>
                          </div>
                          <p className="text-gray-600">From: {request.fromDoctor} ({request.fromSpecialty})</p>
                          <p className="text-gray-600">To: {request.doctorName}</p>
                          <p className="text-gray-600">Hospital: {request.hospital}</p>
                          <p className="text-gray-600">Reason: {request.reason}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Pending
                          </span>
                        </div>
                      </div>
                      {request.details && (
                        <div className="bg-gray-50 p-3 rounded-md text-gray-700 mt-2">
                          {request.details}
                        </div>
                      )}
                      <p className="text-gray-500 text-sm mt-2">Requested on: {request.timestamp}</p>
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

          {/* Transfer Patient Modal */}
          {showTransferModal && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Transfer Patient</h2>
                  <button 
                    onClick={() => {
                      setShowTransferModal(false);
                      setSelectedPatient(null);
                      setSelectedDoctor('');
                      setTransferReason('');
                      setTransferDetails('');
                      setDoctorSearchQuery('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 font-medium">
                    Transferring patient: <span className="text-blue-600">{selectedPatient.name}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Doctor
                  </label>
                  
                  {/* Doctor Search */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Doctor Selection Dropdown */}
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  >
                    <option value="">Select a doctor</option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Details (if selected) */}
                {selectedDoctor && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const doctor = doctors.find(d => d.name === selectedDoctor);
                      if (!doctor) return null;
                      
                      return (
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {doctor.image}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-gray-600">{doctor.specialty}</p>
                            <p className="text-gray-600">{doctor.hospital}</p>
                            <p className="text-gray-500 text-sm">{doctor.experience}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Priority Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={transferPriority}
                    onChange={(e) => setTransferPriority(e.target.value)}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Transfer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Requires specialized cardiac care"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    placeholder="Please provide additional details about the transfer"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={transferDetails}
                    onChange={(e) => setTransferDetails(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      setSelectedPatient(null);
                      setSelectedDoctor('');
                      setTransferReason('');
                      setTransferDetails('');
                      setDoctorSearchQuery('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendTransferRequest}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!selectedDoctor || !transferReason.trim()}
                  >
                    Send Transfer Request
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
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Bell } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

interface DoctorRequest {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  timestamp: string;
  initials: string;
}

interface TransferRequest {
  id: number;
  patientName: string;
  priority: string;
  fromDoctor: string;
  fromSpecialty: string;
  hospital: string;
  reason: string;
  details: string;
  timestamp: string;
}

interface PatientAddRequest {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  email: string;
  reason: string;
  timestamp: string;
  initials: string;
}

interface SentNotification {
  id: number;
  recipient: string;
  message: string;
  timestamp: string;
}

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

const NotificationPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctor');
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequest[]>([
    {
      id: 1,
      name: "Dr. Robert Smith",
      specialty: "Orthopedic Surgeon",
      hospital: "Central Medical Center",
      timestamp: "Feb 15, 04:00 PM",
      initials: "RS"
    },
    {
      id: 2,
      name: "Dr. Lisa Anderson",
      specialty: "Dermatologist",
      hospital: "Skin Care Clinic",
      timestamp: "Feb 14, 09:15 PM",
      initials: "LA"
    }
  ]);

  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([
    {
      id: 1,
      patientName: "John Doe",
      priority: "High",
      fromDoctor: "Dr. Michael Brown",
      fromSpecialty: "General Practitioner",
      hospital: "City Hospital",
      reason: "Requires specialized cardiac care",
      details: "Patient has a history of cardiac issues and requires immediate specialized care.",
      timestamp: "Feb 15, 02:30 PM"
    },
    {
      id: 2,
      patientName: "Sarah Wilson",
      priority: "Medium",
      fromDoctor: "Dr. Emma Davis",
      fromSpecialty: "Internal Medicine",
      hospital: "Medical Center",
      reason: "Follow-up care for chronic condition",
      details: "Patient with diabetes requiring ongoing specialized care and monitoring.",
      timestamp: "Feb 14, 08:00 PM"
    }
  ]);

  const [patientAddRequests, setPatientAddRequests] = useState<PatientAddRequest[]>([
    {
      id: 1,
      patientName: "Emily Johnson",
      age: 32,
      gender: "Female",
      contactNumber: "555-123-4567",
      email: "emily.johnson@example.com",
      reason: "New patient seeking primary care physician",
      timestamp: "Feb 15, 10:15 AM",
      initials: "EJ"
    },
    {
      id: 2,
      patientName: "David Chen",
      age: 45,
      gender: "Male",
      contactNumber: "555-987-6543",
      email: "david.chen@example.com",
      reason: "Referred by Dr. Williams for specialized treatment",
      timestamp: "Feb 14, 03:45 PM",
      initials: "DC"
    },
    {
      id: 3,
      patientName: "Maria Rodriguez",
      age: 28,
      gender: "Female",
      contactNumber: "555-456-7890",
      email: "maria.rodriguez@example.com",
      reason: "Seeking second opinion on diagnosis",
      timestamp: "Feb 13, 11:30 AM",
      initials: "MR"
    }
  ]);

  // Track notifications sent
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);

  // Track added patients
  const [addedPatients, setAddedPatients] = useState<Patient[]>(() => {
    // Try to get from localStorage
    const savedPatients = localStorage.getItem('doctorPatients');
    return savedPatients ? JSON.parse(savedPatients) : [];
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Save added patients to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('doctorPatients', JSON.stringify(addedPatients));
  }, [addedPatients]);

  // Handle doctor request acceptance
  const handleDoctorAccept = (doctorId: number) => {
    // Find the doctor in the requests
    const doctor = doctorRequests.find(dr => dr.id === doctorId);
    
    if (!doctor) return;
    
    // Remove from requests list
    setDoctorRequests(doctorRequests.filter(dr => dr.id !== doctorId));
    
    // Add to sent notifications
    setSentNotifications([
      ...sentNotifications,
      {
        id: Date.now(),
        recipient: doctor.name,
        message: `You accepted ${doctor.name}'s connection request.`,
        timestamp: new Date().toLocaleString()
      }
    ]);
    
    // Show toast notification
    toast.success(`You've accepted ${doctor.name}'s connection request`);
  };

  // Handle doctor request rejection
  const handleDoctorReject = (doctorId: number) => {
    // Find the doctor in the requests
    const doctor = doctorRequests.find(dr => dr.id === doctorId);
    
    if (!doctor) return;
    
    // Remove from requests list
    setDoctorRequests(doctorRequests.filter(dr => dr.id !== doctorId));
    
    // Show toast notification
    toast.info(`You've declined ${doctor.name}'s connection request`);
  };

  // Handle transfer request acceptance
  const handleTransferAccept = (transferId: number) => {
    // Find the transfer in the requests
    const transfer = transferRequests.find(tr => tr.id === transferId);
    
    if (!transfer) return;
    
    // Remove from requests list
    setTransferRequests(transferRequests.filter(tr => tr.id !== transferId));
    
    // Add to sent notifications
    setSentNotifications([
      ...sentNotifications,
      {
        id: Date.now(),
        recipient: transfer.fromDoctor,
        message: `You accepted the transfer request for patient ${transfer.patientName}.`,
        timestamp: new Date().toLocaleString()
      }
    ]);
    
    // Add patient to the doctor's patient list
    const newPatient: Patient = {
      id: Date.now(),
      priority: transfer.priority,
      initials: transfer.patientName.split(' ').map(n => n[0]).join(''),
      name: transfer.patientName,
      patientNumber: `TR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: 'Unknown', // This would come from the actual patient data
      lastVisit: 'Never',
      timeOfVisit: 'N/A',
      reason: transfer.reason,
      chatStatus: false
    };
    
    setAddedPatients([...addedPatients, newPatient]);
    
    // Show toast notification
    toast.success(`You've accepted the transfer request for ${transfer.patientName}`);
  };

  // Handle transfer request rejection
  const handleTransferReject = (transferId: number) => {
    // Find the transfer in the requests
    const transfer = transferRequests.find(tr => tr.id === transferId);
    
    if (!transfer) return;
    
    // Remove from requests list
    setTransferRequests(transferRequests.filter(tr => tr.id !== transferId));
    
    // Add to sent notifications
    setSentNotifications([
      ...sentNotifications,
      {
        id: Date.now(),
        recipient: transfer.fromDoctor,
        message: `You declined the transfer request for patient ${transfer.patientName}.`,
        timestamp: new Date().toLocaleString()
      }
    ]);
    
    // Show toast notification
    toast.info(`You've declined the transfer request for ${transfer.patientName}`);
  };

  // Handle patient add request acceptance
  const handlePatientAddAccept = (patientId: number) => {
    // Find the patient in the requests
    const patient = patientAddRequests.find(p => p.id === patientId);
    
    if (!patient) return;
    
    // Remove from requests list
    setPatientAddRequests(patientAddRequests.filter(p => p.id !== patientId));
    
    // Add to sent notifications
    setSentNotifications([
      ...sentNotifications,
      {
        id: Date.now(),
        recipient: patient.patientName,
        message: `You accepted ${patient.patientName}'s request to be added as your patient.`,
        timestamp: new Date().toLocaleString()
      }
    ]);
    
    // Add patient to the doctor's patient list
    const newPatient: Patient = {
      id: Date.now(),
      priority: 'Medium', // Default priority
      initials: patient.initials,
      name: patient.patientName,
      patientNumber: `P${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: patient.gender,
      lastVisit: 'Never',
      timeOfVisit: 'N/A',
      reason: patient.reason || 'New patient',
      chatStatus: false,
      age: patient.age,
      email: patient.email,
      contactNumber: patient.contactNumber
    };
    
    setAddedPatients([...addedPatients, newPatient]);
    
    // Show toast notification
    toast.success(`You've added ${patient.patientName} to your patient list`);
  };

  // Handle patient add request rejection
  const handlePatientAddReject = (patientId: number) => {
    // Find the patient in the requests
    const patient = patientAddRequests.find(p => p.id === patientId);
    
    if (!patient) return;
    
    // Remove from requests list
    setPatientAddRequests(patientAddRequests.filter(p => p.id !== patientId));
    
    // Show toast notification
    toast.info(`You've declined ${patient.patientName}'s request`);
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
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          
          {/* Tabs */}
          <div className="mb-6 flex flex-wrap space-x-4">
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-4 py-2 rounded-md flex items-center mb-2 ${
                activeTab === 'doctor' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Doctor Requests
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {doctorRequests.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('transfer')}
              className={`px-4 py-2 rounded-md flex items-center mb-2 ${
                activeTab === 'transfer' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transfer Requests
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {transferRequests.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-4 py-2 rounded-md flex items-center mb-2 ${
                activeTab === 'patient' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Patient Add Requests
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {patientAddRequests.length}
              </span>
            </button>
          </div>
          
          {/* Doctor Requests Content */}
          {activeTab === 'doctor' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Friend Requests from Doctors</h2>
              </div>
              
              {doctorRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No pending doctor requests
                </div>
              ) : (
                <div className="divide-y">
                  {doctorRequests.map((request) => (
                    <div key={request.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                          {request.initials}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold">{request.name}</h3>
                          <p className="text-gray-600">{request.specialty}</p>
                          <p className="text-gray-600">{request.hospital}</p>
                          <p className="text-gray-500 text-sm">{request.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDoctorAccept(request.id)}
                          className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDoctorReject(request.id)}
                          className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Transfer Requests Content */}
          {activeTab === 'transfer' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Patient Transfer Requests</h2>
              </div>
              
              {transferRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No pending transfer requests
                </div>
              ) : (
                <div className="divide-y">
                  {transferRequests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold text-lg">{request.patientName}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              request.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.priority} Priority
                            </span>
                          </div>
                          <p className="text-gray-600">From: {request.fromDoctor} ({request.fromSpecialty})</p>
                          <p className="text-gray-600">Hospital: {request.hospital}</p>
                          <p className="text-gray-600">Reason: {request.reason}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleTransferAccept(request.id)}
                            className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleTransferReject(request.id)}
                            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-gray-700 mt-2">
                        {request.details}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">Requested on: {request.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Patient Add Requests Content */}
          {activeTab === 'patient' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Patient Add Requests</h2>
              </div>
              
              {patientAddRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No pending patient add requests
                </div>
              ) : (
                <div className="divide-y">
                  {patientAddRequests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {request.initials}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-lg">{request.patientName}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                              <p className="text-gray-600 text-sm">Age: {request.age}</p>
                              <p className="text-gray-600 text-sm">Gender: {request.gender}</p>
                              <p className="text-gray-600 text-sm">Contact: {request.contactNumber}</p>
                              <p className="text-gray-600 text-sm">Email: {request.email}</p>
                            </div>
                            <p className="text-gray-600 mt-2">Reason: {request.reason}</p>
                            <p className="text-gray-500 text-sm mt-1">Requested on: {request.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handlePatientAddAccept(request.id)}
                            className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handlePatientAddReject(request.id)}
                            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Sent Notifications Section */}
          {sentNotifications.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recently Sent Notifications</h2>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="divide-y">
                  {sentNotifications.map((notification) => (
                    <div key={notification.id} className="p-4 flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800">
                          <span className="font-medium">To: {notification.recipient}</span> - {notification.message}
                        </p>
                        <p className="text-gray-500 text-sm">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotificationPage;
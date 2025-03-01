"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Pill, FlaskRound as Flask, Activity, Plus, MoreVertical, Filter } from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

// Define interfaces for type safety
interface Patient {
  id: number | string;
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
  bloodType?: string;
  allergies?: string[] | string;
  chronicConditions?: string[];
  primaryDoctor?: string;
}

interface TimelineEvent {
  id: number;
  patientId: number | string;
  type: 'appointment' | 'lab' | 'medication' | 'note' | 'vitals';
  title: string;
  description: string;
  date: string;
  time: string;
  doctor?: string;
  location?: string;
  lab?: string;
  results?: string;
  medication?: string;
  dosage?: string;
  status: 'completed' | 'active' | 'pending';
}

interface NewEvent {
  type: string;
  title: string;
  description: string;
  date: string;
}

const PatientTimelinePage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    type: 'appointment',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Default patients for lookup
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
      chatStatus: true,
      age: 35,
      bloodType: 'O+',
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension', 'Diabetes Type 2'],
      primaryDoctor: 'Dr. James Martin'
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
      chatStatus: false,
      age: 42,
      bloodType: 'A+',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Asthma'],
      primaryDoctor: 'Dr. James Martin'
    }
  ];

  // Sample timeline events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 1,
      patientId: 1, // Nithya Kumar
      type: 'appointment',
      title: 'Regular Checkup',
      description: 'Routine health examination and blood pressure monitoring.',
      date: '2023-10-04',
      time: '02:00 PM',
      doctor: 'Dr. James Martin',
      location: 'Central Hospital, Room 305',
      status: 'completed'
    },
    {
      id: 2,
      patientId: 1,
      type: 'lab',
      title: 'Blood Test Results',
      description: 'Complete blood count and lipid profile analysis.',
      date: '2023-10-05',
      time: '10:30 AM',
      lab: 'Central Hospital Laboratory',
      results: 'Normal cholesterol levels, slightly elevated glucose.',
      status: 'completed'
    },
    {
      id: 3,
      patientId: 1,
      type: 'medication',
      title: 'Prescription Update',
      description: 'Adjusted dosage for blood pressure medication.',
      date: '2023-10-04',
      time: '02:30 PM',
      doctor: 'Dr. James Martin',
      medication: 'Lisinopril 10mg',
      dosage: '1 tablet daily',
      status: 'active'
    },
    {
      id: 4,
      patientId: 1,
      type: 'note',
      title: 'Follow-up Recommendation',
      description: 'Patient advised to monitor blood pressure daily and maintain low-sodium diet.',
      date: '2023-10-04',
      time: '02:45 PM',
      doctor: 'Dr. James Martin',
      status: 'active'
    },
    {
      id: 5,
      patientId: 2, // Varun P
      type: 'appointment',
      title: 'Consultation',
      description: 'Initial consultation for respiratory symptoms.',
      date: '2023-10-04',
      time: '01:00 PM',
      doctor: 'Dr. James Martin',
      location: 'Central Hospital, Room 302',
      status: 'completed'
    },
    {
      id: 6,
      patientId: 2,
      type: 'lab',
      title: 'Chest X-Ray',
      description: 'Radiological examination of the chest.',
      date: '2023-10-05',
      time: '11:45 AM',
      lab: 'Central Hospital Radiology',
      results: 'No significant findings, clear lung fields.',
      status: 'completed'
    },
    {
      id: 7,
      patientId: 2,
      type: 'medication',
      title: 'Asthma Medication Renewal',
      description: 'Renewed prescription for asthma controller medication.',
      date: '2023-10-04',
      time: '01:30 PM',
      doctor: 'Dr. James Martin',
      medication: 'Fluticasone/Salmeterol 250/50mcg',
      dosage: '1 inhalation twice daily',
      status: 'active'
    }
  ]);

  // Get patient data and timeline events
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'doctor') {
      router.push('/auth/login/doctor');
      return;
    }

    // Find patient in default patients or from localStorage
    const findPatient = () => {
      // First check default patients
      let foundPatient = defaultPatients.find(p => p.id.toString() === patientId);
      
      // If not found, check localStorage
      if (!foundPatient) {
        const savedPatients = localStorage.getItem('doctorPatients');
        if (savedPatients) {
          const parsedPatients = JSON.parse(savedPatients);
          foundPatient = parsedPatients.find((p: Patient) => p.id.toString() === patientId);
        }
      }
      
      return foundPatient;
    };

    const patientData = findPatient();
    
    if (patientData) {
      setPatient(patientData);
      setIsLoading(false);
    } else {
      toast.error("Patient not found");
      router.push('/dashboard/doctor/patients');
    }
  }, [patientId, router]);

  // Filter timeline events based on active tab and patient ID
  const filteredEvents = timelineEvents
    .filter(event => event.patientId.toString() === patientId)
    .filter(event => activeTab === 'all' || event.type === activeTab)
    .sort((a, b) => {
      // Sort by date (newest first) and then by time
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, sort by time
      return b.time.localeCompare(a.time);
    });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const event: TimelineEvent = {
      id: Date.now(),
      patientId: patientId,
      type: newEvent.type as 'appointment' | 'lab' | 'medication' | 'note' | 'vitals',
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctor: 'Dr. James Martin',
      status: 'active'
    };

    setTimelineEvents([...timelineEvents, event]);
    setShowAddEventModal(false);
    setNewEvent({
      type: 'appointment',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });

    toast.success("Event added to timeline");
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'lab':
        return <Flask className="w-5 h-5 text-purple-500" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-green-500" />;
      case 'note':
        return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'vitals':
        return <Activity className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 border-blue-500';
      case 'lab':
        return 'bg-purple-100 border-purple-500';
      case 'medication':
        return 'bg-green-100 border-green-500';
      case 'note':
        return 'bg-yellow-100 border-yellow-500';
      case 'vitals':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  if (!patient) {
    return <div className="min-h-screen bg-gray-50 p-8">Patient not found</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/dashboard/doctor/patients')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Patient Timeline</h1>
              <p className="text-gray-600">Medical history and events for {patient.name}</p>
            </div>
          </div>
          
          {/* Patient Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold">
                  {patient.initials}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{patient.name}</h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                    <p className="text-gray-600"><span className="font-medium">ID:</span> {patient.patientNumber}</p>
                    <p className="text-gray-600"><span className="font-medium">Gender:</span> {patient.gender}</p>
                    <p className="text-gray-600"><span className="font-medium">Age:</span> {patient.age}</p>
                    <p className="text-gray-600"><span className="font-medium">Blood Type:</span> {patient.bloodType || 'Not recorded'}</p>
                  </div>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  patient.priority === 'High' ? 'bg-red-100 text-red-800' : 
                  patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {patient.priority} Priority
                </span>
              </div>
            </div>
            
            {/* Additional patient information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Allergies</h3>
                {patient.allergies && (Array.isArray(patient.allergies) ? patient.allergies.length > 0 : patient.allergies) ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {Array.isArray(patient.allergies) ? 
                      patient.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      )) : 
                      <li>{patient.allergies}</li>
                    }
                  </ul>
                ) : (
                  <p className="text-gray-500">No known allergies</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Chronic Conditions</h3>
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {patient.chronicConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No chronic conditions</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Last Visit</h3>
                <p className="text-gray-600">Date: {patient.lastVisit}</p>
                <p className="text-gray-600">Time: {patient.timeOfVisit}</p>
                <p className="text-gray-600">Reason: {patient.reason}</p>
              </div>
            </div>
          </div>
          
          {/* Timeline Filters and Add Button */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex flex-wrap space-x-2 mb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'all' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                All Events
              </button>
              
              <button
                onClick={() => setActiveTab('appointment')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'appointment' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </button>
              
              <button
                onClick={() => setActiveTab('lab')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'lab' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Flask className="w-4 h-4 mr-2" />
                Lab Results
              </button>
              
              <button
                onClick={() => setActiveTab('medication')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'medication' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Pill className="w-4 h-4 mr-2" />
                Medications
              </button>
              
              <button
                onClick={() => setActiveTab('note')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'note' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </button>
            </div>
            
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? "There are no recorded events for this patient yet." 
                    : `There are no ${activeTab} events recorded for this patient.`}
                </p>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Event
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-8 top-6 -ml-3.5 h-7 w-7 rounded-full border-2 border-white bg-white flex items-center justify-center shadow-md">
                      {getEventIcon(event.type)}
                    </div>
                    
                    {/* Event card */}
                    <div className={`ml-16 p-4 rounded-lg border-l-4 ${getEventColor(event.type)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500">
                        <span className="mr-4">{event.date}</span>
                        <span className="mr-4">{event.time}</span>
                        {event.doctor && <span className="mr-4">Doctor: {event.doctor}</span>}
                        {event.location && <span className="mr-4">Location: {event.location}</span>}
                        {event.lab && <span className="mr-4">Lab: {event.lab}</span>}
                        {event.medication && (
                          <span className="mr-4">Medication: {event.medication} ({event.dosage})</span>
                        )}
                        {event.status && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            event.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : event.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      {event.results && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md text-gray-700">
                          <p className="font-medium">Results:</p>
                          <p>{event.results}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add Event Modal */}
          {showAddEventModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add Timeline Event</h2>
                  <button 
                    onClick={() => setShowAddEventModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="appointment">Appointment</option>
                      <option value="lab">Lab Result</option>
                      <option value="medication">Medication</option>
                      <option value="note">Note</option>
                      <option value="vitals">Vital Signs</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddEventModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Event
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

export default PatientTimelinePage;
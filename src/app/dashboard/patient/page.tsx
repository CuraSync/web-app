"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Facebook, Instagram, Mail, PenSquare, Settings, Timer, Twitter, User } from 'lucide-react';
import Link from 'next/link';
import { FaChartBar, FaCog, FaEnvelope, FaFlask, FaUserMd, FaPrescriptionBottleAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import Sidebar from './sidebar/sidebar';

const PatientDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPatientInfo, setIsEditingPatientInfo] = useState(false);
  const [isEditingEmergencyContact, setIsEditingEmergencyContact] = useState(false);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [isEditingVitalStats, setIsEditingVitalStats] = useState(false);

  // Initialize state with data from localStorage
  const [patientInfo, setPatientInfo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return {
      name: savedData.fullName || "Sarah Johnson",
      dob: savedData.dateOfBirth || "15 May 1985",
      bloodType: savedData.bloodType || "A+",
    };
  });

  const [emergencyContact, setEmergencyContact] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return {
      name: savedData.emergencyContactName || "Michael Johnson",
      relation: savedData.emergencyContactRelation || "Spouse",
      phone: savedData.emergencyContactPhone || "+1 (555) 876-5432",
    };
  });

  const [allergies, setAllergies] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    const allergyText = savedData.allergies || "Penicillin, Peanuts, Pollen";
    // Parse allergies string into an array of objects if it exists
    return allergyText
      ? allergyText.split(',').map((item: string, index: number) => ({
          severity: index === 0 ? "Severe" : index === 1 ? "Moderate" : "Mild", // Default severity logic
          type: item.trim().toLowerCase().includes("penicillin") ? "Drug" : item.trim().toLowerCase().includes("peanuts") ? "Food" : "Environmental",
          name: item.trim(),
        }))
      : [
          { severity: "Severe", type: "Drug", name: "Penicillin" },
          { severity: "Moderate", type: "Food", name: "Peanuts" },
          { severity: "Mild", type: "Environmental", name: "Pollen" },
        ];
  });

  const [vitalStats, setVitalStats] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return {
      height: savedData.height ? `${savedData.height} cm` : "170 cm",
      weight: savedData.weight ? `${savedData.weight} kg` : "70 kg",
      bmi: savedData.bmi || "24.2",
    };
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    return savedData.lastUpdated || "25 Jan 2025";
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'patient') {
      router.push('/auth/login/patient');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Save changes to localStorage when editing is complete
  const savePatientInfo = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    localStorage.setItem('patientData', JSON.stringify({
      ...updatedData,
      fullName: patientInfo.name,
      dateOfBirth: patientInfo.dob,
      bloodType: patientInfo.bloodType,
    }));
    setIsEditingPatientInfo(false);
  };

  const saveVitalStats = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    localStorage.setItem('patientData', JSON.stringify({
      ...updatedData,
      height: vitalStats.height.replace(" cm", ""),
      weight: vitalStats.weight.replace(" kg", ""),
      bmi: vitalStats.bmi,
      lastUpdated: currentDate,
    }));
    setLastUpdated(currentDate);
    setIsEditingVitalStats(false);
  };

  const saveEmergencyContact = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    localStorage.setItem('patientData', JSON.stringify({
      ...updatedData,
      emergencyContactName: emergencyContact.name,
      emergencyContactRelation: emergencyContact.relation,
      emergencyContactPhone: emergencyContact.phone,
    }));
    setIsEditingEmergencyContact(false);
  };

  const saveAllergies = () => {
    const updatedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    const allergyText = allergies.map((a: { name: string }) => a.name).join(', ');
    localStorage.setItem('patientData', JSON.stringify({
      ...updatedData,
      allergies: allergyText,
    }));
    setIsEditingAllergies(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              
            </div>
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md">
              Patient
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">{patientInfo.name.split(' ').map((n: string) => n[0]).join('')}</span>
              </div>
              <div>
                {isEditingPatientInfo ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      className="text-xl font-bold border rounded p-1"
                    />
                    <input
                      type="text"
                      name="dob"
                      value={patientInfo.dob}
                      onChange={(e) => setPatientInfo({ ...patientInfo, dob: e.target.value })}
                      className="text-gray-600 border rounded p-1 mt-1"
                    />
                    <input
                      type="text"
                      name="bloodType"
                      value={patientInfo.bloodType}
                      onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}
                      className="text-gray-600 border rounded p-1 mt-1"
                    />
                    <button onClick={savePatientInfo} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Save</button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{patientInfo.name}</h2>
                    <p className="text-gray-600">DOB: {patientInfo.dob}</p>
                    <p className="text-gray-600">Blood Type: {patientInfo.bloodType}</p>
                  </>
                )}
              </div>
            </div>
            <button onClick={() => setIsEditingPatientInfo(!isEditingPatientInfo)}>
              <PenSquare className="text-gray-400 w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">
            {/* Vital Statistics */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-4">Vital Statistics</h3>
                <button onClick={() => setIsEditingVitalStats(!isEditingVitalStats)}>
                  <PenSquare className="text-gray-400 w-5 h-5" />
                </button>
              </div>
              {isEditingVitalStats ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="height"
                    value={vitalStats.height}
                    onChange={(e) => setVitalStats({ ...vitalStats, height: e.target.value })}
                    className="text-gray-600 border rounded p-1"
                  />
                  <input
                    type="text"
                    name="weight"
                    value={vitalStats.weight}
                    onChange={(e) => setVitalStats({ ...vitalStats, weight: e.target.value })}
                    className="text-gray-600 border rounded p-1"
                  />
                  <input
                    type="text"
                    name="bmi"
                    value={vitalStats.bmi}
                    onChange={(e) => setVitalStats({ ...vitalStats, bmi: e.target.value })}
                    className="text-gray-600 border rounded p-1"
                  />
                  <button onClick={saveVitalStats} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Save</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">Height: {vitalStats.height}</p>
                  <p className="text-gray-600">Weight: {vitalStats.weight}</p>
                  <p className="text-gray-600">BMI: {vitalStats.bmi}</p>
                  <p className="text-gray-400 text-sm mt-4">Last updated: {lastUpdated}</p>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <button onClick={() => setIsEditingEmergencyContact(!isEditingEmergencyContact)}>
                  <PenSquare className="text-gray-400 w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {isEditingEmergencyContact ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={emergencyContact.name}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                      className="text-gray-600 border rounded p-1"
                    />
                    <input
                      type="text"
                      name="relation"
                      value={emergencyContact.relation}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                      className="text-gray-600 border rounded p-1"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                      className="text-gray-600 border rounded p-1"
                    />
                    <button onClick={saveEmergencyContact} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Save</button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">Name: {emergencyContact.name}</p>
                    <p className="text-gray-600">Relation: {emergencyContact.relation}</p>
                    <p className="text-gray-600">Phone: {emergencyContact.phone}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Allergies</h3>
              <button onClick={() => setIsEditingAllergies(!isEditingAllergies)}>
                <PenSquare className="text-gray-400 w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {allergies.map((allergy: { severity: string; type: string; name: string }, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  {isEditingAllergies ? (
                    <>
                      <select
                        name="severity"
                        value={allergy.severity}
                        onChange={(e) => {
                          const newAllergies = [...allergies];
                          newAllergies[index] = { ...allergy, severity: e.target.value };
                          setAllergies(newAllergies);
                        }}
                        className="px-2 py-1 bg-gray-200 text-sm rounded"
                      >
                        <option value="Severe">Severe</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Mild">Mild</option>
                      </select>
                      <input
                        type="text"
                        name="type"
                        value={allergy.type}
                        onChange={(e) => {
                          const newAllergies = [...allergies];
                          newAllergies[index] = { ...allergy, type: e.target.value };
                          setAllergies(newAllergies);
                        }}
                        className="text-gray-600 border rounded p-1"
                      />
                      <input
                        type="text"
                        name="name"
                        value={allergy.name}
                        onChange={(e) => {
                          const newAllergies = [...allergies];
                          newAllergies[index] = { ...allergy, name: e.target.value };
                          setAllergies(newAllergies);
                        }}
                        className="text-gray-600 border rounded p-1"
                      />
                    </>
                  ) : (
                    <>
                      <span className={`px-2 py-1 ${allergy.severity === 'Severe' ? 'bg-red-500' : allergy.severity === 'Moderate' ? 'bg-yellow-500' : 'bg-gray-500'} text-white text-sm rounded`}>
                        {allergy.severity}
                      </span>
                      <span className="text-gray-600">{allergy.type}: {allergy.name}</span>
                    </>
                  )}
                </div>
              ))}
              {isEditingAllergies && (
                <button onClick={saveAllergies} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Save</button>
              )}
            </div>
          </div>

          {/* Medical Tracking Dashboard Access */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <p className="text-center text-lg font-medium">Do you want to access your medical tracking Dashboard</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-red-500 text-white rounded-md">Yes</button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md">No</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
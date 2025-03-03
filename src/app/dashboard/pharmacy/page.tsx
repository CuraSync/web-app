"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenSquare } from 'lucide-react';
import PharmacySidebar from './sidebar/sidebar';
import { toast } from 'sonner';

const PharmacyDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPharmacyInfo, setIsEditingPharmacyInfo] = useState(false);
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [isEditingOperatingHours, setIsEditingOperatingHours] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);

  // Initialize state with data from localStorage or default values
  const [pharmacyInfo, setPharmacyInfo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      name: savedData.name || "MedPlus Pharmacy",
      licenseNumber: savedData.licenseNumber || "PH12345678",
      established: savedData.established || "2010",
      type: savedData.type || "Retail Pharmacy",
    };
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      address: savedData.address || "123 Healthcare Ave, Medical District",
      phone: savedData.phone || "+1 (555) 123-4567",
      email: savedData.email || "info@medpluspharmacy.com",
      website: savedData.website || "www.medpluspharmacy.com",
    };
  });

  const [operatingHours, setOperatingHours] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return {
      weekdays: savedData.weekdays || "8:00 AM - 9:00 PM",
      saturday: savedData.saturday || "9:00 AM - 7:00 PM",
      sunday: savedData.sunday || "10:00 AM - 5:00 PM",
      holidays: savedData.holidays || "10:00 AM - 3:00 PM",
    };
  });

  const [services, setServices] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return savedData.services || [
      { id: 1, name: "Prescription Filling", description: "Quick and accurate prescription services" },
      { id: 2, name: "Medication Counseling", description: "Professional advice on medication usage" },
      { id: 3, name: "Health Screenings", description: "Blood pressure, glucose, and cholesterol tests" },
      { id: 4, name: "Vaccinations", description: "Flu shots and other immunizations" },
      { id: 5, name: "Home Delivery", description: "Free delivery for orders above $30" },
    ];
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    return savedData.lastUpdated || "25 Jan 2025";
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'pharmacy') {
      router.push('/auth/login/pharmacy');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Save changes to localStorage when editing is complete
  const savePharmacyInfo = () => {
    const updatedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    localStorage.setItem('pharmacyData', JSON.stringify({
      ...updatedData,
      name: pharmacyInfo.name,
      licenseNumber: pharmacyInfo.licenseNumber,
      established: pharmacyInfo.established,
      type: pharmacyInfo.type,
      lastUpdated: currentDate,
    }));
    
    setLastUpdated(currentDate);
    setIsEditingPharmacyInfo(false);
    toast.success("Pharmacy information updated successfully");
  };

  const saveContactInfo = () => {
    const updatedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    localStorage.setItem('pharmacyData', JSON.stringify({
      ...updatedData,
      address: contactInfo.address,
      phone: contactInfo.phone,
      email: contactInfo.email,
      website: contactInfo.website,
      lastUpdated: currentDate,
    }));
    
    setLastUpdated(currentDate);
    setIsEditingContactInfo(false);
    toast.success("Contact information updated successfully");
  };

  const saveOperatingHours = () => {
    const updatedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    localStorage.setItem('pharmacyData', JSON.stringify({
      ...updatedData,
      weekdays: operatingHours.weekdays,
      saturday: operatingHours.saturday,
      sunday: operatingHours.sunday,
      holidays: operatingHours.holidays,
      lastUpdated: currentDate,
    }));
    
    setLastUpdated(currentDate);
    setIsEditingOperatingHours(false);
    toast.success("Operating hours updated successfully");
  };

  const saveServices = () => {
    const updatedData = JSON.parse(localStorage.getItem('pharmacyData') || '{}');
    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    localStorage.setItem('pharmacyData', JSON.stringify({
      ...updatedData,
      services: services,
      lastUpdated: currentDate,
    }));
    
    setLastUpdated(currentDate);
    setIsEditingServices(false);
    toast.success("Services updated successfully");
  };

  const addService = () => {
    const newService = {
      id: services.length > 0 ? Math.max(...services.map((s: { id: number }) => s.id)) + 1 : 1,
      name: "New Service",
      description: "Service description"
    };
    setServices([...services, newService]);
  };

  const updateService = (id: number, field: string, value: string) => {
    const updatedServices = services.map((service: { id: number; name: string; description: string }) => 
      service.id === id ? { ...service, [field]: value } : service
    );
    setServices(updatedServices);
  };

  const removeService = (id: number) => {
    const updatedServices = services.filter((service: { id: number; name: string; description: string }) => service.id !== id);
    setServices(updatedServices);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <PharmacySidebar />
      
      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              
            </div>
            <button className="px-4 py-1 border border-green-600 text-green-600 rounded-md">
              Pharmacy
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Pharmacy Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-semibold">{pharmacyInfo.name.split(' ').map((n: string) => n[0]).join('')}</span>
              </div>
              <div>
                {isEditingPharmacyInfo ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={pharmacyInfo.name}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, name: e.target.value })}
                      className="text-xl font-bold border rounded p-1 mb-1 w-full"
                    />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={pharmacyInfo.licenseNumber}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, licenseNumber: e.target.value })}
                      className="text-gray-600 border rounded p-1 mb-1 w-full"
                      placeholder="License Number"
                    />
                    <input
                      type="text"
                      name="established"
                      value={pharmacyInfo.established}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, established: e.target.value })}
                      className="text-gray-600 border rounded p-1 mb-1 w-full"
                      placeholder="Established Year"
                    />
                    <input
                      type="text"
                      name="type"
                      value={pharmacyInfo.type}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, type: e.target.value })}
                      className="text-gray-600 border rounded p-1 mb-1 w-full"
                      placeholder="Pharmacy Type"
                    />
                    <button onClick={savePharmacyInfo} className="mt-2 px-4 py-1 bg-green-500 text-white rounded">Save</button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{pharmacyInfo.name}</h2>
                    <p className="text-gray-600">License: {pharmacyInfo.licenseNumber}</p>
                    <p className="text-gray-600">Established: {pharmacyInfo.established}</p>
                    <p className="text-gray-600">Type: {pharmacyInfo.type}</p>
                  </>
                )}
              </div>
            </div>
            <button onClick={() => setIsEditingPharmacyInfo(!isEditingPharmacyInfo)}>
              <PenSquare className="text-gray-400 w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <button onClick={() => setIsEditingContactInfo(!isEditingContactInfo)}>
                  <PenSquare className="text-gray-400 w-5 h-5" />
                </button>
              </div>
              {isEditingContactInfo ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="text"
                      name="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={contactInfo.website}
                      onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <button onClick={saveContactInfo} className="mt-2 px-4 py-1 bg-green-500 text-white rounded">Save</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Address:</span> {contactInfo.address}</p>
                  <p className="text-gray-600"><span className="font-medium">Phone:</span> {contactInfo.phone}</p>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {contactInfo.email}</p>
                  <p className="text-gray-600"><span className="font-medium">Website:</span> {contactInfo.website}</p>
                </div>
              )}
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                <button onClick={() => setIsEditingOperatingHours(!isEditingOperatingHours)}>
                  <PenSquare className="text-gray-400 w-5 h-5" />
                </button>
              </div>
              {isEditingOperatingHours ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Weekdays</label>
                    <input
                      type="text"
                      name="weekdays"
                      value={operatingHours.weekdays}
                      onChange={(e) => setOperatingHours({ ...operatingHours, weekdays: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Saturday</label>
                    <input
                      type="text"
                      name="saturday"
                      value={operatingHours.saturday}
                      onChange={(e) => setOperatingHours({ ...operatingHours, saturday: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Sunday</label>
                    <input
                      type="text"
                      name="sunday"
                      value={operatingHours.sunday}
                      onChange={(e) => setOperatingHours({ ...operatingHours, sunday: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Holidays</label>
                    <input
                      type="text"
                      name="holidays"
                      value={operatingHours.holidays}
                      onChange={(e) => setOperatingHours({ ...operatingHours, holidays: e.target.value })}
                      className="text-gray-600 border rounded p-1 w-full"
                    />
                  </div>
                  <button onClick={saveOperatingHours} className="mt-2 px-4 py-1 bg-green-500 text-white rounded">Save</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Weekdays:</span> {operatingHours.weekdays}</p>
                  <p className="text-gray-600"><span className="font-medium">Saturday:</span> {operatingHours.saturday}</p>
                  <p className="text-gray-600"><span className="font-medium">Sunday:</span> {operatingHours.sunday}</p>
                  <p className="text-gray-600"><span className="font-medium">Holidays:</span> {operatingHours.holidays}</p>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Services Offered</h3>
              <button onClick={() => setIsEditingServices(!isEditingServices)}>
                <PenSquare className="text-gray-400 w-5 h-5" />
              </button>
            </div>
            
            {isEditingServices ? (
              <div>
                <div className="space-y-4">
                  {services.map((service: { id: number; name: string; description: string }) => (
                    <div key={service.id} className="flex items-start space-x-2 border-b pb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          className="text-gray-800 font-medium border rounded p-1 w-full mb-1"
                        />
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          className="text-gray-600 border rounded p-1 w-full"
                        />
                      </div>
                      <button 
                        onClick={() => removeService(service.id)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <button 
                    onClick={addService}
                    className="px-4 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Add Service
                  </button>
                  <button 
                    onClick={saveServices}
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service: { id: number; name: string; description: string }) => (
                  <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800">{service.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="mt-4 text-right text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Prescriptions</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">1,248</p>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">856</p>
              <p className="text-xs text-green-500 mt-1">+5% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">24</p>
              <p className="text-xs text-red-500 mt-1">+8% from yesterday</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue (Monthly)</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">$42,580</p>
              <p className="text-xs text-green-500 mt-1">+15% from last month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
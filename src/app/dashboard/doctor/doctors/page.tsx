"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Search, User } from "lucide-react";
import DoctorSidebar from "@/components/doctor/Sidebar";
import api from "@/utils/api";
import { toast } from "sonner";

interface Doctor {
  firstName: string;
  lastName: string;
  doctorId: string;
  specialization: string;
  hospital: string;
  profilePic: string;
  yearsOfExperience: number;
}

const DoctorsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctor/doctors");
      console.log("Raw API response:", response.data); 

      const mappedDoctors = response.data.map((doctor: any) => ({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        doctorId: doctor.reciveDoctorId,
        specialization: doctor.specialization || "Unknown",
        hospital: doctor.hospital || "Unknown",
        profilePic: doctor.profilePic,
        yearsOfExperience: doctor.yearsOfExperience || 0,
      }));

      console.log("Mapped doctors:", mappedDoctors); 

      setDoctors(mappedDoctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization = selectedSpecialization === "All" || 
      doctor.specialization === selectedSpecialization;

    const isMatch = matchesSearch && matchesSpecialization;
    console.log(`Filtering ${doctor.firstName} ${doctor.lastName}:`, isMatch); 

    return isMatch;
  });

  const handleMessageClick = (doctorId: string) => {
    console.log("Sending message to doctorId:", doctorId); 
    router.push(`/dashboard/doctor/doctor/message?doctorId=${doctorId}`);
  };

  const handleProfileClick = (doctorId: string) => {
    console.log("Viewing profile for doctorId:", doctorId); 
    router.push(`/dashboard/doctor/profile/${doctorId}`);
  };

  const specializations = [
    "All",
    ...new Set(doctors.map(d => d.specialization).filter(Boolean))
  ] as string[];

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-white">
        <DoctorSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Colleagues</h1>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or hospital..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <select
            className="border rounded-lg px-4 py-2"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No doctors found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.doctorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.profilePic}
                              alt={`${doctor.firstName} ${doctor.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {doctor.firstName[0]}{doctor.lastName[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {doctor.doctorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.yearsOfExperience} years</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleMessageClick(doctor.doctorId)}>
                        <MessageCircle />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;

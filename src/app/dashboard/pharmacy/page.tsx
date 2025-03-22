"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PharmacySidebar from "./sidebar/sidebar";
import api from "@/utils/api";
import { toast } from "sonner";

export const PharmacyDashboard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [rating, setRating] = useState("");

  const fetchHomeData = async () => {
    try {
      const response = await api.get("/pharmacy/home");
      setName(response.data.pharmacyName);
      setLicenceNumber(response.data.licenceNumber);
      setEmail(response.data.email);
      setLocation(response.data.location);
      setContactNo(response.data.phoneNumber);
      setDescription(response.data.description);
      setProfilePic(response.data.profilePic);
      setContactInformation(response.data.contactInformation);
      setRating(response.data.rating);
    } catch (error) {
      toast.error("Failed to load pharmacy data. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
  <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
    <PharmacySidebar />
  </div>
  <main className="flex-1 flex flex-col overflow-hidden p-6">
    <div className="border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-6">Pharmacy Dashboard</h1>
    </div>

    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
          {profilePic ? (
            <img
              src={profilePic}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-green-600 text-xl sm:text-2xl font-semibold">
              {name?.charAt(0)?.toUpperCase() || "P"}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{name}</h2>
          <p className="text-gray-600">License: {licenceNumber}</p>
          <p className="text-gray-600">Rating: {rating}</p>
        </div>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Contact Information</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {location}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {contactNo}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {email}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-600">{description || "No description available."}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Additional Contact Information</h3>
        {contactInformation.length !== 0 ? (
          (() => {
            try {
              const parsedData = JSON.parse(contactInformation);
              return parsedData.map((contact: { type: string; value: string }, index: number) => (
                <p key={index}>
                  <span className="font-medium capitalize">{contact.type}:</span>{" "}
                  <a
                    href={contact.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {contact.value}
                  </a>
                </p>
              ));
            } catch (error) {
              console.error("Error parsing contact information:", error);
              return <p>Invalid contact information format.</p>;
            }
          })()
        ) : (
          <p>No additional contact information available.</p>
        )}
      </div>
    </div>
  </main>
</div>

  );
};

export default PharmacyDashboard;

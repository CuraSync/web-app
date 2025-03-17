"use client"
import { useEffect,useState } from "react"
import { useRouter } from "next/navigation";
import LabSidebar from "./sidebar/sidebar";
import api from "@/utils/api";

export const LabDashboard = () => {
  const router = useRouter();
  const [labName, setLabName] = useState("");
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
      const response = await api.get("/laboratory/home");
      setLabName(response.data.labName);
      setLicenceNumber(response.data.licenceNumber);
      setEmail(response.data.email);
      setLocation(response.data.location);
      setContactNo(response.data.phoneNumber);
      setDescription(response.data.description);
      setProfilePic(response.data.profilePic);
      setContactInformation(response.data.contactInformation);
      setRating(response.data.rating);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      fetchHomeData();
    }, []);


    return (
      <div className="min-h-screen flex bg-white">
        <LabSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6">
            <div className="border-b p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6">Laboratory Dashboard</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={labName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-green-600 text-xl font-semibold">
                      {labName?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{labName}</h2>
                  <p className="text-gray-600">License: {licenceNumber}</p>
                  <p className="text-gray-600">Rating: {rating}</p>
                </div>
              </div>
            </div>
  
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
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
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-600">
                  {description || "No description available."}
                </p>
              </div>


            <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Contact Information</h3>
                  {contactInformation ? (
                    JSON.parse(contactInformation).map(
                      (contact: { type: string; value: string }, index: number) => (
                        <p key={index}>
                          <span className="font-medium capitalize">
                            {contact.type}:
                          </span>{" "}
                          <a
                            href={contact.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {contact.value}
                          </a>
                        </p>
                      )
                    )
                  ) : (
                    <p>No additional contact information available.</p>
                  )}
            </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default LabDashboard;
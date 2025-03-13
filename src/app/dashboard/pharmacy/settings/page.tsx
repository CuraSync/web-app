"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PharmacySidebar from "../../pharmacy/sidebar/sidebar";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X, Camera, Star } from "lucide-react";
import {FaStar} from "react-icons/fa";
import api from "@/utils/api";

const SettingsPage = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [location, setLocation] = useState("");
  const [pharmacyId, setPharmacyId] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [rateColor, setColor] = useState(null);
  
  interface Contact {
    type: string;
    value: string;
  }
  
  const [contacts, setContacts] = useState<Contact[]>([{ type: "", value: "" }]);
  
  const fetchProfileData = async () => {
    try {
      const response = await api.post("/pharmacy/profile");
      setDescription(response.data.description || "");
      setPharmacyName(response.data.pharmacyName || "");
      setLocation(response.data.location || "");
      setPharmacyId(response.data.location || "");
      setUpdatedAt(response.data.updatedAt || "");
      setProfilePic(response.data.profilePic || "");
      setContactInformation(response.data.contactInformation || "");

    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    }
    try {
      const response = await api.get("/pharmacy/home"); 
      setPharmacyName(response.data.pharmacyName);
      setPhoneNumber(response.data.phoneNumber);
      setEmail(response.data.email);
      setLicenceNumber(response.data.licenceNumber);
      setDescription(response.data.description);
      setLocation(response.data.location);
      setPharmacyId(response.data.pharmacyId);
      setUpdatedAt(response.data.updatedAt);
      setContactInformation(response.data.contactInformation);
      setProfilePic(response.data.profilePic);
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    if (contactInformation) {
      try {
        const parsedContacts = JSON.parse(contactInformation);
        
        if (Array.isArray(parsedContacts) && parsedContacts.length > 0 && 
            parsedContacts.some(contact => contact.type && contact.value)) {
          
          const validContacts = parsedContacts.filter(contact => 
            contact && contact.type && contact.value
          );
          
          if (validContacts.length > 0) {
            setContacts(validContacts);
            return;
          }
        }
      } catch (error) {
        console.error("Error parsing contact information:", error);
      }
    }
    
    setContacts([{ type: "", value: "" }]);
  }, [contactInformation]);
  
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handlePharmacyNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPharmacyName(e.target.value);
  };
  
  const handlephoneNumberChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  const handllocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocation(e.target.value);
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Only JPG, PNG, GIF, or WebP images are allowed");
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = () => {
      setProfilePic(reader.result as string);
      setIsUploading(false);
      toast.success("Profile picture ready to save");
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the image");
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const removeProfilePic = () => {
    setProfilePic("");
    toast.success("Profile picture removed");
  };
  
  const handleSaveProfile = async () => {
    try {
      const contactInfoString = JSON.stringify(contacts);
      
      await api.post("/pharmacy/profile", { 
        description,
        pharmacyName,
        phoneNumber,
        location,
        pharmacyId,
        updatedAt,
        contactInformation: contactInfoString,
        profilePic 
      });
      
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };
  
  const handleChange = (index: number, field: "type" | "value", value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };
  
  const addContactField = () => {
    setContacts([...contacts, { type: "", value: "" }]);
  };

  const removeContactField = (indexToRemove: number) => {
    if (contacts.length <= 1) {
      return;
    }
    setContacts(contacts.filter((_, index) => index !== indexToRemove));
  };



  
  return (
    <div className="min-h-screen flex font-sans bg-white text-gray-900">
      <PharmacySidebar />
      <div className="p-8 flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl border rounded-lg shadow-md bg-white border-gray-200">
          <div className="flex flex-col p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Profile</h2>
              <div className="text-gray-500 text-sm">
                Updated: {updatedAt}
              </div>
            </div>

            <div className="flex items-center justify-center pb-6">
              <div className="relative w-32 h-32 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                {isUploading ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : profilePic ? (
                  <>
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={removeProfilePic}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      title="Remove profile picture"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <Camera size={40} className="text-gray-400" />
                )}
                
                <label htmlFor="profile-pic" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md">
                  <Upload size={16} />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Pharmacy Id</label>
            <textarea
              name="pharmacyId"
              value={pharmacyId}
              readOnly
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">License Number</label>
            <textarea
              name="licenceNumber"
              value={licenceNumber}
              readOnly
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <textarea
              name="email"
              value={email}
              readOnly
              rows={1}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed text-gray-600"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Pharmacy Name</label>
            <textarea
              name="pharmacyname"
              value={pharmacyName}
              onChange={handlePharmacyNameChange}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <textarea
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlephoneNumberChange}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <textarea
              name="location"
              value={location}
              onChange={handllocationChange}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">About Pharmacy</label>
            <textarea
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* {[...Array(5)].map((star, index) => {
            const currentRate = index + 1
            return(
              <>  
                  <label>
                    <input type="radio" name="rate"
                    value={currentRate}
                    onClick={()=> setRating(currentRate)}
                    />
                    <FaStar />
                    color={currentRate <= (hover || rating) ? "yellow" : "grey"}
                  </label>
              </>
            )
          })} */}
          <div>

          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Contact Information</label>
            
            {contacts.map((contact, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">

                <select
                  value={contact.type}
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a contact method</option>
                  <option value="website">Website</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>

                <input
                  type="url"
                  placeholder={`Enter ${contact.type || 'contact'} details`}
                  value={contact.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button 
                  onClick={() => removeContactField(index)}
                  className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                  disabled={contacts.length <= 1}
                  title={contacts.length <= 1 ? "Cannot remove the last contact method" : "Remove this contact method"}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              onClick={addContactField}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Contact Method
            </button>
          </div>

          <div className="mt-6 p-6">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>

          <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-200">
            © 2025 CuraSync. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LabSidebar from "../sidebar/sidebar";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X, Camera, Star } from "lucide-react";
import api from "@/utils/api";
import axios from "axios";

const SettingsPage = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [labName, setLabName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [location, setLocation] = useState("");
  const [labId, setLabId] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  
  interface Contact {
    type: string;
    value: string;
  }
  
  const [contacts, setContacts] = useState<Contact[]>([{ type: "", value: "" }]);
  
  const fetchProfileData = async () => {
    try {
      const response = await api.post("/laboratory/profile");
      setDescription(response.data.description || "");
      setLabName(response.data.laboratoryName || "");
      setLocation(response.data.location || "");
      setLabId(response.data.laboratoryId || "");
      setUpdatedAt(response.data.updatedAt || "");
      setCreatedAt(response.data.createdAt || "");
      setContactInformation(response.data.contactInformation || "");
      setRating(response.data.rating || 0);
      setImageUrl(response.data.profilePic || "");

    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    }
    try {
      const response = await api.get("/laboratory/profile"); 
      setLabName(response.data.labName);
      setPhoneNumber(response.data.phoneNumber);
      setEmail(response.data.email);
      setLicenceNumber(response.data.licenceNumber);
      setDescription(response.data.description);
      setLocation(response.data.location);
      setLabId(response.data.labId);
      setUpdatedAt(response.data.updatedAt);
      setCreatedAt(response.data.createdAt);
      setContactInformation(response.data.contactInformation);
      setRating(response.data.rating);
      console.log(response.data);
      setImageUrl(response.data.profilePic);
      
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
  
  const handleLabNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLabId(e.target.value);
  };
  
  const handlephoneNumberChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  const handllocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocation(e.target.value);
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file && file.size <= 5 * 1024 * 1024) {
       setImage(file);
     } else {
       alert("File size should be less than 5MB");
       setImage(null);
     }
   };

   const handleUpload = async () => {
    if (!image) return;
    setUploading(true);
 
 
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setImageUrl(response.data.secure_url);
      console.log(imageUrl);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const handleSaveProfile = async () => {
    try {
      const contactInfoString = JSON.stringify(contacts);
     
      await api.post("/laboratory/profile", {
        description,
        labName,
        phoneNumber,
        location,
        labId,
        updatedAt,
        contactInformation: contactInfoString,
        profilePic:imageUrl,
        rating
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
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white text-gray-900">
      <div className="w-64 flex-shrink-0">
          <LabSidebar />
        </div>
      <div className="p-8 flex-1 flex justify-center items-center">
             <div className="w-full max-w-fit border rounded-lg shadow-md bg-white border-gray-200">
             <div className="text-gray-500 text-sm">
                      Updated: {updatedAt}<br></br>
                      Created:{createdAt}
                    </div>
      
             <div className="p-8 flex-1 flex justify-center items-center">
             <div>
               <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80">
                 <div className="relative w-32 h-32">
                   {imageUrl ? (
                     <img
                       src={imageUrl}
                       alt="Profile Picture"
                       className="w-32 h-32 rounded-full object-cover border"
                     />
                   ) : (
                     <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                       No Image
                     </div>
                   )}
                 </div>
      
      
                 <input
                   type="file"
                   accept="image/*"
                   className="hidden"
                   id="profilePicInput"
                   onChange={handleProfilePicChange}
                 />
                 <label
                   htmlFor="profilePicInput"
          
                 >
                   <Camera className="inline-block mr-2" /> Choose Image
                 </label>
      
      
                 <button
                   onClick={handleUpload}
                
                   disabled={!image || uploading}
                 >
                   {uploading ? "Uploading..." : <><Upload className="inline-block mr-2" /> Upload</>}
                 </button>
               </div>
             </div>
           </div>
      
      

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">Laboratory Id</label>
            <textarea
              name="laboratoryId"
              value={labId}
              readOnly
              rows={1}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed text-gray-600"
            />
          </div>

          <div className="p-6">
            <label className="block text-gray-700 font-medium mb-2">License Number</label>
            <textarea
              name="licenceNumber"
              value={licenceNumber}
              readOnly
              rows={1}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed text-gray-600"
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
            <label className="block text-gray-700 font-medium mb-2">Laboratory Name</label>
            <textarea
              name="pharmacyname"
              value={labName}
              onChange={handleLabNameChange}
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
            <label className="block text-gray-700 font-medium mb-2">About Laboratory</label>
            <textarea
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="p-6">
            <span className="block text-gray-700 font-medium mb-2">Rating : </span>
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="relative w-8 h-8">
                            <Star 
                              className="absolute w-8 h-8 text-gray-300" 
                            />
                            <div 
                              className="absolute w-4 h-8 overflow-hidden cursor-pointer"
                              onClick={() => handleRating(star - 0.5)}
                            >
                              {rating >= star - 0.5 && (
                                <Star className="absolute w-8 h-8 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                          
                            <div 
                              className="absolute left-4 w-4 h-8 overflow-hidden cursor-pointer"
                              onClick={() => handleRating(star)}
                            >
                              {rating >= star && (
                                <Star className="absolute -left-4 w-8 h-8 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                  <span className="ml-2 text-gray-700">({rating}/5)</span>
                </div>
              </div>
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
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2">
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
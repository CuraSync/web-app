"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PharmacySidebar from "../../pharmacy/sidebar/sidebar";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Camera, Star } from "lucide-react";
import api from "@/utils/api";
import axios from "axios";
import Image from "next/image";

const SettingsPage = () => {
  const router = useRouter();
  // Initialize all state values with empty strings instead of null
  const [description, setDescription] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [location, setLocation] = useState("");
  const [pharmacyId, setPharmacyId] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  interface Contact {
    type: string;
    value: string;
  }
  
  const [contacts, setContacts] = useState<Contact[]>([{ type: "", value: "" }]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await api.post("/pharmacy/profile");
      // Ensure we never set null values
      setDescription(response.data.description || "");
      setPharmacyName(response.data.pharmacyName || "");
      setLocation(response.data.location || "");
      setPharmacyId(response.data.pharmacyId || "");
      setUpdatedAt(response.data.updatedAt || "");
      setCreatedAt(response.data.createdAt || "");
      setImageUrl(response.data.profilePic || "");
      setContactInformation(response.data.contactInformation || "");
      setRating(response.data.rating || 0);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }

    try {
      const response = await api.get("/pharmacy/home");
      // Ensure we never set null values
      setPharmacyName(response.data.pharmacyName || "");
      setPhoneNumber(response.data.phoneNumber || "");
      setEmail(response.data.email || "");
      setLicenceNumber(response.data.licenceNumber || "");
      setDescription(response.data.description || "");
      setLocation(response.data.location || "");
      setPharmacyId(response.data.pharmacyId || "");
      setUpdatedAt(response.data.updatedAt || "");
      setCreatedAt(response.data.createdAt || "");
      setContactInformation(response.data.contactInformation || "");
      setImageUrl(response.data.profilePic || "");
      setRating(response.data.rating || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactInformation && typeof contactInformation === 'string' && contactInformation.trim() !== '') {
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
    document.title = "Pharmacy Settings | CuraSync";
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // All your handler functions remain the same
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePharmacyNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPharmacyName(e.target.value);
  };

  const handlephoneNumberChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocation(e.target.value);
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
      setImageUrl(response.data.secure_url || "");
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
      await api.post("/pharmacy/profile", {
        description,
        pharmacyName,
        phoneNumber,
        location,
        pharmacyId,
        updatedAt,
        contactInformation: contactInfoString,
        profilePic: imageUrl,
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
    if (contacts.length <= 1) return;
    setContacts(contacts.filter((_, index) => index !== indexToRemove));
  };


 if (loading) {
  return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
          <PharmacySidebar />
      </div>
      <div className="flex flex-col w-full h-screen bg-gray-50 p-8 overflow-y-auto">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-xl w-64 mb-4 animate-pulse"></div>
        </div>
        <div className="space-y-8">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="h-8 bg-gray-200 rounded-xl w-64 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
  <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
    <PharmacySidebar />
  </div>

  <div className="p-8 flex-1 flex justify-center items-center">
    <div className="w-full max-w-fit rounded-lg shadow-md bg-white border-gray-200">
      <div className="text-gray-500 text-sm">
        Updated: {updatedAt} <br /> Created: {createdAt}
      </div>

      <div className="p-8 flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80">
          <div className="relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Profile Picture"
                width={128}  
                height={128}
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
          <label htmlFor="profilePicInput">
            <Camera className="inline-block mr-2" /> Choose Image
          </label>

          <button
            onClick={handleUpload}
            disabled={!image || uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mt-2"
          >
            {uploading ? "Uploading..." : <><Upload className="inline-block mr-2" /> Upload</>}
          </button>
        </div>
      </div>

      <div className="p-6">
        <label className="block text-gray-700 font-medium mb-2">Pharmacy Id</label>
        <textarea
          name="pharmacyId"
          value={pharmacyId}
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
        <label className="block text-gray-700 font-medium mb-2">Pharmacy Name</label>
        <textarea
          name="pharmacyName"
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
          onChange={handleLocationChange}
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
    </div>
  </div>
</div>

 );
};


export default SettingsPage;


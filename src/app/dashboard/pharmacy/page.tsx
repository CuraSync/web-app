"use client";
import React, { useEffect, useState, useRef } from "react";
import PharmacySidebar from "./sidebar/sidebar";
import api from "@/utils/api";
import Image from 'next/image';
import { toast } from "sonner";
import db1 from "../../../../public/assets/images/db1.jpg";
import db2 from "../../../../public/assets/images/db2.jpg";
import db3 from "../../../../public/assets/images/db3.jpg";
import db4 from "../../../../public/assets/images/db4.jpg";

const PharmacyDashboard = () => {
  const [name, setName] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [rating, setRating] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null); 

  const fetchHomeData = async () => {
    setLoading(true);
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
    }finally {
      setLoading(false);
    }
  };

  const fetchBlogs = () => {
    const newsBlogs = [
      { title: "Pharmacy Times News", url: "https://www.pharmacytimes.com/?utm_source=chatgpt.com", image: db1 },
      { title: "Pharmacy Magazine Updates", url: "https://www.pharmacymagazine.co.uk/news?utm_source=chatgpt.com", image: db2 },
      { title: "Drug Topics Insights", url: "https://www.drugtopics.com/news?utm_source=chatgpt.com", image: db3 },
      { title: "The Pharmaceutical Journal", url: "https://pharmaceutical-journal.com/news?utm_source=chatgpt.com", image: db4 },

    ];
    setBlogs(newsBlogs);
  };
    useEffect(() => {
        document.title = "Pharmacy Dashboard | CuraSync";
      }, []);

  useEffect(() => {
    fetchHomeData();
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!loading) {
      const scrollContainer = scrollRef.current;
      let animationFrameId: number;
      const scrollSpeed = 0.5;

      const smoothScroll = () => {
        if (scrollContainer) {
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.offsetWidth) {
            setTimeout(() => {
              scrollContainer.scrollLeft = 0;
            }, 1000);
          } else {
            scrollContainer.scrollLeft += scrollSpeed;
          }
          animationFrameId = requestAnimationFrame(smoothScroll);
        }
      };
      smoothScroll();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-shrink-0 md:w-1/4 lg:w-1/5">
        <PharmacySidebar />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden p-8 bg-white">
        <div className="border-b pb-4 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Pharmacy Dashboard</h1>
        </div>

        {/* Pharmacy Profile Section */}
        <div className="bg-white rounded-lg shadow-lg border p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-green-100 rounded-full flex items-center justify-center">
              {profilePic ? (
                <Image
                  src={profilePic}
                  alt={name}
                  width={100}
                  height={100}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-green-600 text-3xl font-semibold">
                  {name?.charAt(0)?.toUpperCase() || "P"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              <p className="text-gray-600 mt-1">License: {licenceNumber}</p>
              <p className="text-gray-600">Rating: {rating}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
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

          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">{description || "No description available."}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Additional Contact Information</h3>
            {contactInformation.length !== 0 ? (
              (() => {
                try {
                  const parsedData = JSON.parse(contactInformation);
                  return parsedData.map((contact: { type: string; value: string }, index: number) => (
                    <p key={index} className="text-gray-600">
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

        {/* Blogs/News Section with Infinite Scroll */}
        <div className="mt-8 bg-white rounded-lg shadow-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">News & Blogs</h3>

          {/* Auto-scrolling container */}
          <div ref={scrollRef} className="overflow-x-hidden flex space-x-6 py-4 scrolling-touch">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <div
                  key={index}
                  className="flex-none w-72 bg-gray-50 p-4 rounded-lg hover:shadow-2xl transition duration-300 ease-in-out"
                >
                  <div className="w-full h-40 bg-gray-300 rounded-md overflow-hidden shadow-md">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800">{blog.title}</h4>
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mt-2 inline-block"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No blogs or news available at the moment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;

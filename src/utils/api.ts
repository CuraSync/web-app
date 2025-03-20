import axios from "axios";
import { toast } from "sonner";
import decodeToken from "./jwt";

const axiosInstance = axios.create({
  baseURL: "https://curasync-backend.onrender.com",
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const deviceId = localStorage.getItem("deviceId");
      const id = localStorage.getItem("id");

      if (!refreshToken || !deviceId || !id) {
        throw new Error("Missing authentication data");
      }

      const refreshResponse = await axios.post(
        "https://curasync-backend.onrender.com/refresh",
        {
          deviceId,
          refreshToken,
          id
        }
      );

      const { accessToken } = refreshResponse.data;
      localStorage.setItem("accessToken", accessToken);

      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);

    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("id");
      
      toast.error("Session expired. Please log in again.");
      
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login/doctor";
      }
      
      return Promise.reject(refreshError);
    }
  }
);

// Helper functions for common API operations
const api = {
  get: (url: string) => axiosInstance.get(url),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  delete: (url: string) => axiosInstance.delete(url),
  
  // Doctor profile operations
  doctor: {
    // Get doctor profile
    getProfile: () => axiosInstance.get('/doctor/profile'),
    
    // Update doctor profile
    updateProfile: (data: any) => axiosInstance.post('/doctor/profile', {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      slmcRegisterNumber: data.slmcRegisterNumber,
      nic: data.nic,
      phoneNumber: data.phoneNumber,
      specialization: data.specialization,
      education: data.education,
      certifications: data.certifications,
      yearsOfExperience: data.yearsOfExperience,
      currentWorkingHospitals: data.currentWorkingHospitals,
      availability: data.availability,
      description: data.description
    }),
    
    // Upload profile picture
    uploadProfilePic: (file: File) => {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      return axiosInstance.post('/doctor/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  }
};

export default api;

import axios from "axios";
import { toast } from "sonner";
import { decodeToken } from "./jwt";

// Define interface for decoded token
interface DecodedToken {
  id: string;
  // Add other expected properties from your JWT payload here
}

const axiosInstance = axios.create({
  baseURL: "https://curasync-backend.onrender.com",
  withCredentials: false,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const deco = refreshToken ? decodeToken(refreshToken) as DecodedToken : null;
        
        const refreshResponse = await axios.post(
          "https://curasync-backend.onrender.com/refresh",
          {
            deviceId: localStorage.getItem("deviceId"),
            refreshToken: refreshToken,
            id: deco?.id,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        const newRefreshToken = refreshResponse.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Session expired. Please log in again.");
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

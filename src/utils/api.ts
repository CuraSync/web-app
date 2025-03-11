import axios from "axios";
import { toast } from "sonner";
import decodeToken from "./jwt";

const axiosInstance = axios.create({
  baseURL: "https://curasync-backend.onrender.com",
  withCredentials: false,
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

// New access token generate using refreshtoken
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const deco = refreshToken ? decodeToken(refreshToken) : null;
        const refreshResponse = await axios.post(
          "https://curasync-backend.onrender.com/refresh",
          {
            deviceId: localStorage.getItem("deviceId"),
            refreshToken: refreshToken,
            id: deco ? (deco as any).id : undefined,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        const newRefreshToken = refreshResponse.data.accessToken;
        localStorage.setItem("refreshToken", newRefreshToken);

        // Retry the original request with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
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

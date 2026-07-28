import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let clerkToken = null;

export const setClerkToken = (token) => {
  clerkToken = token;
};

// Interceptor to attach Clerk Bearer Authorization token to every API request
axiosInstance.interceptors.request.use(
  (config) => {
    if (clerkToken) {
      config.headers.Authorization = `Bearer ${clerkToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

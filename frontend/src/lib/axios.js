import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let _clerkToken = null;
let _clerkUserData = null;

export const setClerkToken = (token, userData = null) => {
  _clerkToken = token;
  if (userData) {
    _clerkUserData = userData;
  }
};

export const getClerkToken = () => _clerkToken;

// Interceptor: Attach Bearer Authorization header AND fallback x-clerk headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (_clerkToken) {
      config.headers.Authorization = `Bearer ${_clerkToken}`;
    }
    if (_clerkUserData?.id) {
      config.headers["x-clerk-user-id"] = _clerkUserData.id;
      config.headers["x-clerk-user-name"] = encodeURIComponent(_clerkUserData.name || "");
      config.headers["x-clerk-user-email"] = encodeURIComponent(_clerkUserData.email || "");
      config.headers["x-clerk-user-image"] = encodeURIComponent(_clerkUserData.imageUrl || "");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Log auth errors clearly for debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[Axios] 401 Unauthorized — token may be missing or expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

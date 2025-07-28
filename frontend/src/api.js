import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach CSRF and JWT
instance.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("csrftoken");
  const token = localStorage.getItem("token");

  const unsafeMethods = ["post", "put", "patch", "delete"];
  const method = config.method?.toLowerCase();

  if (csrfToken && unsafeMethods.includes(method)) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  const publicEndpoints = [
    "/api/login/",
    "/api/register/",
    "/api/token/",
    "/api/token/refresh/",
    "/api/send-verification-code/",
    "/api/verify-code/",
    "/api/set-password/"
  ];
  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor for expired token auto-refresh
instance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            `${instance.defaults.baseURL}/api/token/refresh/`,
            { refresh: refreshToken },
          );
          
          localStorage.setItem("token", data.access);
          instance.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
          
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check token validity
export const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Helper function to refresh token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  
  try {
    const { data } = await axios.post(
      `${instance.defaults.baseURL}/api/token/refresh/`,
      { refresh: refreshToken }
    );
    
    localStorage.setItem("token", data.access);
    return true;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return false;
  }
};

export default instance;

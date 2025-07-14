import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  withCredentials: true,  // Important for session-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  // Add CSRF token only for unsafe methods and if not using JWT
  const csrfToken = Cookies.get("csrftoken");
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;

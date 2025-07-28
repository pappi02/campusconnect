import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api"; // Ensure this has a baseURL set to http://localhost:8000
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthContext";

// Utility to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  }, [navigate]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      logout();
      return null;
    }

    try {
      const response = await axios.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      const { access, refresh } = response.data;

      if (!access) {
        throw new Error("No access token received");
      }

      setToken(access);
      localStorage.setItem("token", access);

      if (refresh) {
        setRefreshToken(refresh);
        localStorage.setItem("refreshToken", refresh);
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // After refreshing the token, fetch the complete user profile.
      const { data: userProfile } = await axios.get("/api/profile/");
      setUser(userProfile);


      return access;
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
      logout();
      return null;
    }
  }, [refreshToken, logout]);

  // Decode JWT and set user
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !isTokenExpired(token)) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data: userProfile } = await axios.get("/api/profile/");
          setUser(userProfile);
        } catch (error) {

          console.error("Failed to fetch user profile on init:", error);
          if (error.response?.status === 401) {
            await refreshAccessToken();
          } else {
            logout();
          }
        }
      } else if (token) {
        // Attempt to refresh if token is expired
        await refreshAccessToken();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token, logout, refreshAccessToken]);


  // Axios interceptor to auto-refresh expired access token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          error.response?.data?.code === "token_not_valid" &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken, refreshAccessToken]);

  // Login
  const login = async ({ email, password }) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password are required",
        };
      }

      const response = await axios.post("/api/login/", { email, password }, {
        timeout: 30000 // Override timeout for login requests
      });

      const { access, refresh, user: userData } = response.data;

      if (!access || !refresh) {
        return {
          success: false,
          message: "Invalid response from server",
        };
      }

      const decoded = jwtDecode(access);
      const currentUser = {
        id: decoded.user_id,
        email: decoded.email || userData?.email,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        role: userData?.role,
      };

      performLogin({ user: currentUser, access, refresh });

      // Redirect after login
      const from = location.state?.from?.pathname || "/home";
      navigate(userData?.role === "vendor" ? "/vendor/dashboard" : from, {
        replace: true,
      });

      return { success: true, redirected: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return {
        success: false,
        message:
          error.response?.data?.detail || "Login failed. Please try again.",
      };
    }
  };

  const performLogin = useCallback(({ user, access, refresh }) => {
    setUser(user);
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  }, []);



  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

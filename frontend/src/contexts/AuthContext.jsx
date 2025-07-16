import React, { createContext, useState, useEffect, useCallback } from "react";
import { getToken, decodeToken } from "./authTokenHelper";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());

  // Restore user from token on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.user_id) {
        // Optionally fetch user details from backend here
        setUser({ id: decoded.user_id, username: decoded.username || "" });
      }
    }
  }, []);

  // Function to refresh token using backend API
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        logout();
        return;
      }
      const response = await api.post("/api/token/refresh/", { refresh: currentToken });
      const newToken = response.data.access;
      setToken(newToken);
      localStorage.setItem("authToken", newToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
    }
  }, []);

  // Check token expiration and refresh if needed
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp) {
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();
        if (expiresAt < now) {
          // Token expired, try to refresh
          refreshToken();
        } else {
          // Set timeout to refresh token a bit before expiration (e.g., 1 minute before)
          const timeout = expiresAt - now - 60000;
          const timerId = setTimeout(() => {
            refreshToken();
          }, timeout > 0 ? timeout : 0);
          return () => clearTimeout(timerId);
        }
      }
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token, refreshToken]);

  const login = (userData, authToken) => {
    console.log("AuthContext login called with token:", authToken);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { jwtDecode } from "jwt-decode"; 

export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Decode JWT token to get payload
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  const now = Date.now() / 1000;
  return decoded.exp < now;
};

// Refresh token helper (optional, can be used in AuthContext)
export const refreshToken = async () => {
  // This function can be implemented to call backend refresh endpoint if needed
  // For now, left as placeholder
  return null;
};

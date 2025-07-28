// PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner or placeholder while authentication is being restored
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

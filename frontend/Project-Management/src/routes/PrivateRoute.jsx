import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    // Belum login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role tidak cocok
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoadingLines from "../components/ui/LoadingLines";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingLines />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render child routes if user exists
};

export default ProtectedRoute;

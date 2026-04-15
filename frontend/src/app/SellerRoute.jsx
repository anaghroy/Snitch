import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoadingLines from "../components/ui/LoadingLines";

const SellerRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingLines />;
  }

  const currentUser = user?.user || user;

  // If the user isn't logged in, or isn't a seller, deflect them
  if (!currentUser || currentUser.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;

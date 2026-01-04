import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuth") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

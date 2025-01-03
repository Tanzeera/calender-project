import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = localStorage.getItem("isAdmin") === "true";

  return isAuthenticated ? <Component /> : <Navigate to="/admin-login" />;
};

export default PrivateRoute;

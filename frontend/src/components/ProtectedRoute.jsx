import { Navigate, useLocation } from "react-router-dom";

/*
  This component blocks access if user is not logged in.
*/
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const servicesFromState = location.state?.services;
    let services = Array.isArray(servicesFromState) ? servicesFromState : [];

    if (services.length === 0) {
      try {
        services = JSON.parse(localStorage.getItem("cart") || "[]");
      } catch {
        services = [];
      }
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname, services }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

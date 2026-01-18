// AdminRoute.jsx
// Protects admin routes: only logged-in users with isAdmin=true can access.

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, authReady } = useContext(AuthContext);

  if (!authReady) return null; // or a loading spinner
  // Not logged in
   if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin
  if (!user.isAdmin) return <Navigate to="/" replace />;

  // Admin can access
  return children;
};

export default AdminRoute;

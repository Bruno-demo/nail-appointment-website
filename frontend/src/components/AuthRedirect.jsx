import { Navigate } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");

  // If user is already logged in, redirect away from login/register
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirect;

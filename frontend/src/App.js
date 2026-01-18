import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

// your existing page imports...


import AuthRedirect from "./components/AuthRedirect";
import BackToTop from "./components/BackToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieBanner from "./components/CookieBanner";
// App.js routes (add these)
import AdminRoute from "./admin/AdminRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Services = lazy(() => import("./pages/Services"));
const Booking = lazy(() => import("./pages/Booking"));
const Account = lazy(() => import("./pages/Account"));
const About = lazy(() => import("./pages/About"));
const Location = lazy(() => import("./pages/Location"));
const Collections = lazy(() => import("./pages/Collections"));
const Payment = lazy(() => import("./pages/Payment"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const ServicesAdmin = lazy(() => import("./admin/pages/ServicesAdmin"));
const AppointmentsAdmin = lazy(() => import("./admin/pages/AppointmentsAdmin"));
const UsersAdmin = lazy(() => import("./admin/pages/UsersAdmin"));



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Suspense fallback={<div className="app-loading">Loading...</div>}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/login" element={
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>} />
                <Route path="/register" element={
                  <AuthRedirect>
                    <Register />
                  </AuthRedirect>
                } />
                <Route
                  path="/book"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route path="/account" element={<Account />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
              <Route path="/location" element={<Location />} />
              <Route path="*" element={<NotFound />} />
            </Route>
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="appointments" element={<AppointmentsAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
          <CookieBanner />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

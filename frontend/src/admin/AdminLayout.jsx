// AdminLayout.jsx
// Admin panel layout with sidebar navigation + top header.

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleGoSite = () => {
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h3>Yves Admin</h3>
          <small>Control Panel</small>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/services" className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}>
            Services
          </NavLink>

          <NavLink to="/admin/appointments" className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}>
            Appointments
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}>
            Users
          </NavLink>
        </nav>

        <button className="admin-site-btn" onClick={handleGoSite}>
          View Website
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h2>Admin Panel</h2>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;

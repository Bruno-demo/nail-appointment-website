// Dashboard.jsx
// Admin overview: stats + quick preview lists.
// Uses existing services and appointments endpoints.

import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { adminGetServices, adminGetAppointments } from "../../api/admin";
import "./Dashboard.css";

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [sRes, aRes] = await Promise.all([
          adminGetServices(),
          adminGetAppointments()
        ]);
        setServices(sRes.data || []);
        setAppointments(aRes.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load admin dashboard data");
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalServices = services.length;
    const totalAppointments = appointments.length;

    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const canceled = appointments.filter((a) => a.status === "canceled").length;

    return { totalServices, totalAppointments, pending, confirmed, canceled };
  }, [services, appointments]);

  return (
    <div>
      <div className="admin-page-head">
        <h1>Dashboard</h1>
        <p>Overview of your salon system</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="stats-grid">
        <StatCard title="Total Services" value={stats.totalServices} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} />
        <StatCard title="Pending" value={stats.pending} subtitle="Awaiting confirmation" />
        <StatCard title="Confirmed" value={stats.confirmed} subtitle="Approved bookings" />
        <StatCard title="Canceled" value={stats.canceled} subtitle="Canceled bookings" />
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Latest Appointments</h3>

          {appointments.length === 0 ? (
            <p className="muted">No appointments yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>User</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 6).map((a) => (
                    <tr key={a._id}>
                      <td data-label="Date">{a.date}</td>
                      <td data-label="Time">{a.time}</td>
                      <td data-label="User">{a.user?.name || "User"}</td>
                      <td data-label="Status">
                        <span className={`pill ${a.status}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="admin-panel dashboard-services">
          <h3>Services</h3>

          {services.length === 0 ? (
            <p className="muted">No services yet.</p>
          ) : (
            <ul className="simple-list">
              {services.slice(0, 6).map((s) => (
                <li key={s._id}>
                  <div>
                    <strong>{s.name}</strong>
                    <div className="muted">{s.duration} mins</div>
                  </div>
                  <div className="muted">{s.price} RWF</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


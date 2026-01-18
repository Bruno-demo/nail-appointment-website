// AppointmentsAdmin.jsx
// Shows all appointments for admin with quick filters.
// Status update route must exist in backend (we can add later).

import { useEffect, useMemo, useState } from "react";
import { adminGetAppointments, adminUpdateAppointmentStatus } from "../../api/admin";
import "./AppointmentsAdmin.css";

const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await adminGetAppointments();
      setAppointments(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load appointments");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  const setStatus = async (id, status) => {
    setMsg("");
    setError("");
    try {
      setLoading(true);
      await adminUpdateAppointmentStatus(id, status);
      setMsg("Appointment updated âœ…");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Status update failed (backend route needed)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Appointments</h1>
        <p>Manage bookings from all customers</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {msg && <div className="admin-alert">{msg}</div>}

      <div className="admin-toolbar">
        <div className="tabs">
          {["all", "pending", "confirmed", "canceled"].map((t) => (
            <button
              key={t}
              className={filter === t ? "tab active" : "tab"}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        {filtered.length === 0 ? (
          <p className="muted">No appointments found.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>User</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th style={{ width: 260 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id}>
                    <td data-label="Date">{a.date}</td>
                    <td data-label="Time">{a.time}</td>
                    <td data-label="User">{a.user?.name || "User"}</td>
                    <td data-label="Service">{a.service?.name || "Service"}</td>
                    <td data-label="Status"><span className={`pill ${a.status}`}>{a.status}</span></td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <button disabled={loading} onClick={() => setStatus(a._id, "confirmed")}>
                          Confirm
                        </button>
                        <button disabled={loading} onClick={() => setStatus(a._id, "pending")}>
                          Pending
                        </button>
                        <button className="danger" disabled={loading} onClick={() => setStatus(a._id, "canceled")}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsAdmin;


// UsersAdmin.jsx
// Lists users and allows toggling admin (backend route needed).

import { useEffect, useState } from "react";
import { adminGetUsers, adminToggleAdmin } from "../../api/admin";
import "./UsersAdmin.css";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setError("");
      const res = await adminGetUsers();
      setUsers(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load users (backend route needed)");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (u) => {
    setMsg("");
    setError("");
    try {
      setLoading(true);
      await adminToggleAdmin(u._id, !u.isAdmin);
      setMsg("User updated âœ…");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Update failed (backend route needed)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Users</h1>
        <p>Manage customer accounts and admin access</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {msg && <div className="admin-alert">{msg}</div>}

      <div className="admin-panel">
        {users.length === 0 ? (
          <p className="muted">No users found.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td data-label="Name"><strong>{u.name}</strong></td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Phone">{u.phone || "-"}</td>
                    <td data-label="Role">
                      <span className={`role-badge ${u.isAdmin ? "admin" : "user"}`}>
                        {u.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    <td data-label="Actions">
                      <button
                        disabled={loading}
                        onClick={() => toggleAdmin(u)}
                        className={`action-btn ${u.isAdmin ? "remove-admin" : "make-admin"}`}
                      >
                        {u.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
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

export default UsersAdmin;


// ServicesAdmin.jsx
// Admin can add/update/delete services with image upload.

import { useEffect, useState } from "react";
import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService
} from "../../api/admin";
import "./ServicesAdmin.css";

const emptyForm = { name: "", price: "", duration: "", bookingFee: "" };

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await adminGetServices();
      setServices(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load services");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({
      name: s.name || "",
      price: s.price ?? "",
      duration: s.duration ?? "",
      bookingFee: s.bookingFee ?? ""
    });
    setImageFile(null);
    setMsg("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!form.name || form.price === "" || form.duration === "" || form.bookingFee === "") {
      setError("Name, price, duration and booking fee are required.");
      return;
    }

    if (!editingId && !imageFile) {
      setError("Service image is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("price", String(form.price));
      payload.append("duration", String(form.duration));
      payload.append("bookingFee", String(form.bookingFee));
      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingId) {
        await adminUpdateService(editingId, payload);
        setMsg("Service updated successfully.");
      } else {
        await adminCreateService(payload);
        setMsg("Service created successfully.");
      }

      cancelEdit();
      await load();
    } catch (e2) {
      setError(e2.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setMsg("");
    setError("");
    try {
      setLoading(true);
      await adminDeleteService(id);
      setMsg("Service deleted.");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1>Services</h1>
        <p>Add, edit and remove salon services</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {msg && <div className="admin-alert">{msg}</div>}

      <div className="services-admin-grid">
        <div className="admin-panel">
          <h3>{editingId ? "Edit Service" : "Create Service"}</h3>

          <form onSubmit={handleSubmit} className="admin-form">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Gel Manicure" />

            <div className="two">
              <div>
                <label>Price (RWF)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} />
              </div>
              <div>
                <label>Duration (mins)</label>
                <input name="duration" type="number" value={form.duration} onChange={handleChange} />
              </div>
            </div>

            <label>Booking Fee (RWF)</label>
            <input name="bookingFee" type="number" value={form.bookingFee} onChange={handleChange} />

            <label>Service Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {editingId && <p className="muted">Leave blank to keep the current image.</p>}

            <div className="actions">
              <button className="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>

              {editingId && (
                <button type="button" onClick={cancelEdit} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <h3>All Services</h3>

          {services.length === 0 ? (
            <p className="muted">No services found.</p>
          ) : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Fee</th>
                    <th>Duration</th>
                    <th style={{ width: 190 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s._id}>
                      <td data-label="Name"><strong>{s.name}</strong></td>
                      <td data-label="Price">{s.price} RWF</td>
                      <td data-label="Fee">{s.bookingFee || 0} RWF</td>
                      <td data-label="Duration">{s.duration} mins</td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <button onClick={() => startEdit(s)} disabled={loading}>Edit</button>
                          <button className="danger" onClick={() => handleDelete(s._id)} disabled={loading}>
                            Delete
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
    </div>
  );
};

export default ServicesAdmin;

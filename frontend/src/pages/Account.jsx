import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import "./Account.css";
import { MdEdit } from "react-icons/md";


const Account = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setForm({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || ""
    });


    // Fetch user appointments
    API
      .get("/appointments/my")
      .then((res) => {
        setAppointments(res.data);
        setLoading(false); // ✅ NOW USED
      })
      .catch(() => {
        setLoading(false); // ✅ NOW USED
      });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      const res = await API.put("/users/me", form);

      // Update UI + localStorage
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsEditOpen(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };


  return (
    <div className="account-container">
      {/* ================= HEADER ================= */}
      <div className="account-header">
        <div className="account-header-text">
          <h2>My Account</h2>
          <p>Manage your profile and appointments</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= USER INFO ================= */}
      {user && (
        <div className="account-card">
          <h3>Profile Information</h3>
          <div className="account-grid">
            <div>
              <span>Name</span>
              <p>{user.name}</p>
            </div>
            <div>
              <span>Email</span>
              <p>{user.email}</p>
            </div>
            <div>
              <span>Phone</span>
              <p>{user.phone || "Not provided"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="edit-profile-btn"
          >
           <MdEdit /> Edit Profile
          </button>
        </div>
      )}
      {/* ================= APPOINTMENTS ================= */}
      <div className="account-card">
        <h3>My Appointments</h3>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="empty-msg">You have no appointments yet.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <div className="appointment-item" key={appt._id}>
                <div>
                  <h4>{appt.service?.name || "Service"}</h4>
                  <p>
                    {appt.date} at {appt.time}
                  </p>
                </div>
                <span className={`status ${appt.status}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};

export default Account;

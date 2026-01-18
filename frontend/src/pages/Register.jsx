import React, { useState } from "react";
import API from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Login.css";
import { useNavigate } from "react-router-dom";
/*
  Register Page
  - Sends name, email, phone, password to backend
  - Handles success & error messages
  - Tells user to verify email
*/

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
       if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-container register">

      <form className="login-form register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Sign In Form</h3>
          <small>Welcome Back it's plessure to see you again</small>
        </div>
        
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}


        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          
        />

        <div className="password-wrapper">
          <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
         <div className="footer-form">
        <p>Already have any account yet</p>
          <NavLink
            to="/login"
          >
            <p className='contact-btn'>Sign In</p>
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Register;

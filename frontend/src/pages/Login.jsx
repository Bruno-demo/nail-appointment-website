import { useState, useEffect, useContext } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";



function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const { loginUser } = useContext(AuthContext);


  useEffect(() => {
    if (params.get("verified")) {
      setSuccess(" Email verified successfully. You can now login.");
    }
    if (params.get("error") === "expired") {
      setError(" Verification link expired or invalid.");
      setIsExpired(true);
    }
    if (params.get("error") === "invalid") {
      setError(" Invalid verification link.");
    }
  }, [params]);
  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🚫 Stop browser refresh

    setError("");
    setSuccess("");
    if (isExpired) {
      // 🔁 RESEND VERIFICATION
      await handleResend();
      return;

    }
    // 🔐 NORMAL LOGIN
    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      loginUser(res.data.user, res.data.token);

      setSuccess("Login successful!");

      const redirectTo = location.state?.redirectTo || "/";
      const services = location.state?.services || [];

      navigate(redirectTo, { state: { services } });

    } catch (err) {
      // ❌ Show backend error message
      if (err.response && err.response.data.message) {
        const errorMsg = err.response.data.message;
        console.log(errorMsg)
        setError(errorMsg);

        if (errorMsg.includes("expired")) {
          setIsExpired(true);      // switch UI mode
          setForm({ ...form, password: "" }); // clear password
        }
      } else {
        setError("Something went wrong. Try again.");
      }

    } finally {
      setLoading(false);
    }

  };


  // RESEND EMAIL
  const handleResend = async () => {
    setResendMessage("");
    setError("");

    try {
      const res = await API.post("/auth/resend-verification", {
        email: form.email
      });

      setResendMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend email");
    }
  };

  return (
    <div className="Login-container">

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Sign In Form</h3>
          <small>Welcome Back it's plessure to see you again</small>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        {resendMessage && <p style={{ color: "green" }}>{resendMessage}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}

        />
        {!isExpired && (

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}

            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

        )}
        <button type="submit" disabled={loading || !form.email}>
          {loading
            ? isExpired
              ? "Sending..."
              : "Logging in..."
            : isExpired
              ? "Resend Verification"
              : "Login"}
        </button>

        <div className="footer-form">

          <p>Don't have any account yet</p>
          <NavLink
            to="/register"
          >
            <p className='contact-btn'>Sign Up</p>
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;

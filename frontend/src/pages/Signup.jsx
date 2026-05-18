import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      setMessage("Password and confirm password do not match");
      return;
    }

    try {
      const res = await API.post("/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container signup-container">
        <div className="auth-brand-panel blue-panel">
          <h2>✦ InsightHR</h2>
          <h1>Empowering the future of HR Intelligence.</h1>
          <p>
            Join organizations using InsightHR to streamline performance
            analytics, employee management, and AI-driven growth strategies.
          </p>

          <div className="feature-list">
            <div>
              <span>👥</span>
              <div>
                <h3>Team Management</h3>
                <p>Holistic overview of your global workforce.</p>
              </div>
            </div>

            <div>
              <span>📊</span>
              <div>
                <h3>AI Analytics</h3>
                <p>Data-driven insights for smarter decisions.</p>
              </div>
            </div>
          </div>
        </div>

        <form className="auth-form-panel" onSubmit={handleSignup}>
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Get started with your free administrative trial.</p>

          {message && <p className="error-box">{message}</p>}

          <label>Full Name</label>
          <div className="input-icon">
            <span>👤</span>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <label>Work Email</label>
          <div className="input-icon">
            <span>✉</span>
            <input
              name="email"
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="two-col">
            <div>
              <label>Password</label>
              <div className="input-icon">
                <span>🔒</span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label>Confirm Password</label>
              <div className="input-icon">
                <span>🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <label className="check-row">
            <input type="checkbox" required />
            I agree to the Terms of Service and Privacy Policy.
          </label>

          <button className="primary-btn" type="submit">
            Create Admin Account
          </button>

          <div className="divider">
            <span></span>
            <p>OR REGISTER WITH</p>
            <span></span>
          </div>

          <div className="social-row">
            <button type="button">Google</button>
            <button type="button">SSO</button>
          </div>

          <p className="switch-link">
            Already have an account? <Link to="/">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
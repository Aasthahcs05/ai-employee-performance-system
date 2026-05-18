import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container login-container">
        <div className="auth-brand-panel light-panel">
          <div className="brand-icon">✦</div>
          <h1>InsightHR</h1>
          <p>
            Next-generation performance analytics powered by artificial
            intelligence to unlock your team's true potential.
          </p>

          <div className="insight-card">
            <span>✦</span>
            <div>
              <h3>Predictive Insights</h3>
              <p>Our AI models identify talent trends before they happen.</p>
            </div>
          </div>
        </div>

        <form className="auth-form-panel" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Access your administrative analytics dashboard.</p>

          {message && <p className="error-box">{message}</p>}

          <label>Email Address</label>
          <div className="input-icon">
            <span>✉</span>
            <input
              name="email"
              type="email"
              placeholder="admin@insighthr.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="label-row">
            <label>Password</label>
            <a href="#">Forgot password?</a>
          </div>

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

          <label className="check-row">
            <input type="checkbox" />
            Remember this device
          </label>

          <button className="primary-btn" type="submit">
            Sign In to InsightHR →
          </button>

          <div className="divider">
            <span></span>
            <p>OR CONTINUE WITH</p>
            <span></span>
          </div>

          <div className="social-row">
            <button type="button">Google</button>
            <button type="button">Microsoft</button>
          </div>

          <p className="switch-link">
            Don&apos;t have an account? <Link to="/signup">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
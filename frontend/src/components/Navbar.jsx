import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-theme");
    else document.body.classList.remove("dark-theme");
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const title =
    activeSection === "dashboard"
      ? "Dashboard Overview"
      : activeSection === "employees"
      ? "Employee Directory"
      : "AI Analytics";

  return (
    <header className="topbar">
      <h2>{title}</h2>

      <div className="topbar-actions">
        <div className="search-pill">
          🔍
          <input placeholder="Search analytics..." />
        </div>

        {activeSection === "analytics" && (
          <button className="primary-btn mini" onClick={() => window.dispatchEvent(new CustomEvent("generate-insights"))}>
            ✦ Generate New Insights
          </button>
        )}

        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div style={{position: 'relative'}}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>🔔</button>
          {showNotifications && (
            <div className="notifications-dropdown">
              <h4>Recent Alerts</h4>
              <ul>
                <li><span className="dot urgent"></span> 3 Employees need training</li>
                <li><span className="dot info"></span> Aastha is the top performer!</li>
                <li><span className="dot success"></span> New AI insights generated</li>
              </ul>
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout ↪
        </button>
      </div>
    </header>
  );
}

export default Navbar;
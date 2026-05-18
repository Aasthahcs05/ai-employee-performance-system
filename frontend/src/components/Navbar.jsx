import { useNavigate } from "react-router-dom";

function Navbar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();

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
          <button className="primary-btn mini" onClick={() => setActiveSection("analytics")}>
            ✦ Generate New Insights
          </button>
        )}

        <button className="icon-btn">🔔</button>
        <button className="logout-btn" onClick={logout}>
          Logout ↪
        </button>
      </div>
    </header>
  );
}

export default Navbar;
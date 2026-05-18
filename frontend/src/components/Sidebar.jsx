function Sidebar({ activeSection, setActiveSection }) {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin User" };

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>InsightHR</h2>
        <p>Performance Analytics</p>
      </div>

      <nav className="side-nav">
        <button
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          ▦ Dashboard
        </button>

        <button
          className={activeSection === "employees" ? "active" : ""}
          onClick={() => setActiveSection("employees")}
        >
          👥 Employee Management
        </button>

        <button
          className={activeSection === "analytics" ? "active" : ""}
          onClick={() => setActiveSection("analytics")}
        >
          📊 AI Analytics
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button>⚙ Settings</button>
        <button>❔ Support</button>

        <div className="user-box">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div>
            <h4>{user.name}</h4>
            <p>System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
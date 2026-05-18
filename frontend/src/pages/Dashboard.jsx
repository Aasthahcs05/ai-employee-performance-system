import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import SearchFilter from "../components/SearchFilter";
import AnalyticsRanking from "../components/AnalyticsRanking";
import AIRecommendation from "../components/AIRecommendation";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/api/employees");
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.log(error.response?.data?.message || "Error fetching employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalEmployees = employees.length;
  const averageScore =
    totalEmployees === 0
      ? 0
      : (
          employees.reduce((sum, emp) => sum + emp.performanceScore, 0) /
          totalEmployees
        ).toFixed(1);

  const highPerformers = employees.filter((emp) => emp.performanceScore >= 85).length;

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="main-content">
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {activeSection === "dashboard" && (
          <section className="section-area">
            <div className="page-heading">
              <h1>Welcome back, Admin</h1>
              <p>Here&apos;s what&apos;s happening with your team today.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <p>Total Employees</p>
                <h2>{totalEmployees}</h2>
                <span>+4%</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">📈</div>
                <p>Average Score</p>
                <h2>{averageScore}/100</h2>
                <span>+1.2%</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">🏅</div>
                <p>High Performers</p>
                <h2>{highPerformers}</h2>
                <span>Top 15%</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">📝</div>
                <p>Pending Reviews</p>
                <h2>{Math.max(totalEmployees - highPerformers, 0)}</h2>
                <span className="urgent">Urgent</span>
              </div>
            </div>

            <div className="dashboard-grid">
              <AnalyticsRanking employees={employees} compact={true} />

              <div className="right-column">
                <div className="mini-card">
                  <h3>Trending Employees</h3>

                  {employees
                    .slice()
                    .sort((a, b) => b.performanceScore - a.performanceScore)
                    .slice(0, 3)
                    .map((emp) => (
                      <div className="trend-row" key={emp._id}>
                        <div className="avatar">{emp.name.charAt(0)}</div>
                        <div>
                          <h4>{emp.name}</h4>
                          <p>{emp.department}</p>
                        </div>
                        <strong>{emp.performanceScore}</strong>
                      </div>
                    ))}

                  <button
                    className="outline-btn full"
                    onClick={() => setActiveSection("analytics")}
                  >
                    View Ranking
                  </button>
                </div>

                <div className="purple-card">
                  <p>✦ AI Prediction</p>
                  <h2>Talent Insights Ready</h2>
                  <span>
                    AI can generate promotion, training, and performance
                    feedback based on employee records.
                  </span>
                  <button onClick={() => setActiveSection("analytics")}>
                    Analyze Now →
                  </button>
                </div>
              </div>
            </div>

            <div className="activity-card">
              <h2>Recent HR Activity</h2>
              <div className="activity-row">
                <span>🖼</span>
                <p>
                  Performance review completed for <b>top employees</b>.
                </p>
              </div>
              <div className="activity-row">
                <span>👤</span>
                <p>
                  New employee records added in the <b>directory</b>.
                </p>
              </div>
              <div className="activity-row">
                <span>⚠</span>
                <p>
                  Employees with low score need <b>training suggestions</b>.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "employees" && (
          <section className="section-area">
            <div className="employee-top">
              <div>
                <h1>Employee Directory</h1>
                <p>Manage employees, performance scores, skills, and departments.</p>
              </div>

              <button className="primary-btn small" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close Form" : "+ Add Employee"}
              </button>
            </div>

            <SearchFilter
              setEmployees={setEmployees}
              fetchEmployees={fetchEmployees}
            />

            {showForm && <EmployeeForm fetchEmployees={fetchEmployees} />}

            <EmployeeList
              employees={employees}
              fetchEmployees={fetchEmployees}
            />

            <div className="ai-note-card">
              <h2>AI Talent Insights</h2>
              <p>
                Based on performance scores and skills, AI can suggest promotions,
                training needs, and improvement feedback for employees.
              </p>
              <button onClick={() => setActiveSection("analytics")}>
                View AI Analytics
              </button>
            </div>
          </section>
        )}

        {activeSection === "analytics" && (
          <section className="section-area">
            <div className="employee-top">
              <div>
                <h1>AI Analytics</h1>
                <p>Performance trends, rankings, graphs, and AI recommendations.</p>
              </div>
            </div>

            <AnalyticsRanking employees={employees} />

            <AIRecommendation />
          </section>
        )}

        <button className="floating-btn" onClick={() => {
          setActiveSection("employees");
          setShowForm(true);
        }}>
          +
        </button>
      </main>
    </div>
  );
}

export default Dashboard;
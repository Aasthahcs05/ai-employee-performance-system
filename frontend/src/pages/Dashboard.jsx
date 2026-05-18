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
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hi! I am InsightHR Assistant. How can I help you today?' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await API.post('/api/ai/chat', { message: userMessage });
      setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name,Email,Department,Performance Score"];
    const rows = safeEmployees.map(emp => 
      `"${emp.name}","${emp.email}","${emp.department}","${emp.performanceScore}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const safeEmployees = employees.map((emp) => ({
    ...emp,
    name: emp?.name || "Employee",
    email: emp?.email || "No email",
    department: emp?.department || "Not Assigned",
    performanceScore: Number(emp?.performanceScore || 0),
    skills: Array.isArray(emp?.skills) ? emp.skills : [],
    experience: emp?.experience ?? 0
  }));

  const totalEmployees = safeEmployees.length;

  const averageScore =
    totalEmployees === 0
      ? 0
      : (
          safeEmployees.reduce((sum, emp) => sum + emp.performanceScore, 0) /
          totalEmployees
        ).toFixed(1);

  const highPerformers = safeEmployees.filter(
    (emp) => emp.performanceScore >= 85
  ).length;

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
              <AnalyticsRanking employees={safeEmployees} compact={true} />

              <div className="right-column">
                <div className="mini-card">
                  <h3>Trending Employees</h3>

                  {safeEmployees
                    .slice()
                    .sort((a, b) => b.performanceScore - a.performanceScore)
                    .slice(0, 3)
                    .map((emp) => (
                      <div className="trend-row" key={emp._id || emp.email}>
                        <div className="avatar">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
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

              <div style={{display: 'flex', gap: '10px'}}>
                <button className="outline-btn small" onClick={handleExportCSV}>
                  📥 Export CSV
                </button>
                <button className="primary-btn small" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Close Form" : "+ Add Employee"}
                </button>
              </div>
            </div>

            <SearchFilter
              employees={safeEmployees}
              setEmployees={setEmployees}
              fetchEmployees={fetchEmployees}
            />

            {showForm && <EmployeeForm fetchEmployees={fetchEmployees} />}

            <EmployeeList
              employees={safeEmployees}
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

            <AnalyticsRanking employees={safeEmployees} />

            <AIRecommendation />
          </section>
        )}

        <button className="floating-btn" onClick={() => {
          setActiveSection("employees");
          setShowForm(true);
        }}>
          +
        </button>

        {chatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h4>HR Assistant</h4>
              <button onClick={() => setChatOpen(false)}>×</button>
            </div>
            <div className="chatbot-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message bot">
                  <p>Thinking...</p>
                </div>
              )}
            </div>
            <form className="chatbot-input" onSubmit={handleSendMessage}>
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask me anything..." 
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading}>Send</button>
            </form>
          </div>
        )}
        {!chatOpen && (
          <button className="floating-chat-btn text-btn" onClick={() => setChatOpen(true)}>
            💬 Chat with AI HR
          </button>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AnalyticsRanking({ employees, compact = false }) {
  const totalEmployees = employees.length;

  const averageScore =
    totalEmployees === 0
      ? 0
      : (
          employees.reduce((sum, emp) => sum + emp.performanceScore, 0) /
          totalEmployees
        ).toFixed(1);

  const rankedEmployees = [...employees].sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  const topEmployee = rankedEmployees.length > 0 ? rankedEmployees[0] : null;

  const chartData = rankedEmployees.map((emp) => ({
    name: emp.name.split(" ")[0],
    score: emp.performanceScore
  }));

  return (
    <div className="content-card analytics-card">
      <div className="card-header">
        <div>
          <h2>{compact ? "Team Performance Trends" : "Employee Analytics & Rankings"}</h2>
          <p>Aggregate performance scores and ranking insights.</p>
        </div>
      </div>

      {!compact && (
        <div className="analytics-grid">
          <div className="analytics-box">
            <p>Total Employees</p>
            <h2>{totalEmployees}</h2>
          </div>

          <div className="analytics-box">
            <p>Average Score</p>
            <h2>{averageScore}</h2>
          </div>

          <div className="analytics-box">
            <p>Top Performer</p>
            <h2>{topEmployee ? topEmployee.name : "No Data"}</h2>
          </div>
        </div>
      )}

      <div className="chart-box">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={compact ? 260 : 320}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#075fc9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-text">No data available for graph</p>
        )}
      </div>

      {!compact && (
        <div className="ranking-table">
          <div className="card-header">
            <h2>Performance Rankings</h2>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>KPI Progress</th>
                  <th>AI Score</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rankedEmployees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>

                    <td>
                      <div className="employee-cell">
                        <div className="avatar">{emp.name.charAt(0)}</div>
                        <div>
                          <h4>{emp.name}</h4>
                          <p>{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>{emp.department}</td>

                    <td>
                      <div className="score-cell">
                        <div className="score-bar green">
                          <span style={{ width: `${emp.performanceScore}%` }}></span>
                        </div>
                        <strong>{emp.performanceScore}%</strong>
                      </div>
                    </td>

                    <td>
                      <span className="ai-score">
                        {(emp.performanceScore / 10).toFixed(1)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          emp.performanceScore >= 85
                            ? "status-good"
                            : emp.performanceScore >= 60
                            ? "status-mid"
                            : "status-low"
                        }
                      >
                        {emp.performanceScore >= 85
                          ? "Exceeding"
                          : emp.performanceScore >= 60
                          ? "On Track"
                          : "Needs Training"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rankedEmployees.length === 0 && <p className="empty-text">No employees found</p>}
        </div>
      )}
    </div>
  );
}

export default AnalyticsRanking;
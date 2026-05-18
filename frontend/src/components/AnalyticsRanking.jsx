import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AnalyticsRanking({ employees }) {
  const totalEmployees = employees.length;

  const averageScore =
    totalEmployees === 0
      ? 0
      : (
          employees.reduce((sum, emp) => sum + emp.performanceScore, 0) /
          totalEmployees
        ).toFixed(2);

  const rankedEmployees = [...employees].sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  const topEmployee = rankedEmployees.length > 0 ? rankedEmployees[0] : null;

  const chartData = rankedEmployees.map((emp) => ({
    name: emp.name,
    score: emp.performanceScore
  }));

  return (
    <div className="card">
      <h2>Employee Analytics & Rankings</h2>

      <div className="analytics-grid">
        <div className="analytics-box">
          <h3>Total Employees</h3>
          <p>{totalEmployees}</p>
        </div>

        <div className="analytics-box">
          <h3>Average Score</h3>
          <p>{averageScore}</p>
        </div>

        <div className="analytics-box">
          <h3>Top Performer</h3>
          <p>{topEmployee ? topEmployee.name : "No Data"}</p>
        </div>
      </div>

      <h3>Performance Score Graph</h3>

      <div className="chart-box">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for graph</p>
        )}
      </div>

      <h3>Performance Ranking</h3>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Performance Score</th>
            </tr>
          </thead>

          <tbody>
            {rankedEmployees.map((emp, index) => (
              <tr key={emp._id}>
                <td>#{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.performanceScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rankedEmployees.length === 0 && <p>No employees found</p>}
    </div>
  );
}

export default AnalyticsRanking;
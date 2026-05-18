import API from "../api";

function EmployeeList({ employees = [], fetchEmployees }) {
  const deleteEmployee = async (id) => {
    await API.delete(`/api/employees/${id}`);
    fetchEmployees();
  };

  const increaseScore = async (emp) => {
    await API.put(`/api/employees/${emp._id}`, {
      performanceScore: Math.min(Number(emp.performanceScore || 0) + 5, 100)
    });

    fetchEmployees();
  };

  const averageScore =
    employees.length === 0
      ? 0
      : (
          employees.reduce(
            (sum, emp) => sum + Number(emp.performanceScore || 0),
            0
          ) / employees.length
        ).toFixed(1);

  return (
    <div className="content-card">
      <div className="directory-stats">
        <div>
          <p>Total Staff</p>
          <h2>{employees.length}</h2>
        </div>

        <div>
          <p>Active Roles</p>
          <h2>{new Set(employees.map((emp) => emp.department || "Unknown")).size}</h2>
        </div>

        <div>
          <p>Avg Performance</p>
          <h2>{averageScore}</h2>
        </div>

        <div className="risk-box">
          <p>AI Retention Risk</p>
          <h2>Low</h2>
        </div>
      </div>

      <div className="table-card">
        <div className="card-header">
          <div>
            <h2>Personnel Record</h2>
            <p>Employee CRUD operations with performance score management.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Score</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => {
                const name = emp?.name || "Employee";
                const email = emp?.email || "No email";
                const department = emp?.department || "Not Assigned";
                const score = Number(emp?.performanceScore || 0);
                const skills = Array.isArray(emp?.skills) ? emp.skills : [];
                const experience = emp?.experience ?? 0;

                return (
                  <tr key={emp?._id || email}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">{name.charAt(0).toUpperCase()}</div>
                        <div>
                          <h4>{name}</h4>
                          <p>{email}</p>
                        </div>
                      </div>
                    </td>

                    <td>{department}</td>

                    <td>
                      <div className="score-cell">
                        <div className="score-bar">
                          <span style={{ width: `${score}%` }}></span>
                        </div>
                        <strong>{score}</strong>
                      </div>
                    </td>

                    <td>{skills.length > 0 ? skills.join(", ") : "No skills"}</td>
                    <td>{experience} years</td>

                    <td>
                      <button className="text-btn" onClick={() => increaseScore(emp)}>
                        + Score
                      </button>
                      <button className="delete-btn" onClick={() => deleteEmployee(emp._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && <p className="empty-text">No employees found</p>}
      </div>
    </div>
  );
}

export default EmployeeList;
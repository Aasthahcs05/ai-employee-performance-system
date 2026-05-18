import API from "../api";

function EmployeeList({ employees, fetchEmployees }) {
  const deleteEmployee = async (id) => {
    await API.delete(`/api/employees/${id}`);
    fetchEmployees();
  };

  const increaseScore = async (emp) => {
    await API.put(`/api/employees/${emp._id}`, {
      performanceScore: Math.min(emp.performanceScore + 5, 100)
    });

    fetchEmployees();
  };

  const averageScore =
    employees.length === 0
      ? 0
      : (
          employees.reduce((sum, emp) => sum + emp.performanceScore, 0) /
          employees.length
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
          <h2>{new Set(employees.map((emp) => emp.department)).size}</h2>
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
              {employees.map((emp) => (
                <tr key={emp._id}>
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
                      <div className="score-bar">
                        <span style={{ width: `${emp.performanceScore}%` }}></span>
                      </div>
                      <strong>{emp.performanceScore}</strong>
                    </div>
                  </td>

                  <td>{emp.skills.join(", ")}</td>
                  <td>{emp.experience} years</td>

                  <td>
                    <button className="text-btn" onClick={() => increaseScore(emp)}>
                      + Score
                    </button>
                    <button className="delete-btn" onClick={() => deleteEmployee(emp._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && <p className="empty-text">No employees found</p>}
      </div>
    </div>
  );
}

export default EmployeeList;
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

  return (
    <div className="card">
      <h2>Employee List Page</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Experience</th>
              <th>Ranking Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.skills.join(", ")}</td>
                <td>{emp.performanceScore}</td>
                <td>{emp.experience} years</td>
                <td>
                  <button onClick={() => increaseScore(emp)}>+ Score</button>
                  <button className="danger" onClick={() => deleteEmployee(emp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && <p>No employees found</p>}
    </div>
  );
}

export default EmployeeList;
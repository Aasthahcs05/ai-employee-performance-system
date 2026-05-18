import { useState } from "react";
import API from "../api";

function SearchFilter({ employees, setEmployees, fetchEmployees }) {
  const [department, setDepartment] = useState("");

  const searchEmployees = async () => {
    if (!department.trim()) {
      fetchEmployees();
      return;
    }

    const res = await API.get(`/api/employees/search?department=${department}`);
    setEmployees(res.data.employees);
  };

  const sortEmployees = (type) => {
    if (!employees || employees.length === 0) return;
    let sorted = [...employees];
    if (type === "score-high") sorted.sort((a,b) => b.performanceScore - a.performanceScore);
    if (type === "score-low") sorted.sort((a,b) => a.performanceScore - b.performanceScore);
    setEmployees(sorted);
  };

  return (
    <div className="search-panel">
      <div className="big-search">
        🔍
        <input
          placeholder="Search by department..."
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>

      <button className="outline-btn" onClick={searchEmployees}>
        Filters
      </button>

      <select onChange={(e) => sortEmployees(e.target.value)} className="outline-btn" style={{padding: "8px 16px", marginLeft: "10px"}}>
        <option value="">Sort By</option>
        <option value="score-high">Highest Score</option>
        <option value="score-low">Lowest Score</option>
      </select>

      <button className="primary-btn small" onClick={fetchEmployees} style={{marginLeft: "10px"}}>
        Reset
      </button>
    </div>
  );
}

export default SearchFilter;
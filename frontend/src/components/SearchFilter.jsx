import { useState } from "react";
import API from "../api";

function SearchFilter({ setEmployees, fetchEmployees }) {
  const [department, setDepartment] = useState("");

  const searchEmployees = async () => {
    if (!department.trim()) {
      fetchEmployees();
      return;
    }

    const res = await API.get(`/api/employees/search?department=${department}`);
    setEmployees(res.data.employees);
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

      <button className="primary-btn small" onClick={fetchEmployees}>
        Reset
      </button>
    </div>
  );
}

export default SearchFilter;
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
    <div className="card">
      <h2>Search & Filter Section</h2>

      <div className="search-box">
        <input
          placeholder="Search by department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <button onClick={searchEmployees}>Search</button>
        <button onClick={fetchEmployees}>Reset</button>
      </div>
    </div>
  );
}

export default SearchFilter;
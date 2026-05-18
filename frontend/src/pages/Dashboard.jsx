import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import SearchFilter from "../components/SearchFilter";
import AIRecommendation from "../components/AIRecommendation";

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await API.get("/api/employees");
    setEmployees(res.data.employees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>AI-Based Employee Performance Analytics</h1>

        <EmployeeForm fetchEmployees={fetchEmployees} />

        <SearchFilter setEmployees={setEmployees} fetchEmployees={fetchEmployees} />

        <EmployeeList employees={employees} fetchEmployees={fetchEmployees} />

        <AIRecommendation />
      </div>
    </>
  );
}

export default Dashboard;
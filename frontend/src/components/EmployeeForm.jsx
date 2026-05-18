import { useState } from "react";
import API from "../api";

function EmployeeForm({ fetchEmployees }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((skill) => skill.trim()),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      };

      await API.post("/api/employees", payload);

      setMessage("Employee added successfully");

      setForm({
        name: "",
        email: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: ""
      });

      fetchEmployees();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <div>
          <h2>Add New Employee</h2>
          <p>Register employee details, skills, score, and experience.</p>
        </div>
      </div>

      {message && <p className="success-box">{message}</p>}

      <form className="employee-form" onSubmit={addEmployee}>
        <div>
          <label>Employee Name</label>
          <input
            name="name"
            value={form.name}
            placeholder="Alex Morgan"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            type="email"
            placeholder="alex@company.com"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Department</label>
          <input
            name="department"
            value={form.department}
            placeholder="Development"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Skills</label>
          <input
            name="skills"
            value={form.skills}
            placeholder="React, Node.js, MongoDB"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Performance Score</label>
          <input
            name="performanceScore"
            value={form.performanceScore}
            type="number"
            min="0"
            max="100"
            placeholder="85"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Years of Experience</label>
          <input
            name="experience"
            value={form.experience}
            type="number"
            min="0"
            placeholder="3"
            onChange={handleChange}
            required
          />
        </div>

        <button className="primary-btn" type="submit">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
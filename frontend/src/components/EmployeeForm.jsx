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
    <div className="card">
      <h2>Employee Registration Form</h2>

      {message && <p className="message">{message}</p>}

      <form className="grid-form" onSubmit={addEmployee}>
        <input name="name" value={form.name} placeholder="Employee Name" onChange={handleChange} required />
        <input name="email" value={form.email} type="email" placeholder="Email" onChange={handleChange} required />
        <input name="department" value={form.department} placeholder="Department" onChange={handleChange} required />
        <input name="skills" value={form.skills} placeholder="Skills comma separated" onChange={handleChange} required />
        <input name="performanceScore" value={form.performanceScore} type="number" placeholder="Performance Score" onChange={handleChange} required />
        <input name="experience" value={form.experience} type="number" placeholder="Years of Experience" onChange={handleChange} required />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default EmployeeForm;